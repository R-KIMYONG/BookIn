import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { createAdminClient } from '../supabase/admin';
import { getYes24Detail } from '../yes24/getYes24Detail';
import { upsertBook } from './upsertBook';

export const ensureBook = async (itemId: ItemId): Promise<string | null> => {
  const supabaseAdmin = createAdminClient();
  const { data: existing, error } = await supabaseAdmin
    .from('books')
    .select('id')
    .eq('item_id', itemId)
    .maybeSingle();

  if (error) throw error;
  if (existing) return existing.id;

  const book = await getYes24Detail(itemId);
  if (!book) return null;

  return upsertBook(book);
};
