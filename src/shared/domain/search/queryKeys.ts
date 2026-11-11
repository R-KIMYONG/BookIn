import { SearchCategory, SearchSort } from '@/shared/lib/yes24/types';

export const searchKeys = {
  all: ['search'] as const,

  list: (params: { query: string; category: SearchCategory; sort: SearchSort; page: number }) =>
    [...searchKeys.all, 'list', params] as const,
};
