import { DEFAULT_QT, RECOMMEND_MAX_RESULTS } from '@/shared/domain/aladin/constants';
import { getAladinItemList } from '../aladin/getAladinItemList';
import { DEFAULT_TARGET } from '@/shared/constants/category';
import { fromAladin } from '@/shared/domain/rails/normalize';
import { RailBook } from '@/shared/domain/rails/types';

export const getTrending = async (categoryId?: number): Promise<RailBook[]> => {
  const pages = [1, 2]; //100개 필요하니까 1,2페이지하고 maxResults를 50으로
  try {
    const results = await Promise.all(
      pages.map((page) =>
        getAladinItemList({
          queryType: DEFAULT_QT,
          target: DEFAULT_TARGET,
          page,
          maxResults: RECOMMEND_MAX_RESULTS,
          ...(categoryId ? { categoryId: String(categoryId) } : {}),
        })
      )
    );

    const items = results.flatMap((r) => (Array.isArray(r.data.item) ? r.data.item : []));
    const railBooks = items.map(fromAladin);

    return Array.from(new Map(railBooks.map((b) => [b.isbn13, b])).values());
  } catch (e) {
    console.error('trending 실패:', e);
    return [];
  }
};
