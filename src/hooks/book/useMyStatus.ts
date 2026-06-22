import { useQuery, useQueryClient } from '@tanstack/react-query';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { MINUTE } from '@/shared/constants/time';
import { useAuth } from '@/shared/context/AuthContext';

type MyStatus = { isbn13: string; liked: boolean; bookmarked: boolean; memoExists: boolean };

export const useMyStatus = (isbnList: string[]) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useQuery<MyStatus[]>({
    queryKey: ['myStatus', [...isbnList].sort().join(',')],
    queryFn: async () => {
      const res = await fetch(`/api/my-status?ids=${isbnList.join(',')}`);
      if (!res.ok) throw new Error('myStatus fetch 실패');
      const rows: MyStatus[] = await res.json();

      rows.forEach((s) => {
        queryClient.setQueryData(likeKeys.detail(s.isbn13), (old: any) => ({
          isbn13: s.isbn13,
          liked: s.liked,
          liked_count: old?.liked_count ?? 0,
        }));
        queryClient.setQueryData(bookmarkKeys.detail(s.isbn13), () => ({
          isbn13: s.isbn13,
          bookmarked: s.bookmarked,
          memoExists: s.memoExists,
        }));
      });

      return rows;
    },
    enabled: isbnList.length > 0 && !!user,
    staleTime: 3 * MINUTE,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: [],
  });
};
