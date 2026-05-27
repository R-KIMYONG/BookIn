import { headers } from 'next/headers';

export const getBaseUrl = async () => {
  const headersList = await headers();
  const host = headersList.get('host');

  if (!host) throw new Error('host를 찾을 수 없습니다.');
  const protocal = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  return `${protocal}://${host}`;
};
