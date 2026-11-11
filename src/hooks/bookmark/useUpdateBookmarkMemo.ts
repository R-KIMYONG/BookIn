import { ItemId } from '@/shared/domain/book/ids';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { BookmarkMemoView, SaveInput } from '@/shared/domain/tag/types';
import { updateBookmarkMemo } from '@/shared/lib/bookmark/updateBookmarkMemo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useUpdateBookmarkMemo = (userId: string, itemId: ItemId) => {
  const queryClient = useQueryClient();

  return useMutation<BookmarkMemoView, Error, SaveInput>({
    mutationFn: (input: SaveInput) => updateBookmarkMemo({ itemId, ...input }),
    onSuccess: (fresh) => {
      queryClient.setQueryData(bookmarkKeys.memo(userId, itemId), (prev: BookmarkMemoView | undefined) => {
        if (!prev) return prev;

        return { ...prev, memo: fresh.memo ?? null, tags: fresh.tags };
      });
      toast.dismiss(`bookmark-memo-suggest-${itemId}`);
      if (userId) {
        queryClient.invalidateQueries({ queryKey: myBooksKeys.all });
        queryClient.invalidateQueries({ queryKey: bookmarkKeys.tags.user() });
      }
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.memo(userId, itemId) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.tags.detail(userId, itemId) });
    },
  });
};
