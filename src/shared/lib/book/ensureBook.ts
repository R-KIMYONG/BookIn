import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { createAdminClient } from '../supabase/admin';
import { getYes24Detail } from '../yes24/getYes24Detail';
import { upsertBook } from './upsertBook';

type EnsuredBook = { id: string; adult: boolean };

export const ensureBook = async (itemId: ItemId): Promise<EnsuredBook | null> => {
  const supabaseAdmin = createAdminClient();
  const { data: existing, error } = await supabaseAdmin
    .from('books')
    .select('id,adult')
    .eq('item_id', itemId)
    .maybeSingle();
  if (error) throw error;
  if (existing) return existing;

  const book = await getYes24Detail(itemId);
  if (!book) return null;

  return { id: await upsertBook(book), adult: book.adult };
};
