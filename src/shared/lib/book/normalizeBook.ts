import { AladinBookInfo } from '@/shared/types/api';

export const normalizeBook = (item: AladinBookInfo): AladinBookInfo => {
  const isbn13 = item.isbn13?.trim();

  const isbn10 = item.isbn?.trim();
  return {
    ...item,
    isbn13: isbn13 ? isbn13 : isbn10 ? isbn10 : '',
  };
};
