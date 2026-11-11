-- =====================================================================
-- YES24 마이그레이션: 책 식별자를 isbn13 → YES24 itemId 로 전환
-- - users, keep_alive 를 제외한 책·활동 테이블을 전부 초기화하고 재생성
-- - 모든 테이블에 RLS 적용 (기존에는 9개 테이블이 RLS 꺼짐)
-- - 집계 트리거는 RLS 를 우회해야 하므로 SECURITY DEFINER
-- 적용 전: 함수·트리거·뷰·RLS·인덱스 덤프 CSV 백업 완료 (2026-10-29)
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. 기존 객체 제거
-- ---------------------------------------------------------------------
drop view if exists public.book_ranking;

drop table if exists
  public.bookmark_tag_links,
  public.bookmark_tags,
  public.bookmarks,
  public.likes,
  public.user_book_comments,
  public.comments,
  public.book_views,
  public.book_stats,
  public.ranking_snapshots,
  public.user_recommendations,
  public.user_recommendations_v2,
  public.book_catalog,
  public.books
cascade;

-- 반환 타입이 바뀌는 함수는 create or replace 가 안 되므로 먼저 삭제
drop function if exists public.create_book_stats();
drop function if exists public.increase_like_count();
drop function if exists public.decrease_like_count();
drop function if exists public.increase_comment_count();
drop function if exists public.decrease_comment_count();
drop function if exists public.increase_view_count();
drop function if exists public.increment_user_book_comment_count_on_insert();
drop function if exists public.decrement_user_book_comment_count_on_delete();
drop function if exists public.get_reacted_count(uuid);
drop function if exists public.get_taste_distribution(uuid);
drop function if exists public.get_top_anchor(uuid);
drop function if exists public.match_book(vector, integer, text[]);
drop function if exists public.match_book_for_user(uuid, text, integer);
drop function if exists public.match_book_similar(text, text, integer, text);
-- 유지: delete_user, handle_new_user, get_last_reacted_at, get_signal_mix (isbn13 미사용)

-- ---------------------------------------------------------------------
-- 2. 테이블
-- ---------------------------------------------------------------------

