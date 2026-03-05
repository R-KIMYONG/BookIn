'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ButtonComponent from '@/components/common/ButtonComponent';

const MypageError = ({ error, reset }: { error: Error; reset: () => void }) => {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<'retry' | 'home' | 'gotoLogin' | null>(null);

  useEffect(() => {
    console.error('🚨 Mypage Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] gap-6 bg-gray-50 text-center px-4">
      <div className="text-6xl">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800">마이페이지를 불러오지 못했어요.</h2>

      <p className="text-sm text-gray-500 max-w-md">
        세션이 만료되었거나 네트워크 문제로 계정 정보를 가져오지 못했습니다.
        <br />
        먼저 <span className="font-semibold">다시 시도</span>를 눌러보고, 계속되면{' '}
        <span className="font-semibold">다시 로그인</span>을 진행해주세요.
      </p>

      <p className="text-xs text-gray-400 max-w-md">
        문제가 반복되면 잠시 후 다시 시도하거나, 관리자에게 문의해주세요.
      </p>

      <div className="flex gap-3">
        <ButtonComponent
          variant="primary"
          size="sm"
          onClick={() => {
            if (loadingAction) return;
            setLoadingAction('retry');
            reset();
            setTimeout(() => setLoadingAction(null), 300);
          }}
          isLoading={loadingAction === 'retry'}
          label="다시 시도"
        />

        <ButtonComponent
          variant="outline"
          size="sm"
          onClick={() => {
            if (loadingAction) return;
            setLoadingAction('home');
            router.push('/');
          }}
          isLoading={loadingAction === 'home'}
          loadingText="이동중..."
          label="홈으로 이동"
        />
        <ButtonComponent
          variant="outline"
          size="sm"
          onClick={() => {
            if (loadingAction) return;
            setLoadingAction('gotoLogin');
            router.push('/login');
          }}
          label="다시 로그인"
          isLoading={loadingAction === 'gotoLogin'}
          loadingText="이동중..."
        />
      </div>
    </div>
  );
};

export default MypageError;
