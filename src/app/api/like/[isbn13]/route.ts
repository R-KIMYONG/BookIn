import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest, context: RouteContext<'/api/like/[isbn13]'>) => {
  const supabase = await createClient();
  const { isbn13 } = await context.params;

  const { data: countData, error: countDataError } = await supabase
    .from('book_stats')
    .select('like_count,isbn13')
    .eq('isbn13', isbn13)
    .maybeSingle();

  if (countDataError) return NextResponse.json({ error: '좋아요 집계 조회 실패' }, { status: 500 });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let liked = false;

  if (user) {
    const { data } = await supabase
      .from('likes')
      .select('isbn13')
      .eq('user_id', user.id)
      .eq('isbn13', isbn13)
      .maybeSingle();

    liked = !!data;
  }

  return NextResponse.json({
    isbn13,
    liked,
    liked_count: countData?.like_count ?? 0,
  });
};
