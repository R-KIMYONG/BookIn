import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { SiKakaotalk } from 'react-icons/si';
import { SocialConfig } from '@/components/common/ui/Button/type';
import { signInWithOAuth } from '@/app/actions/auth.actions';
import FormSubmitButton from './FormSubmitButton';

const SocialLoginButtons = ({ redirectTo }: { redirectTo: string }) => {
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
        <form action={signInWithOAuth} key={provider.name}>
          <input type="hidden" name="next" value={redirectTo} />
          <input type="hidden" name="provider" value={provider.name} />
          <FormSubmitButton
            variant="ghost"
            size="md"
            ariaLabel={provider.label}
            className="!w-11 !h-11 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
            loadingText=""
          >
            {provider.icon}
          </FormSubmitButton>
        </form>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
