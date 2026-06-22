import Category from '@/components/home/Category';
import RecentBooks from '@/components/home/recentbooks/RecentBooks';
import TopSection from '@/components/home/TopSection';
import { DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';
import { DEFAULT_QT, QUERY_TYPE_LIST } from '@/shared/domain/aladin/constants';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { QueryType } from '@/shared/domain/aladin/types';
import { statsKeys } from '@/shared/domain/book/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { TOP_VIEW_LIMIT } from '@/shared/domain/ranking/constants';
import { rankingKeys } from '@/shared/domain/ranking/queryKeys';
import { recentbookKeys } from '@/shared/domain/recentbooks/queryKeys';
import { getAladinList } from '@/shared/lib/aladin/getAladinList.server';
import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { getRankedBooks } from '@/shared/lib/server/entities/getRankedBooks';
import { getRecentBooks } from '@/shared/lib/server/entities/getRecentBooks';
import { getTopViewBooks } from '@/shared/lib/server/entities/getTopViewBooks';
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

  const [listData, rankingBooks, topBooks] = await Promise.all([
    getAladinList({ queryType, page, target }),
    getRankedBooks(),
    getTopViewBooks(),
  ]);
  const topIsbnList = topBooks.map((b) => b.isbn13);
  queryClient.setQueryData(rankingKeys.topRankingBooks(), rankingBooks);
  queryClient.setQueryData(rankingKeys.topViewBooks(TOP_VIEW_LIMIT), topBooks);
  queryClient.setQueryData(aladinKeys.list({ queryType, page, target }), listData);

  const isbnList = (listData?.items ?? []).map((item) => item.isbn13).filter(Boolean);

  const allIsbns = [...new Set([...topIsbnList, ...isbnList])];

  if (allIsbns.length > 0) {
    const [likes, likeCounts, bookmarks, statsMap, rencentBooks] = await Promise.all([
      getLikesByIsbnList(allIsbns),
      getLikeCountsByIsbnList(allIsbns),
      getBookmarksByIsbnList(allIsbns),
      getBookStatsByIsbn(allIsbns),
      getRecentBooks(),
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
    queryClient.setQueryData(statsKeys.batch(isbnList), statsMap);
    queryClient.setQueryData(
      likeKeys.countBatch(isbnList),
      isbnList.map((isbn) => ({ isbn13: isbn, liked_count: likeCounts[isbn] ?? 0 }))
    );
    queryClient.setQueryData(recentbookKeys.list(), rencentBooks);
  }
  return (
    <main className="px-1 sm:px-6 md:px-10 flex-1">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TopSection />
        <RecentBooks />
        <Category target={target} />
      </HydrationBoundary>
    </main>
  );
};
export default Home;
