import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const bookIds = searchParams.get('bookIds')?.split(',').filter(Boolean) ?? []; //각 isbn13값

  const { data: countData, error: countDataError } = await supabase
    .from('book_stats')
    .select('like_count,isbn13')
    .in('isbn13', bookIds);

  if (countDataError) return NextResponse.json({ error: '좋아요 집계 조회 실패' }, { status: 500 });
  const countMap = new Map(countData?.map((item) => [item.isbn13, item.like_count]));
  const result = bookIds.map((isbn) => ({
    isbn13: isbn,
    liked_count: countMap.get(isbn) ?? 0,
  }));

  return NextResponse.json(result);
};
