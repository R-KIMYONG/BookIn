import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';

import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const response = await request.json();
  const {
    title,
    content,
    post_id,
    writer,
    user_id,
    updated_at,
    cover,
    book_title,
  }: Tables<'comments'> & { book_title: string } = response;

  if (!user_id || !post_id) {
    return NextResponse.json({ message: 'user_id 또는 post_id가 없습니다.' }, { status: 400 });
  }

  const { error } = await supabase
    .from('comments')
    .insert({ title, content, post_id, writer, user_id, updated_at, cover });

  if (error) {
    console.error(error);
    return NextResponse.json({ status: '에러', message: error.message });
  }

  const { data: existing, error: existingError } = await supabase
    .from('comment_books')
    .select('comment_count')
    .eq('user_id', user_id)
    .eq('post_id', post_id)
    .maybeSingle();

  if (existingError) {
    console.error(existingError);
    return NextResponse.json({ message: existingError.message }, { status: 500 });
  }
  if (existing) {
    const { error: updateBookError } = await supabase
      .from('comment_books')
      .update({
        comment_count: (existing.comment_count ?? 0) + 1,
        last_commented_at: updated_at,
      })
      .eq('user_id', user_id)
      .eq('post_id', post_id);

    if (updateBookError) {
      console.error(updateBookError);
      return NextResponse.json({ message: updateBookError }, { status: 500 });
    }
  } else {
    const { error: insertBookError } = await supabase.from('comment_books').insert({
      user_id,
      post_id,
      book_title,
      book_cover: cover,
      comment_count: 1,
      last_commented_at: updated_at,
    });

    if (insertBookError) {
      console.error(insertBookError);
      return NextResponse.json({ message: insertBookError.message }, { status: 500 });
    }
  }
  return NextResponse.json({ status: '200' });
};
export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get('post_id');
    const rawPage = url.searchParams.get('page');
    const page = Number(rawPage ?? 1);
    const pageSize = 10; //한페이지에 볼 댓글 수량

    if (!postId) {
      return NextResponse.json({ message: 'post_id 가 필요합니다' }, { status: 400 });
    }
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .eq('post_id', postId)
      .range(from, to);

    if (error) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ data, total: count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '예기치 않은 오류가 발생했습니다' }, { status: 500 });
  }
};
export const PUT = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const updateComment = await request.json();
    const { id, book_title, ...commentFields } = updateComment;

    if (!id) {
      return NextResponse.json({ error: 'id가 올바르지 않습니다' }, { status: 400 });
    }

    if (!commentFields.user_id || !commentFields.post_id) {
      return NextResponse.json({ error: 'user_id 또는 post_id가 없습니다.' }, { status: 400 });
    }

    const { error } = await supabase.from('comments').update(commentFields).eq('id', id);

    if (error) {
      throw error;
    }
    const { error: bookError } = await supabase
      .from('comment_books')
      .update({
        last_commented_at: commentFields.updated_at,
        book_cover: commentFields.cover,
        book_title,
      })
      .eq('user_id', commentFields.user_id)
      .eq('post_id', commentFields.post_id);

    if (bookError) {
      throw bookError;
    }
    return NextResponse.json({ message: '댓글 업데이트 완료' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '댓글 업데이트 중 오류 발생' }, { status: 500 });
  }
};
export const DELETE = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id가 올바르지 않습니다' }, { status: 400 });
    }

    const { data: targetComment, error: targetError } = await supabase
      .from('comments')
      .select('user_id, post_id')
      .eq('id', id)
      .single();

    if (targetError || !targetComment?.user_id || !targetComment?.post_id) {
      return NextResponse.json({ error: '삭제 대상 댓글을 찾을 수 없습니다.' }, { status: 404 });
    }

    const { error } = await supabase.from('comments').delete().eq('id', id);

    if (error) {
      throw error;
    }

    const { data: bookRow, error: bookRowError } = await supabase
      .from('comment_books')
      .select('comment_count')
      .eq('user_id', targetComment.user_id)
      .eq('post_id', targetComment.post_id)
      .single();

    if (bookRowError) {
      throw bookRowError;
    }
    const count = bookRow.comment_count ?? 0;
    if (count <= 1) {
      const { error: deleteBookError } = await supabase
        .from('comment_books')
        .delete()
        .eq('user_id', targetComment.user_id)
        .eq('post_id', targetComment.post_id);

      if (deleteBookError) {
        throw deleteBookError;
      }
    } else {
      const { error: updateBookError } = await supabase
        .from('comment_books')
        .update({ comment_count: count - 1 })
        .eq('user_id', targetComment.user_id)
        .eq('post_id', targetComment.post_id);

      if (updateBookError) {
        throw updateBookError;
      }
    }
    return NextResponse.json({ message: '댓글 삭제 완료' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
};
