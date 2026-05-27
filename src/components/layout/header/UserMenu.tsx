'use client';

import { useRouter } from 'next/navigation';
import HeaderLogoutForm from './HeaderLogoutForm';
import { DropdownItem } from '@/components/common/ui/Dropdown/types';
import Dropdown from '@/components/common/ui/Dropdown';
import TempSessionController from '../session/TempSessionController';
import { CircleUser } from 'lucide-react';

type UserMenuProps = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

type UserMenuAction = 'mypage' | 'login' | 'signup';

const UserMenu = ({ isLoggedIn, tempSessionExpiresAt }: UserMenuProps) => {
  const router = useRouter();
  const items: DropdownItem<UserMenuAction>[] = isLoggedIn
    ? [
        {
          type: 'custom',
          content: (
            <div className="flex justify-center">
              <TempSessionController isLoggedIn={isLoggedIn} tempSessionExpiresAt={tempSessionExpiresAt} />
            </div>
          ),
        },
        { type: 'action', label: '마이페이지', value: 'mypage', renderType: 'button' },
        {
          type: 'custom',
          content: <HeaderLogoutForm />,
        },
      ]
    : [
        { type: 'action', label: '로그인', value: 'login', renderType: 'button' },
        { type: 'action', label: '회원가입', value: 'signup', renderType: 'button' },
      ];
  return (
    <Dropdown
      trigger={<CircleUser className="h-6 w-6 text-white" />}
      items={items}
      align="right"
      onSelect={(value) => {
        switch (value) {
          case 'mypage':
            router.push('/mypage');
            break;
          case 'login':
            router.push('/login');
            break;
          case 'signup':
            router.push('/terms');
            break;
        }
      }}
    />
  );
};

export default UserMenu;
