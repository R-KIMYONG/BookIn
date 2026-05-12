import { myBooksFetchMap } from '@/shared/domain/mybooks/myBooksFetchMap';
import { FetchMyBooksParams, MyBooksQueryResult } from '@/shared/domain/mybooks/types';

export const fetchMyBooks = async (params: FetchMyBooksParams): Promise<MyBooksQueryResult> => {
  const fetcher = myBooksFetchMap[params.tab];

  const res = await fetcher(params);

  return { tab: params.tab, ...res };
};
