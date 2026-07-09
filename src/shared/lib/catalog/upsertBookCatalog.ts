import { AladinBookInfo } from '@/shared/types/api';
import { createAdminClient } from '../supabase/admin';

export const upsertBookCatalog = async (
  map: Map<
    string,
    Pick<
      AladinBookInfo,
      'categoryId' | 'title' | 'description' | 'isbn13' | 'itemId' | 'author' | 'cover' | 'categoryName'
    >
  >
) => {
  const supabase = createAdminClient();

  const result = [...map.values()].map((item) => {
    return {
      item_id: String(item.itemId),
      isbn13: item.isbn13,
      thumbnail_url: item.cover,
      category_id: item.categoryId,
      category_name: item.categoryName,
      title: item.title,
      author: item.author,
      description: item.description,
    };
  });

  const { error } = await supabase.from('book_catalog').upsert(result, { onConflict: 'item_id' });

  if (error) throw new Error(`book_catalog upsert 실패: ${error.message}`);
};
