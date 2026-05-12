export const confirmPasswordReset = async (password: string, token: string) => {
  const response = await fetch('/api/auth/password-reset-confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || '비밀번호 변경 실패');
  }
  return result;
};
