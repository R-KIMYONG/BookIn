import Category from '@/components/home/Category';
import { DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';
import { DEFAULT_QT, QUERY_TYPE_LIST, QueryType } from '@/shared/domain/aladin/constants';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { getAladinList } from '@/shared/lib/aladin/getAladinList.server';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ qt?: QueryType; page?: string; target?: TargetTypes }>;
}) => {
  const rawSearchParams = await searchParams;

  const rawQt = rawSearchParams.qt;

  const queryType: QueryType = QUERY_TYPE_LIST.includes(rawQt as QueryType) ? (rawQt as QueryType) : DEFAULT_QT;

  const target = (rawSearchParams.target as TargetTypes) ?? DEFAULT_TARGET;

  const page = Number(rawSearchParams.page ?? 1);

  const queryClient = new QueryClient();

  const listData = await getAladinList({ queryType, page, target });

  queryClient.setQueryData(aladinKeys.list({ queryType, page, target }), listData);

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
    <main className="px-1 sm:px-6 md:px-10 flex-1">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Category queryType={queryType} target={target} page={page} />
      </HydrationBoundary>
    </main>
  );
};
export default Home;
