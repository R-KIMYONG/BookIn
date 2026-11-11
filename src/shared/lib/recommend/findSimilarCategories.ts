import 'server-only';
import { isExcludedCategory } from '@/shared/domain/recommend/cleanCandidates';
import { createAdminClient } from '../supabase/admin';

// 제외 분류(참고서 등)를 거른 뒤에도 원하는 수가 남도록 넉넉히 받음
const OVERFETCH = 3;

// 기준 분류와 가까운 소분류 count개 (기준 분류 자신이 있으면 1등으로 포함됨)
// 기준 분류 자체가 제외 대상(예: 참고서 책을 좋아함)이면 같은 종류의 분류는 허용

type FindSimilarOptions = { mall?: string };

export const findSimilarCategories = async (
  seedCategoryIds: string[],
  count: number,
  { mall }: FindSimilarOptions = {}
): Promise<string[]> => {
  if (seedCategoryIds.length === 0) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('match_category', {
    p_category_ids: seedCategoryIds,
    p_match_count: count * OVERFETCH,
    p_mall: mall,
  });
  if (error) throw error;

  // 분류 경로의 중분류 이름('국내도서>중등참고서>…' → '중등참고서')으로 제외 판단
  const midName = (fullPath: string) => fullPath.split('>')[1] ?? null;

  const seedIsExcluded = (data ?? []).some(
    (c) => seedCategoryIds.includes(c.category_id) && isExcludedCategory(midName(c.full_path))
  );

  return (
    (data ?? [])
      .filter((c) => seedIsExcluded || !isExcludedCategory(midName(c.full_path)))
      // '[Welcome to America]' 같은 교재 시리즈 분류는 제외 (추천 분야로 부적합하고 대부분 베스트셀러도 없음)
      .filter((c) => !c.category_name.trim().startsWith('['))
      .slice(0, count)
      .map((c) => c.category_id)
  );
};
