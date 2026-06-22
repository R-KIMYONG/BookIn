import { AladinBookInfo } from '@/shared/types/api';

export const makeItemKey = (it: AladinBookInfo, index: number) => {
  const base =
    it.isbn13?.trim() ||
    it.isbn?.trim() ||
    (it.itemId !== null ? String(it.itemId) : '') ||
    it.link ||
    it.title ||
    'no-id';
  return `${base}-${index}`;
};
