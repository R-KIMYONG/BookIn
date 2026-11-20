-- books.page_modified_at: 상세 페이지 내용(댓글)이 마지막으로 바뀐 시각 (sitemap lastmod용)
-- 이유: updated_at은 upsertBook이 볼 때마다 갱신하는 "행 저장(YES24 동기화) 시각"이라 lastmod로 쓰면
--       조회만 해도 바뀐 것처럼 보임 → 페이지 내용 변경 시각을 별도 칸으로 분리
-- 갱신: 댓글 API가 작성·수정·삭제 때 기록 (좋아요·조회는 제외, 삭제도 변경으로 봐서 과거로 돌아가지 않음)
-- 기록용: 원격 DB에는 SQL 에디터로 적용 (2026-11-20)

alter table public.books
  add column if not exists page_modified_at timestamptz not null default now();

comment on column public.books.updated_at is '행이 마지막으로 저장된 시각 (upsertBook이 YES24 정보로 다시 저장할 때마다 갱신)';
comment on column public.books.page_modified_at is '상세 페이지 내용(댓글)이 마지막으로 바뀐 시각. sitemap lastmod용. 댓글 API가 갱신';

-- 기존 행 채우기: 최신 댓글 시각, 없으면 처음 저장된 시각
update public.books b
set page_modified_at = coalesce(
  (select max(coalesce(c.updated_at, c.created_at)) from public.comments c where c.book_id = b.id),
  b.created_at
);