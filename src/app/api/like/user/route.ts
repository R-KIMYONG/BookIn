import { parseItemId } from '@/shared/domain/book/ids';
import { LikeResponseUserType } from '@/shared/domain/like/types';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import { ensureBook } from '@/shared/lib/book/ensureBook';
import { scheduleRailsRebuild } from '@/shared/lib/recommend/scheduleRailsRebuild';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

// ?bookIds=1,2,3 → [{ itemId, liked }]
export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const itemIds = (searchParams.get('bookIds')?.split(',') ?? []).map(parseItemId).filter((id) => id !== null);

  if (itemIds.length === 0) return NextResponse.json([]);

  const user = await getCurrentUser();

  let likedSet = new Set<number>();
  if (user) {
    const { data: likedData } = await supabase
      .from('likes')
      .select('item_id')
      .eq('user_id', user.id)
      .in('item_id', itemIds);

    likedSet = new Set(likedData?.map((row) => row.item_id));
  }

  const result: LikeResponseUserType[] = itemIds.map((itemId) => ({ itemId, liked: likedSet.has(itemId) }));
  return NextResponse.json(result);
};

// body: { itemId } → 좋아요 토글. 책 정보는 클라이언트가 보내지 않고 서버가 YES24로 확인
export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const itemId = parseItemId(body?.itemId);
  if (!itemId) return NextResponse.json({ error: '올바른 itemId가 필요합니다.' }, { status: 400 });

  const book = await ensureBook(itemId);
  if (!book) return NextResponse.json({ error: '책 정보를 찾을 수 없습니다.' }, { status: 404 });

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('likes').delete().eq('user_id', user.id).eq('item_id', itemId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    scheduleRailsRebuild(user.id);
    return NextResponse.json({ itemId, liked: false } satisfies LikeResponseUserType);
  }
  if (book.adult) return NextResponse.json({ error: '청소년 이용불가 도서예요.' }, { status: 403 });
  const { error } = await supabase.from('likes').insert({ user_id: user.id, book_id: book.id, item_id: itemId });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  scheduleRailsRebuild(user.id);

  return NextResponse.json({ itemId, liked: true } satisfies LikeResponseUserType);
};
