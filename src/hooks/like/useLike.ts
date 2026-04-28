import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '../useUser';
export type LikeCache = {
  isbn13: string;
  liked: boolean;
  liked_count: number;
};
export const useLike = (bookInfo: { isbn13: string; title: string; cover: string; author: string }) => {
  const queryClient = useQueryClient();
  const queryKey = ['like', bookInfo.isbn13];
  const { data: user } = useUser();

  const mutation = useMutation({
    mutationFn: async (liked: boolean) => {
      const method = liked ? 'DELETE' : 'POST';

      const res = await fetch('/api/like', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookInfo),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message ?? '좋아요 실패');

      return result;
    },

    // optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const prev = queryClient.getQueryData<LikeCache>(queryKey);

      const current = prev ?? {
        isbn13: bookInfo.isbn13,
        liked: false,
        liked_count: 0,
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
      queryClient.setQueryData(queryKey, (old?: LikeCache) => {
        if (!old) return fresh;

        return {
          ...old,
          liked: fresh.liked,
        };
      });
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSettled: () => {
      if (!user?.id) return;
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === 'myBooks' &&
          q.queryKey[1] === 'like' &&
          q.queryKey[2] === user.id,
      });
    },
  });

  return {
    toggle: (liked: boolean, options?: Parameters<typeof mutation.mutate>[1]) => mutation.mutate(liked, options),
    isLoading: mutation.isPending,
  };
};
