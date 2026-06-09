import 'server-only';
import { createClient } from '@/shared/lib/supabase/server';
import { TopViewType } from '@/shared/domain/ranking/types';

export const getTopViewBooks = async (): Promise<TopViewType[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('book_ranking')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
};
