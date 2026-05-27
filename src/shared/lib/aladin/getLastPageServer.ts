import 'server-only';
import { TargetTypes } from '@/shared/constants/category';
import { MAX_PAGE, MAX_RESULTS, QueryType } from '@/shared/domain/aladin/constants';
import { getAladinItemList } from './getAladinItemList';
import { unstable_cache } from 'next/cache';


type getLastPageServerProps = {
  queryType: QueryType;
  target: TargetTypes;
  categoryId: number;
};

export const computeLastPage = async ({
  queryType,
  target,
  categoryId,
}: getLastPageServerProps): Promise<{ lastPage: number }> => {
  const categoryIdStr = categoryId ? String(categoryId) : undefined;

  const first = await getAladinItemList({ target, queryType, categoryId: categoryIdStr, page: 1 });

  if (first.itemsCount === 0) return { lastPage: 0 };
  if (first.itemsCount < MAX_RESULTS) return { lastPage: 1 };

  let startPage = 1;
  let endPage = 0;
  for (let i = 2; i <= MAX_PAGE; i *= 2) {
    const { itemsCount } = await getAladinItemList({
      target,
      queryType,
      categoryId: categoryIdStr,
      page: i,
    });
    if (itemsCount > 0) {
      startPage = i;
    } else {
      endPage = i;
      break;
    }
  }

  if (endPage === 0) {
    const { itemsCount } = await getAladinItemList({
      target,
      queryType,
      categoryId: categoryIdStr,
      page: MAX_PAGE,
    });

    if (itemsCount > 0) return { lastPage: MAX_PAGE };
    endPage = MAX_PAGE;
  }

  while (endPage - startPage > 1) {
    const mid = Math.floor((startPage + endPage) / 2);
    const { itemsCount } = await getAladinItemList({
      target,
      queryType,
      categoryId: categoryIdStr,
      page: mid,
    });

    if (itemsCount > 0) startPage = mid;
    else endPage = mid;
  }

  return { lastPage: startPage };
};

export const getLastPageServer = async (props: getLastPageServerProps) => {
  const cached = unstable_cache(
    () => computeLastPage(props),
    ['lastPage', props.queryType, props.target, String(props.categoryId)], // 캐시 키
    {
      revalidate: 60 * 60, // 1시간 캐시 (필요시 조정)
      tags: [`lastPage-${props.categoryId}`],
    }
  );
  return cached();
};
