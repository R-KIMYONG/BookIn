import { UpdateSubmitItem } from '@/shared/domain/comment/types';

export const updateComment = async (data: UpdateSubmitItem) => {
  const response = await fetch('/api/comment', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? '댓글 수정 실패');
  return result;
};
