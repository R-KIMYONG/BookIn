const SLICE = 20;
export const sliceView = <T>(pool: T[], cursor: number): T[] => {
  if (!pool?.length) return [];
  const numSlices = Math.max(1, Math.ceil(pool.length / SLICE));//100개 나누기 20(상수)하면 몇번 새로추천받기를 할수있는지 나옴
  const i = cursor % numSlices; // 소진 시 순환
  let start = i * SLICE;
  if (start + SLICE > pool.length) start = Math.max(0, pool.length - SLICE); // 부분이면 뒤에서 20
  return pool.slice(start, start + SLICE);
};
