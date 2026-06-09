import 'server-only';
import type { NextRequest } from 'next/server';

export const getClientIp = (request: NextRequest): string => {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim(); // 콤마 첫 토큰 = 진짜 클라
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return '0.0.0.0'; // 폴백
};
