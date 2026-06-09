import { createHmac } from 'node:crypto';

const IP_HASH_SECRET = process.env.IP_HASH_SECRET;
if (!IP_HASH_SECRET) throw new Error('IP_HASH_SECRET env is missing');

export const hashIdentifier = (value: string) => createHmac('sha256', IP_HASH_SECRET).update(value).digest('hex');
