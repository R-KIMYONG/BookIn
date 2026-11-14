-- books.adult: YES24 청소년 이용불가(adultYn = 'Y') 여부
-- 이유: DB에 이미 있는 책은 ensureBook이 YES24를 다시 부르지 않아 성인 여부를 알 수 없었음
--       → 좋아요·북마크 API의 403 판단, DB 기반 카드(랭킹·조회수·최근 본 책)의 잠금 표시에 사용
-- 기존 행은 false로 시작 → YES24로 한 번 확인해서 채워야 함 (성인 책은 표지도 19 이미지로 교체)
-- 기록용: 원격 DB에는 SQL 에디터로 이미 적용됨 (2026-11-13)

alter table public.books
  add column if not exists adult boolean not null default false;
