import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const bookIds = searchParams.get('bookIds')?.split(',').filter(Boolean) ?? []; //각 isbn13값

  if (bookIds.length === 0) return NextResponse.json({ likedIds: [] });
  const { data: countData, error: countDataError } = await supabase
    .from('book_stats')
    .select('like_count,isbn13')
    .in('isbn13', bookIds);
  if (countDataError) return NextResponse.json({ error: '좋아요 집계 조회 실패' }, { status: 500 });
  const countDataMap = new Map(countData.map((item) => [item.isbn13, item.like_count]));
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
      liked_count: countDataMap.get(item) ?? 0,
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
  const { data: book, error: bookError } = await supabase
    .from('books')
    .upsert(
      {
        isbn13,
        title,
        thumbnail_url: cover,
        author,
      },
      {
        onConflict: 'isbn13',
      }
    )
    .select('id')
    .single();

  if (bookError) {
    console.error('bookError:', bookError);
    return NextResponse.json({ error: bookError.message }, { status: 500 });
  }

  const { error: likesError } = await supabase.from('likes').insert({
    user_id: user.id,
    book_id: book.id,
    isbn13: isbn13,
  });

  if (likesError && likesError.code !== '23505') {
    console.error(likesError);
    return NextResponse.json({ error: likesError.message }, { status: 500 });
  }
  return NextResponse.json({
    isbn13,
    liked: true,
  });
};

export const DELETE = async (request: NextRequest) => {
  const supabase = await createClient();

  const { isbn13 } = await request.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: book, error: bookError } = await supabase.from('books').select('id').eq('isbn13', isbn13).maybeSingle();

  if (bookError) {
    console.error(bookError);
    return NextResponse.json({ error: bookError.message }, { status: 500 });
  }

  if (!book) return NextResponse.json({ success: true });

  const { error } = await supabase.from('likes').delete().eq('user_id', user.id).eq('isbn13', isbn13);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
};
