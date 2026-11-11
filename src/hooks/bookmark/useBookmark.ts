import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkCache } from '@/shared/domain/bookmark/types';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { toggleBookmark } from '@/shared/lib/bookmark/toggleBookmark';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { ItemId } from '@/shared/domain/book/ids';
import { useAuth } from '@/shared/context/AuthContext';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';

export const useBookmark = (itemId: ItemId) => {
  const queryClient = useQueryClient();
  const queryKey = bookmarkKeys.detail(itemId);
  const { user } = useAuth();

  const mutation = useMutation<BookmarkCache, Error, boolean, { prev: BookmarkCache }>({
    mutationFn: (bookmarked) => toggleBookmark(itemId, bookmarked),

    // optimistic update
    onMutate: async (bookmarked) => {
      await queryClient.cancelQueries({ queryKey });

      const prev = queryClient.getQueryData<BookmarkCache>(queryKey) ?? {
        itemId,
        bookmarked: false,
        memoExists: false,
      };
      const nextBookmarked = !bookmarked;
      const next: BookmarkCache = {
        itemId,
        bookmarked: nextBookmarked,
        memoExists: nextBookmarked ? prev.memoExists : false,
      };
      queryClient.setQueryData(queryKey, next);

      return { prev };
    },
    onSuccess: (fresh) => {
      queryClient.setQueryData(queryKey, fresh);

      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: recommendationsKey.rail() });
      queryClient.invalidateQueries({ queryKey: recommendationsKey.reactedCount() });
    },
    onError: (_err, _vars, context) => {
      console.error('[bookmark][mutation-error]', { _err, context });
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSettled: () => {
      if (!user?.id) return;
      queryClient.invalidateQueries({ queryKey: myBooksKeys.all });
      queryClient.removeQueries({ queryKey: bookmarkKeys.memo(user.id, itemId) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.tags.detail(user.id, itemId) });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    toggle: (bookmarked: boolean, options?: Parameters<typeof mutation.mutate>[1]) => {
      if (!user) {
        showToast(RESULT_CODE.AUTH_REQUIRED_LOGIN, {
          toastId: 'login-required',
        });
        return;
      }
      mutation.mutate(bookmarked, options);
    },
    isLoading: mutation.isPending,
  };
};
