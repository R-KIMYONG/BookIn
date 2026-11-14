import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabaseAdmin = createAdminClient();

  const user = await getCurrentUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  const { data: reactedCount } = await supabaseAdmin.rpc('get_reacted_count', { p_user_id: user.id });

  return NextResponse.json({ reactedCount }, { status: 200 });
};
