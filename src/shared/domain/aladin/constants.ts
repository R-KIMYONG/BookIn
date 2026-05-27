export type QueryType = 'Bestseller' | 'ItemNewAll' | 'ItemNewSpecial' | 'BlogBest' | 'ItemEditorChoice';

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
