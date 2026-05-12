import Link from 'next/link';
import Button from '@/components/common/ui/Button';
import LoginLink from './LoginLink';
import HeaderLogoutForm from './HeaderLogoutForm';
import UserMenu from './UserMenu';
import TempSessionController from '../session/TempSessionController';


const HeaderAuth = async ({
  isLoggedIn,
  tempSessionExpiresAt,
}: {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
}) => {
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          {/* 데스크탑 */}
          <div className="md:flex hidden items-center gap-2">
            <TempSessionController isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
            <Link href="/mypage">
              <Button variant="navbarLight" label="마이페이지" size="xs" />
            </Link>

            <HeaderLogoutForm />
          </div>
          {/* 모바일 */}
          <div className="block md:hidden">
            <UserMenu isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
          </div>
        </>
      ) : (
        <>
          {/* 데스크탑 */}
          <div className="md:flex hidden items-center gap-2">
            <LoginLink />
            <Link href="/terms">
              <Button variant="navbarDark" label="회원가입" size="xs" />
            </Link>
          </div>
          {/* 모바일 */}
          <div className="block md:hidden">
            <UserMenu isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderAuth;
