import useUrlParams from './useUrlParams';
import useMypageUrlState from './useMypageUrlState';
import { BOOKMARK_SORT_DEFAULT, BOOKMARK_SORT_LIST, BookmarkSort } from '@/types/useMypageUrlState.type';

export const useBookmarkSortUrlState = () => {
  const { getParams, setParams } = useUrlParams();
  const { tab } = useMypageUrlState();

  const raw = getParams('bookmarkSort') ?? BOOKMARK_SORT_DEFAULT;
  const bookmarkSort: BookmarkSort = BOOKMARK_SORT_LIST.includes(raw as BookmarkSort)
    ? (raw as BookmarkSort)
    : BOOKMARK_SORT_DEFAULT;

  const setBookmarkSort = (next: BookmarkSort) => {
    const isBookmarkTab = tab === 'bookmark';

    setParams({
      bookmarkSort: isBookmarkTab ? next : null,
    });
  };

  return { bookmarkSort, setBookmarkSort };
};
