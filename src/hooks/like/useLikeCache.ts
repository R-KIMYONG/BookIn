import { useQuery } from '@tanstack/react-query';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { LikeCache } from '@/shared/domain/like/types';

export const useLikeCache = (isbn13: string) => {
  return useQuery<LikeCache>({
    queryKey: likeKeys.detail(isbn13),
    queryFn: async () => ({ isbn13, liked: false, liked_count: 0 }),
    enabled: false,
  });
};
