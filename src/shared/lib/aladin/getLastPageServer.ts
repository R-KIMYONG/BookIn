import 'server-only';
import { TargetTypes } from '@/shared/constants/category';
import { MAX_PAGE, MAX_RESULTS } from '@/shared/domain/aladin/constants';
import { getAladinItemList } from './getAladinItemList';
import { unstable_cache } from 'next/cache';
import { QueryType } from '@/shared/domain/aladin/types';

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

  // 1페이지가 마지막 안전장치 이렇게 확인되면 아래 코드 안돌려도되니까
  const first = await getAladinItemList({ target, queryType, categoryId: categoryIdStr, page: 1 });

  if (first.itemsCount === 0) return { lastPage: 0 };
  if (first.itemsCount < MAX_RESULTS) return { lastPage: 1 };

  let startPage = 1;
  let endPage = 0;
  for (let i = 2; i <= MAX_PAGE; i *= 2) {
    //1,2,4,8,16,32처럼 순환하는데 itemsCount가 0보다크면 start 업데이트
    //itemsCount가 0
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

  //25페이지를 마지막페이지로 가정할때
  //mid 는 (startPage+endPage)/2
  //(16+32)/2=24 이게 itemsCount에서 숫자있으면 true 그리고 start를 업데이트
  //업데이트된 startPage ->(24+32)/2=28 이게 false 나오면 endPage를 업데이트
  //업데이트된 endPage ->(24+28)/2=26 이게 false 나오면 end를 업데이트
  //(24+26)/2=25 이게 true 나오면 sratPage를 업데이트
  //그러면 startPage는 25(마지막true?) endPage는 26(마지막false?)
  //startPage가 마지막 true로 계산되고 25가 마지막true로 계산된다.그럼 이렇게까지 계산해서 어떻게 멈추지?
  //26-25=1
  //end-start해서 1보다 크면 순환하고 아니면 찾은거니까 종료 조건

  if (endPage === 0) {
    //2,4,8,16,32까지 탐색하고 여전히 못찾으면 50페이지를 찔러본다 찔려서 있으면 50페이지가 마지막페이지고 없으면 50을 endPage로 해서 추가 탐색을 한다.
    const { itemsCount } = await getAladinItemList({
      target,
      queryType,
      categoryId: categoryIdStr,
      page: MAX_PAGE,
    });

    if (itemsCount > 0) return { lastPage: MAX_PAGE };
    // 50은 비었으니, 마지막은 startPage(=32) ~ 50 사이에 있음
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
