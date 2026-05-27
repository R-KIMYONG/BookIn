import 'server-only';

import { QueryType } from '@/shared/domain/aladin/constants';
import { Book, Item } from '@/shared/types/api';
import { normalizeBook } from '../book/normalizeBook';
import { PagedResult } from '@/shared/domain/aladin/types';
import { buildBookListParams } from './buildBookListParams';
import { DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';

type GetAladinListParams = {
  queryType: QueryType;
  page: number;
  target?: TargetTypes;
  categoryId?: number;
};
export const getAladinList = async ({
  queryType,
  page,
  target = DEFAULT_TARGET,
  categoryId,
}: GetAladinListParams): Promise<PagedResult<Item>> => {
  const ttbKey = process.env.ALADIN_TTB_KEY;

  if (!ttbKey) {
    throw new Error('ALADIN_TTB_KEY is missing');
  }

  const params = buildBookListParams({ queryType, page, target, categoryId });

  params.set('ttbkey', ttbKey);
  params.set('SearchTarget', target);
  params.set('MaxResults', '20');
  params.set('Cover', 'Big');
  params.set('Output', 'js');
  params.set('Version', '20131101');
  params.set('Start', String(page));

  const apiUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?${params.toString()}`;

  const res = await fetch(apiUrl, {
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
