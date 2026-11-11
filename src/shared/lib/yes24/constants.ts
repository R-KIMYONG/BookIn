import { TargetTypes } from '@/shared/constants/category';
import { SearchCategory, SearchSort, Yes24ListType } from '@/shared/lib/yes24/types';

export const SEARCH_DEFAULT_CATEGORY: SearchCategory = 'ALL';

export const SEARCH_DEFAULT_SORT: SearchSort = 'RELATION';

export const SEARCH_SORT_LIST: SearchSort[] = ['DEFAULT', 'RELATION', 'RECENT', 'REG_DTS'];

export const TARGET_TO_SEARCH_CATEGORY: Record<TargetTypes, SearchCategory> = {
  Book: 'BOOK',
  Foreign: 'FOREIGN',
  eBook: 'EBOOK',
};

//====================================================================

export const YES24_LIST_LABEL: Record<Yes24ListType, string> = {
  bestseller: '베스트셀러',
  bestsellerSteady: '스테디셀러',
  bestsellerDeal: '특가',
  newproduct: '새로 나온 책',
  newproductAttention: '주목할 신간',
};

// 홈 섹션 하나에 보여줄 책 수 (페이지네이션 없음)
export const HOME_LIST_SIZE = 10;
export const CATEGORY_LIST_SIZE = 20;

type HomeSection = {
  emoji: string;
  title: string;
  categoryId: string;
  target: TargetTypes; // "더보기" 링크용
  tabs: Yes24ListType[]; // 첫 번째가 기본 탭
};

export const HOME_SECTIONS: HomeSection[] = [
  {
    emoji: '📚',
    title: '국내도서',
    categoryId: '001',
    target: 'Book',
    tabs: ['bestseller', 'newproduct', 'newproductAttention', 'bestsellerSteady', 'bestsellerDeal'],
  },
  {
    emoji: '🌍',
    title: '외국도서',
    categoryId: '002',
    target: 'Foreign',
    tabs: ['bestseller', 'bestsellerSteady'],
  },
  {
    emoji: '📱',
    title: 'eBook',
    categoryId: '017',
    target: 'eBook',
    tabs: ['bestseller', 'newproduct', 'newproductAttention', 'bestsellerSteady'],
  },
];
