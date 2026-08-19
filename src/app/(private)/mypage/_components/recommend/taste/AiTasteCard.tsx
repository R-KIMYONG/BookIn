import Button from '@/components/common/ui/Button';
import { useGenerateTasteAnalysis } from '@/hooks/taste/useGenerateTasteAnalysis';
import { useTasteAnalysis } from '@/hooks/taste/useTasteAnalysis';
import { PersonaType } from '@/shared/domain/taste/types';
import AnalyzingLoader from '../AnalyzingLoader';
import { Microscope } from 'lucide-react';

const AiTasteCard = ({ persona }: { persona: PersonaType }) => {
  const { data: ai, isPending } = useTasteAnalysis();
  const { mutate: generate, isPending: generating, error } = useGenerateTasteAnalysis();

  if (isPending) {
    return (
      <div className="h-full rounded-2xl border border-gray-200 bg-white p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-16 w-full rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (generating) return <AnalyzingLoader />;

  if (!ai) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          AI가 <span className="font-semibold text-gray-700">{persona.title}</span>의 독서 스타일을 분석해드려요
        </p>
        <Button label="AI 분석 받기" onClick={() => generate()} leftIcon={'🔮'} />
        {error && <p className="text-xs text-red-500">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Microscope size={25} color="#5b21b6" />
          <h3 className="text-sm font-bold text-gray-400">AI 독서 분석</h3>
        </div>
        <Button onClick={() => generate()} disabled={generating} label={'다시 분석'} variant="secondary" />
      </div>

      <p className="text-sm leading-relaxed text-gray-800">{ai.reading_style}</p>
      <p className="text-sm leading-relaxed text-gray-800">{ai.taste_read}</p>

      <div className="rounded-xl bg-violet-50 p-3 text-sm leading-relaxed text-violet-800 ring-1 ring-inset ring-violet-100">
        🔮 {ai.fun_fortune}
      </div>
      <p className="mt-auto pt-2 text-center text-base font-extrabold text-gray-900">“{ai.one_line_meme}”</p>

      {error && <p className="text-center text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default AiTasteCard;
