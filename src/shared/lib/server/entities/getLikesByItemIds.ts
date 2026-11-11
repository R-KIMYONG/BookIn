import 'server-only';

import { ItemId } from '@/shared/domain/book/ids';
import { createClient } from '@/shared/lib/supabase/server';
import { getCurrentUser } from '../../auth/getCurrentUser';

// 로그인 사용자가 각 책에 좋아요를 눌렀는지 (비로그인이면 빈 객체)
export const getLikesByItemIds = async (itemIds: ItemId[]): Promise<Record<number, boolean>> => {
  if (itemIds.length === 0) return {};

  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) return {};

  const { data, error } = await supabase.from('likes').select('item_id').eq('user_id', user.id).in('item_id', itemIds);

  if (error) throw error;

  const map: Record<number, boolean> = {};
  for (const itemId of itemIds) map[itemId] = false;
  for (const row of data ?? []) map[row.item_id] = true;

  return map;
};
