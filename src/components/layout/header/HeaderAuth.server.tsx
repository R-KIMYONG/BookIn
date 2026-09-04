import Link from 'next/link';
import HeaderLogoutForm from './HeaderLogoutForm';
import TempSessionController from '../session/TempSessionController';
import { CircleUser } from 'lucide-react';
import LoginLink from './LoginLink';

const HeaderAuth = async ({
  isLoggedIn,
  tempSessionExpiresAt,
}: {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
}) => {
  if (!isLoggedIn) {
    return <LoginLink />;
  }
  return (
    <div className="flex items-center gap-2 text-white/90">
      <TempSessionController isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
      <Link href="/mypage" aria-label="마이페이지" title="마이페이지" className="hover:text-white">
        <CircleUser className="h-6 w-6" />
      </Link>
      <HeaderLogoutForm />
    </div>
  );
};

export default HeaderAuth;
