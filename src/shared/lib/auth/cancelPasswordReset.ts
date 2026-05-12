export const cancelPasswordReset = async (token: string): Promise<void> => {
  const response = await fetch('/api/auth/password-reset-confirm', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || '비밀번호 재설정 취소 실패');
  }
  return result;
};
