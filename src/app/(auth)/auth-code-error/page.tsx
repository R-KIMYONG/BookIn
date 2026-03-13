import Link from 'next/link';

const AuthCodeErrorPage = ({ searchParams }: { searchParams: { reason?: string } }) => {
  const reason = searchParams.reason ?? 'error';

  const messages = {
    cancelled: {
      title: '이메일 변경이 취소되었습니다',
      desc: '사용자가 이메일 변경 요청을 취소했습니다.',
    },
    expired: {
      title: '인증 시간이 만료되었습니다',
      desc: '이메일 인증 링크의 유효 시간이 만료되었습니다. 다시 요청해주세요.',
    },
    invalid: {
      title: '유효하지 않은 인증 링크입니다',
      desc: '이미 사용되었거나 잘못된 인증 링크입니다.',
    },
    error: {
      title: '인증 처리 중 오류가 발생했습니다',
      desc: '잠시 후 다시 시도해주세요.',
    },
  };

  const { title, desc } = messages[reason as keyof typeof messages] ?? messages.error;

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-2xl font-bold text-red-500">{title}</h1>

      <p className="text-sm text-gray-600 max-w-md">{desc}</p>

      <div className="flex gap-4">
        <Link
          href={reason === 'error' ? `/login` : '/mypage'}
          className="px-4 py-2 bg-black text-white rounded-md text-sm"
        >
          {reason === 'error' ? '로그인 페이지로 이동' : '마이페이지로 이동'}
        </Link>

        <Link href="/" className="px-4 py-2 border rounded-md text-sm">
          홈으로 이동
        </Link>
      </div>
    </main>
  );
};

export default AuthCodeErrorPage;
