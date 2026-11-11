import { recentbookKeys } from '@/shared/domain/recentbooks/queryKeys';
import { RecentBook } from '@/shared/domain/recentbooks/types';
import { useQuery } from '@tanstack/react-query';

export const useRecentBooks = () => {
  return useQuery<RecentBook[]>({
    queryKey: recentbookKeys.list(),
    queryFn: async () => {
      const response = await fetch(`/api/recent-books`);
      if (!response.ok) throw new Error('failed to fetch recent books');

      const data = await response.json();
      return data;
    },
  });
};
