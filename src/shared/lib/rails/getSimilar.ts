import { toRailBook } from '@/shared/domain/rails/normalize';
import { RailBook } from '@/shared/domain/rails/types';
import { createAdminClient } from '../supabase/admin';

export const getSimilar = async (userId: string, anchorIsbn13: string): Promise<RailBook[]> => {
  const supabase = createAdminClient();
  if (!anchorIsbn13) return [];
  const { data, error } = await supabase.rpc('match_book_for_user', {
    p_user_id: userId,
    p_anchor_isbn13: anchorIsbn13,
    match_count: 100,
  });
  if (error) {
    console.error('anchor 유사 실패:', error);
    return [];
  }
  return (data ?? []).map(toRailBook);
};
