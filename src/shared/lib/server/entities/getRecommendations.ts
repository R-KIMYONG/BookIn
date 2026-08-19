import 'server-only';
import { createClient } from '../../supabase/server';
import { Database } from '@/shared/types/supabase';

type GetUserRecommendationV2Type = Database['public']['Tables']['user_recommendations_v2']['Row'];
export const getRecommendations = async (userId: string): Promise<GetUserRecommendationV2Type> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_recommendations_v2')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return data;
};
