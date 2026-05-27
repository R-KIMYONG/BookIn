import { Id, ToastOptions } from 'react-toastify';
import { MESSAGE_MAP } from './messageMap';
import { ResultCode } from './resultCode';
type ShowToastOptions = {
  provider?: string | null;
  toastId?: Id;
  variables?: Record<string, unknown>;
  preventDuplicate?: boolean;
  toastOptions?: ToastOptions;
};

export const showToast = async (code: ResultCode, options?: ShowToastOptions) => {
  const { toast } = await import('react-toastify');
  const messageData = MESSAGE_MAP[code];

  if (!messageData) return;

  if (options?.preventDuplicate && options.toastId && toast.isActive(options.toastId)) {
    return;
  }

  const message =
    typeof messageData.message === 'function' ? messageData.message(options?.variables) : messageData.message;

  toast[messageData.type](message, { toastId: options?.toastId, ...options?.toastOptions });
};
