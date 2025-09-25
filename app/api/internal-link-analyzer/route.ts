import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, dailyRateLimit, sanitizeFormInput, dailyRateLimitMap } from '../../lib/security';

interface AnchorData {
  text: string;
  href: string;
  count: number;
  pages: string[];
}

interface CrawlResult {
  url: string;
  title: string;
  anchors: Array<{
    text: string;
    href: string;
  }>;
  error?: string;
}

// Helper function to extract domain from URL
function getDomain(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

// Helper function to resolve relative URLs
function resolveUrl(href: string, baseUrl: string): string {
  try {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return href;
    }
    if (href.startsWith('//')) {
      return new URL(baseUrl).protocol + href;
    }
    if (href.startsWith('/')) {
      return getDomain(baseUrl) + href;
    }
    return new URL(href, baseUrl).href;
  } catch {
    return '';
  }
}

// Helper function to clean anchor text
function cleanAnchorText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\n\r\t]/g, ' ')
    .slice(0, 200); // Limit length
}

// Function to extract internal links from HTML content
function extractInternalLinks(html: string, baseUrl: string): Array<{ text: string; href: string }> {
  const domain = getDomain(baseUrl);
  const anchors: Array<{ text: string; href: string }> = [];

  // Remove header, footer, nav, and sidebar content
  let cleanHtml = html;

  // Remove common navigation areas using regex patterns
  cleanHtml = cleanHtml.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
  cleanHtml = cleanHtml.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  cleanHtml = cleanHtml.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  cleanHtml = cleanHtml.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');

  // Remove elements with common navigation classes/ids
  const navSelectors = [
    /class\s*=\s*["'].*?(nav|menu|header|footer|sidebar).*?["'][^>]*>[\s\S]*?<\/[^>]+>/gi,
    /id\s*=\s*["'].*?(nav|menu|header|footer|sidebar).*?["'][^>]*>[\s\S]*?<\/[^>]+>/gi
  ];

  navSelectors.forEach(pattern => {
    cleanHtml = cleanHtml.replace(pattern, '');
  });

  // Extract links from main content areas only
  const linkPattern = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(cleanHtml)) !== null) {
    const href = match[1];
    const innerHTML = match[2];

    // Extract text content from innerHTML (remove HTML tags)
    const textContent = innerHTML.replace(/<[^>]*>/g, '').trim();

    if (!textContent || textContent.length < 1) continue;

    // Resolve the URL
    const resolvedUrl = resolveUrl(href, baseUrl);
    if (!resolvedUrl) continue;

    // Check if it's an internal link
    const linkDomain = getDomain(resolvedUrl);
    if (linkDomain === domain) {
      const cleanText = cleanAnchorText(textContent);
      if (cleanText.length > 0) {
        anchors.push({
          text: cleanText,
          href: resolvedUrl
        });
      }
    }
  }

  return anchors;
}

