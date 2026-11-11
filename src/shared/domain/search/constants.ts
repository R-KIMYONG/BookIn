import { TargetTypes } from '@/shared/constants/category';
import { SearchCategory, SearchSort } from '@/shared/lib/yes24/types';

// ─── YES24 검색 (현재) ───

export const SEARCH_PLACEHOLDER = '책 제목 또는 저자를 입력하세요';

// 정렬 이름 (결과 배지·검색창 공용)
export const SEARCH_SORT_LABEL: Record<SearchSort, string> = {
  RELATION: '정확도순',
  DEFAULT: '인기도순',
  RECENT: '신상품순',
  REG_DTS: '등록일순',
};

// 검색창에 노출할 정렬 (등록일순은 신상품순과 구분이 어려워 제외)
export const SEARCH_SORT_OPTIONS: SearchSort[] = ['RELATION', 'DEFAULT', 'RECENT', 'REG_DTS'];

// 실제 검색 범위 이름 (결과 배지용, YES24 값 기준)
export const SEARCH_CATEGORY_LABEL: Record<SearchCategory, string> = {
  ALL: '전체',
  BOOK: '국내',
  FOREIGN: '외국',
  EBOOK: 'eBook',
};

// 검색창 범위 버튼 (URL target 값 기준. v가 없으면 전체 검색)
export const RANGE: { v: TargetTypes | undefined; label: string }[] = [
  { v: undefined, label: '전체' },
  { v: 'Book', label: '국내' },
  { v: 'Foreign', label: '외국' },
  { v: 'eBook', label: 'eBook' },
];

export const SEARCH_INPUT_MAXLENGTH = 20;
