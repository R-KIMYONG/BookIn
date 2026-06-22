import { MypageModalType } from '../mypage/modal';
import { MypageSectionType } from '../mypage/section';
import { MyBooksTabType } from '../mypage/tab';
import { MyBooksFilter } from './filter';
import { SearchField } from './search';
import { MyBooksSort } from './sort';

export type BookmarkRow = {
  book_id: string;
  created_at: string;
  memo: string | null;
  books: {
    title: string;
    thumbnail_url: string;
    isbn13: string;
    author: string;
    category_id: number;
    category_name: string;
    book_stats: {
      view_count: number;
      like_count: number;
      comment_count: number;
    }[];
  };
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
      color: string | null;
    };
  }[];
};

export type LikeRow = {
  book_id: string;
  created_at: string;
  isbn13: string;
  books: {
    title: string;
    isbn: string;
    thumbnail_url: string;
    author: string;
    category_id: number;
    category_name: string;
    book_stats: {
      view_count: number;
      like_count: number;
      comment_count: number;
    }[];
  }[];
};

export type CommentRow = {
  book_id: string;
  comment_count: number;
  last_commented_at: string;
  books: {
    title: string;
    thumbnail_url: string;
    isbn13: string;
    book_stats: {
      view_count: number;
      like_count: number;
      comment_count: number;
    }[];
  }[];
};
export type MyBookBase = {
  book_id: string;
  title: string;
  cover: string;
  isbn13: string;
  total_like_count: number;
  total_view_count: number;
  total_comment_count: number;
};

export type CommentBook = MyBookBase & {
  comment_count: number;
  last_commented_at: string;
};

export type LikeBook = MyBookBase & {
  created_at: string;
  author: string;
  categoryId: number;
  categoryName: string;
};

export type BookmarkBook = MyBookBase & {
  created_at: string;
  author: string;
  memo: string | null;
  categoryId: number;
  categoryName: string;
  tags: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  }[];
};

export type MyBooksResult<T> = {
  data: T[];
  total: number;
};

export type MyPageQuery = {
  section: MypageSectionType;
  modal: MypageModalType;
  tab: MyBooksTabType;
  page: number;
  search: string;
  searchField: SearchField;
  sort: MyBooksSort;
  filter?: MyBooksFilter;
  tagId?: string;
};

export type MyBooksQueryResult =
  | { tab: 'comment'; data: CommentBook[]; total: number }
  | { tab: 'like'; data: LikeBook[]; total: number }
  | { tab: 'bookmark'; data: BookmarkBook[]; total: number };

export type FetchMyBooksParams = {
  tab: MyBooksTabType;
  page: number;
  pageSize: number;
  sort: MyBooksSort;
  memoFilter?: MyBooksFilter;
  search?: string;
  searchField?: SearchField;
  tagId?: string;
};

export type MyBooksFetcherMap = (params: FetchMyBooksParams) => Promise<Omit<MyBooksQueryResult, 'tab'>>;
