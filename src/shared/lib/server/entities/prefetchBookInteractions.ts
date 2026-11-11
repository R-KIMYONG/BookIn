import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { QueryClient } from '@tanstack/react-query';
import { getBookStatsByItemIds } from './getBookStatsByItemIds';
import { getLikesByItemIds } from './getLikesByItemIds';
import { getBookmarksByItemIds } from './getBookmarksByItemIds';
import { myStatusKeys, statsKeys } from '@/shared/domain/book/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { LikeCache } from '@/shared/domain/like/types';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { getCurrentUser } from '../../auth/getCurrentUser';
import { MyStatus } from '@/shared/domain/book/types';
import { BookmarkCache } from '@/shared/domain/bookmark/types';

export const prefetchBookInteractions = async (queryClient: QueryClient, itemIds: ItemId[]): Promise<void> => {
  if (itemIds.length === 0) return;

  const results = await Promise.allSettled([
    getBookStatsByItemIds(itemIds),
    getLikesByItemIds(itemIds),
    getBookmarksByItemIds(itemIds),
  ]);

  const [statsResult, likesResult, bookmarksResult] = results;

  if (statsResult.status === 'fulfilled') {
    const bookStats = statsResult.value;
    queryClient.setQueryData(statsKeys.batch(itemIds), bookStats);
  } else {
    console.error('통계 데이터 조회 실패', statsResult.reason);
  }

  if (likesResult.status === 'rejected') console.error('좋아요 조회 실패', likesResult.reason);

  if (likesResult.status === 'fulfilled' && statsResult.status === 'fulfilled') {
    const likes = likesResult.value;
    for (const itemId of itemIds) {
      queryClient.setQueryData<LikeCache>(likeKeys.detail(itemId), {
        itemId,
        liked: likes[itemId] ?? false,
        liked_count: statsResult.value[itemId]?.like_count ?? 0,
      });
    }
  }

  if (bookmarksResult.status === 'rejected') console.error('북마크 조회 실패', bookmarksResult.reason);

  if (bookmarksResult.status === 'fulfilled') {
    const bookmarks = bookmarksResult.value;
    for (const itemId of itemIds) {
      queryClient.setQueryData<BookmarkCache>(bookmarkKeys.detail(itemId), {
        itemId,
        bookmarked: bookmarks[itemId]?.bookmarked ?? false,
        memoExists: bookmarks[itemId]?.memoExists ?? false,
      });
    }
  }
  if (likesResult.status === 'fulfilled' && bookmarksResult.status === 'fulfilled') {
    const user = await getCurrentUser();
    if (user) {
      queryClient.setQueryData<MyStatus[]>(
        myStatusKeys.batch(itemIds),
        itemIds.map((itemId) => ({
          itemId,
          liked: likesResult.value[itemId] ?? false,
          bookmarked: bookmarksResult.value[itemId]?.bookmarked ?? false,
          memoExists: bookmarksResult.value[itemId]?.memoExists ?? false,
        }))
      );
    }
  }
};
