import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, logSecurityEvent, getSecurityHeaders } from '@/app/lib/security';

// Extract text content from HTML
function extractTextContent(html: string): string {
  // Remove script and style tags completely
  const cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Remove HTML tags but keep the text content
  const textOnly = cleanHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-zA-Z0-9#]+;/g, ' '); // Remove other HTML entities

  // Clean up whitespace
  const cleaned = textOnly
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

// Check if URL is allowed (basic security check)
function isAllowedUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Block localhost and private IPs
    const hostname = urlObj.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.2') ||
      hostname.startsWith('172.30.') ||
      hostname.startsWith('172.31.') ||
      hostname.startsWith('169.254.')
    ) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { url } = body;

    // Sanitize input
    url = sanitizeInput(url);

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid URL' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Security check
    if (!isAllowedUrl(url)) {
      logSecurityEvent('BLOCKED_URL_FETCH', { url }, request);
      return NextResponse.json(
        { success: false, error: 'URL not allowed for security reasons' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    console.log(`Fetching content from: ${url}`);

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEOShouts-KeywordAnalyzer/1.0 (Content Analysis Bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check content type
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return NextResponse.json(
        { success: false, error: 'URL does not contain HTML content' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get the HTML content
    const html = await response.text();
    
    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'No content found at the provided URL' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Extract text content from HTML
    const textContent = extractTextContent(html);
    
    if (!textContent || textContent.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Insufficient text content found on the webpage' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    console.log(`Successfully extracted ${textContent.length} characters from ${url}`);

    return NextResponse.json({
      success: true,
      content: textContent,
      length: textContent.length,
      url: url
    }, { headers: getSecurityHeaders() });

  } catch (error) {
    logSecurityEvent('URL_FETCH_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      url: body?.url 
    }, request);
    
    console.error('URL fetch error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Request timeout - the webpage took too long to respond' },
        { status: 408, headers: getSecurityHeaders() }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content from URL. Please try again.' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}