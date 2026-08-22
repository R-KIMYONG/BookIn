import EmptyState from '@/components/common/EmptyState';
import { DEFAULT_TARGET, TARGET_LIST, TargetTypes } from '@/shared/constants/category';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { statsKeys } from '@/shared/domain/book/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { DEFAULT_SEARCH_QT, SEARCH_QT_LIST } from '@/shared/domain/search/constants';
import { SearchQueryType } from '@/shared/domain/search/types';
import { getAladinSearch } from '@/shared/lib/aladin/getAladinSearch.server';
import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const searchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; target?: TargetTypes; sq?: SearchQueryType; ci: string }>;
}) => {
  const rawSearchParams = await searchParams;

  const queryClient = new QueryClient();

  const keyword = rawSearchParams.q?.trim() ?? '';

  if (!keyword)
    return <EmptyState title={`검색어를 입력하세요`} description="검색어나 검색 옵션을 다시 확인해 주세요." />;

  const rawPage = Number(rawSearchParams.page ?? '1');
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const rawTarget = rawSearchParams.target?.trim() as TargetTypes;
  const target = TARGET_LIST.includes(rawTarget) ? rawTarget : DEFAULT_TARGET;

  const categoryId = Number(rawSearchParams.ci?.trim()) || 0;

  const rawSearchQueryType = (rawSearchParams.sq ?? DEFAULT_SEARCH_QT).trim() as SearchQueryType;
  const searchQueryType = SEARCH_QT_LIST.includes(rawSearchQueryType) ? rawSearchQueryType : DEFAULT_SEARCH_QT;

  const searchList = await getAladinSearch({ keyword, page, target, categoryId, searchQueryType });

  queryClient.setQueryData(
    aladinKeys.search({ searchKeyWord: keyword, searchQueryType, page, target, categoryId }),
    searchList
  );

  const isbnList = (searchList?.items ?? []).map((item) => item.isbn13).filter(Boolean);
  const itemListSet = [...new Set([...isbnList])];

  if (itemListSet.length > 0) {
    const [likes, likeCounts, bookmarks, statsMap] = await Promise.all([
      getLikesByIsbnList(itemListSet),
      getLikeCountsByIsbnList(itemListSet),
      getBookmarksByIsbnList(itemListSet),
      getBookStatsByIsbn(itemListSet),
    ]);

    for (const isbn of itemListSet) {
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
    queryClient.setQueryData(statsKeys.batch(itemListSet), statsMap);
    queryClient.setQueryData(
      likeKeys.countBatch(itemListSet),
      itemListSet.map((isbn) => ({ isbn13: isbn, liked_count: likeCounts[isbn] ?? 0 }))
    );
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>page</div>
    </HydrationBoundary>
  );
};

export default searchPage;
