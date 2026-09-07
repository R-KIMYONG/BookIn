import { DIGGING_GENRES, DIGGING_SYSTEM_PROMPT } from '@/shared/domain/digging/constants';
import { DiggingSchema } from '@/shared/domain/digging/schema';
import { AI_MODEL } from '@/shared/domain/recommend/constants';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod.mjs';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export const POST = async (res: NextRequest) => {
  const supabaseAdmin = createAdminClient();
  const signals: string[] = await res.json();

  if (signals.length === 0) return NextResponse.json({ error: '판단근거가 부족합니다.' }, { status: 500 });

  const client = new Anthropic();

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 1000,
    system: DIGGING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: JSON.stringify({ signals }) }],
    output_config: { format: zodOutputFormat(DiggingSchema) },
  });

  const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
  const parsed = DiggingSchema.safeParse(JSON.parse(text));
  const reader = parsed.success ? parsed.data : null;

  if (!reader) return NextResponse.json({ error: '분석 실패' }, { status: 500 });

  const { data: embeddings, error: embedError } = await supabaseAdmin.functions.invoke('embed', {
    body: { texts: [reader.searchQuery] },
  });

  if (embedError || !Array.isArray(embeddings) || !embeddings[0]) {
    return NextResponse.json({ error: '임베딩 실패' }, { status: 500 });
  }
  const queryVector = embeddings[0];

  const validCategories = (reader.categories ?? []).filter((c) => DIGGING_GENRES.includes(c as any));

  const { data: DiggingBookList, error } = await supabaseAdmin.rpc('match_book', {
    match_count: 18,
    query_embedding: JSON.stringify(queryVector),
    categories: validCategories.length > 0 ? validCategories : undefined,
  });
  if (error) return NextResponse.json({ error: '책 검색 실패' }, { status: 500 });

  return NextResponse.json({ reader, DiggingBookList }, { status: 200 });
};
