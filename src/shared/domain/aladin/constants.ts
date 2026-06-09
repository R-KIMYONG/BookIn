import { QueryType } from './types';

export const QUERY_TYPE_LIST: QueryType[] = [
  'Bestseller',
  'ItemNewAll',
  'ItemNewSpecial',
  'BlogBest',
  'ItemEditorChoice',
];
export const DEFAULT_QT: QueryType = 'Bestseller';

export const MAX_RESULTS = 20;

export const MAX_PAGE = 50; //알라딘 정책상 한페이지20개라면 최대 50페이지까지인 하드 제한 걸려있기때문에 50을두고 찾음

export const APP_QUERY_KEYS = {
  queryType: 'qt',
  target: 'target',
  searchKeyWord: 'q',
  searchQueryType: 'sq',
  page: 'page',
  categoryId: 'ci',
  rankingModal: 'rm',
} as const;
export const ALADIN_ITEMLIST_KEYS = {
  queryType: 'QueryType',
  target: 'SearchTarget',
  page: 'Start',
  categoryId: 'CategoryId',
} as const;

export const ALL_TABS: { key: QueryType; label: string }[] = [
  { key: 'Bestseller', label: '베스트셀러' },
  { key: 'ItemNewAll', label: '새로 나온 책' },
  { key: 'ItemNewSpecial', label: '화제의 책' },
  { key: 'BlogBest', label: '베스트 예감' },
  { key: 'ItemEditorChoice', label: '편집자 추천' },
];
