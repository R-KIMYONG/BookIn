import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export const GET = async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json({ message: '인증 실패' }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await supabase
      .from('bookmark_tag_links')
      .select('bookmark_tags(id,name,slug,color),bookmarks!inner(user_id)')
      .eq('bookmarks.user_id', user.id);

    if (error) {
      return NextResponse.json({ message: '태그 조회 실패' }, { status: 500 });
    }

    const map = new Map();

    data?.forEach((row) => {
      const tag = Array.isArray(row.bookmark_tags) ? row.bookmark_tags[0] : row.bookmark_tags;

      if (!tag) return;

      map.set(tag.id, tag);
    });

    return NextResponse.json(Array.from(map.values()), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
};
