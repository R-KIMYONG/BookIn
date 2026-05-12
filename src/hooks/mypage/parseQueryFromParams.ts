import { FILTER_DEFAULT } from '@/shared/domain/mybooks/filter';
import { SEARCH_FIELD_DEFAULT } from '@/shared/domain/mybooks/search';
import { SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { MyPageQuery } from '@/shared/domain/mybooks/types';
import { isValidFilter, isValidSearchField, isValidSort, isValidTab } from '@/shared/domain/mybooks/validation';
import { MypageModalType } from '@/shared/domain/mypage/modal';
import { MYPAGE_DEFAULT_SECTION, MYPAGE_SECTION_LIST, MypageSectionType } from '@/shared/domain/mypage/section';
import { MYBOOKS_DEFAULT_TAB } from '@/shared/domain/mypage/tab';

export const parseQueryFromParams = (params: Record<string, string | null>): MyPageQuery => {
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
