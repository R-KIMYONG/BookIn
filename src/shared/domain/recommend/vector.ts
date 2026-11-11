export const averageVector = (vectors: number[][]): number[] => {
  if (vectors.length === 0) return [];
  const answer: number[] = [];
  const vectorLength = vectors[0].length;
  const numVectors = vectors.length;

  for (let i = 0; i < vectorLength; i++) {
    let sum = 0;
    for (let j = 0; j < numVectors; j++) {
      sum += vectors[j][i];
    }
    const avg = sum / numVectors;
    answer.push(avg);
  }
  return answer;
};

export const cosineSimilarity = (vectorA: number[], vectorB: number[]): number => {
  // 3×4 + 4×3 = 24. 길이는 |a| = √(9+16) = 5, |b| = √(16+9) = 5. 24 / (5×5) = 0.96

  if (vectorA.length !== vectorB.length) {
    throw new Error(`벡터 차원이 다릅니다: ${vectorA.length} vs ${vectorB.length}`);
  }

  let dot = 0; // 내적: 같은 자리끼리 곱해서 더함
  let sumSquaresA = 0; // |a|² : a의 각 자리를 제곱해서 더함
  let sumSquaresB = 0; // |b|² : b의 각 자리를 제공해서 더함

  // 반복문 한 번으로 세 값을 함께 구함
  for (let i = 0; i < vectorA.length; i++) {
    dot += vectorA[i] * vectorB[i];
    sumSquaresA += vectorA[i] * vectorA[i];
    sumSquaresB += vectorB[i] * vectorB[i];
  }

  const lengthProduct = Math.sqrt(sumSquaresA) * Math.sqrt(sumSquaresB);

  // 둘 중 하나가 [0, 0, …]이면 방향이 없어서 0으로 나누게 됨 → NaN 대신 0
  if (lengthProduct === 0) return 0;

  return dot / lengthProduct;
};
