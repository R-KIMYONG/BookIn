import { DiggingResultType } from '@/shared/domain/digging/types';

export const getDiggingResultBookList = async (answers: string[]) => {
  const res = await fetch('/api/digging', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? '책을 찾는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
  }

  const diggingData: DiggingResultType = await res.json();
  return diggingData;
};
