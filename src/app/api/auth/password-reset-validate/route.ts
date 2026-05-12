import { hashToken } from '@/shared/lib/crypto/hashToken';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  const token = request.nextUrl.searchParams.get('token');

  if (!token) return NextResponse.json({ valide: false }, { status: 400 });

  const tokenHash = hashToken(token);

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('password_reset_token_hash', tokenHash)
    .gt('password_reset_expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ valide: false }, { status: 500 });
  }

  return NextResponse.json({ valide: !!data });
};
