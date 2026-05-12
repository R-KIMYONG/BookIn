import { authKeys } from '@/shared/domain/auth/queryKeys';
import { ValidateResetTokenResponse } from '@/shared/domain/auth/types';
import { cancelPasswordReset } from '@/shared/lib/auth/cancelPasswordReset';
import { confirmPasswordReset } from '@/shared/lib/auth/confirmPasswordReset';
import { validateResetToken } from '@/shared/lib/auth/validateResetToken';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useResetPassword = (token: string) => {
  const router = useRouter();

  const validateQuery = useQuery<ValidateResetTokenResponse>({
    queryKey: authKeys.validateResetToken(token),
    queryFn: () => validateResetToken(token),
    enabled: !!token,
  });

  const confirmMutation = useMutation({
    mutationFn: (password: string) => confirmPasswordReset(password, token),
    onSuccess: () => router.replace('/login'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelPasswordReset(token),
    onSuccess: () => router.push('/login'),
  });

  return {
    validateQuery,
    confirmMutation,
    cancelMutation,
  };
};
