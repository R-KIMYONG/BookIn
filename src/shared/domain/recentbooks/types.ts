import { ItemId } from '@/shared/domain/book/ids';

export type RecentBook = {
  item_id: ItemId;
  viewed_at: string;
  books: {
    item_id: ItemId;
    title: string;
    author: string | null;
    thumbnail_url: string | null;
  } | null;
};
