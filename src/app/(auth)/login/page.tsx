import Link from 'next/link';
import LoginForm from './_components/LoginForm';
import SocialLoginButtons from './_components/SocialLoginButtons';

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ redirectTo?: string }> }) => {
  const { redirectTo = '/' } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] overflow-hidden flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5 p-6 sm:p-7">
          <LoginForm redirectTo={redirectTo} />
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
        </div>
        {/* 하단 안내 */}
        <p className="mt-6 text-center text-[11px] text-gray-400">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
