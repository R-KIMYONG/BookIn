'use client';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const STEPS = [
  { until: 45, label: '당신의 취향을 읽는 중…' },
  { until: 80, label: '수만 권을 뒤지는 중…' },
  { until: 101, label: '딱 맞는 책을 고르는 중…' },
];

const DiggingAnalyzingLoader = () => {
  const [progress, setProgress] = useState(5);
  const R = 52;
  const circumference = 2 * Math.PI * R;

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + 3));
    }, 120);
    return () => clearInterval(id);
  }, []);

  const offset = circumference - (progress / 100) * circumference;
  const label = STEPS.find((s) => progress < s.until)?.label;

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
            stroke="#8b2e3c"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Sparkles className="mb-1 h-5 w-5 animate-pulse text-main" />
          <span className="text-2xl font-extrabold tabular-nums text-gray-800">{Math.round(progress)}%</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
    </div>
  );
};

export default DiggingAnalyzingLoader;
