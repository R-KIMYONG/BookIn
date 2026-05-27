import { useQuery } from '@tanstack/react-query';
import { MINUTE } from '@/shared/constants/time';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { Tag } from '@/shared/domain/tag/types';

export const useUserTags = () => {
  return useQuery<Tag[]>({
    queryKey: bookmarkKeys.tags.user(),

    queryFn: async () => {
      const response = await fetch('/api/user/tags');

      if (!response.ok) {
        throw new Error('태그 조회 실패');
      }

      const data = await response.json();

      return data;
    },
    staleTime: 5 * MINUTE,
  });
};
