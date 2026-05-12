'use client';

import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth.actions';
import Button from '@/components/common/ui/Button';

const HeaderLogoutForm = () => {
  const pathname = usePathname();

  return (
    <form action={logout}>
      <input type="hidden" name="next" value={pathname} />
      <Button type="submit" variant="navbarDark" label="로그아웃" size="xs" className="w-full" />
    </form>
  );
};

export default HeaderLogoutForm;
