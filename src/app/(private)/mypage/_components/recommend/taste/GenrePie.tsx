import { ReportType } from '@/shared/domain/taste/types';
import { Label, Legend, LegendPayload, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type GenrePieProps = {
  data: ReportType[];
  total: number;
};

const GenrePie = ({ data, total }: GenrePieProps) => {
  return (
    <ResponsiveContainer width="50%" height={280}>
      <PieChart>
        <Pie
          data={data}
          innerRadius="55%"
          outerRadius="70%"
          cornerRadius={6}
          paddingAngle={2}
          dataKey="cnt"
          nameKey="genre"
          isAnimationActive={true}
        >
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !('cx' in viewBox)) return null;
              const { cx, cy } = viewBox;
              return (
                <text textAnchor="middle" x={cx + 30}>
                  <tspan x={cx} y={cy - 10} fontSize="24" fontWeight="800" fill="#111827">
                    {total}
                  </tspan>
                  <tspan x={cx} y={cy + 11} fontSize="12" fill="#6b7280">
                    반응한 책
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
        <Legend
          position="bottom"
          iconType="circle"
          itemSorter={null}
          formatter={(value: string, entry: LegendPayload) => {
            const cnt = (entry?.payload as { cnt?: number } | undefined)?.cnt;
            return `${value} ${cnt}권`;
          }}
        />
        <Tooltip labelFormatter={(value) => `장르:${value}`} formatter={(value, name) => [`${value}권`, name]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GenrePie;
