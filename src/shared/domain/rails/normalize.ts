import { RailBook } from '@/shared/domain/rails/types';
import { AladinBookInfo } from '@/shared/types/api';

// RPC 결과(snake) → RailBook(camel)
export const toRailBook = (b: {
  isbn13: string;
  title: string;
  author: string;
  thumbnail_url: string;
  category_id: number;
  category_name: string;
  similarity: number;
  item_id: string;
}): RailBook => ({
  isbn13: b.isbn13,
  title: b.title,
  author: b.author,
  cover: b.thumbnail_url,
  categoryId: b.category_id,
  categoryName: b.category_name,
  similarity: b.similarity,
  itemId: b.item_id,
});

// 알라딘 → RailBook (similarity 없음)
export const fromAladin = (b: AladinBookInfo): RailBook => ({
  isbn13: b.isbn13 || b.isbn,
  title: b.title,
  author: b.author,
  cover: b.cover,
  categoryId: b.categoryId,
  categoryName: b.categoryName,
  itemId: String(b.itemId),
});
