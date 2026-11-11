import { ItemId } from '@/shared/domain/book/ids';

export type RankChange =
  | { type: 'new' }
  | { type: 'up'; diff: number }
  | { type: 'down'; diff: number }
  | { type: 'same' };

export type TopViewType = {
  item_id: ItemId;
  title: string;
  author: string;
  thumbnail_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  score: number;
};

export type RankedBook = TopViewType & {
  rank: number; // 오늘 순위 (1~50)
  change: RankChange; // 변동
};
