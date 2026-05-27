import Button from '../common/ui/Button';
import { PencilLine } from 'lucide-react';

type BookmarkSavedToastProps = {
  onMemoClick: () => void;
};

const BookmarkSavedToast = ({ onMemoClick }: BookmarkSavedToastProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">북마크에 저장했어요</p>

        <p className="text-xs text-gray-500 truncate">메모를 남기면 나중에 찾기 쉬워요.</p>
      </div>

      <Button
        className="underline font-semibold !gap-1"
        variant="secondary"
        size="xs"
        leftIcon={<PencilLine className="h-3.5 w-3.5" />}
        label="메모"
        onClick={onMemoClick}
      />
    </div>
  );
};

export default BookmarkSavedToast;
