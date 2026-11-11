import { parseItemId } from '@/shared/domain/book/ids';
import { getBookStatsByItemIds } from '@/shared/lib/server/entities/getBookStatsByItemIds';
import { NextRequest, NextResponse } from 'next/server';

// ?ids=1,2,3 → { [itemId]: { view_count, comment_count, like_count } }
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const itemIds = (searchParams.get('ids')?.split(',') ?? []).map(parseItemId).filter((id) => id !== null);

  const statsMap = await getBookStatsByItemIds(itemIds);

  return NextResponse.json(statsMap);
};
