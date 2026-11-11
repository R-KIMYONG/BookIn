import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { createClient } from '@/shared/lib/supabase/server';

export type BookStatsRow = { view_count: number; comment_count: number; like_count: number };

// 각 책의 조회·댓글·좋아요 수 (book_stats, 없거나 실패하면 0)
export const getBookStatsByItemIds = async (itemIds: ItemId[]): Promise<Record<number, BookStatsRow>> => {
  if (itemIds.length === 0) return {};
  const supabase = await createClient();

  const map: Record<number, BookStatsRow> = {};
  for (const itemId of itemIds) map[itemId] = { view_count: 0, comment_count: 0, like_count: 0 };

  try {
    const { data } = await supabase
      .from('book_stats')
      .select('item_id, view_count, comment_count, like_count')
      .in('item_id', itemIds);

    for (const row of data ?? []) {
      map[row.item_id] = {
        view_count: row.view_count ?? 0,
        comment_count: row.comment_count ?? 0,
        like_count: row.like_count ?? 0,
      };
    }
  } catch (error) {
    console.error('book_stats 조회 실패:', error);
  }
  return map;
};
