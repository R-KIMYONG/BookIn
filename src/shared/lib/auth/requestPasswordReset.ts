export const requestPasswordReset = async (email: string): Promise<void> => {
  const response = await fetch('/api/auth/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error('Password reset request failed');
  }
  return result;
};
