import Link from 'next/link';
import ButtonComponent from '@/components/common/ButtonComponent';
import LoginLink from './LoginLink';
import HeaderLogoutForm from './HeaderLogoutForm';

const HeaderAuth = async ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Link href="/mypage">
            <ButtonComponent variant="navbarLight" label="마이페이지" size="xs" />
          </Link>

          <HeaderLogoutForm />
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
