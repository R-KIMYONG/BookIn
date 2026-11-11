import { ItemId } from '@/shared/domain/book/ids';

export type BookmarkCache = {
  itemId: ItemId;
  bookmarked: boolean;
  memoExists: boolean;
};
export type BookmarkMemoScope = 'mypage' | 'detail' | 'home';

export type BookmarkInfo = { bookmarked: boolean; memoExists: boolean };
