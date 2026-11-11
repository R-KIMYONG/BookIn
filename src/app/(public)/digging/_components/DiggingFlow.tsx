'use client';
import Button from '@/components/common/ui/Button';
import { DIGGING_GUIDE, QUESTIONS_COUNT } from '@/shared/domain/digging/constants';
import { DiggingQuestion, QUESTION_BANK } from '@/shared/domain/digging/questionBank';
import { selectQuestions } from '@/shared/domain/digging/selectQuestions';
import { ChevronFirst, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DiggingWrapper from './DiggingWrapper';
import DiggingResult from './DiggingResult';
import { getTodayKST } from '@/shared/domain/digging/dailyStore';
import DiggingSkeleton from './DiggingSkeleton';

const DiggingFlow = ({
  initialQuestions,
  isLoggedIn,
}: {
  initialQuestions: DiggingQuestion[];
  isLoggedIn: boolean;
}) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [pick, setPick] = useState<number[]>([]);

  const [loaded, setLoaded] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const today = getTodayKST();

  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (!guideRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const savedQna = localStorage.getItem('digging');

    if (savedQna) {
      const p = JSON.parse(savedQna);
      if (p.date === today) {
        setQuestions(p.questions);
        setQuestionIndex(p.questionIndex);
        setPick(p.pick ?? []);
      } else {
        localStorage.removeItem('digging');
      }
    }
    setLoaded(true);
  }, [today]);
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('digging', JSON.stringify({ date: today, questions, pick, questionIndex }));
  }, [questions, questionIndex, pick, loaded, today]);

  const handleSelectAnswer = (optionIdx: number) => {
    setPick((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIdx;
      return next;
    });
    setTimeout(() => setQuestionIndex((prev) => prev + 1), 200);
  };

  const handleEdit = () => setQuestionIndex(QUESTIONS_COUNT - 1);

  const handlePrev = () => {
    if (questionIndex === 0) return;
    setQuestionIndex((prev) => prev - 1);
  };
  const handleRestart = () => {
    const fresh = selectQuestions({
      quesition: QUESTION_BANK,
      seed: Date.now(),
      options: { count: QUESTIONS_COUNT, dimension: ['mood', 'purpose'] },
    });
    setQuestions(fresh);

    setQuestionIndex(0);
    setPick([]);
    localStorage.removeItem('digging');
  };

  if (!loaded) return <DiggingSkeleton />;
  if (questionIndex >= QUESTIONS_COUNT) {
    const answers = pick.map((optIdx, i) => questions[i].options[optIdx].signal);
    return (
      <DiggingResult answers={answers} handleRestart={handleRestart} handleEdit={handleEdit} isLoggedIn={isLoggedIn} />
    );
  }

  const progressBar = Math.min(((questionIndex + 1) / QUESTIONS_COUNT) * 100, 100);
  return (
    <DiggingWrapper>
      <div className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center text-xs">
            <p>{questionIndex + 1}</p>
            <p>/</p>
            <p>{QUESTIONS_COUNT}</p>
          </div>
          <div ref={guideRef} className="relative">
            <Button
              variant="secondary"
              onClick={() => setOpen((prev) => !prev)}
              className="group flex items-center gap-0.5 text-[11px] text-gray-400 transition-colors hover:text-gray-600"
              aria-controls="digging-guide"
              aria-expanded={open}
              label="Digging"
              size="xs"
              rightIcon={<Info className="mt-1 h-3 w-3 transition-transform duration-300 group-hover:scale-110" />}
            />
            {open && (
              <div
                id="digging-guide"
                className="absolute right-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-main/15 bg-white px-4 py-3 text-xs leading-relaxed text-gray-600 shadow-lg"
              >
                <p className="font-semibold text-main">AI 디깅이란?</p>
                <p className="mt-1">레코드 가게에서 판을 뒤적이듯, 오늘의 기분으로 책을 파내는 AI 큐레이션이에요.</p>

                <dl className="mt-3 space-y-1.5">
                  {DIGGING_GUIDE.map(({ term, desc }) => (
                    <div key={term} className="flex gap-2">
                      <dt className="w-12 shrink-0 font-semibold text-gray-800">{term}</dt>
                      <dd>{desc}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-3 space-y-1 rounded-xl bg-main/5 px-3 py-2 text-[11px] text-gray-600">
                  <p>
                    <b className="text-main">비회원</b> 하루 1번 · 추천 3권 미리보기
                  </p>
                  <p>
                    <b className="text-main">회원</b> 무제한 · 추천 18권 전체
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="relative h-2">
          <div className={`bg-gray-300 rounded-full w-full h-full absolute left-0 top-0`} />
          <div className={`bg-main rounded-full h-full absolute left-0 top-0`} style={{ width: `${progressBar}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          type="button"
          aria-label="이전 질문"
          disabled={questionIndex === 0}
          label={questionIndex === 0 ? <ChevronFirst className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          onClick={handlePrev}
        />
        <div className="grid flex-1">
          {questions.map((q, i) => {
            const isCurrent = questionIndex === i;
            return (
              <div
                key={q.id}
                className={`col-start-1 row-start-1 transition-all ${
                  isCurrent
                    ? 'opacity-100 visible pointer-events-auto translate-y-0'
                    : 'opacity-0 invisible pointer-events-none translate-y-4'
                }`}
              >
                <h3 className="font-semibold">{q.prompt}</h3>
                <ol className="pl-1 flex flex-col gap-2 mt-4">
                  {q.options.map((o, optionIdx) => {
                    const alphabet = String.fromCharCode(65 + optionIdx);
                    const active = pick[i] === optionIdx;
                    return (
                      <li
                        key={o.id}
                        onClick={() => handleSelectAnswer(optionIdx)}
                        className={`w-full cursor-pointer py-4 border    ${
                          active
                            ? 'border-red-500 bg-main bg-opacity-80 text-white'
                            : 'border-gray-300 text-gray-500 hover:text-black hover:font-semibold hover:border-red-300 hover:bg-main hover:bg-opacity-80'
                        } rounded-2xl px-4  text-xs  transition-colors duration-300 ease-in-out group`}
                      >
                        <div className="flex items-center gap-2 justify-between">
                          <div
                            className={`border p-2 rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-300 ease-in-out ${active ? 'border-red-500 bg-main text-white ' : 'border-gray-300 group-hover:text-white group-hover:bg-main'}`}
                          >
                            <span className="font-bold text-center leading-none">{alphabet}</span>
                          </div>
                          <p className="flex-1">{o.label}</p>

                          {active && (
                            <div className="flex items-center gap-1">
                              <p>다음</p>
                              <ChevronRight size={15} />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </DiggingWrapper>
  );
};

export default DiggingFlow;
