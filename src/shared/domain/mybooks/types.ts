import { ItemId } from '../book/ids';
import { MypageModalType } from '../mypage/modal';
import { MypageSectionType } from '../mypage/section';
import { MyBooksTabType } from '../mypage/tab';
import { MyBooksFilter } from './filter';
import { SearchField } from './search';
import { MyBooksSort } from './sort';

type BookmarkTag = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

type BookmarkRowBook = {
  title: string;
  thumbnail_url: string;
  author: string;
  category_name: string;
  book_stats: {
    view_count: number;
    like_count: number;
    comment_count: number;
  }[];
};

// supabase 타입 추론은 조인을 배열로 보지만 실제 응답은 객체 → 둘 다 받고 매핑에서 정규화
export type BookmarkRow = {
  item_id: number;
  created_at: string;
  memo: string | null;
  books: BookmarkRowBook | BookmarkRowBook[];
  tags: {
    tag: BookmarkTag | BookmarkTag[];
  }[];
};

export type LikeRow = {
  item_id: number;
  created_at: string;
  books: {
    title: string;
    thumbnail_url: string;
    author: string;
    category_name: string;
    book_stats: {
      view_count: number;
      like_count: number;
      comment_count: number;
    }[];
  }[];
};

export type CommentRow = {
  comment_count: number;
  last_commented_at: string;
  books: {
    item_id: number;
    title: string;
    thumbnail_url: string;
    book_stats: {
      view_count: number;
      like_count: number;
      comment_count: number;
    }[];
  }[];
};
export type MyBookBase = {
  itemId: ItemId;
  title: string;
  cover: string;
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
  categoryName: string;
};

export type BookmarkBook = MyBookBase & {
  created_at: string;
  author: string;
  memo: string | null;
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
