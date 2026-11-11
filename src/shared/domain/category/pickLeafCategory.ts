type LeafCandidate = { category_id: string; category_name: string; similarity: number };
type BookOrigin = { author: string; originalTitle: string | null };

// 1·2등 점수 차이가 이보다 크면 임베딩 결과를 그대로 믿음
// 실측: 확실한 책(싯다르타·데미안·가호)은 0.05 안팎, 애매한 책(모순 0.009·노르웨이의 숲 0.007)은 0.01 안팎
export const MIN_SIMILARITY_GAP = 0.02;

const KANA = /[぀-ヿ]/; // 히라가나·가타카나 → 일본 원서의 번역본

// 책의 출신 단서: 원제가 일본어면 '일본', 번역 표기(역)도 원제도 없으면 '한국'
const originHint = ({ author, originalTitle }: BookOrigin): string | null => {
  if (originalTitle && KANA.test(originalTitle)) return '일본';
  const translated = /(^|[\s/])(역|옮김|번역)/.test(author) || !!originalTitle;
  return translated ? null : '한국';
};

// 책소개 임베딩으로 고른 소분류 후보(점수 높은 순) 중 하나를 확정. 확실하지 않으면 null(중분류 유지)
// 1. 1·2등 차이가 크면 1등
// 2. 차이가 작으면 출신 단서('한국'·'일본')가 이름에 들어간 후보
// 3. 그래도 없으면 null → 틀린 소분류보다 넓은 중분류가 나음
export const pickLeafCategory = (candidates: LeafCandidate[], book: BookOrigin): string | null => {
  const [first, second] = candidates;
  if (!first) return null;
  if (!second || first.similarity - second.similarity >= MIN_SIMILARITY_GAP) return first.category_id;

  const hint = originHint(book);
  if (!hint) return null;

  return candidates.find((c) => c.category_name.includes(hint))?.category_id ?? null;
};
