import 'server-only';
import { createClient } from '../../supabase/server';
export const getRecommendations = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_recommendations')
    .select('recommendations, taste_summary, created_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return data;
};
