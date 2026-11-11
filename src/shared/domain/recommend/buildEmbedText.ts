import { BookDetail } from '../book/types';

export const MAX_BODY_LENGTH = 1000;

type EmbedSource = Pick<BookDetail, 'title' | 'subTitle' | 'author' | 'categoryName' | 'description'>;

export const buildEmbedText = (book: EmbedSource): string => {
  const { title, subTitle, author, categoryName, description } = book;

  const body = description?.slice(0, MAX_BODY_LENGTH) ?? null;

  const lines: (string | null)[] = [
    `제목: ${title}`,
    subTitle ? `부제: ${subTitle}` : null,
    author ? `저자: ${author}` : null,
    categoryName ? `분류: ${categoryName}` : null,
    body ? `소개: ${body}` : null,
  ];

  return lines.filter((line): line is string => line !== null).join('\n');
};
