import { HOUR } from '@/shared/constants/time';
import { categoryKeys } from '@/shared/domain/category/queryKeys';
import { CategoryNode } from '@/shared/domain/category/types';
import { useQuery } from '@tanstack/react-query';

export const useCategoryTree = (enabled: boolean) =>
  useQuery<CategoryNode[]>({
    queryKey: categoryKeys.tree,
    queryFn: async () => {
      const res = await fetch('/api/categories');

      if (!res.ok) throw Error('category list fetching fail');

      return res.json();
    },
    enabled,
    staleTime: 24 * HOUR,
  });
