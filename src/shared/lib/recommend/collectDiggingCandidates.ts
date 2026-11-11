import 'server-only';
import { BookDetail } from '@/shared/domain/book/types';
import { createAdminClient } from '../supabase/admin';
import { isExcludedCategory } from '@/shared/domain/recommend/cleanCandidates';
import { getYes24ListDetails } from '../yes24/getYes24ListDetails';
import { getYes24SearchDetails } from '../yes24/getYes24SearchDetails';

const CATEGORY_COUNT = 3; // 갈래 A: 고를 분야 수
const PER_SOURCE = 20; // 분야 하나·검색어 하나에서 가져올 책 수
const OVERFETCH = 3; // 시리즈·참고서 분야를 거르고도 3개가 남도록 넉넉히

const collectFromCategories = async (queryVector: number[]): Promise<BookDetail[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('match_leaf_category', {
    p_query_embedding: JSON.stringify(queryVector),
    p_parent_id: '001', // 국내도서 전체에서
    p_match_count: CATEGORY_COUNT * OVERFETCH,
  });
  if (error) throw error;

  const categoryIds = (data ?? [])
    .filter((c) => !c.category_name.trim().startsWith('[')) // '[Welcome to America]' 같은 교재 시리즈
    .filter((c) => !isExcludedCategory(c.full_path)) // 수험서·참고서·어린이·유아
    .slice(0, CATEGORY_COUNT)
    .map((c) => c.category_id);

  const lists = await Promise.all(
    categoryIds.map((categoryId) => getYes24ListDetails({ listType: 'bestseller', categoryId, pageSize: PER_SOURCE }))
  );
  return lists.flat();
};

const collectFromKeywords = async (keywords: string[]): Promise<BookDetail[]> => {
  const lists = await Promise.all(keywords.map((query) => getYes24SearchDetails({ query, pageSize: PER_SOURCE })));
  return lists.flat();
};

export const collectDiggingCandidates = async (queryVector: number[], keywords: string[]) => {
  const [categoryBooks, searchBooks] = await Promise.all([
    collectFromCategories(queryVector),
    collectFromKeywords(keywords),
  ]);
  return { categoryBooks, searchBooks };
};
