import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAladinList } from '@/shared/lib/aladin/getAladinList.server';
import { getLastPageServer } from '@/shared/lib/aladin/getLastPageServer';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { QueryType } from '@/shared/domain/aladin/constants';
import { TargetTypes } from '@/shared/constants/category';
import CategoryList from './CategoryList';

type CategoryListWrapperProps = {
  categoryId: number;
  queryType: QueryType;
  target: TargetTypes;
  page: number;
};

const CategoryListWrapper = async ({ categoryId, queryType, target, page }: CategoryListWrapperProps) => {
  const queryClient = new QueryClient();

  const [listData, lastPageData] = await Promise.all([
    getAladinList({ queryType, page, target, categoryId }),
    getLastPageServer({ queryType, target, categoryId }),
  ]);

  queryClient.setQueryData(aladinKeys.list({ queryType, page, target, categoryId }), listData);
  queryClient.setQueryData(aladinKeys.lastPage({ queryType, target, categoryId }), lastPageData);

  const isbnList = (listData?.items ?? []).map((item) => item.isbn13);

  if (isbnList.length > 0) {
    const [likes, likeCounts, bookmarks] = await Promise.all([
      getLikesByIsbnList(isbnList),
      getLikeCountsByIsbnList(isbnList),
      getBookmarksByIsbnList(isbnList),
    ]);

    for (const isbn of isbnList) {
      queryClient.setQueryData(likeKeys.detail(isbn), {
        isbn13: isbn,
        liked: likes[isbn] ?? false,
        liked_count: likeCounts[isbn] ?? 0,
      });
      queryClient.setQueryData(bookmarkKeys.detail(isbn), {
        isbn13: isbn,
        bookmarked: bookmarks[isbn]?.bookmarked ?? false,
        memoExists: bookmarks[isbn]?.memoExists ?? false,
      });
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryList categoryId={categoryId} queryType={queryType} target={target} page={page} />
    </HydrationBoundary>
  );
};

export default CategoryListWrapper;
