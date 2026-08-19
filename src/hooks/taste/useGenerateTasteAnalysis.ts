import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';
import { TasteAnalysis } from '@/shared/domain/taste/types';

export const useGenerateTasteAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation<TasteAnalysis | null>({
    mutationFn: async () => {
      const res = await fetch('/api/recommend-v2/taste', { method: 'POST' });
      if (!res.ok) throw new Error((await res.json()).error ?? 'AI 분석 생성 실패');
      return (await res.json()).taste_summary; 
    },
    onSuccess: (analysis) => {
      queryClient.setQueryData(recommendationsKey.tasteAnalysis(), analysis);
    },
  });
};
