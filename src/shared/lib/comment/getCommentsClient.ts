import { fetchComments } from './fetchComments';
import { getBrowserSupabase } from './clientSingleton';

export const getCommentsClient = ({ bookId, page }: { bookId: string; page: number }) => {
  const supabase = getBrowserSupabase();
  return fetchComments(supabase, bookId, page);
};
