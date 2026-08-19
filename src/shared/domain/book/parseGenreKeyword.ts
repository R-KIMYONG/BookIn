export const parseGenreKeyword = (categoryName: string | null | undefined): string => {
  if (!categoryName) return '미분류';

  // 1. '>' 기호로 쪼개기 (예: ["국내도서", "소설/시/희곡", "과학소설(SF)", "외국 과학소설"])
  const parts = categoryName.split('>').map((p) => p.trim());

  if (parts.length <= 1) return parts[0] || '미분류';

  // 2. 너무 포괄적인 대분류(국내도서, 장르소설 등)는 뒤로 밀고,
  //    성향이 가장 잘 드러나는 '뒤에서 두 번째' 혹은 '마지막' 단어를 타겟팅합니다.
  const lastPart = parts[parts.length - 1];
  const secondLastPart = parts[parts.length - 2];

  // 예: '외국 과학소설' 보다는 '과학소설(SF)'이 AI가 요리하기 더 좋습니다.
  if (lastPart.includes('외국') || lastPart.includes('한국') || lastPart.includes('기타')) {
    return secondLastPart || lastPart;
  }

  // 예: '순정만화>BL'에서 'BL' 같은 강력한 서브컬처 키워드가 있다면 그대로 반환
  return lastPart;
};
