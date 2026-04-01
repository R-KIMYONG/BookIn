'use client';

import Link from 'next/link';
import ButtonComponent from '@/components/common/ui/ButtonComponent';
import useCurrentUrl from '@/hooks/useCurrentUrl';
import { ButtonVariant } from '@/types/button.type';

type LoginLinkProps = {
  btnVariant?: ButtonVariant;
};

const LoginLink = ({ btnVariant }: LoginLinkProps) => {
  const currentUrl = useCurrentUrl();
  return (
    <Link href={`/login?redirectTo=${encodeURIComponent(currentUrl)}`}>
      <ButtonComponent variant={btnVariant ?? 'navbarLight'} label="로그인" size="xs" className="w-full" />
    </Link>
  );
};

export default LoginLink;
