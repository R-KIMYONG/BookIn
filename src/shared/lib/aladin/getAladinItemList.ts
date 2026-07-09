import 'server-only';

import { MAX_RESULTS } from '@/shared/domain/aladin/constants';
import { TargetTypes } from '@/shared/constants/category';
import { QueryType } from '@/shared/domain/aladin/types';

type GetAladinItemListArgs = {
  target: TargetTypes;
  queryType: QueryType;
  categoryId?: string;
  page: number;
  maxResults?: number;
};

export const getAladinItemList = async ({ target, queryType, categoryId, page, maxResults }: GetAladinItemListArgs) => {
  //target : 'Book' | 'Foreign' | 'eBook' SerchTarget에필요함
  //queryType :  Bestseller' | 'ItemNewAll' | 'ItemNewSpecial' | 'BlogBest' |
  //categoryId : 예시)'12345'CategoryId에 넣을때 필요함 소분류고 문자열로옴
  //page: 몇페이지 아이템어레이를 가져올지 결정함 -> 숫자로옴

  const params = new URLSearchParams({
    ttbkey: process.env.ALADIN_TTB_KEY ?? '',
    QueryType: queryType,
    SearchTarget: target,
    Start: String(page),
    MaxResults: String(maxResults ?? MAX_RESULTS),
    Cover: 'Big',
    Output: 'js',
    Version: '20131101',
  });

  if (categoryId) params.set('CategoryId', categoryId);

  const url = `https://www.aladin.co.kr/ttb/api/ItemList.aspx?${params.toString()}`;

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Aladin API ${response.status}`);

  const data = await response.json();
  const items = Array.isArray(data.item) ? data.item : [];

  return { data, itemsCount: items.length };
};
