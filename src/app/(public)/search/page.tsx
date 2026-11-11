import EmptyState from '@/components/common/EmptyState';
import { TARGET_LIST, TargetTypes } from '@/shared/constants/category';
import { searchKeys } from '@/shared/domain/search/queryKeys';
import { getYes24Search } from '@/shared/lib/yes24/getYes24Search';
import { toPage, toSearchCategory, toSearchSort } from '@/shared/lib/yes24/searchParams';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import SearchResultContainer from './_components/SearchResultContainer';
import SearchOptionView from './_components/SearchOptionView';
import { prefetchBookInteractions } from '@/shared/lib/server/entities/prefetchBookInteractions';
import { Suspense } from 'react';
import SearchRailServer from './_components/SearchRailServer';
import { RailsSkeleton } from '@/app/(private)/mypage/_components/recommend/rail/RailsSkeleton';

type SearchPageParams = {
  q?: string;
  page?: string;
  target?: string;
  sort?: string;
};

const searchPage = async ({ searchParams }: { searchParams: Promise<SearchPageParams> }) => {
  const rawSearchParams = await searchParams;

  const query = rawSearchParams.q?.trim() ?? '';
  if (!query) {
    return <EmptyState title="검색어를 입력하세요" description="검색어나 검색 옵션을 다시 확인해 주세요." />;
  }

  // YES24 호출용 (URL 값 → 검증된 YES24 값)
  const category = toSearchCategory(rawSearchParams.target ?? null);
  const sort = toSearchSort(rawSearchParams.sort ?? null);
  const page = toPage(rawSearchParams.page ?? null);

  // 페이지 이동 시 URL에 다시 담을 BookIn 값 (없으면 전체 검색)
  const rawTarget = rawSearchParams.target?.trim();
  const target = rawTarget && TARGET_LIST.includes(rawTarget as TargetTypes) ? (rawTarget as TargetTypes) : undefined;

  const queryClient = new QueryClient();
  const searchResult = await getYes24Search({ query, category, sort, page });
  queryClient.setQueryData(searchKeys.list({ query, category, sort, page }), searchResult);

  const itemIds = searchResult.items.map((book) => book.itemId);

  await prefetchBookInteractions(queryClient, itemIds);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchOptionView keyword={query} category={category} sort={sort} />
      <SearchResultContainer keyword={query} target={target} category={category} sort={sort} page={page} />
      {/* 추천은 계산이 오래 걸릴 수 있어 따로 스트리밍 → 검색 결과가 먼저 보임 */}
      <section className="mt-10 px-1 sm:px-6 md:px-10">
        <Suspense fallback={<RailsSkeleton col={1} />}>
          <SearchRailServer resultItemIds={itemIds} />
        </Suspense>
      </section>
    </HydrationBoundary>
  );
};

export default searchPage;
