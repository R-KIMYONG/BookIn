export const SEARCH_QT_LIST = ['Keyword', 'Title', 'Author', 'Publisher'] as const;

export type SearchQueryType = (typeof SEARCH_QT_LIST)[number];

export const DEFAULT_SEARCH_QT = 'Keyword';
