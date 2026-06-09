import { recentbookKeys } from '@/shared/domain/recentbooks/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteRecentBooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isbn13?: string) => {
      const fetchUrl = isbn13 ? `/api/recent-books?isbn13=${isbn13}` : '/api/recent-books';
      const response = await fetch(fetchUrl, { method: 'DELETE' });
      if (!response.ok) throw new Error('최근 본 책 삭제실패');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recentbookKeys.list() });
    },
  });
};
