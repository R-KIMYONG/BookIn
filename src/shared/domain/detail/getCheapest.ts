export const getCheapest = (items: { price: number; link: string }[]) => {
  if (items.length === 0) return null;
  return items.sort((a, b) => a.price - b.price)[0];
};
