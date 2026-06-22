import 'server-only';

import { Book, AladinBookInfo } from '@/shared/types/api';
import { normalizeBook } from '../book/normalizeBook';
import { PagedResult, QueryType } from '@/shared/domain/aladin/types';
import { buildBookListParams } from './buildBookListParams';
import { TargetTypes } from '@/shared/constants/category';
import { ALADIN_ITEMLIST_KEYS } from '@/shared/domain/aladin/constants';

type GetAladinListParams = {
  queryType: QueryType;
  page: number;
  target: TargetTypes;
  categoryId?: number;
  signal?: AbortSignal;
};
export const getAladinList = async ({
  queryType,
  page,
  target,
  categoryId,
  signal,
}: GetAladinListParams): Promise<PagedResult<AladinBookInfo>> => {
  const ttbKey = process.env.ALADIN_TTB_KEY;

  if (!ttbKey) {
    throw new Error('ALADIN_TTB_KEY is missing');
  }

  const params = buildBookListParams({ queryType, page, target, categoryId }, ALADIN_ITEMLIST_KEYS);

  params.set('ttbkey', ttbKey);
  params.set('MaxResults', '20');
  params.set('Cover', 'Big');
  params.set('Output', 'js');
  params.set('Version', '20131101');

  const apiUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?${params.toString()}`;

  const res = await fetch(apiUrl, {
    signal,
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) {
    throw new Error(`Aladin API Error ${res.status}`);
  }

  const data: Book = await res.json();
  return {
    items: (data.item ?? []).map(normalizeBook),
    totalResults: Number(data.totalResults ?? 0),
    itemsPerPage: Number(data.itemsPerPage ?? 20),
  };
};
