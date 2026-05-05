import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BookmarkCache } from './useBookmark';

const STALE = 1000 * 60 * 3;
export const useFetchBookmark = (isbnList: string[]) => {
  const queryClient = useQueryClient();
  const stableKey = ['bookmarkFetch', [...isbnList].sort().join(',')]; //isbn 순서 다르면 다른 키로 인식방지위해 정렬해서 서버로 넘김
  const { data } = useQuery<BookmarkCache[]>({
    queryKey: stableKey,
    queryFn: async () => {
      const ids = isbnList.join(',');
      const res = await fetch(`/api/bookmark?bookIds=${ids}`);
      if (!res.ok) throw new Error('bookmark fetch 실패');
      const data = await res.json();
      return data;
    },
    enabled: isbnList.length > 0,
    staleTime: STALE,
  });
  useEffect(() => {
    if (!data) return;

    data.forEach((server) => {
      queryClient.setQueryData(['bookmark', server.isbn13], (old: BookmarkCache) => {
        if (!old) return server;

        if (old.bookmarked !== server.bookmarked) {
          return old;
        }

        return server;
      });
    });
  }, [data, queryClient]);

  return data;
};
