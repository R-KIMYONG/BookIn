import { getBookmarkBooks } from '@/shared/lib/server/mybooks/getBookmarkBooks';
import { getCommentBooks } from '@/shared/lib/server/mybooks/getCommentBooks';
import { getLikeBooks } from '@/shared/lib/server/mybooks/getLikeBooks';
import { MyBooksFetcherMap } from './types';
import { MyBooksTabType } from '../mypage/tab';

export const myBooksFetchServerMap: Record<MyBooksTabType, MyBooksFetcherMap> = {
  comment: getCommentBooks,
  like: getLikeBooks,
  bookmark: getBookmarkBooks,
};
