// app/lib/faq-utils.ts

/**
 * FAQ extraction utility for detecting FAQ patterns in HTML content
 * and generating FAQPage structured data for Google Discover optimization
 */

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Extracts FAQ items from HTML content by detecting common FAQ patterns
 * Supports multiple patterns:
 * - H2/H3 headings with question marks followed by paragraphs (answers)
 * - Multiple paragraph answers for the same question
 * - Various FAQ formatting styles
 */
export function extractFAQs(htmlContent: string): FAQItem[] {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return [];
  }

  const faqs: FAQItem[] = [];

  // Remove script and style tags to avoid parsing their content
  const cleanedContent = htmlContent
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Pattern 1: H2 with question mark followed by paragraphs
  // Example: <h2>What is SEO?</h2><p>Answer text...</p>
  const h2Pattern = /<h2[^>]*>(.*?\?[^<]*)<\/h2>\s*((?:<p[^>]*>[\s\S]*?<\/p>\s*)+)/gi;
  let match;

  while ((match = h2Pattern.exec(cleanedContent)) !== null) {
    const question = stripHTML(match[1]).trim();
    const answerHTML = match[2];
    const answer = extractTextFromParagraphs(answerHTML);

    if (question && answer && answer.length >= 10) {
      faqs.push({ question, answer });
    }
  }

  // Pattern 2: H3 with question mark followed by paragraphs
  // Example: <h3>How does it work?</h3><p>Answer text...</p>
  const h3Pattern = /<h3[^>]*>(.*?\?[^<]*)<\/h3>\s*((?:<p[^>]*>[\s\S]*?<\/p>\s*)+)/gi;

  while ((match = h3Pattern.exec(cleanedContent)) !== null) {
    const question = stripHTML(match[1]).trim();
    const answerHTML = match[2];
    const answer = extractTextFromParagraphs(answerHTML);

    if (question && answer && answer.length >= 10) {
      // Avoid duplicates
      const isDuplicate = faqs.some(faq => faq.question === question);
      if (!isDuplicate) {
        faqs.push({ question, answer });
      }
    }
  }

  // Pattern 3: Strong/Bold text with question marks followed by paragraphs
  // Example: <p><strong>What is link building?</strong></p><p>Answer...</p>
  const strongPattern = /<(?:strong|b)[^>]*>(.*?\?[^<]*)<\/(?:strong|b)>\s*(?:<\/p>\s*)?(?:<p[^>]*>)?([\s\S]*?)(?=<(?:strong|b|h[1-6])|$)/gi;

  while ((match = strongPattern.exec(cleanedContent)) !== null) {
    const question = stripHTML(match[1]).trim();
    let answerText = match[2];

    // Extract answer from the next paragraph if exists
    if (answerText) {
      answerText = stripHTML(answerText).trim();

      if (question && answerText && answerText.length >= 10) {
        const isDuplicate = faqs.some(faq => faq.question === question);
        if (!isDuplicate) {
          faqs.push({ question, answer: answerText });
        }
      }
    }
  }

  // Pattern 4: Detect FAQ sections explicitly
  // Look for sections with "FAQ" or "Frequently Asked Questions" headings
  const faqSectionPattern = /<h[2-3][^>]*>.*?(?:FAQ|Frequently Asked Questions).*?<\/h[2-3]>([\s\S]*?)(?=<h[2-3]|$)/gi;

  while ((match = faqSectionPattern.exec(cleanedContent)) !== null) {
    const sectionContent = match[1];

    // Within FAQ section, look for question-answer pairs more aggressively
    const qaPairPattern = /<(?:h[3-6]|strong|b)[^>]*>([^<]*\?[^<]*)<\/(?:h[3-6]|strong|b)>\s*([\s\S]*?)(?=<(?:h[3-6]|strong|b)|$)/gi;
    let qaMatch;

    while ((qaMatch = qaPairPattern.exec(sectionContent)) !== null) {
      const question = stripHTML(qaMatch[1]).trim();
      const answerHTML = qaMatch[2];
      const answer = stripHTML(answerHTML).trim();

      if (question && answer && answer.length >= 10) {
        const isDuplicate = faqs.some(faq => faq.question === question);
        if (!isDuplicate) {
          faqs.push({ question, answer });
        }
      }
    }
  }

  return faqs;
}

/**
 * Strips HTML tags from text and decodes HTML entities
 */
function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts and combines text from multiple paragraph tags
 */
function extractTextFromParagraphs(html: string): string {
  const paragraphs: string[] = [];
  const pPattern = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = pPattern.exec(html)) !== null) {
    const text = stripHTML(match[1]).trim();
    if (text) {
      paragraphs.push(text);
    }
  }

  return paragraphs.join(' ');
}

/**
 * Generates FAQPage structured data schema for Google
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
