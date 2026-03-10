'use client';

import ButtonComponent from '@/components/common/ButtonComponent';

type InvalidCategoryProps = {
  onGoHome: () => void;
};

const InvalidCategory = ({ onGoHome }: InvalidCategoryProps) => {
  return (
    <section className="max-w-7xl m-auto mt-10 px-10">
      <div className="border rounded-xl p-6 text-center">
        <p className="text-lg font-semibold">존재하지 않는 카테고리입니다.</p>
        <p className="text-sm text-gray-500 mt-2">URL의 categoryId가 유효하지 않아요.</p>

        <div className="mt-4 flex justify-center gap-2">
          <ButtonComponent size="sm" variant="primary" label="홈으로" onClick={onGoHome} />
        </div>
      </div>
    </section>
  );
};

export default InvalidCategory;
