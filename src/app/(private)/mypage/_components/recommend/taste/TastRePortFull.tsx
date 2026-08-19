import { formatGenre } from '@/shared/domain/book/formatGenre';
import { CHART_COLORS, TOP_GENRES } from '@/shared/domain/taste/constants';
import { PERSONA_ICONS } from '@/shared/domain/taste/personaIcons';
import { PersonaType, ReportType } from '@/shared/domain/taste/types';
import { BookOpen, Layers, Sparkles, Sprout } from 'lucide-react';
import GenreRadar from './GenreRadar';
import GenrePie from './GenrePie';
type TastRePortFullProps = {
  genres: ReportType[];
  persona: PersonaType;
};
const TastRePortFull = ({ genres, persona }: TastRePortFullProps) => {
  const Icon = PERSONA_ICONS[persona.icon] ?? Sprout;
  const chartMode = genres.length >= 3 ? 'radar' : genres.length === 2 ? 'donut' : 'single';

  const radarChartData = genres.slice(0, TOP_GENRES).map((g) => {
    return {
      genre: formatGenre(g.genre),
      cnt: g.cnt,
    };
  });

  const pieChartData = genres.map((g, i) => {
    return {
      genre: formatGenre(g.genre),
      cnt: g.cnt,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    };
  });
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-inset ring-gray-200">
          <Icon className={`h-6 w-6 ${persona.color}`} />
        </span>
        <h3 className="text-xl font-extrabold">{persona.title}</h3>
      </div>
      <p className="mt-1 text-xs text-gray-500">반응한 책으로 분석한 당신의 독서 프로필</p>
      {chartMode === 'radar' ? (
        <GenreRadar data={radarChartData} />
      ) : chartMode === 'donut' ? (
        <GenrePie data={pieChartData} total={persona.total} />
      ) : (
        <div className="mt-4 flex h-[200px] flex-col items-center justify-center gap-1">
          <p className="text-3xl font-extrabold text-gray-900">{radarChartData[0].genre} 100%</p>
          <p className="text-sm text-gray-500">{persona.total}권 모두 한 장르 — 완벽한 몰입형이네요</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* 의외의 발견 — 포인트 컬러 */}
        {persona.surprise && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            의외의 발견
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold">{persona.surprise}</span>
          </span>
        )}

        {/* 장르 수 */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
          <Layers className="h-3.5 w-3.5" />
          장르 <span className="font-bold">{genres.length}개</span>
        </span>

        {/* 반응한 책 — 중립 톤 */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
          <BookOpen className="h-3.5 w-3.5" />
          반응한 책 <span className="font-bold text-gray-900">{persona.total}권</span>
        </span>
      </div>
    </div>
  );
};

export default TastRePortFull;
