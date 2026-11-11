import { ItemId } from './ids';

// 카드, 목록, 레일 공통
export type BookSummary = Readonly<{
  itemId: ItemId;
  isbn13: string | null;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  pubDate: string | null;
  link: string;
}>;

// 목록 응답 공통 (검색·베스트셀러 등). 마지막 페이지 = Math.ceil(totalCount / pageSize)
export type Paged<T> = Readonly<{
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}>;

// 로그인 사용자의 책별 상태 (/api/my-status)
export type MyStatus = Readonly<{
  itemId: ItemId;
  liked: boolean;
  bookmarked: boolean;
  memoExists: boolean;
}>;

// 디테일 전용
export type BookDetail = BookSummary &
  Readonly<{
    shopPrice: number; //판매가
    salePrice: number; // 할인가
    description: string | null; // 책소개
    toc: string | null; //목차
    originalTitle: string | null; // 원래 제목 (번역본에서 title이 번역하는경우있음)
    categoryName: string | null; //카테고리명
    sortPath: string | null;
    subTitle: string | null;
    starScore: number | null;
    salePoint: number;
    yesPoint: number;
    ebookLink: string | null;
    pages: number | null;
  }>;
