import 'server-only';

const BASE_URL = 'https://apis.yes24.com/v1';
type Yes24Params = Record<string, string | number | boolean | undefined>;

type Yes24Response<T> = {
  success: boolean;
  message: string;
  errorCode: string | null;
  data: T;
};

export class Yes24Error extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null = null
  ) {
    super(message);
    this.name = 'Yes24Error';
  }
}

type Yes24FetchOptions = {
  revalidate: number | false; 
};

export const yes24Fetch = async <T>(
  path: string,
  params: Yes24Params,
  { revalidate }: Yes24FetchOptions
): Promise<T> => {
  const apiKey = process.env.YES24_API_KEY;
  if (!apiKey) throw new Error('YES24_API_KEY is missing');

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    headers: { 'X-Api-Key': apiKey },
    next: { revalidate },
  });

  // 실패 응답에도 errorCode가 담겨 올 수 있어서 본문을 먼저 읽음 (JSON이 아니면 null)
  const body = (await res.json().catch(() => null)) as Yes24Response<T> | null;

  if (!res.ok || !body) {
    throw new Yes24Error(`YES24 API ${res.status}`, res.status, body?.errorCode ?? null);
  }
  if (!body.success) {
    throw new Yes24Error(body.message || 'YES24 API failed', res.status, body.errorCode);
  }

  return body.data;
};