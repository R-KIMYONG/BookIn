import { toRailBook } from '@/shared/domain/rails/normalize';
import { createAdminClient } from '../supabase/admin';
import { RailBook } from '@/shared/domain/rails/types';

export const getRelatedBooks = async (
  anchorIsbn13?: string, // -> 이거는 디테일 페이지용
  anchorCategory?: string // ->이거는 카테고리 페이지용
): Promise<RailBook[]> => {
  const supabase = createAdminClient();
  if (!anchorIsbn13 && !anchorCategory) return [];
  const { data, error } = await supabase.rpc('match_book_similar', {
    p_isbn13: anchorIsbn13,
    p_category: anchorCategory,
    match_count: 20,
  });
  if (error) {
    console.error('anchor 유사 실패:', error);
    return [];
  }

  const uniqueBooks = (data ?? []).filter((book, index, arr) => arr.findIndex((x) => x.title === book.title) === index);
  return uniqueBooks.map(toRailBook);
};
