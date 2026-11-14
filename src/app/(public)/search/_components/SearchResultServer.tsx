import { TargetTypes } from '@/shared/constants/category';
import { searchKeys } from '@/shared/domain/search/queryKeys';
import { SearchOptionType } from '@/shared/domain/search/types';
import { prefetchBookInteractions } from '@/shared/lib/server/entities/prefetchBookInteractions';
import { getYes24Search } from '@/shared/lib/yes24/getYes24Search';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import SearchResultContainer from './SearchResultContainer';
import { Suspense } from 'react';
import { RailsSkeleton } from '@/app/(private)/mypage/_components/recommend/rail/RailsSkeleton';
import SearchRailServer from './SearchRailServer';

type SearchResultServerProps = SearchOptionType & {
  target?: TargetTypes;
  page: number;
};

const SearchResultServer = async ({ keyword, target, category, sort, page }: SearchResultServerProps) => {
  const queryClient = new QueryClient();
  const searchResult = await getYes24Search({ query: keyword, category, sort, page });
  queryClient.setQueryData(searchKeys.list({ query: keyword, category, sort, page }), searchResult);
  const itemIds = searchResult.items.map((book) => book.itemId);

  await prefetchBookInteractions(queryClient, itemIds);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchResultContainer keyword={keyword} target={target} category={category} sort={sort} page={page} />
      <section className="mt-10 px-1 sm:px-6 md:px-10">
        <Suspense fallback={<RailsSkeleton col={1} />}>
          <SearchRailServer resultItemIds={itemIds} />
        </Suspense>
      </section>
    </HydrationBoundary>
  );
};

export default SearchResultServer;
