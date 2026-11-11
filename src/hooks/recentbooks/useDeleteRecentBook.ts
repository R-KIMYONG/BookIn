import { ItemId } from '@/shared/domain/book/ids';
import { recentbookKeys } from '@/shared/domain/recentbooks/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteRecentBooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId?: ItemId) => {
      const fetchUrl = itemId ? `/api/recent-books?itemId=${itemId}` : '/api/recent-books';
      const response = await fetch(fetchUrl, { method: 'DELETE' });
      if (!response.ok) throw new Error('최근 본 책 삭제실패');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recentbookKeys.list() });
    },
  });
};
