declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B };

export type ItemId = Brand<number, 'ItemId'>;

const ITEM_ID_PATTERN = /^[1-9]\d*$/;

export const parseItemId = (raw: unknown): ItemId | null => {
  let n: number;

  if (typeof raw === 'number') {
    n = raw;
  } else if (typeof raw === 'string') {
    const s = raw.trim();
    if (!ITEM_ID_PATTERN.test(s)) return null;
    n = Number(s);
  } else {
    return null;
  }

  return Number.isSafeInteger(n) && n > 0 ? (n as ItemId) : null;
};

export type CategoryId = Brand<string, 'CategoryId'>;

const CATEGORY_ID_PATTERN = /^(\d{3})+$/;

export const parseCategoryId = (raw: unknown): CategoryId | null => {
  if (typeof raw !== 'string') return null;

  const s = raw.trim();
  return CATEGORY_ID_PATTERN.test(s) ? (s as CategoryId) : null;
};