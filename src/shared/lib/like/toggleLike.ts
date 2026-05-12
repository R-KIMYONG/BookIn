import { BookInfo } from '@/shared/types/bookInfo';

export const toggleLike = async ({ bookInfo }: { bookInfo: BookInfo }) => {
  const res = await fetch('/api/like/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookInfo),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message ?? '좋아요 실패');

  return result;
};
