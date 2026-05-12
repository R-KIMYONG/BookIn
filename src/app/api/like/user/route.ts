import { upsertBook } from '@/shared/lib/book/upsertBook';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const bookIds = searchParams.get('bookIds')?.split(',').filter(Boolean) ?? []; //각 isbn13값

  if (bookIds.length === 0) return NextResponse.json({ likedIds: [] });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let likedSet = new Set<string>();
  if (user) {
    const { data: likedData } = await supabase
      .from('likes')
      .select('isbn13')
      .eq('user_id', user.id)
      .in('isbn13', bookIds);

    likedSet = new Set(likedData?.map((item) => item.isbn13));
  }

  const result = bookIds.map((item) => {
    const dataJoin = {
      isbn13: item,
      liked: likedSet.has(item),
    };

    return dataJoin;
  });
  return NextResponse.json(result);
};

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();

  const { isbn13, title, cover, author } = await request.json();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bookId = await upsertBook({ supabase, bookInfo: { isbn13, title, cover, author } });

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('isbn13', isbn13)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('likes').delete().eq('user_id', user.id).eq('isbn13', isbn13);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      isbn13,
      liked: false,
    });
  }

  const { error } = await supabase.from('likes').insert({
    user_id: user.id,
    book_id: bookId,
    isbn13: isbn13,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    isbn13,
    liked: true,
  });
};
