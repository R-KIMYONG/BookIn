import 'server-only';
import { Yes24Error, yes24Fetch } from './client';
import { SearchCategory, Yes24ListData } from './types';
import { toBookDetail } from './normalize';
import { BookDetail } from '@/shared/domain/book/types';

type GetYes24SearchDetailsParameter = { query: string; category?: SearchCategory; pageSize?: number };

export const getYes24SearchDetails = async ({
  query,
  category = 'BOOK',
  pageSize = 30,
}: GetYes24SearchDetailsParameter): Promise<BookDetail[]> => {
  try {
    const data = await yes24Fetch<Yes24ListData>(
      '/goods/itemList',
      { query, category, sort: 'DEFAULT', page: 1, pageSize, detail: 'Y' },
      { revalidate: 600 }
    );

    return data.items.map((book) => toBookDetail(book)).filter((book) => book !== null);
  } catch (error) {
    if (error instanceof Yes24Error && error.code === 'SEARCH_001') return [];

    throw error;
  }
};
