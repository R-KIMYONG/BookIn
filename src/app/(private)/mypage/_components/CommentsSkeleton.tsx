import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';

const CommentsSkeleton = () => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-h-[520px] p-4 box-border">
      {Array.from({ length: COMMENTS_PAGE_SIZE }).map((_, i) => (
        <li key={i}>
          <div className="w-full space-y-5 p-4 rounded-xl border animate-pulse">
            {/* 이미지 영역 */}
            <div className="h-24 rounded-lg bg-gray-200" />

            {/* 텍스트 영역 */}
            <div className="space-y-3">
              <div className="h-3 w-3/5 bg-gray-200 rounded" />
              <div className="h-3 w-4/5 bg-gray-200 rounded" />
              <div className="h-3 w-2/5 bg-gray-200 rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentsSkeleton;
