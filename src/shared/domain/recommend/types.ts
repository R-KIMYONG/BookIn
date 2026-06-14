export type BookMapType = {
  isbn13: string;
  title: string;
  author: string;
  liked: boolean;
  bookmarked: boolean;
  commented: boolean;
  viewed: boolean;
  score: number;
};

export type RecommendBook = {
  isbn13: string;
  title: string;
  author: string | null;
  cover: string | null;
  categoryId: number;
  categoryName: string;
};
export type RecommendGroup = { label: string; books: RecommendBook[] };
export type RecommendDataType =
  | { taste_summary: string; recommendations: RecommendGroup[]; created_at?: string }
  | { coldStart: true; recommendations: [] };
