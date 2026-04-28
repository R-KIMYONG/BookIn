import useUrlParams from './useUrlParams';
import useMypageUrlState from './useMypageUrlState';
import { BOOKMARK_FILTER_DEFAULT, BOOKMARK_FILTER_LIST, type BookmarkFilter } from '@/types/useMypageUrlState.type';

export const useBookmarkFilterUrlState = () => {
  const { getParams, setParams } = useUrlParams();
  const { tab } = useMypageUrlState();

  const raw = getParams('bookmarkFilter') ?? BOOKMARK_FILTER_DEFAULT;

  const bookmarkFilter: BookmarkFilter = BOOKMARK_FILTER_LIST.includes(raw as BookmarkFilter)
    ? (raw as BookmarkFilter)
    : BOOKMARK_FILTER_DEFAULT;

  const setBookmarkFilter = (next: BookmarkFilter) => {
    const isBookmarkTab = tab === 'bookmark';

    setParams({
      bookmarkFilter: isBookmarkTab ? next : null,
      page: 1,
    });
  };

  return { bookmarkFilter, setBookmarkFilter };
};
