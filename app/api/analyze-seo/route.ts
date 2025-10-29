import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, logSecurityEvent, getSecurityHeaders } from '@/app/lib/security';

// HTML parsing utilities
function parseHTML(html: string, url: string = '', response?: Response) {
  const lowercaseHtml = html.toLowerCase();
  
  const result = {
    // Meta tags
    title: extractMetaTag(html, 'title'),
    metaDescription: extractMetaTag(html, 'description'),
    metaKeywords: extractMetaTag(html, 'keywords'),
    metaAuthor: extractMetaTag(html, 'author'),
    metaRobots: extractMetaTag(html, 'robots'),
    metaRefresh: extractMetaTag(html, 'refresh'),
    
    // Open Graph
    ogTitle: extractMetaTag(html, 'og:title'),
    ogDescription: extractMetaTag(html, 'og:description'),
    ogImage: extractMetaTag(html, 'og:image'),
    ogUrl: extractMetaTag(html, 'og:url'),
    ogType: extractMetaTag(html, 'og:type'),
    ogSiteName: extractMetaTag(html, 'og:site_name'),
    ogLocale: extractMetaTag(html, 'og:locale'),
    
    // Twitter Cards
    twitterCard: extractMetaTag(html, 'twitter:card'),
    twitterTitle: extractMetaTag(html, 'twitter:title'),
    twitterDescription: extractMetaTag(html, 'twitter:description'),
    twitterImage: extractMetaTag(html, 'twitter:image'),
    twitterSite: extractMetaTag(html, 'twitter:site'),
    twitterCreator: extractMetaTag(html, 'twitter:creator'),
    
    // Additional meta tags
    themeColor: extractMetaTag(html, 'theme-color'),
    msapplicationTileColor: extractMetaTag(html, 'msapplication-TileColor'),
    appleMobileWebAppCapable: extractMetaTag(html, 'apple-mobile-web-app-capable'),
    
    // Headings
    headings: extractHeadings(html),
    
    // Links
    links: extractLinks(html),
    internalLinks: [] as any[],
    externalLinks: [] as any[],
    
    // Images
    images: extractImages(html),
    
    // Content analysis
    content: extractTextContent(html),
    textRatio: 0, // Will be calculated below
    wordCount: 0, // Will be calculated below
    characterCount: 0, // Will be calculated below
    sentenceCount: 0, // Will be calculated below
    paragraphCount: 0, // Will be calculated below
    
    // Technical elements
    canonical: extractCanonical(html),
    lang: extractLang(html),
    viewport: extractViewport(html),
    charset: extractCharset(html),
    doctype: extractDoctype(html),
    
    // Schema markup
    structuredData: extractStructuredData(html),
    
    // Performance indicators
    hasLazyLoading: html.includes('loading="lazy"'),
    hasWebP: lowercaseHtml.includes('.webp'),
    hasAvif: lowercaseHtml.includes('.avif'),
    hasGzip: response?.headers.get('content-encoding')?.includes('gzip') || false,
    hasMinifiedCSS: lowercaseHtml.includes('.min.css'),
    hasMinifiedJS: lowercaseHtml.includes('.min.js'),
    
    // Additional meta tags
    metaThemeColor: extractMetaTag(html, 'theme-color'),
    metaMsTileColor: extractMetaTag(html, 'msapplication-TileColor'),
    metaAppleMobileWebApp: extractMetaTag(html, 'apple-mobile-web-app-capable'),
    
    // Security and performance
    hasSecurityHeaders: false, // Will be determined from response headers
    hasCompressionHeaders: response?.headers.get('content-encoding') || null,
    hasCacheHeaders: response?.headers.get('cache-control') || null,
    hasContentSecurityPolicy: response?.headers.get('content-security-policy') || null,
    
    // Modern image formats and optimization
    imageFormats: extractImageFormats(html),
    largeImages: extractLargeImages(html),
    
    // Additional technical factors
    hasServiceWorker: html.includes('serviceWorker') || html.includes('sw.js'),
    hasManifest: html.includes('manifest.json'),
    hasAmp: html.includes('⚡') || html.includes('amp'),
    
    // Robots and crawling
    robotsTxtUrl: url ? new URL('/robots.txt', url).href : null,
    
    // Security features
    securityFeatures: extractSecurityFeatures(html),
    
    // Accessibility
    altTagsCount: (html.match(/alt=["'][^"']*["']/g) || []).length,
    totalImages: (html.match(/<img[^>]*>/gi) || []).length,
    ariaLabels: (html.match(/aria-label=["'][^"']*["']/gi) || []).length,
    
    // HTML structure
    hasH1: false,
    hasNavTag: html.includes('<nav'),
    hasMainTag: html.includes('<main'),
    hasFooterTag: html.includes('<footer'),
    hasHeaderTag: html.includes('<header'),
    hasAsideTag: html.includes('<aside'),
    hasArticleTag: html.includes('<article'),
    hasSectionTag: html.includes('<section'),
    
    // Forms
    forms: extractForms(html),
    
    // CSS & JS
    inlineCSS: (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).length,
    inlineJS: (html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).filter((script: string) => !script.includes('type="application/ld+json"')).length,
    externalCSS: (html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []).length,
    externalJS: (html.match(/<script[^>]*src=["'][^"']*["'][^>]*>/gi) || []).length,
    
    // SEO specific
    faviconLinks: extractFaviconLinks(html),
    hreflangTags: extractHreflangTags(html),
    
    // Social media
    facebookPixel: html.includes('facebook.net/tr') || html.includes('fbevents.js'),
    googleAnalytics: html.includes('google-analytics.com/ga.js') || html.includes('googletagmanager.com/gtag'),
    googleTagManager: html.includes('googletagmanager.com/gtm.js'),
    
    // Additional technical
    ampVersion: html.includes('⚡') || html.includes('amp'),
    
    // Page load metrics (would come from PageSpeed Insights)
    loadingTime: null,
    pageSize: html.length,
    
    // Security
    hasCSP: extractMetaTag(html, 'content-security-policy') !== '',
    hasXFrameOptions: false, // From response headers
    
    // Mobile optimization
    mobileOptimized: false, // Calculated based on multiple factors
    
    // Additional content metrics
    readabilityScore: 0,
    keywordDensity: {} as any,
    
    // Technical validation
    htmlValid: true, // Basic validation
    cssValid: true,
    jsErrors: 0,
  };
  
  // Calculate derived metrics
  const content = result.content;
  const words = content.split(/\s+/).filter((w: any) => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter((s: any) => s.trim().length > 10);
  const paragraphs = content.split(/\n\s*\n/).filter((p: any) => p.trim().length > 0);
  
  // Update calculated fields
  result.wordCount = words.length;
  result.characterCount = content.length;
  result.sentenceCount = sentences.length;
  result.paragraphCount = paragraphs.length;
  result.textRatio = html.length > 0 ? parseFloat((content.length / html.length * 100).toFixed(2)) : 0;
  result.hasH1 = result.headings.h1.length > 0;
  result.internalLinks = result.links.filter((link: any) => link.isInternal);
  result.externalLinks = result.links.filter((link: any) => link.isExternal);
  
  return result;
}

function extractMetaTag(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${name}["']`, 'i'),
  ];
  
  if (name === 'title') {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
}

function extractHeadings(html: string) {
  const headings: { [key: string]: string[] } = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
  
  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`<h${i}[^>]*>([^<]*)<\/h${i}>`, 'gi');
    let match;
    while ((match = regex.exec(html)) !== null) {
      headings[`h${i}`].push(match[1].trim());
    }
  }
  
  return headings;
}

function extractLinks(html: string) {
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1].trim();
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    
    links.push({
      url: href,
      text: text,
      isInternal: !href.startsWith('http') || href.includes(getHostname(html)),
      isExternal: href.startsWith('http') && !href.includes(getHostname(html)),
      hasNoFollow: match[0].includes('rel="nofollow"') || match[0].includes("rel='nofollow'"),
      hasTargetBlank: match[0].includes('target="_blank"') || match[0].includes("target='_blank'")
    });
  }
  
  return links;
}

function extractImages(html: string) {
  const imgRegex = /<img[^>]*src=["']([^"']*)["'][^>]*>/gi;
  const images = [];
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    const imgTag = match[0];
    const src = match[1].trim();
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    const titleMatch = imgTag.match(/title=["']([^"']*)["']/i);
    
    images.push({
      src: src,
      alt: altMatch ? altMatch[1] : '',
      title: titleMatch ? titleMatch[1] : '',
      hasAlt: !!altMatch,
      hasTitle: !!titleMatch,
      hasLazyLoading: imgTag.includes('loading="lazy"') || imgTag.includes("loading='lazy'")
    });
  }
  
  return images;
}

function extractTextContent(html: string): string {
  const cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const textOnly = cleanHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return textOnly;
}

function extractCanonical(html: string): string {
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return canonicalMatch ? canonicalMatch[1].trim() : '';
}

function extractLang(html: string): string {
  const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  return langMatch ? langMatch[1].trim() : '';
}

function extractViewport(html: string): string {
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
  return viewportMatch ? viewportMatch[1].trim() : '';
}

function extractCharset(html: string): string {
  const charsetMatch = html.match(/<meta[^>]*charset=["']?([^"'\s>]*)["']?/i) ||
                      html.match(/<meta[^>]*content=["'][^"']*charset=([^"'\s;]*)["']/i);
  return charsetMatch ? charsetMatch[1].trim().toLowerCase() : '';
}

function extractStructuredData(html: string) {
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const structuredData = [];
  let match;
  
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(match[1].trim());
      structuredData.push(jsonData);
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  return structuredData;
}

function extractDoctype(html: string): string {
  const doctypeMatch = html.match(/<!DOCTYPE[^>]*>/i);
  return doctypeMatch ? doctypeMatch[0] : '';
}

function extractForms(html: string) {
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/gi;
  const forms = [];
  let match;
  
  while ((match = formRegex.exec(html)) !== null) {
    const formTag = match[0];
    const method = (formTag.match(/method=["']([^"']*)["']/i) || ['', 'GET'])[1].toUpperCase();
    const action = (formTag.match(/action=["']([^"']*)["']/i) || ['', ''])[1];
    const hasSSL = action.startsWith('https://') || action.startsWith('/') || action === '';
    
    forms.push({
      method,
      action,
      hasSSL,
      inputCount: (match[1].match(/<input[^>]*>/gi) || []).length,
      hasLabels: (match[1].match(/<label[^>]*>/gi) || []).length > 0
    });
  }
  
  return forms;
}

function extractFaviconLinks(html: string) {
  const faviconRegex = /<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*>/gi;
  const favicons = [];
  let match;
  
  while ((match = faviconRegex.exec(html)) !== null) {
    const href = (match[0].match(/href=["']([^"']*)["']/i) || ['', ''])[1];
    const type = (match[0].match(/type=["']([^"']*)["']/i) || ['', ''])[1];
    const sizes = (match[0].match(/sizes=["']([^"']*)["']/i) || ['', ''])[1];
    
    favicons.push({ href, type, sizes });
  }
  
  return favicons;
}

function extractHreflangTags(html: string) {
  const hreflangRegex = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']*)["'][^>]*>/gi;
  const hreflangs = [];
  let match;
  
  while ((match = hreflangRegex.exec(html)) !== null) {
    const hreflang = match[1];
    const href = (match[0].match(/href=["']([^"']*)["']/i) || ['', ''])[1];
    
    hreflangs.push({ hreflang, href });
  }
  
  return hreflangs;
}

function getHostname(html: string): string {
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  if (canonicalMatch) {
    try {
      return new URL(canonicalMatch[1]).hostname;
    } catch (e) {
      // Invalid URL
    }
  }
  return '';
}

function extractImageFormats(html: string): string[] {
  const formats = [];
  if (html.includes('.webp')) formats.push('WebP');
  if (html.includes('.avif')) formats.push('AVIF');
  if (html.includes('.heic')) formats.push('HEIC');
  if (html.includes('.jpeg') || html.includes('.jpg')) formats.push('JPEG');
  if (html.includes('.png')) formats.push('PNG');
  return formats;
}

function extractLargeImages(html: string): any[] {
  const imageRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const images = [];
  let match;
  
  while ((match = imageRegex.exec(html)) !== null) {
    const src = match[1];
    // Estimate if image might be large based on URL patterns
    const isLikelyLarge = /\d{4,}x\d{4,}|large|hero|banner|full|orig/i.test(src) ||
                          !/thumb|small|icon|mini|tiny/i.test(src);
    
    if (isLikelyLarge) {
      images.push({ src, estimated: 'large' });
    }
  }
  
  return images;
}

function calculatePixelWidth(text: string, fontSize: number = 16): number {
  // Rough estimation: average character width is ~0.6 of font size
  return Math.round(text.length * fontSize * 0.6);
}

function extractSecurityFeatures(html: string): any {
  return {
    hasNonce: /nonce=["'][^"']+["']/i.test(html),
    hasIntegrity: /integrity=["'][^"']+["']/i.test(html),
    hasCrossOrigin: /crossorigin=/i.test(html),
    hasReferrerPolicy: /referrerpolicy=/i.test(html)
  };
}

// Analyze SEO factors
function analyzeSEO(parsedData: any, url: string, response?: Response) {
  const analysis = {
    url,
    overallScore: 0,
    factors: {
      contentQuality: analyzeContentQuality(parsedData),
      technicalSEO: analyzeTechnicalSEO(parsedData, url),
      onPageElements: analyzeOnPageElements(parsedData),
      userExperience: analyzeUserExperience(parsedData),
      contentStructure: analyzeContentStructure(parsedData),
      socialOptimization: analyzeSocialOptimization(parsedData),
      localSEO: analyzeLocalSEO(parsedData),
      advancedAnalytics: analyzeAdvancedAnalytics(parsedData),
      // New analysis categories
      securityAndTrust: analyzeSecurityAndTrust(parsedData, url, response),
      advancedPerformance: analyzeAdvancedPerformance(parsedData, url, response),
      advancedTechnical: analyzeAdvancedTechnical(parsedData, url),
      modernSEO: analyzeModernSEO(parsedData)
    }
  };

  // Calculate overall score
  const categoryScores = Object.values(analysis.factors).map(factor => factor.score);
  analysis.overallScore = Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length);

  return analysis;
}

