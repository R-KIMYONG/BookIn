import { syncCategoryCatalog } from '@/shared/lib/recommend/syncCategoryCatalog';
import { NextRequest, NextResponse } from 'next/server';

// 월 1회 차분 동기화: 바뀐 분류만 임베딩해서 보통 몇 초. 분류가 크게 바뀐 달 대비 여유
export const maxDuration = 60;

// Vercel cron(월 1회)이 부르는 입구. 수동 실행은 api/admin/sync-categories (POST)
export const GET = async (request: NextRequest) => {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const start = Date.now();
    const result = await syncCategoryCatalog();
    console.log('[cron] 카테고리 동기화', { ms: Date.now() - start, ...result });
    return NextResponse.json({ ok: true, ms: Date.now() - start, ...result });
  } catch (error) {
    console.error('[cron] 카테고리 동기화 실패:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'unknown' }, { status: 500 });
  }
};
