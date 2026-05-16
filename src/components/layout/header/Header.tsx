import HeaderLogo from './HeaderLogo';
import HeaderAuth from './HeaderAuth.server';
import { cookies } from 'next/headers';
import { createClient } from '@/shared/lib/supabase/server';
import HeaderCategoriesServer from './HeaderCategoriesSever';
import { SESSION_EXPIRES_AT } from '@/shared/domain/auth/constants';

const Header = async () => {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tempExpiresAtStr = cookieStore.get(SESSION_EXPIRES_AT)?.value ?? null;
  const tempSessionExpiresAt = tempExpiresAtStr ? Number(tempExpiresAtStr) : null;

  const isLoggedIn = !!user;
  return (
    <header className="w-full bg-main sticky top-0 z-50 backdrop-blur">
      {/* 데스크탑버전에서 보이는 버전 */}
      <div className="border-b border-white/10">
        <nav className="relative flex h-12 items-center px-4 md:px-10">
          <div className="hidden md:block">
            <HeaderCategoriesServer />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <HeaderLogo />
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-white/90">
            <HeaderAuth isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
          </div>
        </nav>
      </div>
      {/* 모바일에서 두줄케이스 */}
      <div className="block border-t border-white/10 px-4 py-4 md:hidden">
        <HeaderCategoriesServer />
      </div>
    </header>
  );
};

export default Header;
