import { TARGET_LIST, TargetTypes } from '@/shared/constants/category';
import { SEARCH_DEFAULT_CATEGORY, SEARCH_DEFAULT_SORT, SEARCH_SORT_LIST, TARGET_TO_SEARCH_CATEGORY } from './constants';
import { SearchCategory, SearchSort } from './types';

export const toSearchCategory = (raw: string | null): SearchCategory =>
  raw && TARGET_LIST.includes(raw as TargetTypes)
    ? TARGET_TO_SEARCH_CATEGORY[raw as TargetTypes]
    : SEARCH_DEFAULT_CATEGORY;

export const toSearchSort = (raw: string | null): SearchSort =>
  raw && SEARCH_SORT_LIST.includes(raw as SearchSort) ? (raw as SearchSort) : SEARCH_DEFAULT_SORT;

export const toPage = (raw: string | null): number => {
  const n = Number(raw ?? '1');
  return Number.isInteger(n) && n >= 1 ? n : 1;
};
