import HeaderLogo from './HeaderLogo';
import HeaderAuth from './HeaderAuth.server';
import { cookies } from 'next/headers';
import { createClient } from '@/shared/lib/supabase/server';
import { SESSION_EXPIRES_AT } from '@/shared/domain/auth/constants';
import SearchBarContainer from './SearchBarContainer';
import CategoryDrawer from './CategoryDrawer';
import { HeaderTopBar } from './HeaderTopBar';
import HeaderDiggingMenu from './HeaderDiggingMenu';

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
    <HeaderTopBar>
      {/* 1단 */}
      <div className="flex h-12 items-center px-4 md:px-10">
        <HeaderLogo />
        <div className="ml-auto flex items-center gap-2 text-xs text-white/90">
          <HeaderAuth isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
        </div>
      </div>

      {/* 2단 */}
      <div className="flex h-12 items-center gap-3 border-t border-white/10 px-4 md:gap-6 md:px-10">
        <CategoryDrawer />

        <HeaderDiggingMenu />
        <div className="min-w-0 flex-1 sm:max-w-72">
          <SearchBarContainer />
        </div>
      </div>
    </HeaderTopBar>
  );
};

export default Header;
