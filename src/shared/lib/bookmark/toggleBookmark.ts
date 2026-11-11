import { ItemId } from '@/shared/domain/book/ids';
import { BookmarkCache } from '@/shared/domain/bookmark/types';

// 책 정보는 보내지 않음: 서버가 itemId로 YES24에서 확인해 저장
export const toggleBookmark = async (itemId: ItemId, bookmarked: boolean): Promise<BookmarkCache> => {
  const method = bookmarked ? 'DELETE' : 'POST';

  const response = await fetch('/api/bookmark', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemId }),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result?.error ?? '북마크 실패');

  return {
    itemId,
    bookmarked: !!result.bookmarked,
    memoExists: !!result.memoExists,
  };
};
