import 'server-only';

const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-4-lite';

type VoyageEmbeddingResponse = {
  object: 'list';
  data: { object: 'embedding'; embedding: number[]; index: number }[];
  model: string;
  usage: { total_tokens: number };
};

export class EmbeddingError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'EmbeddingError';
  }
}
export const embedText = async (texts: string[], inputType: 'query' | 'document' = 'document'): Promise<number[][]> => {
  if (texts.length === 0) return [];
  const voyageApiKey = process.env.VOYAGE_API_KEY;

  if (!voyageApiKey) throw new Error('VOYAGE_API_KEY is missing');

  const res = await fetch(VOYAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${voyageApiKey}`,
    },
    body: JSON.stringify({
      model: VOYAGE_MODEL,
      input_type: inputType,
      input: texts,
    }),
    cache: 'no-store',
  });

  if (!res.ok) throw new EmbeddingError(`Voyage API ${res.status}`, res.status);

  const body = (await res.json()) as VoyageEmbeddingResponse;

  return [...body.data].sort((a, b) => a.index - b.index).map((d) => d.embedding);
};
