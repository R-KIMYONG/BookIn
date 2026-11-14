import EmptyState from '@/components/common/EmptyState';
import { TARGET_LIST, TargetTypes } from '@/shared/constants/category';
import { toPage, toSearchCategory, toSearchSort } from '@/shared/lib/yes24/searchParams';
import SearchOptionView from './_components/SearchOptionView';
import { Suspense } from 'react';
import SearchResultServer from './_components/SearchResultServer';
import SearchResultSkeleton from './_components/SearchResultSkeleton';
export const maxDuration = 60;

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

  return (
    <>
      <SearchOptionView keyword={query} category={category} sort={sort} />
      <Suspense key={`${query}|${category}|${sort}|${page}`} fallback={<SearchResultSkeleton />}>
        <SearchResultServer keyword={query} target={target} category={category} sort={sort} page={page} />
      </Suspense>
    </>
  );
};

export default searchPage;
