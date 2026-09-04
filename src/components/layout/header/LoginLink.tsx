'use client';

import Link from 'next/link';
import useCurrentUrl from '@/hooks/common/useCurrentUrl';
import { CircleUser } from 'lucide-react';

const LoginLink = () => {
  const currentUrl = useCurrentUrl();
  return (
    <Link href={`/login?redirectTo=${encodeURIComponent(currentUrl)}`}>
      <CircleUser className="h-6 w-6 text-white" />
    </Link>
  );
};

export default LoginLink;
