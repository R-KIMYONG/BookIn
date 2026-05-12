import { MyPageQuery } from '@/shared/domain/mybooks/types';

export const buildParams = (query: MyPageQuery) => {
  const isMyBooks = query.section === 'myBooks';

  return {
    section: query.section,
    tab: isMyBooks ? query.tab : null,
    page: query.page,
    search: isMyBooks ? query.search || null : null,
    searchField: isMyBooks ? query.searchField : null,
    sort: isMyBooks ? query.sort : null,
    filter: isMyBooks ? (query.filter ?? null) : null,
    tagId: isMyBooks ? (query.tagId ?? null) : null,
    modal: query.modal ?? null,
  };
};