-- YES24 표시용 캐시 (사용자가 상호작용한 책만). 가격·책 소개는 저장하지 않음
create table public.books (
  id            uuid primary key default gen_random_uuid(),
  item_id       bigint not null unique,
  isbn13        text,
  title         text not null,
  author        text,
  publisher     text,
  thumbnail_url text,
  category_id   text,
  category_name text,
  pub_date      date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.book_stats (
  book_id       uuid primary key references public.books (id) on delete cascade,
  item_id       bigint not null unique,
  view_count    integer not null default 0,
  like_count    integer not null default 0,
  comment_count integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.book_views (
  id              uuid primary key default gen_random_uuid(),
  book_id         uuid not null references public.books (id) on delete cascade,
  item_id         bigint not null,
  user_id         uuid references public.users (id) on delete cascade,
  device_key      text not null,
  composite_hash  text,
  ip_hash         text,
  user_agent_hash text,
  hidden          boolean not null default false,
  view_date       date not null default (now() at time zone 'Asia/Seoul')::date,
  viewed_at       timestamptz not null default now()
);
create unique index book_views_device_uq on public.book_views (device_key, item_id, view_date);
create index book_views_composite_lookup_idx on public.book_views (composite_hash, item_id, view_date);
create index book_views_user_id_idx on public.book_views (user_id);

create table public.likes (
  id         uuid primary key default gen_random_uuid(),
  book_id    uuid not null references public.books (id) on delete cascade,
  item_id    bigint not null,
  user_id    uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, item_id)
);
create index idx_likes_book_id on public.likes (book_id);
create index idx_likes_item_id on public.likes (item_id);

create table public.bookmarks (
  id         uuid primary key default gen_random_uuid(),
  book_id    uuid not null references public.books (id) on delete cascade,
  item_id    bigint not null,
  user_id    uuid not null references public.users (id) on delete cascade,
  memo       text,
  created_at timestamptz not null default now(),
  unique (user_id, item_id)
);
create index idx_bookmarks_book_id on public.bookmarks (book_id);

create table public.bookmark_tags (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  name       text not null,
  slug       text not null,
  color      text,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table public.bookmark_tag_links (
  id          uuid primary key default gen_random_uuid(),
  bookmark_id uuid not null references public.bookmarks (id) on delete cascade,
  tag_id      uuid not null references public.bookmark_tags (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (bookmark_id, tag_id)
);
create index idx_bookmark_tag_links_tag_id on public.bookmark_tag_links (tag_id);

create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  book_id    uuid not null references public.books (id) on delete cascade,
  user_id    uuid not null references public.users (id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index idx_comments_book_id on public.comments (book_id);
create index idx_comments_user_created on public.comments (user_id, created_at desc);

create table public.user_book_comments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users (id) on delete cascade,
  book_id           uuid not null references public.books (id) on delete cascade,
  comment_count     integer not null default 0,
  last_commented_at timestamptz,
  created_at        timestamptz not null default now(),
  unique (user_id, book_id)
);

create table public.ranking_snapshots (
  snapshot_date date not null,
  item_id       bigint not null,
  book_id       uuid not null references public.books (id) on delete cascade,
  rank          integer not null,
  score         integer not null,
  created_at    timestamptz not null default now(),
  primary key (snapshot_date, item_id)
);

create table public.user_recommendations_v2 (
  user_id          uuid primary key references public.users (id) on delete cascade,
  anchor_cursor    integer not null default 0,
  label            text,
  rails_created_at timestamptz,
  reacted_count    integer not null default 0,
  recommendations  jsonb,
  taste_created_at timestamptz,
  taste_summary    jsonb
);

-- 임베딩 카탈로그. YES24 회신 전까지 비워둠
create table public.book_catalog (
  item_id       bigint primary key,
  isbn13        text,
  title         text not null,
  author        text,
  publisher     text,
  thumbnail_url text,
  category_id   text,          -- YES24 categoryId (3자리씩 계층: 001 → 001001046 → 001001046003). 매칭은 접두사로
  category_path text,          -- YES24 categoryFullPath (표시용. 중간 이름이 부모 categoryName 과 다를 수 있어 매칭에 쓰지 않음)
  description   text,
  embedding     vector(384),
  created_at    timestamptz not null default now()
);
create index book_catalog_embedding_idx on public.book_catalog using hnsw (embedding vector_cosine_ops);
create index book_catalog_category_id_idx on public.book_catalog (category_id text_pattern_ops);

-- ---------------------------------------------------------------------
-- 3. 뷰
-- ---------------------------------------------------------------------
create view public.book_ranking
with (security_invoker = true) as
select
  b.id as book_id,
  b.item_id,
  b.isbn13,
  b.title,
  b.author,
  b.thumbnail_url,
  s.view_count,
  s.like_count,
  s.comment_count,
  (s.view_count * 2 + s.like_count * 5 + s.comment_count * 15) as score,
  b.category_id,
  b.category_name
from public.book_stats s
join public.books b on b.id = s.book_id
order by score desc;

-- ---------------------------------------------------------------------
-- 4. 집계 트리거 (RLS 우회 위해 SECURITY DEFINER + search_path 고정)
-- ---------------------------------------------------------------------
create function public.create_book_stats()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.book_stats (book_id, item_id)
  values (new.id, new.item_id)
  on conflict (book_id) do nothing;
  return new;
end;
$$;

create function public.increase_like_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.book_stats
  set like_count = like_count + 1, updated_at = now()
  where book_id = new.book_id;
  return new;
end;
$$;

create function public.decrease_like_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.book_stats
  set like_count = greatest(like_count - 1, 0), updated_at = now()
  where book_id = old.book_id;
  return old;
end;
$$;

create function public.increase_comment_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.book_stats
  set comment_count = comment_count + 1, updated_at = now()
  where book_id = new.book_id;
  return new;
end;
$$;

create function public.decrease_comment_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.book_stats
  set comment_count = greatest(comment_count - 1, 0), updated_at = now()
  where book_id = old.book_id;
  return old;
end;
$$;

create function public.increase_view_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.book_stats
  set view_count = view_count + 1, updated_at = now()
  where book_id = new.book_id;
  return new;
end;
$$;

create function public.increment_user_book_comment_count_on_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.user_book_comments (book_id, user_id, comment_count, last_commented_at)
  values (new.book_id, new.user_id, 1, now())
  on conflict (user_id, book_id)
  do update set comment_count = public.user_book_comments.comment_count + 1,
                last_commented_at = now();
  return new;
end;
$$;

create function public.decrement_user_book_comment_count_on_delete()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.user_book_comments
  set comment_count = greatest(comment_count - 1, 0)
  where user_id = old.user_id and book_id = old.book_id;

  delete from public.user_book_comments
  where user_id = old.user_id and book_id = old.book_id and comment_count <= 0;
  return old;
end;
$$;

create trigger trigger_create_book_stats after insert on public.books
  for each row execute function public.create_book_stats();
create trigger trigger_increase_like after insert on public.likes
  for each row execute function public.increase_like_count();
create trigger trigger_decrease_like after delete on public.likes
  for each row execute function public.decrease_like_count();
create trigger trigger_increase_comment after insert on public.comments
  for each row execute function public.increase_comment_count();
create trigger trigger_decrease_comment after delete on public.comments
  for each row execute function public.decrease_comment_count();
create trigger trg_user_comment_insert after insert on public.comments
  for each row execute function public.increment_user_book_comment_count_on_insert();
create trigger trg_user_comment_delete after delete on public.comments
  for each row execute function public.decrement_user_book_comment_count_on_delete();
create trigger trigger_increase_view after insert on public.book_views
  for each row execute function public.increase_view_count();

-- ---------------------------------------------------------------------
-- 5. 사용자 집계·추천 RPC (item_id 기준)
-- ---------------------------------------------------------------------
create function public.get_reacted_count(p_user_id uuid)
returns integer language sql stable as $$
  select count(*)::int
  from (
    select item_id from public.likes where user_id = p_user_id
    union
    select item_id from public.bookmarks where user_id = p_user_id
    union
    select b.item_id from public.comments c join public.books b on b.id = c.book_id where c.user_id = p_user_id
  ) as reacted
$$;

-- 카탈로그 대신 books.category_name 기준 (카탈로그가 비어 있어도 동작)
create function public.get_taste_distribution(p_user_id uuid)
returns table (genre text, cnt bigint) language sql stable as $$
  with reacted as (
    select book_id from public.likes where user_id = p_user_id
    union
    select book_id from public.bookmarks where user_id = p_user_id
    union
    select book_id from public.comments where user_id = p_user_id
  )
  select b.category_name as genre, count(*) as cnt
  from reacted r
  join public.books b on b.id = r.book_id
  where b.category_name is not null
  group by b.category_name
  order by cnt desc
$$;

create function public.get_top_anchor(p_user_id uuid)
returns table (title text, item_id bigint, category_id text, category_name text)
language sql stable as $$
  select b.title, b.item_id, b.category_id, b.category_name
  from (
    select book_id, sum(score) as total
    from (
      select book_id, 3 as score from public.likes where user_id = p_user_id
      union all
      select book_id, 2 as score from public.bookmarks where user_id = p_user_id
      union all
      select distinct book_id, 1 as score from public.comments where user_id = p_user_id
    ) as scores
    group by book_id
    order by total desc
    limit 5
  ) as top
  join public.books b on b.id = top.book_id
  order by top.total desc
$$;

-- 디깅: 쿼리 임베딩 기반. category_prefixes = YES24 categoryId 접두사 목록 (예: {'001001046','001001047'})
create function public.match_book(query_embedding vector, match_count integer, category_prefixes text[] default null)
returns table (item_id bigint, isbn13 text, title text, author text, thumbnail_url text,
               category_id text, category_path text, similarity double precision)
language sql stable as $$
  with filtered as materialized (
    select bc.item_id, bc.isbn13, bc.title, bc.author, bc.thumbnail_url,
           bc.category_id, bc.category_path, bc.embedding
    from public.book_catalog bc
    where bc.embedding is not null
      and (category_prefixes is null
           or exists (select 1 from unnest(category_prefixes) p where bc.category_id like p || '%'))
  )
  select item_id, isbn13, title, author, thumbnail_url, category_id, category_path,
         1 - (embedding <=> query_embedding) as similarity
  from filtered
  order by embedding <=> query_embedding
  limit match_count
$$;

-- 마이페이지: 반응한 책 centroid 또는 anchor 기반
create function public.match_book_for_user(p_user_id uuid, p_anchor_item_id bigint default null, match_count integer default 20)
returns table (item_id bigint, isbn13 text, title text, author text, thumbnail_url text,
               category_id text, category_path text, similarity double precision)
language plpgsql stable as $$
#variable_conflict use_column
begin
  perform set_config('hnsw.ef_search', '200', true);
  return query
  with reacted as (
    select item_id from public.likes where user_id = p_user_id
    union
    select item_id from public.bookmarks where user_id = p_user_id
    union
    select b.item_id from public.comments c join public.books b on b.id = c.book_id where c.user_id = p_user_id
  ),
  query_vec as (
    select case
      when p_anchor_item_id is not null
        then (select embedding from public.book_catalog where item_id = p_anchor_item_id)
      else (select avg(bc.embedding) from public.book_catalog bc
            where bc.item_id in (select item_id from reacted) and bc.embedding is not null)
    end as vec
  )
  select bc.item_id, bc.isbn13, bc.title, bc.author, bc.thumbnail_url, bc.category_id, bc.category_path,
         1 - (bc.embedding <=> (select vec from query_vec)) as similarity
  from public.book_catalog bc
  where bc.embedding is not null
    and bc.item_id not in (select item_id from reacted)
    and (p_anchor_item_id is null or bc.item_id <> p_anchor_item_id)
  order by bc.embedding <=> (select vec from query_vec)
  limit match_count;
end
$$;

-- 디테일/검색/카테고리 레일: 책 또는 카테고리 기반
-- p_category_id: YES24 categoryId. 앞 3자리가 몰(001 국내도서 / 002 외국도서 / 017 eBook)이라
-- 같은 몰 제한과 하위 장르 포함/제외를 접두사 하나로 처리 (p_mall 불필요)
create function public.match_book_similar(p_item_id bigint default null, p_category_id text default null,
                                          match_count integer default 20)
returns table (item_id bigint, isbn13 text, title text, author text, thumbnail_url text,
               category_id text, category_path text, similarity double precision)
language sql stable as $$
  with seed as (
    select case
      when p_item_id is not null
        then (select embedding from public.book_catalog where item_id = p_item_id)
      when p_category_id is not null
        then (select avg(embedding) from public.book_catalog
              where embedding is not null and category_id like p_category_id || '%')
    end as vec
  )
  select bc.item_id, bc.isbn13, bc.title, bc.author, bc.thumbnail_url, bc.category_id, bc.category_path,
         (1 - (bc.embedding <=> (select vec from seed)))::float8 as similarity
  from public.book_catalog bc
  where bc.embedding is not null
    and (select vec from seed) is not null
    and (p_item_id is null or bc.item_id <> p_item_id)
    and (p_category_id is null
         or (bc.category_id not like p_category_id || '%'
             and left(bc.category_id, 3) = left(p_category_id, 3)))
  order by bc.embedding <=> (select vec from seed)
  limit match_count
$$;

-- hnsw.iterative_scan 은 vector 확장이 로드된 세션에서만 설정 가능
select '[1]'::vector;
alter function public.match_book_similar(bigint, text, integer)
  set hnsw.iterative_scan = strict_order;

-- ---------------------------------------------------------------------
-- 6. RLS
--   서버 클라이언트(anon 키 + 세션) 기준: 로그인=authenticated, 비로그인=anon
--   관리자 클라이언트(service role)는 RLS 우회
-- ---------------------------------------------------------------------
alter table public.books                   enable row level security;
alter table public.book_stats              enable row level security;
alter table public.book_views              enable row level security;
alter table public.likes                   enable row level security;
alter table public.bookmarks               enable row level security;
alter table public.bookmark_tags           enable row level security;
alter table public.bookmark_tag_links      enable row level security;
alter table public.comments                enable row level security;
alter table public.user_book_comments      enable row level security;
alter table public.ranking_snapshots       enable row level security;
alter table public.user_recommendations_v2 enable row level security;
alter table public.book_catalog            enable row level security;  -- 정책 없음 = 관리자 전용

-- 공개 읽기 (쓰기는 관리자 클라이언트 또는 트리거만)
create policy "public read" on public.books             for select to anon, authenticated using (true);
create policy "public read" on public.book_stats        for select to anon, authenticated using (true);
create policy "public read" on public.ranking_snapshots for select to anon, authenticated using (true);

-- 조회 기록: 본인 것만 읽기 (기록 insert/update 는 관리자 클라이언트)
create policy "own read" on public.book_views for select to authenticated using (user_id = auth.uid());

-- 좋아요
create policy "own read"   on public.likes for select to authenticated using (user_id = auth.uid());
create policy "own insert" on public.likes for insert to authenticated with check (user_id = auth.uid());
create policy "own delete" on public.likes for delete to authenticated using (user_id = auth.uid());

-- 북마크
create policy "own read"   on public.bookmarks for select to authenticated using (user_id = auth.uid());
create policy "own insert" on public.bookmarks for insert to authenticated with check (user_id = auth.uid());
create policy "own update" on public.bookmarks for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own delete" on public.bookmarks for delete to authenticated using (user_id = auth.uid());

-- 북마크 태그
create policy "own all" on public.bookmark_tags for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own all" on public.bookmark_tag_links for all to authenticated
  using (exists (select 1 from public.bookmarks bm where bm.id = bookmark_id and bm.user_id = auth.uid()))
  with check (exists (select 1 from public.bookmarks bm where bm.id = bookmark_id and bm.user_id = auth.uid()));

-- 댓글: 읽기 공개, 쓰기는 본인
create policy "public read" on public.comments for select to anon, authenticated using (true);
create policy "own insert"  on public.comments for insert to authenticated with check (user_id = auth.uid());
create policy "own update"  on public.comments for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own delete"  on public.comments for delete to authenticated using (user_id = auth.uid());

-- 내가 댓글 단 책 목록 (쓰기는 트리거)
create policy "own read" on public.user_book_comments for select to authenticated using (user_id = auth.uid());

-- 추천 결과 (쓰기는 관리자 클라이언트)
create policy "own read" on public.user_recommendations_v2 for select to authenticated using (user_id = auth.uid());

commit;

-- =====================================================================
-- 별도 작업 (이 파일에 포함하지 않음)
-- users 테이블 RLS: 댓글의 users(nickname, avatar) 조인과 비밀번호 재설정(비로그인)
-- 경로가 users 를 읽고 있어서, 정책 + 컬럼 권한 + 코드 수정을 함께 해야 함
-- =====================================================================
