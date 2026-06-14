export type RankChange =
  | { type: 'new' }
  | { type: 'up'; diff: number }
  | { type: 'down'; diff: number }
  | { type: 'same' };

export type RankedBook = {
  isbn13: string;
  title: string;
  author: string;
  thumbnail_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  score: number;
  rank: number; // 오늘 순위 (1~50)
  change: RankChange; // 변동
};

export type TopViewType = {
  isbn13: string;
  title: string;
  author: string;
  thumbnail_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  score: number;
  categoryId: number;
  categoryName: string;
};
