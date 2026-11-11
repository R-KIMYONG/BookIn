import { ItemId } from '../book/ids';

export const likeKeys = {
  all: ['like'] as const,
  detail: (itemId: ItemId) => [likeKeys.all, itemId] as const,
  countBatch: (itemIds: ItemId[]) => [likeKeys.all, 'count', [...itemIds].sort((a, b) => a - b).join(',')] as const,
};
