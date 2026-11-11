import 'server-only';
import { after } from 'next/server';
import { createAdminClient } from '../supabase/admin';
import { rebuildUserRails } from './rebuildUserRails';

const DEBOUNCE_MS = 4000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 반응(좋아요·북마크·댓글) 직후, 응답을 보낸 뒤 마이페이지 추천을 미리 계산
// 실패하거나 건너뛰어도 괜찮음 → 마이페이지 GET의 stale 검사가 진입 시 다시 계산 (정확성은 GET이 지킴)
export const scheduleRailsRebuild = (userId: string) => {
  const requestedAt = new Date().toISOString();

  after(async () => {
    try {
      const supabaseAdmin = createAdminClient();

      // 1. 표 남기기. 행이 없으면(추천 탭을 연 적 없음) 아무것도 안 바뀜 → 건너뜀
      const { data: marked } = await supabaseAdmin
        .from('user_recommendations_v2')
        .update({ rebuild_requested_at: requestedAt })
        .eq('user_id', userId)
        .select('user_id');
      if (!marked?.length) return;

      // 2. 잠깐 기다림 → 그 사이 반응이 더 오면 표가 덮어써짐
      await sleep(DEBOUNCE_MS);

      // 3. 내가 마지막 요청인지, 그새 마이페이지 진입(POST)으로 이미 새로 계산됐는지 확인
      const { data } = await supabaseAdmin
        .from('user_recommendations_v2')
        .select('rebuild_requested_at, rails_created_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (!data) return;
      const isLatest =
        data.rebuild_requested_at !== null &&
        new Date(data.rebuild_requested_at).getTime() === new Date(requestedAt).getTime();
      if (!isLatest) return; // 더 최근 반응이 있음 → 그쪽이 계산
      if (data.rails_created_at && new Date(data.rails_created_at) >= new Date(requestedAt)) return; // 이미 반영됨
      await rebuildUserRails(userId);
    } catch (error) {
      console.error('추천 미리 계산 실패:', error);
    }
  });
};
