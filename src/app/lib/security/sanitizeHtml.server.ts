import sanitizeHtml from 'sanitize-html';
import { SANITIZE_CONFIG } from './sanitize.config';

export const sanitizeHtmlServer = (dirty: string) => {
  return sanitizeHtml(dirty, {
    allowedTags: SANITIZE_CONFIG.tags,
    allowedAttributes: {
      a: SANITIZE_CONFIG.attrs,
    },
    allowedSchemesByTag: {
      a: ['http', 'https'],
    },
  });
};
