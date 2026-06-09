import { MINUTE } from '@/shared/constants/time';
import { statsKeys } from '@/shared/domain/book/queryKeys';
import { useQuery } from '@tanstack/react-query';

export const useBookStats = (isbnList: string[]) => {
  return useQuery({
    queryKey: statsKeys.batch(isbnList),
    queryFn: async () => {
      const response = await fetch(`/api/book-stats?ids=${isbnList.join(',')}`);

      if (!response.ok) throw new Error('stats fetch 실패');

      const statsData = await response.json();
      return statsData;
    },
    enabled: isbnList.length > 0,
    staleTime: 5 * MINUTE,
    refetchInterval: 5 * MINUTE,
  });
};
