import 'server-only';
import { Yes24Error, yes24Fetch } from './client';
import { SearchCategory, SearchSort, Yes24ListData } from './types';
import { SEARCH_DEFAULT_CATEGORY, SEARCH_DEFAULT_SORT } from './constants';
import { toBookSummary } from './normalize';
import { BookSummary, Paged } from '@/shared/domain/book/types';

type GetYes24SearchParameter = {
  query: string;
  category?: SearchCategory;
  sort?: SearchSort;
  page?: number;
  pageSize?: number;
};

export const getYes24Search = async ({
  query,
  category = SEARCH_DEFAULT_CATEGORY,
  sort = SEARCH_DEFAULT_SORT,
  page = 1,
  pageSize = 20,
}: GetYes24SearchParameter): Promise<Paged<BookSummary>> => {
  try {
    const data = await yes24Fetch<Yes24ListData>(
      '/goods/itemList',
      { query, category, sort, page, pageSize, detail: 'N' },
      { revalidate: 600 }
    );

    return {
      items: data.items.map((book) => toBookSummary(book)).filter((book) => book !== null),
      totalCount: data.totalCount,
      page: data.currentPage,
      pageSize: data.pageSize,
    };
  } catch (error) {
    if (error instanceof Yes24Error && error.code === 'SEARCH_001') {
      return { items: [], totalCount: 0, page, pageSize };
    }
    throw error;
  }
};
