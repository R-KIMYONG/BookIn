import { QueryClient } from '@tanstack/react-query';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';

export const clearPersonalQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: likeKeys.all });
  queryClient.removeQueries({ queryKey: bookmarkKeys.all });
  queryClient.removeQueries({ queryKey: ['myStatus'] });
  queryClient.removeQueries({ queryKey: recommendationsKey.all });
};
