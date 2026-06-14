export type QueryType = 'Bestseller' | 'ItemNewAll' | 'ItemNewSpecial' | 'BlogBest' | 'ItemEditorChoice';
type UsedItem = {
  itemCount: number;
  minPrice: number;
  link: string;
};
type EbookItem = {
  isbn: string;
  isbn13: string;
  itemId: number;
  link: string;
  priceSales: number;
};

type UsedList = {
  aladinUsed?: UsedItem;
  userUsed?: UsedItem;
  spaceUsed?: UsedItem;
};

type SubInfo = {
  usedList?: UsedList;
  ebookList?: EbookItem[];
};

export type AladinItem = {
  subInfo?: SubInfo;
  priceStandard: number;
  priceSales: number;
  isbn13: string;
  isbn: string;
  categoryId: number;
  customerReviewRank: number;
  salesPoint: number;
  categoryName: string;
  cover: string;
  title: string;
  publisher: string;
  adult: boolean;
  author: string;
  description: string;
  link: string;
  mileage: number;
};

export type PagedResult<T> = {
  items: T[];
  totalResults: number;
  itemsPerPage: number;
};
