export type BookmarkCache = {
  isbn13: string;
  bookmarked: boolean;
  memoExists: boolean;
};
export type BookmarkMemoScope = 'mypage' | 'detail' | 'home';
