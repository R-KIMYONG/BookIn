'use client';

import Link from 'next/link';
import ButtonComponent from '@/components/common/ButtonComponent';
import useCurrentUrl from '@/hooks/useCurrentUrl';

const LoginLink = () => {
  const currentUrl = useCurrentUrl();

  return (
    <Link href={`/login?redirectTo=${encodeURIComponent(currentUrl)}`}>
      <ButtonComponent variant="navbarLight" label="로그인" size="xs" />
    </Link>
  );
};

export default LoginLink;
