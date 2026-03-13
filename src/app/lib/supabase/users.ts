import 'server-only';
import { createClient } from '@/utils/supabase/server';

export const clearPendingEmail = async (supabase: ReturnType<typeof createClient>, userId: string) => {
  return await supabase
    .from('users')
    .update({
      pending_email: null,
      pending_email_expires_at: null,
      email_change_token_hash: null,
    })
    .eq('id', userId);
};
