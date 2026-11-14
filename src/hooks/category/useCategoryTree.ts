import { HOUR } from '@/shared/constants/time';
import { categoryKeys } from '@/shared/domain/category/queryKeys';
import { CategoryNode } from '@/shared/domain/category/types';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const categoryTreeQueryOptions = queryOptions({
  queryKey: categoryKeys.tree,
  queryFn: async (): Promise<CategoryNode[]> => {
    const res = await fetch('/api/categories');
    if (!res.ok) throw Error('category list fetching fail');

    return res.json();
  },
  staleTime: 24 * HOUR,
});

export const useCategoryTree = (enabled: boolean) =>
  useQuery({
    ...categoryTreeQueryOptions,
    enabled,
  });
