import 'server-only';
import { SupabaseClient } from '@supabase/supabase-js';

export const clearPendingEmail = async (supabase: SupabaseClient, userId: string) => {
  return await supabase
    .from('users')
    .update({
      pending_email: null,
      pending_email_expires_at: null,
      email_change_token_hash: null,
    })
    .eq('id', userId);
};
