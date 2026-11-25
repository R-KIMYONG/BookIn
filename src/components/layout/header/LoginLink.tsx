'use client';

import Link from 'next/link';
import useCurrentUrl from '@/hooks/common/useCurrentUrl';
import { CircleUser } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isAuthPath, toSafeRedirect } from '@/shared/domain/auth/redirect';

const LoginLink = () => {
  const currentUrl = useCurrentUrl();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectTo = isAuthPath(pathname) ? toSafeRedirect(searchParams.get('redirectTo')) : currentUrl;
  return (
    <Link href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} aria-label='로그인'>
      <CircleUser className="h-6 w-6 text-white" />
    </Link>
  );
};

export default LoginLink;
