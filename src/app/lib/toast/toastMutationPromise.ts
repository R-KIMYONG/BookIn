import { toast } from 'react-toastify';

type ToastMutationResult = {
  message?: string;
};

const toastMutationPromise = <T extends ToastMutationResult>(promise: Promise<T>, pendingMessage: string) => {
  return toast.promise(promise, {
    pending: pendingMessage,
    success: {
      render({ data }) {
        return data?.message ?? '처리가 완료되었습니다.';
      },
    },
    error: {
      render({ data }) {
        return data instanceof Error ? data.message : '요청 처리 중 오류가 발생했습니다.';
      },
    },
  });
};

export default toastMutationPromise;
