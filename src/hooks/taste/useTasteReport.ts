import { useQuery } from '@tanstack/react-query';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';
import { PersonaType, ReportType } from '@/shared/domain/taste/types';

type TasteReportData = { genres: ReportType[]; persona: PersonaType };

export const useTasteReport = () =>
  useQuery<TasteReportData>({
    queryKey: recommendationsKey.tasteReport(),
    queryFn: async () => {
      const res = await fetch('/api/recommend-v2/taste-report', { method: 'GET' });
      if (!res.ok) throw new Error((await res.json()).error ?? '페르소나 호출 실패');

      const data = await res.json();
      return data;
    },
  });
