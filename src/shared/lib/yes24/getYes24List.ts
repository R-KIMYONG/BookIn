import 'server-only';
import { BookSummary, Paged } from '@/shared/domain/book/types';
import { Yes24Error, yes24Fetch } from './client';
import { Yes24ListData, Yes24ListType } from './types';
import { toBookSummary } from './normalize';

type GetYes24ListParameter = {
  listType: Yes24ListType;
  categoryId: string;
  page?: number;
  pageSize?: number;
};

const NO_RESULT_CODES = ['BEST_001', 'NEW_001'];

export const getYes24List = async ({
  listType,
  categoryId,
  page = 1,
  pageSize = 20,
}: GetYes24ListParameter): Promise<Paged<BookSummary>> => {
  try {
    const data = await yes24Fetch<Yes24ListData>(
      `/category/${listType}`,
      { categoryId, page, pageSize, detail: 'N' },
      { revalidate: 3600 } // 목록에는 가격을 표시하지 않으므로 1시간
    );

    return {
      items: data.items.map((book) => toBookSummary(book)).filter((book) => book !== null),
      totalCount: data.totalCount,
      page: data.currentPage,
      pageSize: data.pageSize,
    };
  } catch (error) {
    if (error instanceof Yes24Error && error.code && NO_RESULT_CODES.includes(error.code)) {
      return { items: [], totalCount: 0, page, pageSize };
    }
    throw error;
  }
};
