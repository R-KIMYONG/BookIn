import { BookmarkBook, CommentBook, LikeBook } from './myBooks.type';
import { MypageUserInfo } from './userInfo.type';

export type CommentsListProps = {
  userInfo: MypageUserInfo;
  currentPage: number;
  setTotalPages: (page: number) => void;
};

export type MyBooksListProps =
  | {
      tab: 'comment';
      isPending: boolean;
      isError: boolean;
      data: CommentBook[];
    }
  | {
      tab: 'like';
      isPending: boolean;
      isError: boolean;
      data: LikeBook[];
    }
  | {
      tab: 'bookmark';
      isPending: boolean;
      isError: boolean;
      data: BookmarkBook[];
    };
