-- 반응 직후 추천 미리 계산(after)의 디바운스용: 마지막으로 계산을 요청한 시각
-- scheduleRailsRebuild가 반응마다 이 값을 덮어쓰고, 잠시 기다린 뒤 자기 요청 시각과 같을 때만 계산
-- → 연달아 반응해도 마지막 한 번만 계산 (좋아요 취소도 같은 방식으로 잡힘)
-- 기록용: 원격 DB에는 SQL 에디터로 이미 적용됨 (2026-11-11)

alter table public.user_recommendations_v2
  add column if not exists rebuild_requested_at timestamptz;
