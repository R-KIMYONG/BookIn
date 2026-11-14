import CategoryDrawer from './CategoryDrawer';
import { getYes24CategoryTree } from '@/shared/lib/yes24/getYes24CategoryTree';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { categoryTreeQueryOptions } from '@/hooks/category/useCategoryTree';

const CategoryDrawerServer = async () => {
  const queryClient = new QueryClient();

  try {
    queryClient.setQueryData(categoryTreeQueryOptions.queryKey, await getYes24CategoryTree());
  } catch (error) {
    console.error('헤더 카테고리 트리 조회 실패:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryDrawer />
    </HydrationBoundary>
  );
};

export default CategoryDrawerServer;
