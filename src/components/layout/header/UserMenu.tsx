'use client';

import Dropdown, { DropdownItem } from '@/components/common/ui/Dropdown';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import HeaderLogoutForm from './HeaderLogoutForm';
import TempSessionController from './TempSessionController';

type UserMenuProps = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

const UserMenu = ({ isLoggedIn, tempSessionExpiresAt }: UserMenuProps) => {
  const router = useRouter();
  const items: DropdownItem<string>[] = isLoggedIn
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
      trigger={<FaUserCircle size={24} className="text-white" />}
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
