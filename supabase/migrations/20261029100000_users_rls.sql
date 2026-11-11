-- =====================================================================
-- users 테이블 RLS + 컬럼 권한
-- - 공개 컬럼(id, nickname, avatar)만 anon / authenticated 가 읽기 가능 (댓글 작성자 조인용)
-- - 본인 행의 nickname, avatar 만 수정 가능
-- - email, pending_email*, password_reset_*, email_change_token_hash, persona_* 등은
--   service_role(관리자 클라이언트)로만 접근
-- - insert 는 auth.users 트리거, delete 는 delete_user rpc 가 담당하므로 클라이언트 권한 없음
-- - id 는 .eq('id', ...) 필터로 update 할 때도 select 권한이 필요해서 공개 컬럼에 포함
-- =====================================================================
begin;

alter table public.users enable row level security;

-- 테이블 단위 기본 권한 회수 후 필요한 컬럼만 다시 부여
revoke all on public.users from anon, authenticated;

grant select (id, nickname, avatar) on public.users to anon, authenticated;
grant update (nickname, avatar) on public.users to authenticated;

create policy "public read" on public.users for select to anon, authenticated using (true);
create policy "own update" on public.users for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

commit;
