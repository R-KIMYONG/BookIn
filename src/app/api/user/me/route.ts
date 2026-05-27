import { createClient } from '@/shared/lib/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) return NextResponse.json({ message: '인증 정보를 확인할 수 없습니다.' }, { status: 401 });

    if (!user) return NextResponse.json(null, { status: 200 });

    const { data, error } = await supabase
      .from('users')
      .select('id,email,nickname,avatar,created_at')
      .eq('id', user.id)
      .single();

    if (error) return NextResponse.json({ message: '사용자 정보를 조회하지 못했습니다.' }, { status: 500 });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
};
