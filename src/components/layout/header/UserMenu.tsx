'use client';
import ButtonComponent from '@/components/common/ButtonComponent';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import HeaderLogoutForm from './HeaderLogoutForm';
import TempSessionController from './TempSessionController';
import LoginLink from './LoginLink';
import { useState } from 'react';

type UserMenuProps = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

const UserMenu = ({ isLoggedIn, tempSessionExpiresAt }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dropdown placement="bottom-end" offset={8} isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <ButtonComponent size="xs" variant="ghost" className="hover:bg-white/10" aria-label="사용자 메뉴 열기">
          <FaUserCircle size={24} className="text-white" />
        </ButtonComponent>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="사용자 메뉴"
        className="min-w-[180px] sm:min-w-[200px] p-0"
        onAction={() => setIsOpen(false)}
      >
        {isLoggedIn ? (
          <>
            {/* 세션 정보 */}
            <DropdownItem
              key="session"
              textValue="세션 정보"
              className="cursor-default p-3 border-b border-divider"
              isReadOnly
            >
              <TempSessionController isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
            </DropdownItem>

            {/* 마이페이지 */}
            <DropdownItem key="mypage" textValue="마이페이지" className="cursor-default" isReadOnly>
              <Link href="/mypage" className="w-full">
                <ButtonComponent label="마이페이지" variant="navbarDark" size="xs" className="w-full" />
              </Link>
            </DropdownItem>

            {/* 로그아웃 */}
            <DropdownItem key="logout" textValue="로그아웃" color="danger" className="text-danger">
              <HeaderLogoutForm />
            </DropdownItem>
          </>
        ) : (
          <>
            {/* 로그인 */}
            <DropdownItem key="login" textValue="로그인" isReadOnly>
              <LoginLink btnVariant="navbarDark" />
            </DropdownItem>

            {/* 회원가입 */}
            <DropdownItem key="signup" textValue="회원가입" isReadOnly>
              <Link href="/terms" className="w-full">
                <ButtonComponent variant="navbarDark" label="회원가입" size="xs" className="w-full" />
              </Link>
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserMenu;
