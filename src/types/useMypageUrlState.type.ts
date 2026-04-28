export type MypageSectionType = 'myBooks';

export type MyBooksTabType = 'like' | 'bookmark' | 'comment';

export const MYPAGE_SECTION_LIST: MypageSectionType[] = ['myBooks'];

export const MYBOOKS_TAB_LIST: MyBooksTabType[] = ['like', 'bookmark', 'comment'];

export const MYPAGE_DEFAULT_SECTION: MypageSectionType = 'myBooks';

export const MYBOOKS_DEFAULT_TAB: MyBooksTabType = 'like';

//---------------------비밀번호 변경 모달---------------------
export type MypageModalType = 'changePassword' | null;

//---------------------북마크 정렬---------------------
export type BookmarkSort = 'created_desc' | 'created_asc' | 'title_asc' | 'title_desc';
export const BOOKMARK_SORT_DEFAULT: BookmarkSort = 'created_desc';
export const BOOKMARK_SORT_LIST: BookmarkSort[] = ['created_desc', 'created_asc', 'title_asc', 'title_desc'];

//---------------------북마크 필터---------------------
export type BookmarkFilter = 'all' | 'memo' | 'no_memo';

export const BOOKMARK_FILTER_DEFAULT: BookmarkFilter = 'all';

export const BOOKMARK_FILTER_LIST: BookmarkFilter[] = ['all', 'memo', 'no_memo'];
