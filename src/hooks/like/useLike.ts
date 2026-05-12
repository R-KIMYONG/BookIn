import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '../auth/useUser';
import { LikeCache } from '@/shared/domain/like/types';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { BookInfo } from '@/shared/types/bookInfo';
import { toggleLike } from '@/shared/lib/like/toggleLike';
import { likeKeys } from '@/shared/domain/like/queryKeys';
export const useLike = (bookInfo: BookInfo) => {
  const queryClient = useQueryClient();
  const queryKey = likeKeys.detail(bookInfo.isbn13);

  const { data: user } = useUser();

  const mutation = useMutation({
    mutationFn: () => toggleLike({ bookInfo }),

    // optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const prev = queryClient.getQueryData<LikeCache>(queryKey);

      const current: LikeCache = {
        isbn13: bookInfo.isbn13,
        liked: prev?.liked ?? false,
        liked_count: prev?.liked_count ?? 0,
      };

      const next = {
        isbn13: bookInfo.isbn13,
        liked: !current.liked,
        liked_count: current.liked ? Math.max(0, current.liked_count - 1) : current.liked_count + 1,
      };

      queryClient.setQueryData(queryKey, next);

      return { prev };
    },
    onSuccess: (fresh) => {
      queryClient.setQueryData(queryKey, (old?: LikeCache) => ({
        isbn13: bookInfo.isbn13,
        liked: fresh.liked,
        liked_count: fresh.liked_count ?? old?.liked_count ?? 0,
      }));
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSettled: () => {
      if (!user?.id) return;
      queryClient.invalidateQueries({ queryKey: myBooksKeys.all });
    },
  });

  return {
    toggle: (options?: Parameters<typeof mutation.mutate>[1]) => mutation.mutate(undefined, options),
    isLoading: mutation.isPending,
  };
};