function analyzeContentQuality(data: any) {
  const checks = [];
  let score = 0;
  const maxScore = 100;
  const content = data.content || '';
  const words = content.split(/\s+/).filter((w: string) => w.length > 0);
  const wordCount = words.length;
  const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
  const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);

  // Content length analysis
  if (wordCount >= 1000) {
    checks.push({ 
      factor: 'Content Length', 
      status: 'excellent', 
      description: `${wordCount} words - Excellent content depth`,
      recommendation: 'Perfect! Long-form content performs well in search results.',
      technicalDetails: 'Search engines favor comprehensive content that thoroughly covers topics.',
      impact: 'High - Longer content typically ranks better and provides more keyword opportunities.'
    });
    score += 20;
  } else if (wordCount >= 600) {
    checks.push({ 
      factor: 'Content Length', 
      status: 'good', 
      description: `${wordCount} words - Good content length`,
      recommendation: 'Good content length! Consider expanding to 1000+ words for even better SEO.',
      howToFix: [
        'Add more detailed explanations and examples',
        'Include FAQ sections',
        'Add related subtopics and supporting information',
        'Include case studies or real-world applications'
      ],
      impact: 'Medium - Good foundation, but more content could improve rankings.'
    });
    score += 15;
  } else if (wordCount >= 300) {
    checks.push({ 
      factor: 'Content Length', 
      status: 'fair', 
      description: `${wordCount} words - Minimum content length`,
      recommendation: 'Consider expanding content to at least 600-1000 words for better SEO.',
      howToFix: [
        'Expand on main topics with more detail',
        'Add supporting information and context',
        'Include relevant examples and use cases',
        'Consider adding related sections or subtopics'
      ],
      impact: 'Medium - Short content may struggle to rank for competitive keywords.'
    });
    score += 10;
  } else {
    checks.push({ 
      factor: 'Content Length', 
      status: 'critical', 
      description: `${wordCount} words - Content too short for effective SEO`,
      recommendation: 'Expand content significantly - aim for at least 300+ words.',
      howToFix: [
        'Add comprehensive information about your topic',
        'Include detailed explanations and background',
        'Add relevant examples, tips, and best practices',
        'Consider merging with related content or expanding scope'
      ],
      impact: 'High - Very short content rarely ranks well in search results.'
    });
    score += 3;
  }

  // Content depth analysis
  const avgWordsPerSentence = wordCount / (sentences.length || 1);
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) {
    checks.push({ factor: 'Sentence Length', status: 'good', description: `Average ${Math.round(avgWordsPerSentence)} words per sentence - Optimal readability` });
    score += 8;
  } else if (avgWordsPerSentence > 25) {
    checks.push({ 
      factor: 'Sentence Length', 
      status: 'warning', 
      description: `Average ${Math.round(avgWordsPerSentence)} words per sentence - Consider shorter sentences`,
      recommendation: 'Break down long sentences into shorter, more readable ones to improve user experience and SEO.',
      technicalDetails: 'Long sentences can hurt readability scores and make content difficult to scan. Search engines favor content that is easy to read and understand.',
      howToFix: [
        'Split complex sentences using periods instead of commas',
        'Use bullet points or numbered lists for complex information',
        'Remove unnecessary words and phrases',
        'Start new sentences instead of using conjunctions like "and", "but"',
        'Aim for 15-20 words per sentence on average',
        'Use tools like Hemingway Editor to check sentence complexity'
      ],
      impact: 'Medium - Better readability can improve user engagement metrics and indirectly boost SEO rankings.'
    });
    score += 4;
  } else {
    checks.push({ factor: 'Sentence Length', status: 'neutral', description: `Average ${Math.round(avgWordsPerSentence)} words per sentence` });
    score += 6;
  }

  // Paragraph structure
  const avgWordsPerParagraph = wordCount / (paragraphs.length || 1);
  if (paragraphs.length >= 3 && avgWordsPerParagraph <= 150) {
    checks.push({ factor: 'Paragraph Structure', status: 'good', description: `${paragraphs.length} paragraphs with ${Math.round(avgWordsPerParagraph)} avg words each` });
    score += 8;
  } else if (paragraphs.length < 2) {
    checks.push({ 
      factor: 'Paragraph Structure', 
      status: 'warning', 
      description: 'Content should be broken into multiple paragraphs',
      recommendation: 'Break your content into multiple paragraphs to improve readability and user experience.',
      technicalDetails: 'Wall-of-text content is hard to read and scan. Search engines favor well-structured content that users can easily consume.',
      howToFix: [
        'Break content into logical paragraphs of 2-4 sentences each',
        'Start new paragraphs for new ideas or topics',
        'Use transitional phrases between paragraphs',
        'Keep paragraphs under 150 words for web content',
        'Add white space between paragraphs for visual breathing room',
        'Use subheadings (H2, H3) to separate major sections'
      ],
      impact: 'Medium - Better content structure improves user engagement and can reduce bounce rates.'
    });
    score += 3;
  } else {
    checks.push({ factor: 'Paragraph Structure', status: 'fair', description: `${paragraphs.length} paragraphs - could be improved` });
    score += 5;
  }

  // Enhanced keyword density analysis with 1, 2, and 3-word phrases
  const singleWordFreq: { [key: string]: number } = {};
  const bigramFreq: { [key: string]: number } = {};
  const trigramFreq: { [key: string]: number } = {};
  
  // Clean words for analysis
  const cleanWords = words.map(word => word.toLowerCase().replace(/[^a-z0-9\s]/g, '')).filter(word => word.length > 2);
  
  // Single word analysis
  cleanWords.forEach((word: string) => {
    if (word.length > 3) {
      singleWordFreq[word] = (singleWordFreq[word] || 0) + 1;
    }
  });
  
  // Bigram (2-word phrases) analysis
  for (let i = 0; i < cleanWords.length - 1; i++) {
    const bigram = `${cleanWords[i]} ${cleanWords[i + 1]}`;
    if (cleanWords[i].length > 2 && cleanWords[i + 1].length > 2) {
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
  }
  
  // Trigram (3-word phrases) analysis
  for (let i = 0; i < cleanWords.length - 2; i++) {
    const trigram = `${cleanWords[i]} ${cleanWords[i + 1]} ${cleanWords[i + 2]}`;
    if (cleanWords[i].length > 2 && cleanWords[i + 1].length > 2 && cleanWords[i + 2].length > 2) {
      trigramFreq[trigram] = (trigramFreq[trigram] || 0) + 1;
    }
  }
  
  const uniqueWords = Object.keys(singleWordFreq);
  
  // Get top keywords from each category
  const topSingleWords = Object.entries(singleWordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ 
      word, 
      count, 
      density: ((count as number / wordCount) * 100).toFixed(1),
      type: '1-word'
    }));
    
  const topBigrams = Object.entries(bigramFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word, count]) => ({ 
      word, 
      count, 
      density: ((count as number / wordCount) * 100).toFixed(1),
      type: '2-word'
    }));
    
  const topTrigrams = Object.entries(trigramFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([word, count]) => ({ 
      word, 
      count, 
      density: ((count as number / wordCount) * 100).toFixed(1),
      type: '3-word'
    }));
    
  // Combine all keywords for analysis
  const allKeywords = [...topSingleWords, ...topBigrams, ...topTrigrams];
  const topWords = allKeywords.sort((a, b) => b.count - a.count).slice(0, 10);
  
  const hasGoodKeywordDensity = topWords.some(item => 
    parseFloat(item.density) >= 0.5 && parseFloat(item.density) <= 3.0
  );
  
  // Helper function to find keyword positions
  const getKeywordPositions = (text: string, keyword: string): string[] => {
    const positions = [];
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    // Check if keyword appears in title
    if (data.title && data.title.toLowerCase().includes(lowerKeyword)) {
      positions.push('Title Tag');
    }
    
    // Check meta description
    if (data.metaDescription && data.metaDescription.toLowerCase().includes(lowerKeyword)) {
      positions.push('Meta Desc');
    }
    
    // Check headings with proper array handling
    if (data.headings?.h1 && Array.isArray(data.headings.h1) && 
        data.headings.h1.some((h1: string) => h1.toLowerCase().includes(lowerKeyword))) {
      positions.push('H1 Tag');
    }
    
    // Check H2-H6 headings
    const hasHeadingMatch = ['h2', 'h3', 'h4', 'h5', 'h6'].some(level => 
      data.headings?.[level] && Array.isArray(data.headings[level]) &&
      data.headings[level].some((heading: string) => heading.toLowerCase().includes(lowerKeyword))
    );
    if (hasHeadingMatch) {
      positions.push('H2-H6 Tags');
    }
    
    // Check images alt text
    if (data.images && Array.isArray(data.images) && 
        data.images.some((img: any) => img.alt && img.alt.toLowerCase().includes(lowerKeyword))) {
      positions.push('Image Alt');
    }
    
    // Check link text
    if (data.links && Array.isArray(data.links) && 
        data.links.some((link: any) => link.text && link.text.toLowerCase().includes(lowerKeyword))) {
      positions.push('Link Text');
    }
    
    // Always check body text last
    if (lowerText.includes(lowerKeyword)) {
      if (positions.length === 0) positions.push('Body Text');
    }
    
    return positions.length > 0 ? positions : ['Body Text'];
  };

  // Enhanced keyword analysis with detailed breakdown including multi-word phrases
  const keywordAnalysis = {
    topKeywords: topWords.slice(0, 10).map((item, index) => {
      const positions = getKeywordPositions(content, item.word);
      // Calculate real visibility based on keyword frequency, density, and strategic positioning
      let visibility = 0;
      
      // Base visibility from frequency (0-40 points)
      visibility += Math.min(40, (item.count as number) * 4);
      
      // Bonus for optimal density range (0-20 points)
      const densityValue = parseFloat(item.density);
      if (densityValue >= 0.5 && densityValue <= 3.0) {
        visibility += 20;
      } else if (densityValue >= 0.3 && densityValue <= 5.0) {
        visibility += 10;
      }
      
      // Bonus for strategic positioning (0-40 points)
      if (positions.includes('Title Tag')) visibility += 15;
      if (positions.includes('Meta Desc')) visibility += 10;
      if (positions.includes('H1 Tag')) visibility += 10;
      if (positions.includes('H2-H6 Tags')) visibility += 5;
      
      return {
        rank: index + 1,
        keyword: item.word,
        frequency: item.count,
        density: item.density,
        type: item.type, // '1-word', '2-word', or '3-word'
        visibility: Math.min(100, Math.max(5, Math.round(visibility))), // Real visibility calculation
        positions: positions
      };
    }),
    singleWords: topSingleWords.length,
    bigrams: topBigrams.length,
    trigrams: topTrigrams.length,
    totalUniqueWords: uniqueWords.length,
    keywordDiversityScore: Math.min(100, (uniqueWords.length / wordCount) * 100),
    overOptimizedKeywords: topWords.filter(item => parseFloat(item.density) > 5.0),
    underOptimizedKeywords: topWords.filter(item => parseFloat(item.density) < 0.5 && (item.count as number) >= 3)
  };

  if (hasGoodKeywordDensity) {
    checks.push({ 
      factor: 'Keyword Optimization', 
      status: 'good', 
      description: 'Good keyword density distribution detected',
      recommendation: 'Excellent keyword distribution! Your content has natural keyword usage.',
      technicalDetails: 'Optimal keyword density (0.5-3%) helps search engines understand topic relevance without triggering over-optimization penalties.',
      keywordData: keywordAnalysis,
      impact: 'Medium - Proper keyword density supports topical relevance without over-optimization.'
    });
    score += 8;
  } else {
    checks.push({ 
      factor: 'Keyword Optimization', 
      status: 'warning', 
      description: 'Keyword density could be optimized',
      recommendation: 'Optimize keyword usage for better topical relevance (0.5-3% density recommended).',
      technicalDetails: 'Poor keyword distribution can limit search visibility. Focus on natural keyword integration throughout your content.',
      keywordData: keywordAnalysis,
      howToFix: [
        'Include your target keywords naturally throughout the content',
        'Use variations and synonyms of your main keywords',
        'Ensure keywords appear in headings, first paragraph, and conclusion',
        'Add semantic keywords related to your main topic',
        'Focus on user intent rather than exact keyword matching',
        'Avoid keyword stuffing - maintain natural readability'
      ],
      impact: 'Medium - Poor keyword optimization can limit search visibility and rankings.'
    });
    score += 4;
  }

  // Content freshness indicators
  const hasDateIndicators = /\b(20[0-2][0-9]|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(content);
  if (hasDateIndicators) {
    checks.push({ factor: 'Content Freshness', status: 'good', description: 'Date indicators found - suggests fresh content' });
    score += 6;
  } else {
    checks.push({ factor: 'Content Freshness', status: 'neutral', description: 'Consider adding date indicators for freshness' });
    score += 3;
  }

  // Duplicate content check (enhanced)
  const duplicates = sentences.filter((sentence: string, index: number) => 
    sentences.findIndex((s: string) => s.trim() === sentence.trim()) !== index
  ).length;
  
  if (duplicates === 0) {
    checks.push({ factor: 'Content Uniqueness', status: 'excellent', description: 'No duplicate content detected' });
    score += 10;
  } else if (duplicates <= 2) {
    checks.push({ factor: 'Content Uniqueness', status: 'good', description: `${duplicates} minor duplications found` });
    score += 7;
  } else {
    checks.push({ factor: 'Content Uniqueness', status: 'warning', description: `${duplicates} duplicate sentences found - review content` });
    score += 3;
  }

  // Content engagement factors
  const hasQuestions = /\?/g.test(content);
  const hasNumbers = /\b\d+\b/g.test(content);
  const hasActionWords = /(learn|discover|find|get|start|try|use|create|build|improve|optimize)/gi.test(content);
  
  let engagementScore = 0;
  if (hasQuestions) {
    engagementScore += 2;
    checks.push({ factor: 'Question Usage', status: 'good', description: 'Questions found - good for engagement' });
  }
  if (hasNumbers) {
    engagementScore += 2;
    checks.push({ factor: 'Number Usage', status: 'good', description: 'Numbers found - increases credibility' });
  }
  if (hasActionWords) {
    engagementScore += 2;
    checks.push({ factor: 'Action Words', status: 'good', description: 'Action words found - encourages engagement' });
  }
  
  if (engagementScore === 0) {
    checks.push({ factor: 'Content Engagement', status: 'warning', description: 'Consider adding questions, numbers, or action words' });
  }
  
  score += engagementScore;

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore,
    metrics: {
      wordCount,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence),
      avgWordsPerParagraph: Math.round(avgWordsPerParagraph),
      topKeywords: topWords
    }
  };
}

