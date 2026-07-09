import { TARGET_LIST, TargetTypes } from '@/shared/constants/category';
import { QUERY_TYPE_LIST } from '@/shared/domain/aladin/constants';
import { sleep } from '@/shared/domain/catalog/sleep';

import { getGenres } from '@/shared/domain/category/getGenres';
import { getAladinItemList } from '@/shared/lib/aladin/getAladinItemList';
import { upsertBookCatalog } from '@/shared/lib/catalog/upsertBookCatalog';
import { AladinBookInfo } from '@/shared/types/api';
import { NextRequest, NextResponse } from 'next/server';

const ALADIN_MAX_RESULTS = 100;

export const POST = async (request: NextRequest) => {
  const headerToken = request.headers.get('x-admin-token');

  if (headerToken !== process.env.ADMIN_BUILD_TOKEN)
    return NextResponse.json({ error: '인증되지않는 시도입니다.' }, { status: 401 });

  const { koGenres, foGenres, ebGenres } = getGenres();

  //   QUERY_TYPE_LIST; //'Bestseller' | 'ItemNewAll' | 'ItemNewSpecial' | 'BlogBest' | 'ItemEditorChoice';
  //   TARGET_LIST; //'Book', 'Foreign', 'eBook'

  const map = new Map<
    string,
    Pick<
      AladinBookInfo,
      'isbn13' | 'itemId' | 'title' | 'author' | 'cover' | 'categoryId' | 'categoryName' | 'description'
    >
  >();
  const maxPage = Math.ceil(1000 / ALADIN_MAX_RESULTS);

  const taggedCategories: { id: number; target: TargetTypes }[] = [
    ...koGenres.map((catId) => {
      return { id: catId.id, target: 'Book' as const };
    }),

    ...foGenres.map((catId) => {
      return { id: catId.id, target: 'Foreign' as const };
    }),
    ...ebGenres.map((catId) => {
      return { id: catId.id, target: 'eBook' as const };
    }),
  ];
  const start = Date.now();
  let totalUpserted = 0;
  for (const queryType of QUERY_TYPE_LIST) {
    //홈리스트 반복
    for (const target of TARGET_LIST) {
      for (let page = 1; page <= maxPage; page++) {
        let homeList;
        try {
          homeList = await getAladinItemList({ queryType, target, page, maxResults: ALADIN_MAX_RESULTS });
          await sleep(200);
        } catch (error) {
          console.error(`실패 : ${queryType}/${target}/${page}`, error);
          continue;
        }
        if (homeList.itemsCount === 0) break;
        homeList.data.item.forEach((item: AladinBookInfo) =>
          map.set(String(item.itemId), {
            isbn13: item.isbn13,
            itemId: item.itemId,
            title: item.title,
            author: item.author,
            cover: item.cover,
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            description: item.description,
          })
        );
      }
      console.log(`[홈] ${queryType}/${target} 완료 | map ${map.size}`);
    }
    let catDone = 0;
    //카테고리 반복
    for (const cat of taggedCategories) {
      for (let page = 1; page <= maxPage; page++) {
        let categoryList;
        try {
          categoryList = await getAladinItemList({
            queryType,
            target: cat.target,
            categoryId: String(cat.id),
            page,
            maxResults: ALADIN_MAX_RESULTS,
          });

          await sleep(200);
        } catch (error) {
          console.error(`실패: ${queryType}/${cat.target}/${cat.id} p${page}`, error);
          continue;
        }
        if (categoryList.itemsCount === 0) break;
        categoryList.data.item.forEach((item: AladinBookInfo) =>
          map.set(String(item.itemId), {
            isbn13: item.isbn13,
            itemId: item.itemId,
            title: item.title,
            author: item.author,
            cover: item.cover,
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            description: item.description,
          })
        );
      }
      catDone++;
      console.log(`[${queryType}] 카테고리 ${catDone}/${taggedCategories.length} | map ${map.size}`);
    }
    console.log(queryType, 'flush size:', map.size);
    await upsertBookCatalog(map); // 쿼리타입변경하기전에 한번 저장하기
    totalUpserted += map.size;
    map.clear();
  }
  return NextResponse.json(
    { ok: true, message: '카탈로그 구축 완료', totalUpserted, elapsedMs: Date.now() - start },
    { status: 200 }
  );
};
