import SkeletonGrid from '@/components/common/SkeletonGrid';
import React from 'react';

const SearchResultSkeleton = () => {
  return (
    <div className="px-1 sm:px-6 md:px-10 flex-1">
      <SkeletonGrid count={20} />
    </div>
  );
};

export default SearchResultSkeleton;
