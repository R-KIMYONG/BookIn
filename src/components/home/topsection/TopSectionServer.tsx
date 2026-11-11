import { TOP_VIEW_LIMIT } from '@/shared/domain/ranking/constants';
import { rankingKeys } from '@/shared/domain/ranking/queryKeys';
import { getRankedBooks } from '@/shared/lib/server/entities/getRankedBooks';
import { getTopViewBooks } from '@/shared/lib/server/entities/getTopViewBooks';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import TopSection from './TopSection';
import { prefetchBookInteractions } from '@/shared/lib/server/entities/prefetchBookInteractions';

const TopSectionServer = async () => {
  const queryClient = new QueryClient();

  const [topView, ranked] = await Promise.allSettled([
    getTopViewBooks().then((books) => {
      queryClient.setQueryData(rankingKeys.topViewBooks(TOP_VIEW_LIMIT), books);
      return books;
    }),
    getRankedBooks().then((books) => queryClient.setQueryData(rankingKeys.topRankingBooks(), books)),
  ]);

  if (topView.status === 'rejected') console.error('TOP5 조회 실패', topView.reason);
  if (ranked.status === 'rejected') console.error('랭킹 조회 실패', ranked.reason);

  if (topView.status === 'fulfilled') {
    await prefetchBookInteractions(
      queryClient,
      topView.value.map((book) => book.item_id)
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopSection />
    </HydrationBoundary>
  );
};

export default TopSectionServer;
