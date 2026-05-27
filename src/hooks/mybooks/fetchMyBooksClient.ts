import { myBooksFetchClientMap } from '@/shared/domain/mybooks/myBooksFetchClientMap';
import { FetchMyBooksParams, MyBooksQueryResult } from '@/shared/domain/mybooks/types';

export const fetchMyBooksClient = async (params: FetchMyBooksParams) => {
  const fetcher = myBooksFetchClientMap[params.tab];

  const res = await fetcher(params);

  return { tab: params.tab, ...res } as MyBooksQueryResult;
};
