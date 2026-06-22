import { AladinBookInfo } from '@/shared/types/api';
import { PagedResult, QueryType } from '@/shared/domain/aladin/types';
import { buildBookListParams } from './buildBookListParams';
import { TargetTypes } from '@/shared/constants/category';
import { APP_QUERY_KEYS } from '@/shared/domain/aladin/constants';

type FetchAladinListParams = {
  queryType: QueryType;
  page: number;
  target: TargetTypes;
  categoryId?: number;
  signal: AbortSignal;
};

export const fetchAladinList = async ({
  queryType,
  page,
  target,
  categoryId,
  signal,
}: FetchAladinListParams): Promise<PagedResult<AladinBookInfo>> => {
  const params = buildBookListParams({ queryType, page, target, categoryId }, APP_QUERY_KEYS);
  const res = await fetch(`/api/aladin/list?${params.toString()}`, { signal });

  if (!res.ok) {
    throw new Error(`AladinApi ${res.status}`);
  }

  const data = await res.json();

  return data;
};
