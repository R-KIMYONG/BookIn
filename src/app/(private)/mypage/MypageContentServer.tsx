import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import MypageContent from './_components/MypageContent';
import { MYPAGE_DEFAULT_SECTION } from '@/shared/domain/mypage/section';
import { getRecommendations } from '@/shared/lib/server/entities/getRecommendations';
import { recommendationsKey } from '@/shared/domain/recommend/queryKeys';
import { createClient } from '@/shared/lib/supabase/server';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { normalizeMyBooksKey } from '@/shared/domain/mybooks/normalizeMyBooksKey';
import { fetchMyBooksServer } from '@/hooks/mybooks/fetchMyBooksServer';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import { SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { BookmarkInfo } from '@/shared/domain/bookmark/types';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { BookmarkBook } from '@/shared/domain/mybooks/types';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { getUserTagsServer } from '@/shared/lib/server/entities/getUserTagsServer';
import { MypageProps } from '@/shared/domain/mypage/types';

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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
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
    const isbnList = result.data.map((v) => v.isbn13);
    let likes: Record<string, boolean> = {};

    let likeCounts: Record<string, number> = {};

    let bookmarks: Record<string, BookmarkInfo> = {};

    if (tab === 'like') {
      [likes, likeCounts] = await Promise.all([getLikesByIsbnList(isbnList), getLikeCountsByIsbnList(isbnList)]);
    }

    if (tab === 'bookmark') {
      bookmarks = await getBookmarksByIsbnList(isbnList);
    }
    for (const isbn of isbnList) {
      if (tab === 'like') {
        queryClient.setQueryData(likeKeys.detail(isbn), {
          isbn13: isbn,
          liked: likes[isbn] ?? false,
          liked_count: likeCounts[isbn] ?? 0,
        });
      }

      if (tab === 'bookmark') {
        const book = (result.data as BookmarkBook[]).find((b) => b.isbn13 === isbn);
        queryClient.setQueryData(bookmarkKeys.detail(isbn), {
          isbn13: isbn,
          bookmarked: bookmarks[isbn]?.bookmarked ?? false,
          memoExists: !!book?.memo,
        });
      }
    }
    if (tab === 'bookmark' && userId) {
      for (const book of result.data as BookmarkBook[]) {
        queryClient.setQueryData(bookmarkKeys.tags.detail(userId, book.isbn13), { tags: book.tags ?? [] });
      }
    }
    await queryClient.prefetchQuery({
      queryKey: bookmarkKeys.tags.user(),
      queryFn: getUserTagsServer,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MypageContent />
    </HydrationBoundary>
  );
};

export default MypageContentServer;
