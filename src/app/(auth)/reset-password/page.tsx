import { Suspense } from 'react';
import ResetPasswordPage from './_components/ResetPasswordPage';
import Loading from '@/components/common/Loading';

const page = () => {
  return (
    <Suspense fallback={<Loading fullScreen text="링크 확인 중입니다..." />}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default page;
