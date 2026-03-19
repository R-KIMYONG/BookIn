import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';

import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  let body: Tables<'comments'> & { book_title: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '요청 데이터를 읽을 수 없습니다.' }, { status: 400 });
  }
  const { title, content, post_id, writer, user_id, updated_at, cover, book_title } = body;

  if (!user_id || !post_id)
    return NextResponse.json({ message: '댓글 작성에 필요한 정보가 누락되었습니다.' }, { status: 400 });

  const { error: commentInsertError } = await supabase
    .from('comments')
    .insert({ title, content, post_id, writer, user_id, updated_at, cover });

  if (commentInsertError) {
    console.log(commentInsertError);
    return NextResponse.json({ message: '댓글 작성중 오류가 발생했습니다.' }, { status: 500 });
  }

  const { data: existing, error: existingError } = await supabase
    .from('comment_books')
    .select('comment_count')
    .eq('user_id', user_id)
    .eq('post_id', post_id)
    .maybeSingle();

  if (existingError) {
    console.error(existingError);
    return NextResponse.json({ message: '댓글 정보를 처리하는 중 오류가 발생했습니다.' }, { status: 500 });
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
      return NextResponse.json({ message: '댓글 정보를 갱신하는 중 오류가 발생했습니다.' }, { status: 500 });
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
      return NextResponse.json({ message: '댓글 정보를 저장하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
  }
  return NextResponse.json({ message: '댓글이 등록되었습니다.' }, { status: 201 });
};
export const PUT = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const updateComment = await request.json();
    const { id, book_title, ...commentFields } = updateComment;

    if (!id) return NextResponse.json({ message: '수정할 댓글 정보를 찾을 수 없습니다.' }, { status: 400 });

    if (!commentFields.user_id || !commentFields.post_id)
      return NextResponse.json({ error: '댓글 수정에 필요한 정보가 누락되었습니다.' }, { status: 400 });

    const { error: commentUpdateError } = await supabase.from('comments').update(commentFields).eq('id', id);

    if (commentUpdateError) {
      console.error(commentUpdateError);
      return NextResponse.json({ message: '댓글 수정 중 오류가 발생했습니다.' }, { status: 500 });
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
      console.error(bookError);

      return NextResponse.json({ message: '댓글 도서 정보를 갱신하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
    return NextResponse.json({ message: '댓글이 수정되었습니다.' }, { status: 200 });
  } catch (error) {
    if (error) {
      console.error(error);
      return NextResponse.json({ message: '댓글 수정 중 예기치 않은 오류가 발생했습니다.' }, { status: 500 });
    }
  }
};
export const DELETE = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: '삭제할 댓글 정보를 찾을 수 없습니다.' }, { status: 400 });

    const { data: targetComment, error: targetError } = await supabase
      .from('comments')
      .select('user_id, post_id')
      .eq('id', id)
      .single();

    if (targetError || !targetComment?.user_id || !targetComment?.post_id) {
      console.error(targetError);
      return NextResponse.json({ message: '삭제할 댓글을 찾을 수 없습니다.' }, { status: 404 });
    }

    const { error: deleteCommentError } = await supabase.from('comments').delete().eq('id', id);

    if (deleteCommentError) {
      console.error(deleteCommentError);

      return NextResponse.json({ message: '댓글 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }

    const { data: bookRow, error: bookRowError } = await supabase
      .from('comment_books')
      .select('comment_count')
      .eq('user_id', targetComment.user_id)
      .eq('post_id', targetComment.post_id)
      .single();

    if (bookRowError) {
      console.error(bookRowError);

      return NextResponse.json({ message: '댓글 도서 정보를 조회하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
    const count = bookRow.comment_count ?? 0;
    if (count <= 1) {
      const { error: deleteBookError } = await supabase
        .from('comment_books')
        .delete()
        .eq('user_id', targetComment.user_id)
        .eq('post_id', targetComment.post_id);

      if (deleteBookError) {
        console.error(deleteBookError);

        return NextResponse.json({ message: '댓글 도서 정보를 삭제하는 중 오류가 발생했습니다.' }, { status: 500 });
      }
    } else {
      const { error: updateBookError } = await supabase
        .from('comment_books')
        .update({ comment_count: count - 1 })
        .eq('user_id', targetComment.user_id)
        .eq('post_id', targetComment.post_id);

      if (updateBookError) {
        console.error(updateBookError);

        return NextResponse.json({ message: '댓글 개수를 갱신하는 중 오류가 발생했습니다.' }, { status: 500 });
      }
    }
    return NextResponse.json({ message: '댓글이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '댓글 삭제 중 예기치 않은 오류가 발생했습니다.' }, { status: 500 });
  }
};
