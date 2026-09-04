import { TargetTypes } from '@/shared/constants/category';
import { APP_QUERY_KEYS } from '@/shared/domain/aladin/constants';
import { DEFAULT_SEARCH_QT } from '@/shared/domain/search/constants';
import { SearchQueryType } from '@/shared/domain/search/types';
import { useRouter } from 'next/navigation';

export const useSearchNavigate = () => {
  const router = useRouter();

  const setSearchUrl = ({
    keyword,
    sq,
    target,
    ci,
    page,
  }: {
    keyword: string;
    sq?: SearchQueryType;
    target?: TargetTypes;
    ci?: number;
    page?: number;
  }) => {
    const kw = keyword.trim();
    if (!kw) return;

    const params = new URLSearchParams();

    params.set(APP_QUERY_KEYS.searchKeyWord, kw);

    if (sq && sq !== DEFAULT_SEARCH_QT) params.set(APP_QUERY_KEYS.searchQueryType, sq);
    if (target) params.set(APP_QUERY_KEYS.target, target);
    if (ci) params.set(APP_QUERY_KEYS.categoryId, String(ci));
    if (page && page > 1) params.set(APP_QUERY_KEYS.page, String(page));

    router.push(`/search?${params.toString()}`);
  };

  return { setSearchUrl };
};
