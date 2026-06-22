import 'server-only';
import { getAladinItemList } from '../aladin/getAladinItemList';
import { AladinBookInfo } from '@/shared/types/api';
import { POOL_QUERIES } from '@/shared/domain/recommend/constants';
import { DEFAULT_TARGET } from '@/shared/constants/category';

export const getCandidatePool = async ({ excludeIsbns }: { excludeIsbns: Set<string> }) => {
  //후보 리스트
  const lists = await Promise.all(
    POOL_QUERIES.flatMap((q, index) =>
      index === 0
        ? [1, 2].map((page) => getAladinItemList({ target: DEFAULT_TARGET, queryType: q, page }))
        : getAladinItemList({ target: DEFAULT_TARGET, queryType: q, page: 1 })
    )
  );
  //후보 리스트를 합쳐
  const rawItems = lists.flatMap((list) => list.data.item ?? []);
  const map = new Map<
    string,
    Pick<AladinBookInfo, 'isbn13' | 'title' | 'author' | 'cover' | 'categoryId' | 'categoryName'>
  >();
  //합친 후보중에 중복있으면 제거
  for (const it of rawItems) {
    if (!it.isbn13) continue;
    if (!map.has(it.isbn13))
      map.set(it.isbn13, {
        isbn13: it.isbn13,
        title: it.title,
        author: it.author,
        cover: it.cover,
        categoryId: it.categoryId,
        categoryName: it.categoryName,
      });
  }

  //유저가 이미 좋아요,북마크,조회,댓글한 책 중복 제거
  const candidates = [...map.values()].filter((c) => !excludeIsbns.has(c.isbn13));
  return candidates;
};
