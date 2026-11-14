import 'server-only';
import { unstable_cache } from 'next/cache';
import { ItemId } from '@/shared/domain/book/ids';
import { buildAnchorRail } from './buildAnchorRail';

// 공개 페이지(디테일·검색)용 "이 책과 비슷한 책"
// 누가 봐도 같은 결과라 책 번호별로 하루 캐시 → 첫 방문자만 계산(약 1초), 나머지는 바로
// 캐시되는 건 화면용 필드뿐(책소개 원문 없음, toRailBooks에서 제거) → YES24 약관의 "결과만 저장"과 같음
// 실패(YES24·Voyage 오류)는 throw → 캐시되지 않고 다음 방문 때 다시 시도
export const getCachedAnchorRail = unstable_cache(
  (anchorItemId: ItemId, limit: number) => buildAnchorRail({ anchorItemId, limit }),
  ['anchor-rail-v5'], // 계산 방식을 바꾸면 버전을 올려 옛 캐시(예: 고치기 전의 빈 결과)를 무시
  { revalidate: 60 * 60 * 24 }
);
