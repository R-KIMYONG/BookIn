import { MINUTE } from '@/shared/constants/time';
import { ItemId, parseItemId } from '@/shared/domain/book/ids';
import { statsKeys } from '@/shared/domain/book/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { LikeCache } from '@/shared/domain/like/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export type StatsRow = { view_count: number; comment_count: number; like_count: number };

export const useBookStats = (itemIds: ItemId[]) => {
  const queryClient = useQueryClient();
  return useQuery<Record<number, StatsRow>>({
    queryKey: statsKeys.batch(itemIds),
    queryFn: async () => {
      const response = await fetch(`/api/book-stats?ids=${itemIds.join(',')}`);

      if (!response.ok) throw new Error('stats fetch 실패');

      // JSON 객체 키는 문자열로 오므로 parseItemId로 브랜드를 다시 붙임
      const map: Record<number, StatsRow> = await response.json();
      Object.entries(map).forEach(([rawId, s]) => {
        const itemId = parseItemId(rawId);
        if (!itemId) return;
        queryClient.setQueryData(likeKeys.detail(itemId), (old?: LikeCache): LikeCache => {
          if (!old) return { itemId, liked: false, liked_count: s.like_count };
          const nextCount = old.liked
            ? Math.max(old.liked_count, s.like_count)
            : Math.min(old.liked_count, s.like_count);
          return { ...old, liked_count: nextCount };
        });
      });

      return map;
    },
    enabled: itemIds.length > 0,
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