// Function to fetch and parse a single URL
async function fetchUrl(url: string): Promise<CrawlResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout per URL for thorough analysis

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEO Shouts Internal Link Analyzer/1.0 (+https://seoshouts.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        url,
        title: '',
        anchors: [],
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Untitled';

    // Extract internal links
    const anchors = extractInternalLinks(html, url);

    return {
      url,
      title: title.slice(0, 100), // Limit title length
      anchors
    };

  } catch (error) {
    return {
      url,
      title: '',
      anchors: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to discover URLs from sitemap
// Function to check robots.txt for sitemap URLs
async function checkRobotsTxt(baseUrl: string): Promise<string[]> {
  const sitemapUrls: string[] = [];

  try {
    const robotsUrl = `${getDomain(baseUrl)}/robots.txt`;
    console.log(`Checking robots.txt: ${robotsUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(robotsUrl, {
      headers: {
        'User-Agent': 'SEO Shouts Internal Link Analyzer/1.0 (+https://seoshouts.com)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const robotsContent = await response.text();
      const sitemapMatches = robotsContent.match(/Sitemap:\s*(.+)/gi);

      if (sitemapMatches) {
        sitemapMatches.forEach(match => {
          const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
          if (sitemapUrl) {
            sitemapUrls.push(sitemapUrl);
            console.log(`Found sitemap in robots.txt: ${sitemapUrl}`);
          }
        });
      }
    }
  } catch (error) {
    console.log(`Failed to check robots.txt: ${error.message}`);
  }

  return sitemapUrls;
}

// Function to check if URL is a valid HTML page (not PDF, DOC, etc.)
function isValidHtmlUrl(url: string): boolean {
  const excludedExtensions = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.rar', '.tar', '.gz', '.mp3', '.mp4', '.avi',
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico',
    '.css', '.js', '.xml', '.json', '.txt'
  ];

  const urlPath = new URL(url).pathname.toLowerCase();
  return !excludedExtensions.some(ext => urlPath.endsWith(ext));
}

// Function to detect if URL is likely a language variant
function isMainLanguageUrl(url: string, baseUrl: string): boolean {
  const baseDomain = getDomain(baseUrl);
  const urlDomain = getDomain(url);

  // Must be same domain
  if (urlDomain !== baseDomain) return false;

  const urlPath = new URL(url).pathname;
  const basePath = new URL(baseUrl).pathname;

  // Common language patterns to exclude
  const languagePatterns = [
    /^\/[a-z]{2}\//,           // /en/, /es/, /fr/
    /^\/[a-z]{2}-[a-z]{2}\//,  // /en-us/, /en-gb/
    /^\/[a-z]{3}\//,           // /eng/, /spa/
    /\/lang\//,                // /lang/en/
    /\/language\//,            // /language/english/
  ];

  // If base URL has language pattern, consider all URLs from same language
  const baseHasLanguage = languagePatterns.some(pattern => pattern.test(basePath));
  if (baseHasLanguage) {
    // Extract language from base URL
    const baseLanguage = basePath.match(/^\/([a-z]{2,3}(-[a-z]{2})?)\//);
    if (baseLanguage) {
      // Only include URLs with same language or no language prefix
      const urlLanguage = urlPath.match(/^\/([a-z]{2,3}(-[a-z]{2})?)\//);
      return !urlLanguage || urlLanguage[1] === baseLanguage[1];
    }
  }

  // If URL has language pattern but base doesn't, exclude it
  const urlHasLanguage = languagePatterns.some(pattern => pattern.test(urlPath));
  return !urlHasLanguage;
}

// Function to extract URLs from a single sitemap
async function extractUrlsFromSitemap(sitemapUrl: string, baseUrl: string): Promise<string[]> {
  const urls: string[] = [];
  const domain = getDomain(baseUrl);

  try {
    console.log(`Extracting URLs from sitemap: ${sitemapUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(sitemapUrl, {
      headers: {
        'User-Agent': 'SEO Shouts Internal Link Analyzer/1.0 (+https://seoshouts.com)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const xml = await response.text();

      // Check if this is a sitemap index
      if (xml.includes('<sitemapindex')) {
        console.log('Found sitemap index, extracting child sitemaps...');

        // For multilingual sites, prioritize main sitemap
        const sitemapMatches = xml.match(/<loc>(.*?)<\/loc>/g);
        if (sitemapMatches) {
          const childSitemaps = sitemapMatches.map(match =>
            match.replace(/<\/?loc>/g, '').trim()
          );

          // Sort to prioritize main/default sitemaps (without language codes)
          childSitemaps.sort((a, b) => {
            const aHasLang = /[_-](en|es|fr|de|it|pt|ru|ja|ko|zh|ar)([_-]|\.xml)/i.test(a);
            const bHasLang = /[_-](en|es|fr|de|it|pt|ru|ja|ko|zh|ar)([_-]|\.xml)/i.test(b);

            if (!aHasLang && bHasLang) return -1; // a is main, prioritize it
            if (aHasLang && !bHasLang) return 1;  // b is main, prioritize it
            return 0; // same priority
          });

          // Process ALL sitemaps to ensure comprehensive coverage
          for (const childSitemapUrl of childSitemaps) {
            if (childSitemapUrl) {
              const childUrls = await extractUrlsFromSitemap(childSitemapUrl, baseUrl);
              urls.push(...childUrls);

              // Only stop if we exceed reasonable limits for performance
              if (urls.length >= 1000) {
                console.log(`Reached 1000 URL limit, stopping sitemap processing`);
                break;
              }
            }
          }
        }
      } else {
        // Regular sitemap - extract page URLs
        const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
        if (urlMatches) {
          urlMatches.forEach(match => {
            const url = match.replace(/<\/?loc>/g, '').trim();
            if (url &&
                url.startsWith('http') &&
                getDomain(url) === domain &&
                isValidHtmlUrl(url) &&
                isMainLanguageUrl(url, baseUrl)) {
              urls.push(url);
            }
          });
        }
      }

      console.log(`Extracted ${urls.length} valid HTML URLs from ${sitemapUrl}`);
    }
  } catch (error) {
    console.error(`Failed to fetch sitemap ${sitemapUrl}:`, error.message);
  }

  return urls;
}

// Main sitemap discovery function with progress tracking
async function discoverUrlsFromSitemap(baseUrl: string, providedSitemapUrl?: string): Promise<{
  urls: string[];
  sitemapFound: boolean;
  checkedLocations: string[];
  robotsSitemaps: string[];
  progressSteps: Array<{
    step: string;
    status: 'in_progress' | 'completed' | 'failed';
    message: string;
    timestamp: number;
  }>;
}> {
  const domain = getDomain(baseUrl);
  const checkedLocations: string[] = [];
  let urls: string[] = [];
  let sitemapFound = false;
  let robotsSitemaps: string[] = [];
  const progressSteps: Array<{ step: string; status: 'in_progress' | 'completed' | 'failed'; message: string; timestamp: number; }> = [];

  const addProgress = (step: string, status: 'in_progress' | 'completed' | 'failed', message: string) => {
    progressSteps.push({ step, status, message, timestamp: Date.now() });
    console.log(`[${status.toUpperCase()}] ${step}: ${message}`);
  };

  // If user provided a specific sitemap URL, use that first
  if (providedSitemapUrl) {
    addProgress('user_sitemap', 'in_progress', `Checking provided sitemap: ${providedSitemapUrl}`);
    try {
      urls = await extractUrlsFromSitemap(providedSitemapUrl, baseUrl);
      if (urls.length > 0) {
        sitemapFound = true;
        addProgress('user_sitemap', 'completed', `Successfully extracted ${urls.length} URLs from provided sitemap`);
        return { urls, sitemapFound, checkedLocations: [providedSitemapUrl], robotsSitemaps, progressSteps };
      } else {
        addProgress('user_sitemap', 'failed', 'Provided sitemap contained no valid URLs');
      }
    } catch (error) {
      addProgress('user_sitemap', 'failed', `Failed to fetch provided sitemap: ${error.message}`);
    }
  }

  // Common sitemap locations
  const commonSitemaps = [
    `${domain}/sitemap.xml`,
    `${domain}/sitemap_index.xml`,
    `${domain}/sitemap.xml.gz`,
  ];

  // First, check common sitemap locations
  addProgress('common_sitemaps', 'in_progress', 'Checking common sitemap locations...');
  for (const sitemapUrl of commonSitemaps) {
    checkedLocations.push(sitemapUrl);
    addProgress('common_sitemaps', 'in_progress', `Checking ${sitemapUrl}`);

    try {
      const sitemapUrls = await extractUrlsFromSitemap(sitemapUrl, baseUrl);
      if (sitemapUrls.length > 0) {
        urls = sitemapUrls;
        sitemapFound = true;
        addProgress('common_sitemaps', 'completed', `Found sitemap with ${urls.length} URLs at ${sitemapUrl}`);
        break;
      }
    } catch (error) {
      // Continue to next location
    }
  }

  if (!sitemapFound) {
    addProgress('common_sitemaps', 'failed', 'No sitemaps found in common locations');
  }

  // If no sitemap found in common locations, check robots.txt
  if (!sitemapFound) {
    addProgress('robots_check', 'in_progress', 'Checking robots.txt for sitemap URLs...');
    robotsSitemaps = await checkRobotsTxt(baseUrl);

    if (robotsSitemaps.length > 0) {
      addProgress('robots_check', 'completed', `Found ${robotsSitemaps.length} sitemap(s) in robots.txt`);

      for (const sitemapUrl of robotsSitemaps) {
        checkedLocations.push(sitemapUrl);
        addProgress('robots_sitemaps', 'in_progress', `Checking robots.txt sitemap: ${sitemapUrl}`);

        try {
          const sitemapUrls = await extractUrlsFromSitemap(sitemapUrl, baseUrl);
          if (sitemapUrls.length > 0) {
            urls = sitemapUrls;
            sitemapFound = true;
            addProgress('robots_sitemaps', 'completed', `Successfully extracted ${urls.length} URLs from robots.txt sitemap`);
            break;
          }
        } catch (error) {
          addProgress('robots_sitemaps', 'failed', `Failed to extract from ${sitemapUrl}: ${error.message}`);
        }
      }

      if (!sitemapFound) {
        addProgress('robots_sitemaps', 'failed', 'No valid URLs found in robots.txt sitemaps');
      }
    } else {
      addProgress('robots_check', 'failed', 'No sitemaps found in robots.txt');
    }
  }

  if (!sitemapFound) {
    addProgress('discovery_complete', 'failed', 'No sitemaps found anywhere - manual input required');
  } else {
    addProgress('discovery_complete', 'completed', `Discovery complete - ${urls.length} URLs found`);

    // Add filtering info
    const totalBeforeFiltering = urls.length;
    // URLs are already filtered in extractUrlsFromSitemap
    if (totalBeforeFiltering > urls.length) {
      addProgress('url_filtering', 'completed', `Filtered out ${totalBeforeFiltering - urls.length} non-HTML or language variant URLs`);
    }
  }

  return { urls, sitemapFound, checkedLocations, robotsSitemaps, progressSteps };
}

export async function POST(request: NextRequest) {
  try {
    // Read the request body once
    let body;
    try {
      const rawBody = await request.text();
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Empty request body');
      }
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format. Please check your data and try again.' },
        { status: 400 }
      );
    }

    const { step } = body;

    // Only apply daily rate limiting for new analyses (not follow-up steps)
    let dailyLimitResult;
    console.log('Analysis step:', step || 'discover');

    if (!step || step === 'discover') {
      // This is a new analysis, apply daily rate limiting
      console.log('Applying daily rate limit for new analysis');
      dailyLimitResult = await dailyRateLimit(
        request,
        'internal-link-checker',
        5, // 5 uses per day
        'Daily usage limit reached. You can use the Internal Link Checker 5 times per day. Please try again tomorrow.'
      );

      if (!dailyLimitResult.success) {
        return NextResponse.json(
          {
            error: dailyLimitResult.error,
            remainingRequests: dailyLimitResult.remainingRequests,
            resetTime: dailyLimitResult.resetTime
          },
          { status: 429 }
        );
      }
    } else {
      // This is a follow-up step, don't count against daily limit but get current status
      console.log('Follow-up step, not counting against daily limit');
      const ip = request.ip ||
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
      const key = `${ip}:internal-link-checker:daily`;
      const entry = dailyRateLimitMap.get(key);
      const now = Date.now();
      console.log('Current usage entry:', entry);

      if (entry) {
        const resetDate = new Date(entry.resetTime);
        let resetTimeStr;

        if (isNaN(resetDate.getTime())) {
          const hoursUntilReset = Math.ceil((entry.resetTime - now) / (1000 * 60 * 60));
          resetTimeStr = `in ${hoursUntilReset} hours`;
        } else {
          try {
            resetTimeStr = `${resetDate.toLocaleDateString('en-US')} at ${resetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
          } catch (error) {
            const hoursUntilReset = Math.ceil((entry.resetTime - now) / (1000 * 60 * 60));
            resetTimeStr = `in ${hoursUntilReset} hours`;
          }
        }

        dailyLimitResult = {
          success: true,
          remainingRequests: Math.max(0, 5 - entry.count),
          resetTime: resetTimeStr
        };
      } else {
        // No entry yet, all requests available
        const today = new Date(now);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, 0);
        const resetDate = new Date(endOfDay.getTime());
        let resetTimeStr;

        if (isNaN(resetDate.getTime())) {
          resetTimeStr = 'tomorrow';
        } else {
          try {
            resetTimeStr = `${resetDate.toLocaleDateString('en-US')} at ${resetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
          } catch (error) {
            resetTimeStr = 'tomorrow';
          }
        }

        dailyLimitResult = {
          success: true,
          remainingRequests: 5,
          resetTime: resetTimeStr
        };
      }
    }

    // Additional short-term rate limiting to prevent abuse
    const rateLimitResult = await rateLimit(request, {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 2, // Only 2 requests per 5 minutes
      message: 'Please wait 5 minutes between analysis requests.'
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Body already parsed above in the rate limiting section

    const { url: inputUrl, recaptchaToken, sitemapUrl, manualUrls } = body;
    // step is already destructured above

    // Validate inputs
    if (!inputUrl || typeof inputUrl !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid website URL' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    if (!recaptchaToken || typeof recaptchaToken !== 'string') {
      return NextResponse.json(
        { error: 'reCAPTCHA verification required' },
        { status: 400 }
      );
    }

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: 'POST' }
    );

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Sanitize and validate URL
    const sanitizedUrl = sanitizeFormInput(inputUrl);
    let baseUrl: string;

    try {
      const urlObj = new URL(sanitizedUrl);
      baseUrl = urlObj.href;
    } catch (error) {
      return NextResponse.json(
        { error: 'Please provide a valid URL (including http:// or https://)' },
        { status: 400 }
      );
    }

    // Handle different steps of the analysis
    console.log(`Starting anchor analysis for: ${baseUrl}`);

    // Variable to capture discovery progress steps
    var discoveryProgressSteps: Array<{step: string; status: 'in_progress' | 'completed' | 'failed'; message: string; timestamp: number;}> = [];

    // Step 1: Initial sitemap discovery (default step)
    if (!step || step === 'discover') {
      console.log('Step 1: Discovering sitemaps...');

      const discovery = await discoverUrlsFromSitemap(baseUrl, sitemapUrl);

      // Capture the discovery progress steps
      discoveryProgressSteps = discovery.progressSteps;

      // If sitemap found and URLs extracted
      if (discovery.sitemapFound && discovery.urls.length > 0) {
        console.log(`Found ${discovery.urls.length} URLs in sitemap`);

        // Check if URL count exceeds limit
        if (discovery.urls.length > 500) {
          return NextResponse.json({
            success: false,
            needsUserInput: true,
            step: 'url_limit_exceeded',
            message: `Found ${discovery.urls.length} URLs in sitemap, which exceeds our limit of 500 URLs. Please provide a smaller sitemap or a list of specific URLs to analyze.`,
            urlCount: discovery.urls.length,
            sitemapUrl: sitemapUrl || discovery.checkedLocations.find(loc => discovery.urls.length > 0),
            progressSteps: discovery.progressSteps
          });
        }

        // Proceed with crawling the sitemap URLs
        var urlsToCrawl = discovery.urls.slice(0, 500); // Safety limit
        console.log(`Proceeding with ${urlsToCrawl.length} URLs from sitemap`);
      } else {
        // No sitemap found - ask user for input
        return NextResponse.json({
          success: false,
          needsUserInput: true,
          step: 'no_sitemap_found',
          message: 'No sitemap found. We checked common locations and robots.txt.',
          checkedLocations: discovery.checkedLocations,
          robotsSitemaps: discovery.robotsSitemaps,
          progressSteps: discovery.progressSteps,
          options: [
            { id: 'provide_sitemap', label: 'I have a sitemap URL' },
            { id: 'no_sitemap', label: 'No sitemap available, I\'ll provide URLs manually' }
          ],
          remainingRequests: dailyLimitResult.remainingRequests,
          resetTime: dailyLimitResult.resetTime
        });
      }
    }

    // Step 2: Handle user-provided sitemap URL
    else if (step === 'manual_sitemap') {
      if (!sitemapUrl) {
        return NextResponse.json({
          success: false,
          error: 'Sitemap URL is required for this step'
        }, { status: 400 });
      }

      console.log(`Step 2: Processing user-provided sitemap: ${sitemapUrl}`);
      const discovery = await discoverUrlsFromSitemap(baseUrl, sitemapUrl);

      // Capture the discovery progress steps
      discoveryProgressSteps = discovery.progressSteps;

      if (discovery.urls.length === 0) {
        return NextResponse.json({
          success: false,
          needsUserInput: true,
          step: 'invalid_sitemap',
          message: 'The provided sitemap URL did not contain any valid URLs. Please check the URL or provide URLs manually.',
          progressSteps: discovery.progressSteps,
          options: [
            { id: 'retry_sitemap', label: 'Try different sitemap URL' },
            { id: 'no_sitemap', label: 'Provide URLs manually' }
          ]
        });
      }

      if (discovery.urls.length > 500) {
        return NextResponse.json({
          success: false,
          needsUserInput: true,
          step: 'url_limit_exceeded',
          message: `The sitemap contains ${discovery.urls.length} URLs, which exceeds our limit of 500. Please provide a list of specific URLs to analyze instead.`,
          urlCount: discovery.urls.length,
          progressSteps: discovery.progressSteps
        });
      }

      console.log(`Successfully extracted ${discovery.urls.length} URLs from provided sitemap`);
      var urlsToCrawl = discovery.urls.slice(0, 500);
    }

    // Step 3: Handle manual URL list
    else if (step === 'manual_urls') {
      if (!manualUrls || !Array.isArray(manualUrls) || manualUrls.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Manual URL list is required for this step'
        }, { status: 400 });
      }

      if (manualUrls.length > 500) {
        return NextResponse.json({
          success: false,
          needsUserInput: true,
          step: 'url_limit_exceeded',
          message: `You provided ${manualUrls.length} URLs, which exceeds our limit of 500. Please provide fewer URLs.`,
          urlCount: manualUrls.length
        });
      }

      console.log(`Step 3: Processing ${manualUrls.length} manually provided URLs`);

      // Add manual progress step for manual URLs
      discoveryProgressSteps = [
        { step: 'manual_urls', status: 'completed' as const, message: `Processing ${manualUrls.length} manually provided URLs`, timestamp: Date.now() }
      ];

      // Validate and filter URLs
      const domain = getDomain(baseUrl);
      const validUrls = manualUrls.filter((url: string) => {
        try {
          const parsedUrl = new URL(url);
          return getDomain(url) === domain;
        } catch {
          return false;
        }
      });

      if (validUrls.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No valid URLs found in the provided list. Please ensure URLs belong to the same domain.'
        }, { status: 400 });
      }

      console.log(`Using ${validUrls.length} valid URLs from manual list`);
      var urlsToCrawl = validUrls;
    }

    // If we don't have URLs by now, there's an error
    if (!urlsToCrawl || urlsToCrawl.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No URLs available for analysis. Please try again.'
      }, { status: 400 });
    }

    // Process up to 500 URLs for comprehensive coverage
    const limitedUrls = urlsToCrawl.slice(0, 500);
    console.log(`Found ${urlsToCrawl.length} URLs, crawling ${limitedUrls.length} URLs for anchor analysis`);
    console.log(`First 5 URLs to crawl:`, limitedUrls.slice(0, 5));

    // Crawl URLs with concurrency control
    const results: CrawlResult[] = [];
    const batchSize = 10; // Process 10 URLs at a time for stable analysis
    const startTime = Date.now();

    for (let i = 0; i < limitedUrls.length; i += batchSize) {
      const batch = limitedUrls.slice(i, i + batchSize);

      // Use Promise.allSettled to continue even if some URLs fail
      const batchPromises = batch.map(url => fetchUrl(url));
      const batchResults = await Promise.allSettled(batchPromises);

      // Extract successful results
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.log(`Failed to fetch URL: ${result.reason}`);
        }
      });

      // No delay between batches for faster processing
      console.log(`Processed ${Math.min(i + batchSize, limitedUrls.length)}/${limitedUrls.length} URLs`);

      // Status update for user
      const successfulResults = results.filter(r => !r.error);
      const elapsedTime = Date.now() - startTime;
      console.log(`Progress: ${Math.round(elapsedTime / 1000)}s elapsed, ${successfulResults.length} successful results so far`);
    }

    // Aggregate anchor data
    const anchorMap = new Map<string, AnchorData>();
    let totalLinks = 0;
    let successfulPages = 0;

    const pagesWithNoLinks: Array<{ url: string; title: string; reason: string }> = [];

    results.forEach((result, index) => {
      console.log(`Page ${index + 1}: ${result.url} - ${result.error ? `Error: ${result.error}` : `${result.anchors.length} anchors found`}`);

      if (result.error) {
        pagesWithNoLinks.push({
          url: result.url,
          title: result.title || 'Unknown Page',
          reason: `Error: ${result.error}`
        });
        return;
      }

      if (result.anchors.length === 0) {
        pagesWithNoLinks.push({
          url: result.url,
          title: result.title || 'Unknown Page',
          reason: 'No internal links found in content'
        });
        return;
      }

      successfulPages++;

      result.anchors.forEach(anchor => {
        totalLinks++;
        const key = `${anchor.text}|||${anchor.href}`.toLowerCase();

        if (anchorMap.has(key)) {
          const existing = anchorMap.get(key)!;
          existing.count++;
          if (!existing.pages.includes(result.url)) {
            existing.pages.push(result.url);
          }
        } else {
          anchorMap.set(key, {
            text: anchor.text,
            href: anchor.href,
            count: 1,
            pages: [result.url]
          });
        }
      });
    });

    // Convert to array and sort by count
    const anchors = Array.from(anchorMap.values())
      .sort((a, b) => b.count - a.count);

    // Generate insights
    const insights = {
      totalUniqueAnchors: anchors.length,
      totalInternalLinks: totalLinks,
      averageLinksPerPage: successfulPages > 0 ? Math.round(totalLinks / successfulPages) : 0,
      pagesCrawled: results.length,
      successfulPages,
      failedPages: results.length - successfulPages,
      mostFrequentAnchor: anchors[0] || null,
      singleUsageAnchors: anchors.filter(a => a.count === 1).length,
      topAnchors: anchors.slice(0, 20)
    };

    // Combine discovery progress steps with additional process steps
    const additionalProgressSteps = [
      { step: 'crawling', status: 'completed' as const, message: `Crawled ${results.length} pages successfully`, timestamp: Date.now() },
      { step: 'analysis_complete', status: 'completed' as const, message: `Analysis complete - ${anchors.length} unique anchor texts found`, timestamp: Date.now() }
    ];

    const allProgressSteps = [...discoveryProgressSteps, ...additionalProgressSteps];

    return NextResponse.json({
      success: true,
      data: {
        baseUrl,
        anchors,
        insights,
        crawledPages: results.map(r => ({
          url: r.url,
          title: r.title,
          linkCount: r.anchors.length,
          error: r.error || null
        })),
        pagesWithNoLinks
      },
      progressSteps: allProgressSteps,
      remainingRequests: dailyLimitResult.remainingRequests,
      resetTime: dailyLimitResult.resetTime
    });

  } catch (error: any) {
    console.error('Anchor analysis error:', error);

    let errorMessage = 'An unexpected error occurred during analysis. Please try again.';
    if (error.name === 'AbortError') {
      errorMessage = 'Website analysis timed out. The website may be too slow or blocking our requests.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}