'use client';

import Button from '@/components/common/ui/Button';
import { useRouter } from 'next/navigation';

type SettingsErrorPageProps = {
  error: Error;
  reset: () => void;
};

const SettingsErrorPage = ({ error, reset }: SettingsErrorPageProps) => {
  const router = useRouter();
  console.error(error);

  return (
    <div className="mx-auto flex h-[calc(100vh-3rem)] w-full max-w-xl flex-col items-center justify-center px-4 py-10 text-center">
      <h2 className="text-lg font-bold text-gray-900">문제가 발생했습니다</h2>
      <p className="mt-2 text-sm text-gray-500">설정 정보를 불러오는 중 오류가 발생했습니다.</p>
      <p className="mt-1 text-xs text-gray-400">잠시 후 다시 시도하거나 마이페이지로 돌아가 주세요.</p>

      <div className="mt-6 flex justify-center gap-2">
        <Button label="다시 시도" variant="primary" size="sm" onClick={reset} />
        <Button label="마이페이지로" variant="secondary" size="sm" onClick={() => router.push('/mypage')} />
      </div>
    </div>
  );
};

export default SettingsErrorPage;
