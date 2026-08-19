import { formatGenre } from '../book/formatGenre';
import { parseGenreKeyword } from '../book/parseGenreKeyword';
import { ReportType } from './types';

type SignalType = {
  likes: number;
  bookmarks: number;
  comments: number;
  views: number;
};

type Anchor = { title: string; category_name: string | null };
export const buildBehavioralFingerprint = (signal: SignalType) => {
  const active = signal.likes + signal.bookmarks + signal.comments + 1;

  const viewsBase = signal.views + 1;

  const getRowPercentage = (n: number) => Number(((n / active) * 100).toFixed(2)); //비중

  return {
    // AI에게 오직 날것의 숫자적 균형 감각만 제공합니다.
    numerical_balance: {
      energy_distribution: {
        like_weight: getRowPercentage(signal.likes), // 하트로 표현하는 호감도 비중
        bookmark_weight: getRowPercentage(signal.bookmarks), // 북마크로 쌓는 소유욕 비중
        comment_weight: getRowPercentage(signal.comments), // 댓글로 쏟아내는 표현욕 비중
      },
      interaction_density_ratio: Number(((active / viewsBase) * 100).toFixed(2)), // 이 숫자가 0.01이냐, 54.32냐, 800.51이냐에 따라 유저의 끈덕짐이 결정됨
    },
  };
};

export const buildPersonaFingerprint = (genres: ReportType[], total: number) => {
  const top1 = genres[0] ?? { genre: '미분류', cnt: 0 };
  const top2 = genres[1] ?? { genre: '미분류', cnt: 0 };

  const getRowPercentage = (n: number) => (total > 0 ? Number(((n / total) * 100).toFixed(2)) : 0);

  const simpson = genres.reduce((acc, g) => {
    const p = total > 0 ? g.cnt / total : 0;
    return acc + p * p;
  }, 0);

  return {
    raw_top_genres: {
      first_place: formatGenre(top1.genre),
      second_place: formatGenre(top2.genre),
    },
    distribution_dna: {
      dominant_genre_density: `${getRowPercentage(top1.cnt)}%`, // 1등 장르 편중도
      top_two_clash_gap: `${getRowPercentage(top1.cnt - top2.cnt)}%`, // 1, 2등 세력 격차
      genre_diversity_density: `${Number(((1 - simpson) * 100).toFixed(2))}%`, // 장르가 섞여 있는 순수 분산 밀도
    },
  };
};

export const buildPhysicalEvidence = (anchors: Anchor[]) => ({
  top_3_genre_chemical_mix: anchors.slice(0, 3).map((a) => parseGenreKeyword(a.category_name)),
  top_books_preview: anchors.slice(0, 3).map((a) => a.title),
});
