import { formatGenre } from '../book/formatGenre';
import personas from '@/data/personas.json';
export type GenreStat = { genre: string; cnt: number };

type PersonaRule = {
  id: string;
  icon: string;
  color: string;
  title: string;
  genre?: string;
  when: Record<string, number>;
};

type PersonaInput = {
  dominant: string;
  concentration: number;
  variety: number;
  total: number;
};

const matches = (rule: PersonaRule, stats: PersonaInput) => {
  if (rule.genre && rule.genre !== stats.dominant) return false; // 장르 조건
  return Object.entries(rule.when).every(([key, min]) => (stats[key as keyof PersonaInput] as number) >= min);
};

const fillTitle = (tpl: string, s: PersonaInput) => tpl.replace('{dominant}', s.dominant);


export const buildPersona = (genres: GenreStat[], total: number) => {
  const top = genres[0];

  const stats = {
    dominant: top ? formatGenre(top.genre) : '', //대표 장르 : 가장 많이 반응한 장르
    concentration: top && total > 0 ? top.cnt / total : 0, //대표 장르 비중 -> 1에가까우면 즉 100%이니까 한장르만 파는 유형
    variety: genres.length, //반응한 장르 종류 수 -> 해당값 클수록 잡식 유형
    total, //반응한 책 총 권수
  };
  const rules = personas as PersonaRule[];

  const rule = rules.find((r) => matches(r, stats)) ?? rules[rules.length - 1];

  return {
    id: rule.id,
    icon: rule.icon, // lucide 이름 (컴포넌트는 UI에서 매핑)
    color: rule.color, // tailwind 색 클래스
    title: fillTitle(rule.title, stats), // title에 {dominant}를 stats의 dominant으로 대체
    ...stats, // dominant / concentration / variety / total 값을 포함
    surprise: genres.length > 2 ? formatGenre(genres[genres.length - 1].genre) : null, //genre의 마지막 순번을 의외의 발견으로 놓기
  };
};
