import 'server-only';
import { Yes24Error, yes24Fetch } from './client';
import { Yes24ListData, Yes24ListType } from './types';
import { toBookDetail } from './normalize';
import { BookDetail } from '@/shared/domain/book/types';

type GetYes24ListDetailsParameter = {
  listType: Yes24ListType;
  categoryId: string;
  pageSize?: number;
};

// 결과가 없는 분류는 YES24가 에러 코드로 응답 → 빈 후보로 처리 (getYes24List와 같은 코드)
const NO_RESULT_CODES = ['BEST_001', 'NEW_001'];

// 추천 후보용 분류별 목록: detail=Y라 책소개가 함께 옴 (목록 화면용 getYes24List는 detail=N)
// 검색 화면/추천용이 나뉜 getYes24Search ↔ getYes24SearchDetails와 같은 이유로 별도 함수
export const getYes24ListDetails = async ({
  listType,
  categoryId,
  pageSize = 20,
}: GetYes24ListDetailsParameter): Promise<BookDetail[]> => {
  try {
    const data = await yes24Fetch<Yes24ListData>(
      `/category/${listType}`,
      { categoryId, page: 1, pageSize, detail: 'Y' },
      { revalidate: 3600 } // 목록과 같은 1시간 (추천에선 가격을 보여주지 않음)
    );

    return data.items.map((book) => toBookDetail(book)).filter((book) => book !== null);
  } catch (error) {
    if (error instanceof Yes24Error && error.code && NO_RESULT_CODES.includes(error.code)) return [];
    throw error;
  }
};
