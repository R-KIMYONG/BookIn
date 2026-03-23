import { createClient } from '@/utils/supabase/server';
import { CommentListResult } from '@/types/commentList.type';

export const getCommentsServer = async ({
  postId,
  page,
  pageSize = 10,
}: {
  postId: string;
  page: number;
  pageSize?: number;
}): Promise<CommentListResult> => {
  const supabase = createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message ?? '댓글 조회 실패');
  }

  return {
    data: data ?? [],
    total: count ?? 0,
  };
};
