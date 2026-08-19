import { useTasteReport } from '@/hooks/taste/useTasteReport';
import RecommendRails from './rail/RecommendRails';
import TasteReport from './taste/TasteReport';
import { useRails } from '@/hooks/rails/useRails';
import EmptyState from '@/components/common/EmptyState';
import { WifiOff } from 'lucide-react';
import Button from '@/components/common/ui/Button';

const RecommendContainer = () => {
  const taste = useTasteReport();
  const rails = useRails();

  if (taste.isError && rails.isError) {
    <div className="py-20 text-center">
      <EmptyState
        icon={<WifiOff className="h-12 w-12 text-gray-400" strokeWidth={1.5} />}
        title="추천을 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
        showButton={false}
      />
      <Button
        label="다시 시도"
        className="mt-3"
        onClick={() => {
          taste.refetch();
          rails.refetch();
        }}
      />
    </div>;
  }
  return (
    <div className="w-full mx-auto py-8 flex flex-col gap-6">
      <TasteReport />
      <RecommendRails />
    </div>
  );
};

export default RecommendContainer;
