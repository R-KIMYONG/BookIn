import 'server-only';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { MypageUserInfo } from '@/shared/domain/user/types';
import { getCurrentUser } from '../../auth/getCurrentUser';

export const getUserInfoServer = async (): Promise<MypageUserInfo | null> => {
  const user = await getCurrentUser();

  if (!user) return null;
  // email 은 공개 컬럼이 아니라서 본인 확인 후 관리자 클라이언트로 조회
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id,email,nickname,avatar,created_at')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('사용자 프로필 정보를 찾을 수 없습니다.');

  return data;
};
