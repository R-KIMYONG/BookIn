import { MINUTE } from '@/shared/constants/time';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { LikeCache, LikeResponseUserType } from '@/shared/domain/like/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchLikes = (isbnList: string[], userId?: string | null) => {
  const queryClient = useQueryClient();
  return useQuery<LikeResponseUserType[]>({
    queryKey: likeKeys.userBatch(userId ?? 'guest', isbnList),
    queryFn: async () => {
      const ids = isbnList.join(',');
      const res = await fetch(`/api/like/user?bookIds=${ids}`);
      if (!res.ok) throw new Error('like fetch 실패');
      const data = await res.json();

      data.forEach((server: LikeResponseUserType) => {
        queryClient.setQueryData(likeKeys.detail(server.isbn13), (old: LikeCache | undefined) => {
          return {
            isbn13: server.isbn13,
            liked: server.liked,
            liked_count: old?.liked_count ?? 0,
          };
        });
      });
      return data;
    },
    enabled: isbnList.length > 0,
    staleTime: 3 * MINUTE,
  });
};
