import { VK_COOKIE } from '@/shared/domain/detail/constants';
import { getRecentBooks } from '@/shared/lib/server/entities/getRecentBooks';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { createClient } from '@/shared/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
  const data = await getRecentBooks();

  return NextResponse.json(data);
};

export const DELETE = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const isbn13 = searchParams.get('isbn13');
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookiesStore = await cookies();
  const deviceKey = cookiesStore.get(VK_COOKIE)?.value;
  if (!user && !deviceKey) {
    return NextResponse.json({ error: 'no identity' }, { status: 401 });
  }

  const admin = createAdminClient();
  let query = admin.from('book_views').update({ hidden: true });

  if (user) query = query.eq('user_id', user.id);
  else query = query.eq('device_key', deviceKey);

  if (isbn13) query = query.eq('isbn13', isbn13);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
};
