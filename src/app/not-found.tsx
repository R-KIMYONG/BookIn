import Link from 'next/link';
import { BookOpen, Home, Search, Compass, Sparkles } from 'lucide-react';

const NotFound = () => {
  return (
    <main className="relative flex min-h-[calc(100vh-200px)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="nf-blob pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#af5858]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="nf-blob pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-amber-300/25 blur-3xl"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        aria-hidden
        className="nf-float-rot pointer-events-none absolute left-[12%] top-[18%] hidden text-[#af5858]/30 sm:block"
        style={{ ['--nf-rot' as string]: '-12deg' }}
      >
        <BookOpen className="h-14 w-14" />
      </div>
      <div
        aria-hidden
        className="nf-float-rot pointer-events-none absolute right-[14%] top-[26%] hidden text-amber-500/30 sm:block"
        style={{ ['--nf-rot' as string]: '14deg', animationDelay: '0.8s' }}
      >
        <Sparkles className="h-10 w-10" />
      </div>
      <div
        aria-hidden
        className="nf-float-rot pointer-events-none absolute bottom-[16%] left-[20%] hidden text-[#af5858]/25 md:block"
        style={{ ['--nf-rot' as string]: '8deg', animationDelay: '2s' }}
      >
        <Compass className="h-12 w-12" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="nf-float mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#af5858] to-[#d98a5b] shadow-[0_20px_50px_-15px_rgba(175,88,88,0.6)] ring-1 ring-white/30">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <h1 className="bg-gradient-to-b from-[#af5858] to-[#8a4040] bg-clip-text text-[6.5rem] font-black leading-none tracking-tighter text-transparent drop-shadow-sm sm:text-[9rem]">
          404
        </h1>

        <h2 className="mt-2 text-xl font-extrabold text-gray-900 sm:text-2xl">책장에서 길을 잃었어요</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
          찾으시는 페이지가 사라졌거나, 주소가 바뀌었어요.
          <br className="hidden sm:block" />
          대신 다른 좋은 책을 둘러보는 건 어때요?
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#af5858] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#af5858]/30 transition-all hover:-translate-y-0.5 hover:bg-[#9a4d4d] hover:shadow-xl"
          >
            <Home className="h-4 w-4" />
            홈으로 가기
          </Link>
          <Link
            href="/search"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-[#af5858]/40 hover:text-[#af5858] hover:shadow-md"
          >
            <Search className="h-4 w-4" />
            책 검색하기
          </Link>
        </div>
        <Link
          href="/?qt=Bestseller"
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-[#af5858]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          지금 인기 있는 책 보러가기
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
