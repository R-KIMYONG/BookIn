import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { BookDetail } from '@/shared/domain/book/types';
import { buildEmbedText } from '@/shared/domain/recommend/buildEmbedText';
import { cleanCandidates } from '@/shared/domain/recommend/cleanCandidates';
import { rankBySimilarity } from '@/shared/domain/recommend/rankBySimilarity';
import { RankedBook, toRailBooks } from '@/shared/domain/recommend/toRailBooks';
import { averageVector } from '@/shared/domain/recommend/vector';
import { embedText } from '../embedding/embedText';
import { getYes24Detail } from '../yes24/getYes24Detail';
import { collectCategoryCandidates } from './collectCategoryCandidates';
import { capPerAuthor, MAX_PER_AUTHOR } from '@/shared/domain/recommend/capPerAuthor';

type BuildSnipingRailParams = {
  anchorItemIds: ItemId[]; // 좋아하는 책 상위 몇 권 (보통 3권)
  excludeIds?: Set<ItemId>; // 이미 반응한 책
  limit?: number; // 기본 10
};

// 책마다 비슷한 분류 2개씩 → 최대 6개 분류 (분류는 평균 내지 않고 합침: 서로 다른 분류의 평균은 엉뚱한 곳이 됨)
const CATEGORIES_PER_ANCHOR = 2;
// 레일 ① 취향 저격: 좋아하는 책 여러 권의 "한가운데"(평균 벡터)와 가까운 책
// 『○○』을 좋아한다면(buildAnchorRail)이 책 한 권 기준이라면, 이건 여러 권 기준
export const buildSnipingRail = async ({
  anchorItemIds,
  excludeIds,
  limit = 10,
}: BuildSnipingRailParams): Promise<RankedBook[]> => {
  // 1. 기준 책들 (책소개 포함). 없어진 상품은 빼고 진행
  const anchors = (await Promise.all(anchorItemIds.map(getYes24Detail))).filter(
    (book): book is BookDetail => book !== null
  );
  if (anchors.length === 0) return [];

  // 2. 기준 책마다 비슷한 분류 CATEGORIES_PER_ANCHOR개의 베스트셀러를 모아서 하나로 합침
  const collected = await collectCategoryCandidates(anchors, CATEGORIES_PER_ANCHOR);

  // 3. 기준 책 각각을 기준으로 차례로 정리 → 각 기준 책의 다른 판이 빠지고, 여러 분류에 겹친 책도 하나만 남음
  const candidates = anchors.reduce((list, anchor) => cleanCandidates(anchor, list), collected);
  if (candidates.length === 0) return [];

  // 4. 기준 책들 + 후보를 한 번에 임베딩 → 앞의 anchors.length개가 기준, 나머지는 후보와 같은 순서
  const vectors = await embedText([...anchors, ...candidates].map(buildEmbedText));
  const anchorVectors = vectors.slice(0, anchors.length);
  const candidateVectors = vectors.slice(anchors.length);

  // 5. 기준 책들의 한가운데 = 내 취향
  const taste = averageVector(anchorVectors);

  // 6. 내 취향과 가까운 순서로 전부 정렬 → 화면용 책 → 작가당 최대 MAX_PER_AUTHOR권 → limit개
  //    (먼저 limit개로 자르면 작가 제한 후 수가 모자람)
  const ranked = rankBySimilarity(
    taste,
    candidates.map((book, i) => ({ itemId: book.itemId, vector: candidateVectors[i] })),
    { limit: candidates.length, excludeIds }
  );

  return capPerAuthor(toRailBooks(ranked, candidates), MAX_PER_AUTHOR).slice(0, limit);
};
