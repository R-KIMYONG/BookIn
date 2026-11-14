-- match_category: 몰을 지정하면 eBook(017) 분류도 결과에 포함
-- 이유: eBook 제외 조건이 항상 적용돼 eBook 카테고리 페이지(p_mall = '017')의 "새로운 발견" 레일이 늘 비었음
--       → 제외는 몰을 지정하지 않을 때(마이페이지·디깅 추천)만 필요. 몰을 지정하면 like p_mall || '%'가 이미 다른 몰을 거름
-- 기록용: 원격 DB에는 SQL 에디터로 이미 적용됨 (2026-11-13)

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
    and (p_mall is not null or c.category_id not like '017%')   -- 몰 지정 없을 때만 eBook 제외 (종이책 취향에 같은 내용의 eBook 분류가 섞이지 않게)
  order by c.embedding <=> (select vec from seed)
  limit p_match_count
$function$;
