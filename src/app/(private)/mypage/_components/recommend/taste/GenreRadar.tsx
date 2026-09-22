import { ReportType } from '@/shared/domain/taste/types';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

const GenreRadar = ({ data }: { data: ReportType[] }) => {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="genre" tick={{ dx: 5, dy: -5, fontSize: 14 }} />
          <PolarRadiusAxis angle={30} tick={{ dx: 5, dy: -5, fill: '#666', fontSize: 12 }} />
          <Radar
            name="총"
            dataKey="cnt"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
            isAnimationActive={true}
            dot={true}
          />
          <Tooltip labelFormatter={(value) => `장르:${value}`} formatter={(value, name) => [`${value}권`, name]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenreRadar;
