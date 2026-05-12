'use client';

import createDOMPurify from 'dompurify';

let DOMPurifyInstance: ReturnType<typeof createDOMPurify> | null = null;

const getDOMPurify = () => {
  if (typeof window === 'undefined') return null;

  if (!DOMPurifyInstance) {
    DOMPurifyInstance = createDOMPurify(window);

    DOMPurifyInstance.addHook('afterSanitizeAttributes', (node: any) => {
      if (node?.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  return DOMPurifyInstance;
};

export const sanitizeHtmlClient = (dirty: string) => {
  const purify = getDOMPurify();

  if (!purify) return dirty;
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'blockquote', 'code', 'a'],
    ALLOWED_ATTR: ['href'],
    FORBID_TAGS: ['script', 'iframe'],
    FORBID_ATTR: ['onerror', 'onclick', 'style'],
    ALLOWED_URI_REGEXP: /^(https?:\/\/)/i,
  });
};
