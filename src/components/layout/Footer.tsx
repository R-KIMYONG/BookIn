import Link from 'next/link';
import GithubIcon from '../icons/sociaLoginIcon/GithubIcon';
import NotionIcon from '../icons/NotionIcon';
import { BookInLogo } from '../icons/BookInLogo';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-5">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 text-xs text-gray-600">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl border bg-main p-2">
              <span className="text-white">
                <BookInLogo size={20} />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:justify-self-end">
            <Link
              href="https://github.com/R-KIMYONG/BookIn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-white hover:bg-gray-50 transition"
              aria-label="GitHub"
              title="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </Link>

            <Link
              href="https://www.notion.so/teamsparta/A08-6d5377e0fbc943d9af66659c3c83fce5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-white hover:bg-gray-50 transition"
              aria-label="Notion"
              title="Notion"
            >
              <NotionIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="my-8 h-px w-full bg-gray-200" />

        <details className="group rounded-xl border bg-gray-50 px-4 py-3">
          <summary className="cursor-pointer list-none select-none flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-gray-900">프로젝트 정보</span>
            <span className="inline-flex items-center text-gray-500 transition group-open:rotate-180">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </summary>
          <div className="pt-3 space-y-2 leading-relaxed text-[11px]">
            <p>
              <span className="text-gray-500">제작자</span> 김용
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-500">Email</span> right4570@naver.com
            </p>

            <p>
              <span className="text-gray-500">GitHub</span>{' '}
              <Link href="https://github.com/R-KIMYONG" target="_blank" className="underline hover:text-black">
                github.com/R-KIMYONG
              </Link>
            </p>

            <p>
              <span className="text-gray-500">Credit</span> Team project → Fork → Refactor by 김용
            </p>

            <p>
              <span className="text-gray-500">Tech</span> Next.js · TypeScript · TanStack Query · TailwindCSS
            </p>
          </div>
        </details>

        <p className="pt-6 text-[11px] text-gray-400">© {year} BookIn. Built with Next.js</p>
      </div>
    </footer>
  );
};
export default Footer;
