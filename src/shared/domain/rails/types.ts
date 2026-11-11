import { StatsRow } from '@/hooks/book/useBookStats';
import { ItemId } from '../book/ids';
import { BookSummary } from '../book/types';
export type RailBook = BookSummary & { similarity?: number };

export type TopanchorType = {
  title: string;
  itemId: ItemId;
  category_id: string | null;
  category_name: string | null;
};

export type RailResult = {
  trending: { categoryName: string | null; books: RailBook[] };
  sniping: RailBook[];
  anchor: { title: string | null; books: RailBook[] };
};

export type RailBookView = RailBook & { stats?: StatsRow };
