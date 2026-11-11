import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { BookSummary } from '@/shared/domain/book/types';
import { normalizeTitle } from '@/shared/domain/recommend/cleanCandidates';
import { getYes24CategoryList } from '../yes24/getYes24CategoryList';
import { getYes24Detail } from '../yes24/getYes24Detail';
import { getYes24List } from '../yes24/getYes24List';
import { resolveBookCategories } from './resolveBookCategories';

// 기준 책 분류를 못 찾으면 국내도서 전체 베스트로
const FALLBACK_CATEGORY_ID = '001';
// 작은 분류는 베스트셀러가 적음 → 이보다 적으면 한 단계 위 분류로
const MIN_BOOKS = 10;

type BuildTrendingRailParams = {
  anchorItemId?: ItemId; // 가장 좋아하는 책 (없으면 전체 베스트)
  excludeIds?: Set<ItemId>; // 이미 반응한 책
  limit?: number; // 기본 20
};

export type TrendingRail = {
  categoryName: string | null; // 레일 제목 "○○ 분야에서 뜨는 책" (null이면 "요즘 뜨는 책")
  books: BookSummary[];
};

// 레일 ③ ○○ 분야에서 뜨는 책: 가장 좋아하는 책 분류의 YES24 베스트셀러 (순위 그대로, 임베딩 없음)
export const buildTrendingRail = async ({
  anchorItemId,
  excludeIds,
  limit = 20,
}: BuildTrendingRailParams): Promise<TrendingRail> => {
  const [anchor, categoryList] = await Promise.all([
    anchorItemId ? getYes24Detail(anchorItemId) : null,
    getYes24CategoryList(),
  ]);

  // 기준 책과 제목이 같으면 다른 판(초판본 싯다르타)으로 보고 뺌
  const anchorTitle = anchor ? normalizeTitle(anchor.title) : null;

  // 반응한 책을 빼고도 limit개가 남도록 넉넉히 받음
  // 순위를 그대로 쓰는 레일이라 cleanCandidates를 거치지 않으므로, 다른 판·중복 제목만 여기서 정리 (순위 높은 판이 남음)
  const fetchBest = async (categoryId: string) => {
    const seenTitles = new Set<string>();
    return (await getYes24List({ listType: 'bestseller', categoryId, pageSize: limit * 2 })).items.filter((book) => {
      if (excludeIds?.has(book.itemId)) return false;

      const title = normalizeTitle(book.title);
      if (title === anchorTitle || seenTitles.has(title)) return false;

      seenTitles.add(title);
      return true;
    });
  };

  // 1. 기준 책의 소분류 (sortPath로 찾고, 중분류까지만 나오면 책소개 임베딩으로 좁힘)
  let categoryId = anchor ? (await resolveBookCategories([anchor]))[0] : null;
  if (!categoryId) return { categoryName: null, books: (await fetchBest(FALLBACK_CATEGORY_ID)).slice(0, limit) };

  // 2. 그 분류의 베스트셀러. 너무 적으면 한 단계 위(번호 끝 3자리 제거) 분류로, 몰(3자리)까지는 올라가지 않음
  let books = await fetchBest(categoryId);
  while (books.length < MIN_BOOKS && categoryId.length > 9) {
    categoryId = categoryId.slice(0, -3);
    books = await fetchBest(categoryId);
  }

  const categoryName = categoryList.find((c) => c.categoryId === categoryId)?.categoryName.trim() ?? null;
  return { categoryName, books: books.slice(0, limit) };
};
