// app/lib/content-utils.ts

// Function to calculate accurate read time from content (supports both HTML and plain text)
export function calculateReadTime(content: any): number {
  try {
    let plainText = '';
    
    // Content from blog.db is an HTML string; strip tags to plain text
    if (typeof content === 'string') {
      plainText = content.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (content && typeof content === 'object') {
      plainText = JSON.stringify(content).replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
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
    
    // Content from blog.db is an HTML string; strip tags to plain text
    if (typeof content === 'string') {
      plainText = content.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (content && typeof content === 'object') {
      plainText = JSON.stringify(content).replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
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
