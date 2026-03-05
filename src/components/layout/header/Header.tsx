import HeaderCategories from './HeaderCategories';
import HeaderLogo from './HeaderLogo';
import HeaderAuth from './HeaderAuth.server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import TempSessionController from './TempSessionController';

const Header = async () => {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tempExpiresAtStr = cookieStore.get('bookin_session_expires_at')?.value ?? null;
  const tempSessionExpiresAt = tempExpiresAtStr ? Number(tempExpiresAtStr) : null;

  const isLoggedIn = !!user;
  return (
    <header className="w-full bg-main">
      <nav className="relative max-w-7xl mx-auto h-12 px-10 flex items-center">
        <div className="flex items-center">
          <HeaderCategories />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <HeaderLogo className="hidden md:block" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TempSessionController isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
          <HeaderAuth isLoggedIn={isLoggedIn} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
