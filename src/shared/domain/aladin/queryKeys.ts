import { TargetTypes } from '@/shared/constants/category';
import { SearchQueryType } from '@/shared/domain/search/types';
import { QueryType } from './types';

export const aladinKeys = {
  all: ['books'] as const,

  list: (params: { queryType: QueryType; page: number; target?: TargetTypes; categoryId?: number }) =>
    [...aladinKeys.all, 'list', params] as const,

  lastPage: (params: { queryType: QueryType; target: TargetTypes; categoryId: number }) =>
    [...aladinKeys.all, 'lastPage', params] as const,

  search: (params: {
    searchKeyWord?: string | null;
    searchQueryType: SearchQueryType;
    page: number;
    target: TargetTypes;
    categoryId: number | null;
  }) => [...aladinKeys.all, 'search', params] as const,
};
