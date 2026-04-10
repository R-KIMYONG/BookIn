import { SupabaseClient } from '@supabase/supabase-js';
import { CommentListResult } from '@/types/commentList.type';
import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';

export const fetchComments = async (
  supabase: SupabaseClient,
  bookId: string,
  page: number
): Promise<CommentListResult> => {
  const from = (page - 1) * COMMENTS_PAGE_SIZE;
  const to = from + COMMENTS_PAGE_SIZE - 1;

  const [{ data, error }, { data: stats, error: statsError }] = await Promise.all([
    supabase
      .from('comments')
      .select('*, users(nickname)')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })
      .range(from, to),

    supabase.from('book_stats').select('comment_count').eq('book_id', bookId).maybeSingle(),
  ]);

  if (error) throw error;
  if (statsError) throw statsError;

  return {
    data: data ?? [],
    total: stats?.comment_count ?? 0,
  };
};
