import { createClient } from '@/utils/supabase/server';

export const getUserInfoServer = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) return null;
  const { data, error } = await supabase
    .from('users')
    .select('id,email,nickname,avatar,created_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('사용자 프로필 정보를 찾을 수 없습니다.');

  return data;
};
