import React from 'react';
import { Metadata } from 'next';
import Mypage from './_components/Mypage';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { MYBOOKS_DEFAULT_TAB, MyBooksTabType } from '@/shared/domain/mypage/tab';
import { MyBooksSort, SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { FILTER_DEFAULT, MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SEARCH_FIELD_DEFAULT, SearchField } from '@/shared/domain/mybooks/search';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import { fetchMyBooksServer } from '@/hooks/mybooks/fetchMyBooksServer';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { MypageSectionType } from '@/shared/domain/mypage/section';
import { normalizeMyBooksKey } from '@/shared/domain/mybooks/normalizeMyBooksKey';
import { BookmarkInfo } from '@/shared/domain/bookmark/types';
import { createClient } from '@/shared/lib/supabase/server';
import { BookmarkBook } from '@/shared/domain/mybooks/types';
import { getUserTagsServer } from '@/shared/lib/server/entities/getUserTagsServer';
import { TAG_DEFAULT } from '@/shared/domain/tag/constants';

export const metadata: Metadata = {
  title: '마이페이지',
  description:
    '환영합니다! 여기는 당신의 개인 공간입니다. 회원정보를 확인하고, 댓글을 관리하며 다양한 활동을 즐길 수 있는 곳입니다. 자유롭게 탐색해 보세요!',
  icons: {
    icon: '/projectbookin.ico',
  },
};
const ProfilePage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const params = await searchParams;

  const queryClient = new QueryClient();

  const tab: MyBooksTabType = params.tab === 'comment' || params.tab === 'bookmark' ? params.tab : MYBOOKS_DEFAULT_TAB;

  const page = typeof params.page === 'string' ? Math.max(1, Number(params.page) || 1) : 1;

  const sort: MyBooksSort = typeof params.sort === 'string' ? (params.sort as MyBooksSort) : SORT_DEFAULT;

  const search = typeof params.search === 'string' ? params.search : '';

  const memoFilter: MyBooksFilter =
    typeof params.filter === 'string' ? (params.filter as MyBooksFilter) : FILTER_DEFAULT;

  const searchField: SearchField | undefined =
    typeof params.searchField === 'string' ? (params.searchField as SearchField) : SEARCH_FIELD_DEFAULT[tab];

  const tagId = typeof params.tagId === 'string' ? params.tagId : TAG_DEFAULT;

  const section = typeof params.section === 'string' ? (params.section as MypageSectionType) : 'myBooks';

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
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Mypage />
    </HydrationBoundary>
  );
};

export default ProfilePage;
