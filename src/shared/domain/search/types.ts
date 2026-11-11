import { SearchCategory, SearchSort } from '@/shared/lib/yes24/types';

// 실제로 YES24에 요청한 검색 조건
export type SearchOptionType = {
  keyword: string;
  category: SearchCategory;
  sort: SearchSort;
};
