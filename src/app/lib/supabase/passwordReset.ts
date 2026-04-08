import 'server-only';
import { SupabaseClient } from '@supabase/supabase-js';

export const consumePasswordResetToken = async (supabase: SupabaseClient, tokenHash: string) => {
  return await supabase
    .from('users')
    .update({
      password_reset_token_hash: null,
      password_reset_expires_at: null,
      password_reset_email: null,
    })
    .eq('password_reset_token_hash', tokenHash)
    .gt('password_reset_expires_at', new Date().toISOString())
    .select('id')
    .maybeSingle();
};
