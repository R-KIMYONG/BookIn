import { MyBooksTabType } from '../mypage/tab';
import { fetchLikeBooks } from '@/shared/api/mybooks/fetchLikeBooks.client';
import { fetchBookmarkBooks } from '@/shared/api/mybooks/fetchBookmarkBooks.client';
import { fetchCommentBooks } from '@/shared/api/mybooks/fetchCommentBooks.client';
import { MyBooksFetcherMap } from './types';

export const myBooksFetchClientMap: Record<MyBooksTabType, MyBooksFetcherMap> = {
  comment: fetchCommentBooks,
  like: fetchLikeBooks,
  bookmark: fetchBookmarkBooks,
};
