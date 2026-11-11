import { Yes24ListType } from '@/shared/lib/yes24/types';
import { ItemId } from './ids';

export const bookListKeys = {
  list: (params: { listType: Yes24ListType; categoryId: string; page: number; pageSize: number }) =>
    ['bookList', params] as const,
};

export const statsKeys = {
  batch: (itemIds: ItemId[]) => ['stats', [...itemIds].sort((a, b) => a - b).join(',')],
};

export const myStatusKeys = {
  batch: (itemIds: ItemId[]) => ['myStatus', [...itemIds].sort((a, b) => a - b).join(',')],
};
