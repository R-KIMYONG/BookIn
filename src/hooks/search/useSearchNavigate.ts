import { TargetTypes } from '@/shared/constants/category';
import { APP_QUERY_KEYS } from '@/shared/constants/urlParams';
import { SEARCH_DEFAULT_SORT } from '@/shared/lib/yes24/constants';
import { SearchSort } from '@/shared/lib/yes24/types';
import { useRouter } from 'next/navigation';

// URL에 담는 값은 BookIn 기준(target = Book/Foreign/eBook). YES24 값으로의 변환은 서버에서.
type SetSearchUrlParameter = {
  keyword: string;
  target?: TargetTypes; // 없으면 전체(ALL) 검색
  sort?: SearchSort;
  page?: number;
};

export const useSearchNavigate = () => {
  const router = useRouter();

  const setSearchUrl = ({ keyword, target, sort, page }: SetSearchUrlParameter) => {
    const kw = keyword.trim();
    if (!kw) return;

    const params = new URLSearchParams();

    params.set(APP_QUERY_KEYS.searchKeyWord, kw);

    if (target) params.set(APP_QUERY_KEYS.target, target);
    if (sort && sort !== SEARCH_DEFAULT_SORT) params.set(APP_QUERY_KEYS.sort, sort);
    if (page && page > 1) params.set(APP_QUERY_KEYS.page, String(page));

    router.push(`/search?${params.toString()}`);
  };

  return { setSearchUrl };
};
