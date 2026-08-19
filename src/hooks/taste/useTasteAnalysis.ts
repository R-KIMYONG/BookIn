import { useQuery } from '@tanstack/react-query';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';
import { TasteAnalysis } from '@/shared/domain/taste/types';

export const useTasteAnalysis = () =>
  useQuery<TasteAnalysis | null>({
    queryKey: recommendationsKey.tasteAnalysis(),
    queryFn: async () => {
      const res = await fetch('/api/recommend-v2/taste', { method: 'GET' });
      if (!res.ok) throw new Error((await res.json()).error ?? 'AI 분석 호출 실패');

      const data = await res.json();
      return data;
    },
  });
