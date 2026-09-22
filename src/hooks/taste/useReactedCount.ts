import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';
import { useQuery } from '@tanstack/react-query';

export const useReactedCount = () =>
  useQuery<number>({
    queryKey: recommendationsKey.reactedCount(),
    queryFn: async () => {
      const response = await fetch('/api/recommend-v2/reacted-count', { method: 'GET' });

      if (!response.ok) throw new Error('Reacted Count Fail');

      const data = await response.json();
      return data.reactedCount;
    },
  });
