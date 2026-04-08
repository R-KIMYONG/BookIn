import { Suspense } from 'react';
import ForgotPasswordPage from './_components/ForgotPasswordPage';
import Loading from '@/components/common/Loading';

const page = () => {
  return (
    <Suspense fallback={<Loading fullScreen text="정보를 불러오는 중입니다..." />}>
      <ForgotPasswordPage />
    </Suspense>
  );
};

export default page;
