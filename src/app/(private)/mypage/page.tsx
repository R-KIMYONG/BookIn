import React from 'react';
import { Metadata } from 'next';
import Mypage from './_components/Mypage';
import { MYBOOKS_DEFAULT_TAB, MyBooksTabType } from '@/shared/domain/mypage/tab';
import { MyBooksSort, SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { FILTER_DEFAULT, MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SEARCH_FIELD_DEFAULT, SearchField } from '@/shared/domain/mybooks/search';
import { MYPAGE_DEFAULT_SECTION, MypageSectionType } from '@/shared/domain/mypage/section';
import { TAG_DEFAULT } from '@/shared/domain/tag/constants';

export const metadata: Metadata = {
  title: '마이페이지',
  description:
    '환영합니다! 여기는 당신의 개인 공간입니다. 회원정보를 확인하고, 댓글을 관리하며 다양한 활동을 즐길 수 있는 곳입니다. 자유롭게 탐색해 보세요!',
};
const ProfilePage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;

  const tab: MyBooksTabType = params.tab === 'comment' || params.tab === 'bookmark' ? params.tab : MYBOOKS_DEFAULT_TAB;

  const page = typeof params.page === 'string' ? Math.max(1, Number(params.page) || 1) : 1;

  const sort: MyBooksSort = typeof params.sort === 'string' ? (params.sort as MyBooksSort) : SORT_DEFAULT;

  const search = typeof params.search === 'string' ? params.search : '';

  const memoFilter: MyBooksFilter =
    typeof params.filter === 'string' ? (params.filter as MyBooksFilter) : FILTER_DEFAULT;

  const searchField: SearchField | undefined =
    typeof params.searchField === 'string' ? (params.searchField as SearchField) : SEARCH_FIELD_DEFAULT[tab];

  const tagId = typeof params.tagId === 'string' ? params.tagId : TAG_DEFAULT;

  const section = typeof params.section === 'string' ? (params.section as MypageSectionType) : MYPAGE_DEFAULT_SECTION;

  return (
    <Mypage
      page={page}
      tab={tab}
      sort={sort}
      search={search}
      memoFilter={memoFilter}
      searchField={searchField}
      tagId={tagId}
      section={section}
    />
  );
};

export default ProfilePage;
