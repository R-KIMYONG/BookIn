import { RailResult } from '@/shared/domain/rails/types';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';
import { useQuery } from '@tanstack/react-query';

export const useRails = () => {
  return useQuery<RailResult>({
    queryKey: recommendationsKey.rail(),
    queryFn: async () => {
      const response = await fetch('/api/recommend-v2/rail', { method: 'GET' });
      if (!response.ok) throw new Error('추천실패');
      const data = await response.json();

      return data;
    },
  });
};
