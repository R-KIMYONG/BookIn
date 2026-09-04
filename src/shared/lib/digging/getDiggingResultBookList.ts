import { DiggingResultType } from '@/shared/domain/digging/types';

export const getDiggingResultBookList = async (answers: string[]) => {
  const res = await fetch('/api/digging', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error('digging fetch fail');

  const diggingData: DiggingResultType = await res.json();
  return diggingData;
};
