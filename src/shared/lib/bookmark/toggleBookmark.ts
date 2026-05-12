import { BookInfo } from '@/shared/types/bookInfo';

export const toggleBookmark = async (bookInfo: BookInfo, bookmarked: boolean) => {
  const method = bookmarked ? 'DELETE' : 'POST';

  const isbn13 = bookInfo?.isbn13?.trim();

  const response = await fetch('/api/bookmark', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookInfo),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result?.message ?? '북마크 실패');

  return {
    isbn13,
    bookmarked: !!result.bookmarked,
    memoExists: !!result.memoExists,
  };
};
