import { AI_MODEL, tasteAnalysisPrompt } from '@/shared/domain/recommend/constants';
import { buildPersona } from '@/shared/domain/taste/buildPersona';
import { TASTE_UNLOCK } from '@/shared/domain/taste/constants';
import {
  buildBehavioralFingerprint,
  buildPersonaFingerprint,
  buildPhysicalEvidence,
} from '@/shared/domain/taste/fingerprint';
import { RecV2Schema } from '@/shared/domain/taste/schema';
import { ReportType } from '@/shared/domain/taste/types';
import { getTopAnchors } from '@/shared/lib/rails/getTopAnchors';
import { getRecommendations } from '@/shared/lib/server/entities/getRecommendations';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { createClient } from '@/shared/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  try {
    const data = await getRecommendations(user.id);
    return NextResponse.json(data?.taste_summary ?? null, { status: 200 });
  } catch {
    return NextResponse.json({ error: '불러오기 실패' }, { status: 500 });
  }
};

export const POST = async () => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('nickname').eq('id', user.id).single();

  const nickname = profile?.nickname ?? '회원';

  const existing = await getRecommendations(user.id);

  if (existing?.taste_created_at) {
    const elapsed = Date.now() - new Date(existing.taste_created_at).getTime();
    const COOLDOWN = 5 * 60 * 1000; // 5분
    if (elapsed < COOLDOWN) {
      const leftMin = Math.ceil((COOLDOWN - elapsed) / 60000);
      return NextResponse.json({ error: `${leftMin}분 후에 다시 추천받을 수 있어요` }, { status: 429 });
    }
  }

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

  if (total < TASTE_UNLOCK) return NextResponse.json({ error: '데이터 부족' }, { status: 409 });

  const persona = buildPersona(genres, total);

  const topAnchor = await getTopAnchors(user.id);

  const { data: signal, error: signalError } = await supabaseAdmin.rpc('get_signal_mix', { p_user_id: user.id });
  if (signalError) return NextResponse.json({ error: '행동 시그널 분석 실패' }, { status: 500 });

  const { likes, bookmarks, comments, views } = signal?.[0] ?? { likes: 0, bookmarks: 0, comments: 0, views: 0 };

  //====================최종 지문 집합====================
  const aiInputPayload = {
    user_dna: {
      nickname: nickname,
      persona_title: persona.title,
      surprise_genre: persona.surprise,
      behavioralFingerprint: buildBehavioralFingerprint({ likes, bookmarks, comments, views }), //signal 지문
      personaFingerprint: buildPersonaFingerprint(genres, total), //persona 지문
      physical_evidence: buildPhysicalEvidence(topAnchor), //TopAnchor 지문
    },
  };

  const client = new Anthropic();

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: JSON.stringify(aiInputPayload),
      },
    ],
    system: tasteAnalysisPrompt(nickname),
    output_config: { format: zodOutputFormat(RecV2Schema) },
  });

  const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
  const parsed = RecV2Schema.safeParse(JSON.parse(text));
  const result = parsed.success ? parsed.data : null;

  const { error: upsertErr } = await supabaseAdmin.from('user_recommendations_v2').upsert(
    {
      user_id: user.id,
      taste_summary: result,
      taste_created_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (upsertErr) {
    console.error('taste 저장 실패', upsertErr);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
  return NextResponse.json({ taste_summary: result }, { status: 200 });
};
