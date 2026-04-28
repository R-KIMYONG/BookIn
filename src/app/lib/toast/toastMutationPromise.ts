import { toast } from 'react-toastify';

type ToastPromiseOptions<T> = {
  pending: string;
  success?: string | ((data: T) => string);
  error?: string | ((err: unknown) => string);
};

const toastMutationPromise = <T>(promise: Promise<T>, options: ToastPromiseOptions<T>) => {
  return toast.promise(promise, {
    pending: options.pending,
    success: {
      render({ data }) {
        if (typeof options.success === 'function') return options.success(data);
        if (typeof options.success === 'string') return options.success;

        // 기본: data에 message가 있으면 사용, 없으면 기본 문구
        const anyData = data as any;
        return anyData?.message ?? '처리가 완료되었습니다.';
      },
    },
    error: {
      render({ data }) {
        if (typeof options.error === 'function') return options.error(data);
        if (typeof options.error === 'string') return options.error;

        return data instanceof Error ? data.message : '요청 처리 중 오류가 발생했습니다.';
      },
    },
  });
};

export default toastMutationPromise;
