import { DiggingQuestion } from './questionBank';

type SelectQuesitionsProps = {
  quesition: DiggingQuestion[];
  seed: number;
  options: {
    count: number;
    dimension: string[];
  };
};

//출처 참고 https://github.com/cprosche/mulberry32
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffle = <T>(arr: T[], rng: () => number): T[] => {
  const copyQuestionBank = [...arr];
  for (let i = copyQuestionBank.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copyQuestionBank[i], copyQuestionBank[j]] = [copyQuestionBank[j], copyQuestionBank[i]];
  }
  return copyQuestionBank;
};

export const selectQuestions = ({ quesition, seed, options: { count, dimension } }: SelectQuesitionsProps) => {
  const rng = mulberry32(seed);
  const shuffleQuestions = shuffle(quesition, rng);

  const moodQuesition = shuffleQuestions.find((q) => q.dimension === dimension[0]);
  const purposeQuesition = shuffleQuestions.find((q) => q.dimension === dimension[1]);

  const usedDimensions = new Set<string>([dimension[0], dimension[1]]);
  const result: DiggingQuestion[] = [];

  if (moodQuesition) result.push(moodQuesition);
  if (purposeQuesition) result.push(purposeQuesition);

  for (const q of shuffleQuestions) {
    if (result.length >= count) break;
    if (usedDimensions.has(q.dimension)) continue; // 이미 쓴 차원이면 건너뛰기
    usedDimensions.add(q.dimension);
    result.push(q);
  }
  return result;
};
