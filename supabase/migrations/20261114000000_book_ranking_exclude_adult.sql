create or replace view public.book_ranking
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
where not b.adult
order by score desc;