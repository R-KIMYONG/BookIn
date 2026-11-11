import { parseCategoryId } from '@/shared/domain/book/ids';
import { Yes24Error } from '@/shared/lib/yes24/client';
import { CATEGORY_LIST_SIZE, HOME_LIST_SIZE, HOME_SECTIONS } from '@/shared/lib/yes24/constants';
import { getYes24List } from '@/shared/lib/yes24/getYes24List';
import { toPage } from '@/shared/lib/yes24/searchParams';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PAGE_SIZES = [HOME_LIST_SIZE, CATEGORY_LIST_SIZE];

const badRequest = () => NextResponse.json({ message: '잘못된 목록 요청입니다.' }, { status: 400 });

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const categoryId = parseCategoryId(searchParams.get('categoryId'));
  if (!categoryId) return badRequest();

  const section = HOME_SECTIONS.find((s) => s.categoryId === categoryId.slice(0, 3));
  if (!section) return badRequest();

  const listType = section.tabs.find((tab) => tab === searchParams.get('listType'));
  if (!listType) return badRequest();

  const pageSize = ALLOWED_PAGE_SIZES.find((size) => size === Number(searchParams.get('pageSize')));
  if (!pageSize) return badRequest();

  const page = toPage(searchParams.get('page'));

  try {
    const result = await getYes24List({ listType, categoryId, page, pageSize });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`목록 조회 실패 (${categoryId} / ${listType} / ${page}p):`, error);
    const status = error instanceof Yes24Error ? error.status : 500;
    return NextResponse.json({ message: '목록을 불러오지 못했어요.' }, { status });
  }
};
