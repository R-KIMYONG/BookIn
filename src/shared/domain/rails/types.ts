import { StatsRow } from '@/hooks/book/useBookStats';
import { BookInfo } from '@/shared/types/bookInfo';
export type RailBook = BookInfo & { similarity?: number; itemId: string };

export type TopanchorType = {
  title: string;
  isbn13: string;
  category_id: number;
  category_name: string;
};

export type RailResult = {
  trending: { categoryName: string | null; books: RailBook[] };
  sniping: RailBook[];
  anchor: { title: string | null; books: RailBook[] };
};

export type RailBookView = RailBook & { stats?: StatsRow };
