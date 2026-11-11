import { BookDetail } from '../book/types';

type CandidateBook = Pick<BookDetail, 'itemId' | 'title' | 'categoryName' | 'originalTitle'>;

const BRACKETS = /\([^)]*\)|\[[^\]]*\]/g; // (리커버 특별판), [양장] 같은 괄호와 안의 내용
const EDITION_WORDS = /초판본|개정판|리커버/g;
const BUNDLE_PATTERN = /세트|\bSET\b|\s\+\s|블라인드북/i;
// 같은 저자라도 성격이 달라 추천에 어울리지 않는 분류 (기준 책도 같은 분류면 허용)
const EXCLUDED_CATEGORY_PREFIXES = ['수험서 자격증', '어린이', '유아', '참고서'];
// '나' 같은 1글자 제목은 거의 모든 제목에 포함되므로 다른 판 판정에서 제외
const MIN_ANCHOR_TITLE_LENGTH = 2;
const SUBTITLE = /\s*:.*$/; // '데미안 : 오리지널 초판본 표지디자인' → '데미안'
const VOLUME_NUMBER = /\s+(\d+)권?$/;

// 다른 판·중복 비교용 제목: 괄호·판 표기·공백 제거
export const normalizeTitle = (title: string): string =>
  title
    .replace(SUBTITLE, '')
    .replace(BRACKETS, '')
    .replace(EDITION_WORDS, '')
    .trim()
    .replace(VOLUME_NUMBER, '')
    .replace(/\s+/g, '');

export const isExcludedCategory = (categoryName: string | null): boolean =>
  !!categoryName && EXCLUDED_CATEGORY_PREFIXES.some((prefix) => categoryName.includes(prefix));

export const cleanCandidates = <T extends CandidateBook>(anchor: CandidateBook | null, candidates: T[]): T[] => {
  const anchorTitle = anchor ? normalizeTitle(anchor.title) : '';
  const checkEdition = anchorTitle.length >= MIN_ANCHOR_TITLE_LENGTH;
  const anchorIsExcluded = anchor ? isExcludedCategory(anchor.categoryName) : false;
  const anchorOriginalTitle = anchor?.originalTitle;
  const seenTitles = new Set<string>();
  const seenOriginalTitles = new Set<string>();
  return candidates.filter((book) => {
    // 기준 책 자신  제외!
    if (anchor && book.itemId === anchor.itemId) return false;

    // 세트 상품  제외!
    if (BUNDLE_PATTERN.test(book.title)) return false;

    const volume = book.title.match(VOLUME_NUMBER);
    if (volume && Number(volume[1]) >= 2) return false;

    // 기준 책의 다른 판 (초판본 싯다르타, 싯다르타 (리커버))
    const title = normalizeTitle(book.title);
    if (checkEdition && title.includes(anchorTitle)) return false;

    // 제목을 바꿔 다시 낸 번역서 (노르웨이의 숲 ↔ 상실의 시대: 원제가 같음)
    // 기준 원제가 null이면 건너뜀 → null === null로 원제 없는 책이 전부 빠지는 것 방지
    if (anchorOriginalTitle && book.originalTitle === anchorOriginalTitle) return false;

    // 성격이 다른 분류 (기준 책이 같은 분류면 통과)
    if (!anchorIsExcluded && isExcludedCategory(book.categoryName)) return false;

    // 후보끼리 같은 제목 → 먼저 나온 것(인기도 높은 판)만
    if (seenTitles.has(title)) return false;

    if (book.originalTitle && seenOriginalTitles.has(book.originalTitle)) return false;
    seenTitles.add(title);

    if (book.originalTitle) seenOriginalTitles.add(book.originalTitle);

    return true;
  });
};
