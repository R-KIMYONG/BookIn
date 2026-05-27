import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export const GET = async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });

    const { data, error } = await supabase
      .from('users')
      .select('pending_email, pending_email_expires_at')
      .eq('id', user.id)
      .maybeSingle();

    if (error) return NextResponse.json({ message: '이메일 인증 상태 조회 실패' }, { status: 500 });

    const pendingEmail = data?.pending_email ?? '';

    const emailExpireAt = data?.pending_email_expires_at ? new Date(data.pending_email_expires_at).getTime() : null;

    return NextResponse.json({
      pendingEmail,
      emailExpireAt,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
};
