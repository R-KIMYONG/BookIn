import Button from '@/components/common/ui/Button';
import useResendCooldown from '@/hooks/auth/useResendCooldown';
import { RESEND_COOLDOWN_MS, RESET_PASSWORD_EXPIRES_MS } from '@/shared/constants/auth';

const RetryButton = ({ expireAt, onRetry }: { expireAt: number | null; onRetry: () => void }) => {
  const requestTime = expireAt ? expireAt - RESET_PASSWORD_EXPIRES_MS : null;

  const { remainSec, canRetry } = useResendCooldown({
    requestTime,
    cooldownMs: RESEND_COOLDOWN_MS,
  });

  return <Button label={canRetry ? '재요청' : `재요청 (${remainSec}s)`} onClick={onRetry} disabled={!canRetry} />;
};

export default RetryButton;
