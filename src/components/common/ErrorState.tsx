import Link from 'next/link';

type ErrorStateProps = {
  message?: string;
};

const ErrorState = ({ message = '데이터를 불러오는 중 오류가 발생했습니다.' }: ErrorStateProps) => {
  return (
    <div className="flex justify-center items-center min-h-full">
      <div className="text-center">
        <p>{message}</p>

        <Link
          href="/"
          className="mt-4 inline-flex items-center justify-center bg-[#af5858] text-white w-[80px] h-[30px] rounded-full text-xs font-bold hover:bg-opacity-80 transition"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
