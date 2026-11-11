// 공통 meta
export type Yes24Meta = {
  apiTitle: string;
  apiLink: string;
  logoUrl: string; // 출처 표기용 YES24 로고
  pubDate: string; // 응답 시각 (ISO). 책 출간일 아님
  query: string;
  version: string;
};

// 책 상세 콘텐츠 (detail=Y 일 때 확실히 옴)
export type Yes24ContentDetail = {
  bookIntroduction: string | null; // <b>, \r\n 섞여 있음
  bookSummary: string | null; // 실제로 null 확인됨
  tableOfContents: string | null;
};

// 책 한 권
export type Yes24Item = {
  sortOrder: number; // 목록 내 순서 (순위)
  itemId: number;
  title: string;
  author: string; // '맘마미아 저', '주부의벗 저/유나현 역' 형태
  goodsType: string; // '도서'
  goodsSortNm: string; // '국내도서-가정 살림'
  adultYn: 'Y' | 'N';
  publisher: string;
  isbn10: string | null;
  isbn13: string | null; // 비도서는 '880…' 바코드
  shopPrice: number; // 12000.00 형태
  salePrice: number;
  publishDate: string; // '20260915'
  itemStatus: string; // '판매중'
  cover: string; // https://image.yes24.com/goods/{itemId}/L
  sideCover: string;
  backCover: string;
  link: string; // YES24 상품 페이지 (출처 링크로 사용)
  addOnLink: string;
  upDown: number | null; // 베스트셀러 순위 변동
  contentDetail?: Yes24ContentDetail;

  // detail=Y 에서만 오는 필드 (2026-10-29 실제 응답으로 확인)
  subTitle?: string | null;
  mobileLink?: string;
  starScore?: number; // 10점 만점 (9.5)
  salePoint?: number; // 판매지수
  yesPoint?: number; // 적립금
  pages?: number;
  ebookId?: number | null;
  eBookLink?: string | null; // 전자책이 있을 때만
  series?: Yes24Series[];
  fixedBookPriceYn?: 'Y' | 'N';
  originalTitle?: string;
  originalTranslation?: string;
  weight?: number;
  width?: number;
  length?: number;
  height?: number;
  itemFormat?: string | null;
};

export type Yes24Series = {
  seriesId: number;
  seriesName: string; // 끝에 공백 섞인 경우 있음
};

// 목록 응답의 data (검색, 베스트셀러, 신상품, 스테디셀러)
export type Yes24ListData = {
  meta: Yes24Meta;
  items: Yes24Item[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
};

// 카테고리 한 항목
export type Yes24Category = {
  categoryId: string; // '001001046' (앞자리 0 → 반드시 문자열)
  categoryName: string; // 끝에 공백 섞인 경우 있음 ('코믹 ')
  categoryFullPath: string; // '국내도서>소설/시/희곡' (중간 이름이 부모 이름과 다를 수 있음)
  categoryUrl: string;
};

// 카테고리 목록 응답의 data (목록 이름이 items가 아니라 data)
export type Yes24CategoryListData = {
  meta: Yes24Meta;
  data: Yes24Category[];
};

export type SearchCategory = 'ALL' | 'BOOK' | 'FOREIGN' | 'EBOOK';
export type SearchSort = 'DEFAULT' | 'RELATION' | 'RECENT' | 'REG_DTS';

//============ 홈 ============
export type Yes24ListType = 'bestseller' | 'bestsellerSteady' | 'bestsellerDeal' | 'newproduct' | 'newproductAttention';
