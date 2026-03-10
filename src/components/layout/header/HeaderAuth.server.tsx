import Link from 'next/link';
import { logout } from '@/app/actions/auth.actions';
import ButtonComponent from '@/components/common/ButtonComponent';
import LoginLink from './LoginLink';

const HeaderAuth = async ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Link href="/mypage">
            <ButtonComponent variant="navbarLight" label="마이페이지" size="xs" />
          </Link>

          <form action={logout}>
            <ButtonComponent type="submit" variant="navbarDark" label="로그아웃" size="xs" />
          </form>
        </>
      ) : (
        <>
          <LoginLink />
          <Link href="/terms">
            <ButtonComponent variant="navbarDark" label="회원가입" size="xs" />
          </Link>
        </>
      )}
    </div>
  );
};

export default HeaderAuth;
