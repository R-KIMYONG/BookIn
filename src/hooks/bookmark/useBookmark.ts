import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '../auth/useUser';
import { BookmarkCache } from '@/shared/domain/bookmark/types';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { toggleBookmark } from '@/shared/lib/bookmark/toggleBookmark';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { BookInfo } from '@/shared/types/bookInfo';

export const useBookmark = (bookInfo: BookInfo) => {
  const queryClient = useQueryClient();
  const isbn13 = bookInfo?.isbn13.trim();
  const { data: user } = useUser();

  if (!isbn13) {
    throw new Error('isbn13 is required');
  }

  const mutation = useMutation({
    mutationFn: (bookmarked) => toggleBookmark(bookInfo, bookmarked),

    // optimistic update
    onMutate: async (bookmarked: boolean) => {
      const isbn13 = bookInfo?.isbn13?.trim();
      if (!isbn13) return;
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.detail(isbn13) });

      const prev = queryClient.getQueryData<BookmarkCache>(bookmarkKeys.detail(isbn13)) ?? {
        isbn13: isbn13,
        bookmarked: false,
        memoExists: false,
      };
      const nextBookmarked = !bookmarked;
      const next: BookmarkCache = {
        isbn13: isbn13,
        bookmarked: nextBookmarked,
        memoExists: nextBookmarked ? prev.memoExists : false,
      };
      queryClient.setQueryData(bookmarkKeys.detail(isbn13), next);

      return { prev };
    },
    onSuccess: (fresh: BookmarkCache) => {
      queryClient.setQueryData(bookmarkKeys.detail(isbn13), fresh);

      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
    onError: (_err, _vars, context) => {
      console.error('[bookmark][mutation-error]', { _err, context });
      if (context?.prev) {
        queryClient.setQueryData(bookmarkKeys.detail(isbn13), context.prev);
      }
    },
    onSettled: () => {
      if (!user?.id) return;
      queryClient.invalidateQueries({ queryKey: myBooksKeys.all });
      queryClient.removeQueries({ queryKey: bookmarkKeys.memo(user.id, isbn13) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.tags.detail(user.id, isbn13) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.detail(isbn13) });
    },
  });

  return {
    toggle: (bookmarked: boolean, options?: Parameters<typeof mutation.mutate>[1]) =>
      mutation.mutate(bookmarked, options),
    isLoading: mutation.isPending,
  };
};
