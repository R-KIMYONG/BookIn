import TastRePortFull from './TastRePortFull';
import { TASTE_UNLOCK } from '@/shared/domain/taste/constants';
import TasteReportLock from './TasteReportLock';
import AiTasteCard from './AiTasteCard';
import { useTasteReport } from '@/hooks/taste/useTasteReport';
import ErrorState from '@/components/common/ErrorState';
import { scrollToRails } from '@/shared/domain/taste/scrollToRails';
import { TasteReportSkeleton } from './TasteReportSkeleton';
import { useReactedCount } from '@/hooks/taste/useReactedCount';

const TasteReport = () => {
  const { data: reactedCount } = useReactedCount();

  const unlocked = (reactedCount ?? 0) >= TASTE_UNLOCK;
  const { data, isError, refetch } = useTasteReport({ enabled: unlocked });

  if (reactedCount === undefined) return <TasteReportSkeleton />;

  if (!unlocked) return <TasteReportLock total={reactedCount} onExplore={() => scrollToRails('rails')} />;

  if (isError)
    return (
      <ErrorState
        title="취향 리포트를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
        action={{ label: '다시 시도', onClick: () => refetch() }}
      />
    );

  if (!data) return <TasteReportSkeleton />;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="lg:flex-1">
        <TastRePortFull genres={data.genres} persona={data.persona} />
      </div>
      <div className="lg:flex-1">
        <AiTasteCard persona={data.persona} />
      </div>
    </div>
  );
};

export default TasteReport;
