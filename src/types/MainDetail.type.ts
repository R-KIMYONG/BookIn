export type UsedItem = {
  itemCount: number;
  minPrice: number;
  link: string;
};
export type EbookItem = {
  isbn: string;
  isbn13: string;
  itemId: number;
  link: string;
  priceSales: number;
};

export type UsedList = {
  aladinUsed?: UsedItem;
  userUsed?: UsedItem;
  spaceUsed?: UsedItem;
};

export type SubInfo = {
  usedList?: UsedList;
  ebookList?: EbookItem[];
};

export type AladinItem = {
  subInfo?: SubInfo;
  priceStandard: number;
  priceSales: number;
  isbn13: string;
  isbn: string;
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
