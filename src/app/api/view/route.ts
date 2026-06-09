import { createClient } from '@/shared/lib/supabase/server';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DAY } from '@/shared/constants/time';
import { hashIdentifier } from '@/shared/lib/crypto/hashIdentifier';
import { getClientIp } from '@/shared/lib/network/getClientIp';
import { VK_COOKIE } from '@/shared/domain/detail/constants';
import { getTopViewBooks } from '@/shared/lib/server/entities/getTopViewBooks';

export const GET = async () => {
  const books = await getTopViewBooks();

  return NextResponse.json(books);
};

export const POST = async (request: NextRequest) => {
  const { isbn13 } = await request.json();
  if (!isbn13) return NextResponse.json({ error: 'isbn13 required' }, { status: 400 });

  const supabase = await createClient();
  // 로그인 유저 확인 (선택, user_id는 nullable)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // device_key: 로그인 여부 무관 항상 httpOnly 쿠키
  const cookieStore = await cookies();
  let deviceKey = cookieStore.get(VK_COOKIE)?.value;
  if (!deviceKey) {
    deviceKey = crypto.randomUUID();
    cookieStore.set(VK_COOKIE, deviceKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: DAY * 365, // 1년
      path: '/',
    });
  }

  // 3) isbn13 → book_id (트리거가 book_id로 book_stats를 찾으니 필요)
  const { data: book } = await supabase.from('books').select('id').eq('isbn13', isbn13).maybeSingle();
  if (!book) return NextResponse.json({ ok: false, reason: 'book not found' });

  const ip = getClientIp(request);
  const ua = request.headers.get('user-agent') ?? '';
  const acceptLang = request.headers.get('accept-language') ?? '';
  const compositeHash = hashIdentifier(`${ip}::${ua}::${acceptLang}`);
  //컴퓨터 지문->compositeHash를 더 강하게는 width/height값을 compositeHash에 넣기 또는 only로그인 또는 라이브러리로
  //봇/자동화를 감지해서 N분당 몇개의 view_count를 올렸는지도 ip,ua로 잡을수 있음

  const todayKST = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
  // 4) service-role로 insert. 두 unique 중 어디서 충돌해도 23505 → "이미 셈"으로 처리
  const admin = createAdminClient();

  const { data: softMatch } = await admin
    .from('book_views')
    .select('id')
    .eq('isbn13', isbn13)
    .eq('view_date', todayKST)
    .eq('composite_hash', compositeHash)
    .limit(1);

  if (softMatch && softMatch.length > 0) return NextResponse.json({ ok: true, reason: 'soft_dedup' });

  const { error } = await admin.from('book_views').insert({
    book_id: book.id,
    isbn13,
    device_key: deviceKey,
    user_id: user?.id ?? null,
    ip_hash: hashIdentifier(ip),
    user_agent_hash: hashIdentifier(ua),
    composite_hash: compositeHash,
  });

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
};
