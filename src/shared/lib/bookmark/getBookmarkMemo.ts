import { ItemId } from '@/shared/domain/book/ids';
import { BookmarkMemoView } from '@/shared/domain/tag/types';

export const getBookmarkMemo = async (itemId: ItemId): Promise<BookmarkMemoView> => {
  const res = await fetch(`/api/bookmark/memo?itemId=${itemId}`, {
    method: 'GET',
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message ?? '메모 조회 실패');
  }
  return result;
};
