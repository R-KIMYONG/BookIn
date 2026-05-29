import { TargetTypes } from '@/shared/constants/category';
import { QueryType } from '@/shared/domain/aladin/types';

type AladinListParams = {
  queryType: QueryType;
  page: number;
  target: TargetTypes;
  categoryId?: number;
};

type ListParamKeyMap = Record<'queryType' | 'target' | 'page' | 'categoryId', string>;

export const buildBookListParams = (args: AladinListParams, keys: ListParamKeyMap) => {
  const params = new URLSearchParams({
    [keys.queryType]: args.queryType,
    [keys.page]: String(args.page),
    [keys.target]: args.target,
  });

  if (args.categoryId) {
    params.set(keys.categoryId, String(args.categoryId));
  } else if (args.queryType === 'ItemEditorChoice') {
    params.set(keys.categoryId, '170');
  }

  return params;
};
