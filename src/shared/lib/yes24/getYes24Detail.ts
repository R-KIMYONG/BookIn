import 'server-only';
import { ItemId } from '@/shared/domain/book/ids';
import { Yes24Error, yes24Fetch } from './client';
import { Yes24ListData } from './types';
import { toBookDetail } from './normalize';
import { BookDetail } from '@/shared/domain/book/types';

export const getYes24Detail = async (itemId: ItemId): Promise<BookDetail | null> => {
  try {
    const data = await yes24Fetch<Yes24ListData>(
      '/goods/itemDetail',
      { searchType: 'ItemId', query: itemId, detail: 'Y' },
      { revalidate: 300 } // 가격을 보여주므로 짧게 (5분) -> yes24 약관준수!
    );

    const item = data.items[0];
    return item ? toBookDetail(item) : null;
  } catch (error) {
    if (error instanceof Yes24Error && error.code?.startsWith('GOODS_')) return null;
    throw error;
  }
};
