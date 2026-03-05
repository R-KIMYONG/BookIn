import 'server-only';
import { Book } from '@/types/book.type';

export async function getAladinDetail(isbn13: string): Promise<Book> {
  const key = process.env.ALADIN_TTB_KEY;
  if (!key) throw new Error('ALADIN_TTB_KEY is missing');

  const params = new URLSearchParams({
    ttbkey: key,
    itemIdType: 'ISBN',
    ItemId: isbn13,
    output: 'js',
    Cover: 'Big',
    Version: '20131101',
    OptResult: 'ebookList,usedList,reviewList',
  });

  const apiUrl = `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?${params.toString()}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error('Aladin API fetch failed');
  }

  return res.json();
}
