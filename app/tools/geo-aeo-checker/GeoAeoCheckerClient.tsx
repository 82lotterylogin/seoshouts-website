'use client'

import { useState, useEffect } from 'react'
import ShapeGrid from '../../components/ShapeGrid'

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Check {
  label: string
  passed: boolean
  impact: 'high' | 'medium' | 'low'
  detail: string
  fix: string
}

interface Category {
  id: string
  name: string
  score: number
  weight: number
  checks: Check[]
}

interface AnalysisResults {
  url: string
  finalUrl: string
  overallScore: number
  grade: string
  gradeLabel: string
  gradeColor: string
  categories: Category[]
  topIssues: Check[]
  passedChecks: number
  totalChecks: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURE_ITEMS = [
  { label: '7-Category Audit', desc: 'Schema, crawler access, content, E-E-A-T, FAQ, technical & performance' },
  { label: '0–100 Composite Score', desc: 'Weighted scoring shows exactly where you rank on AI readiness' },
  { label: 'Fix Recommendations', desc: 'Every failed check includes a specific actionable fix' },
  { label: 'Free, No Login', desc: 'Analyze any public URL, unlimited times, no account needed' },
]

const FAQ_ITEMS = [
  { q: 'What is a GEO/AEO score?', a: "A GEO/AEO score is a 0–100 composite measure of how well-optimized a web page is for AI search engines and answer engines. It combines scores across seven categories: schema markup, AI crawler access, content structure, E-E-A-T signals, FAQ readiness, technical signals, and page performance. A higher score correlates with higher citation frequency in Google AI Overviews, ChatGPT, Perplexity, and other AI search platforms." },
  { q: 'What is the difference between GEO and AEO?', a: "AEO (Answer Engine Optimization) focuses on structuring content so AI answer engines can extract direct answers — through FAQPage schema, question-format headings, and concise answer paragraphs. GEO (Generative Engine Optimization) is broader — it focuses on making content trustworthy and citable by generative AI models, which requires E-E-A-T signals, proprietary data, and expert attribution in addition to structural signals. In practice, optimizing for both simultaneously is the most effective approach." },
  { q: 'How accurate is the GEO/AEO score?', a: "The score is based on signals that are directly detectable in your page's HTML and HTTP headers. It does not access Google's internal scoring, Perplexity's index, or any AI model's training data. Think of it as a structural audit — it tells you whether your page has the signals that research shows correlate with AI citations. Actual citation frequency depends on many factors including domain authority, content quality, and competition." },
  { q: 'Why is my schema score low when I have schema markup?', a: "The checker looks for specific, high-impact schema types: FAQPage, Organization, Author (Person), and BreadcrumbList. Having WebSite or Product schema alone will not score highly. FAQPage schema is the single most impactful schema type for AI citation and receives the most weight in the schema category." },
  { q: 'Can a page score 100?', a: "In theory yes, but in practice a score of 85–90 is excellent. Some checks — like hreflang (relevant only for multilingual sites) — may not apply to your page. Focus on A grade (85+) rather than perfect 100." },
  { q: 'How often should I run the GEO/AEO checker?', a: "Run it after any significant content update, after adding schema markup, after changing your robots.txt, and monthly as part of your regular SEO audit. Track your score over time to measure the impact of individual improvements." },
  { q: 'Does improving my GEO/AEO score hurt traditional SEO?', a: "No — the signals this tool checks (schema markup, E-E-A-T, content structure, FAQ sections) are all positive signals for traditional Google search rankings too. GEO/AEO optimization and traditional SEO are complementary, not competing." },
  { q: 'What should I fix first after getting my score?', a: "Fix High-impact failed checks first. The tool sorts your issues by impact level. Typically, the fastest wins are: adding FAQPage schema (if missing), writing an answer capsule, converting H2s to question format, and ensuring AI crawlers are not blocked." },
]

// The 7 weighted audit categories (points sum to 100). Used by the score-composition explorer.
const AUDIT_CATEGORIES = [
  { id: 'schema',      title: '1. Schema Markup',                    pts: 20, text: "Schema markup is the single highest-impact signal for AI search readiness. AI models are trained to recognize Schema.org vocabulary as authoritative metadata about your page. This category checks for FAQPage schema (the most impactful for AI answer extraction), Organization schema with entity signals, BreadcrumbList for hierarchy understanding, Article schema with author attribution, and HowTo or SoftwareApplication for tool and tutorial pages. Pages with comprehensive schema markup are cited in Google AI Overviews at rates 3–4x higher than pages with no schema (Conductor, 2025)." },
  { id: 'ai-crawl',   title: '2. AI Crawler Access',                pts: 18, text: "Your content cannot be cited by AI if AI crawlers cannot access it. This category checks whether major AI bots are blocked at the page level via meta robots tags or X-Robots-Tag headers, whether a canonical tag is present to prevent duplicate content confusion, whether the page is HTTPS (a baseline trust signal), and whether an llms.txt file is referenced — the emerging standard for telling AI models what a site is about." },
  { id: 'content',    title: '3. Content Structure for AI Extraction', pts: 18, text: "AI models extract answers from content that is structured for extraction. This category checks for a direct answer capsule in the first 300 characters, question-format H2/H3 headings, presence of data and statistics, appropriate paragraph length (under 120 words), comparison tables, and minimum content depth (500+ words). The key insight: AI models do not read content the way humans do. They parse structure." },
  { id: 'eeat',       title: '4. E-E-A-T Signals',                  pts: 15, text: "Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) governs both traditional ranking and AI citation eligibility. This category checks for visible author attribution, author schema with Person type, explicit expertise or credential mentions, links to About/Team pages, external citations and references, publication dates, contact information, and legal page links." },
  { id: 'faq',        title: '5. FAQ & Q&A Readiness',              pts: 12, text: "FAQs are the highest-ROI content format for AI citation. AI models are specifically designed to match user questions to pages that answer them. This category checks for FAQPage schema with 3+ Q&A pairs, a visual FAQ section in the HTML, question-format headings throughout the content, and substantive answers (50+ words each) in the FAQ schema." },
  { id: 'technical',  title: '6. Technical AI Readiness',           pts: 10, text: "Basic technical signals that affect AI model confidence in your content: meta description presence, Open Graph tags (used by AI scraping tools for entity data), HTML lang attribute for language classification, UTF-8 charset declaration, viewport meta for mobile-friendliness, and hreflang for multilingual sites." },
  { id: 'performance', title: '7. Page Performance Signals',        pts: 7,  text: "Performance signals that correlate with AI citation worthiness: GZIP/Brotli compression, image alt text coverage, browser caching headers, and lazy loading. Slower pages are crawled less frequently by all bots — including AI training crawlers — reducing the recency and completeness of your content in AI model training data." },
]

// ─── Score Calculation Helpers ────────────────────────────────────────────────

function calculateCategoryScore(checks: Check[], maxPoints: number): number {
  const weights: Record<string, number> = { high: 3, medium: 2, low: 1 }
  const totalWeight = checks.reduce((sum, c) => sum + weights[c.impact], 0)
  const earnedWeight = checks.filter((c) => c.passed).reduce((sum, c) => sum + weights[c.impact], 0)
  if (totalWeight === 0) return 0
  return Math.round((earnedWeight / totalWeight) * maxPoints)
}

function calculateOverallScore(categories: Category[]): number {
  return categories.reduce((sum, c) => sum + c.score, 0)
}

function getGrade(score: number): { grade: string; label: string; color: string } {
  if (score >= 85) return { grade: 'A', label: 'AI-Ready', color: 'green' }
  if (score >= 70) return { grade: 'B', label: 'Good — Minor Fixes Needed', color: 'lime' }
  if (score >= 55) return { grade: 'C', label: 'Average — Several Issues', color: 'yellow' }
  if (score >= 40) return { grade: 'D', label: 'Poor — Major Issues', color: 'orange' }
  return { grade: 'F', label: 'Critical — Not AI-Ready', color: 'red' }
}

// ─── Category Analyzers ───────────────────────────────────────────────────────

function analyzeSchema(html: string): Category {
  const schemaBlocks: object[] = []
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try { const parsed = JSON.parse(match[1]); schemaBlocks.push(parsed) } catch { /* skip */ }
  }
  const schemas = schemaBlocks.flatMap((b: object) => {
    const block = b as Record<string, unknown>
    return block['@graph'] ? (block['@graph'] as object[]) : [b]
  })
  const types = schemas.map((s) => (s as Record<string, unknown>)['@type']).filter(Boolean).flatMap((t) => (Array.isArray(t) ? t : [t])) as string[]

