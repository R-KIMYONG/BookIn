import Link from 'next/link';
import SignupForm from './_components/SignupForm';
import { toSafeRedirect } from '@/shared/domain/auth/redirect';

const SignupPage = async ({ searchParams }: { searchParams: Promise<{ error?: string; redirectTo?: string }> }) => {
  const redirectTo = toSafeRedirect((await searchParams).redirectTo);
  return (
    <div className="min-h-page bg-[#f6f5f7] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          <SignupForm redirectTo={redirectTo} />
        </div>
        <p className="mt-2 text-center text-xs text-gray-600">
          이미 계정이 있나요?{' '}
          <Link href="/login" className="font-semibold text-[#8f4646] hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