function analyzeTechnicalSEO(data: any, url: string) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // HTTPS Security
  if (url.startsWith('https://')) {
    checks.push({ factor: 'HTTPS Protocol', status: 'excellent', description: 'Site uses secure HTTPS encryption' });
    score += 12;
  } else {
    checks.push({ 
      factor: 'HTTPS Protocol', 
      status: 'critical', 
      description: 'Site must use HTTPS encryption - major ranking factor',
      recommendation: 'Immediately migrate your website to HTTPS to secure user data and maintain SEO rankings.',
      technicalDetails: 'HTTPS is a confirmed Google ranking factor and required for user trust. Non-HTTPS sites show "Not Secure" warnings in browsers.',
      howToFix: [
        'Purchase and install an SSL certificate from your hosting provider or certificate authority',
        'Update all internal links to use https:// instead of http://',
        'Set up 301 redirects from HTTP to HTTPS versions of all pages',
        'Update your sitemap.xml to use HTTPS URLs',
        'Update Google Search Console and Google Analytics settings',
        'Check for mixed content issues (HTTP resources on HTTPS pages)',
        'Test the certificate installation with SSL testing tools'
      ],
      impact: 'Critical - Sites without HTTPS can lose 50-90% of their search rankings and face browser security warnings.'
    });
  }

  // URL Structure Analysis
  try {
    const urlObj = new URL(url);
    const pathLength = urlObj.pathname.length;
    const hasParams = urlObj.search.length > 0;
    const hasFragment = urlObj.hash.length > 0;
    
    if (pathLength <= 75 && !hasParams) {
      checks.push({ factor: 'URL Structure', status: 'good', description: 'Clean, short URL structure' });
      score += 6;
    } else if (pathLength > 100) {
      checks.push({ factor: 'URL Structure', status: 'warning', description: 'URL is too long - consider shortening' });
      score += 3;
    } else {
      checks.push({ factor: 'URL Structure', status: 'fair', description: 'URL structure could be optimized' });
      score += 4;
    }
  } catch (e) {
    checks.push({ factor: 'URL Structure', status: 'error', description: 'Invalid URL format' });
  }

  // DOCTYPE Declaration
  const doctype = data.doctype.toLowerCase();
  if (doctype.includes('html')) {
    checks.push({ factor: 'DOCTYPE Declaration', status: 'good', description: 'HTML5 DOCTYPE declared' });
    score += 4;
  } else {
    checks.push({ factor: 'DOCTYPE Declaration', status: 'warning', description: 'Missing or invalid DOCTYPE declaration' });
    score += 1;
  }

  // Character Encoding
  if (data.charset === 'utf-8') {
    checks.push({ factor: 'Character Encoding', status: 'excellent', description: 'UTF-8 encoding properly declared' });
    score += 4;
  } else if (data.charset) {
    checks.push({ factor: 'Character Encoding', status: 'good', description: `Character encoding: ${data.charset.toUpperCase()}` });
    score += 3;
  } else {
    checks.push({ 
      factor: 'Character Encoding', 
      status: 'critical', 
      description: 'Missing character encoding declaration',
      recommendation: 'Add a character encoding declaration to prevent text display issues and improve SEO.',
      technicalDetails: 'Character encoding tells browsers how to interpret your text. Missing encoding can cause display issues with special characters and may affect search engine crawling.',
      howToFix: [
        'Add <meta charset="UTF-8"> to the <head> section of your HTML',
        'Place the charset declaration within the first 1024 bytes of the HTML',
        'Use UTF-8 encoding as it supports all languages and special characters',
        'Ensure your server also sends the correct Content-Type header',
        'Save your HTML files with UTF-8 encoding'
      ],
      impact: 'High - Missing character encoding can cause display issues and may affect search engine indexing.'
    });
    score += 1;
  }

  // Language Declaration
  if (data.lang) {
    checks.push({ factor: 'Language Declaration', status: 'good', description: `Page language: ${data.lang}` });
    score += 4;
  } else {
    checks.push({ 
      factor: 'Language Declaration', 
      status: 'warning', 
      description: 'Missing lang attribute on HTML element',
      recommendation: 'Add a language attribute to help search engines and screen readers understand your content language.',
      technicalDetails: 'The lang attribute tells browsers and assistive technologies what language the page content is in, improving accessibility and potentially helping with international SEO.',
      howToFix: [
        'Add lang="en" to your <html> tag for English content',
        'Use appropriate language codes: "es" for Spanish, "fr" for French, etc.',
        'For multilingual content, use lang attributes on specific elements',
        'Use proper language codes from ISO 639-1 standard',
        'Consider adding xml:lang="en" for XHTML compatibility'
      ],
      impact: 'Low - Helps with accessibility compliance and may assist with international SEO targeting.'
    });
    score += 2;
  }

  // Mobile Optimization
  if (data.viewport) {
    const viewportContent = data.viewport.toLowerCase();
    if (viewportContent.includes('width=device-width')) {
      checks.push({ factor: 'Mobile Viewport', status: 'excellent', description: 'Proper responsive viewport meta tag' });
      score += 8;
    } else {
      checks.push({ factor: 'Mobile Viewport', status: 'warning', description: 'Viewport meta tag could be optimized' });
      score += 5;
    }
  } else {
    checks.push({ 
      factor: 'Mobile Viewport', 
      status: 'critical', 
      description: 'Missing viewport meta tag - critical for mobile',
      recommendation: 'Add a viewport meta tag immediately to make your website mobile-friendly and prevent SEO penalties.',
      technicalDetails: 'The viewport meta tag controls how your website appears on mobile devices. Without it, your site will not be considered mobile-friendly by Google.',
      howToFix: [
        'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> to your HTML head',
        'Use width=device-width to match the screen width',
        'Set initial-scale=1.0 for proper zoom level',
        'Avoid using maximum-scale or user-scalable=no for accessibility',
        'Test your site on mobile devices after implementation',
        'Use Google Mobile-Friendly Test to verify your site'
      ],
      impact: 'Critical - Sites without proper viewport tags can lose mobile search rankings and fail Google mobile-first indexing.'
    });
    score += 1;
  }

  // Canonical URL Implementation
  if (data.canonical) {
    try {
      new URL(data.canonical);
      checks.push({ 
        factor: 'Canonical URL', 
        status: 'excellent', 
        description: 'Canonical URL properly set',
        recommendation: 'Excellent! Your canonical URL is properly configured.',
        technicalDetails: 'Canonical URLs help search engines understand which version of a page to index and rank.',
        impact: 'Positive - Proper canonical URLs prevent duplicate content issues and consolidate ranking signals.'
      });
      score += 8;
    } catch (e) {
      checks.push({ 
        factor: 'Canonical URL', 
        status: 'warning', 
        description: 'Canonical URL format is invalid',
        recommendation: 'Fix the canonical URL format to ensure proper indexing and avoid SEO issues.',
        technicalDetails: 'Invalid canonical URLs can confuse search engines and may cause indexing problems.',
        howToFix: [
          'Check the canonical URL syntax: <link rel="canonical" href="URL">',
          'Ensure the URL is properly formatted and accessible',
          'Use absolute URLs with full domain (https://example.com/page)',
          'Remove any syntax errors or invalid characters',
          'Test the canonical URL in browser to ensure it loads correctly'
        ],
        impact: 'Medium - Invalid canonical URLs can cause indexing confusion and SEO issues.'
      });
      score += 4;
    }
  } else {
    checks.push({ 
      factor: 'Canonical URL', 
      status: 'warning', 
      description: 'Missing canonical URL - recommended for SEO',
      recommendation: 'Add a canonical URL to prevent duplicate content issues and help search engines understand your preferred URL.',
      technicalDetails: 'Canonical URLs tell search engines which version of a page is the authoritative one when multiple URLs contain identical or similar content.',
      howToFix: [
        'Add <link rel="canonical" href="https://yoursite.com/page-url"> to the HTML head section',
        'Use the full absolute URL including protocol (https://) and domain',
        'Ensure the canonical URL points to the preferred version of the page',
        'For dynamic pages, generate canonical URLs programmatically',
        'Test canonical URLs with Google Search Console URL Inspection tool'
      ],
      impact: 'Medium - Canonical URLs help prevent duplicate content penalties and consolidate link equity.'
    });
    score += 3;
  }

  // Structured Data Analysis
  if (data.structuredData.length > 0) {
    const schemaTypes = data.structuredData.map((schema: any) => schema['@type'] || schema.type || 'Unknown').join(', ');
    checks.push({ factor: 'Structured Data', status: 'excellent', description: `${data.structuredData.length} schema(s) found: ${schemaTypes}` });
    score += 10;
  } else {
    checks.push({ 
      factor: 'Structured Data', 
      status: 'warning', 
      description: 'No structured data found - adds rich snippet potential',
      recommendation: 'Add structured data (Schema.org markup) to help search engines understand your content better and enable rich snippets.',
      technicalDetails: 'Structured data provides context about your content, enabling features like review stars, prices, event dates, and other rich snippets in search results.',
      howToFix: [
        'Choose relevant Schema.org types for your content (Article, Product, LocalBusiness, etc.)',
        'Add JSON-LD structured data in <script type="application/ld+json"> tags',
        'Include key properties like name, description, image, datePublished',
        'For businesses: add address, phone, hours, and ratings markup',
        'For articles: include author, publisher, headline, and dateModified',
        'Test your markup with Google\'s Rich Results Test tool',
        'Validate structured data with Schema.org validator'
      ],
      impact: 'Medium - Structured data can improve click-through rates by 10-25% through rich snippets and enhanced search appearances.'
    });
    score += 3;
  }

  // Favicon Implementation
  if (data.faviconLinks.length > 0) {
    checks.push({ factor: 'Favicon', status: 'good', description: `${data.faviconLinks.length} favicon(s) declared` });
    score += 4;
  } else {
    checks.push({ 
      factor: 'Favicon', 
      status: 'warning', 
      description: 'No favicon found - important for brand recognition',
      recommendation: 'Add a favicon to improve brand recognition and user experience in browser tabs and bookmarks.',
      technicalDetails: 'Favicons are small icons that appear in browser tabs, bookmarks, and address bars, helping users identify your site.',
      howToFix: [
        'Create a 32x32 pixel PNG or ICO file with your brand logo or symbol',
        'Add <link rel="icon" type="image/x-icon" href="/favicon.ico"> to your HTML head',
        'Include multiple sizes: 16x16, 32x32, 48x48, and 192x192 pixels',
        'Add <link rel="apple-touch-icon" href="/apple-touch-icon.png"> for iOS devices',
        'Place favicon.ico file in your website root directory',
        'Test favicon display in different browsers and devices'
      ],
      impact: 'Low - Favicons improve brand recognition and user experience but have minimal direct SEO impact.'
    });
    score += 2;
  }

  // Hreflang Implementation
  if (data.hreflangTags.length > 0) {
    checks.push({ factor: 'Hreflang Tags', status: 'good', description: `${data.hreflangTags.length} hreflang tag(s) for internationalization` });
    score += 6;
  } else {
    checks.push({ factor: 'Hreflang Tags', status: 'neutral', description: 'No hreflang tags - not required for single-language sites' });
    score += 3;
  }

  // Meta Robots Analysis
  if (data.metaRobots) {
    const robotsDirectives = data.metaRobots.toLowerCase();
    if (robotsDirectives.includes('noindex') || robotsDirectives.includes('nofollow')) {
      checks.push({ factor: 'Meta Robots', status: 'warning', description: `Blocking directives found: ${data.metaRobots}` });
      score += 3;
    } else {
      checks.push({ factor: 'Meta Robots', status: 'good', description: `Meta robots: ${data.metaRobots}` });
      score += 6;
    }
  } else {
    checks.push({ factor: 'Meta Robots', status: 'neutral', description: 'No meta robots tag - defaults to index,follow' });
    score += 4;
  }

  // HTML5 Semantic Elements
  const semanticElements = [
    { tag: 'header', present: data.hasHeaderTag, name: 'Header' },
    { tag: 'nav', present: data.hasNavTag, name: 'Navigation' },
    { tag: 'main', present: data.hasMainTag, name: 'Main' },
    { tag: 'article', present: data.hasArticleTag, name: 'Article' },
    { tag: 'section', present: data.hasSectionTag, name: 'Section' },
    { tag: 'aside', present: data.hasAsideTag, name: 'Aside' },
    { tag: 'footer', present: data.hasFooterTag, name: 'Footer' }
  ];
  
  const presentElements = semanticElements.filter((el: any) => el.present);
  if (presentElements.length >= 4) {
    checks.push({ factor: 'HTML5 Semantics', status: 'excellent', description: `${presentElements.length}/7 semantic elements used` });
    score += 8;
  } else if (presentElements.length >= 2) {
    checks.push({ factor: 'HTML5 Semantics', status: 'good', description: `${presentElements.length}/7 semantic elements used` });
    score += 5;
  } else {
    checks.push({ 
      factor: 'HTML5 Semantics', 
      status: 'warning', 
      description: 'Consider using more HTML5 semantic elements',
      recommendation: 'Use HTML5 semantic elements to improve content structure and search engine understanding.',
      technicalDetails: 'Semantic HTML helps search engines better understand your content hierarchy and meaning, potentially improving rankings and accessibility.',
      howToFix: [
        'Replace generic <div> elements with semantic alternatives where appropriate',
        'Use <header> for page/section headers and navigation areas',
        'Use <nav> for navigation menus and links',
        'Use <main> for the primary content area of your page',
        'Use <article> for standalone content like blog posts or news articles',
        'Use <section> for distinct sections within articles or pages',
        'Use <aside> for sidebars, related content, or supplementary information',
        'Use <footer> for page/section footers with copyright and contact info'
      ],
      impact: 'Medium - Semantic HTML can improve SEO rankings by 3-8% and significantly enhance accessibility.'
    });
    score += 2;
  }

  // File Size and Code Analysis
  const htmlContent = data.html || '';
  const htmlSize = htmlContent.length;
  const fileSizeKB = (htmlSize / 1024).toFixed(2);
  
  if (htmlSize > 100000) { // >100KB
    checks.push({ 
      factor: 'HTML File Size', 
      status: 'warning', 
      description: `${fileSizeKB}KB - File size is large, may impact loading speed`,
      recommendation: 'Reduce HTML file size to improve page loading performance.',
      technicalDetails: 'Large HTML files can slow down initial page rendering and negatively impact Core Web Vitals.',
      howToFix: [
        'Remove unnecessary HTML comments and whitespace',
        'Minimize inline CSS and JavaScript',
        'Optimize and compress embedded resources',
        'Consider lazy loading non-critical content',
        'Use external files for large CSS/JS blocks',
        'Implement HTML minification in your build process'
      ],
      impact: 'Medium - Large HTML files can significantly impact page speed and user experience.'
    });
    score += 3;
  } else {
    checks.push({ factor: 'HTML File Size', status: 'good', description: `${fileSizeKB}KB - Optimal file size` });
    score += 5;
  }

  // Code to Text Ratio
  const textContent = data.content || '';
  const textLength = textContent.length;
  const codeToTextRatio = textLength > 0 ? ((textLength / htmlSize) * 100).toFixed(1) : '0';
  
  if (parseFloat(codeToTextRatio) < 15) {
    checks.push({ 
      factor: 'Code/Text Ratio', 
      status: 'warning', 
      description: `${codeToTextRatio}% - Text ratio is low, too much code relative to content`,
      recommendation: 'Improve the code-to-text ratio by adding more valuable content or reducing unnecessary code.',
      technicalDetails: 'Low text-to-code ratios can indicate thin content or excessive markup, which may negatively impact SEO.',
      howToFix: [
        'Add more valuable, unique content to your pages',
        'Remove unnecessary HTML elements and attributes',
        'Move inline CSS and JavaScript to external files',
        'Clean up unused or redundant code',
        'Optimize HTML structure for better semantic meaning',
        'Aim for a text ratio above 25% for better SEO performance'
      ],
      impact: 'Medium - Poor code-to-text ratios can indicate content quality issues to search engines.'
    });
    score += 2;
  } else {
    checks.push({ factor: 'Code/Text Ratio', status: 'good', description: `${codeToTextRatio}% - Good balance of content to code` });
    score += 4;
  }

  // HTML Structure Analysis - Real validation based on actual HTML content
  let htmlValidationScore = 0;
  const htmlStructureContent = data.content || '';
  
  // Check for basic HTML structure requirements
  const hasDoctype = !!data.doctype;
  const hasHtmlTag = /<html[^>]*>/i.test(htmlStructureContent);
  const hasHeadTag = /<head[^>]*>/i.test(htmlStructureContent);
  const hasBodyTag = /<body[^>]*>/i.test(htmlStructureContent);
  const hasTitleTag = !!data.title;
  
  // Count potential structural issues
  let structuralIssues = 0;
  if (!hasDoctype) structuralIssues++;
  if (!hasHtmlTag) structuralIssues++;
  if (!hasHeadTag) structuralIssues++;
  if (!hasBodyTag) structuralIssues++;
  if (!hasTitleTag) structuralIssues++;
  
  // Check for common HTML issues
  const unclosedTags = (htmlStructureContent.match(/<(img|br|hr|input|meta|link)[^>]*(?!\/>)>/gi) || []).length;
  const missingAltTags = (htmlStructureContent.match(/<img[^>]*(?!alt=)[^>]*>/gi) || []).length;
  
  const totalIssues = structuralIssues + Math.min(5, unclosedTags) + Math.min(3, missingAltTags);
  
  if (totalIssues === 0) {
    checks.push({ 
      factor: 'HTML Structure', 
      status: 'excellent', 
      description: 'Clean HTML structure with proper tags and formatting' 
    });
    score += 8;
  } else if (totalIssues <= 2) {
    checks.push({ 
      factor: 'HTML Structure', 
      status: 'good', 
      description: `Minor structural issues detected (${totalIssues} items to review)`,
      recommendation: 'Review and fix minor HTML structural issues for better search engine parsing.',
      howToFix: [
        'Ensure all required HTML tags are present (DOCTYPE, html, head, body)',
        'Close all self-closing tags properly (img, br, hr, etc.)',
        'Add alt attributes to all images',
        'Validate HTML structure using browser developer tools'
      ]
    });
    score += 6;
  } else {
    checks.push({ 
      factor: 'HTML Structure', 
      status: 'warning', 
      description: `${totalIssues} structural issues need attention`,
      recommendation: 'Fix HTML structural issues to improve search engine parsing and user experience.',
      technicalDetails: 'HTML structural issues can affect how search engines parse and understand your content.',
      howToFix: [
        'Add missing required HTML tags (DOCTYPE, html, head, body, title)',
        'Properly close all self-closing tags',
        'Add alt attributes to images for accessibility',
        'Fix any unclosed or malformed HTML elements',
        'Use HTML validation tools for comprehensive checking'
      ],
      impact: 'Medium - Clean HTML structure helps search engines parse content more effectively.'
    });
    score += 3;
  }

  // Performance Indicators
  let performanceScore = 0;
  if (data.hasMinifiedCSS) {
    checks.push({ factor: 'CSS Minification', status: 'good', description: 'Minified CSS detected' });
    performanceScore += 2;
  }
  if (data.hasMinifiedJS) {
    checks.push({ factor: 'JS Minification', status: 'good', description: 'Minified JavaScript detected' });
    performanceScore += 2;
  }
  if (data.hasLazyLoading) {
    checks.push({ factor: 'Image Lazy Loading', status: 'good', description: 'Lazy loading implemented' });
    performanceScore += 3;
  }
  if (data.hasWebP || data.hasAvif) {
    checks.push({ factor: 'Modern Image Formats', status: 'good', description: 'Modern image formats detected' });
    performanceScore += 3;
  }
  
  score += performanceScore;

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeOnPageElements(data: any) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // Title Tag Analysis (Enhanced)
  if (data.title) {
    const titleLength = data.title.length;
    const titleWords = data.title.split(/\s+/).length;
    
    // Length check
    if (titleLength >= 50 && titleLength <= 60) {
      checks.push({ factor: 'Title Tag Length', status: 'excellent', description: `${titleLength} characters - Perfect length` });
      score += 12;
    } else if (titleLength >= 30 && titleLength <= 65) {
      checks.push({ factor: 'Title Tag Length', status: 'good', description: `${titleLength} characters - Good length` });
      score += 9;
    } else if (titleLength > 65) {
      checks.push({ 
        factor: 'Title Tag Length', 
        status: 'warning', 
        description: `${titleLength} characters - Too long, may be truncated`,
        recommendation: 'Shorten your title tag to 50-60 characters to ensure it displays fully in search results.',
        technicalDetails: 'Google typically displays the first 50-60 characters of a title tag. Longer titles get truncated with "..." which can reduce click-through rates.',
        howToFix: [
          'Trim title to 50-60 characters while keeping the most important keywords',
          'Place primary keywords at the beginning of the title',
          'Remove unnecessary words like "the", "and", "or" if needed',
          'Use power words efficiently: "Best", "Ultimate", "Complete"',
          'Test different title variations and monitor click-through rates',
          'Use Google Search Console to see how titles appear in search results'
        ],
        impact: 'Medium - Truncated titles can reduce click-through rates by 10-20% and may dilute keyword relevance signals.'
      });
      score += 5;
    } else {
      checks.push({ 
        factor: 'Title Tag Length', 
        status: 'critical', 
        description: `${titleLength} characters - Too short`,
        recommendation: 'Expand your title tag to 50-60 characters to fully utilize the available space and improve keyword coverage.',
        technicalDetails: 'Short titles miss opportunities to include relevant keywords and compelling copy that can improve search rankings and click-through rates.',
        howToFix: [
          'Add descriptive keywords related to your page content',
          'Include your brand name at the end if space allows',
          'Add compelling adjectives: "Professional", "Expert", "Proven"',
          'Include year for time-sensitive content: "2024 Guide"',
          'Add location for local businesses: "in [City Name]"',
          'Include benefit-focused words: "Save Time", "Increase Sales"'
        ],
        impact: 'High - Short titles underutilize SEO potential and may result in 15-30% lower click-through rates compared to optimized titles.'
      });
      score += 2;
    }
    
    // Title uniqueness and optimization
    const hasNumbers = /\d/.test(data.title);
    const hasSpecialChars = /[|\-:()\[\]{}]/.test(data.title);
    const hasPowerWords = /(best|top|ultimate|complete|guide|free|new|easy|quick|proven|essential|advanced)/i.test(data.title);
    
    if (hasPowerWords) {
      checks.push({ factor: 'Title Power Words', status: 'good', description: 'Power words detected in title' });
      score += 3;
    }
    if (hasNumbers) {
      checks.push({ factor: 'Title Numbers', status: 'good', description: 'Numbers in title increase CTR' });
      score += 3;
    }
    if (hasSpecialChars) {
      checks.push({ factor: 'Title Formatting', status: 'good', description: 'Title uses separators for better readability' });
      score += 2;
    }
    
  } else {
    checks.push({ 
      factor: 'Title Tag', 
      status: 'critical', 
      description: 'Missing title tag - critical SEO element',
      recommendation: 'Add a title tag immediately - it\'s the most important on-page SEO element.',
      technicalDetails: 'Title tags are the clickable headlines in search results and the primary way search engines understand your page topic. Missing title tags severely harm SEO performance.',
      howToFix: [
        'Add <title>Your Page Title</title> between the <head> tags',
        'Make title 50-60 characters long for optimal display',
        'Include your primary target keyword near the beginning',
        'Write compelling copy that encourages clicks',
        'Make each page title unique across your website',
        'Include your brand name if space allows'
      ],
      impact: 'Critical - Missing title tags can reduce organic traffic by 50-80% and prevent proper indexing.'
    });
  }

  // Meta Description Analysis (Enhanced)
  if (data.metaDescription) {
    const descLength = data.metaDescription.length;
    const descWords = data.metaDescription.split(/\s+/).length;
    
    if (descLength >= 150 && descLength <= 160) {
      checks.push({ factor: 'Meta Description Length', status: 'excellent', description: `${descLength} characters - Perfect length` });
      score += 8;
    } else if (descLength >= 120 && descLength <= 170) {
      checks.push({ factor: 'Meta Description Length', status: 'good', description: `${descLength} characters - Good length` });
      score += 6;
    } else if (descLength < 120) {
      checks.push({ factor: 'Meta Description Length', status: 'warning', description: `${descLength} characters - Too short, not utilizing full space` });
      score += 3;
    } else {
      checks.push({ factor: 'Meta Description Length', status: 'warning', description: `${descLength} characters - Too long, may be truncated` });
      score += 4;
    }
    
    // Description optimization
    const hasCallToAction = /(learn|discover|find|get|try|start|download|buy|shop|read|explore)/i.test(data.metaDescription);
    const endsWithPeriod = data.metaDescription.trim().endsWith('.');
    
    if (hasCallToAction) {
      checks.push({ factor: 'Meta Description CTA', status: 'good', description: 'Call-to-action found in description' });
      score += 3;
    } else {
      checks.push({ 
        factor: 'Meta Description CTA', 
        status: 'warning', 
        description: 'Consider adding a call-to-action',
        recommendation: 'Add a compelling call-to-action to your meta description to improve click-through rates from search results.',
        technicalDetails: 'CTAs in meta descriptions encourage users to click and can significantly improve organic CTR, indirectly boosting SEO rankings.',
        howToFix: [
          'Add action words like "Learn more", "Get started", "Try free", "Download now"',
          'Create urgency with phrases like "Limited time", "Act now", "Today only"',
          'Use benefit-focused CTAs: "Save 50%", "Get instant results", "Boost your traffic"',
          'Keep CTA concise and within the 155-160 character limit',
          'Match CTA to user intent and page content',
          'Test different CTA variations to see what works best'
        ],
        impact: 'Medium - Strong CTAs can improve click-through rates by 15-30% from search results.'
      });
      score += 1;
    }
    
  } else {
    checks.push({ 
      factor: 'Meta Description', 
      status: 'critical', 
      description: 'Missing meta description - important for SERP CTR',
      recommendation: 'Add a compelling meta description to improve click-through rates from search results.',
      technicalDetails: 'Meta descriptions appear as snippets in search results and significantly influence whether users click on your link.',
      howToFix: [
        'Add <meta name="description" content="Your description here"> to the HTML head section',
        'Keep description between 150-160 characters for optimal display',
        'Write compelling, action-oriented copy that includes your target keyword',
        'Make each page\'s meta description unique and relevant to its content',
        'Include a clear value proposition or call-to-action',
        'Avoid keyword stuffing - focus on readability and user appeal'
      ],
      impact: 'High - Meta descriptions directly affect click-through rates and can improve organic traffic by 5-15%.'
    });
    score += 1;
  }

  // Meta Keywords Analysis
  if (data.metaKeywords) {
    checks.push({ factor: 'Meta Keywords', status: 'neutral', description: 'Meta keywords present but not used by search engines' });
    score += 1;
  } else {
    checks.push({ factor: 'Meta Keywords', status: 'neutral', description: 'Meta keywords not present - not required' });
    score += 2;
  }

  // Heading Structure Analysis (Comprehensive)
  const headings = data.headings;
  const h1Count = headings.h1.length;
  const h2Count = headings.h2.length;
  const h3Count = headings.h3.length;
  const h4Count = headings.h4.length;
  const h5Count = headings.h5.length;
  const h6Count = headings.h6.length;
  const totalHeadings = h1Count + h2Count + h3Count + h4Count + h5Count + h6Count;
  
  // H1 Analysis
  if (h1Count === 1) {
    const h1Text = headings.h1[0];
    const h1Length = h1Text.length;
    
    if (h1Length >= 20 && h1Length <= 70) {
      checks.push({ factor: 'H1 Tag', status: 'excellent', description: `Single H1 (${h1Length} chars) - Perfect structure` });
      score += 10;
    } else {
      checks.push({ factor: 'H1 Tag', status: 'good', description: `Single H1 found - optimize length (${h1Length} chars)` });
      score += 8;
    }
    
    // Check if H1 differs from title
    if (data.title && h1Text.toLowerCase() !== data.title.toLowerCase()) {
      checks.push({ factor: 'H1-Title Variation', status: 'good', description: 'H1 differs from title tag - good for keyword diversity' });
      score += 3;
    }
    
  } else if (h1Count > 1) {
    checks.push({ factor: 'H1 Tag', status: 'warning', description: `${h1Count} H1 tags - use only one H1 per page` });
    score += 4;
  } else {
    checks.push({ 
      factor: 'H1 Tag', 
      status: 'critical', 
      description: 'Missing H1 tag - important for content hierarchy',
      recommendation: 'Add an H1 tag to establish clear content hierarchy and improve SEO structure.',
      technicalDetails: 'H1 tags signal the main topic of your page to both users and search engines, helping with content understanding and accessibility.',
      howToFix: [
        'Add one H1 tag near the top of your page content using <h1>Your Main Title</h1>',
        'Include your primary target keyword naturally in the H1',
        'Make the H1 descriptive and compelling for users',
        'Ensure the H1 accurately represents the page content',
        'Use only one H1 tag per page - use H2, H3, etc. for subheadings',
        'Keep H1 length between 20-60 characters for optimal display'
      ],
      impact: 'High - H1 tags are one of the most important on-page SEO elements for content structure and keyword relevance.'
    });
    score += 1;
  }

  // Heading Hierarchy Analysis
  if (totalHeadings >= 3) {
    let hierarchyScore = 0;
    let hierarchyNotes = [];
    
    if (h2Count > 0) {
      hierarchyScore += 3;
      hierarchyNotes.push(`${h2Count} H2`);
    }
    if (h3Count > 0) {
      hierarchyScore += 2;
      hierarchyNotes.push(`${h3Count} H3`);
    }
    if (h4Count > 0) {
      hierarchyScore += 1;
      hierarchyNotes.push(`${h4Count} H4`);
    }
    
    // Create heading data structure for all cases
    const headingIssues = [];
    if (h1Count === 0) headingIssues.push('Missing H1 tag - add one primary heading');
    if (h1Count > 1) headingIssues.push(`Multiple H1 tags (${h1Count}) - use only one H1 per page`);
    
    const headingData = {
      h1: data.headings.h1 || [],
      h2: data.headings.h2 || [],
      h3: data.headings.h3 || [],
      h4: data.headings.h4 || [],
      h5: data.headings.h5 || [],
      h6: data.headings.h6 || [],
      totalCount: totalHeadings,
      hierarchyScore: hierarchyScore,
      issues: headingIssues
    };
    
    if (hierarchyScore >= 5) {
      checks.push({ 
        factor: 'Heading Hierarchy', 
        status: 'excellent', 
        description: `Excellent hierarchy: ${hierarchyNotes.join(', ')}`,
        headingData
      });
      score += 8;
    } else if (hierarchyScore >= 3) {
      checks.push({ 
        factor: 'Heading Hierarchy', 
        status: 'good', 
        description: `Good hierarchy: ${hierarchyNotes.join(', ')}`,
        headingData
      });
      score += 6;
    } else {
      checks.push({ 
        factor: 'Heading Hierarchy', 
        status: 'fair', 
        description: `Basic hierarchy: ${hierarchyNotes.join(', ')}`,
        headingData
      });
      score += 3;
    }
    
  } else {
    // Calculate hierarchy score for insufficient headings case
    let hierarchyScore = 0;
    if (h2Count > 0) hierarchyScore += 3;
    if (h3Count > 0) hierarchyScore += 2;
    if (h4Count > 0) hierarchyScore += 1;
    
    // Analyze heading structure issues
    const headingIssues = [];
    if (h1Count === 0) headingIssues.push('Missing H1 tag - add one primary heading');
    if (h1Count > 1) headingIssues.push(`Multiple H1 tags (${h1Count}) - use only one H1 per page`);
    if (h2Count === 0 && totalHeadings > 1) headingIssues.push('Missing H2 tags - add section headings');
    if (h3Count > 0 && h2Count === 0) headingIssues.push('H3 tags without H2 - maintain proper hierarchy');
    
    const headingData = {
      h1: data.headings.h1 || [],
      h2: data.headings.h2 || [],
      h3: data.headings.h3 || [],
      h4: data.headings.h4 || [],
      h5: data.headings.h5 || [],
      h6: data.headings.h6 || [],
      totalCount: totalHeadings,
      hierarchyScore: hierarchyScore,
      issues: headingIssues
    };
    
    checks.push({ 
      factor: 'Heading Hierarchy', 
      status: 'warning', 
      description: 'Insufficient heading structure - use more headings',
      recommendation: 'Add more heading tags (H2, H3, H4) to create a clear content hierarchy and improve both SEO and user experience.',
      technicalDetails: 'Proper heading hierarchy helps search engines understand content structure and makes content more accessible. It also improves user scanning and readability.',
      howToFix: [
        'Add H2 tags for main sections of your content',
        'Use H3 tags for subsections under H2s',
        'Ensure headings follow logical order: H1 → H2 → H3 → H4',
        'Include relevant keywords naturally in headings',
        'Make headings descriptive and compelling for users',
        'Aim for at least 3-4 headings on content pages over 500 words',
        'Use headings to break up long paragraphs and improve scannability'
      ],
      impact: 'Medium - Good heading structure can improve SEO rankings by 5-10% and significantly enhance user experience.',
      headingData
    });
    score += 2;
  }

  // Image Optimization Analysis
  const totalImages = data.images.length;
  const imagesWithAlt = data.images.filter((img: any) => img.hasAlt && img.alt.trim().length > 0).length;
  const imagesWithTitle = data.images.filter((img: any) => img.hasTitle).length;
  const lazyLoadedImages = data.images.filter((img: any) => img.hasLazyLoading).length;
  
  if (totalImages === 0) {
    checks.push({ factor: 'Image Usage', status: 'neutral', description: 'No images found - consider adding relevant images' });
    score += 3;
  } else {
    // Alt text analysis
    const altCoverage = (imagesWithAlt / totalImages * 100).toFixed(0);
    if (altCoverage == '100') {
      checks.push({ factor: 'Image Alt Text', status: 'excellent', description: `${imagesWithAlt}/${totalImages} images have alt text (${altCoverage}%)` });
      score += 8;
    } else if (altCoverage >= '80') {
      checks.push({ factor: 'Image Alt Text', status: 'good', description: `${imagesWithAlt}/${totalImages} images have alt text (${altCoverage}%)` });
      score += 6;
    } else {
      checks.push({ factor: 'Image Alt Text', status: 'warning', description: `${imagesWithAlt}/${totalImages} images have alt text (${altCoverage}%)` });
      score += 2;
    }
    
    // Title attribute analysis
    if (imagesWithTitle > 0) {
      checks.push({ factor: 'Image Title Attributes', status: 'good', description: `${imagesWithTitle}/${totalImages} images have title attributes` });
      score += 2;
    }
    
    // Lazy loading analysis
    if (lazyLoadedImages > 0) {
      checks.push({ factor: 'Image Lazy Loading', status: 'good', description: `${lazyLoadedImages}/${totalImages} images use lazy loading` });
      score += 3;
    }
  }

  // Link Analysis
  const internalLinks = data.links.filter((link: any) => link.isInternal).length;
  const externalLinks = data.links.filter((link: any) => link.isExternal).length;
  const noFollowLinks = data.links.filter((link: any) => link.hasNoFollow).length;
  const targetBlankLinks = data.links.filter((link: any) => link.hasTargetBlank).length;
  
  if (internalLinks > 0) {
    if (internalLinks >= 3 && internalLinks <= 10) {
      checks.push({ factor: 'Internal Links', status: 'excellent', description: `${internalLinks} internal links - optimal range` });
      score += 6;
    } else if (internalLinks > 10) {
      checks.push({ 
        factor: 'Internal Links', 
        status: 'warning', 
        description: `${internalLinks} internal links - may be excessive`,
        recommendation: 'Consider reducing the number of internal links to focus link equity on the most important pages.',
        technicalDetails: 'Too many internal links can dilute link equity and make it harder for search engines to understand page hierarchy and importance.',
        howToFix: [
          'Prioritize links to your most important pages (pillar content, key product/service pages)',
          'Remove unnecessary or repetitive internal links',
          'Use contextual links within content rather than just navigation links',
          'Focus on relevant, helpful links that enhance user experience',
          'Consider using nofollow on less important internal links if necessary',
          'Aim for 3-10 contextual internal links per page for optimal SEO'
        ],
        impact: 'Medium - Too many internal links can dilute page authority and confuse search engine crawling priorities.'
      });
      score += 4;
    } else {
      checks.push({ factor: 'Internal Links', status: 'good', description: `${internalLinks} internal links found` });
      score += 5;
    }
  } else {
    checks.push({ 
      factor: 'Internal Links', 
      status: 'warning', 
      description: 'No internal links - missed opportunity for site architecture',
      recommendation: 'Add relevant internal links to improve site navigation, user experience, and SEO performance.',
      technicalDetails: 'Internal links help search engines discover pages, distribute page authority, and understand site structure. They also keep users engaged longer.',
      howToFix: [
        'Link to related blog posts, products, or service pages within your content',
        'Add contextual links that provide additional value to readers',
        'Link to your most important pages (homepage, key landing pages, pillar content)',
        'Use descriptive anchor text that includes relevant keywords',
        'Ensure links are natural and helpful, not forced or spammy',
        'Aim for 3-5 internal links per page as a starting point'
      ],
      impact: 'Medium - Internal links can improve SEO rankings by 10-15% and significantly boost user engagement.'
    });
    score += 1;
  }
  
  if (externalLinks > 0) {
    const externalWithTarget = (targetBlankLinks / Math.max(externalLinks, 1) * 100).toFixed(0);
    checks.push({ factor: 'External Links', status: 'good', description: `${externalLinks} external links (${externalWithTarget}% open in new tab)` });
    score += 3;
    
    if (noFollowLinks > 0) {
      checks.push({ factor: 'NoFollow Links', status: 'good', description: `${noFollowLinks} links use rel="nofollow"` });
      score += 2;
    }
  } else {
    checks.push({ factor: 'External Links', status: 'neutral', description: 'No external links found' });
    score += 2;
  }

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeUserExperience(data: any) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // Mobile Optimization
  let mobileScore = 0;
  if (data.viewport && data.viewport.includes('width=device-width')) {
    mobileScore += 8;
    checks.push({ factor: 'Responsive Design', status: 'excellent', description: 'Proper viewport meta tag for mobile' });
  } else if (data.viewport) {
    mobileScore += 5;
    checks.push({ factor: 'Responsive Design', status: 'warning', description: 'Viewport tag present but not optimized' });
  } else {
    mobileScore += 1;
    checks.push({ factor: 'Responsive Design', status: 'critical', description: 'Missing viewport meta tag - not mobile-friendly' });
  }
  
  // Touch-friendly elements check (basic)
  const hasButtonElements = data.content.toLowerCase().includes('<button') || /\b(click|tap|press|button)\b/i.test(data.content);
  if (hasButtonElements) {
    mobileScore += 4;
    checks.push({ factor: 'Touch Elements', status: 'good', description: 'Interactive elements detected' });
  }
  score += mobileScore;

  // Accessibility Features
  let accessibilityScore = 0;
  
  // Alt text coverage
  const totalImages = data.images.length;
  const imagesWithAlt = data.images.filter((img: any) => img.hasAlt && img.alt.trim().length > 0).length;
  if (totalImages === 0) {
    accessibilityScore += 8;
    checks.push({ factor: 'Image Accessibility', status: 'neutral', description: 'No images to optimize' });
  } else {
    const altCoverage = (imagesWithAlt / totalImages * 100);
    if (altCoverage === 100) {
      accessibilityScore += 12;
      checks.push({ factor: 'Image Accessibility', status: 'excellent', description: `All ${totalImages} images have alt text` });
    } else if (altCoverage >= 80) {
      accessibilityScore += 8;
      checks.push({ factor: 'Image Accessibility', status: 'good', description: `${imagesWithAlt}/${totalImages} images have alt text (${altCoverage.toFixed(0)}%)` });
    } else {
      accessibilityScore += 3;
      checks.push({ factor: 'Image Accessibility', status: 'critical', description: `Only ${imagesWithAlt}/${totalImages} images have alt text (${altCoverage.toFixed(0)}%)` });
    }
  }
  
  // ARIA labels
  if (data.ariaLabels > 0) {
    accessibilityScore += 6;
    checks.push({ factor: 'ARIA Labels', status: 'good', description: `${data.ariaLabels} ARIA labels found - good for screen readers` });
  } else {
    accessibilityScore += 2;
    checks.push({ 
      factor: 'ARIA Labels', 
      status: 'warning', 
      description: 'No ARIA labels found - consider adding for better accessibility',
      recommendation: 'Add ARIA labels to improve accessibility for screen readers and users with disabilities.',
      technicalDetails: 'ARIA (Accessible Rich Internet Applications) labels provide additional context for assistive technologies, improving website accessibility and potentially SEO.',
      howToFix: [
        'Add aria-label="descriptive text" to interactive elements like buttons and links',
        'Use aria-labelledby to reference existing text that labels an element',
        'Add aria-describedby for additional descriptive text',
        'Include alt text for images: <img alt="description">',
        'Use semantic HTML elements when possible (nav, header, main, footer)',
        'Add role attributes for custom components',
        'Test with screen readers or accessibility tools'
      ],
      impact: 'Low-Medium - Better accessibility can improve user experience and may contribute to SEO rankings indirectly.'
    });
  }
  
  // Language declaration
  if (data.lang) {
    accessibilityScore += 6;
    checks.push({ factor: 'Language Declaration', status: 'good', description: `Page language: ${data.lang} - helps screen readers` });
  } else {
    accessibilityScore += 2;
    checks.push({ 
      factor: 'Language Declaration', 
      status: 'warning', 
      description: 'Missing lang attribute - important for screen readers',
      recommendation: 'Add a language attribute to help search engines and screen readers understand your content language.',
      technicalDetails: 'The lang attribute tells browsers and assistive technologies what language the page content is in, improving accessibility and potentially helping with international SEO.',
      howToFix: [
        'Add lang="en" to your <html> tag for English content',
        'Use appropriate language codes: "es" for Spanish, "fr" for French, etc.',
        'For multilingual content, use lang attributes on specific elements',
        'Use proper language codes from ISO 639-1 standard',
        'Consider adding xml:lang="en" for XHTML compatibility'
      ],
      impact: 'Low - Helps with accessibility compliance and may assist with international SEO targeting.'
    });
  }
  
  score += accessibilityScore;

  // Form Accessibility
  if (data.forms && data.forms.length > 0) {
    const formsWithLabels = data.forms.filter((form: any) => form.hasLabels).length;
    if (formsWithLabels === data.forms.length) {
      checks.push({ factor: 'Form Accessibility', status: 'excellent', description: `All ${data.forms.length} forms have labels` });
      score += 8;
    } else {
      checks.push({ factor: 'Form Accessibility', status: 'warning', description: `${formsWithLabels}/${data.forms.length} forms have proper labels` });
      score += 4;
    }
  } else {
    checks.push({ factor: 'Form Accessibility', status: 'neutral', description: 'No forms to evaluate' });
    score += 4;
  }

  // Page Loading Optimization
  let performanceScore = 0;
  
  // Image optimization
  if (data.hasLazyLoading) {
    performanceScore += 6;
    checks.push({ factor: 'Image Loading', status: 'excellent', description: 'Lazy loading implemented for better performance' });
  } else if (totalImages > 3) {
    performanceScore += 2;
    checks.push({ 
      factor: 'Image Loading', 
      status: 'warning', 
      description: 'Consider lazy loading for better performance',
      recommendation: 'Implement lazy loading to improve page load speed and Core Web Vitals scores.',
      technicalDetails: 'Lazy loading defers the loading of off-screen images until users scroll to them, reducing initial page load time and bandwidth usage.',
      howToFix: [
        'Add loading="lazy" attribute to img tags: <img src="image.jpg" loading="lazy" alt="description">',
        'Use intersection Observer API for more advanced lazy loading control',
        'Consider using libraries like lazysizes for older browser support',
        'Avoid lazy loading above-the-fold images (first 2-3 images)',
        'Use placeholder images or blur effects during loading for better UX',
        'Test loading performance with Chrome DevTools and PageSpeed Insights'
      ],
      impact: 'Medium - Lazy loading can improve page load speed by 20-30% and significantly enhance Core Web Vitals scores.'
    });
  } else {
    performanceScore += 4;
    checks.push({ factor: 'Image Loading', status: 'neutral', description: 'Few images - lazy loading not critical' });
  }
  
  // Modern image formats
  if (data.hasWebP || data.hasAvif) {
    const formats = [];
    if (data.hasWebP) formats.push('WebP');
    if (data.hasAvif) formats.push('AVIF');
    performanceScore += 6;
    checks.push({ factor: 'Image Formats', status: 'excellent', description: `Modern formats used: ${formats.join(', ')}` });
  } else if (totalImages > 0) {
    performanceScore += 2;
    checks.push({ 
      factor: 'Image Formats', 
      status: 'warning', 
      description: 'Consider using WebP/AVIF for better compression',
      recommendation: 'Use modern image formats like WebP or AVIF to reduce file sizes and improve page loading speed.',
      technicalDetails: 'Modern image formats provide 25-50% better compression than traditional JPEG/PNG formats while maintaining the same visual quality.',
      howToFix: [
        'Convert existing images to WebP format using tools like ImageMin or online converters',
        'Implement picture element with multiple sources: <picture><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="description"></picture>',
        'Use AVIF for even better compression (supported by modern browsers)',
        'Keep fallback images in JPEG/PNG format for older browsers',
        'Use build tools or CDNs that automatically serve optimal formats',
        'Test image quality across different devices and screen sizes'
      ],
      impact: 'Medium - Modern image formats can reduce image file sizes by 25-50%, significantly improving page load speed and Core Web Vitals.'
    });
  } else {
    performanceScore += 4;
    checks.push({ factor: 'Image Formats', status: 'neutral', description: 'No images to optimize' });
  }
  
  score += performanceScore;

  // Content Readability
  let readabilityScore = 0;
  const content = data.content || '';
  const words = content.split(/\s+/).filter((w: string) => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
  
  if (words.length > 0 && sentences.length > 0) {
    const avgWordsPerSentence = words.length / sentences.length;
    
    if (avgWordsPerSentence <= 20) {
      readabilityScore += 8;
      checks.push({ factor: 'Reading Difficulty', status: 'excellent', description: `${avgWordsPerSentence.toFixed(1)} avg words per sentence - easy to read` });
    } else if (avgWordsPerSentence <= 25) {
      readabilityScore += 6;
      checks.push({ factor: 'Reading Difficulty', status: 'good', description: `${avgWordsPerSentence.toFixed(1)} avg words per sentence - moderately easy` });
    } else {
      readabilityScore += 3;
      checks.push({ factor: 'Reading Difficulty', status: 'warning', description: `${avgWordsPerSentence.toFixed(1)} avg words per sentence - consider shorter sentences` });
    }
  }
  
  score += readabilityScore;

  // Navigation and Link Structure
  const internalLinks = data.links.filter(link => link.isInternal).length;
  const externalLinks = data.links.filter(link => link.isExternal).length;
  const targetBlankLinks = data.links.filter(link => link.hasTargetBlank).length;
  
  let navigationScore = 0;
  if (internalLinks >= 3) {
    navigationScore += 6;
    checks.push({ factor: 'Internal Navigation', status: 'excellent', description: `${internalLinks} internal links - good site architecture` });
  } else if (internalLinks > 0) {
    navigationScore += 4;
    checks.push({ factor: 'Internal Navigation', status: 'good', description: `${internalLinks} internal links found` });
  } else {
    navigationScore += 1;
    checks.push({ factor: 'Internal Navigation', status: 'warning', description: 'No internal links - missed navigation opportunities' });
  }
  
  if (externalLinks > 0) {
    const externalWithTarget = targetBlankLinks / Math.max(externalLinks, 1) * 100;
    if (externalWithTarget >= 80) {
      navigationScore += 4;
      checks.push({ factor: 'External Link Handling', status: 'excellent', description: `${targetBlankLinks}/${externalLinks} external links open in new tab` });
    } else {
      navigationScore += 2;
      checks.push({ factor: 'External Link Handling', status: 'warning', description: 'Some external links should open in new tab' });
    }
  } else {
    navigationScore += 3;
    checks.push({ factor: 'External Link Handling', status: 'neutral', description: 'No external links found' });
  }
  
  score += navigationScore;

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeContentStructure(data: any) {
  const checks = [];
  let score = 0;
  const maxScore = 100;
  
  const content = data.content || '';
  const words = content.split(/\s+/).filter((w: string) => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
  const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
  const wordCount = words.length;

  // Content Depth Analysis
  let depthScore = 0;
  if (wordCount >= 2000) {
    depthScore += 20;
    checks.push({ factor: 'Content Depth', status: 'excellent', description: `${wordCount} words - Comprehensive, in-depth content` });
  } else if (wordCount >= 1000) {
    depthScore += 15;
    checks.push({ factor: 'Content Depth', status: 'good', description: `${wordCount} words - Good content depth` });
  } else if (wordCount >= 500) {
    depthScore += 10;
    checks.push({ factor: 'Content Depth', status: 'fair', description: `${wordCount} words - Moderate content depth` });
  } else {
    depthScore += 5;
    checks.push({ factor: 'Content Depth', status: 'warning', description: `${wordCount} words - Thin content, consider expanding` });
  }
  score += depthScore;

  // Content Organization
  let structureScore = 0;
  
  // Paragraph analysis
  if (paragraphs.length >= 5) {
    const avgWordsPerParagraph = wordCount / paragraphs.length;
    if (avgWordsPerParagraph >= 50 && avgWordsPerParagraph <= 150) {
      structureScore += 12;
      checks.push({ factor: 'Paragraph Structure', status: 'excellent', description: `${paragraphs.length} paragraphs, avg ${avgWordsPerParagraph.toFixed(0)} words each` });
    } else {
      structureScore += 8;
      checks.push({ factor: 'Paragraph Structure', status: 'good', description: `${paragraphs.length} paragraphs - consider optimizing length` });
    }
  } else if (paragraphs.length >= 2) {
    structureScore += 6;
    checks.push({ factor: 'Paragraph Structure', status: 'fair', description: `${paragraphs.length} paragraphs - could use more structure` });
  } else {
    structureScore += 2;
    checks.push({ factor: 'Paragraph Structure', status: 'warning', description: 'Poor paragraph structure - break content into sections' });
  }
  
  // Sentence variety
  if (sentences.length > 0) {
    const sentenceLengths = sentences.map((s: string) => s.split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((sum: number, len: number) => sum + len, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sum: number, len: number) => sum + Math.pow(len - avgSentenceLength, 2), 0) / sentenceLengths.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev >= 5) {
      structureScore += 8;
      checks.push({ factor: 'Sentence Variety', status: 'excellent', description: 'Good sentence length variety for readability' });
    } else if (stdDev >= 3) {
      structureScore += 6;
      checks.push({ factor: 'Sentence Variety', status: 'good', description: 'Moderate sentence variety' });
    } else {
      structureScore += 3;
      checks.push({ factor: 'Sentence Variety', status: 'warning', description: 'Consider varying sentence lengths for better flow' });
    }
  }
  
  score += structureScore;

  // Content Formatting
  let formattingScore = 0;
  
  // Lists and formatting
  const hasOrderedList = /<ol[^>]*>/i.test(content);
  const hasUnorderedList = /<ul[^>]*>/i.test(content);
  const hasListItems = /<li[^>]*>/i.test(content);
  const hasBold = /<(strong|b)[^>]*>/i.test(content) || /\*\*[^*]+\*\*/.test(content);
  const hasItalic = /<(em|i)[^>]*>/i.test(content) || /\*[^*]+\*/.test(content);
  
  if (hasListItems) {
    formattingScore += 8;
    const listTypes = [];
    if (hasOrderedList) listTypes.push('numbered');
    if (hasUnorderedList) listTypes.push('bulleted');
    checks.push({ factor: 'List Usage', status: 'excellent', description: `Lists found (${listTypes.join(', ')}) - great for scannability` });
  } else {
    formattingScore += 3;
    checks.push({ factor: 'List Usage', status: 'warning', description: 'No lists found - consider using lists for better structure' });
  }
  
  // Text emphasis
  let emphasisCount = 0;
  if (hasBold) emphasisCount++;
  if (hasItalic) emphasisCount++;
  
  if (emphasisCount >= 2) {
    formattingScore += 6;
    checks.push({ factor: 'Text Emphasis', status: 'excellent', description: 'Good use of bold and italic for emphasis' });
  } else if (emphasisCount === 1) {
    formattingScore += 4;
    checks.push({ factor: 'Text Emphasis', status: 'good', description: 'Some text emphasis used' });
  } else {
    formattingScore += 2;
    checks.push({ 
      factor: 'Text Emphasis', 
      status: 'warning', 
      description: 'Consider using bold/italic for key points',
      recommendation: 'Use bold and italic formatting to highlight important keywords and improve content scannability.',
      technicalDetails: 'Text emphasis helps users quickly scan content and signals importance to search engines. It also improves user engagement and readability.',
      howToFix: [
        'Use <strong> or <b> tags to emphasize important keywords and phrases',
        'Use <em> or <i> tags for subtle emphasis or alternative voice',
        'Bold your most important keywords 1-3 times per 1000 words',
        'Emphasize key benefits, important numbers, or critical calls-to-action',
        'Use emphasis sparingly - too much loses impact and looks spammy',
        'Consider using CSS for visual emphasis while keeping semantic HTML'
      ],
      impact: 'Low-Medium - Proper text emphasis can improve user engagement by 10-15% and help with keyword relevance signals.'
    });
  }
  
  score += formattingScore;

  // Content Scannability
  let scannabilityScore = 0;
  
  // Heading distribution
  const totalHeadings = Object.values(data.headings || {}).reduce((sum: number, headings: any) => sum + (headings?.length || 0), 0);
  const headingsPerWord = (totalHeadings / Math.max(wordCount, 1)) * 1000;
  
  if (headingsPerWord >= 10) {
    scannabilityScore += 10;
    checks.push({ factor: 'Content Scannability', status: 'excellent', description: `${totalHeadings} headings for ${wordCount} words - very scannable` });
  } else if (headingsPerWord >= 5) {
    scannabilityScore += 7;
    checks.push({ factor: 'Content Scannability', status: 'good', description: `${totalHeadings} headings - good scannability` });
  } else {
    scannabilityScore += 3;
    checks.push({ factor: 'Content Scannability', status: 'warning', description: 'Add more headings to improve scannability' });
  }
  
  // Content freshness indicators
  const freshnessIndicators = [
    /\b(updated|revised|latest|current|new|recent)\b/gi,
    /\b20[2-9][0-9]\b/g,
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+20[2-9][0-9]\b/gi
  ];
  
  const freshnessMatches = freshnessIndicators.reduce((count, regex) => count + (content.match(regex) || []).length, 0);
  if (freshnessMatches >= 3) {
    scannabilityScore += 6;
    checks.push({ factor: 'Content Freshness', status: 'excellent', description: 'Multiple freshness indicators found' });
  } else if (freshnessMatches > 0) {
    scannabilityScore += 4;
    checks.push({ factor: 'Content Freshness', status: 'good', description: 'Some freshness indicators found' });
  } else {
    scannabilityScore += 2;
    checks.push({ factor: 'Content Freshness', status: 'neutral', description: 'Consider adding date/freshness indicators' });
  }
  
  score += scannabilityScore;

  // Content Engagement
  let engagementScore = 0;
  
  // Question usage
  const questionCount = (content.match(/\?/g) || []).length;
  if (questionCount >= 3) {
    engagementScore += 6;
    checks.push({ factor: 'Question Usage', status: 'excellent', description: `${questionCount} questions found - encourages engagement` });
  } else if (questionCount > 0) {
    engagementScore += 4;
    checks.push({ factor: 'Question Usage', status: 'good', description: `${questionCount} question(s) found` });
  } else {
    engagementScore += 2;
    checks.push({ factor: 'Question Usage', status: 'neutral', description: 'Consider adding questions to engage readers' });
  }
  
  // Action words and CTAs
  const actionWords = content.match(/(learn|discover|find|get|start|try|use|create|build|improve|optimize|download|buy|shop|visit|explore|check|see|read|watch|listen)/gi) || [];
  if (actionWords.length >= 10) {
    engagementScore += 6;
    checks.push({ factor: 'Action Words', status: 'excellent', description: `${actionWords.length} action words found - highly engaging` });
  } else if (actionWords.length >= 5) {
    engagementScore += 4;
    checks.push({ factor: 'Action Words', status: 'good', description: `${actionWords.length} action words found` });
  } else {
    engagementScore += 2;
    checks.push({ factor: 'Action Words', status: 'warning', description: 'Consider adding more action words to encourage engagement' });
  }
  
  score += engagementScore;

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeSocialOptimization(data: any) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // Open Graph tags
  let ogScore = 0;
  if (data.ogTitle) {
    checks.push({ factor: 'OG Title', status: 'good', description: 'Open Graph title is set' });
    ogScore += 25;
  } else {
    checks.push({ 
      factor: 'OG Title', 
      status: 'warning', 
      description: 'Missing Open Graph title',
      recommendation: 'Add an Open Graph title to control how your page appears when shared on social media.',
      technicalDetails: 'Open Graph titles appear as headlines when content is shared on Facebook, LinkedIn, and other social platforms. They can differ from your HTML title tag.',
      howToFix: [
        'Add <meta property="og:title" content="Your Social Media Title"> to HTML head',
        'Keep title between 40-60 characters for optimal display',
        'Make it more engaging than your regular title tag if needed',
        'Include compelling keywords that work for social sharing',
        'Test with Facebook Sharing Debugger and LinkedIn Post Inspector'
      ],
      impact: 'Medium - Proper OG titles can increase social media click-through rates by 20-40%.'
    });
  }

  if (data.ogDescription) {
    checks.push({ factor: 'OG Description', status: 'good', description: 'Open Graph description is set' });
    ogScore += 25;
  } else {
    checks.push({ 
      factor: 'OG Description', 
      status: 'warning', 
      description: 'Missing Open Graph description',
      recommendation: 'Add an Open Graph description to provide compelling preview text for social media shares.',
      technicalDetails: 'OG descriptions appear as preview text when your content is shared on social media platforms, influencing whether users click through.',
      howToFix: [
        'Add <meta property="og:description" content="Your social description"> to HTML head',
        'Keep description between 150-300 characters',
        'Write compelling, action-oriented copy for social media context',
        'Can be different from meta description to optimize for social sharing',
        'Include emotional triggers or compelling reasons to click'
      ],
      impact: 'Medium - Good OG descriptions can improve social media engagement by 15-25%.'
    });
  }

  if (data.ogImage) {
    checks.push({ factor: 'OG Image', status: 'good', description: 'Open Graph image is set' });
    ogScore += 25;
  } else {
    checks.push({ 
      factor: 'OG Image', 
      status: 'warning', 
      description: 'Missing Open Graph image',
      recommendation: 'Add an Open Graph image to make your content visually appealing when shared on social media.',
      technicalDetails: 'OG images are the visual preview that appears when content is shared. They significantly impact engagement and click-through rates on social platforms.',
      howToFix: [
        'Add <meta property="og:image" content="https://yoursite.com/image.jpg"> to HTML head',
        'Use high-quality images: minimum 1200x630 pixels (1.91:1 ratio)',
        'Ensure image is under 8MB and use JPG or PNG format',
        'Include relevant visuals: product shots, article graphics, or branded images',
        'Test image display with Facebook Sharing Debugger',
        'Consider adding og:image:alt for accessibility'
      ],
      impact: 'High - Posts with images get 2.3x more engagement on social media and significantly higher click-through rates.'
    });
  }

  score += ogScore;

  // Twitter Cards
  if (data.twitterCard) {
    checks.push({ factor: 'Twitter Cards', status: 'good', description: 'Twitter Card is configured' });
    score += 25;
  } else {
    checks.push({ 
      factor: 'Twitter Cards', 
      status: 'warning', 
      description: 'Twitter Card not configured',
      recommendation: 'Set up Twitter Cards to optimize how your content appears when shared on Twitter/X.',
      technicalDetails: 'Twitter Cards provide rich media previews when content is shared on Twitter/X, increasing engagement and click-through rates.',
      howToFix: [
        'Add <meta name="twitter:card" content="summary_large_image"> for large image cards',
        'Include <meta name="twitter:title" content="Your Twitter Title">',
        'Add <meta name="twitter:description" content="Your Twitter description">',
        'Set <meta name="twitter:image" content="https://yoursite.com/image.jpg">',
        'Optional: Add <meta name="twitter:site" content="@yourusername">',
        'Test with Twitter Card Validator tool',
        'Use "summary" card type for smaller images or "summary_large_image" for prominent visuals'
      ],
      impact: 'Medium - Twitter Cards can increase engagement by 15-30% and improve brand visibility on social media.'
    });
  }

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeLocalSEO(data: any) {
  const checks = [];
  let score = 30; // Base score for pages that may not be local
  const maxScore = 100;
  let isLocalBusiness = false;

  const content = data.content?.toLowerCase() || '';
  
  // Enhanced Local Business Detection
  const addressPatterns = [
    /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|way|place|pl|court|ct|circle|cir)\b/i,
    /\d+\s+[\w\s]+(?:suite|ste|unit|apt|apartment)\s*\#?\s*\d+/i,
    /po\s*box\s*\d+/i
  ];
  
  const phonePatterns = [
    /\(?\d{3}\)?[-.,\s]*\d{3}[-.,\s]*\d{4}/,
    /\+?1?[-.,\s]*\(?\d{3}\)?[-.,\s]*\d{3}[-.,\s]*\d{4}/,
    /\d{3}[-.,\s]*\d{4}/
  ];
  
  const hasAddress = addressPatterns.some(pattern => pattern.test(content));
  const hasPhone = phonePatterns.some(pattern => pattern.test(content));
  
  // Business hours detection
  const hasBusinessHours = /\b(hours?|open|closed|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.*\b(am|pm|:\d{2})\b/i.test(content);
  
  // Service area detection
  const hasServiceArea = /\b(serving|service\s+area|coverage\s+area|we\s+serve|areas?\s+served|locations?)\b/i.test(content);
  
  // Local keywords detection
  const localKeywords = [
    'near me', 'local', 'city', 'town', 'neighborhood', 'area', 'location',
    'community', 'region', 'district', 'zip code', 'postal code', 'directions',
    'map', 'address', 'visit us', 'come by', 'stop by', 'nearby'
  ];
  
  const localKeywordCount = localKeywords.reduce((count, keyword) => 
    count + (content.includes(keyword) ? 1 : 0), 0
  );
  
  // Determine if this appears to be a local business
  if (hasAddress || hasPhone || hasBusinessHours || localKeywordCount >= 3) {
    isLocalBusiness = true;
    score = 20; // Reset to lower base for local businesses to be evaluated properly
  }

  // Address Analysis
  if (hasAddress) {
    checks.push({ factor: 'Address Information', status: 'excellent', description: 'Complete address information found' });
    score += 15;
    
    // Check for multiple address formats
    const addressMatches = addressPatterns.reduce((count, pattern) => count + (pattern.test(content) ? 1 : 0), 0);
    if (addressMatches > 1) {
      checks.push({ factor: 'Address Completeness', status: 'good', description: 'Multiple address formats detected' });
      score += 3;
    }
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Address Information', status: 'critical', description: 'Local business should display address' });
    score += 2;
  } else {
    checks.push({ factor: 'Address Information', status: 'neutral', description: 'No address needed for this type of page' });
    score += 8;
  }

  // Phone Number Analysis
  if (hasPhone) {
    const phoneMatches = content.match(phonePatterns.find(pattern => pattern.test(content))) || [];
    checks.push({ factor: 'Contact Phone', status: 'excellent', description: 'Phone number prominently displayed' });
    score += 12;
    
    // Check for click-to-call (tel: links)
    if (content.includes('tel:') || content.includes('href="tel:')) {
      checks.push({ factor: 'Click-to-Call', status: 'excellent', description: 'Click-to-call functionality detected' });
      score += 5;
    }
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Contact Phone', status: 'critical', description: 'Local business should display phone number' });
    score += 2;
  } else {
    checks.push({ factor: 'Contact Phone', status: 'neutral', description: 'Phone number not required for this page type' });
    score += 6;
  }

  // Business Hours
  if (hasBusinessHours) {
    checks.push({ factor: 'Business Hours', status: 'excellent', description: 'Business hours information found' });
    score += 10;
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Business Hours', status: 'warning', description: 'Consider adding business hours for customers' });
    score += 3;
  } else {
    checks.push({ factor: 'Business Hours', status: 'neutral', description: 'Business hours not applicable' });
    score += 5;
  }

  // Service Area
  if (hasServiceArea) {
    checks.push({ factor: 'Service Area', status: 'good', description: 'Service area information provided' });
    score += 8;
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Service Area', status: 'neutral', description: 'Consider specifying service areas' });
    score += 4;
  } else {
    checks.push({ factor: 'Service Area', status: 'neutral', description: 'Service area not applicable' });
    score += 4;
  }

  // Local Keywords
  if (localKeywordCount >= 5) {
    checks.push({ factor: 'Local Keywords', status: 'excellent', description: `${localKeywordCount} local keywords found - strong local relevance` });
    score += 10;
  } else if (localKeywordCount >= 2) {
    checks.push({ factor: 'Local Keywords', status: 'good', description: `${localKeywordCount} local keywords found` });
    score += 6;
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Local Keywords', status: 'warning', description: 'Consider adding more location-specific keywords' });
    score += 2;
  } else {
    checks.push({ factor: 'Local Keywords', status: 'neutral', description: 'Local keywords not critical for this page' });
    score += 5;
  }

  // Local Schema Markup Analysis
  const localSchemaTypes = ['LocalBusiness', 'Organization', 'Place', 'Restaurant', 'Store', 'Service'];
  const hasLocalSchema = data.structuredData.some((schema: any) => 
    localSchemaTypes.includes(schema['@type'] || '')
  );
  
  const hasOrganizationSchema = data.structuredData.some((schema: any) => schema['@type'] === 'Organization');
  
  if (hasLocalSchema) {
    const schemaTypes = data.structuredData
      .filter((schema: any) => localSchemaTypes.includes(schema['@type'] || ''))
      .map((schema: any) => schema['@type'])
      .join(', ');
    
    checks.push({ factor: 'Local Schema Markup', status: 'excellent', description: `Local schema found: ${schemaTypes}` });
    score += 15;
  } else if (hasOrganizationSchema && isLocalBusiness) {
    checks.push({ factor: 'Local Schema Markup', status: 'good', description: 'Organization schema found - consider LocalBusiness schema' });
    score += 8;
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Local Schema Markup', status: 'warning', description: 'Add LocalBusiness schema for better local search visibility' });
    score += 3;
  } else {
    checks.push({ factor: 'Local Schema Markup', status: 'neutral', description: 'Local schema not required for this page type' });
    score += 7;
  }

  // Google My Business Integration
  const hasGoogleMapsEmbed = /maps\.google\.|google\.com\/maps|goo\.gl\/maps/i.test(content);
  if (hasGoogleMapsEmbed) {
    checks.push({ factor: 'Map Integration', status: 'excellent', description: 'Google Maps integration detected' });
    score += 8;
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Map Integration', status: 'warning', description: 'Consider embedding Google Maps for easy directions' });
    score += 2;
  } else {
    checks.push({ factor: 'Map Integration', status: 'neutral', description: 'Map integration not required' });
    score += 4;
  }

  // Reviews and Ratings
  const hasReviews = /\b(review|rating|star|testimonial|feedback|customer\s+says)\b/i.test(content);
  if (hasReviews) {
    checks.push({ factor: 'Customer Reviews', status: 'good', description: 'Customer reviews or testimonials found' });
    score += 7;
  } else if (isLocalBusiness) {
    checks.push({ factor: 'Customer Reviews', status: 'neutral', description: 'Consider displaying customer reviews' });
    score += 3;
  } else {
    checks.push({ factor: 'Customer Reviews', status: 'neutral', description: 'Reviews not critical for this page type' });
    score += 4;
  }

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore,
    isLocalBusiness
  };
}

function analyzeAdvancedAnalytics(data: any) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // Performance Optimization Analysis
  let performanceScore = 0;
  
  // Image optimization
  if (data.hasLazyLoading && data.images.length > 3) {
    performanceScore += 8;
    checks.push({ factor: 'Image Lazy Loading', status: 'excellent', description: 'Lazy loading implemented - improves page speed' });
  } else if (data.hasLazyLoading) {
    performanceScore += 6;
    checks.push({ factor: 'Image Lazy Loading', status: 'good', description: 'Lazy loading implemented' });
  } else if (data.images.length > 5) {
    performanceScore += 2;
    checks.push({ factor: 'Image Lazy Loading', status: 'critical', description: `${data.images.length} images without lazy loading - impacts performance` });
  } else {
    performanceScore += 4;
    checks.push({ factor: 'Image Lazy Loading', status: 'neutral', description: 'Few images - lazy loading less critical' });
  }

  // Modern image formats
  if (data.hasWebP || data.hasAvif) {
    const formats = [];
    if (data.hasWebP) formats.push('WebP');
    if (data.hasAvif) formats.push('AVIF');
    performanceScore += 8;
    checks.push({ factor: 'Modern Image Formats', status: 'excellent', description: `Modern formats: ${formats.join(', ')} - better compression` });
  } else if (data.images.length > 0) {
    performanceScore += 2;
    checks.push({ factor: 'Modern Image Formats', status: 'warning', description: 'Consider WebP/AVIF for 25-50% smaller file sizes' });
  } else {
    performanceScore += 5;
    checks.push({ factor: 'Modern Image Formats', status: 'neutral', description: 'No images to optimize' });
  }
  
  // Resource minification
  let resourceScore = 0;
  if (data.hasMinifiedCSS) {
    resourceScore += 4;
    checks.push({ factor: 'CSS Minification', status: 'good', description: 'CSS files are minified' });
  } else if (data.externalCSS > 0) {
    resourceScore += 1;
    checks.push({ factor: 'CSS Minification', status: 'warning', description: 'CSS files should be minified for better performance' });
  } else {
    resourceScore += 3;
    checks.push({ factor: 'CSS Minification', status: 'neutral', description: 'No external CSS files detected' });
  }
  
  if (data.hasMinifiedJS) {
    resourceScore += 4;
    checks.push({ factor: 'JS Minification', status: 'good', description: 'JavaScript files are minified' });
  } else if (data.externalJS > 0) {
    resourceScore += 1;
    checks.push({ factor: 'JS Minification', status: 'warning', description: 'JavaScript files should be minified' });
  } else {
    resourceScore += 3;
    checks.push({ factor: 'JS Minification', status: 'neutral', description: 'No external JavaScript files detected' });
  }
  
  performanceScore += resourceScore;
  score += performanceScore;

  // Code Quality and Security
  let securityScore = 0;
  
  // Inline CSS/JS analysis
  if (data.inlineCSS > 5) {
    securityScore += 2;
    checks.push({ factor: 'Inline CSS Usage', status: 'warning', description: `${data.inlineCSS} inline style blocks - consider external CSS` });
  } else if (data.inlineCSS > 0) {
    securityScore += 4;
    checks.push({ factor: 'Inline CSS Usage', status: 'fair', description: `${data.inlineCSS} inline style blocks - acceptable amount` });
  } else {
    securityScore += 6;
    checks.push({ factor: 'Inline CSS Usage', status: 'good', description: 'No inline CSS - clean separation of concerns' });
  }
  
  if (data.inlineJS > 3) {
    securityScore += 2;
    checks.push({ factor: 'Inline JS Usage', status: 'warning', description: `${data.inlineJS} inline script blocks - security risk` });
  } else if (data.inlineJS > 0) {
    securityScore += 4;
    checks.push({ factor: 'Inline JS Usage', status: 'fair', description: `${data.inlineJS} inline script blocks - moderate usage` });
  } else {
    securityScore += 6;
    checks.push({ factor: 'Inline JS Usage', status: 'good', description: 'No inline JavaScript - better security' });
  }
  
  // Security headers and features
  if (data.hasCSP) {
    securityScore += 6;
    checks.push({ factor: 'Content Security Policy', status: 'excellent', description: 'CSP header detected - enhanced security' });
  } else {
    securityScore += 2;
    checks.push({ 
      factor: 'Content Security Policy', 
      status: 'warning', 
      description: 'Consider implementing CSP for better security',
      recommendation: 'Implement Content Security Policy headers to protect against XSS attacks and improve overall site security.',
      technicalDetails: 'CSP helps prevent cross-site scripting (XSS) attacks by controlling which resources can be loaded on your page. Search engines may consider security as a trust signal.',
      howToFix: [
        'Add Content-Security-Policy header to your server configuration',
        'Start with a restrictive policy: "default-src \'self\'"',
        'Add specific directives for scripts: "script-src \'self\' \'unsafe-inline\'"',
        'Allow specific external domains: "img-src \'self\' data: https:"',
        'Use CSP reporting to monitor violations before enforcing',
        'Test your policy thoroughly to avoid breaking functionality',
        'Consider using nonce or hash values for inline scripts'
      ],
      impact: 'Low-Medium - CSP improves security and may contribute to search engine trust signals.'
    });
  }
  
  score += securityScore;

  // Modern Web Standards
  let modernScore = 0;
  
  // Service Worker
  if (data.hasServiceWorker) {
    modernScore += 8;
    checks.push({ factor: 'Service Worker', status: 'excellent', description: 'Service Worker detected - offline capabilities' });
  } else {
    modernScore += 2;
    checks.push({ factor: 'Service Worker', status: 'neutral', description: 'No Service Worker - consider for PWA features' });
  }
  
  // Web App Manifest
  if (data.hasWebManifest) {
    modernScore += 6;
    checks.push({ factor: 'Web App Manifest', status: 'excellent', description: 'Web manifest found - app-like experience' });
  } else {
    modernScore += 2;
    checks.push({ factor: 'Web App Manifest', status: 'neutral', description: 'No web manifest - consider for PWA' });
  }
  
  // AMP support
  if (data.ampVersion) {
    modernScore += 4;
    checks.push({ factor: 'AMP Support', status: 'good', description: 'AMP version detected - faster mobile loading' });
  } else {
    modernScore += 3;
    checks.push({ factor: 'AMP Support', status: 'neutral', description: 'No AMP version - not required but can improve speed' });
  }
  
  score += modernScore;

  // Analytics and Tracking
  let trackingScore = 0;
  
  // Google Analytics
  if (data.googleAnalytics) {
    trackingScore += 6;
    checks.push({ factor: 'Google Analytics', status: 'good', description: 'Google Analytics implemented' });
  } else {
    trackingScore += 2;
    checks.push({ factor: 'Google Analytics', status: 'neutral', description: 'No Google Analytics detected' });
  }
  
  // Google Tag Manager
  if (data.googleTagManager) {
    trackingScore += 4;
    checks.push({ factor: 'Tag Management', status: 'good', description: 'Google Tag Manager implemented' });
  } else {
    trackingScore += 2;
    checks.push({ factor: 'Tag Management', status: 'neutral', description: 'No tag management system detected' });
  }
  
  // Facebook Pixel
  if (data.facebookPixel) {
    trackingScore += 3;
    checks.push({ factor: 'Facebook Pixel', status: 'good', description: 'Facebook Pixel for conversion tracking' });
  } else {
    trackingScore += 2;
    checks.push({ factor: 'Facebook Pixel', status: 'neutral', description: 'No Facebook Pixel detected' });
  }
  
  score += trackingScore;

  // Link Quality and SEO Factors
  let linkScore = 0;
  
  const totalLinks = data.links.length;
  const internalLinks = data.links.filter(link => link.isInternal).length;
  const externalLinks = data.links.filter(link => link.isExternal).length;
  const noFollowLinks = data.links.filter(link => link.hasNoFollow).length;
  const targetBlankLinks = data.links.filter(link => link.hasTargetBlank).length;
  
  // Internal linking structure
  if (internalLinks >= 5 && internalLinks <= 15) {
    linkScore += 6;
    checks.push({ factor: 'Internal Link Ratio', status: 'excellent', description: `${internalLinks}/${totalLinks} internal links - optimal ratio` });
  } else if (internalLinks > 0) {
    linkScore += 4;
    checks.push({ factor: 'Internal Link Ratio', status: 'good', description: `${internalLinks}/${totalLinks} internal links` });
  } else {
    linkScore += 1;
    checks.push({ factor: 'Internal Link Ratio', status: 'warning', description: 'No internal links - missed SEO opportunity' });
  }
  
  // External link handling
  if (externalLinks === 0) {
    linkScore += 4;
    checks.push({ factor: 'External Link Security', status: 'neutral', description: 'No external links to secure' });
  } else {
    const secureExternalLinks = targetBlankLinks / externalLinks * 100;
    if (secureExternalLinks >= 80) {
      linkScore += 6;
      checks.push({ factor: 'External Link Security', status: 'excellent', description: `${targetBlankLinks}/${externalLinks} external links open securely` });
    } else {
      linkScore += 3;
      checks.push({ factor: 'External Link Security', status: 'warning', description: 'Some external links should open in new tab' });
    }
  }
  
  // NoFollow usage
  if (noFollowLinks > 0 && externalLinks > 0) {
    linkScore += 4;
    checks.push({ factor: 'Link Equity Management', status: 'good', description: `${noFollowLinks} links use nofollow - good SEO practice` });
  } else if (externalLinks > 5) {
    linkScore += 2;
    checks.push({ factor: 'Link Equity Management', status: 'neutral', description: 'Consider using nofollow for some external links' });
  } else {
    linkScore += 3;
    checks.push({ factor: 'Link Equity Management', status: 'neutral', description: 'Link equity management not critical' });
  }
  
  score += linkScore;

  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

// New analysis functions for missing factors
function analyzeSecurityAndTrust(data: any, url: string, response?: Response): any {
  const checks = [];
  let score = 0;
  const maxScore = 100;
  
  // HTTPS Analysis
  if (url.startsWith('https://')) {
    checks.push({ 
      factor: 'SSL/TLS Security', 
      status: 'excellent', 
      description: 'Site uses HTTPS encryption',
      recommendation: 'Excellent! Your site is properly secured with HTTPS.',
      technicalDetails: 'HTTPS encrypts data between users and your server, boosting trust and SEO rankings.',
      impact: 'High - HTTPS is a confirmed Google ranking factor and essential for user trust.'
    });
    score += 25;
  } else {
    checks.push({ 
      factor: 'SSL/TLS Security', 
      status: 'critical', 
      description: 'Site does not use HTTPS - major security risk',
      recommendation: 'Immediately implement SSL certificate and redirect all HTTP traffic to HTTPS.',
      technicalDetails: 'Google requires HTTPS for ranking. Users will see "Not Secure" warnings without SSL.',
      howToFix: [
        'Purchase and install SSL certificate from your hosting provider',
        'Configure server to redirect HTTP to HTTPS',
        'Update all internal links to use HTTPS',
        'Update canonical URLs and sitemaps'
      ],
      impact: 'Critical - Missing HTTPS severely impacts SEO rankings and user trust.'
    });
    score += 5;
  }
  
  // Security Headers Analysis
  const securityHeaders = {
    'content-security-policy': 'Content Security Policy',
    'x-frame-options': 'X-Frame-Options',
    'x-content-type-options': 'X-Content-Type-Options',
    'referrer-policy': 'Referrer Policy',
    'strict-transport-security': 'HSTS Header'
  };
  
  let securityHeaderCount = 0;
  Object.entries(securityHeaders).forEach(([header, name]) => {
    const hasHeader = response?.headers.get(header);
    if (hasHeader) {
      securityHeaderCount++;
      checks.push({
        factor: `${name} Header`,
        status: 'good',
        description: `${name} header properly configured`,
        recommendation: `Great! ${name} header enhances security.`,
        technicalDetails: `${name}: ${hasHeader}`,
        impact: 'Medium - Security headers protect against common web vulnerabilities.'
      });
      score += 8;
    }
  });
  
  if (securityHeaderCount === 0) {
    checks.push({
      factor: 'Security Headers',
      status: 'warning',
      description: 'No security headers detected',
      recommendation: 'Add security headers to protect against common vulnerabilities.',
      howToFix: [
        'Add Content-Security-Policy header to prevent XSS attacks',
        'Set X-Frame-Options to prevent clickjacking',
        'Configure X-Content-Type-Options to prevent MIME sniffing',
        'Set Referrer-Policy for privacy control'
      ],
      impact: 'Medium - Security headers protect users and can improve search engine trust.'
    });
    score += 10;
  }
  
  // Mixed Content Analysis
  if (url.startsWith('https://')) {
    const hasMixedContent = /src=["']http:\/\/[^"']+["']|href=["']http:\/\/[^"']+["']/i.test(data.content || '');
    if (hasMixedContent) {
      checks.push({
        factor: 'Mixed Content',
        status: 'warning',
        description: 'HTTP resources loaded on HTTPS page detected',
        recommendation: 'Update all HTTP resources to HTTPS to avoid security warnings.',
        technicalDetails: 'Mixed content can trigger browser warnings and block resources.',
        howToFix: [
          'Update all images, scripts, and stylesheets to use HTTPS',
          'Use protocol-relative URLs (//example.com) when possible',
          'Check console for mixed content warnings'
        ],
        impact: 'Medium - Mixed content warnings can reduce user trust and break functionality.'
      });
      score += 15;
    } else {
      checks.push({
        factor: 'Mixed Content',
        status: 'excellent',
        description: 'No mixed content issues detected',
        recommendation: 'Perfect! All resources are properly served over HTTPS.',
        impact: 'Positive - Clean HTTPS implementation builds user trust.'
      });
      score += 25;
    }
  }
  
  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeAdvancedPerformance(data: any, url: string, response?: Response): any {
  const checks = [];
  let score = 0;
  const maxScore = 100;
  
  // Compression Analysis
  const compression = response?.headers.get('content-encoding');
  if (compression?.includes('gzip') || compression?.includes('br') || compression?.includes('deflate')) {
    checks.push({
      factor: 'Content Compression',
      status: 'excellent',
      description: `Content compressed with ${compression.toUpperCase()}`,
      recommendation: 'Excellent! Content compression reduces bandwidth and improves loading speed.',
      technicalDetails: 'Compression can reduce file sizes by 60-80% for text-based resources.',
      impact: 'High - Compression significantly improves page load speed and user experience.'
    });
    score += 20;
  } else {
    checks.push({
      factor: 'Content Compression',
      status: 'critical',
      description: 'No content compression detected',
      recommendation: 'Enable GZIP or Brotli compression on your server.',
      howToFix: [
        'Enable GZIP compression in server configuration',
        'Configure compression for HTML, CSS, JS, and text files',
        'Consider Brotli compression for better efficiency',
        'Test compression with online tools'
      ],
      technicalDetails: 'Compression typically reduces file sizes by 60-80% for better performance.',
      impact: 'High - Missing compression severely impacts page load speed and Core Web Vitals.'
    });
    score += 5;
  }
  
  // Caching Headers Analysis
  const cacheControl = response?.headers.get('cache-control');
  const expires = response?.headers.get('expires');
  const lastModified = response?.headers.get('last-modified');
  const etag = response?.headers.get('etag');
  
  let cachingScore = 0;
  if (cacheControl) {
    cachingScore += 5;
    if (cacheControl.includes('max-age')) cachingScore += 5;
    if (cacheControl.includes('public') || cacheControl.includes('private')) cachingScore += 3;
  }
  if (expires) cachingScore += 3;
  if (lastModified) cachingScore += 3;
  if (etag) cachingScore += 3;
  
  if (cachingScore >= 10) {
    checks.push({
      factor: 'Browser Caching',
      status: 'good',
      description: 'Browser caching headers properly configured',
      recommendation: 'Good caching setup improves repeat visitor performance.',
      technicalDetails: `Cache-Control: ${cacheControl || 'Not set'}`,
      impact: 'Medium - Proper caching improves performance for returning visitors.'
    });
    score += 15;
  } else {
    checks.push({
      factor: 'Browser Caching',
      status: 'warning',
      description: 'Browser caching not optimally configured',
      recommendation: 'Configure proper caching headers to improve performance.',
      howToFix: [
        'Set Cache-Control headers with appropriate max-age values',
        'Add Last-Modified and ETag headers for validation',
        'Configure different cache durations for different file types',
        'Use versioning for static assets'
      ],
      impact: 'Medium - Poor caching leads to slower repeat visits and higher server load.'
    });
    score += 8;
  }
  
  // Image Format Optimization
  const modernFormats = data.imageFormats?.filter((format: string) => 
    ['WebP', 'AVIF', 'HEIC'].includes(format)
  ) || [];
  
  if (modernFormats.length > 0) {
    checks.push({
      factor: 'Modern Image Formats',
      status: 'excellent',
      description: `Using modern formats: ${modernFormats.join(', ')}`,
      recommendation: 'Excellent! Modern image formats provide better compression.',
      technicalDetails: 'WebP provides 25-35% better compression than JPEG, AVIF up to 50% better.',
      impact: 'Medium - Modern formats reduce bandwidth usage and improve loading speed.'
    });
    score += 15;
  } else if (data.images?.length > 0) {
    checks.push({
      factor: 'Modern Image Formats',
      status: 'warning',
      description: 'No modern image formats detected',
      recommendation: 'Convert images to WebP or AVIF for better compression.',
      howToFix: [
        'Convert JPEG/PNG images to WebP format',
        'Implement picture element with fallbacks',
        'Use responsive images with srcset',
        'Consider AVIF for even better compression'
      ],
      impact: 'Medium - Modern formats can reduce image file sizes by 25-50%.'
    });
    score += 8;
  }
  
  // Large Images Analysis
  if (data.largeImages?.length > 0) {
    checks.push({
      factor: 'Image Size Optimization',
      status: 'warning',
      description: `${data.largeImages.length} potentially large images detected`,
      recommendation: 'Optimize large images to improve loading speed.',
      howToFix: [
        'Compress images without quality loss',
        'Use appropriate dimensions for display size',
        'Implement responsive images with srcset',
        'Consider lazy loading for below-fold images'
      ],
      impact: 'High - Large images are often the biggest contributor to slow page loads.'
    });
    score += 10;
  } else {
    checks.push({
      factor: 'Image Size Optimization',
      status: 'good',
      description: 'No obvious large images detected',
      recommendation: 'Good image optimization helps maintain fast loading speeds.',
      impact: 'Positive - Optimized images contribute to good Core Web Vitals scores.'
    });
    score += 15;
  }
  
  // Minification Analysis
  if (data.hasMinifiedCSS && data.hasMinifiedJS) {
    checks.push({
      factor: 'Code Minification',
      status: 'excellent',
      description: 'CSS and JavaScript files are minified',
      recommendation: 'Perfect! Minified code reduces file sizes and improves loading.',
      impact: 'Medium - Minification typically reduces file sizes by 10-30%.'
    });
    score += 15;
  } else {
    const missing = [];
    if (!data.hasMinifiedCSS) missing.push('CSS');
    if (!data.hasMinifiedJS) missing.push('JavaScript');
    
    checks.push({
      factor: 'Code Minification',
      status: 'warning',
      description: `${missing.join(' and ')} files not minified`,
      recommendation: 'Minify CSS and JavaScript files to reduce file sizes.',
      howToFix: [
        'Use build tools like Webpack, Gulp, or Grunt for minification',
        'Enable minification in your CMS or framework',
        'Use online minification tools for manual optimization'
      ],
      impact: 'Medium - Minification can reduce code file sizes by 10-30%.'
    });
    score += 5;
  }
  
  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeAdvancedTechnical(data: any, url: string): any {
  const checks = [];
  let score = 0;
  const maxScore = 100;
  
  // Robots.txt Analysis (we'll add a note since we can't fetch it in real-time)
  const robotsUrl = data.robotsTxtUrl;
  checks.push({
    factor: 'Robots.txt File',
    status: 'neutral',
    description: 'Robots.txt should be checked manually',
    recommendation: `Check if robots.txt exists and is properly configured at: ${robotsUrl}`,
    technicalDetails: 'Robots.txt guides search engine crawlers on which pages to index.',
    howToFix: [
      'Create robots.txt file in website root directory',
      'Include sitemap location: Sitemap: https://yoursite.com/sitemap.xml',
      'Use Allow/Disallow directives appropriately',
      'Test with Google Search Console'
    ],
    impact: 'Medium - Proper robots.txt helps search engines crawl your site efficiently.'
  });
  score += 12;
  
  // Service Worker Analysis
  if (data.hasServiceWorker) {
    checks.push({
      factor: 'Service Worker',
      status: 'excellent',
      description: 'Service worker detected - enables offline functionality',
      recommendation: 'Great! Service workers improve performance and enable offline access.',
      technicalDetails: 'Service workers enable caching strategies and push notifications.',
      impact: 'Medium - Service workers improve performance and user experience.'
    });
    score += 18;
  } else {
    checks.push({
      factor: 'Service Worker',
      status: 'neutral',
      description: 'No service worker detected',
      recommendation: 'Consider implementing service worker for better performance and PWA features.',
      technicalDetails: 'Service workers enable advanced caching and offline functionality.',
      impact: 'Low - Service workers are beneficial but not required for basic SEO.'
    });
    score += 10;
  }
  
  // Web App Manifest
  if (data.hasManifest) {
    checks.push({
      factor: 'Web App Manifest',
      status: 'good',
      description: 'Web app manifest detected',
      recommendation: 'Good! Manifest enables "Add to Home Screen" functionality.',
      technicalDetails: 'Web app manifest makes your site installable on mobile devices.',
      impact: 'Medium - Manifest enables PWA features and mobile app-like experience.'
    });
    score += 15;
  } else {
    checks.push({
      factor: 'Web App Manifest',
      status: 'neutral',
      description: 'No web app manifest detected',
      recommendation: 'Consider adding manifest.json for PWA capabilities.',
      howToFix: [
        'Create manifest.json with app details',
        'Include icons in various sizes (192x192, 512x512)',
        'Set display mode and theme colors',
        'Link manifest in HTML head section'
      ],
      impact: 'Low - Manifest is beneficial for PWA features but not required for SEO.'
    });
    score += 8;
  }
  
  // AMP Analysis
  if (data.hasAmp) {
    checks.push({
      factor: 'AMP Implementation',
      status: 'good',
      description: 'AMP (Accelerated Mobile Pages) detected',
      recommendation: 'AMP can improve mobile loading speed significantly.',
      technicalDetails: 'AMP provides ultra-fast mobile experiences with strict HTML rules.',
      impact: 'Medium - AMP can improve mobile search rankings and user experience.'
    });
    score += 15;
  } else {
    checks.push({
      factor: 'AMP Implementation',
      status: 'neutral',
      description: 'No AMP implementation detected',
      recommendation: 'AMP is optional but can boost mobile performance for content sites.',
      technicalDetails: 'AMP creates lightning-fast mobile pages with Google\'s framework.',
      impact: 'Low - AMP is beneficial for publishers but not required for all sites.'
    });
    score += 8;
  }
  
  // Additional Meta Tags Analysis
  if (data.metaThemeColor) {
    checks.push({
      factor: 'Theme Color Meta Tag',
      status: 'good',
      description: `Theme color set to: ${data.metaThemeColor}`,
      recommendation: 'Theme color enhances browser UI integration.',
      technicalDetails: 'Theme color customizes browser address bar on mobile devices.',
      impact: 'Low - Small UX improvement but shows attention to detail.'
    });
    score += 10;
  } else {
    checks.push({
      factor: 'Theme Color Meta Tag',
      status: 'neutral',
      description: 'No theme color meta tag found',
      recommendation: 'Add theme-color meta tag for better mobile browser integration.',
      howToFix: ['Add <meta name="theme-color" content="#your-brand-color"> to HTML head'],
      impact: 'Low - Minor UX improvement for mobile users.'
    });
    score += 6;
  }
  
  // Apple Mobile Web App Meta Tags
  if (data.metaAppleMobileWebApp) {
    checks.push({
      factor: 'Apple Mobile Web App Meta Tags',
      status: 'good',
      description: 'Apple mobile web app meta tags detected',
      recommendation: 'Good iOS integration for web app functionality.',
      impact: 'Low - Improves experience when added to iOS home screen.'
    });
    score += 8;
  } else {
    checks.push({
      factor: 'Apple Mobile Web App Meta Tags',
      status: 'neutral',
      description: 'No Apple mobile web app meta tags found',
      recommendation: 'Consider adding for better iOS integration if relevant.',
      howToFix: [
        'Add apple-mobile-web-app-capable meta tag',
        'Set apple-mobile-web-app-status-bar-style',
        'Include apple-touch-icon links'
      ],
      impact: 'Low - Beneficial for iOS users who add site to home screen.'
    });
    score += 6;
  }
  
  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

function analyzeModernSEO(data: any): any {
  const checks = [];
  let score = 0;
  const maxScore = 100;
  
  // Voice Search Optimization
  const content = data.content || '';
  const hasQuestions = (content.match(/\?/g) || []).length;
  const hasNaturalLanguage = /\b(how to|what is|where can|when does|why should|who is)\b/gi.test(content);
  const hasLongTailKeywords = /\b\w+\s+\w+\s+\w+\s+\w+/g.test(content);
  
  if (hasNaturalLanguage && hasQuestions >= 3) {
    checks.push({
      factor: 'Voice Search Optimization',
      status: 'excellent',
      description: `Natural language patterns and ${hasQuestions} questions found`,
      recommendation: 'Excellent voice search optimization with conversational content.',
      technicalDetails: 'Voice searches often use natural language and question formats.',
      impact: 'High - Voice search is growing rapidly, especially on mobile devices.'
    });
    score += 30;
  } else if (hasNaturalLanguage || hasQuestions >= 1) {
    checks.push({
      factor: 'Voice Search Optimization',
      status: 'good',
      description: 'Some voice search optimization elements detected',
      recommendation: 'Good start! Consider adding more conversational content.',
      howToFix: [
        'Include FAQ sections with natural questions',
        'Use conversational language in content',
        'Target long-tail keywords that match speech patterns',
        'Structure content to answer specific questions'
      ],
      impact: 'High - Voice search optimization is becoming increasingly important.'
    });
    score += 18;
  } else {
    checks.push({
      factor: 'Voice Search Optimization',
      status: 'warning',
      description: 'Limited voice search optimization detected',
      recommendation: 'Optimize content for voice search queries.',
      howToFix: [
        'Add FAQ sections with natural questions and answers',
        'Use question-based headings (How, What, Where, When, Why)',
        'Include long-tail keywords that match speech patterns',
        'Write in conversational, natural language'
      ],
      impact: 'High - Missing out on growing voice search traffic.'
    });
    score += 8;
  }
  
  // Featured Snippet Optimization
  const hasLists = /<(ul|ol)>/gi.test(data.content || '');
  const hasTables = /<table>/gi.test(data.content || '');
  const hasDefinitions = /:\s*[A-Z][^.!?]*[.!?]/g.test(content);
  
  let snippetScore = 0;
  if (hasLists) snippetScore += 10;
  if (hasTables) snippetScore += 10;
  if (hasDefinitions) snippetScore += 8;
  if (hasQuestions >= 2) snippetScore += 10;
  
  if (snippetScore >= 20) {
    checks.push({
      factor: 'Featured Snippet Optimization',
      status: 'excellent',
      description: 'Content well-structured for featured snippets',
      recommendation: 'Excellent structure for featured snippet eligibility.',
      technicalDetails: 'Lists, tables, and clear answers help win featured snippets.',
      impact: 'High - Featured snippets can significantly increase click-through rates.'
    });
    score += 25;
  } else if (snippetScore >= 10) {
    checks.push({
      factor: 'Featured Snippet Optimization',
      status: 'good',
      description: 'Some content structured for featured snippets',
      recommendation: 'Good start! Add more structured content elements.',
      howToFix: [
        'Create more numbered or bulleted lists',
        'Add comparison tables where relevant',
        'Include clear, concise definitions',
        'Answer questions directly and comprehensively'
      ],
      impact: 'High - Featured snippets provide prime SERP real estate.'
    });
    score += 15;
  } else {
    checks.push({
      factor: 'Featured Snippet Optimization',
      status: 'warning',
      description: 'Content could be better structured for featured snippets',
      recommendation: 'Optimize content structure to target featured snippets.',
      howToFix: [
        'Create numbered or bulleted lists for step-by-step content',
        'Use clear, concise definitions and explanations',
        'Structure data in tables when appropriate',
        'Answer questions directly and comprehensively'
      ],
      impact: 'High - Featured snippets can drive significant organic traffic.'
    });
    score += 8;
  }
  
  // Semantic SEO and Entity Optimization
  const hasSemanticKeywords = /\b(related|similar|types|kinds|examples|benefits|advantages|features|compared to|versus|vs)\b/gi.test(content);
  const hasTopicClusters = content.split(/[.!?]+/).length > 10; // Multiple sentences suggesting topic depth
  const wordCount = (content.split(/\s+/) || []).length;
  
  if (hasSemanticKeywords && hasTopicClusters && wordCount > 500) {
    checks.push({
      factor: 'Semantic SEO & Topic Authority',
      status: 'excellent',
      description: 'Content shows strong semantic optimization and topic depth',
      recommendation: 'Excellent semantic optimization helps search engines understand content context.',
      technicalDetails: 'Semantic keywords and comprehensive topic coverage improve topical authority.',
      impact: 'High - Semantic SEO is crucial for modern search engine understanding.'
    });
    score += 25;
  } else if (hasSemanticKeywords || (hasTopicClusters && wordCount > 300)) {
    checks.push({
      factor: 'Semantic SEO & Topic Authority',
      status: 'good',
      description: 'Some semantic optimization and topic depth detected',
      recommendation: 'Good foundation! Expand with more related topics and semantic keywords.',
      howToFix: [
        'Research related keywords and synonyms for your main topic',
        'Create comprehensive content covering subtopics',
        'Use entity-based keywords (people, places, things)',
        'Link to related content to build topic clusters'
      ],
      impact: 'High - Semantic optimization helps with modern AI-powered search algorithms.'
    });
    score += 15;
  } else {
    checks.push({
      factor: 'Semantic SEO & Topic Authority',
      status: 'warning',
      description: 'Limited semantic optimization and topic depth',
      recommendation: 'Expand content with related keywords and comprehensive topic coverage.',
      howToFix: [
        'Research semantic keywords related to your main topic',
        'Create in-depth content (aim for 1000+ words)',
        'Cover related subtopics and entities',
        'Build internal linking to related content'
      ],
      impact: 'High - Poor semantic optimization limits visibility in modern search results.'
    });
    score += 8;
  }
  
  return {
    score: Math.min(score, maxScore),
    checks,
    maxScore
  };
}

// Fetch Google PageSpeed Insights data (requires API key)
async function getPageSpeedInsights(url: string) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    // Fetch both mobile and desktop PageSpeed data in parallel
    const [mobileResponse, desktopResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`, {
        signal: AbortSignal.timeout(50000)
      }),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop`, {
        signal: AbortSignal.timeout(50000)
      })
    ]);

    if (!mobileResponse.ok || !desktopResponse.ok) {
      throw new Error('PageSpeed API error');
    }

    const [mobileData, desktopData] = await Promise.all([
      mobileResponse.json(),
      desktopResponse.json()
    ]);

    // Helper function to extract Core Web Vitals with proper status
    const extractCoreWebVitals = (lighthouseData: any) => {
      const lcp = lighthouseData?.audits?.['largest-contentful-paint'];
      const inp = lighthouseData?.audits?.['interaction-to-next-paint'] || lighthouseData?.audits?.['max-potential-fid'];
      const cls = lighthouseData?.audits?.['cumulative-layout-shift'];

      const getStatus = (score: number | undefined) => {
        if (!score) return 'poor';
        if (score >= 0.9) return 'good';
        if (score >= 0.5) return 'needs-improvement';
        return 'poor';
      };

      return {
        LCP: {
          value: lcp?.numericValue || 0,
          status: getStatus(lcp?.score)
        },
        INP: {
          value: inp?.numericValue || 0,
          status: getStatus(inp?.score)
        },
        CLS: {
          value: cls?.numericValue || 0,
          status: getStatus(cls?.score)
        }
      };
    };

    return {
      desktop: {
        score: Math.round((desktopData.lighthouseResult?.categories?.performance?.score || 0) * 100),
        coreWebVitals: extractCoreWebVitals(desktopData.lighthouseResult)
      },
      mobile: {
        score: Math.round((mobileData.lighthouseResult?.categories?.performance?.score || 0) * 100),
        coreWebVitals: extractCoreWebVitals(mobileData.lighthouseResult)
      }
    };
  } catch (error) {
    console.error('PageSpeed Insights error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { url } = body;

    // Sanitize input
    url = sanitizeInput(url);

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid URL' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    console.log(`Analyzing SEO for: ${url}`);

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEOShouts-SEOAnalyzer/1.0 (Website Analysis Bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const html = await response.text();
    
    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'No content found at the provided URL' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Parse HTML and analyze
    const parsedData = parseHTML(html, url, response);
    const analysis = analyzeSEO(parsedData, url, response);
    
    // Get PageSpeed Insights data (optional)
    const pageSpeed = await getPageSpeedInsights(url);

    // Add PageSpeed data to technical SEO if available
    if (pageSpeed) {
      const mobileScore = pageSpeed.mobile.score;
      analysis.factors.technicalSEO.checks.push({
        factor: 'Core Web Vitals',
        status: mobileScore >= 90 ? 'good' : mobileScore >= 50 ? 'warning' : 'critical',
        description: `Mobile Performance Score: ${mobileScore}/100, Desktop: ${pageSpeed.desktop.score}/100`
      });

      // Update technical SEO score based on performance
      const performanceBonus = Math.round(mobileScore / 5);
      analysis.factors.technicalSEO.score = Math.min(analysis.factors.technicalSEO.score + performanceBonus, 100);
    }

    // Recalculate overall score
    const categoryScores = Object.values(analysis.factors).map((factor: any) => factor.score);
    analysis.overallScore = Math.round(categoryScores.reduce((sum: number, score: number) => sum + score, 0) / categoryScores.length);

    console.log(`SEO analysis completed for ${url}. Overall Score: ${analysis.overallScore}`);

    return NextResponse.json({
      success: true,
      analysis,
      pageSpeed: pageSpeed,
      timestamp: new Date().toISOString()
    }, { headers: getSecurityHeaders() });

  } catch (error) {
    logSecurityEvent('SEO_ANALYSIS_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      url: 'unknown' 
    }, request);
    
    console.error('SEO analysis error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to analyze webpage. Please try again.' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}