-- 옛 v2 추천 정리: book_catalog(책소개·임베딩 저장)와 그 검색 함수 삭제
-- 이유: YES24 약관상 책소개·임베딩 저장 불가 → v3는 후보를 요청 시 받아 메모리에서만 비교하고 결과만 저장
-- 대체: book_category_catalog(분류 임베딩) + match_category / match_leaf_category
-- 기록용: 원격 DB에는 SQL 에디터로 이미 적용됨 (2026-11-11)

drop function if exists public.match_book(vector, integer, text[]);
drop function if exists public.match_book_for_user(uuid, bigint, integer);
drop function if exists public.match_book_similar(bigint, text, integer);
drop table if exists public.book_catalog;
