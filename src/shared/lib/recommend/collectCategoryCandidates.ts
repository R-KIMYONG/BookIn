import 'server-only';
import { BookDetail } from '@/shared/domain/book/types';
import { getYes24ListDetails } from '../yes24/getYes24ListDetails';
import { findSimilarCategories } from './findSimilarCategories';
import { resolveBookCategories } from './resolveBookCategories';

// 분류 하나에서 가져올 후보 수
const PER_CATEGORY = 20;
// 이보다 적으면 상위 분류로 보충 (정리 단계에서 같은 책·세트가 빠지는 것까지 고려)
const MIN_CANDIDATES = 15;

// 기준 책들과 비슷한 분류의 베스트셀러를 후보로 (책소개 포함). collectAuthorCandidates를 대신함
// - 『○○』을 좋아한다면: 책 1권 → 비슷한 분류 3개 → 후보 약 60권
// - 취향 저격: 책 3권 → 책마다 비슷한 분류 2개 → 합쳐서 최대 6개 분류 (평균 내면 "아무 분야도 아닌 곳"이 돼서)
// 정리(cleanCandidates)는 부르는 쪽에서 (작가 후보와 같은 이유)
export const collectCategoryCandidates = async (
  anchors: BookDetail[],
  categoriesPerAnchor: number
): Promise<BookDetail[]> => {
  // 1. 기준 책마다 소분류 번호 찾기 (sortPath로 찾고, 중분류까지만 나오면 책소개 임베딩으로 좁힘)
  const seedIds = (await resolveBookCategories(anchors)).flatMap((id) => id ?? []);
  if (seedIds.length === 0) return [];

  // 2. 기준 분류마다 비슷한 분류 고르기 → 겹치는 분류는 하나로
  const similarLists = await Promise.all(seedIds.map((id) => findSimilarCategories([id], categoriesPerAnchor)));
  const categoryIds = [...new Set(similarLists.flat())];

  // 3. 분류마다 베스트셀러 (동시에)
  const fetchBest = (categoryId: string) =>
    getYes24ListDetails({ listType: 'bestseller', categoryId, pageSize: PER_CATEGORY });
  const candidates = (await Promise.all(categoryIds.map(fetchBest))).flat();

  // 4. 고른 분류가 모두 작아서 후보가 거의 없으면 → 기준 분류의 상위(중분류) 베스트셀러로 보충
  //    (외국도서 소분류는 베스트셀러가 없는 경우가 많음. 몰 단위까지는 올라가지 않음)
  if (candidates.length >= MIN_CANDIDATES) return candidates;

  const parentIds = [...new Set(seedIds.filter((id) => id.length > 9).map((id) => id.slice(0, 9)))];
  const parentLists = await Promise.all(parentIds.map(fetchBest));
  return [...candidates, ...parentLists.flat()];
};
