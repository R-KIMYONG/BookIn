import { DiggingDaily, DiggingReader, MatchBookType } from '@/shared/domain/digging/types';

export const STORAGE_KEY = 'digging_daily';
export const getTodayKST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

export const loadTodayDigging = (): DiggingDaily | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DiggingDaily;
    if (parsed.date !== getTodayKST()) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const saveTodayDigging = (reader: DiggingReader, books: MatchBookType[]) => {
  if (typeof window === 'undefined') return;
  try {
    const value: DiggingDaily = { date: getTodayKST(), reader, books };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // 저장 실패해도 앱은 동작 (시크릿 모드 등)
  }
};
