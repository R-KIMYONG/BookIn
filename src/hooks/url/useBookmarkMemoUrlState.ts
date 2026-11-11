import { BookmarkMemoScope } from '@/shared/domain/bookmark/types';
import { ItemId, parseItemId } from '@/shared/domain/book/ids';
import useUrlParams from './useUrlParams';

type BookmarkModalType = 'bookmarkMemo' | null;

const MODAL_KEY = 'bookmarkModal';

const ITEM_ID_KEY = 'bookmarkItemId';

const SCOPE_KEY = 'bookmarkScope';
export const useBookmarkMemoUrlState = () => {
  const { getParams, setParams } = useUrlParams();

  const scope = (getParams(SCOPE_KEY) as BookmarkMemoScope) ?? null;
  const rawModal = getParams(MODAL_KEY);
  const modalType: BookmarkModalType = rawModal === 'bookmarkMemo' ? 'bookmarkMemo' : null;

  // URL 값은 검증 전이라 parseItemId로 브랜드를 붙임 (이상한 값이면 모달을 열지 않음)
  const itemId = parseItemId(getParams(ITEM_ID_KEY));

  const isOpen = modalType === 'bookmarkMemo' && !!itemId;

  const open = (nextItemId: ItemId, nextScope: BookmarkMemoScope) => {
    setParams({
      [MODAL_KEY]: 'bookmarkMemo',
      [ITEM_ID_KEY]: String(nextItemId),
      [SCOPE_KEY]: nextScope,
    });
  };

  const close = () => {
    setParams({
      [MODAL_KEY]: null,
      [ITEM_ID_KEY]: null,
      [SCOPE_KEY]: null,
    });
  };

  return { itemId, isOpen, open, close, scope };
};
