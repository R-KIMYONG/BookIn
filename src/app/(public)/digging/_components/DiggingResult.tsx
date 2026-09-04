'use client';
import { BookPlus, Info, Sparkles } from 'lucide-react';
import DiggingWrapper from './DiggingWrapper';
import Button from '@/components/common/ui/Button';
import { getDiggingResultBookList } from '@/shared/lib/digging/getDiggingResultBookList';
import { useEffect, useState } from 'react';
import { DiggingReader, MatchBookType } from '@/shared/domain/digging/types';
import DiggingBookCard from './DiggingBookCard';
import { useMutation } from '@tanstack/react-query';
import { loadTodayDigging, saveTodayDigging } from '@/shared/domain/digging/dailyStore';
import DiggingReaderReport from './DiggingReaderReport';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import DiggingAnalyzingLoader from './DiggingAnalyzingLoader';
import useCurrentUrl from '@/hooks/common/useCurrentUrl';

type DiggingResultProps = {
  answers: string[];
  handleRestart: () => void;
  handleEdit: () => void;
  isLoggedIn: boolean;
};

const DiggingResult = ({ answers, handleRestart, handleEdit, isLoggedIn }: DiggingResultProps) => {
  const [reader, setReader] = useState<DiggingReader | null>(null);
  const [books, setBooks] = useState<MatchBookType[]>([]);
  const [usedToday, setUsedToday] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<number>(3);
  const [openSignup, setOpenSignup] = useState<boolean>(false);

  const currentUrl = useCurrentUrl();

  useEffect(() => {
    const saved = loadTodayDigging();

    if (saved) {
      setReader(saved.reader);
      setBooks(saved.books);
      if (!isLoggedIn) setUsedToday(true);
    }
  }, [isLoggedIn]);

  const { mutate: findBooks, isPending } = useMutation({
    mutationFn: () => getDiggingResultBookList(answers),
    onSuccess: (data) => {
      setReader(data.reader);
      setBooks(data.DiggingBookList);
      saveTodayDigging(data.reader, data.DiggingBookList);
      if (!isLoggedIn) setUsedToday(true);
      setViewCount(3)
    },
  });

  const onRestart = () => {
    if (!isLoggedIn && usedToday) {
      setOpenSignup(true);
      return;
    }
    handleRestart();
  };

  useEffect(() => {
    if (isPending) {
      document.getElementById('digging-loader')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isPending]);

  const blocked = !isLoggedIn && usedToday;

  const uniqueBooks = books.filter((b, i, arr) => arr.findIndex((x) => x.title === b.title) === i);
  const hasMore = viewCount < uniqueBooks.length;

  return (
    <div>
      <DiggingWrapper>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-main/10">
            <Sparkles className="h-6 w-6 text-main" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">취향, 다 파냈어요</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            당신이 고른 {answers.length}가지를 바탕으로
            <br />
            어울리는 책을 찾아볼게요
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {answers.map((a, i) => (
              <li
                key={i}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                {a.split(',')[0].trim()}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex w-full flex-col gap-2">
            <Button
              type="button"
              onClick={() => findBooks()}
              variant="primary"
              size="md"
              label="이 취향으로 책 찾기"
              disabled={blocked}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onRestart}
                variant="secondary"
                label="새로 디깅하기"
                size="md"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleEdit}
                variant="outline"
                label="답 수정하기"
                size="md"
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs mt-4">
            <Info size={15} />
            <p className="text-start">
              회원가입하면 무제한으로 디깅할 수 있어요 <br /> (비회원은 하루 한 번 책 찾기 가능)
            </p>
          </div>
        </div>
      </DiggingWrapper>

      {isPending && (
        <div id="digging-loader">
          <DiggingAnalyzingLoader />
        </div>
      )}

      {books.length > 0 && (
        <div
          id="digging-report"
          className="mx-auto mt-6 max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* 취향 판정 */}
          <DiggingReaderReport reader={reader} />

          {/* 책 가로 레일 */}
          <div className="overflow-x-auto">
            <div className="grid grid-flow-col grid-rows-3 gap-3">
              {uniqueBooks.slice(0, viewCount).map((book, i) => (
                <DiggingBookCard key={book.isbn13 ?? i} book={book} rank={i + 1} />
              ))}
            </div>
          </div>

          {/* 더보기 */}
          <div className="mt-5 flex justify-center">
            <Button
              label={hasMore ? '더보기' : '여기까지'}
              leftIcon={<BookPlus size={15} />}
              size="sm"
              variant="secondary"
              disabled={!hasMore}
              onClick={() => {
                if (!isLoggedIn && viewCount >= 3) {
                  setOpenSignup(true);
                  return;
                }
                setViewCount((prev) => prev + 3);
              }}
            />
          </div>
        </div>
      )}
      {blocked && (
        <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center">
          <p className="text-sm font-medium text-gray-700">오늘의 디깅은 여기까지 🌙</p>
          <p className="mt-1 text-xs text-gray-400">내일 또 오거나, 회원가입하면 무제한으로 즐겨요</p>
        </div>
      )}

      {openSignup &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpenSignup(false)} />
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-main/10">
                <Sparkles className="h-6 w-6 text-main" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">오늘의 디깅은 여기까지예요</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                회원가입하면 오늘도 무제한으로 디깅하고,
                <br />더 많은 책도 볼 수 있어요
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href={`/signup?redirectTo=${encodeURIComponent(currentUrl)}`}
                  className="rounded-xl bg-main py-3 text-sm font-medium text-white"
                >
                  회원가입
                </Link>
                <Button onClick={() => setOpenSignup(false)} variant="secondary" label="다음에" size="md" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DiggingResult;
