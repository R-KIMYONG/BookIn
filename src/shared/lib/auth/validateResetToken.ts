export const validateResetToken = async (token: string) => {
  const response = await fetch(`/api/auth/password-reset-validate?token=${token}`, { method: 'GET' });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.message || '유효하지 않은 토큰입니다.');
  return result;
};
