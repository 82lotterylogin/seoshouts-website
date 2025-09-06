import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, logSecurityEvent, getSecurityHeaders } from '@/app/lib/security';

// Verify reCAPTCHA
async function verifyRecaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  
  const data = await response.json();
  return data.success;
}

// Crawl a single page and extract links
async function crawlPage(url: string, baseUrl: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEOShouts-SitemapGenerator/1.0 (Sitemap Generator Bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return [];
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return [];
    }

    const html = await response.text();
    
    // Extract links using regex (basic but effective)
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
    const links: string[] = [];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      
      // Skip invalid links
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        continue;
      }

      // Convert relative URLs to absolute
      let absoluteUrl;
      try {
        if (href.startsWith('http')) {
          absoluteUrl = href;
        } else if (href.startsWith('//')) {
          absoluteUrl = new URL(baseUrl).protocol + href;
        } else if (href.startsWith('/')) {
          absoluteUrl = new URL(href, baseUrl).toString();
        } else {
          absoluteUrl = new URL(href, url).toString();
        }

        // Only include URLs from the same domain
        const baseUrlObj = new URL(baseUrl);
        const linkUrlObj = new URL(absoluteUrl);
        
        if (linkUrlObj.hostname === baseUrlObj.hostname) {
          // Normalize URL with consistent trailing slashes
          let normalizedUrl = linkUrlObj.origin + linkUrlObj.pathname;
          
          // Ensure trailing slash for consistency (except for files with extensions)
          const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(linkUrlObj.pathname);
          
          if (!hasFileExtension && !normalizedUrl.endsWith('/')) {
            normalizedUrl += '/';
          }
          
          // Add query parameters if they exist (but skip common tracking params)
          if (linkUrlObj.search && !linkUrlObj.search.includes('utm_') && !linkUrlObj.search.includes('fbclid')) {
            normalizedUrl += linkUrlObj.search;
          }
          
          links.push(normalizedUrl);
        }
      } catch {
        // Invalid URL, skip
        continue;
      }
    }

    return [...new Set(links)]; // Remove duplicates
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return [];
  }
}

// Check if URL should be excluded from sitemap
function shouldExcludeUrl(url: string): boolean {
  const path = new URL(url).pathname.toLowerCase();
  
  // Common exclusions
  const excludePatterns = [
    '/admin',
    '/wp-admin',
    '/wp-content',
    '/api',
    '/login',
    '/logout',
    '/search',
    '/404',
    '/error',
    '/privacy',
    '/terms',
    '/cookie',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.zip',
    '.rar',
    '.exe',
    '.dmg',
    '.iso',
    '.img',
    '.tar',
    '.gz'
  ];

  return excludePatterns.some(pattern => path.includes(pattern));
}

// Main crawling function
async function crawlWebsite(startUrl: string, maxPages: number, maxDepth: number): Promise<string[]> {
  const visited = new Set<string>();
  const toVisit: Array<{ url: string; depth: number }> = [{ url: startUrl, depth: 0 }];
  const foundUrls = new Set<string>();

  // Add the start URL
  foundUrls.add(startUrl);

  while (toVisit.length > 0 && foundUrls.size < maxPages) {
    const { url, depth } = toVisit.shift()!;

    // Skip if already visited or max depth reached
    if (visited.has(url) || depth >= maxDepth) {
      continue;
    }

    visited.add(url);

    try {
      const links = await crawlPage(url, startUrl);
      
      for (const link of links) {
        // Skip if we've found enough URLs
        if (foundUrls.size >= maxPages) {
          break;
        }

        // Skip excluded URLs
        if (shouldExcludeUrl(link)) {
          continue;
        }

        foundUrls.add(link);

        // Add to visit queue if not already visited and within depth limit
        if (!visited.has(link) && depth + 1 < maxDepth) {
          toVisit.push({ url: link, depth: depth + 1 });
        }
      }
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
    }

    // Small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return Array.from(foundUrls).sort();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { url, maxPages, maxDepth, recaptchaToken } = body;

    // Sanitize inputs
    url = sanitizeInput(url);
    maxPages = parseInt(maxPages) || 100;
    maxDepth = parseInt(maxDepth) || 3;

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Website URL is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid URL (e.g., https://example.com)' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      logSecurityEvent('CRAWL_RECAPTCHA_FAILED', { url }, request);
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate limits
    if (maxPages > 2000) {
      maxPages = 2000;
    }
    if (maxDepth > 5) {
      maxDepth = 5;
    }

    // Perform the crawl
    console.log(`Starting crawl of ${url} with maxPages=${maxPages}, maxDepth=${maxDepth}`);
    const urls = await crawlWebsite(url, maxPages, maxDepth);
    
    console.log(`Crawl completed. Found ${urls.length} URLs.`);

    return NextResponse.json({
      success: true,
      urls: urls,
      totalFound: urls.length,
      maxPages: maxPages,
      maxDepth: maxDepth
    }, { headers: getSecurityHeaders() });

  } catch (error) {
    logSecurityEvent('CRAWL_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' }, request);
    console.error('Crawl error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to crawl website. Please try again.' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}