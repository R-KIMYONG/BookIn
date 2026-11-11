-- YES24 분류 임베딩 표 (추천 v3: 비슷한 분류 찾기·소분류 좁히기에 사용)
-- - 분류 이름·경로만 저장 (책 정보·책소개는 저장하지 않음 → YES24 약관의 "결과만 저장"과 같음)
-- - 채우기·갱신: api/admin/sync-categories(수동), api/cron/sync-categories(월 1회) → syncCategoryCatalog (바뀐 분류만 다시 임베딩)
-- - embedding: Voyage voyage-4-lite 1024차원
-- - 약 1,361행이라 벡터 인덱스 없이 순차 비교로 충분
-- 기록용: 원격 DB에는 SQL 에디터로 이미 적용됨 (2026-11-06)

create table public.book_category_catalog (
  category_id   text not null,                       -- YES24 categoryId (3자리씩 계층: 001 → 001001046 → 001001046003)
  category_name text not null,
  full_path     text not null,                       -- '국내도서>소설/시/희곡>한국소설' (임베딩 텍스트·제외 분야 판단에 사용)
  embedding     extensions.vector(1024),
  updated_at    timestamp with time zone not null default now(),
  constraint book_category_catalog_pkey primary key (category_id)
);

-- 서버(service_role)만 읽고 씀 → RLS 켜고 정책은 두지 않음 (anon·authenticated는 0행)
alter table public.book_category_catalog enable row level security;
