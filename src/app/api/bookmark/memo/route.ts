import { parseItemId } from '@/shared/domain/book/ids';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const toSlug = (name: string) => name.trim().toLowerCase().replace(/\s+/g, '-');

// ?itemId=123 → { bookmarkId, itemId, memo, tags }
export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const itemId = parseItemId(searchParams.get('itemId'));

  if (!itemId) return NextResponse.json({ message: '올바른 itemId가 필요합니다.' }, { status: 400 });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id,memo,item_id,tags:bookmark_tag_links(tag:bookmark_tags(id,name,slug,color))')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .maybeSingle();

  if (error) {
    console.error('[bookmark/memo][GET] error:', error);
    return NextResponse.json({ message: '메모를 불러오지 못했습니다.' }, { status: 500 });
  }

  if (!data) return NextResponse.json({ message: '북마크가 존재하지 않습니다.' }, { status: 404 });

  const tags = (data.tags ?? []).map((link) => link?.tag).filter(Boolean);

  const result = {
    bookmarkId: data.id,
    itemId: data.item_id,
    memo: data.memo ?? null,
    tags,
  };

  return NextResponse.json(result, { status: 200 });
};

// body: { itemId, memo, tags }
export const PATCH = async (request: NextRequest) => {
  const supabase = await createClient();

  const body = await request.json();
  const itemId = parseItemId(body?.itemId);

  const memo = body?.memo === null ? null : String(body?.memo ?? '').trim();
  const tagsRaw: { name: string; slug: string; color: string | null }[] = Array.isArray(body.tags) ? body.tags : [];

  if (!itemId) return NextResponse.json({ error: '올바른 itemId가 필요합니다.' }, { status: 400 });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  const { data: memoUpdate, error: memoUpdateError } = await supabase
    .from('bookmarks')
    .update({ memo })
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .select('id,item_id,memo')
    .maybeSingle();
  if (memoUpdateError) {
    console.error('bookmark memo update error:', memoUpdateError);
    return NextResponse.json({ error: '메모 저장에 실패했습니다.' }, { status: 500 });
  }

  if (!memoUpdate) return NextResponse.json({ error: '북마크가 존재하지 않습니다.' }, { status: 404 });

  const bookmarkId = memoUpdate.id;

  const cleanTags = tagsRaw
    .map((t) => ({
      name: String(t?.name ?? '').trim(),
      slug: String(t?.slug ?? '').trim(),
      color: t?.color === null || typeof t?.color === 'string' ? t.color : null,
    }))
    .filter((t) => t.name.length > 0);

  const upsertRows = cleanTags.map((tag) => ({
    user_id: user.id,
    name: tag.name,
    slug: toSlug(tag.slug),
    color: tag.color,
  }));
  const { data: tagsData, error: tagsDataError } = await supabase
    .from('bookmark_tags')
    .upsert(upsertRows, { onConflict: 'user_id,slug' })
    .select('id,name,slug,color');

  if (tagsDataError) return NextResponse.json({ message: tagsDataError.message }, { status: 500 });

  const tagLinksId = tagsData.map((item) => item.id);

  const { error: delErr } = await supabase.from('bookmark_tag_links').delete().eq('bookmark_id', bookmarkId);

  if (delErr) return NextResponse.json({ error: '태그 연결 초기화 실패' }, { status: 500 });

  if (tagLinksId.length > 0) {
    const linkRows = tagLinksId.map((tagId) => {
      return {
        bookmark_id: bookmarkId,
        tag_id: tagId,
      };
    });

    const { error: linksError } = await supabase.from('bookmark_tag_links').insert(linkRows);
    if (linksError) return NextResponse.json({ error: '태그 연결 저장 실패' }, { status: 500 });
  }

  return NextResponse.json(
    {
      bookmarkId,
      itemId: memoUpdate.item_id,
      memo: memoUpdate.memo,
      tags: tagsData,
      message: '메모가 저장되었습니다.',
    },
    { status: 200 }
  );
};
