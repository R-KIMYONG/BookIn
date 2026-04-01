import Link from 'next/link';
import SubmitButton from '../login/_components/SubmitButton';
import { signup } from '@/app/actions/auth.actions';
import PasswordFields from '@/components/form/PasswordFields';

const SignupPage = async ({ searchParams }: { searchParams: Promise<{ error?: string; redirectTo?: string }> }) => {
  const { redirectTo = '/' } = await searchParams;
  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-[460px]">
        <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          <form action={signup} className="p-6 sm:p-7">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="mb-6">
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

            <SubmitButton label="회원가입" />

            <p className="mt-6 text-center text-xs text-gray-600">
              이미 계정이 있나요?{' '}
              <Link href="/login" className="font-semibold text-[#af5858] hover:underline">
                로그인
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
