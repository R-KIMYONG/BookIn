import Link from 'next/link';
import GithubIcon from '../icons/sociaLoginIcon/GithubIcon';
import NotionIcon from '../icons/NotionIcon';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-5">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 text-xs text-gray-600">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl border bg-gray-50 p-2">
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32 16C35.1826 16 38.2348 17.2643 40.4853 19.5147C42.7357 21.7652 44 24.8174 44 28V42H36V28C36 26.9391 35.5786 25.9217 34.8284 25.1716C34.0783 24.4214 33.0609 24 32 24C30.9391 24 29.9217 24.4214 29.1716 25.1716C28.4214 25.9217 28 26.9391 28 28V42H20V28C20 24.8174 21.2643 21.7652 23.5147 19.5147C25.7652 17.2643 28.8174 16 32 16Z"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18H4V42H12V18Z"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight">BookIn</p>
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
