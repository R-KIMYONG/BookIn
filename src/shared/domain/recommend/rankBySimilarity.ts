import { ItemId } from '../book/ids';
import { cosineSimilarity } from './vector';

type Candidate = { itemId: ItemId; vector: number[] };
export type Ranked = { itemId: ItemId; similarity: number };

type RankOptions = {
  limit: number;
  excludeIds?: Set<ItemId>;
};
export const rankBySimilarity = (
  base: number[],
  candidates: Candidate[],
  { limit, excludeIds }: RankOptions
): Ranked[] => {
  const best = new Map<ItemId, number>();

  for (const { itemId, vector } of candidates) {
    if (excludeIds?.has(itemId)) continue;
    const similarity = cosineSimilarity(base, vector);
    const prev = best.get(itemId);
    if (prev === undefined || similarity > prev) best.set(itemId, similarity);
  }

  return Array.from(best, ([itemId, similarity]) => ({ itemId, similarity }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
};
