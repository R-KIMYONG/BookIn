import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import BooksGridContainer from './lists/BooksGridContainer';

const MyBooksSectionSkeleton = () => {
  return (
    <BooksGridContainer>
      {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => (
        <li key={i}>
          <div className="h-60 relative overflow-hidden rounded-md bg-gray-200 animate-pulse">
            {/* 이미지 영역 */}
            <div className="absolute inset-0 bg-gray-300" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-3 w-3/4 bg-gray-400 rounded" />
            <div className="h-3 w-1/2 bg-gray-400 rounded" />
          </div>
        </li>
      ))}
    </BooksGridContainer>
  );
};

export default MyBooksSectionSkeleton;
