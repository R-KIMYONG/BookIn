import { MINUTE } from '@/shared/constants/time';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { LikeCache } from '@/shared/domain/like/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchLikeCount = (isbnList: string[]) => {
  const queryClient = useQueryClient();
  return useQuery<{ isbn13: string; liked_count: number }[]>({
    queryKey: likeKeys.countBatch(isbnList),

    queryFn: async () => {
      const ids = isbnList.join(',');
      const res = await fetch(`/api/like/count?bookIds=${ids}`);
      if (!res.ok) throw new Error('count fetch 실패');

      const data = await res.json();

      data.forEach((server: LikeCache) => {
        queryClient.setQueryData(likeKeys.detail(server.isbn13), (old: LikeCache | undefined) => {
          return {
            isbn13: server.isbn13,
            liked: old?.liked ?? false,
            liked_count: server.liked_count,
          };
        });
      });
      return data;
    },

    enabled: isbnList.length > 0,
    staleTime: 3 * MINUTE,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: (query) => {
      const last = query.state.dataUpdatedAt;
      if (!last) return 60_000;
      const age = Date.now() - last;
      return age >= 3 * MINUTE ? 60_000 : false;
    },
  });
};
