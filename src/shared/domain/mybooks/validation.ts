import { MYBOOKS_TAB_LIST, MyBooksTabType } from '../mypage/tab';
import { FILTER_LIST, MyBooksFilter } from './filter';
import { SEARCH_SCOPE, SearchField } from './search';
import { MyBooksSort, SORT_LIST } from './sort';

export const isValidTab = (value: string | null): value is MyBooksTabType => {
  return !!value && MYBOOKS_TAB_LIST.includes(value as MyBooksTabType);
};

export const isValidSort = (value: string | null): value is MyBooksSort => {
  return !!value && SORT_LIST.includes(value as MyBooksSort);
};

export const isValidFilter = (value: string | null): value is MyBooksFilter => {
  return !!value && FILTER_LIST.includes(value as MyBooksFilter);
};

export const isValidSearchField = (tab: MyBooksTabType, field: string | null): field is SearchField => {
  if (!field) return false;
  return (SEARCH_SCOPE[tab] as readonly string[]).includes(field);
};
