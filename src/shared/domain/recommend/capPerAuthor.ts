import { toAuthorName } from './toAuthorName';

// 추천 레일 한 줄에 같은 작가는 최대 2권
export const MAX_PER_AUTHOR = 2;

// 한 레일에 같은 작가가 몰리지 않도록 작가당 max권까지만 (순서는 유지 → 점수 높은 책이 남음)
// 작가는 첫 저자 이름으로 판단 ('나태주 저/나난 그림' → '나태주'). 이름을 못 뽑으면 제한하지 않음
export const capPerAuthor = <T extends { author: string }>(books: T[], max: number): T[] => {
  const countByAuthor = new Map<string, number>();

  return books.filter((book) => {
    const author = toAuthorName(book.author);
    if (!author) return true;

    const count = countByAuthor.get(author) ?? 0;
    if (count >= max) return false;

    countByAuthor.set(author, count + 1);
    return true;
  });
};
