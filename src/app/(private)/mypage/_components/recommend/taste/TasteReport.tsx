import TastRePortFull from './TastRePortFull';
import { TASTE_UNLOCK } from '@/shared/domain/taste/constants';
import TasteReportLock from './TasteReportLock';
import AiTasteCard from './AiTasteCard';
import { useTasteReport } from '@/hooks/taste/useTasteReport';
import ErrorState from '@/components/common/ErrorState';
import { scrollToRails } from '@/shared/domain/taste/scrollToRails';
import { TasteReportSkeleton } from './TasteReportSkeleton';

const TasteReport = () => {
  const { data, isError, refetch } = useTasteReport();

  if (isError)
    return (
      <ErrorState
        title="취향 리포트를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
        action={{ label: '다시 시도', onClick: () => refetch() }}
      />
    );
  if (!data) return <TasteReportSkeleton />;

  if (data.persona.total < TASTE_UNLOCK)
    return <TasteReportLock total={data.persona.total} onExplore={() => scrollToRails('rails')} />;

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
