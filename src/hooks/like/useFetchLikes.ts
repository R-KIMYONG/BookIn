import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type ResponseType = {
  isbn13: string;
  liked_count: number;
  liked: boolean;
};
const STALE = 1000 * 60 * 3;
export const useFetchLikes = (isbnList: string[]) => {
  const queryClient = useQueryClient();
  const stableKey = ['likedFetch', [...isbnList].sort().join(',')]; //isbn 순서 다르면 다른 키로 인식방지위해 정렬해서 서버로 넘김
  const { data } = useQuery<ResponseType[]>({
    queryKey: stableKey,
    queryFn: async () => {
      const ids = isbnList.join(',');
      const res = await fetch(`/api/like?bookIds=${ids}`);
      if (!res.ok) throw new Error('like fetch 실패');
      const data = await res.json();
      return data;
    },
    enabled: isbnList.length > 0,
    staleTime: STALE,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: (query) => {
      const last = query.state.dataUpdatedAt;
      if (!last) return 60_000;
      const age = Date.now() - last;
      return age >= STALE ? 60_000 : false;
    },
  });
  useEffect(() => {
    if (!data) return;

    data.forEach((server) => {
      queryClient.setQueryData(['like', server.isbn13], (old: ResponseType | undefined) => {
        if (!old) return server;
        if (old.liked !== server.liked) return old;

        const nextCount = old.liked
          ? Math.max(old.liked_count, server.liked_count) // liked=true면 서버가 더 크면 따라감
          : Math.min(old.liked_count, server.liked_count); // liked=false면 서버가 더 작으면 따라감

        return {
          ...old,
          liked_count: nextCount,
        };
      });
    });
  }, [data, queryClient]);

  return data;
};
