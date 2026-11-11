import { MINUTE } from '@/shared/constants/time';
import { bookListKeys } from '@/shared/domain/book/queryKeys';
import { BookSummary, Paged } from '@/shared/domain/book/types';
import { Yes24ListType } from '@/shared/lib/yes24/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type UseBookListParameter = {
  listType: Yes24ListType;
  categoryId: string;
  page: number;
  pageSize: number;
};
export const useBookList = ({ listType, categoryId, page, pageSize }: UseBookListParameter) =>
  useQuery({
    queryKey: bookListKeys.list({ listType, categoryId, page, pageSize }),
    queryFn: async (): Promise<Paged<BookSummary>> => {
      const params = new URLSearchParams({ categoryId, listType, page: String(page), pageSize: String(pageSize) });
      const res = await fetch(`/api/books/list?${params.toString()}`);
      if (!res.ok) throw new Error('데이터 목록을 불러오지 못했어요');
      return res.json();
    },
    staleTime: 10 * MINUTE,
    placeholderData: keepPreviousData,
  });
