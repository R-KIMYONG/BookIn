import 'server-only';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { BookSummary } from '@/shared/domain/book/types';

// 사용자가 상호작용한 책의 표시용 최소 정보만 저장 (가격,책 소개는 저장하지 않음: YES24 약관)
type UpsertBookInput = BookSummary & { categoryName: string | null };

export const upsertBook = async (book: UpsertBookInput): Promise<string> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('books')
    .upsert(
      {
        item_id: book.itemId,
        adult: book.adult,
        isbn13: book.isbn13,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        thumbnail_url: book.cover,
        category_name: book.categoryName,
        pub_date: book.pubDate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'item_id' }
    )
    .select('id')
    .single();

  if (error) throw error;

  return data.id;
};
