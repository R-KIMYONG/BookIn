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
