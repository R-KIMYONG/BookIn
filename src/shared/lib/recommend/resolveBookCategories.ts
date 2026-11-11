import 'server-only';
import { BookDetail } from '@/shared/domain/book/types';
import { buildEmbedText } from '@/shared/domain/recommend/buildEmbedText';
import { resolveCategoryId } from '@/shared/domain/category/resolveCategoryId';
import { pickLeafCategory } from '@/shared/domain/category/pickLeafCategory';
import { embedText } from '../embedding/embedText';
import { createAdminClient } from '../supabase/admin';
import { getYes24CategoryList } from '../yes24/getYes24CategoryList';

// 소분류 번호 길이 (몰 3 + 중분류 3 + 소분류 3 = 9자리는 중분류, 12자리가 소분류)
const LEAF_LENGTH = 12;
// 점수가 애매할 때 출신 단서('한국소설'·'일본소설')를 찾을 수 있도록 상위 몇 개를 받음
const LEAF_CANDIDATES = 4;

// 경로로 분류를 못 찾았을 때 임베딩으로 찾을 범위 (sortPath 첫 단계 = 몰 이름)
// eBook은 상품 분류 이름 체계가 카테고리 목록과 달라('ebook-문학-소설') 경로로는 거의 못 찾음
// → 국내도서(종이책) 분류에서 찾음: eBook 분류의 책은 대부분 종이책과 같은 책이라 후보가 늘지 않고,
//   종이책판은 제목이 같아 cleanCandidates가 빼 줌
const searchMallFor = (sortPath: string | null): string | null => {
  const mall = sortPath?.split('-')[0]?.trim().toLowerCase();
  if (mall === '국내도서' || mall === 'ebook') return '001';
  if (mall === '외국도서') return '002'; // 영미 원서는 목록과 이름이 달라('유아/어린이' vs '유아 어린이 청소년') 자주 실패
  return null;
};

type Job = { bookIndex: number; parentId: string; mode: 'narrow' | 'fallback' };

// 공백·'/'·'&'를 지운 비교용 이름 ('문학/소설' → '문학소설')
const loose = (name: string) => name.replace(/[\s/&.·]/g, '').toLowerCase();

// 경로로 못 찾은 책의 중분류 이름('외국도서-문학' → '문학')을 목록의 중분류와 느슨하게 맞춤
// 외국도서는 같은 분류를 '문학 소설'·'문학/소설'처럼 다르게 써서 정확히는 안 맞지만 앞부분은 같음
// → 찾으면 그 중분류 안에서만 임베딩으로 고름 (몰 전체에서 고르면 제목의 'American' 때문에 영어 교재 분류가 뽑히기도 함)
const findLooseMidCategory = (
  sortPath: string | null,
  mallId: string,
  categoryList: { categoryId: string; categoryName: string }[]
): string | null => {
  const midName = sortPath?.split('-')[1]?.trim();
  if (!midName) return null;

  const target = loose(midName);
  const mid = categoryList.find((c) => {
    if (c.categoryId.length !== 9 || !c.categoryId.startsWith(mallId)) return false;
    const name = loose(c.categoryName);
    return name === target || name.startsWith(target) || target.startsWith(name);
  });
  return mid?.categoryId ?? null;
};

// '[Welcome to America]'처럼 대괄호로 시작하는 분류는 교재 시리즈라 추천 분야로 부적합 (대부분 베스트셀러도 없음)
const isSeriesCategory = (name: string) => name.trim().startsWith('[');

// 책마다 소분류 번호 (못 찾으면 null). 책과 같은 순서
// 1. sortPath로 정확히 찾기 (YES24가 소분류까지 알려주면 여기서 끝)
// 2. 중분류까지만 찾았으면(narrow) → 책소개 임베딩과 그 중분류 아래 소분류들을 비교해서 좁힘
//    (YES24 상품 대부분이 '국내도서-소설/시/희곡'처럼 중분류까지만 와서, 그대로 쓰면 소설 독자 모두가 같은 분야가 됨)
// 3. 아예 못 찾았으면(fallback: eBook·영미 원서) → 책소개 임베딩과 같은 몰의 소분류 전체를 비교
export const resolveBookCategories = async (books: BookDetail[]): Promise<(string | null)[]> => {
  const categoryList = await getYes24CategoryList();
  const exact = books.map((book) => resolveCategoryId(book.sortPath, categoryList));

  const jobs: Job[] = books.flatMap((book, bookIndex): Job[] => {
    const id = exact[bookIndex];
    if (id && id.length < LEAF_LENGTH) return [{ bookIndex, parentId: id, mode: 'narrow' }];
    if (id) return [];

    const mall = searchMallFor(book.sortPath);
    if (!mall) return [];
    // 중분류 이름을 느슨하게라도 찾으면 그 안에서, 못 찾으면 몰 전체에서
    // (eBook은 분류 이름 체계가 달라 국내도서 중분류와 맞지 않으므로 대부분 몰 전체)
    const parentId = findLooseMidCategory(book.sortPath, mall, categoryList) ?? mall;
    return [{ bookIndex, parentId, mode: 'fallback' }];
  });
  if (jobs.length === 0) return exact;

  // 좁히기·대체 경로가 필요한 책을 한 번에 임베딩
  const vectors = await embedText(jobs.map((job) => buildEmbedText(books[job.bookIndex])));
  const supabase = createAdminClient();

  const picked = await Promise.all(
    jobs.map(async (job, i) => {
      const { data, error } = await supabase.rpc('match_leaf_category', {
        p_query_embedding: JSON.stringify(vectors[i]),
        p_parent_id: job.parentId,
        p_match_count: LEAF_CANDIDATES,
      });
      if (error) throw error;

      const candidates = (data ?? []).filter((c) => !isSeriesCategory(c.category_name));
      // 1·2등 점수 차이가 작으면(애매하면) 책의 출신 단서로 고름
      const leaf = pickLeafCategory(candidates, books[job.bookIndex]);
      // narrow: 애매하면 null → 아래에서 원래 중분류 유지 (틀린 소분류보다 넓은 중분류가 나음)
      // fallback: 기댈 중분류가 없으므로 애매해도 1등을 씀 (없으면 레일이 통째로 비니까)
      return job.mode === 'narrow' ? leaf : (leaf ?? candidates[0]?.category_id ?? null);
    })
  );

  const result = [...exact];
  jobs.forEach((job, i) => {
    result[job.bookIndex] = picked[i] ?? exact[job.bookIndex];
  });
  return result;
};
