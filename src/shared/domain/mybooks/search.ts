import { MyBooksTabType } from '../mypage/tab';

export type SearchField = 'title' | 'author' | 'memo' | 'content';

export const SEARCH_FIELD_DEFAULT: Record<MyBooksTabType, SearchField> = {
  like: 'title',
  bookmark: 'title',
  comment: 'title',
};

export type SearchScopeMap = {
  like: Extract<SearchField, 'title' | 'author'>;
  bookmark: Extract<SearchField, 'title' | 'author' | 'memo'>;
  comment: Extract<SearchField, 'title' | 'author' | 'content'>;
};

export const SEARCH_SCOPE: {
  [K in MyBooksTabType]: SearchScopeMap[K][];
} = {
  like: ['title', 'author'],
  bookmark: ['title', 'author', 'memo'],
  comment: ['title', 'author', 'content'],
};
