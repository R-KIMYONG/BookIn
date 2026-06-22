'use client';
import Button from '@/components/common/ui/Button';
import { Info, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const RankingInfo = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="secondary"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-0.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors group"
        aria-label="랭킹 기준 안내"
        aria-expanded={open}
        label="화제성 순"
        rightIcon={<Info className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />}
      />

      {open && (
        <div
          role="dialog"
          className="absolute right-0 top-full mt-2 z-30 w-64 rounded-xl bg-white p-3 text-[11px] leading-relaxed text-gray-600 shadow-lg ring-1 ring-black/10"
        >
          <p className="mb-1.5 font-semibold text-gray-800">종합 랭킹 안내</p>
          <ul className="space-y-1.5">
            <li>
              • 순위는 <b className="text-gray-700">매일 갱신</b>되며, 변동은 <b className="text-gray-700">어제 대비</b>
              로 표시돼요.
            </li>
            <li>
              • 점수 = <b className="text-gray-700">조회수 · 좋아요 · 댓글</b>을 합산한 화제성 점수.
            </li>

            {/* ▼ 추가: 변동 표시 범례 */}
            <li>
              • 순위 옆 변동 표시:
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-0.5 text-red-500">
                  <ChevronUp className="w-3 h-3" /> 상승
                </span>
                <span className="inline-flex items-center gap-0.5 text-blue-500">
                  <ChevronDown className="w-3 h-3" /> 하락
                </span>
                <span className="inline-flex items-center gap-0.5 text-gray-400">
                  <Minus className="w-3 h-3" /> 유지
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="text-[10px] font-bold text-red-500">NEW</span> 새 진입
                </span>
              </div>
            </li>

            <li>
              • 숫자 표기: <b className="text-gray-700">1K</b>=1천 · <b className="text-gray-700">1M</b>=1백만 ·{' '}
              <b className="text-gray-700">1B</b>=10억 · <b className="text-gray-700">1T</b>=1조
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RankingInfo;
