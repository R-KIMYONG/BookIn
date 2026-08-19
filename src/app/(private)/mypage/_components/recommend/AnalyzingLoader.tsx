'use client';

import { Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AI_ANALYSIS_STEPS = [
  { until: 50, label: 'AI가 취향을 분석하고 있어요…' },
  { until: 85, label: 'AI가 취향에 맞는 책을 고르고 있어요…' },
  { until: 101, label: '추천을 마무리하고 있어요…' },
];

type AnalyzingLoaderProps = {
  isReady?: boolean;
  onComplete?: () => void;
};

const AnalyzingLoader = ({ isReady, onComplete }: AnalyzingLoaderProps) => {
  const [progress, setProgress] = useState<number>(5);
  const completedRef = useRef(false);
  const R = 52; //원의 반지름
  const circumferenceResult = 2 * Math.PI * R; //둘레
  // 1. offset이 0에 가까우면 원이 체워짐
  // 2. '둘레'를 넣으면 채워지니까 진행률만큼 둘레에서 뺴야함  둘레-진행률
  // 3.  진행률(progress)는 setInterval로 상승해서 100에서 멈춤  -> 초기는 조금 있어야하니 초기값을 5~10사이두기
  // 4. 렌더링되면 링시작해야하니 useEffect로 setInterval시작 언마운트외면 clearInterval

  useEffect(() => {
    const analysisProgressInterval = setInterval(() => {
      setProgress((prev) => {
        const cap = isReady ? 100 : 95;

        if (prev >= cap) return prev;

        return Math.min(cap, prev + (isReady ? 4 : 1));
      });
    }, 200);

    return () => clearInterval(analysisProgressInterval);
  }, [isReady]);

  useEffect(() => {
    if (isReady && progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      const timer = setTimeout(() => onComplete?.(), 300);
      return () => clearTimeout(timer);
    }
  }, [isReady, progress, onComplete]);
  const circleOffset = circumferenceResult - (progress / 100) * circumferenceResult; // 이게 링을 채우는양을계산 숫자가 0에 가까울수록 채워짐

  const analysisStepComment = AI_ANALYSIS_STEPS.find((comment) => progress < comment.until)?.label;

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle r={R} cx="60" cy="60" stroke="#f0e7e7" strokeWidth="8" fill="none" />
          <circle
            r={R}
            cx="60"
            cy="60"
            fill="none"
            strokeWidth="8"
            stroke="#af5858"
            strokeDasharray={circumferenceResult}
            strokeDashoffset={circleOffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
        <div className="flex flex-col items-center absolute inset-0 justify-center">
          <Sparkles className="mb-1 h-5 w-5 text-[#af5858] animate-pulse" />
          <span className="text-2xl font-extrabold text-gray-800 tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">{analysisStepComment}</p>
        <p className="mt-1 text-xs text-gray-400">잠시만 기다려 주세요</p>
      </div>
    </div>
  );
};

export default AnalyzingLoader;
