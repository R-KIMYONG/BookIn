import BookInfoSkeleton from './_components/BookInfo/BookInfoSkeleton';
import CommentSkeleton from './_components/Comment/CommentSkeleton';
import { RailsSkeleton } from '@/app/(private)/mypage/_components/recommend/rail/RailsSkeleton';

const Loading = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <BookInfoSkeleton />
      <div className="mt-8">
        <CommentSkeleton />
      </div>
      <RailsSkeleton col={1}/>
    </div>
  );
};

export default Loading;
