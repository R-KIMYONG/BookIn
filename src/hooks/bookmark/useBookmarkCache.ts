import { useQuery } from '@tanstack/react-query';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { BookmarkCache } from '@/shared/domain/bookmark/types';

export const useBookmarkCache = (isbn13: string) => {
  return useQuery<BookmarkCache>({
    queryKey: bookmarkKeys.detail(isbn13),
    queryFn: async () => ({ isbn13, bookmarked: false, memoExists: false }),
    enabled: false,
  });
};
