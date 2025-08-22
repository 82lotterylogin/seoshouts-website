// app/lib/content-utils.ts

// Function to calculate accurate read time from content (supports both HTML and plain text)
export function calculateReadTime(content: any): number {
  try {
    let plainText = '';
    
    // Handle different content types
    if (typeof content === 'string') {
      // If it's a string, treat it as HTML/plain text
      plainText = content.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (content && typeof content === 'object') {
      // If it's an object (Storyblok rich text), try to extract text
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { richTextResolver } = require('@storyblok/richtext');
        const { render } = richTextResolver();
        const htmlContent = render(content);
        plainText = htmlContent.replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      } catch {
        // Fallback: try to extract text from object structure
        plainText = JSON.stringify(content).replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }
    
    // Count words (split by whitespace and filter empty strings)
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Calculate read time (average 200 words per minute)
    const wordsPerMinute = 200;
    const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    
    // Minimum 1 minute read time
    return Math.max(1, readTimeMinutes);
    
  } catch (error) {
    console.error('Error calculating read time:', error);
    return 5; // Default fallback
  }
}

// Function to extract excerpt from content (supports both HTML and plain text)
export function extractExcerpt(content: any, maxLength: number = 160): string {
  try {
    let plainText = '';
    
    // Handle different content types
    if (typeof content === 'string') {
      // If it's a string, treat it as HTML/plain text
      plainText = content.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (content && typeof content === 'object') {
      // If it's an object (Storyblok rich text), try to extract text
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { richTextResolver } = require('@storyblok/richtext');
        const { render } = richTextResolver();
        const htmlContent = render(content);
        plainText = htmlContent.replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      } catch {
        // Fallback: try to extract text from object structure
        plainText = JSON.stringify(content).replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }
    
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    // Truncate at word boundary
    const truncated = plainText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  } catch (error) {
    console.error('Error extracting excerpt:', error);
    return 'Click to read more about this comprehensive guide...';
  }
}
