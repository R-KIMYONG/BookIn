import { sleep } from '@/shared/domain/catalog/sleep';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { NextResponse } from 'next/server';

export const POST = async () => {
  // 1. supabase.from('book_catalog').select()  — 조회 (함수 호출)
  // 2. supabase.functions.invoke('embed', { body: {texts} })  — embed 함수 호출
  // 3. supabase.from('book_catalog').update()  — 저장 (함수 호출)

  const supabase = createAdminClient();

  let loop = 0;
  const MAX_LOOP = 20000;
  let failCount = 0;

  while (loop < MAX_LOOP) {
    loop++;
    const { data: rows, error } = await supabase
      .from('book_catalog')
      .select('item_id,title,author,category_name,description')
      .is('embedding', null)
      .not('title', 'is', null)
      .neq('title', '')
      .limit(3);
    if (error) return NextResponse.json({ ok: false, message: '카탈로그 테이블 오류' }, { status: 500 });

    if (rows.length === 0) break;

    const texts = rows.map((b) => `${b.title} ${b.author} ${b.category_name} ${(b.description ?? '').slice(0,150)}`);
    const { data: embeddings, error: embedError } = await supabase.functions.invoke('embed', {
      body: { texts },
    });

    if (embedError || !Array.isArray(embeddings) || embeddings.length !== rows.length) {
      console.error(`${loop}바퀴 embed 실패, 재시도`, embedError?.message);
      failCount++;
      if (failCount > 20) return NextResponse.json({ ok: false, message: '연속 실패 과다' }, { status: 500 });
      await sleep(2000);
      loop--;
      continue;
    }

    failCount = 0;

    console.log('행 수:', rows.length, '벡터 수:', embeddings.length, '첫 벡터 길이:', embeddings[0]?.length);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const vector = embeddings[i];
      await supabase
        .from('book_catalog')
        .update({ embedding: JSON.stringify(vector) })
        .eq('item_id', row.item_id);
    }
    console.log(`${loop}바퀴 | 이번 ${rows.length}개`);
  }

  return NextResponse.json({ ok: true, message: 'embedding 완료' }, { status: 200 });
};
