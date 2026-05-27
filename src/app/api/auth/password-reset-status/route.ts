import { createClient } from '@/shared/lib/supabase/server';
import { clearPasswordResetState } from '@/shared/lib/supabase/users';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'email required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id,password_reset_email,password_reset_expires_at')
    .eq('email', email)
    .maybeSingle();

  if (error) return NextResponse.json({ message: '조회 실패' }, { status: 500 });

  if (data?.password_reset_expires_at && new Date(data.password_reset_expires_at).getTime() <= Date.now()) {
    const { error: clearPendingError } = await clearPasswordResetState(supabase, data.id);

    if (clearPendingError) return NextResponse.json({ message: '만료 상태 정리 실패' }, { status: 500 });

    return Response.json({
      pendingEmail: null,
      expireAt: null,
    });
  }

  return NextResponse.json({
    pendingEmail: data?.password_reset_email ?? null,
    expireAt: data?.password_reset_expires_at ? new Date(data.password_reset_expires_at).getTime() : null,
  });
};
