import { useQuery, useQueryClient } from '@tanstack/react-query';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { myStatusKeys } from '@/shared/domain/book/queryKeys';
import { ItemId } from '@/shared/domain/book/ids';
import { MyStatus } from '@/shared/domain/book/types';
import { LikeCache } from '@/shared/domain/like/types';
import { BookmarkCache } from '@/shared/domain/bookmark/types';
import { MINUTE } from '@/shared/constants/time';
import { useAuth } from '@/shared/context/AuthContext';

export const useMyStatus = (itemIds: ItemId[]) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useQuery<MyStatus[]>({
    queryKey: myStatusKeys.batch(itemIds),
    queryFn: async () => {
      const res = await fetch(`/api/my-status?ids=${itemIds.join(',')}`);
      if (!res.ok) throw new Error('myStatus fetch 실패');
      const rows: MyStatus[] = await res.json();

      rows.forEach((s) => {
        queryClient.setQueryData(
          likeKeys.detail(s.itemId),
          (old?: LikeCache): LikeCache => ({
            itemId: s.itemId,
            liked: s.liked,
            liked_count: old?.liked_count ?? 0,
          })
        );
        queryClient.setQueryData(
          bookmarkKeys.detail(s.itemId),
          (): BookmarkCache => ({
            itemId: s.itemId,
            bookmarked: s.bookmarked,
            memoExists: s.memoExists,
          })
        );
      });

      return rows;
    },
    enabled: itemIds.length > 0 && !!user,
    staleTime: 3 * MINUTE,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: [],
  });
};
