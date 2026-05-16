'use client';

import { signup } from '@/app/actions/auth.actions';
import PasswordFields from '@/components/form/PasswordFields';
import { showToast } from '@/shared/lib/message/showToast';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '../../login/_components/FormSubmitButton';

const SignupForm = ({ redirectTo }: { redirectTo: string }) => {
  const router = useRouter();
  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData);

    showToast(result.code);

    if (result.data?.redirectTo) {
      router.replace(result.data.redirectTo);

      return;
    }

    if (result.ok) {
      router.replace(result.data.redirectTo);
    }
  };

  return (
    <form action={handleSignup} className="p-6 sm:p-7">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
        <p className="mt-1 text-xs text-gray-500">BookShare 계정을 생성해 주세요.</p>
      </div>
      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-700">
          <span className="ml-1 text-red-500">*</span>
          Email
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#af5858] focus:ring-4 focus:ring-[#af5858]/15"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <PasswordFields withConfirm passwordName="password" confirmName="confirmPassword" showHint />

      {/* Nickname */}
      <div className="mt-3 mb-6">
        <label htmlFor="nickname" className="mb-1.5 block text-xs font-semibold text-gray-700">
          <span className="ml-1 text-red-500">*</span>
          Nickname
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#af5858] focus:ring-4 focus:ring-[#af5858]/15"
          id="nickname"
          name="nickname"
          type="text"
          placeholder="닉네임 (최대 8자)"
          autoComplete="nickname"
          maxLength={8}
          required
        />
        <p className="mt-1 text-[11px] text-gray-400">최대 8자 / 한글·영문·숫자 가능</p>
      </div>

      <FormSubmitButton label="회원가입" loadingText="가입중..." fullWidth />
    </form>
  );
};

export default SignupForm;
