import RecommendRails from './rail/RecommendRails';
import TasteReport from './taste/TasteReport';

const RecommendContainer = () => {
  return (
    <div className="w-full mx-auto py-8 flex flex-col gap-6">
      <TasteReport />
      <RecommendRails />
    </div>
  );
};

export default RecommendContainer;
