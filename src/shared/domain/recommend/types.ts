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
  item_id: string;
  isbn13: string;
  title: string;
  author: string;
  thumbnail_url: string;
  similarity: number;
};
export type RecommendGroup = { label: string; books: RecommendBook[] };
export type RecommendDataType =
  | { taste_summary: string; recommendations: RecommendGroup[]; created_at?: string }
  | { coldStart: true; recommendations: [] };

export type RecommendData = {
  recommendations: RecommendBook[];
  taste_summary: string | null;
  created_at: Date;
  label: string | null;
  coldStart?: boolean;
} | null;