  const checks: Check[] = [
    { label: 'Any schema markup present', passed: types.length > 0, impact: 'high', detail: types.length > 0 ? `Found: ${[...new Set(types)].join(', ')}` : 'No schema found', fix: 'Add at minimum Organization and WebPage schema. Use our Schema Generator.' },
    { label: 'FAQPage schema present', passed: types.includes('FAQPage'), impact: 'high', detail: types.includes('FAQPage') ? 'FAQPage schema detected' : 'No FAQPage schema', fix: 'Add FAQPage schema to your FAQ section. AI engines extract Q&A pairs directly from this.' },
    { label: 'Organization or LocalBusiness schema', passed: types.some((t) => ['Organization', 'LocalBusiness', 'Corporation'].includes(t)), impact: 'high', detail: types.some((t) => ['Organization', 'LocalBusiness'].includes(t)) ? 'Organization entity found' : 'Missing', fix: 'Add Organization schema with name, url, logo, sameAs (social profiles), and contactPoint.' },
    { label: 'BreadcrumbList schema', passed: types.includes('BreadcrumbList'), impact: 'medium', detail: types.includes('BreadcrumbList') ? 'Breadcrumb schema present' : 'No breadcrumb schema', fix: 'Add BreadcrumbList schema to show page hierarchy to AI models.' },
    { label: 'Article or WebPage schema with author', passed: schemas.some((s) => { const schema = s as Record<string, unknown>; return (['Article', 'BlogPosting', 'WebPage'].includes(schema['@type'] as string) && schema.author) }), impact: 'medium', detail: 'Checks for author entity in Article/WebPage schema', fix: 'Add author schema with Person type, name, and url for E-E-A-T signals.' },
    { label: 'HowTo or SoftwareApplication schema (for tool/how-to pages)', passed: types.some((t) => ['HowTo', 'SoftwareApplication'].includes(t)), impact: 'low', detail: 'Optional but beneficial for tool and tutorial pages', fix: 'Add HowTo or SoftwareApplication schema if page is a tool or tutorial.' },
  ]
  return { id: 'schema', name: 'Schema Markup', score: calculateCategoryScore(checks, 20), weight: 20, checks }
}

function analyzeAiCrawlerAccess(html: string, headers: Record<string, string>): Category {
  const metaRobotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)
  const metaRobots = metaRobotsMatch ? metaRobotsMatch[1].toLowerCase() : ''
  const xRobotsTag = (headers['x-robots-tag'] || '').toLowerCase()
  const isNoindex = metaRobots.includes('noindex') || xRobotsTag.includes('noindex')
  const isNofollow = metaRobots.includes('nofollow') || xRobotsTag.includes('nofollow')
  const hasLlmsTxtRef = html.includes('llms.txt')
  const hasGptBot = html.includes('gptbot') && html.includes('noindex')
  const hasClaudeBot = html.includes('claudebot') && html.includes('noindex')
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  const hasCanonical = !!canonicalMatch
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null

  const checks: Check[] = [
    { label: 'Page is indexable (no noindex)', passed: !isNoindex, impact: 'high', detail: isNoindex ? `Page is blocked: ${metaRobots || xRobotsTag}` : 'Page is indexable', fix: 'Remove noindex directive if you want AI crawlers to access this page.' },
    { label: 'Page allows link following (no nofollow)', passed: !isNofollow, impact: 'medium', detail: isNofollow ? 'Nofollow detected — limits AI content graph traversal' : 'Follow enabled', fix: 'Consider whether nofollow on this page is intentional.' },
    { label: 'Canonical tag present', passed: hasCanonical, impact: 'high', detail: hasCanonical ? `Canonical: ${canonicalUrl}` : 'No canonical tag found', fix: 'Add a canonical tag to prevent duplicate content confusion for AI models.' },
    { label: 'llms.txt file referenced or known', passed: hasLlmsTxtRef, impact: 'medium', detail: hasLlmsTxtRef ? 'llms.txt reference detected' : 'No llms.txt reference found on page', fix: 'Create a /llms.txt file at your domain root to guide AI models about your site.' },
    { label: 'No AI-specific bot blocks on page level', passed: !hasGptBot && !hasClaudeBot, impact: 'high', detail: hasGptBot || hasClaudeBot ? 'AI bot noindex directive found — check if intentional' : 'No AI-specific blocks detected at page level', fix: 'If you want AI citations, ensure major AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are allowed.' },
    { label: 'HTTPS protocol in use', passed: !!(hasCanonical && canonicalUrl && canonicalUrl.startsWith('https://')), impact: 'medium', detail: 'AI models and search engines prioritize secure pages', fix: 'Ensure the site is served over HTTPS and canonical points to HTTPS URL.' },
  ]
  return { id: 'ai-crawl', name: 'AI Crawler Access', score: calculateCategoryScore(checks, 18), weight: 18, checks }
}

