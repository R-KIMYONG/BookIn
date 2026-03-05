'use client';

import { Genre } from '@/types/genre.type';
import { useQueries, UseQueryResult } from '@tanstack/react-query';

const fetchGenres = async (url: string): Promise<Genre[]> => {
  const response: Response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
  return response.json();
};

export default function useGenres() {
  const queries: [UseQueryResult<Genre[], Error>, UseQueryResult<Genre[], Error>, UseQueryResult<Genre[], Error>] =
    useQueries({
      queries: [
        {
          queryKey: ['koreanGenres'],
          queryFn: () => fetchGenres('/json/koreanGenres.json'),
          staleTime: Infinity,
        },
        {
          queryKey: ['foreignGenres'],
          queryFn: () => fetchGenres('/json/foreignGenres.json'),
          staleTime: Infinity,
        },
        {
          queryKey: ['ebookGenres'],
          queryFn: () => fetchGenres('/json/ebookGenres.json'),
          staleTime: Infinity,
        },
      ],
    });

  const koreanGenres = queries[0].data;
  const foreignGenres = queries[1].data;
  const ebookGenres = queries[2].data;

  return { koreanGenres, foreignGenres, ebookGenres };
}
