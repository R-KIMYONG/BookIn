import { buildPersona } from '@/shared/domain/taste/buildPersona';
import { TASTE_UNLOCK } from '@/shared/domain/taste/constants';
import { ReportType } from '@/shared/domain/taste/types';
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

  const { data, error } = await supabaseAdmin.rpc('get_taste_distribution', { p_user_id: user.id });

  if (error) return NextResponse.json({ error: '취향 분석 실패' }, { status: 500 });

  const genres = (data ?? []).map((report: ReportType) => {
    return {
      genre: report.genre,
      cnt: Number(report.cnt),
    };
  });

  const total = genres.reduce((s: number, g: ReportType) => {
    return s + g.cnt;
  }, 0);

  const persona = buildPersona(genres, total);

  if (total >= TASTE_UNLOCK) {
    const { data: userRow } = await supabase
      .from('users')
      .select('persona_id,persona_title')
      .eq('id', user.id)
      .maybeSingle();

    if (userRow?.persona_id !== persona.id || userRow?.persona_title !== persona.title) {
      const { error: upErr } = await supabaseAdmin
        .from('users')
        .update({
          persona_id: persona.id,
          persona_title: persona.title,
          persona_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (upErr) console.error('persona 저장 실패:', upErr);
    }
  }

  return NextResponse.json({ genres, persona }, { status: 200 });
};
