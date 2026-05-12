import { SubmitItem } from '@/shared/domain/comment/types';

export const createComment = async (input: SubmitItem & { bookId: string; userId?: string | null }) => {
  const response = await fetch('/api/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      book_id: input.bookId,
      user_id: input.userId,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? '댓글 작성 실패');

  return result;
};
