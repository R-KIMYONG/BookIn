import { QueryType } from '@/shared/domain/aladin/constants';
import { Item } from '@/shared/types/api';
import { PagedResult } from '@/shared/domain/aladin/types';
import { buildBookListParams } from './buildBookListParams';
import { DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';

type FetchAladinListParams = {
  queryType: QueryType;
  page: number;
  target?: TargetTypes;
  categoryId?: number;
};

export const fetchAladinList = async ({
  queryType,
  page,
  target = DEFAULT_TARGET,
  categoryId,
}: FetchAladinListParams): Promise<PagedResult<Item>> => {
  const params = buildBookListParams({ queryType, page, target, categoryId });

  const res = await fetch(`/api/aladin/list?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`AladinApi ${res.status}`);
  }

  const data = await res.json();

  return data;
};
