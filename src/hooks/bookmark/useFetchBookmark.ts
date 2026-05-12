import { MINUTE } from '@/shared/constants/time';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { BookmarkCache } from '@/shared/domain/bookmark/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchBookmark = (isbnList: string[]) => {
  const queryClient = useQueryClient();

  return useQuery<BookmarkCache[]>({
    queryKey: bookmarkKeys.batch(isbnList),
    queryFn: async () => {
      const ids = isbnList.join(',');
      const res = await fetch(`/api/bookmark?bookIds=${ids}`);
      if (!res.ok) throw new Error('bookmark fetch 실패');
      const data = await res.json();

      data.forEach((server: BookmarkCache) => {
        queryClient.setQueryData(bookmarkKeys.detail(server.isbn13), (old: BookmarkCache) => {
          if (!old) return server;

          if (old.bookmarked !== server.bookmarked) {
            return old;
          }

          return {
            ...old,
            ...server,
          };
        });
      });
      return data;
    },
    enabled: isbnList.length > 0,
    staleTime: 3 * MINUTE,
  });
};
