import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';
import BooksGridContainer from './lists/BooksGridContainer';

const MyBooksSectionSkeleton = () => {
  return (
    <BooksGridContainer>
      {Array.from({ length: COMMENTS_PAGE_SIZE }).map((_, i) => (
        <li key={i}>
          <div className="h-40 relative overflow-hidden rounded-md bg-gray-200 animate-pulse">
            {/* 이미지 영역 */}
            <div className="absolute inset-0 bg-gray-300" />

            {/* 하단 텍스트 영역 */}
            <div className="absolute bottom-3 left-3 right-3 space-y-2">
              <div className="h-3 w-3/4 bg-gray-400 rounded" />
              <div className="h-3 w-1/2 bg-gray-400 rounded" />
            </div>
          </div>
        </li>
      ))}
    </BooksGridContainer>
  );
};

export default MyBooksSectionSkeleton;
