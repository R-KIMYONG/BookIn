import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const bookIds = searchParams.get('ids')?.split(',').filter(Boolean) ?? [];

  const statsMap = await getBookStatsByIsbn(bookIds);

  return NextResponse.json(statsMap);
};
