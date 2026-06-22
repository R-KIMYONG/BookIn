import { MINUTE } from '@/shared/constants/time';
import { statsKeys } from '@/shared/domain/book/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type StatsRow = { view_count: number; comment_count: number; like_count: number };

export const useBookStats = (isbnList: string[]) => {
  const queryClient = useQueryClient();
  return useQuery<Record<string, StatsRow>>({
    queryKey: statsKeys.batch(isbnList),
    queryFn: async () => {
      const response = await fetch(`/api/book-stats?ids=${isbnList.join(',')}`);

      if (!response.ok) throw new Error('stats fetch 실패');

      const map: Record<string, StatsRow> = await response.json();
      Object.entries(map).forEach(([isbn13, s]) => {
        queryClient.setQueryData(likeKeys.detail(isbn13), (old: any) => {
          if (!old) return { isbn13, liked: false, liked_count: s.like_count };
          const nextCount = old.liked
            ? Math.max(old.liked_count, s.like_count)
            : Math.min(old.liked_count, s.like_count);
          return { ...old, liked_count: nextCount };
        });
      });

      return map;
    },
    enabled: isbnList.length > 0,
    staleTime: 5 * MINUTE,
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
