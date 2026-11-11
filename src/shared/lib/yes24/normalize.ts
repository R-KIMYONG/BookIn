import { BookDetail, BookSummary } from '@/shared/domain/book/types';
import { Yes24Item } from './types';
import { parseItemId } from '@/shared/domain/book/ids';

export const toPubDate = (raw: string): string | null => {
  if (!raw) return null;
  const cleanNums = raw.trim().replace(/\D/g, '');
  const isEightDigits = /^\d{8}$/.test(cleanNums);
  if (!isEightDigits) return null;

  const year = cleanNums.slice(0, 4);
  const month = cleanNums.slice(4, 6);
  const day = cleanNums.slice(6, 8);

  if (Number(month) < 1 || Number(month) > 12) return null;
  if (Number(day) < 1 || Number(day) > 31) return null;

  return `${year}-${month}-${day}`;
};
export const toIsbn13 = (raw: string | null): string | null => {
  if (!raw) return null;

  const cleanNums = raw.trim().replace(/\D/g, '');

  const reges = /^(978|979)\d{10}$/;

  return reges.test(cleanNums) ? cleanNums : null;
};

export const toBookSummary = (item: Yes24Item): BookSummary | null => {
  const itemId = parseItemId(item.itemId);

  if (!itemId) return null;

  return {
    itemId,
    isbn13: toIsbn13(item.isbn13),
    title: item.title,
    author: item.author,
    publisher: item.publisher,
    cover: item.cover,
    pubDate: toPubDate(item.publishDate),
    link: item.link,
  };
};

export const cleanText = (raw: string | null | undefined): string | null => {
  if (!raw) return null;

  const text = raw
    .replace(/<br\s*\/?>/gi, '\n') // <br>, <br/>, <BR /> → 줄바꿈 (태그 제거 전에)
    .replace(/<[^>]*>/g, '') // <b>, </b> 같은 태그 전부 제거
    .replace(/\r\n?/g, '\n') // \r\n, \r → \n
    .replace(/\n{3,}/g, '\n\n') // 빈 줄이 3개 이상 이어지면 2개로
    .trim();

  return text || null; // 태그만 있었다면 빈 문자열 → null
};

export const toCategoryName = (raw: string | null | undefined): string | null => {
  if (!raw) return null;

  const dash = raw.indexOf('-');
  if (dash < 0) return null;

  const name = raw.slice(dash + 1).trim();
  return name || null;
};

// 가격, 적립금, 판매지수: 이상한 값(NaN, 음수, 없음)은 0
const toPrice = (raw: number | undefined): number =>
  raw !== undefined && Number.isFinite(raw) && raw >= 0 ? Math.round(raw) : 0;

// 평점, 쪽수: 0 이하이거나 없으면 '정보 없음'(null)
const toPositiveOrNull = (raw: number | undefined): number | null =>
  raw !== undefined && Number.isFinite(raw) && raw > 0 ? raw : null;

export const toBookDetail = (item: Yes24Item): BookDetail | null => {
  const summary = toBookSummary(item);
  if (!summary) return null;

  return {
    ...summary,
    shopPrice: toPrice(item.shopPrice),
    salePrice: toPrice(item.salePrice),
    description: cleanText(item.contentDetail?.bookIntroduction),
    toc: cleanText(item.contentDetail?.tableOfContents),
    categoryName: toCategoryName(item.goodsSortNm),
    originalTitle: cleanText(item.originalTitle),
    subTitle: cleanText(item.subTitle),
    starScore: toPositiveOrNull(item.starScore),
    sortPath: cleanText(item.goodsSortNm),
    salePoint: toPrice(item.salePoint),
    yesPoint: toPrice(item.yesPoint),
    ebookLink: item.eBookLink?.trim() || null,
    pages: toPositiveOrNull(item.pages),
  };
};
