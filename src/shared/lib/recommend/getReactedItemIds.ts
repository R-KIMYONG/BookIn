import 'server-only';
import { ItemId, parseItemId } from '@/shared/domain/book/ids';
import { createAdminClient } from '../supabase/admin';

// 유저가 좋아요·북마크·댓글로 반응한 책 전부 → 추천에서 제외할 목록
// (get_top_anchor는 상위 5권만 주므로 따로 모음. comments에는 item_id가 없어 books에서 꺼냄)
export const getReactedItemIds = async (userId: string): Promise<Set<ItemId>> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('get_reacted_item_ids', { p_user_id: userId });
  if (error) throw error;

  const result = new Set([...(data ?? []).flatMap((itemId) => parseItemId(itemId) ?? [])]);
  return result;
};
