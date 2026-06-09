import { AladinItem } from '../aladin/types';

export const getBookKey = (item: AladinItem): string => {
  const isbn13 = item.isbn13?.trim();
  const isbn10 = item.isbn?.trim();

  if (isbn13) return isbn13;
  if (isbn10) return isbn10;
  throw new Error('isbn13도 isbn도 없는 책입니다');
};