function analyzeContentStructure(html: string): Category {
  const cleanHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
  const h1Matches = cleanHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []
  const h1Count = h1Matches.length
  const h1Text = h1Count > 0 ? (h1Matches[0] ?? '').replace(/<[^>]+>/g, '').trim() : ''
  const h2Matches = cleanHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []
  const h2Texts = h2Matches.map((h) => h.replace(/<[^>]+>/g, '').trim())
  const questionH2s = h2Texts.filter((h) => /^(what|how|why|when|where|who|which|can|does|is|are|should|will|do)/i.test(h))
  const hasQuestionH2s = questionH2s.length >= 2
  const bodyTextMatch = cleanHtml.match(/<p[^>]*>([\s\S]{50,400}?)<\/p>/i)
  const firstParaText = bodyTextMatch ? bodyTextMatch[1].replace(/<[^>]+>/g, '').trim() : ''
  const hasAnswerCapsule = firstParaText.length >= 80 && firstParaText.length <= 350
  const textContent = cleanHtml.replace(/<[^>]+>/g, ' ')
  const statPattern = /\d+(\.\d+)?(%|million|billion|thousand|k\b|\+|x\b)/gi
  const statMatches = textContent.match(statPattern) || []
  const hasStats = statMatches.length >= 3
  const allParas = cleanHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || []
  const paraTexts = allParas.map((p) => p.replace(/<[^>]+>/g, '').trim()).filter((p) => p.length > 50)
  const longParas = paraTexts.filter((p) => p.split(/\s+/).length > 120)
  const hasTooLongParas = longParas.length > 3
  const hasTables = /<table/i.test(cleanHtml)
  const hasLists = /<(ul|ol)/i.test(cleanHtml)
  const wordCount = textContent.replace(/\s+/g, ' ').trim().split(' ').length

  const checks: Check[] = [
    { label: 'Single H1 tag present', passed: h1Count === 1, impact: 'high', detail: h1Count === 0 ? 'No H1 found' : h1Count > 1 ? `${h1Count} H1s found (should be 1)` : `H1: "${h1Text.slice(0, 60)}"`, fix: 'Use exactly one H1 per page. It should contain your primary keyword and clearly define the page topic.' },
    { label: 'Answer capsule in first 300 characters', passed: hasAnswerCapsule, impact: 'high', detail: hasAnswerCapsule ? `First paragraph: ${firstParaText.length} chars — good length` : 'First paragraph missing or too long/short for AI extraction', fix: 'Write a 120–300 character direct-answer paragraph as the very first content on the page.' },
    { label: 'Question-format H2 headings (2+ detected)', passed: hasQuestionH2s, impact: 'high', detail: hasQuestionH2s ? `${questionH2s.length} question H2s found` : `${h2Texts.length} H2s found but ${questionH2s.length} use question format`, fix: 'Rewrite at least 2–3 H2s as questions (What is X? How does Y work? Why should you Z?).' },
    { label: 'Statistics or data points present (3+ found)', passed: hasStats, impact: 'medium', detail: hasStats ? `${statMatches.length} data points found` : 'No numerical statistics detected', fix: 'Add cited statistics every 150–200 words. AI models prefer content with verifiable data.' },
    { label: 'Paragraphs are concise (under 120 words)', passed: !hasTooLongParas, impact: 'medium', detail: hasTooLongParas ? `${longParas.length} paragraphs exceed 120 words` : 'Paragraph lengths are appropriate', fix: 'Break paragraphs over 120 words into shorter chunks. AI models extract from shorter, focused paragraphs more accurately.' },
    { label: 'Comparison tables present', passed: hasTables, impact: 'medium', detail: hasTables ? 'Tables detected — good for AI structured data extraction' : 'No tables found', fix: 'Add comparison tables for decision queries. Tables are extracted directly by AI models for structured answers.' },
    { label: 'Content lists present (UL/OL)', passed: hasLists, impact: 'low', detail: hasLists ? 'Lists detected' : 'No bullet/numbered lists found', fix: 'Use lists for steps, features, and items. AI models cite list content frequently in answers.' },
    { label: 'Sufficient content depth (500+ words)', passed: wordCount >= 500, impact: 'medium', detail: `Estimated word count: ~${wordCount}`, fix: 'Pages under 500 words rarely get cited by AI models. Aim for 1,000+ for informational pages.' },
  ]
  return { id: 'content', name: 'Content Structure', score: calculateCategoryScore(checks, 18), weight: 18, checks }
}

