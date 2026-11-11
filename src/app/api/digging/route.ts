import { DIGGING_SYSTEM_PROMPT, QUESTIONS_COUNT } from '@/shared/domain/digging/constants';
import { DiggingSchema } from '@/shared/domain/digging/schema';
import { AI_MODEL } from '@/shared/domain/recommend/constants';
import { embedText } from '@/shared/lib/embedding/embedText';
import { buildDiggingBooks } from '@/shared/lib/recommend/buildDiggingBooks';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod.mjs';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const MAX_SIGNAL_LENGTH = 100;

const isValidSignals = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.length <= QUESTIONS_COUNT &&
  value.every((s) => typeof s === 'string' && s.length > 0 && s.length <= MAX_SIGNAL_LENGTH);

export const POST = async (request: NextRequest) => {
  const signals: unknown = await request.json().catch(() => null);

  if (!isValidSignals(signals))
    return NextResponse.json({ message: '선택한 답을 다시 확인해 주세요.' }, { status: 400 });

  let stage = 'analyze';
  try {
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
    if (!parsed.success) throw new Error(`분석 결과 형식 오류 (stop_reason: ${response.stop_reason})`);
    const reader = parsed.data;

    stage = 'embed';
    const [queryVector] = await embedText([reader.searchQuery], 'query');
    stage = 'books';
    const books = await buildDiggingBooks(queryVector, reader.keywords);

    return NextResponse.json({ reader, DiggingBookList: books }, { status: 200 });
  } catch (error) {
    console.error(`[digging] ${stage} 실패:`, error);
    return NextResponse.json({ message: '책을 찾는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.' }, { status: 502 });
  }
};
