import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) return NextResponse.json(null, { status: 200 });

    // email 은 공개 컬럼이 아니라서 본인 확인 후 관리자 클라이언트로 조회
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
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
