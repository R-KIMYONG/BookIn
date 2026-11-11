import { ItemId } from '../book/ids';

export const bookmarkKeys = {
  all: ['bookmark'] as const,
  detail: (itemId: ItemId) => [bookmarkKeys.all, itemId] as const,
  memo: (userId: string, itemId: ItemId) => ['bookmarkMemo', userId, itemId] as const,
  tags: {
    user: () => ['bookmarkTags', 'user'] as const,
    detail: (userId: string | null, itemId: ItemId) => ['bookmarkTags', 'detail', userId, itemId] as const,
  },
};
