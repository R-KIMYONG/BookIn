import { BookInfo } from '@/shared/types/bookInfo';
import { SupabaseClient } from '@supabase/supabase-js';

type UpsertBookProps = {
  supabase: SupabaseClient;
  bookInfo: BookInfo;
};

export const upsertBook = async ({ supabase, bookInfo }: UpsertBookProps) => {
  const { data, error } = await supabase
    .from('books')
    .upsert(
      {
        isbn13: bookInfo.isbn13,
        title: bookInfo.title,
        author: bookInfo.author,
        thumbnail_url: bookInfo.cover,
        category_id: bookInfo.categoryId,
        category_name: bookInfo.categoryName,
      },
      { onConflict: 'isbn13' }
    )
    .select('id')
    .single();

  if (error) throw error;

  return data.id;
};
