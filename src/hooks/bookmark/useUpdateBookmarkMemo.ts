import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { BookmarkMemoView, SaveInput } from '@/shared/domain/tag/types';
import { updateBookmarkMemo } from '@/shared/lib/bookmark/updateBookmarkMemo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useUpdateBookmarkMemo = (userId: string, bookKey: string) => {
  const queryClient = useQueryClient();

  return useMutation<BookmarkMemoView, Error, SaveInput>({
    mutationFn: (input: SaveInput) => updateBookmarkMemo({ isbn13: bookKey, ...input }),
    onSuccess: (fresh) => {
      queryClient.setQueryData(bookmarkKeys.memo(userId, bookKey), (prev: BookmarkMemoView | undefined) => {
        if (!prev) return prev;

        return { ...prev, memo: fresh.memo ?? null, tags: fresh.tags };
      });
      toast.dismiss(`bookmark-memo-suggest-${bookKey}`);
      if (userId) {
        queryClient.invalidateQueries({ queryKey: myBooksKeys.all });
        queryClient.invalidateQueries({ queryKey: bookmarkKeys.tags.user() });
      }
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.memo(userId, bookKey) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.tags.detail(userId, bookKey) });
    },
  });
};
