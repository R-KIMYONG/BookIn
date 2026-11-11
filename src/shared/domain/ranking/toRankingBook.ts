import { parseItemId } from '@/shared/domain/book/ids';
import { TopViewType } from '@/shared/domain/ranking/types';
import { Database } from '@/shared/types/supabase';

type BookRankingRow = Database['public']['Views']['book_ranking']['Row'];

// 뷰 컬럼은 타입상 전부 nullable. 식별자·제목이 없는 행은 버림
export const toRankingBook = (row: BookRankingRow): TopViewType | null => {
  const itemId = parseItemId(row.item_id);
  if (!itemId || !row.title) return null;

  return {
    item_id: itemId,
    title: row.title,
    author: row.author ?? '',
    thumbnail_url: row.thumbnail_url,
    view_count: row.view_count ?? 0,
    like_count: row.like_count ?? 0,
    comment_count: row.comment_count ?? 0,
    score: row.score ?? 0,
  };
};
