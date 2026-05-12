import { createClient } from '@/shared/lib/supabase/server';
import { fetchComments } from './fetchComments';

export const getCommentsServer = async ({ bookId, page }: { bookId: string; page: number }) => {
  const supabase = await createClient();
  return fetchComments(supabase, bookId, page);
};
