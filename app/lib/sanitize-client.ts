// Client-side HTML sanitization using DOMPurify
'use client';

import DOMPurify from 'isomorphic-dompurify';

// Client-side HTML sanitization with DOMPurify
export function sanitizeHTMLClient(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Configure DOMPurify with conservative settings
  const cleanHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'pre', 'code', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height', 'target', 'rel', 'class'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
  });
  
  return cleanHTML;
}