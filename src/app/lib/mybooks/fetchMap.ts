import { getCommentBooks } from './getCommentBooks';
import { getLikeBooks } from './getLikeBooks';
import { getBookmarkBooks } from './getBookmarkBooks';
import { MyBooksTabType } from '@/types/useMypageUrlState.type';

export const myBooksFetchMap = {
  comment: getCommentBooks,
  like: getLikeBooks,
  bookmark: getBookmarkBooks,
} satisfies Record<MyBooksTabType, Function>;
