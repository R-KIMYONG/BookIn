'use client';
import Button from '@/components/common/ui/Button';
import { QUESTIONS_COUNT } from '@/shared/domain/digging/constants';
import { DiggingQuestion, QUESTION_BANK } from '@/shared/domain/digging/questionBank';
import { selectQuestions } from '@/shared/domain/digging/selectQuestions';
import { ChevronFirst, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import DiggingWrapper from './DiggingWrapper';
import DiggingResult from './DiggingResult';
import { getTodayKST } from '@/shared/domain/digging/dailyStore';

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

  const [loaded, setLoaded] = useState(false);

  const today = getTodayKST();

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

  if (!loaded) return null;
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
          <Button
            variant="secondary"
            onClick={() => {}}
            className="flex items-center gap-0.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors group"
            aria-label="랭킹 기준 안내"
            label="Digging"
            size="xs"
            rightIcon={<Info className="w-3 h-3 mt-1 transition-transform duration-300 group-hover:scale-110" />}
          />
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
