import { Item } from '@/shared/types/api';

export const makeHref = (it: Item): string | undefined => {
  const isbn13 = it.isbn13?.trim();
  const isbn10 = it.isbn?.trim();
  const itemId = it.itemId;

  if (isbn13) return `/${isbn13}?type=isbn13`;
  if (isbn10) return `/${isbn10}?type=isbn`;
  if (itemId != null && String(itemId).trim()) return `/${itemId}?type=itemid`;
  return undefined;
};
