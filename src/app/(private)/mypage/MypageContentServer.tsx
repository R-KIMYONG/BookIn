import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import MypageContent from './_components/MypageContent';
import { MYPAGE_DEFAULT_SECTION } from '@/shared/domain/mypage/section';
import { getRecommendations } from '@/shared/lib/server/entities/getRecommendations';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { normalizeMyBooksKey } from '@/shared/domain/mybooks/normalizeMyBooksKey';
import { fetchMyBooksServer } from '@/hooks/mybooks/fetchMyBooksServer';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import { SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { BookmarkBook } from '@/shared/domain/mybooks/types';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { getUserTagsServer } from '@/shared/lib/server/entities/getUserTagsServer';
import { MypageProps } from '@/shared/domain/mypage/types';
import { prefetchBookInteractions } from '@/shared/lib/server/entities/prefetchBookInteractions';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';

const MypageContentServer = async ({
  page,
  sort,
  search,
  tab,
  memoFilter,
  searchField,
  tagId,
  section,
}: MypageProps) => {
  const user = await getCurrentUser();
  const userId = user?.id;

  const queryClient = new QueryClient();
  if (section !== MYPAGE_DEFAULT_SECTION && userId) {
    const data = await getRecommendations(userId).catch(() => null);

    if (data) queryClient.setQueryData(recommendationsKey.all, data);
  }

  if (section === MYPAGE_DEFAULT_SECTION) {
    const result = await queryClient.fetchQuery({
      queryKey: myBooksKeys.list(
        normalizeMyBooksKey({
          tab,
          page,
          sort,
          filter: tab === 'bookmark' ? memoFilter : undefined,
          search,
          searchField,
          tagId: tab === 'bookmark' ? tagId : undefined,
        })
      ),
      queryFn: () =>
        fetchMyBooksServer({
          tab,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
          sort: sort ?? SORT_DEFAULT,
          memoFilter: memoFilter ?? undefined,
          search,
          searchField,
          tagId,
        }),
    });
    const itemIds = result.data.map((v) => v.itemId);

    await prefetchBookInteractions(queryClient, itemIds);

    if (tab === 'bookmark' && userId) {
      for (const book of result.data as BookmarkBook[]) {
        queryClient.setQueryData(bookmarkKeys.tags.detail(userId, book.itemId), { tags: book.tags ?? [] });
      }
    }
    await queryClient.prefetchQuery({ queryKey: bookmarkKeys.tags.user(), queryFn: getUserTagsServer });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MypageContent />
    </HydrationBoundary>
  );
};

export default MypageContentServer;
