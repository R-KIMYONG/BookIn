import 'server-only';
import { RailResult } from '@/shared/domain/rails/types';
import { getTopAnchors } from '../rails/getTopAnchors';
import { createAdminClient } from '../supabase/admin';
import { buildAnchorRail } from './buildAnchorRail';
import { buildSnipingRail } from './buildSnipingRail';
import { buildTrendingRail } from './buildTrendingRail';
import { getReactedItemIds } from './getReactedItemIds';

// 화면에는 레일당 20권씩 보여줌 (sliceView의 SLICE와 같음)
const RAIL_SIZE = 20;
// 취향 저격에 쓰는 좋아하는 책 수
const SNIPING_ANCHORS = 3;

// 유저의 마이페이지 추천 3레일을 새로 계산해서 저장
// - 마이페이지 POST(직접 진입)와 반응 직후 after()(미리 계산)가 같이 씀 → userId만 받음 (쿠키 X)
// - YES24·Voyage 실패는 throw → 저장하지 않음 (이전 추천을 빈 결과로 덮어쓰지 않게)
export const rebuildUserRails = async (userId: string): Promise<RailResult> => {
  // ○○ 분야에서 뜨는 책: 가장 좋아하는 책 분류의 베스트셀러 (기준 책이 없으면 국내도서 전체 베스트)
  // 취향 저격: 좋아하는 책 상위 3권의 평균(내 취향)과 가까운 책 (후보 = 책마다 비슷한 분류의 베스트셀러)
  // 『○○』을 좋아한다면: 가장 좋아하는 책과 비슷한 책 (후보 = 그 책과 비슷한 분류의 베스트셀러)
  // 세 레일 모두 반응한 책은 제외. 『○○』은 취향 저격과 겹친 책을 뺀 뒤 자르도록 넉넉히 받음
  const supabaseAdmin = createAdminClient();
  const startedAt = new Date().toISOString();
  const [anchors, reactedIds, { data: reactedCount }] = await Promise.all([
    getTopAnchors(userId),
    getReactedItemIds(userId),
    supabaseAdmin.rpc('get_reacted_count', { p_user_id: userId }),
  ]);

  const top = anchors[0];
  const snipingAnchorIds = anchors.length >= 2 ? anchors.slice(0, SNIPING_ANCHORS).map((a) => a.itemId) : [];

  const [trending, sniping, anchorRail] = await Promise.all([
    buildTrendingRail({ anchorItemId: top?.itemId, excludeIds: reactedIds, limit: RAIL_SIZE }),
    snipingAnchorIds.length > 0
      ? buildSnipingRail({ anchorItemIds: snipingAnchorIds, excludeIds: reactedIds, limit: RAIL_SIZE })
      : [],
    top ? buildAnchorRail({ anchorItemId: top.itemId, excludeIds: reactedIds, limit: RAIL_SIZE * 2 }) : null,
  ]);
  const snipingIds = new Set(sniping.map((book) => book.itemId));
  const result: RailResult = {
    trending,
    sniping,
    anchor: {
      title: anchorRail?.anchor.title ?? null,
      books: (anchorRail?.books ?? []).filter((book) => !snipingIds.has(book.itemId)).slice(0, RAIL_SIZE),
    },
  };

  const { error: upsertErr } = await supabaseAdmin.from('user_recommendations_v2').upsert(
    {
      user_id: userId,
      recommendations: result,
      anchor_cursor: 0,
      reacted_count: reactedCount ?? 0,
      rails_created_at: startedAt,
    },
    { onConflict: 'user_id' }
  );
  if (upsertErr) console.error('rails 저장 실패:', upsertErr);

  return result;
};
