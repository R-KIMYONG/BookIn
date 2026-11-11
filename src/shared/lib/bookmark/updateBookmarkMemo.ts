import { ItemId } from '@/shared/domain/book/ids';
import { BookmarkMemoView, Tag } from '@/shared/domain/tag/types';

export const updateBookmarkMemo = async ({
  itemId,
  memo,
  tags,
}: {
  itemId: ItemId;
  memo: string | null;
  tags: Tag[];
}): Promise<BookmarkMemoView> => {
  const response = await fetch('/api/bookmark/memo', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, memo, tags }),
  });

  const body = await response.json();

  if (!response.ok) throw new Error(body?.error ?? '메모 저장에 실패했습니다.');
  return {
    bookmarkId: String(body.bookmarkId ?? ''),
    itemId,
    memo: body.memo ?? null,
    tags: body.tags ?? [],
    message: body.message ?? '처리가 완료되었습니다.',
  };
};
