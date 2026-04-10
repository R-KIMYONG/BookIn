import { createClient } from '@/utils/supabase/client';

let client: ReturnType<typeof createClient> | null = null;

export const getBrowserSupabase = () => {
  if (!client) {
    client = createClient();
  }
  return client;
};
