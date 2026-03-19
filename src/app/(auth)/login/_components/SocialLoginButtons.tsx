'use client';

import ButtonComponent from '@/components/common/ButtonComponent';
import { createClient } from '@/utils/supabase/client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { SiKakaotalk } from 'react-icons/si';
import { SocialConfig } from '@/types/button.type';

const SocialLoginButtons = ({ redirectTo }: { redirectTo: string }) => {
  const supabase = createClient();
  const signIn = async (provider: 'google' | 'github' | 'kakao') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // 로그인 성공 후 돌아올 곳 (원하는 라우팅 정책에 맞게)
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const socialProviders: SocialConfig[] = [
    {
      name: 'google',
      label: 'Google 로그인',
      icon: <FcGoogle size={22} />,
    },
    {
      name: 'github',
      label: 'GitHub 로그인',
      icon: <FaGithub size={20} />,
    },
    {
      name: 'kakao',
      label: 'Kakao 로그인',
      icon: <SiKakaotalk size={20} />,
    },
  ];

  return (
    <div className="flex justify-center gap-4 mt-2">
      {socialProviders.map((provider) => (
        <ButtonComponent
          key={provider.name}
          variant="ghost"
          size="md"
          onClick={() => signIn(provider.name)}
          className="!w-11 !h-11 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
          aria-label={provider.label}
        >
          {provider.icon}
        </ButtonComponent>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
