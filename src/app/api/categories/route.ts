import { Yes24Error } from '@/shared/lib/yes24/client';
import { getYes24CategoryTree } from '@/shared/lib/yes24/getYes24CategoryTree';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    return NextResponse.json(await getYes24CategoryTree(), { status: 200 });
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    const status = error instanceof Yes24Error ? error.status : 500;
    return NextResponse.json({ message: '카테고리를 불러오지 못했어요.' }, { status });
  }
};
