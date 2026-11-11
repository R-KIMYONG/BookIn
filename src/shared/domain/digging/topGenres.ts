import { DiggingBook } from './types';

export const topGenres = (books: DiggingBook[], count = 3): string[] => {
  const counts = new Map<string, number>();
  for (const book of books) {
    if (!book.categoryName) continue;
    counts.set(book.categoryName, (counts.get(book.categoryName) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name]) => name);
};
