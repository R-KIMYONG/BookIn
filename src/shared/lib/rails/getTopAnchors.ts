import { TopanchorType } from '@/shared/domain/rails/types';
import { createAdminClient } from '../supabase/admin';

export const getTopAnchors = async (userId: string): Promise<TopanchorType[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('get_top_anchor', { p_user_id: userId });
  if (error) console.error('anchor 선정 실패:', error);
  return data ?? [];
};
