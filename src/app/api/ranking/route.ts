import { getRankedBooks } from '@/shared/lib/server/entities/getRankedBooks';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const books = await getRankedBooks();

  return NextResponse.json(books);
};
