import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { buildEmbedText } from '@/shared/domain/recommend/buildEmbedText';
import { cleanCandidates } from '@/shared/domain/recommend/cleanCandidates';
import { rankBySimilarity } from '@/shared/domain/recommend/rankBySimilarity';
import { RankedBook, toRailBooks } from '@/shared/domain/recommend/toRailBooks';
import { embedText } from '../embedding/embedText';
import { getYes24Detail } from '../yes24/getYes24Detail';
import { collectCategoryCandidates } from './collectCategoryCandidates';
import { capPerAuthor, MAX_PER_AUTHOR } from '@/shared/domain/recommend/capPerAuthor';

type BuildAnchorRailParams = {
  anchorItemId: ItemId; // 기준 책 (유저의 1등 책)
  excludeIds?: Set<ItemId>; // 이미 반응한 책
  limit?: number; // 기본 10
};

export type AnchorRail = {
  anchor: { itemId: ItemId; title: string }; // 레일 제목 『○○』에 씀
  books: RankedBook[]; // 화면에 보여줄 책
};
const ANCHOR_CATEGORIES = 3;

// 레일 ②『○○』을 좋아한다면: 기준 책 저자의 다른 책을 기준 책과 비슷한 순서로
// userId를 받지 않아 책 번호만으로 테스트 가능. YES24·Voyage 실패는 그대로 throw → 호출하는 쪽에서 폴백
export const buildAnchorRail = async ({
  anchorItemId,
  excludeIds,
  limit = 10,
}: BuildAnchorRailParams): Promise<AnchorRail | null> => {
  const anchor = await getYes24Detail(anchorItemId);
  if (!anchor) return null;

  const rail: AnchorRail = { anchor: { itemId: anchor.itemId, title: anchor.title }, books: [] };

  // 같은 저자의 책을 후보로 모으고 같은 책·세트·중복 정리
  const candidates = cleanCandidates(anchor, await collectCategoryCandidates([anchor], ANCHOR_CATEGORIES));
  if (candidates.length === 0) return rail;

  // 기준 + 후보를 한 번에 임베딩 → 첫 번째가 기준, 나머지는 후보와 같은 순서
  const [base, ...candidateVectors] = await embedText([anchor, ...candidates].map(buildEmbedText));

  // 기준과 비슷한 순서로 전부 정렬 → 작가당 제한을 건 뒤에 limit개로 자름 (먼저 자르면 제한 후 수가 모자람)
  const ranked = rankBySimilarity(
    base,
    candidates.map((book, i) => ({ itemId: book.itemId, vector: candidateVectors[i] })),
    { limit: candidates.length, excludeIds }
  );

  // itemId → 원래 책 정보 (화면용 필드만) → 작가당 최대 MAX_PER_AUTHOR권 → limit개
  rail.books = capPerAuthor(toRailBooks(ranked, candidates), MAX_PER_AUTHOR).slice(0, limit);

  return rail;
};
