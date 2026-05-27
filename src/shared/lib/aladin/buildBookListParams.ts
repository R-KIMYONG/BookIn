import { DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';
import { QueryType } from '@/shared/domain/aladin/constants';

type AladinListParams = {
  queryType: QueryType;
  page: number;
  target?: TargetTypes;
  categoryId?: number;
};

export const buildBookListParams = ({ queryType, page, target = DEFAULT_TARGET, categoryId }: AladinListParams) => {
  const params = new URLSearchParams({
    QueryType: queryType,
    page: String(page),
    target,
  });

  if (categoryId) {
    params.set('CategoryId', String(categoryId));
  } else if (queryType === 'ItemEditorChoice') {
    params.set('CategoryId', '170');
  }

  return params;
};
