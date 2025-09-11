import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, logSecurityEvent, getSecurityHeaders } from '@/app/lib/security';

// HTML parsing utilities
function parseHTML(html: string) {
  const lowercaseHtml = html.toLowerCase();
  
  return {
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
    internalLinks: [],
    externalLinks: [],
    
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
    hasGzip: false, // Will be determined from response headers
    hasMinifiedCSS: lowercaseHtml.includes('.min.css'),
    hasMinifiedJS: lowercaseHtml.includes('.min.js'),
    
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
    inlineJS: (html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).filter(script => !script.includes('type="application/ld+json"')).length,
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
    hasServiceWorker: html.includes('navigator.serviceWorker'),
    hasWebManifest: html.includes('rel="manifest"'),
    
    // URL structure (to be analyzed separately)
    url: '',
    
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
    keywordDensity: {},
    
    // Technical validation
    htmlValid: true, // Basic validation
    cssValid: true,
    jsErrors: 0,
  };

  // Calculate content metrics
  const content = result.content;
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  result.wordCount = words.length;
  result.characterCount = content.length;
  result.sentenceCount = sentences.length;
  result.paragraphCount = paragraphs.length;
  
  // Calculate text ratio (text content vs HTML size)
  result.textRatio = html.length > 0 ? (content.length / html.length * 100).toFixed(2) : 0;
  
  // Update H1 detection
  result.hasH1 = result.headings.h1.length > 0;
  
  // Calculate internal vs external links
  result.internalLinks = result.links.filter(link => link.isInternal);
  result.externalLinks = result.links.filter(link => link.isExternal);
  
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
  const headings = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
  
  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`<h${i}[^>]*>([^<]*)<\/h${i}>`, 'gi');
    let match;
    while ((match = regex.exec(html)) !== null) {
      headings[`h${i}` as keyof typeof headings].push(match[1].trim());
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

// Analyze SEO factors
function analyzeSEO(parsedData: any, url: string) {
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
      advancedAnalytics: analyzeAdvancedAnalytics(parsedData)
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
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  // Content length analysis
  if (wordCount >= 1000) {
    checks.push({ factor: 'Content Length', status: 'excellent', description: `${wordCount} words - Excellent content length` });
    score += 20;
  } else if (wordCount >= 600) {
    checks.push({ factor: 'Content Length', status: 'good', description: `${wordCount} words - Good content length` });
    score += 15;
  } else if (wordCount >= 300) {
    checks.push({ factor: 'Content Length', status: 'fair', description: `${wordCount} words - Fair content length` });
    score += 10;
  } else {
    checks.push({ factor: 'Content Length', status: 'poor', description: `${wordCount} words - Consider adding more content (300+ words recommended)` });
    score += 3;
  }

  // Content depth analysis
  const avgWordsPerSentence = wordCount / (sentences.length || 1);
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) {
    checks.push({ factor: 'Sentence Length', status: 'good', description: `Average ${Math.round(avgWordsPerSentence)} words per sentence - Optimal readability` });
    score += 8;
  } else if (avgWordsPerSentence > 25) {
    checks.push({ factor: 'Sentence Length', status: 'warning', description: `Average ${Math.round(avgWordsPerSentence)} words per sentence - Consider shorter sentences` });
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
    checks.push({ factor: 'Paragraph Structure', status: 'warning', description: 'Content should be broken into multiple paragraphs' });
    score += 3;
  } else {
    checks.push({ factor: 'Paragraph Structure', status: 'fair', description: `${paragraphs.length} paragraphs - could be improved` });
    score += 5;
  }

  // Keyword density analysis (basic)
  const wordFreq = {};
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanWord.length > 3) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });
  
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count, density: ((count / wordCount) * 100).toFixed(1) }));
  
  const hasGoodKeywordDensity = topWords.some(item => 
    parseFloat(item.density) >= 0.5 && parseFloat(item.density) <= 3.0
  );
  
  if (hasGoodKeywordDensity) {
    checks.push({ factor: 'Keyword Density', status: 'good', description: 'Good keyword density distribution detected' });
    score += 8;
  } else {
    checks.push({ factor: 'Keyword Density', status: 'warning', description: 'Consider optimizing keyword density (0.5-3% recommended)' });
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
  const duplicates = sentences.filter((sentence, index) => 
    sentences.findIndex(s => s.trim() === sentence.trim()) !== index
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
    checks.push({ factor: 'HTTPS Protocol', status: 'critical', description: 'Site must use HTTPS encryption - major ranking factor' });
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
    checks.push({ factor: 'Character Encoding', status: 'critical', description: 'Missing character encoding declaration' });
    score += 1;
  }

  // Language Declaration
  if (data.lang) {
    checks.push({ factor: 'Language Declaration', status: 'good', description: `Page language: ${data.lang}` });
    score += 4;
  } else {
    checks.push({ factor: 'Language Declaration', status: 'warning', description: 'Missing lang attribute on HTML element' });
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
    checks.push({ factor: 'Mobile Viewport', status: 'critical', description: 'Missing viewport meta tag - critical for mobile' });
    score += 1;
  }

  // Canonical URL Implementation
  if (data.canonical) {
    try {
      new URL(data.canonical);
      checks.push({ factor: 'Canonical URL', status: 'excellent', description: 'Canonical URL properly set' });
      score += 8;
    } catch (e) {
      checks.push({ factor: 'Canonical URL', status: 'warning', description: 'Canonical URL format is invalid' });
      score += 4;
    }
  } else {
    checks.push({ factor: 'Canonical URL', status: 'warning', description: 'Missing canonical URL - recommended for SEO' });
    score += 3;
  }

  // Structured Data Analysis
  if (data.structuredData.length > 0) {
    const schemaTypes = data.structuredData.map(schema => schema['@type'] || schema.type || 'Unknown').join(', ');
    checks.push({ factor: 'Structured Data', status: 'excellent', description: `${data.structuredData.length} schema(s) found: ${schemaTypes}` });
    score += 10;
  } else {
    checks.push({ factor: 'Structured Data', status: 'warning', description: 'No structured data found - adds rich snippet potential' });
    score += 3;
  }

  // Favicon Implementation
  if (data.faviconLinks.length > 0) {
    checks.push({ factor: 'Favicon', status: 'good', description: `${data.faviconLinks.length} favicon(s) declared` });
    score += 4;
  } else {
    checks.push({ factor: 'Favicon', status: 'warning', description: 'No favicon found - important for brand recognition' });
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
  
  const presentElements = semanticElements.filter(el => el.present);
  if (presentElements.length >= 4) {
    checks.push({ factor: 'HTML5 Semantics', status: 'excellent', description: `${presentElements.length}/7 semantic elements used` });
    score += 8;
  } else if (presentElements.length >= 2) {
    checks.push({ factor: 'HTML5 Semantics', status: 'good', description: `${presentElements.length}/7 semantic elements used` });
    score += 5;
  } else {
    checks.push({ factor: 'HTML5 Semantics', status: 'warning', description: 'Consider using more HTML5 semantic elements' });
    score += 2;
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
      checks.push({ factor: 'Title Tag Length', status: 'warning', description: `${titleLength} characters - Too long, may be truncated` });
      score += 5;
    } else {
      checks.push({ factor: 'Title Tag Length', status: 'critical', description: `${titleLength} characters - Too short` });
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
    checks.push({ factor: 'Title Tag', status: 'critical', description: 'Missing title tag - critical SEO element' });
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
      checks.push({ factor: 'Meta Description CTA', status: 'warning', description: 'Consider adding a call-to-action' });
      score += 1;
    }
    
  } else {
    checks.push({ factor: 'Meta Description', status: 'critical', description: 'Missing meta description - important for SERP CTR' });
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
    checks.push({ factor: 'H1 Tag', status: 'critical', description: 'Missing H1 tag - important for content hierarchy' });
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
    
    if (hierarchyScore >= 5) {
      checks.push({ factor: 'Heading Hierarchy', status: 'excellent', description: `Excellent hierarchy: ${hierarchyNotes.join(', ')}` });
      score += 8;
    } else if (hierarchyScore >= 3) {
      checks.push({ factor: 'Heading Hierarchy', status: 'good', description: `Good hierarchy: ${hierarchyNotes.join(', ')}` });
      score += 6;
    } else {
      checks.push({ factor: 'Heading Hierarchy', status: 'fair', description: `Basic hierarchy: ${hierarchyNotes.join(', ')}` });
      score += 3;
    }
    
  } else {
    checks.push({ factor: 'Heading Hierarchy', status: 'warning', description: 'Insufficient heading structure - use more headings' });
    score += 2;
  }

  // Image Optimization Analysis
  const totalImages = data.images.length;
  const imagesWithAlt = data.images.filter(img => img.hasAlt && img.alt.trim().length > 0).length;
  const imagesWithTitle = data.images.filter(img => img.hasTitle).length;
  const lazyLoadedImages = data.images.filter(img => img.hasLazyLoading).length;
  
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
  const internalLinks = data.links.filter(link => link.isInternal).length;
  const externalLinks = data.links.filter(link => link.isExternal).length;
  const noFollowLinks = data.links.filter(link => link.hasNoFollow).length;
  const targetBlankLinks = data.links.filter(link => link.hasTargetBlank).length;
  
  if (internalLinks > 0) {
    if (internalLinks >= 3 && internalLinks <= 10) {
      checks.push({ factor: 'Internal Links', status: 'excellent', description: `${internalLinks} internal links - optimal range` });
      score += 6;
    } else if (internalLinks > 10) {
      checks.push({ factor: 'Internal Links', status: 'warning', description: `${internalLinks} internal links - may be excessive` });
      score += 4;
    } else {
      checks.push({ factor: 'Internal Links', status: 'good', description: `${internalLinks} internal links found` });
      score += 5;
    }
  } else {
    checks.push({ factor: 'Internal Links', status: 'warning', description: 'No internal links - missed opportunity for site architecture' });
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
  const imagesWithAlt = data.images.filter(img => img.hasAlt && img.alt.trim().length > 0).length;
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
    checks.push({ factor: 'ARIA Labels', status: 'warning', description: 'No ARIA labels found - consider adding for better accessibility' });
  }
  
  // Language declaration
  if (data.lang) {
    accessibilityScore += 6;
    checks.push({ factor: 'Language Declaration', status: 'good', description: `Page language: ${data.lang} - helps screen readers` });
  } else {
    accessibilityScore += 2;
    checks.push({ factor: 'Language Declaration', status: 'warning', description: 'Missing lang attribute - important for screen readers' });
  }
  
  score += accessibilityScore;

  // Form Accessibility
  if (data.forms && data.forms.length > 0) {
    const formsWithLabels = data.forms.filter(form => form.hasLabels).length;
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
    checks.push({ factor: 'Image Loading', status: 'warning', description: 'Consider lazy loading for better performance' });
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
    checks.push({ factor: 'Image Formats', status: 'warning', description: 'Consider using WebP/AVIF for better compression' });
  } else {
    performanceScore += 4;
    checks.push({ factor: 'Image Formats', status: 'neutral', description: 'No images to optimize' });
  }
  
  score += performanceScore;

  // Content Readability
  let readabilityScore = 0;
  const content = data.content || '';
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
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
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
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
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgSentenceLength, 2), 0) / sentenceLengths.length;
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
    checks.push({ factor: 'Text Emphasis', status: 'warning', description: 'Consider using bold/italic for key points' });
  }
  
  score += formattingScore;

  // Content Scannability
  let scannabilityScore = 0;
  
  // Heading distribution
  const totalHeadings = Object.values(data.headings || {}).reduce((sum: number, headings: any) => sum + (headings?.length || 0), 0);
  const headingsPerWord = totalHeadings / Math.max(wordCount, 1) * 1000;
  
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
    checks.push({ factor: 'OG Title', status: 'warning', description: 'Missing Open Graph title' });
  }

  if (data.ogDescription) {
    checks.push({ factor: 'OG Description', status: 'good', description: 'Open Graph description is set' });
    ogScore += 25;
  } else {
    checks.push({ factor: 'OG Description', status: 'warning', description: 'Missing Open Graph description' });
  }

  if (data.ogImage) {
    checks.push({ factor: 'OG Image', status: 'good', description: 'Open Graph image is set' });
    ogScore += 25;
  } else {
    checks.push({ factor: 'OG Image', status: 'warning', description: 'Missing Open Graph image' });
  }

  score += ogScore;

  // Twitter Cards
  if (data.twitterCard) {
    checks.push({ factor: 'Twitter Cards', status: 'good', description: 'Twitter Card is configured' });
    score += 25;
  } else {
    checks.push({ factor: 'Twitter Cards', status: 'warning', description: 'Twitter Card not configured' });
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
    checks.push({ factor: 'Content Security Policy', status: 'warning', description: 'Consider implementing CSP for better security' });
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

// Fetch Google PageSpeed Insights data (requires API key)
async function getPageSpeedInsights(url: string) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  
  if (!apiKey) {
    return {
      error: 'PageSpeed Insights API key not configured',
      hasData: false
    };
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      hasData: true,
      performanceScore: data.lighthouseResult?.categories?.performance?.score * 100 || 0,
      accessibilityScore: data.lighthouseResult?.categories?.accessibility?.score * 100 || 0,
      bestPracticesScore: data.lighthouseResult?.categories?.['best-practices']?.score * 100 || 0,
      seoScore: data.lighthouseResult?.categories?.seo?.score * 100 || 0,
      coreWebVitals: {
        lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A',
        inp: data.lighthouseResult?.audits?.['max-potential-fid']?.displayValue || 'N/A',
        cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || 'N/A'
      }
    };
  } catch (error) {
    console.error('PageSpeed Insights error:', error);
    return {
      error: 'Failed to fetch PageSpeed data',
      hasData: false
    };
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
    const parsedData = parseHTML(html);
    const analysis = analyzeSEO(parsedData, url);
    
    // Get PageSpeed Insights data (optional)
    const pageSpeedData = await getPageSpeedInsights(url);
    
    // Add PageSpeed data to technical SEO if available
    if (pageSpeedData.hasData) {
      analysis.factors.technicalSEO.checks.push({
        factor: 'Core Web Vitals',
        status: pageSpeedData.performanceScore >= 90 ? 'good' : pageSpeedData.performanceScore >= 50 ? 'warning' : 'critical',
        description: `Performance Score: ${Math.round(pageSpeedData.performanceScore)}/100, LCP: ${pageSpeedData.coreWebVitals.lcp}, CLS: ${pageSpeedData.coreWebVitals.cls}`
      });
      
      // Update technical SEO score based on performance
      const performanceBonus = Math.round(pageSpeedData.performanceScore / 5);
      analysis.factors.technicalSEO.score = Math.min(analysis.factors.technicalSEO.score + performanceBonus, 100);
    }

    // Recalculate overall score
    const categoryScores = Object.values(analysis.factors).map(factor => factor.score);
    analysis.overallScore = Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length);

    console.log(`SEO analysis completed for ${url}. Overall Score: ${analysis.overallScore}`);

    return NextResponse.json({
      success: true,
      analysis,
      pageSpeedData: pageSpeedData.hasData ? pageSpeedData : null,
      timestamp: new Date().toISOString()
    }, { headers: getSecurityHeaders() });

  } catch (error) {
    logSecurityEvent('SEO_ANALYSIS_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      url: body?.url 
    }, request);
    
    console.error('SEO analysis error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to analyze webpage. Please try again.' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}