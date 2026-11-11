import 'server-only';
import { collectDiggingCandidates } from './collectDiggingCandidates';
import { cleanCandidates } from '@/shared/domain/recommend/cleanCandidates';
import { embedText } from '../embedding/embedText';
import { buildEmbedText } from '@/shared/domain/recommend/buildEmbedText';
import { rankBySimilarity } from '@/shared/domain/recommend/rankBySimilarity';
import { capPerAuthor, MAX_PER_AUTHOR } from '@/shared/domain/recommend/capPerAuthor';
import { toRailBooks } from '@/shared/domain/recommend/toRailBooks';

const RESULT_SIZE = 18;

export const buildDiggingBooks = async (queryVector: number[], keywords: string[]) => {
  const { categoryBooks, searchBooks } = await collectDiggingCandidates(queryVector, keywords);

  const candidates = cleanCandidates(null, [...categoryBooks, ...searchBooks]);

  if (candidates.length === 0) return [];

  const vectors = await embedText(candidates.map(buildEmbedText)); // 후보를 전부 임베딩해서 queryVector와 비교

  const ranked = rankBySimilarity(
    queryVector,
    candidates.map((book, i) => ({ itemId: book.itemId, vector: vectors[i] })),
    { limit: candidates.length }
  );

  const categoryById = new Map(candidates.map((book) => [book.itemId, book.categoryName]));

  const books = capPerAuthor(toRailBooks(ranked, candidates), MAX_PER_AUTHOR).slice(0, RESULT_SIZE);

  return books.map((book) => ({ ...book, categoryName: categoryById.get(book.itemId) }));
};
