import { ItemId } from './ids';

// 책 상세 경로. 식별자는 YES24 itemId 하나
export const makeHref = (itemId: ItemId): string => `/${itemId}`;
