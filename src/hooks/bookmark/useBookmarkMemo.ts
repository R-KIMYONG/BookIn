import { MINUTE } from '@/shared/constants/time';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { getBookmarkMemo } from '@/shared/lib/bookmark/getBookmarkMemo';
import { useQuery } from '@tanstack/react-query';

export const useBookmarkMemo = (isbn: string, userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: bookmarkKeys.memo(userId, isbn),
    queryFn: () => getBookmarkMemo(isbn),
    enabled,
    staleTime: 5 * MINUTE,
  });
};
