import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CategoryList from './CategoryList';
import { Yes24ListType } from '@/shared/lib/yes24/types';
import { getYes24List } from '@/shared/lib/yes24/getYes24List';
import { CATEGORY_LIST_SIZE, HOME_LIST_SIZE } from '@/shared/lib/yes24/constants';
import { CategoryId } from '@/shared/domain/book/ids';
import { bookListKeys } from '@/shared/domain/book/queryKeys';
import { prefetchBookInteractions } from '@/shared/lib/server/entities/prefetchBookInteractions';

type CategoryListWrapperProps = {
  categoryId: CategoryId;
  listType: Yes24ListType;
  page: number;
  tabs: Yes24ListType[];
};

const CategoryListWrapper = async ({ categoryId, listType, page, tabs }: CategoryListWrapperProps) => {
  const queryClient = new QueryClient();

  try {
    const list = await getYes24List({ listType, categoryId, pageSize: CATEGORY_LIST_SIZE, page });

    queryClient.setQueryData(bookListKeys.list({ listType, categoryId, pageSize: CATEGORY_LIST_SIZE, page }), list);

    await prefetchBookInteractions(
      queryClient,
      list.items.map((book) => book.itemId)
    );
  } catch (error) {
    console.error(`카테고리 목록 조회 실패 (${categoryId} / ${listType} / ${page}p)`, error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryList categoryId={categoryId} tabs={tabs} listType={listType} page={page} />
    </HydrationBoundary>
  );
};

export default CategoryListWrapper;
