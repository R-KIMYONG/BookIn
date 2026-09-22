import { createAdminClient } from '@/shared/lib/supabase/admin';
import { createClient } from '@/shared/lib/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  const { data: reactedCount } = await supabaseAdmin.rpc('get_reacted_count', { p_user_id: user.id });

  return NextResponse.json({ reactedCount }, { status: 200 });
};
