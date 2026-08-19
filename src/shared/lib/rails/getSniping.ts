import { RailBook } from '@/shared/domain/rails/types';
import { createAdminClient } from '../supabase/admin';
import { toRailBook } from '@/shared/domain/rails/normalize';

export const getSniping = async (userId: string): Promise<RailBook[]> => {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc('match_book_for_user', {
    p_user_id: userId,
    match_count: 100,
  });
  if (error) {
    console.error('sniping 실패:', error);
    return [];
  }
  return (data ?? []).map(toRailBook);
};
