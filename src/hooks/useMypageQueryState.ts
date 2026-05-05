import useUrlParams from '@/hooks/url/useUrlParams';
import {
  FILTER_DEFAULT,
  FILTER_LIST,
  MYBOOKS_DEFAULT_TAB,
  MYBOOKS_TAB_LIST,
  MyBooksFilter,
  MyBooksSort,
  MyBooksTabType,
  MYPAGE_DEFAULT_SECTION,
  MYPAGE_SECTION_LIST,
  MypageModalType,
  MypageSectionType,
  SEARCH_FIELD_DEFAULT,
  SEARCH_SCOPE,
  SearchField,
  SORT_DEFAULT,
  SORT_LIST,
} from '@/types/useMypageUrlState.type';
import { useCallback, useMemo } from 'react';

type MyPageQuery = {
  section: MypageSectionType;
  modal: MypageModalType;
  tab: MyBooksTabType;
  page: number;
  search: string;
  searchField: SearchField;
  sort: MyBooksSort;
  filter?: MyBooksFilter;
  tagId?: string;
};

function isValidTab(value: string | null): value is MyBooksTabType {
  return !!value && MYBOOKS_TAB_LIST.includes(value as MyBooksTabType);
}

function isValidSort(value: string | null): value is MyBooksSort {
  return !!value && SORT_LIST.includes(value as MyBooksSort);
}

function isValidFilter(value: string | null): value is MyBooksFilter {
  return !!value && FILTER_LIST.includes(value as MyBooksFilter);
}

function isValidSearchField(tab: MyBooksTabType, field: string | null): field is SearchField {
  if (!field) return false;
  return (SEARCH_SCOPE[tab] as readonly string[]).includes(field);
}

const parseQueryFromParams = (params: Record<string, string | null>): MyPageQuery => {
  const rawSection = params.section ?? MYPAGE_DEFAULT_SECTION;
  const rawTab = params.tab;
  const rawSort = params.sort;
  const rawFilter = params.filter;
  const rawSearch = params.search;
  const rawSearchField = params.searchField;
  const rawPage = Number(params.page ?? 1);
  const rawTag = params.tagId;
  const rawModal = params.modal;
  const section = MYPAGE_SECTION_LIST.includes(rawSection as MypageSectionType)
    ? (rawSection as MypageSectionType)
    : MYPAGE_DEFAULT_SECTION;

  const modal: MypageModalType = rawModal === 'changePassword' ? 'changePassword' : null;

  const tab = isValidTab(rawTab) ? rawTab : MYBOOKS_DEFAULT_TAB;

  const sort = isValidSort(rawSort) ? rawSort : SORT_DEFAULT;

  const filter = tab === 'bookmark' ? (isValidFilter(rawFilter) ? rawFilter : FILTER_DEFAULT) : undefined;

  const searchField = isValidSearchField(tab, rawSearchField) ? rawSearchField : SEARCH_FIELD_DEFAULT[tab];

  return {
    section,
    modal,
    tab,
    page: rawPage,
    search: rawSearch ?? '',
    searchField,
    sort,
    filter,
    tagId: rawTag ?? undefined,
  };
};

const buildParams = (query: MyPageQuery) => {
  const isMyBooks = query.section === 'myBooks';

  return {
    section: query.section,
    tab: isMyBooks ? query.tab : null,
    page: query.page,
    search: isMyBooks ? query.search || null : null,
    searchField: isMyBooks ? query.searchField : null,
    sort: isMyBooks ? query.sort : null,
    filter: isMyBooks ? (query.filter ?? null) : null,
    tagId: isMyBooks ? (query.tagId ?? null) : null,
    modal: query.modal ?? null,
  };
};

export const useMypageQueryState = () => {
  const { setParams, getAllParams } = useUrlParams();

  const query = useMemo(() => {
    const params = getAllParams();

    return parseQueryFromParams(params);
  }, [getAllParams]);

  const setQuery = useCallback(
    (partial: Partial<MyPageQuery>) => {
      const params = getAllParams();

      const current = parseQueryFromParams(params);
      const next = {
        ...current,
        ...partial,
      };

      //section이 변경되면 리셋해야할것들
      if (partial.section !== undefined) {
        next.tab = MYBOOKS_DEFAULT_TAB;
        next.search = '';
        next.searchField = SEARCH_FIELD_DEFAULT[MYBOOKS_DEFAULT_TAB];
        next.sort = SORT_DEFAULT;
        next.filter = undefined;
        next.tagId = undefined;
      }

      //탭이 변경되면 리셋해야할것들
      if (partial.tab !== undefined) {
        next.search = '';
        next.sort = SORT_DEFAULT;
        next.searchField = SEARCH_FIELD_DEFAULT[partial.tab];
        next.page = 1;
      }

      //북마크 아닐때 숨겨야할것들
      if (next.tab !== 'bookmark') {
        next.filter = undefined;
        next.tagId = undefined;
      }

      // page reset 조건
      const shouldResetPage =
        partial.search !== undefined ||
        partial.sort !== undefined ||
        partial.filter !== undefined ||
        partial.tagId !== undefined ||
        partial.searchField !== undefined ||
        partial.tab !== undefined ||
        partial.section !== undefined;

      if (shouldResetPage) {
        next.page = 1;
      }

      setParams(buildParams(next), { replace: true });
    },
    [getAllParams, setParams]
  );

  return { query, setQuery };
};