function analyzeEeat(html: string): Category {
  const lowerHtml = html.toLowerCase()
  const hasAuthorName = /author|written by|by [a-z]+ [a-z]+/i.test(html)
  const hasAuthorSchema = html.includes('"author"') && html.includes('"Person"')
  const expertiseTerms = ['years of experience', 'certified', 'expert', 'specialist', 'founder', 'ceo', 'cto', 'phd', 'mba', 'award']
  const hasExpertiseSignal = expertiseTerms.some((t) => lowerHtml.includes(t))
  const hasAboutLink = /href=["'][^"']*\/(about|team|meet|experts|founder)[^"']*["']/i.test(html)
  const hasSocialProof = /(trustpilot|google review|clutch|g2|capterra|rated|reviews?)/i.test(html)
  const externalLinkMatches = html.match(/<a[^>]+href=["']https?:\/\/(?!seoshouts\.com)[^"']+["']/gi) || []
  const hasExternalCitations = externalLinkMatches.length >= 3
  const hasContactInfo = /(contact|email|phone|address|\+\d{5,})/i.test(html)
  const hasDateSignal = /(published|updated|last modified|datePublished|dateModified)/i.test(html)
  const hasLegalLinks = /href=["'][^"']*(privacy|terms|disclaimer)[^"']*["']/i.test(html)

  const checks: Check[] = [
    { label: 'Author name or byline visible', passed: hasAuthorName, impact: 'high', detail: hasAuthorName ? 'Author attribution detected' : 'No author attribution found', fix: 'Add a visible author byline with name and title. AI models use this as an expertise signal.' },
    { label: 'Author schema with Person type', passed: hasAuthorSchema, impact: 'high', detail: hasAuthorSchema ? 'Author schema (Person) present' : 'No Person schema for author', fix: 'Add schema with "@type": "Person", "name", "url", and "sameAs" for author profiles.' },
    { label: 'Expertise or credentials mentioned', passed: hasExpertiseSignal, impact: 'high', detail: hasExpertiseSignal ? 'Expertise/credential signals found' : 'No credentials or expertise signals detected', fix: 'Explicitly state credentials: "X years of experience," certifications, industry recognition.' },
    { label: 'About/Team page linked', passed: hasAboutLink, impact: 'medium', detail: hasAboutLink ? 'Link to About/Team page detected' : 'No link to About or Team page', fix: 'Link to your About or Meet the Experts page. AI models parse these to verify expertise claims.' },
    { label: 'External citations or references (3+)', passed: hasExternalCitations, impact: 'medium', detail: `${externalLinkMatches.length} external links found`, fix: 'Cite external authoritative sources. AI models trust content that references verifiable data.' },
    { label: 'Publication or update date present', passed: hasDateSignal, impact: 'medium', detail: hasDateSignal ? 'Date signal found' : 'No date signals detected', fix: 'Add datePublished and dateModified to your schema and visibly on the page.' },
    { label: 'Contact information present', passed: hasContactInfo, impact: 'low', detail: hasContactInfo ? 'Contact signals found' : 'No contact information detected', fix: 'Include contact email or phone. Signals legitimacy to AI trust assessment.' },
    { label: 'Privacy/Terms legal pages linked', passed: hasLegalLinks, impact: 'low', detail: hasLegalLinks ? 'Legal page links found' : 'No privacy/terms links detected', fix: 'Add links to Privacy Policy and Terms of Service — E-E-A-T trust signals.' },
  ]
  void hasSocialProof
  return { id: 'eeat', name: 'E-E-A-T Signals', score: calculateCategoryScore(checks, 15), weight: 15, checks }
}

function analyzeFaq(html: string): Category {
  const hasFaqSchema = html.includes('"FAQPage"')
  const faqSchemaMatches = html.match(/"acceptedAnswer"/g) || []
  const faqSchemaCount = faqSchemaMatches.length
  const hasFaqSection = /(faq|frequently asked|common questions)/i.test(html)
  const questionMatches = html.match(/<h[2-4][^>]*>[^<]*(what|how|why|when|where|who|which|can|does|is|are)[^<]*\?<\/h[2-4]>/gi) || []
  const hasQuestionHeadings = questionMatches.length >= 3
  let avgAnswerLength = 0
  if (hasFaqSchema) {
    const answerMatches = html.match(/"text"\s*:\s*"([^"]{50,})"/g) || []
    const lengths = answerMatches.map((m) => m.length)
    avgAnswerLength = lengths.length > 0 ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0
  }

  const checks: Check[] = [
    { label: 'FAQPage schema markup present', passed: hasFaqSchema, impact: 'high', detail: hasFaqSchema ? `FAQPage schema with ${faqSchemaCount} Q&A pairs` : 'No FAQPage schema', fix: 'Add FAQPage schema to every FAQ section. AI models extract these directly for answers.' },
    { label: 'FAQ schema has 3+ question-answer pairs', passed: faqSchemaCount >= 3, impact: 'high', detail: `${faqSchemaCount} acceptedAnswer entries in schema`, fix: 'Include at least 3 FAQ pairs in schema. More Q&A pairs = more opportunities for AI citations.' },
    { label: 'Visual FAQ section in page content', passed: hasFaqSection, impact: 'medium', detail: hasFaqSection ? 'FAQ section detected in HTML' : 'No FAQ section found', fix: 'Add a dedicated FAQ section with clear heading. Pair with FAQPage schema.' },
    { label: 'Question-format H2/H3 headings (3+ detected)', passed: hasQuestionHeadings, impact: 'high', detail: `${questionMatches.length} question-format headings found`, fix: 'Structure content with question headings. AI models match questions in queries to question headings on pages.' },
    { label: 'FAQ schema answers are substantive (50+ chars)', passed: avgAnswerLength > 100, impact: 'medium', detail: hasFaqSchema ? `Average answer length: ~${Math.round(avgAnswerLength)} chars` : 'No FAQ schema to evaluate', fix: 'Write complete answers in schema — at least 50 words each. Avoid one-sentence answers.' },
  ]
  return { id: 'faq', name: 'FAQ & Q&A Readiness', score: calculateCategoryScore(checks, 12), weight: 12, checks }
}

function analyzeTechnical(html: string, headers: Record<string, string>): Category {
  const hasOgTitle = /property=["']og:title["']/i.test(html)
  const hasOgDescription = /property=["']og:description["']/i.test(html)
  const hasOgImage = /property=["']og:image["']/i.test(html)
  const hasMetaDescription = /name=["']description["'][^>]+content/i.test(html) || /content=["'][^"']{50,}["'][^>]+name=["']description["']/i.test(html)
  const hasHreflang = /hreflang/i.test(html)
  const contentType = headers['content-type'] || ''
  const hasCharset = /charset=utf-8/i.test(contentType) || /charset=["']?utf-8["']?/i.test(html)
  const hasViewport = /name=["']viewport["']/i.test(html)
  const hasLangAttr = /<html[^>]+lang=["'][a-z]{2}/i.test(html)

  const checks: Check[] = [
    { label: 'Meta description present', passed: hasMetaDescription, impact: 'high', detail: hasMetaDescription ? 'Meta description found' : 'No meta description tag', fix: 'Add a 120–155 character meta description. AI models use this as page summary.' },
    { label: 'Open Graph tags (og:title, og:description, og:image)', passed: hasOgTitle && hasOgDescription && hasOgImage, impact: 'medium', detail: `OG tags: title=${hasOgTitle}, description=${hasOgDescription}, image=${hasOgImage}`, fix: 'Add all three core OG tags. AI models scrape OG data for entity understanding.' },
    { label: 'HTML lang attribute set', passed: hasLangAttr, impact: 'high', detail: hasLangAttr ? 'Lang attribute found on html element' : 'No lang attribute on <html>', fix: 'Add lang="en" (or appropriate language) to your <html> tag. Critical for AI language classification.' },
    { label: 'UTF-8 charset declared', passed: hasCharset, impact: 'medium', detail: hasCharset ? 'UTF-8 charset declared' : 'No UTF-8 charset found', fix: 'Declare charset="utf-8" in your HTML head and Content-Type header.' },
    { label: 'Viewport meta tag (mobile-friendly)', passed: hasViewport, impact: 'medium', detail: hasViewport ? 'Viewport meta present' : 'No viewport meta tag', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' },
    { label: 'Hreflang tags (for multilingual sites)', passed: hasHreflang, impact: 'low', detail: hasHreflang ? 'Hreflang tags detected' : 'No hreflang (fine for single-language sites)', fix: 'Add hreflang tags if serving multiple languages/regions. Helps AI serve correct language version.' },
  ]
  return { id: 'technical', name: 'Technical AI Readiness', score: calculateCategoryScore(checks, 10), weight: 10, checks }
}

function analyzePerformance(html: string, headers: Record<string, string>): Category {
  const hasLazyLoading = /loading=["']lazy["']/i.test(html)
  const imgTags = html.match(/<img[^>]+>/gi) || []
  const imgsWithAlt = imgTags.filter((img) => /alt=["'][^"']+["']/i.test(img))
  const altTextRatio = imgTags.length > 0 ? imgsWithAlt.length / imgTags.length : 1
  const cacheControl = headers['cache-control'] || ''
  const hasCaching = cacheControl.length > 0
  const hasGzip = (headers['content-encoding'] || '').includes('gzip') || (headers['content-encoding'] || '').includes('br')

  const checks: Check[] = [
    { label: 'GZIP/Brotli compression enabled', passed: hasGzip, impact: 'medium', detail: hasGzip ? `Compression: ${headers['content-encoding']}` : 'No compression detected', fix: 'Enable GZIP or Brotli compression to reduce page weight and improve load speed.' },
    { label: 'Image alt texts present (80%+ of images)', passed: altTextRatio >= 0.8, impact: 'medium', detail: imgTags.length === 0 ? 'No images found' : `${imgsWithAlt.length}/${imgTags.length} images have alt text`, fix: 'Add descriptive alt text to all images. AI models read alt text for content understanding.' },
    { label: 'Browser caching headers set', passed: hasCaching, impact: 'medium', detail: hasCaching ? `Cache-Control: ${cacheControl.slice(0, 60)}` : 'No Cache-Control header', fix: 'Set Cache-Control headers to reduce load times for returning visitors.' },
    { label: 'Lazy loading on images', passed: hasLazyLoading, impact: 'low', detail: hasLazyLoading ? 'Lazy loading detected' : 'No lazy loading found', fix: 'Add loading="lazy" to below-fold images to improve LCP.' },
  ]
  return { id: 'performance', name: 'Page Performance Signals', score: calculateCategoryScore(checks, 7), weight: 7, checks }
}

// ─── Grade/Icon Helpers ───────────────────────────────────────────────────────

function getGradeColors(color: string) {
  const map: Record<string, { bg: string; text: string; border: string; ring: string }> = {
    green:  { bg: 'rgba(22,163,74,0.1)',   text: '#15803d', border: 'rgba(22,163,74,0.35)',   ring: '#22c55e' },
    lime:   { bg: 'rgba(132,204,22,0.1)',  text: '#65a30d', border: 'rgba(132,204,22,0.35)',  ring: '#84cc16' },
    yellow: { bg: 'rgba(234,179,8,0.1)',   text: '#a16207', border: 'rgba(234,179,8,0.35)',   ring: '#eab308' },
    orange: { bg: 'rgba(249,115,22,0.1)',  text: '#c2410c', border: 'rgba(249,115,22,0.35)',  ring: '#f97316' },
    red:    { bg: 'rgba(220,38,38,0.1)',   text: '#dc2626', border: 'rgba(220,38,38,0.35)',   ring: '#ef4444' },
  }
  return map[color] || map['red']
}

function getCategoryIconPaths(id: string): string[] {
  const paths: Record<string, string[]> = {
    schema:      ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h3'],
    'ai-crawl':  ['M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18'],
    content:     ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'],
    eeat:        ['M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
    faq:         ['M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
    technical:   ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
    performance: ['M13 10V3L4 14h7v7l9-11h-7z'],
  }
  return paths[id] || paths['content']
}

function getImpactStyle(impact: string): React.CSSProperties {
  if (impact === 'high')   return { background: 'rgba(220,38,38,0.1)',   color: '#dc2626', padding: '1px 6px', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }
  if (impact === 'medium') return { background: 'rgba(217,119,6,0.1)',   color: '#d97706', padding: '1px 6px', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }
  return                           { background: 'var(--gray-1)',         color: 'var(--gray-4)', padding: '1px 6px', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }
}

function getBarColor(pct: number): string {
  if (pct >= 0.85) return 'var(--green)'
  if (pct >= 0.55) return 'var(--amber)'
  return 'var(--red)'
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GeoAeoCheckerClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showIssuesModal, setShowIssuesModal] = useState(false)

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const analyzeUrl = async () => {
    if (!url.trim()) { setError('Please enter a URL to analyze'); return }
    setLoading(true); setError(''); setResults(null); setActiveCategory(null)
    try {
      const normalizedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
      const res = await fetch('/api/fetch-page', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: normalizedUrl }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const { html, headers, finalUrl } = data
      const categories = [analyzeSchema(html), analyzeAiCrawlerAccess(html, headers), analyzeContentStructure(html), analyzeEeat(html), analyzeFaq(html), analyzeTechnical(html, headers), analyzePerformance(html, headers)]
      const overallScore = calculateOverallScore(categories)
      const { grade, label, color } = getGrade(overallScore)
      const allChecks = categories.flatMap((c) => c.checks)
      const impactOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
      const topIssues = allChecks.filter((c) => !c.passed).sort((a, b) => impactOrder[b.impact] - impactOrder[a.impact]).slice(0, 8)
      const passedChecks = allChecks.filter((c) => c.passed).length
      setResults({ url: normalizedUrl, finalUrl, overallScore, grade, gradeLabel: label, gradeColor: color, categories, topIssues, passedChecks, totalChecks: allChecks.length })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Could not analyze page: ${message}. Check the URL and try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') analyzeUrl() }

  const gradeColors = results ? getGradeColors(results.gradeColor) : null
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const scoreOffset = results ? circumference - (results.overallScore / 100) * circumference : circumference

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="tool-hero" id="top">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 90% at 50% 45%, transparent 62%, rgba(8,9,10,0.82) 100%)', pointerEvents: 'none' }} />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>GEO &amp; AEO Score Checker</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free GEO &amp; AEO Score Checker — <span>AI Search Readiness Audit</span>
          </h1>
          <p className="tool-hero-sub">
            A GEO/AEO score checker audits your web page across seven AI readiness categories — schema markup, AI crawler access, content structure, E-E-A-T signals, FAQ readiness, technical signals, and performance — returning a 0–100 score with specific fixes for every failed check.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['7-Category Audit', 'AI Crawler Detection', '30+ Checks', 'Free · No Login'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOL INPUT ───────────────────────────────────────────────────────── */}
      <div className="tool-input-section" id="tool">
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>

          {/* Row 1: Input form + Grade card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'stretch' }}>

            {/* LEFT: URL form */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>GEO &amp; AEO Score Checker</span>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)' }}>30+ checks · results in &lt;15s</span>
              </div>
              <div style={{ padding: '2rem' }}>
                <h2 className="tool-box-heading">Check Your AI Search Readiness</h2>
                <p className="tool-box-sub">Enter any public URL to get a 0–100 GEO/AEO score with actionable fixes</p>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <input
                    type="url" value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com/your-page"
                    className="tool-url-input"
                    style={{ flex: 1, borderRadius: 0 }}
                    aria-label="URL to analyze"
                  />
                  <button
                    onClick={analyzeUrl} disabled={loading}
                    className="tool-analyze-btn"
                    style={{ borderRadius: 0, padding: '0 1.5rem', whiteSpace: 'nowrap', width: 'auto', flex: '0 0 auto' }}
                  >
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
                          <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        Check GEO/AEO Score
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div style={{ padding: '0.75rem 1rem', borderLeft: '3px solid var(--red)', background: 'rgba(220,38,38,0.05)', fontSize: '0.875rem', color: 'var(--red)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <div className="tool-key-features">
                  <p className="tool-key-features-title">What this tool checks</p>
                  <div className="tool-features-grid">
                    {FEATURE_ITEMS.map((item, i) => (
                      <div key={i} className="tool-feat-item">
                        <div className="tool-feat-check">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <p className="tool-feat-name">{item.label}</p>
                          <p className="tool-feat-desc">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Grade card */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>GEO/AEO Score</span>
                {results && (
                  <button onClick={analyzeUrl} disabled={loading} style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Re-check
                  </button>
                )}
              </div>
              <div style={{ padding: '1.5rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {results ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Score ring */}
                    <div style={{ position: 'relative', width: 100, height: 100 }}>
                      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r={radius} stroke="var(--line)" strokeWidth="8" fill="none" />
                        <circle
                          cx="50" cy="50" r={radius}
                          stroke={gradeColors?.ring || '#ef4444'}
                          strokeWidth="8" fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={scoreOffset}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{results.overallScore}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--gray-4)', fontFamily: 'var(--mono, monospace)' }}>/100</span>
                      </div>
                    </div>
                    {/* Grade badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: gradeColors?.bg, color: gradeColors?.text, border: `1px solid ${gradeColors?.border}`, padding: '0.25rem 0.875rem', fontWeight: 700, fontSize: '0.875rem' }}>
                      Grade {results.grade}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-5)', fontWeight: 600, margin: 0 }}>{results.gradeLabel}</p>
                    <p style={{ fontSize: '0.72rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)', margin: 0 }}>
                      <strong style={{ color: 'var(--ink)', fontSize: '0.875rem' }}>{results.passedChecks}/{results.totalChecks}</strong> checks passed
                    </p>
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                      <a href={results.finalUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'var(--blue)', fontFamily: 'var(--mono, monospace)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {results.finalUrl.replace(/^https?:\/\//, '').slice(0, 36)}{results.finalUrl.replace(/^https?:\/\//, '').length > 36 ? '…' : ''}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '2px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gray-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                      </svg>
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink)', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '0.375rem' }}>Your score appears here</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', fontFamily: 'var(--mono, monospace)', margin: 0, lineHeight: 1.5 }}>Enter a URL above and<br />click Check GEO/AEO Score</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Full results (when available) */}
          {results && (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr auto', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'start' }}>

              {/* Category list */}
              <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
                <div style={{ padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Categories</span>
                </div>
                <div style={{ padding: '0.5rem' }}>
                  {results.categories.map((cat) => {
                    const pct = cat.score / cat.weight
                    const isActive = activeCategory === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(isActive ? null : cat.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem',
                          padding: '0.625rem 0.75rem', textAlign: 'left', cursor: 'pointer',
                          background: isActive ? 'rgba(37,99,235,0.06)' : 'none',
                          border: isActive ? '1px solid rgba(37,99,235,0.2)' : '1px solid transparent',
                          transition: 'background 0.15s',
                        }}
                      >
                        <div style={{ width: 28, height: 28, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {getCategoryIconPaths(cat.id).map((d, i) => <path key={i} d={d} />)}
                          </svg>
                        </div>
                        <span style={{ flex: 1, fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                          <div style={{ width: 48, height: 3, background: 'var(--line)' }}>
                            <div style={{ height: '100%', width: `${pct * 100}%`, background: getBarColor(pct), transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--mono, monospace)', color: getBarColor(pct), minWidth: 36, textAlign: 'right' }}>{cat.score}/{cat.weight}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Category detail / default prompt */}
              <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
                {activeCategory ? (
                  <>
                    {results.categories.filter((c) => c.id === activeCategory).map((cat) => (
                      <div key={cat.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{ width: 28, height: 28, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {getCategoryIconPaths(cat.id).map((d, i) => <path key={i} d={d} />)}
                              </svg>
                            </div>
                            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                              {cat.name} — {cat.score}/{cat.weight} pts · {cat.checks.filter(c => c.passed).length}/{cat.checks.length} passed
                            </span>
                          </div>
                          <button onClick={() => setActiveCategory(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-4)', fontSize: '1.25rem', lineHeight: 1, padding: '0 0.25rem' }}>×</button>
                        </div>
                        <div style={{ padding: '0.75rem' }}>
                          {cat.checks.map((check, i) => (
                            <details key={i} style={{ borderBottom: i < cat.checks.length - 1 ? '1px solid var(--line)' : 'none' }}>
                              <summary style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', listStyle: 'none', padding: '0.75rem', userSelect: 'none' }}>
                                <span style={{ flexShrink: 0, marginTop: '0.1rem' }}>
                                  {check.passed
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                  }
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)' }}>{check.label}</span>
                                    <span style={getImpactStyle(check.impact)}>{check.impact}</span>
                                  </div>
                                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-4)', margin: 0 }}>{check.detail}</p>
                                </div>
                                <svg style={{ flexShrink: 0, marginTop: '0.1rem' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </summary>
                              {!check.passed && (
                                <div style={{ marginLeft: '1.625rem', marginBottom: '0.75rem', padding: '0.75rem 1rem', background: 'var(--blue-pale)', borderLeft: '3px solid var(--blue)' }}>
                                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-dark)', margin: '0 0 0.25rem' }}>How to fix:</p>
                                  <p style={{ fontSize: '0.8125rem', color: 'var(--blue-dark)', margin: 0, lineHeight: 1.6 }}>{check.fix}</p>
                                </div>
                              )}
                            </details>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : results.topIssues.length === 0 ? (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--ink)', marginBottom: '0.375rem' }}>No critical issues found!</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-4)' }}>Click any category on the left to inspect individual checks.</p>
                  </div>
                ) : (
                  <div style={{ padding: '0.65rem 1.5rem', background: 'var(--blue-pale)', borderLeft: '3px solid var(--blue)', height: '100%', display: 'flex', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--blue-dark)', margin: 0 }}>← Click any category to inspect individual checks and fixes</p>
                  </div>
                )}
              </div>

              {/* Top issues panel */}
              {results.topIssues.length > 0 && (
                <div style={{ width: 220 }}>
                  <button
                    onClick={() => setShowIssuesModal(true)}
                    style={{ width: '100%', padding: 0, background: 'none', border: 'none', cursor: 'pointer', display: 'block', textAlign: 'left' }}
                  >
                    <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
                      <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, background: 'var(--red)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Top Issues</span>
                      </div>
                      <div style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          {results.topIssues.slice(0, 4).map((issue, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              <span style={{ fontSize: '0.75rem', color: 'var(--gray-5)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>{issue.label}</span>
                            </div>
                          ))}
                        </div>
                        {results.topIssues.length > 4 && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', fontFamily: 'var(--mono, monospace)', marginBottom: '0.5rem' }}>+{results.topIssues.length - 4} more</p>
                        )}
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', margin: 0 }}>
                          View all {results.topIssues.length} issues →
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Issues Modal */}
          {showIssuesModal && (
            <div
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
              onClick={() => setShowIssuesModal(false)}
            >
              <div
                style={{ background: '#fff', width: '100%', maxWidth: 560, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--line)', flexShrink: 0, background: 'var(--gray-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: 8, height: 8, background: 'var(--red)' }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>Top Issues to Fix</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray-4)', fontFamily: 'var(--mono, monospace)' }}>sorted by impact</span>
                  </div>
                  <button onClick={() => setShowIssuesModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-4)', fontSize: '1.25rem', lineHeight: 1 }}>×</button>
                </div>
                <div style={{ overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {results!.topIssues.map((issue, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--gray-1)', border: '1px solid var(--line)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)' }}>{issue.label}</span>
                          <span style={getImpactStyle(issue.impact)}>{issue.impact}</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-5)', lineHeight: 1.65, margin: 0 }}>{issue.fix}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* ── FOUNDER / AUTHOR BLOCK (matches Internal Link Checker reference) ──── */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in Technical SEO</div>
              <p className="founder-quote-text">
                &ldquo;I started tracking AI search citations for clients in late 2024. The pattern was immediate: sites getting cited in ChatGPT, Perplexity, and Google AI Overviews all shared the same structural traits — question-format headings, FAQPage schema, clear E-E-A-T signals, and AI crawler access. Sites missing even one of these consistently got ignored. This checker scores all of them in one pass.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts ·{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT ARE GEO AND AEO ─────────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">The New SEO Landscape</p>
            <h2 className="s-title">What Are GEO and AEO — and Why Do They Matter?</h2>
          </div>
          <div className="prose-content reveal">
            <p>GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) are the two dominant optimization frameworks for AI-era search. While traditional SEO focuses on ranking in blue-link search results, GEO and AEO focus on getting your content cited, extracted, and surfaced by AI systems — including Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, and Copilot.</p>
            <p>The distinction matters because AI search is changing where web traffic originates. According to SparkToro&apos;s 2025 Zero-Click Search study, <strong>58.5% of Google searches now end without a click</strong> — users get their answers directly from AI-generated summaries. For brands not cited in these summaries, that traffic is invisible.</p>
            <p><strong>AEO</strong> focuses on structuring content so that AI answer engines — voice assistants, featured snippets, and AI chatbots — can extract clear, direct answers to specific questions. It prioritizes question-format headings, FAQPage schema, concise answer paragraphs, and structured data markup.</p>
            <p><strong>GEO</strong> is broader — it focuses on building content that generative AI models trust enough to cite as a source. This requires not just structural signals but also E-E-A-T signals, external citations, factual depth, and proprietary data that AI models cannot generate themselves.</p>
            <p>Research from Search Engine Journal&apos;s 2025 AI citation analysis found that <strong>pages with FAQPage schema were cited in AI Overviews 3.6x more frequently</strong> than pages without it. seoClarity found that pages with clear author attribution received <strong>2.8x more AI citations</strong> than anonymous content. The signals are measurable — and that&apos;s exactly what this tool measures.</p>
          </div>
        </div>
      </section>

      {/* ── THE 7 CATEGORIES ─────────────────────────────────────────────────── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Audit Breakdown</p>
            <h2 className="s-title">The 7 Categories This Tool Audits</h2>
          </div>
          {/* Bento grid — tile prominence reflects point weight (Schema 20 + Crawler 18 are featured) */}
          <div className="geo-bento reveal">
            {AUDIT_CATEGORIES.map((item, i) => {
              const area = ['schema', 'crawl', 'content', 'eeat', 'faq', 'tech', 'perf'][i]
              const hero = i < 2
              return (
                <article key={item.id} className={`geo-bento-tile${hero ? ' hero' : ''}`} style={{ gridArea: area }}>
                  <span className="geo-bento-wm">{String(i + 1).padStart(2, '0')}</span>
                  <div className="geo-bento-head">
                    <span className="geo-bento-ico">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {getCategoryIconPaths(item.id).map((d, j) => <path key={j} d={d} />)}
                      </svg>
                    </span>
                    <span className="geo-bento-pts">{item.pts}<i>pts</i></span>
                  </div>
                  <h3 className="geo-bento-title">{item.title.replace(/^\d+\.\s*/, '')}</h3>
                  <p className="geo-bento-desc">{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW TO READ YOUR SCORE ───────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Score Guide</p>
            <h2 className="s-title">How to Read Your GEO/AEO Score</h2>
          </div>
          <div className="reveal" style={{ border: '1px solid var(--line)', overflow: 'hidden', marginTop: '2.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  {['Score Range', 'Grade', 'What It Means'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', borderRight: '1px solid rgba(255,255,255,0.1)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['85–100', 'A — AI-Ready',   'Strong across all categories. Likely being cited in AI responses.',       '#15803d'],
                  ['70–84',  'B — Good',        'Most signals present. Fix remaining high-impact issues to reach top tier.', '#65a30d'],
                  ['55–69',  'C — Average',     'Several gaps. AI models may crawl but rarely cite this page.',            '#a16207'],
                  ['40–54',  'D — Poor',        'Major structural issues. Content likely ignored by AI answer systems.',   '#c2410c'],
                  ['0–39',   'F — Critical',    'Not AI-ready. Fundamental signals missing across multiple categories.',   '#dc2626'],
                ].map(([range, grade, meaning, clr], i) => (
                  <tr key={i} style={{ borderBottom: i < 4 ? '1px solid var(--line)' : 'none' }}>
                    <td style={{ padding: '12px 20px', fontSize: '0.875rem', fontFamily: 'var(--mono, monospace)', fontWeight: 700, color: clr, borderRight: '1px solid var(--line)' }}>{range}</td>
                    <td style={{ padding: '12px 20px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', borderRight: '1px solid var(--line)' }}>{grade}</td>
                    <td style={{ padding: '12px 20px', fontSize: '0.875rem', color: 'var(--gray-5)' }}>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="why-grid reveal" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
            <div className="why-card">
              <p className="why-card-title">
                <span className="why-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </span>
                Priority Order for Fixes
              </p>
              <p className="why-card-body">Always fix <strong>high-impact failed checks</strong> first. The tool labels every failed check as High, Medium, or Low impact. High-impact fixes — missing FAQPage schema, no answer capsule, AI crawlers blocked — move your score the most. A page going from grade F to grade C typically requires fixing 3–5 high-impact checks. Going from C to A requires fixing medium-impact checks systematically.</p>
            </div>
            <div className="why-card">
              <p className="why-card-title">
                <span className="why-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                </span>
                Score vs. Rankings: What to Expect
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Days 1–7: AI crawlers re-index updated pages',
                  'Weeks 2–4: Schema changes begin reflecting in rich results',
                  'Weeks 4–12: AI citation frequency increases as models incorporate updated pages',
                  'Months 3–6: Compounding authority effects — more citations → more brand searches',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-5)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--blue)', flexShrink: 0 }}>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── GEO VS AEO VS SEO ────────────────────────────────────────────────── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Framework Comparison</p>
            <h2 className="s-title">GEO vs. AEO vs. SEO — What&apos;s the Difference?</h2>
          </div>
          <div className="reveal" style={{ border: '1px solid var(--line)', overflow: 'auto', marginTop: '2.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  {['Dimension', 'SEO', 'AEO', 'GEO'].map((h, j) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', borderRight: j < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Goal', 'Rank in blue-link results', 'Get extracted as a direct answer', 'Get cited by generative AI models'],
                  ['Primary signals', 'Backlinks, on-page, authority', 'FAQPage schema, question headings, answer capsules', 'E-E-A-T, structured data, proprietary data, citations'],
                  ['Traffic mechanism', 'User clicks on blue link', 'Featured snippet / voice answer (often zero-click)', 'Citation in AI response (brand awareness + some clicks)'],
                  ['Content format', 'Long-form, keyword-rich', 'Q&A structured, concise answers', 'Expert-authored, data-rich, citable'],
                  ['Time to results', '3–6 months', '2–8 weeks', '4–12 weeks'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 4 ? '1px solid var(--line)' : 'none' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '12px 20px', fontSize: '0.85rem', fontWeight: j === 0 ? 700 : 400, color: j === 0 ? 'var(--ink)' : 'var(--gray-5)', borderRight: j < 3 ? '1px solid var(--line)' : 'none', background: j === 3 ? 'var(--blue-pale)' : 'none' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="reveal" style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-5)', lineHeight: 1.7 }}>
              The optimal strategy is to optimize for all three simultaneously. They share many signals: structured content helps SEO and AEO; E-E-A-T signals help SEO and GEO; schema helps SEO, AEO, and GEO.
            </p>
          </div>
        </div>
      </section>

      {/* ── FASTEST GEO/AEO WINS ─────────────────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Quick Wins</p>
            <h2 className="s-title">The Fastest GEO/AEO Wins (High Score Impact, Low Effort)</h2>
            <p className="s-sub">If your score is below 60, these changes will have the biggest immediate impact:</p>
          </div>
          <div className="features-grid reveal">
            {[
              { id: 'faq',        title: 'Add FAQPage Schema',        text: 'This single change is responsible for more AI citation improvements than any other. Use our Schema Generator to create FAQPage markup.', extra: 'Impact: +8–15 points.' },
              { id: 'content',    title: 'Write an Answer Capsule',   text: 'A 120–300 character direct-answer paragraph as the first content on the page. No preamble — just a factual answer to the primary question.', extra: 'AI models extract this as the page summary.' },
              { id: 'eeat',       title: 'Convert H2s to Questions',  text: 'Change "Our Services" to "What SEO Services Does SEOShouts Offer?" AI models match user question intent to question-format headings directly.', extra: 'Convert 2–3 H2s per page.' },
              { id: 'schema',     title: 'Add Organization Schema',   text: 'Organization schema with sameAs links to your LinkedIn, Twitter/X, YouTube, and other profiles tells AI models that your brand is a real entity with verified presence across the web.', extra: '' },
              { id: 'ai-crawl',   title: 'Unblock AI Crawlers',       text: 'Check your robots.txt for blocks on GPTBot, ClaudeBot, PerplexityBot, and Google-Extended. Use our Robots.txt Generator to fix this correctly.', extra: '' },
              { id: 'technical',  title: 'Track & Re-Test Weekly',    text: 'After implementing fixes, re-run this checker weekly. AI crawlers re-index pages within days. Schema changes show in rich results within 2–4 weeks.', extra: 'Citation frequency increases in 4–12 weeks.' },
            ].map((item, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {getCategoryIconPaths(item.id).map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-desc">{item.text}{item.extra && <> <strong>{item.extra}</strong></>}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTING AI VISIBILITY ────────────────────────────────────────────── */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Verification Protocol</p>
            <h2 className="s-title">Testing Your AI Visibility After Optimization</h2>
            <p className="s-sub">Improving your score is step one. Verifying it with real AI citation tests is step two. Here&apos;s the weekly testing protocol we recommend:</p>
          </div>
          <div className="why-grid reveal" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '2.5rem' }}>
            {[
              { title: 'Queries to test', icon: 'faq', items: ['"[Your brand name] reviews"', '"best [service] for [audience]"', '"[primary keyword your page targets]"', '"how to [thing your tool helps with]"', '"what is [topic your page defines]"'] },
              { title: 'Platforms to test', icon: 'ai-crawl', items: ['ChatGPT (GPT-4)', 'Perplexity', 'Claude (claude.ai)', 'Google AI Overviews', 'Gemini & Microsoft Copilot'] },
              { title: 'What to track', icon: 'content', items: ['Was your brand cited? (Yes/No)', 'What content was cited? (URL)', 'Which competitors were cited?', 'What sentiment was expressed?', 'Change after GEO fixes (2–3 weeks)'] },
            ].map((col, i) => (
              <div key={i} className="why-card">
                <p className="why-card-title">
                  <span className="why-card-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {getCategoryIconPaths(col.icon).map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </span>
                  {col.title}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {col.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-5)', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0 }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────────── */}
      <section className="section comparison-section">
        <div className="section-container">
          <div className="s-header reveal">
            <div className="eyebrow">Tool Comparison</div>
            <h2 className="s-title">SEOShouts vs other <span className="blue">GEO/AEO tools</span></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  {['Feature', 'SEOShouts', 'AI Rank Lab', 'HubSpot AEO Grader', 'Insites GEO', 'Zicy Extension'].map((h, j) => (
                    <th key={h} className={j === 1 ? 'highlight' : ''}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Composite 0–100 Score',          '✅', '✅', '✅', '✅', '✅'],
                  ['Schema Markup Analysis',          '✅ Deep (6 checks)', '✅ Basic', '✅ Basic', '❌', '✅'],
                  ['AI Crawler Access Check',         '✅', '✅', '❌', '✅', '✅'],
                  ['E-E-A-T Signal Scoring',          '✅ 8 checks', '❌', '❌', '✅ Basic', '❌'],
                  ['FAQ/Q&A Readiness',               '✅ 5 checks', '✅', '✅', '❌', '✅'],
                  ['Content Structure Audit',         '✅ 8 checks', '❌', '❌', '✅', '❌'],
                  ['Per-Check Fix Recommendations',   '✅ Every check', '❌', '❌', '❌', '❌'],
                  ['llms.txt Detection',              '✅', '❌', '❌', '❌', '❌'],
                  ['No Login Required',               '✅', '✅', '✅', '❌', '✅'],
                  ['Free',                            '✅ Fully free', '✅ Limited', '✅ Basic only', '❌ Paid', '✅'],
                ].map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={ci === 1 ? 'highlight-col' : ''}>
                        {cell === '✅' || cell.startsWith('✅') ? <span className="check-yes">{cell}</span> :
                         cell === '❌' || cell.startsWith('❌') ? <span className="check-no">{cell === '❌' ? '✗' : cell.replace('❌ ', '')}</span> :
                         cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CHECKLIST ────────────────────────────────────────────────────────── */}
      <section className="section checklist-section">
        <div className="section-container">
          <div className="s-header reveal">
            <div className="eyebrow">Action Checklist</div>
            <h2 className="s-title">GEO/AEO Readiness Checklist</h2>
            <p className="s-sub">Use this checklist after running your GEO/AEO analysis. Bookmark it and revisit monthly.</p>
          </div>
          <div className="checklist-grid reveal">
            {[
              { title: '📋 Schema Markup',    items: ['FAQPage schema with 3+ Q&A pairs', 'Organization schema with name, url, logo, sameAs', 'Article/WebPage schema with author Person entity', 'BreadcrumbList schema on all inner pages', 'HowTo or SoftwareApplication schema where applicable'] },
              { title: '🤖 AI Crawler Access', items: ['GPTBot, ClaudeBot, PerplexityBot allowed in robots.txt', 'Google-Extended allowed (for AI Overviews)', 'Canonical tag on every page', 'HTTPS on all pages', 'llms.txt file at domain root'] },
              { title: '📝 Content Structure', items: ['Answer capsule (120–300 chars) as first paragraph', '2+ H2s in question format', 'Statistics cited every 150–200 words', 'No paragraphs over 120 words', 'Comparison table present for decision queries', '500+ words minimum'] },
              { title: '🏆 E-E-A-T',           items: ['Visible author byline on all content pages', 'Author schema (Person) with credentials', 'Credentials explicitly stated ("X years experience")', 'Link to About/Team/Experts page', '3+ external authoritative citations', 'Publication + last updated date visible'] },
              { title: '❓ FAQ & Q&A',         items: ['FAQ section present on key pages', 'FAQPage schema with answers 50+ words each', 'Question-format headings throughout content'] },
              { title: '⚙️ Technical',         items: ['Meta description 120–155 chars on every page', 'All OG tags (title, description, image) present', 'HTML lang attribute set', 'UTF-8 charset declared', 'Viewport meta tag for mobile'] },
            ].map(cat => (
              <div key={cat.title} className="checklist-card">
                <div className="checklist-head">{cat.title}</div>
                <div className="checklist-items">
                  {cat.items.map((item, i) => (
                    <div key={i} className="checklist-item">
                      <input type="checkbox" id={`${cat.title}-${i}`} />
                      <label htmlFor={`${cat.title}-${i}`} className="checklist-text">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">FAQ</p>
            <h2 className="s-title">Frequently Asked Questions</h2>
            <p className="s-sub">Everything you need to know about GEO &amp; AEO optimization</p>
          </div>
          <div className="faq-list reveal">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="faq-item">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS ────────────────────────────────────────────────────── */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Explore Our Other <span className="blue">SEO Tools</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO and content tools designed to help you optimize, rank, and create better content.
            </p>
          </div>
          <div className="related-tools-grid reveal">
            {[
              { name: 'GEO & AEO Score Checker', current: true,  href: '/tools/geo-aeo-checker/',         desc: 'Audit AI search readiness across 7 categories with per-check fix recommendations.',               paths: ['M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'] },
              { name: 'On-Page SEO Analyzer',    current: false, href: '/tools/on-page-seo-analyzer/',    desc: 'Audit 150+ on-page SEO factors with real Google PageSpeed data.',                                paths: ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'] },
              { name: 'Internal Link Checker',   current: false, href: '/tools/internal-link-checker/',   desc: 'Visualize anchor text distribution and audit internal link structure.',                         paths: ['M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'] },
              { name: 'SEO Meta Writer',          current: false, href: '/tools/seo-meta-writer/',         desc: 'Generate compelling meta titles and descriptions for better click-through rates.',                paths: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'] },
              { name: 'Robots.txt Generator',    current: false, href: '/tools/robots-txt-generator/',    desc: 'Create robots.txt rules including directives for AI crawlers like GPTBot and ClaudeBot.',       paths: ['M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18'] },
            ].map((tool) => (
              <div key={tool.name} className={`related-card${tool.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    {tool.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="related-card-name"><a href={tool.href}>{tool.name}</a></div>
                <div className="related-card-desc">{tool.desc}</div>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {tool.current ? 'Current tool' : 'Free — no login'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Find Out if AI Search Engines Are <span>Ignoring Your Website</span></h2>
          <p className="final-cta-sub">
            And exactly what to fix — 30+ checks across 7 categories, results in under 15 seconds.
            Every failed check includes a specific, actionable fix.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', fontWeight: 600, maxWidth: 640, margin: '0 auto 2rem', textAlign: 'center', lineHeight: 1.7 }}>
            The signals are measurable. The fixes are specific. The results are yours in seconds — completely free.
          </p>
          <div className="tool-grid-2col" style={{ gap: '1rem', maxWidth: 680, margin: '0 auto 2rem', textAlign: 'left' }}>
            {[
              { title: 'Check Your GEO/AEO Score Now', desc: 'Get a 0–100 readiness score with per-check fixes across 7 AI optimization categories.' },
              { title: 'Works for Any Public URL', desc: 'Analyze landing pages, blog posts, service pages, or any publicly accessible web page.' },
            ].map((card) => (
              <div key={card.title} style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="final-cta-row">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-primary">Check GEO/AEO Score Now</button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {['30+ checks · under 15 seconds', 'Every failed check has a specific fix', 'Free forever — no login required'].map((p) => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
