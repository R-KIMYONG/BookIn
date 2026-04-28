import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);

  const isbn13 = (searchParams.get('isbn13') ?? '').trim();
  if (!isbn13) return NextResponse.json({ error: 'isbn13 값이 필요합니다.' }, { status: 400 });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ tags: [] }, { status: 200 });

  const { data: bookmarkData, error: bookmarkDataError } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('isbn13', isbn13)
    .maybeSingle();

  if (bookmarkDataError) return NextResponse.json({ error: '북마크 조회에 실패했습니다.' }, { status: 500 });

  if (!bookmarkData) return NextResponse.json({ tags: [] }, { status: 200 });

  const { data: links, error: linksError } = await supabase
    .from('bookmark_tag_links')
    .select('tag:bookmark_tags(id,name,slug,color)')
    .eq('bookmark_id', bookmarkData.id);

  if (linksError) return NextResponse.json({ error: '태그 조회에 실패했습니다.' }, { status: 500 });

  const tags = (links ?? []).map((x) => (Array.isArray(x.tag) ? x.tag[0] : x.tag)).filter(Boolean) ?? [];
  return NextResponse.json({ tags }, { status: 200 });
};
