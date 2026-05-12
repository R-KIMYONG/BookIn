export const getDiscountRate = (base: number, target: number) => {
  if (!base || !target) return 0;
  return Math.round(((base - target) / base) * 100);
};
