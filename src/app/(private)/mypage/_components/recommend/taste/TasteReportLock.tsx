import Button from '@/components/common/ui/Button';
import { TASTE_UNLOCK } from '@/shared/domain/taste/constants';
import { ChevronRight, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TasteReportLockProps = { total: number; onExplore?: () => void };

const TasteReportLock = ({ total, onExplore }: TasteReportLockProps) => {
  const router = useRouter();
  const remaining = Math.max(0, TASTE_UNLOCK - total);
  const pct = Math.min(100, (total / TASTE_UNLOCK) * 100);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
      <div className="text-2xl">
        <LockKeyhole />
      </div>
      <h3 className="mt-1.5 text-base font-extrabold text-gray-900">
        취향 리포트{' '}
        <span className="text-indigo-600">
          ({total}/{TASTE_UNLOCK})
        </span>
      </h3>
      <p className="mx-1 mb-4 mt-2 text-xs leading-relaxed text-gray-500">
        책에 좋아요·북마크·댓글을 남기면
        <br />
        당신의 독서 페르소나가 분석돼요
      </p>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-gray-500">
        <span>{total}권 반응</span>
        <span className="font-semibold text-indigo-600">{remaining}권만 더!</span>
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="primary" label="홈으로" size="sm" onClick={() => router.push('/')} />
        <Button
          variant="secondary"
          label="추천 책 둘러보기"
          size="sm"
          className="text-indigo-600 group"
          onClick={onExplore}
          rightIcon={
            <ChevronRight className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
          }
        />
      </div>
    </div>
  );
};

export default TasteReportLock;
