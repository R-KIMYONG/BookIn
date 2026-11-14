import { BookDetail, BookSummary } from '../book/types';
import { Ranked } from './rankBySimilarity';

export type RankedBook = BookSummary & { similarity: number };

// 결과는 저장될 수 있으므로 책소개 원문(description) 등은 빼고 화면용 필드만 (약관: 책소개 저장 금지)
export const toSummary = (book: BookDetail): BookSummary => ({
  adult: book.adult,
  itemId: book.itemId,
  isbn13: book.isbn13,
  title: book.title,
  author: book.author,
  publisher: book.publisher,
  cover: book.cover,
  pubDate: book.pubDate,
  link: book.link,
});

// 순위 결과(itemId + 점수) → 화면에 보여줄 책. 레일 ②·① 공용
export const toRailBooks = (ranked: Ranked[], candidates: BookDetail[]): RankedBook[] => {
  const bookById = new Map(candidates.map((book) => [book.itemId, book]));

  return ranked.flatMap(({ itemId, similarity }) => {
    const book = bookById.get(itemId);
    return book ? [{ ...toSummary(book), similarity }] : [];
  });
};
