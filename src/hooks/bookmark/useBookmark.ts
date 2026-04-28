import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '../useUser';
export type BookmarkCache = {
  isbn13: string;
  bookmarked: boolean;
  memoExists: boolean;
};
export const useBookmark = (bookInfo: { isbn13: string; title: string; cover: string; author: string }) => {
  const queryClient = useQueryClient();
  const isbn13 = bookInfo?.isbn13.trim();
  const queryKey = ['bookmark', isbn13 ?? ''] as const;
  const { data: user } = useUser();

  const mutation = useMutation({
    mutationFn: async (bookmarked: boolean) => {
      const requestId = crypto.randomUUID?.() ?? String(Date.now());

      const isbn13 = bookInfo?.isbn13?.trim();

      const title = bookInfo?.title ?? '(no-title)';

      if (!isbn13) {
        console.error('[bookmark][invalid-bookInfo]', {
          requestId,
          reason: 'missing isbn13',
          title,
          bookInfo,
        });

        throw new Error('bookInfo.isbn13 is required');
      }
      const method = bookmarked ? 'DELETE' : 'POST';
      const res = await fetch('/api/bookmark', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookInfo),
      });

      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        console.error('[bookmark][api-failed]', {
          requestId,
          method,
          isbn13,
          status: res.status,
          result,
        });
        throw new Error(result?.message ?? '북마크 실패');
      }

      return {
        isbn13,
        bookmarked: !!result.bookmarked,
        memoExists: !!result.memoExists,
      };
    },

    // optimistic update
    onMutate: async (bookmarked: boolean) => {
      const isbn13 = bookInfo?.isbn13?.trim();
      if (!isbn13) return;
      await queryClient.cancelQueries({ queryKey: queryKey });

      const prev = queryClient.getQueryData<BookmarkCache>(queryKey) ?? {
        isbn13: bookInfo.isbn13,
        bookmarked: false,
        memoExists: false,
      };
      const nextBookmarked = !bookmarked;
      const next: BookmarkCache = {
        isbn13: bookInfo.isbn13,
        bookmarked: nextBookmarked,
        memoExists: nextBookmarked ? prev.memoExists : false,
      };
      queryClient.setQueryData(queryKey, next);

      return { prev };
    },
    onSuccess: (fresh: BookmarkCache) => {
      queryClient.setQueryData(queryKey, fresh);
    },
    onError: (_err, _vars, context) => {
      console.error('[bookmark][mutation-error]', { _err, context });
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
          q.queryKey[1] === 'bookmark' &&
          q.queryKey[2] === user.id,
      });
      queryClient.removeQueries({ queryKey: ['bookmarkMemo', user.id, isbn13] });
      queryClient.invalidateQueries({ queryKey: ['detailBookmarkTags', user.id, isbn13] });
      queryClient.invalidateQueries({ queryKey: ['bookmark', isbn13] });
    },
  });

  return {
    toggle: (bookmarked: boolean, options?: Parameters<typeof mutation.mutate>[1]) =>
      mutation.mutate(bookmarked, options),
    isLoading: mutation.isPending,
  };
};
