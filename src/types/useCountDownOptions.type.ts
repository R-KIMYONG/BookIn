export type UseCountdownOptions = {
  enabled?: boolean; // 카운트다운 동작 여부
  intervalMs?: number; // 기본 1초
  stopOnExpire?: boolean; // 만료되면 interval 자동 정지
};

export type TempSessionState = {
  remainingSec: number;
  countDownText: string | null;
  isExpired: boolean;
};

export type TempSessionModalProps = TempSessionState & {
  isOpen: boolean;
  remainingSec: number;
  countDownText: string | null;
  isExpired: boolean;
  onClose: () => void;
  onExtend: () => void;
  onGoLogin: () => void;
};
