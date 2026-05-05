export type MypageSectionType = 'myBooks' | 'recommend';

export type MyBooksTabType = 'like' | 'bookmark' | 'comment';

export const MYPAGE_SECTION_LIST: MypageSectionType[] = ['myBooks', 'recommend'];

export const MYBOOKS_TAB_LIST: MyBooksTabType[] = ['like', 'bookmark', 'comment'];

export const MYPAGE_DEFAULT_SECTION: MypageSectionType = 'myBooks';

export const MYBOOKS_DEFAULT_TAB: MyBooksTabType = 'like';

//---------------------비밀번호 변경 모달---------------------
export type MypageModalType = 'changePassword' | null;

//---------------------정렬---------------------

export type SortByTab<T> = T extends 'bookmark' ? MyBooksSort : Extract<MyBooksSort, 'created_desc' | 'created_asc'>;
export type MyBooksSort = 'created_desc' | 'created_asc' | 'title_asc' | 'title_desc';
export const SORT_DEFAULT: MyBooksSort = 'created_desc';
export const SORT_LIST: MyBooksSort[] = ['created_desc', 'created_asc', 'title_asc', 'title_desc'];

//---------------------북마크 필터---------------------
export type MyBooksFilter = 'all' | 'memo' | 'no_memo';

export const FILTER_DEFAULT: MyBooksFilter = 'all';

export const FILTER_LIST: MyBooksFilter[] = ['all', 'memo', 'no_memo'];

//---------------------검색대상--------------------

export const SEARCH_FIELD_DEFAULT: Record<MyBooksTabType, SearchField> = {
  like: 'title',
  bookmark: 'title',
  comment: 'title',
};

export type SearchField = 'title' | 'author' | 'memo' | 'content';

export type SearchScopeMap = {
  like: Extract<SearchField, 'title' | 'author'>;
  bookmark: Extract<SearchField, 'title' | 'author' | 'memo'>;
  comment: Extract<SearchField, 'title' | 'author' | 'content'>;
};

export const SEARCH_SCOPE: { [K in MyBooksTabType]: SearchScopeMap[K][] } = {
  like: ['title', 'author'],
  bookmark: ['title', 'author', 'memo'],
  comment: ['title', 'author', 'content'],
};
