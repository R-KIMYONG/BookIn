import { TargetTypes } from '@/shared/constants/category';
import { SEARCH_QT_LIST } from './constants';

export type SearchQueryType = (typeof SEARCH_QT_LIST)[number];

export type SearchOptionType = {
  keyword: string;
  target: TargetTypes;
  searchQueryType: SearchQueryType;
  categoryId: number;
};
