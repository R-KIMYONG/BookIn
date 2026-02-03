'use client';

import useGenres from '@/hooks/useGenres';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import ButtonComponent from './ButtonComponent';
import { useEffect, useState } from 'react';
import { Genre } from '@/types/genre.type';

export default function Header() {
  const { koreanGenres, foreignGenres, ebookGenres } = useGenres();

  const supabase = createClient();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // 초기값을 null로 설정하여 로딩 상태를 구분

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(session !== null);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(session !== null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('로그아웃 되었습니다.');
    router.push('/');
  };

  const menus: { key: string; label: string; items?: Genre[] }[] = [
    { key: 'kr', label: '국내도서', items: koreanGenres },
    { key: 'fr', label: '외국도서', items: foreignGenres },
    { key: 'eb', label: 'eBook', items: ebookGenres },
  ];

  return (
    <header className="w-full">
      <Navbar className="w-full mx-auto bg-main px-10 h-12">
        <NavbarContent justify="start" className="font-bold justify-between">
          {menus.map(({ key, label, items }) => (
            <NavbarItem key={key}>
              <Dropdown>
                <DropdownTrigger>
                  <p className="text-white text-xs cursor-pointer">{label}</p>
                </DropdownTrigger>

                <DropdownMenu
                  aria-label={`${label} 메뉴`}
                  items={items ?? []}
                  className="max-h-[200px] overflow-y-auto w-[200px]"
                >
                  {(genre: Genre) => (
                    <DropdownItem key={genre.id} href={`/category/${genre.id}`} className="!text-[10px]">
                      {genre.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="center" className="hidden sm:flex">
          <NavbarBrand>
            <Link href="/">
              <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32 16C35.1826 16 38.2348 17.2643 40.4853 19.5147C42.7357 21.7652 44 24.8174 44 28V42H36V28C36 26.9391 35.5786 25.9217 34.8284 25.1716C34.0783 24.4214 33.0609 24 32 24C30.9391 24 29.9217 24.4214 29.1716 25.1716C28.4214 25.9217 28 26.9391 28 28V42H20V28C20 24.8174 21.2643 21.7652 23.5147 19.5147C25.7652 17.2643 28.8174 16 32 16Z"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18H4V42H12V18Z"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <>
            {isLoggedIn ? (
              <>
                <NavbarItem>
                  <ButtonComponent
                    style="bg-white text-black font-semibold text-[0.6rem] px-2 py-0.5 rounded-md hover:bg-gray-200 transition-colors"
                    label="마이페이지"
                    onClick={() => router.push('/mypage')}
                  />
                </NavbarItem>
                <NavbarItem>
                  <ButtonComponent
                    style="bg-black text-white font-semibold text-[0.6rem] px-2 py-0.5 rounded-md hover:bg-gray-800 transition-colors"
                    label="로그아웃"
                    onClick={handleLogout}
                  />
                </NavbarItem>
              </>
            ) : (
              <>
                <NavbarItem>
                  <ButtonComponent
                    style="bg-white text-black font-semibold text-[0.6rem] px-2 py-0.5 rounded-md hover:bg-gray-200 transition-colors"
                    label="로그인"
                    onClick={() => router.push('/login')}
                  />
                </NavbarItem>
                <NavbarItem>
                  <ButtonComponent
                    style="bg-black text-white font-semibold text-[0.6rem] px-2 py-0.5 rounded-md hover:bg-gray-800 transition-colors"
                    label="회원가입"
                    onClick={() => router.push('/terms')}
                  />
                </NavbarItem>
              </>
            )}
          </>
        </NavbarContent>
      </Navbar>
    </header>
  );
}
