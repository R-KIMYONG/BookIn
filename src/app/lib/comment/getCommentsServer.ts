import { createClient } from '@/utils/supabase/server';
import { fetchComments } from './fetchComments';

export const getCommentsServer = async ({ bookId, page }: { bookId: string; page: number }) => {
  const supabase = await createClient();
  return fetchComments(supabase, bookId, page);
};
