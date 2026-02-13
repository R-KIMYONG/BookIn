import 'react-toastify/dist/ReactToastify.css';
import { login } from '../actions/auth.actions';
import Link from 'next/link';
import SubmitButton from './_components/SubmitButton';
import SocialLoginButtons from './_components/SocialLoginButtons';

export default function LoginPage({ searchParams }: { searchParams: { error?: string; redirectTo?: string } }) {
  const redirectTo = searchParams.redirectTo ?? '/';

  const errorMessage =
    searchParams.error === 'empty'
      ? '이메일과 비밀번호를 입력해주세요.'
      : searchParams.error === 'invalid'
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : null;

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] overflow-hidden flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* 카드 */}
        <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          <form action={login} className="p-6 sm:p-7">
            <input type="hidden" name="redirectTo" value={redirectTo} />

            {/* 에러 메세지 */}
            {errorMessage ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-700">
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

            {/* Password */}
            <div className="mb-2">
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Password
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#af5858] focus:ring-4 focus:ring-[#af5858]/15"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {/* 부가 링크 */}
            <div className="mb-5 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                로그인 상태 유지
              </label>

              {/* 추후 비번찾기 페이지 생기면 연결 */}
              <Link href="/reset-password" className="text-xs font-semibold text-[#af5858] hover:underline">
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* 로그인 버튼: useFormStatus로 로딩 처리 */}
            <SubmitButton label='로그인'/>

            {/* 구분선 */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[11px] font-semibold text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* 소셜 로그인 */}
            <SocialLoginButtons redirectTo={redirectTo} />

            {/* 회원가입 */}
            <p className="mt-6 text-center text-xs text-gray-600">
              아직 계정이 없나요?{' '}
              <Link href="/terms" className="font-semibold text-[#af5858] hover:underline">
                회원가입
              </Link>
            </p>
          </form>
        </div>

        {/* 하단 안내 */}
        <p className="mt-6 text-center text-[11px] text-gray-400">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
