import { myBooksFetchServerMap } from '@/shared/domain/mybooks/myBooksFetchServerMap';
import { FetchMyBooksParams, MyBooksQueryResult } from '@/shared/domain/mybooks/types';

export const fetchMyBooksServer = async (params: FetchMyBooksParams) => {
  const fetcher = myBooksFetchServerMap[params.tab];

  const res = await fetcher(params);

  return { tab: params.tab, ...res } as MyBooksQueryResult;
};
