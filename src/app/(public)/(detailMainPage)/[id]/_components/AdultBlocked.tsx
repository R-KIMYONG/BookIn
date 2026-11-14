import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { ADULT_COVER } from '@/shared/domain/book/constants';

type AdultBlockedProps = {
  title: string;
  link: string; // YES24 상품 페이지 (YES24에서 자체 성인 인증 후 열람 가능)
};

// 청소년 이용불가 도서: 상세 내용·댓글·추천을 렌더링하지 않고 이 화면만 보여줌
const AdultBlocked = ({ title, link }: AdultBlockedProps) => {
  return (
    <section
      aria-labelledby="adult-blocked-title"
      className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-12 text-center sm:py-16"
    >
      <Image
        src={ADULT_COVER}
        alt="청소년 이용불가 도서"
        width={600}
        height={800}
        priority
        className="h-auto w-44 rounded-xl shadow-sm sm:w-52"
      />

      <p className="mt-6 line-clamp-2 text-sm text-gray-500">「{title}」</p>
      <h1 id="adult-blocked-title" className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl">
        청소년 이용불가 도서예요
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        BookIn에서는 아직 성인 도서를 열람할 수 없어요.
        <br />
        YES24에서 성인 인증 후 확인해 주세요.
      </p>

      <div className="mt-6 flex w-full gap-2 sm:w-auto">
        <Link
          href="/"
          className="flex-1 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-none"
        >
          홈으로
        </Link>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-main px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:flex-none"
        >
          YES24에서 보기
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">(새 창)</span>
        </a>
      </div>
    </section>
  );
};

export default AdultBlocked;
