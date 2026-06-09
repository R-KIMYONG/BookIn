'use client';
import { useQuery } from '@tanstack/react-query';
import { rankingKeys } from '@/shared/domain/ranking/queryKeys';
import { MINUTE } from '@/shared/constants/time';
import { TopViewType } from '@/shared/domain/ranking/types';

export const useTopViewBooks = () =>
  useQuery<TopViewType[]>({
    queryKey: rankingKeys.topViewBooks(5),
    queryFn: async () => {
      const res = await fetch(`/api/view`, { method: 'GET' });
      if (!res.ok) throw new Error('failed to fetch top books');

      const data = await res.json();

      return data;
    },
    staleTime: 5 * MINUTE, // 5분 동안 fresh로 간주 (SSR 직후 즉시 refetch 방지)
    refetchInterval: 5 * MINUTE, // 5분마다 자동 refetch
    refetchOnWindowFocus: false,
  });
