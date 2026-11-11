-- 책 벡터와 가장 가까운 소분류(12자리) 찾기
-- YES24 상품의 goodsSortNm은 대부분 중분류까지만('국내도서-소설/시/희곡') 알려줌
-- → 그 중분류 아래 소분류 중 책소개 임베딩과 가장 가까운 것을 고름 ('싯다르타' → 세계각국소설)
-- p_query_embedding: 책 임베딩 (JS에서 JSON.stringify(vector)로 넘김)
-- p_parent_id: 이 분류로 시작하는 소분류만 (예: '001001046')
create or replace function public.match_leaf_category(
  p_query_embedding extensions.vector(1024),
  p_parent_id       text,
  p_match_count     integer default 1
)
returns table (category_id text, category_name text, full_path text, similarity double precision)
language sql
stable
as $$
  select c.category_id,
         c.category_name,
         c.full_path,
         (1 - (c.embedding <=> p_query_embedding))::float8 as similarity
  from public.book_category_catalog c
  where c.embedding is not null
    and c.category_id like p_parent_id || '%'
    and length(c.category_id) = 12
  order by c.embedding <=> p_query_embedding
  limit p_match_count
$$;
