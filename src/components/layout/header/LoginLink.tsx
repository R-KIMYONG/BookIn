'use client';

import Link from 'next/link';
import Button from '@/components/common/ui/Button';
import { ButtonVariant } from '@/components/common/ui/Button/type';
import useCurrentUrl from '@/hooks/common/useCurrentUrl';

type LoginLinkProps = {
  btnVariant?: ButtonVariant;
};

const LoginLink = ({ btnVariant }: LoginLinkProps) => {
  const currentUrl = useCurrentUrl();
  return (
    <Link href={`/login?redirectTo=${encodeURIComponent(currentUrl)}`}>
      <Button variant={btnVariant ?? 'navbarLight'} label="로그인" size="xs" className="w-full" />
    </Link>
  );
};

export default LoginLink;
