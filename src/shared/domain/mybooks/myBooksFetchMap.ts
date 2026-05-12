import { getBookmarkBooks } from '@/shared/lib/mybooks/getBookmarkBooks';
import { getCommentBooks } from '@/shared/lib/mybooks/getCommentBooks';
import { getLikeBooks } from '@/shared/lib/mybooks/getLikeBooks';
import { MyBooksTabType } from '../mypage/tab';
type Fetcher = (params: any) => Promise<{ data: any; total: number }>;
export const myBooksFetchMap: Record<MyBooksTabType, Fetcher> = {
  comment: getCommentBooks,
  like: getLikeBooks,
  bookmark: getBookmarkBooks,
};
