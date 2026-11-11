import { syncCategoryCatalog } from '@/shared/lib/recommend/syncCategoryCatalog';
import { NextRequest, NextResponse } from 'next/server';

// 처음 채우기: 1,361개 임베딩(200개씩 7번) → 여유 있게
export const maxDuration = 60;

// 카테고리 임베딩 표 동기화 (처음 채울 때·수동 실행용). 월 1회 자동 실행은 cron route에서
export const POST = async (request: NextRequest) => {
  if (request.headers.get('x-admin-token') !== process.env.ADMIN_BUILD_TOKEN)
    return NextResponse.json({ error: '인증되지않는 시도입니다.' }, { status: 401 });

  try {
    const start = Date.now();
    const result = await syncCategoryCatalog();
    return NextResponse.json({ ok: true, ms: Date.now() - start, ...result });
  } catch (error) {
    console.error('카테고리 동기화 실패:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'unknown' }, { status: 500 });
  }
};
