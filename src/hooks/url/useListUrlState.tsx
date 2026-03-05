import { QT_LIST, QueryType } from '@/types/useListUrlState.type';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SearchTarget = 'Book' | 'Foreign' | 'eBook' | 'All';
const TARGET_LIST: SearchTarget[] = ['Book', 'Foreign', 'eBook', 'All'];
const useListUrlState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const targetParam = searchParams.get('target');
  const target: SearchTarget = TARGET_LIST.includes(targetParam as SearchTarget)
    ? (targetParam as SearchTarget)
    : 'Book';

  //쿼리 타입
  const qtParam = searchParams.get('qt');
  const queryType: QueryType = QT_LIST.includes(qtParam as QueryType) ? (qtParam as QueryType) : 'Bestseller';

  //페이지
  const pageParam = Number(searchParams.get('page'));
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? pageParam : 1;

  const searchKeyWord = (searchParams.get('q') ?? '').trim();

  //카테고리
  const rawCat = searchParams.get('category');
  const categoryId = queryType === 'ItemEditorChoice' ? (rawCat ?? '170') : (rawCat ?? '');

  //URL셋팅 함수
  const setListUrl = (next: {
    qt?: QueryType | null;
    page?: number;
    q?: string | null;
    category?: string | null;
    target?: SearchTarget | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    //------------------Target URL//------------------
    const prevTarget = searchParams.get('target') ?? 'Book';

    if (next.target !== undefined) {
      if (next.target === null) params.delete('target');
      else params.set('target', next.target);

      const nextTarget = next.target ?? 'Book';
      if (nextTarget !== prevTarget) params.set('page', '1');
    }
    //------------------querytype URL//------------------
    const prevQueryType = searchParams.get('qt') ?? 'Bestseller';
    if (next.qt !== undefined) {
      if (next.qt === null) params.delete('qt');
      else params.set('qt', next.qt);
      const nextQueryType = next.qt ?? 'Bestseller';
      if (nextQueryType !== prevQueryType) params.set('page', '1');
    }
    //------------------검색 URL//------------------
    const prevSearchKeyWord = searchParams.get('q') ?? '';
    if (next.q !== undefined) {
      const nextQ = (next.q ?? '').trim();

      if (!nextQ) params.delete('q');
      else params.set('q', nextQ);

      if (nextQ !== prevSearchKeyWord) {
        params.set('page', '1');
      }
    }
    //------------------카테고리 URL//------------------
    const prevCategory = searchParams.get('category') ?? '';
    if (next.category !== undefined) {
      const nextCategory = next.category ?? '';
      if (!nextCategory) params.delete('category');
      else params.set('category', nextCategory);

      if (nextCategory !== prevCategory) params.set('page', '1');
    }
    //------------------ItemEditorChoice의 URL//------------------
    const effectiveQt = (params.get('qt') as QueryType) ?? 'Bestseller';

    if (effectiveQt === 'ItemEditorChoice') {
      if (!params.get('category')) {
        params.set('category', '170');
      }
    } else {
      params.delete('category');
    }

    if (typeof next.page === 'number') params.set('page', String(Math.max(1, next.page)));
    if (!params.get('qt')) params.set('qt', 'Bestseller');
    if (!params.get('page')) params.set('page', '1');
    if (!params.get('target')) params.set('target', 'Book');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { queryType, page, searchKeyWord, categoryId, target, setListUrl };
};

export default useListUrlState;
