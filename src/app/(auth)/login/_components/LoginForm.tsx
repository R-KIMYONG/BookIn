'use client';
import { login } from '@/app/actions/auth.actions';
import PasswordFields from '@/components/form/PasswordFields';
import Link from 'next/link';
import { showToast } from '@/shared/lib/message/showToast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { REMEMBER_EMAIL_KEY } from '@/shared/domain/auth/constants';
import { useAuth } from '@/shared/context/AuthContext';
import FormSubmitButton from './FormSubmitButton';

type LoginFromProps = {
  redirectTo: string;
};

const LoginForm = ({ redirectTo }: LoginFromProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const { setUser } = useAuth();

  const router = useRouter();
  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);

    const remember = formData.get('remember') === 'on';

    const email = String(formData.get('email') ?? '');

    if (remember) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    showToast(result.code);
    if (result.ok) {
      setUser(result.data.user);
      router.replace(result.data.redirectTo);
      return;
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY) ?? '';

    setEmail(savedEmail);

    setRemember(savedEmail.trim() !== '');
  }, []);

  return (
    <form action={handleLogin}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="mb-3">
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-700">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#af5858] focus:ring-4 focus:ring-[#af5858]/15"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <PasswordFields
        withConfirm={false}
        passwordLabel="Password"
        passwordName="password"
        showHint={false}
        passwordValue={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <div className="my-5 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-gray-300"
            checked={remember}
            onChange={(e) => {
              setRemember(e.target.checked);
            }}
          />
          로그인 상태 유지
        </label>

        {/* 추후 비번찾기 페이지 생기면 연결 */}
        <Link href="/forgot-password" className="text-xs font-semibold text-[#af5858] hover:underline">
          비밀번호를 잊으셨나요?
        </Link>
      </div>

      {/* 로그인 버튼: useFormStatus로 로딩 처리 */}
      <FormSubmitButton label="로그인" loadingText="로그인중..." fullWidth/>
    </form>
  );
};

export default LoginForm;
