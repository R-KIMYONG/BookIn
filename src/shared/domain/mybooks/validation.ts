import { MYBOOKS_TAB_LIST, MyBooksTabType } from '../mypage/tab';
import { FILTER_LIST, MyBooksFilter } from './filter';
import { SEARCH_SCOPE, SearchField } from './search';
import { MyBooksSort, SORT_LIST } from './sort';
import { MYPAGE_SECTION_LIST, MypageSectionType } from '../mypage/section';

export const isValidSection = (value: string | null | undefined): value is MypageSectionType => {
  return !!value && MYPAGE_SECTION_LIST.includes(value as MypageSectionType);
};

export const isValidTab = (value: string | null | undefined): value is MyBooksTabType => {
  return !!value && MYBOOKS_TAB_LIST.includes(value as MyBooksTabType);
};

export const isValidSort = (value: string | null | undefined): value is MyBooksSort => {
  return !!value && SORT_LIST.includes(value as MyBooksSort);
};

export const isValidFilter = (value: string | null | undefined): value is MyBooksFilter => {
  return !!value && FILTER_LIST.includes(value as MyBooksFilter);
};

export const isValidSearchField = (tab: MyBooksTabType, field: string | null | undefined): field is SearchField => {
  if (!field) return false;
  return (SEARCH_SCOPE[tab] as readonly string[]).includes(field);
};
