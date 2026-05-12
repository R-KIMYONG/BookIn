import { Tag } from '@/components/bookmark/BookmarkTagPicker';

export const updateBookmarkMemo = async ({
  isbn13,
  memo,
  tags,
}: {
  isbn13: string;
  memo: string | null;
  tags: Tag[];
}) => {
  const response = await fetch('/api/bookmark/memo', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isbn13, memo, tags }),
  });

  const body = await response.json();

  if (!response.ok) throw new Error(body?.error ?? '메모 저장에 실패했습니다.');
  return {
    bookmarkId: String(body.bookmarkId ?? ''),
    isbn13: String(body.isbn13 ?? isbn13),
    memo: body.memo ?? null,
    tags: body.tags ?? [],
    message: body.message ?? '처리가 완료되었습니다.',
  };
};
