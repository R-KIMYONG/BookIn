import { MINUTE } from '@/shared/constants/time';
import { rankingKeys } from '@/shared/domain/ranking/queryKeys';
import { RankedBook } from '@/shared/domain/ranking/types';
import { useQuery } from '@tanstack/react-query';

export const useRankedBooks = () =>
  useQuery<RankedBook[]>({
    queryKey: rankingKeys.topRankingBooks(),
    queryFn: async () => {
      const res = await fetch(`/api/ranking`, { method: 'GET' });
      if (!res.ok) throw new Error('failed to fetch ranking books');

      const data = await res.json();
      return data;
    },
    staleTime: 5 * MINUTE, // 5분 동안 fresh로 간주 (SSR 직후 즉시 refetch 방지)
    refetchInterval: 5 * MINUTE, // 5분마다 자동 refetch
    refetchOnWindowFocus: false,
  });
