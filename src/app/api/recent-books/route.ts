import { parseItemId } from '@/shared/domain/book/ids';
import { VK_COOKIE } from '@/shared/domain/detail/constants';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import { getRecentBooks } from '@/shared/lib/server/entities/getRecentBooks';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
  const data = await getRecentBooks();

  return NextResponse.json(data);
};

export const DELETE = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const rawItemId = searchParams.get('itemId');
  const itemId = parseItemId(rawItemId);
  // 값이 있는데 잘못됐으면 전체 삭제로 넘어가지 않게 막음
  if (rawItemId !== null && !itemId) return NextResponse.json({ error: 'invalid itemId' }, { status: 400 });

  const user = await getCurrentUser();

  const cookiesStore = await cookies();
  const deviceKey = cookiesStore.get(VK_COOKIE)?.value;
  if (!user && !deviceKey) {
    return NextResponse.json({ error: 'no identity' }, { status: 401 });
  }

  const admin = createAdminClient();
  let query = admin.from('book_views').update({ hidden: true });

  if (user) query = query.eq('user_id', user.id);
  else if (deviceKey) query = query.eq('device_key', deviceKey);

  if (itemId) query = query.eq('item_id', itemId);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
};
