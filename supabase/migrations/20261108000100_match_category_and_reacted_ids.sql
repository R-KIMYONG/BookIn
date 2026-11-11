-- 추천 v3 함수 2개
-- 기록용: 원격 DB에는 SQL 에디터로 이미 적용됨 (2026-11-08, match_category의 p_mall은 이후 추가)

-- ---------------------------------------------------------------------
-- 1. match_category: 기준 분류(들)와 가까운 소분류
-- - 기준이 여러 개면 벡터 평균으로 비교
-- - p_mall: 주면 그 몰('001' 국내도서 등) 안에서만 (카테고리 레일 "새로운 발견"이 사용)
-- - 몰 단위처럼 너무 넓은 분류(12자리 미만)와 017(제외 몰)은 결과에서 뺌
-- ---------------------------------------------------------------------
create or replace function public.match_category(
  p_category_ids text[],
  p_match_count  integer,
  p_mall         text default null
)
returns table (category_id text, category_name text, full_path text, similarity double precision)
language sql
stable
as $function$
  with seed as (
    select avg(embedding) as vec
    from public.book_category_catalog
    where category_id = any(p_category_ids)
      and embedding is not null
  )
  select c.category_id,
         c.category_name,
         c.full_path,
         (1 - (c.embedding <=> (select vec from seed)))::float8 as similarity
  from public.book_category_catalog c
  where c.embedding is not null
    and (select vec from seed) is not null                      -- 기준 번호가 표에 없으면 결과 0개
    and (p_mall is null or c.category_id like p_mall || '%')    -- 몰을 지정했을 때만 거름
    and length(c.category_id) >= 12                              -- 몰 단위(001) 같은 너무 넓은 분류 제외
    and c.category_id not like '017%'
  order by c.embedding <=> (select vec from seed)
  limit p_match_count
$function$;

-- ---------------------------------------------------------------------
-- 2. get_reacted_item_ids: 유저가 반응한 책 번호 (좋아요·북마크·댓글)
-- - 추천에서 이미 반응한 책을 빼는 데 사용
-- - get_reacted_count와 같은 정의 (수 대신 목록)
-- ---------------------------------------------------------------------
create or replace function public.get_reacted_item_ids(p_user_id uuid)
returns setof bigint
language sql
stable
as $function$
  select item_id from public.likes where user_id = p_user_id
  union
  select item_id from public.bookmarks where user_id = p_user_id
  union
  select b.item_id from public.comments c join public.books b on b.id = c.book_id where c.user_id = p_user_id
$function$;

-- 두 함수 모두 호출자 권한(SECURITY INVOKER)으로 실행 → 테이블 RLS가 그대로 적용됨
-- (likes·bookmarks는 본인 것만, book_category_catalog는 service_role만 읽힘)
grant execute on function public.match_category(text[], integer, text) to anon, authenticated, service_role;
grant execute on function public.get_reacted_item_ids(uuid) to anon, authenticated, service_role;
