import React from 'react';
import { TasteReportSkeleton } from '../recommend/taste/TasteReportSkeleton';
import { RailsSkeleton } from '../recommend/rail/RailsSkeleton';

const RecommendSkeleton = () => {
  return (
    <div className="w-full mx-auto py-8 flex flex-col gap-6">
      <TasteReportSkeleton />
      <RailsSkeleton />
    </div>
  );
};

export default RecommendSkeleton;
