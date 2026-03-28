import { createClient } from '@/utils/supabase/server';

export const getUserInfoServer = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id,email,nickname,avatar,created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('사용자 프로필 정보를 찾을 수 없습니다.');

  return data;
};
