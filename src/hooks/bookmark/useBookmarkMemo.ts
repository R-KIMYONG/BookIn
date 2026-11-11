import { MINUTE } from '@/shared/constants/time';
import { ItemId } from '@/shared/domain/book/ids';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { getBookmarkMemo } from '@/shared/lib/bookmark/getBookmarkMemo';
import { useQuery } from '@tanstack/react-query';

export const useBookmarkMemo = (itemId: ItemId, userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: bookmarkKeys.memo(userId, itemId),
    queryFn: () => getBookmarkMemo(itemId),
    enabled,
    staleTime: 5 * MINUTE,
  });
};
