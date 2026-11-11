import { useQuery } from '@tanstack/react-query';
import { ItemId } from '@/shared/domain/book/ids';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { BookmarkCache } from '@/shared/domain/bookmark/types';

export const useBookmarkCache = (itemId: ItemId) => {
  return useQuery<BookmarkCache>({
    queryKey: bookmarkKeys.detail(itemId),
    queryFn: async () => ({ itemId, bookmarked: false, memoExists: false }),
    enabled: false,
  });
};
