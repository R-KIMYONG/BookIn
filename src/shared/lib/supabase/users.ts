import 'server-only';
import { SupabaseClient } from '@supabase/supabase-js';

export const clearEmailChangeState = async (supabase: SupabaseClient, userId: string) => {
  return await supabase
    .from('users')
    .update({
      pending_email: null,
      pending_email_expires_at: null,
      email_change_token_hash: null,
    })
    .eq('id', userId);
};

export const clearPasswordResetState = async (supabase: SupabaseClient, userId: string) => {
  return await supabase
    .from('users')
    .update({
      password_reset_email: null,
      password_reset_expires_at: null,
      password_reset_token_hash: null,
    })
    .eq('id', userId);
};
