import 'server-only';
import { createHmac } from 'node:crypto';

export const hashIdentifier = (value: string) => {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error('IP_HASH_SECRET env is missing');

  return createHmac('sha256', secret).update(value).digest('hex');
};
