'use client';
import Button from '@/components/common/ui/Button';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div className="px-1 py-16 text-center sm:px-6 md:px-10">
    <p className="text-lg font-semibold">검색 중 문제가 발생했어요</p>
    <p className="mt-2 text-sm text-gray-500">{error.message || '잠시 후 다시 시도해 주세요'}</p>
    <div className="mt-4 flex justify-center">
      <Button variant="primary" label="다시 시도" onClick={() => reset()} />
    </div>
  </div>
);
export default Error;
