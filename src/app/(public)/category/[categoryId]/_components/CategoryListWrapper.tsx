import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAladinList } from '@/shared/lib/aladin/getAladinList.server';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { TargetTypes } from '@/shared/constants/category';
import CategoryList from './CategoryList';
import { QueryType } from '@/shared/domain/aladin/types';
import { Genre } from '@/shared/domain/category/types';
import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { statsKeys } from '@/shared/domain/book/queryKeys';
import { Sparkles } from 'lucide-react';
import BookRail from '@/app/(private)/mypage/_components/recommend/rail/BookRail';
import { getRelatedBooks } from '@/shared/lib/rails/getRelatedBooks';
import { getLastPageServer } from '@/shared/lib/aladin/getLastPageServer';

type CategoryListWrapperProps = {
  categoryId: number;
  queryType: QueryType;
  target: TargetTypes;
  page: number;
  genreData: Genre[];
};

const CategoryListWrapper = async ({ categoryId, queryType, target, page, genreData }: CategoryListWrapperProps) => {
  const queryClient = new QueryClient();

  const categoryLabel = genreData.find((b) => b.id === categoryId)?.label;

  const [listData, related, lastPage] = await Promise.all([
    getAladinList({ queryType, page, target, categoryId }),
    getRelatedBooks(undefined, categoryLabel),
    getLastPageServer({ queryType, target, categoryId }),
  ]);

  queryClient.setQueryData(aladinKeys.list({ queryType, page, target, categoryId }), listData);
  queryClient.setQueryData(aladinKeys.lastPage({ queryType, target, categoryId }), lastPage);

  const isbnList = (listData?.items ?? []).map((item) => item.isbn13);
  const relatedIsbns = related.map((b) => b.isbn13);

  const allIsbns = [...new Set([...isbnList, ...relatedIsbns])];

  let relatedView = related;

  if (allIsbns.length > 0) {
    const [likes, likeCounts, bookmarks, statsMap] = await Promise.all([
      getLikesByIsbnList(allIsbns),
      getLikeCountsByIsbnList(allIsbns),
      getBookmarksByIsbnList(allIsbns),
      getBookStatsByIsbn(allIsbns),
    ]);

    for (const isbn of allIsbns) {
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
    relatedView = relatedView.map((book) => ({ ...book, stats: statsMap[book.isbn13] }));
    queryClient.setQueryData(statsKeys.batch(isbnList), statsMap);
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryList
        categoryId={categoryId}
        target={target}
        genreData={genreData}
        initialPage={page}
        initialQueryType={queryType}
        initialList={listData}
      />
      <BookRail icon={<Sparkles className="h-4 w-4" />} label="새로운 발견" books={relatedView} />
    </HydrationBoundary>
  );
};

export default CategoryListWrapper;
