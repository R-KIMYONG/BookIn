import { useQuery } from '@tanstack/react-query';
import { ItemId } from '@/shared/domain/book/ids';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { LikeCache } from '@/shared/domain/like/types';

export const useLikeCache = (itemId: ItemId) => {
  return useQuery<LikeCache>({
    queryKey: likeKeys.detail(itemId),
    queryFn: async () => ({ itemId, liked: false, liked_count: 0 }),
    enabled: false,
  });
};
