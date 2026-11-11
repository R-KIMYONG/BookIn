import { ItemId } from '@/shared/domain/book/ids';

export type LikeCache = {
  itemId: ItemId;
  liked: boolean;
  liked_count: number;
};

export type LikeResponseUserType = {
  itemId: ItemId;
  liked: boolean;
};

export type LikeResponseCountType = {
  itemId: ItemId;
  liked_count: number;
};
