import { sanitizeHtmlServer } from '@/app/lib/security/sanitizeHtml.server';
import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';

import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  const now = new Date().toISOString();
  let body: Tables<'comments'>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '요청 데이터를 읽을 수 없습니다.' }, { status: 400 });
  }
  const { content, post_id, writer, user_id, cover, book_title } = body;
  const cleanContent = sanitizeHtmlServer(content || '');

  if (!user_id || !post_id)
    return NextResponse.json({ message: '댓글 작성에 필요한 정보가 누락되었습니다.' }, { status: 400 });

  const { error: commentInsertError } = await supabase
    .from('comments')
    .insert({ content: cleanContent, post_id, writer, user_id, updated_at: now, cover, book_title });

  if (commentInsertError) {
    console.log(commentInsertError);
    return NextResponse.json({ message: '댓글 작성중 오류가 발생했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ message: '댓글이 등록되었습니다.' }, { status: 201 });
};
export const PUT = async (request: NextRequest) => {
  const supabase = await createClient();
  const now = new Date().toISOString();
  try {
    const updateComment = await request.json();
    const { id, book_title, ...commentFields } = updateComment;
    const cleanContent = sanitizeHtmlServer(commentFields.content || '');
    if (!id) return NextResponse.json({ message: '수정할 댓글 정보를 찾을 수 없습니다.' }, { status: 400 });

    if (!commentFields.user_id || !commentFields.post_id)
      return NextResponse.json({ error: '댓글 수정에 필요한 정보가 누락되었습니다.' }, { status: 400 });

    const { error: commentUpdateError } = await supabase
      .from('comments')
      .update({ ...commentFields, updated_at: now, book_title, content: cleanContent })
      .eq('id', id);

    if (commentUpdateError) {
      console.error(commentUpdateError);
      return NextResponse.json({ message: '댓글 수정 중 오류가 발생했습니다.' }, { status: 500 });
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
  const supabase = await createClient();
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

    return NextResponse.json({ message: '댓글이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '댓글 삭제 중 예기치 않은 오류가 발생했습니다.' }, { status: 500 });
  }
};
