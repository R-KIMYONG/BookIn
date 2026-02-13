import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  const supabase = createClient();

const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

const userId = user.id;

  // public.users 삭제
  const { error: publicError }=await supabase.from('users').delete().eq('id', userId);

    if (publicError) {
    return NextResponse.json({ error: publicError.message }, { status: 500 });
  }

  // auth.users 삭제 (admin API)
  const { error:rpcError } = await supabase.rpc('delete_user', { user_id:userId });

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}