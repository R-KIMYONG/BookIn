import { BookmarkMemoScope } from '@/shared/domain/bookmark/types';
import useUrlParams from './useUrlParams';

type BookmarkModalType = 'bookmarkMemo' | null;

const MODAL_KEY = 'bookmarkModal';

const ISBN_KEY = 'bookmarkIsbn';

const SCOPE_KEY = 'bookmarkScope';
export const useBookmarkMemoUrlState = () => {
  const { getParams, setParams } = useUrlParams();

  const scope = (getParams(SCOPE_KEY) as BookmarkMemoScope) ?? null;
  const rawModal = getParams(MODAL_KEY);
  const modalType: BookmarkModalType = rawModal === 'bookmarkMemo' ? 'bookmarkMemo' : null;

  const isbn = (getParams(ISBN_KEY) ?? '').trim() || null;

  const isOpen = modalType === 'bookmarkMemo' && !!isbn;

  const open = (nextIsbn: string, nextScope: BookmarkMemoScope) => {
    const isbnKey = nextIsbn.trim();
    if (!isbnKey) return;
    setParams({
      [MODAL_KEY]: 'bookmarkMemo',
      [ISBN_KEY]: isbnKey,
      [SCOPE_KEY]: nextScope,
    });
  };

  const close = () => {
    setParams({
      [MODAL_KEY]: null,
      [ISBN_KEY]: null,
      [SCOPE_KEY]: null,
    });
  };

  return { isbn, isOpen, open, close, scope };
};
