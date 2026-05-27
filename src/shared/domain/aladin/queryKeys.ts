import { TargetTypes } from '@/shared/constants/category';
import { QueryType } from './constants';

export const aladinKeys = {
  all: ['books'] as const,

  list: (params: { queryType: QueryType; page: number; target?: TargetTypes; categoryId?: number }) =>
    [...aladinKeys.all, 'list', params] as const,

  lastPage: (params: { queryType: QueryType; target: TargetTypes; categoryId: number }) =>
    [...aladinKeys.all, 'lastPage', params] as const,
};
