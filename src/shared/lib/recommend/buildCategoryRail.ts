import 'server-only';
import { unstable_cache } from 'next/cache';
import { BookDetail, BookSummary } from '@/shared/domain/book/types';
import { cleanCandidates } from '@/shared/domain/recommend/cleanCandidates';
import { findSimilarCategories } from './findSimilarCategories';
import { getYes24ListDetails } from '../yes24/getYes24ListDetails';
import { toSummary } from '@/shared/domain/recommend/toRailBooks';

const SIMILAR_COUNT = 30;
const CATEGORY_COUNT = 3;
const PER_CATEGORY = 10;

// 카테고리 "새로운 발견": 지금 분류와 가까운 다른 분류들의 베스트셀러를 번갈아 섞음
const buildCategoryRail = async (categoryId: string, limit: number): Promise<BookSummary[]> => {
  const similar = await findSimilarCategories([categoryId], SIMILAR_COUNT, { mall: categoryId.slice(0, 3) });
  // 자기 자신·하위 분류는 이미 페이지에 나오니까 제외
  const otherCategoryIds = similar.filter((id) => !id.startsWith(categoryId)).slice(0, CATEGORY_COUNT);
  if (otherCategoryIds.length === 0) return []; // 몰 전체 페이지(001 등)

  const lists = await Promise.all(
    otherCategoryIds.map(
      async (id) => await getYes24ListDetails({ listType: 'bestseller', categoryId: id, pageSize: PER_CATEGORY })
    )
  );

  const mixed: BookDetail[] = [];
  const longest = Math.max(0, ...lists.map((list) => list.length));
  for (let i = 0; i < longest; i++) {
    for (const list of lists) {
      if (list[i]) mixed.push(list[i]);
    }
  }

  return cleanCandidates(null, mixed).slice(0, limit).map(toSummary);
};

// 누가 봐도 같은 결과 → 분류별 하루 캐시. 실패하면 throw → 캐시 안 되고 다음 방문 때 다시 계산
export const getCachedCategoryRail = unstable_cache(buildCategoryRail, ['category-rail-v3'], {
  revalidate: 60 * 60 * 24,
});
