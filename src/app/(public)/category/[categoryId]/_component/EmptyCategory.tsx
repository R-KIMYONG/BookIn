import { FiInbox, FiHome, FiRefreshCw } from 'react-icons/fi';
import ButtonComponent from '@/components/common/ButtonComponent';

type EmptyCategoryProps = {
  title?: string;
  description?: string;
  onGoHome: () => void;
  onRetry?: () => void;
};

const EmptyCategory = ({
  title = '표시할 책이 없어요',
  description = '해당 분류에서 조건에 맞는 결과를 찾지 못했어요. 다른 분류나 탭을 선택해보세요.',
  onGoHome,
  onRetry,
}: EmptyCategoryProps) => {
  return (
    <div className="col-span-full">
      <div className="border border-gray-200 bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
          <FiInbox size={22} className="text-gray-500" />
        </div>

        <div>
          <p className="text-base font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {onRetry && (
            <ButtonComponent size="sm" variant="secondary" onClick={onRetry}>
              <span className="inline-flex items-center gap-1">
                <FiRefreshCw />
                다시 시도
              </span>
            </ButtonComponent>
          )}
          <ButtonComponent size="sm" variant="primary" onClick={onGoHome}>
            <span className="inline-flex items-center gap-1">
              <FiHome />
              홈으로
            </span>
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default EmptyCategory;
