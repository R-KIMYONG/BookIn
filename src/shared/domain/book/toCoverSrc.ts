import { NO_IMAGE } from './constants';

export const toCoverSrc = (cover: string | null | undefined): string =>
  cover && (cover.startsWith('http') || cover.startsWith('/')) ? cover : NO_IMAGE;
