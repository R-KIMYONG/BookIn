import 'server-only';

import { ItemId } from '@/shared/domain/book/ids';
import { createClient } from '@/shared/lib/supabase/server';
import { BookmarkInfo } from '@/shared/domain/bookmark/types';
import { getCurrentUser } from '../../auth/getCurrentUser';

// 로그인 사용자의 각 책 북마크·메모 여부 (비로그인이면 빈 객체)
export const getBookmarksByItemIds = async (itemIds: ItemId[]): Promise<Record<number, BookmarkInfo>> => {
  if (itemIds.length === 0) return {};

  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) return {};

  const { data, error } = await supabase
    .from('bookmarks')
    .select('item_id,memo')
    .eq('user_id', user.id)
    .in('item_id', itemIds);

  if (error) throw error;

  const map: Record<number, BookmarkInfo> = {};
  for (const itemId of itemIds) map[itemId] = { bookmarked: false, memoExists: false };
  for (const row of data ?? []) map[row.item_id] = { bookmarked: true, memoExists: !!row.memo };

  return map;
};
