'use client'

import { useState } from 'react'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

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

const FEATURE_ITEMS = [
  '7-Category Audit — Schema, crawler access, content, E-E-A-T, FAQ, technical & performance',
  '0–100 Composite Score — Weighted scoring shows exactly where you rank on AI readiness',
  'Fix Recommendations — Every failed check includes a specific actionable fix',
  'Free, No Login — Analyze any public URL, unlimited times, no account needed',
]

const FAQ_ITEMS = [
  {
    q: 'What is a GEO/AEO score?',
    a: "A GEO/AEO score is a 0–100 composite measure of how well-optimized a web page is for AI search engines and answer engines. It combines scores across seven categories: schema markup, AI crawler access, content structure, E-E-A-T signals, FAQ readiness, technical signals, and page performance. A higher score correlates with higher citation frequency in Google AI Overviews, ChatGPT, Perplexity, and other AI search platforms.",
  },
  {
    q: 'What is the difference between GEO and AEO?',
    a: "AEO (Answer Engine Optimization) focuses on structuring content so AI answer engines can extract direct answers — through FAQPage schema, question-format headings, and concise answer paragraphs. GEO (Generative Engine Optimization) is broader — it focuses on making content trustworthy and citable by generative AI models, which requires E-E-A-T signals, proprietary data, and expert attribution in addition to structural signals. In practice, optimizing for both simultaneously is the most effective approach.",
  },
  {
    q: 'How accurate is the GEO/AEO score?',
    a: "The score is based on signals that are directly detectable in your page's HTML and HTTP headers. It does not access Google's internal scoring, Perplexity's index, or any AI model's training data. Think of it as a structural audit — it tells you whether your page has the signals that research shows correlate with AI citations. Actual citation frequency depends on many factors including domain authority, content quality, and competition.",
  },
  {
    q: 'Why is my schema score low when I have schema markup?',
    a: "The checker looks for specific, high-impact schema types: FAQPage, Organization, Author (Person), and BreadcrumbList. Having WebSite or Product schema alone will not score highly. FAQPage schema is the single most impactful schema type for AI citation and receives the most weight in the schema category.",
  },
  {
    q: 'Can a page score 100?',
    a: "In theory yes, but in practice a score of 85–90 is excellent. Some checks — like hreflang (relevant only for multilingual sites) — may not apply to your page. Focus on A grade (85+) rather than perfect 100.",
  },
  {
    q: 'How often should I run the GEO/AEO checker?',
    a: "Run it after any significant content update, after adding schema markup, after changing your robots.txt, and monthly as part of your regular SEO audit. Track your score over time to measure the impact of individual improvements.",
  },
  {
    q: 'Does improving my GEO/AEO score hurt traditional SEO?',
    a: "No — the signals this tool checks (schema markup, E-E-A-T, content structure, FAQ sections) are all positive signals for traditional Google search rankings too. GEO/AEO optimization and traditional SEO are complementary, not competing.",
  },
  {
    q: 'What should I fix first after getting my score?',
    a: "Fix High-impact failed checks first. The tool sorts your issues by impact level. Typically, the fastest wins are: adding FAQPage schema (if missing), writing an answer capsule, converting H2s to question format, and ensuring AI crawlers are not blocked.",
  },
]

// ─── Score Calculation Helpers ───────────────────────────────────────────────

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
    try {
      const parsed = JSON.parse(match[1])
      schemaBlocks.push(parsed)
    } catch {
      /* skip malformed */
    }
  }

  const schemas = schemaBlocks.flatMap((b: object) => {
    const block = b as Record<string, unknown>
    return block['@graph'] ? (block['@graph'] as object[]) : [b]
  })
  const types = schemas
    .map((s) => (s as Record<string, unknown>)['@type'])
    .filter(Boolean)
    .flatMap((t) => (Array.isArray(t) ? t : [t])) as string[]

  const checks: Check[] = [
    {
      label: 'Any schema markup present',
      passed: types.length > 0,
      impact: 'high',
      detail: types.length > 0 ? `Found: ${[...new Set(types)].join(', ')}` : 'No schema found',
      fix: 'Add at minimum Organization and WebPage schema. Use our Schema Generator.',
    },
    {
      label: 'FAQPage schema present',
      passed: types.includes('FAQPage'),
      impact: 'high',
      detail: types.includes('FAQPage') ? 'FAQPage schema detected' : 'No FAQPage schema',
      fix: 'Add FAQPage schema to your FAQ section. AI engines extract Q&A pairs directly from this.',
    },
    {
      label: 'Organization or LocalBusiness schema',
      passed: types.some((t) => ['Organization', 'LocalBusiness', 'Corporation'].includes(t)),
      impact: 'high',
      detail: types.some((t) => ['Organization', 'LocalBusiness'].includes(t))
        ? 'Organization entity found'
        : 'Missing',
      fix: 'Add Organization schema with name, url, logo, sameAs (social profiles), and contactPoint.',
    },
    {
      label: 'BreadcrumbList schema',
      passed: types.includes('BreadcrumbList'),
      impact: 'medium',
      detail: types.includes('BreadcrumbList') ? 'Breadcrumb schema present' : 'No breadcrumb schema',
      fix: 'Add BreadcrumbList schema to show page hierarchy to AI models.',
    },
    {
      label: 'Article or WebPage schema with author',
      passed: schemas.some((s) => {
        const schema = s as Record<string, unknown>
        return (
          ['Article', 'BlogPosting', 'WebPage'].includes(schema['@type'] as string) && schema.author
        )
      }),
      impact: 'medium',
      detail: 'Checks for author entity in Article/WebPage schema',
      fix: 'Add author schema with Person type, name, and url for E-E-A-T signals.',
    },
    {
      label: 'HowTo or SoftwareApplication schema (for tool/how-to pages)',
      passed: types.some((t) => ['HowTo', 'SoftwareApplication'].includes(t)),
      impact: 'low',
      detail: 'Optional but beneficial for tool and tutorial pages',
      fix: 'Add HowTo or SoftwareApplication schema if page is a tool or tutorial.',
    },
  ]

  const score = calculateCategoryScore(checks, 20)
  return { id: 'schema', name: 'Schema Markup', score, weight: 20, checks }
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
    {
      label: 'Page is indexable (no noindex)',
      passed: !isNoindex,
      impact: 'high',
      detail: isNoindex ? `Page is blocked: ${metaRobots || xRobotsTag}` : 'Page is indexable',
      fix: 'Remove noindex directive if you want AI crawlers to access this page.',
    },
    {
      label: 'Page allows link following (no nofollow)',
      passed: !isNofollow,
      impact: 'medium',
      detail: isNofollow ? 'Nofollow detected — limits AI content graph traversal' : 'Follow enabled',
      fix: 'Consider whether nofollow on this page is intentional.',
    },
    {
      label: 'Canonical tag present',
      passed: hasCanonical,
      impact: 'high',
      detail: hasCanonical ? `Canonical: ${canonicalUrl}` : 'No canonical tag found',
      fix: 'Add a canonical tag to prevent duplicate content confusion for AI models.',
    },
    {
      label: 'llms.txt file referenced or known',
      passed: hasLlmsTxtRef,
      impact: 'medium',
      detail: hasLlmsTxtRef ? 'llms.txt reference detected' : 'No llms.txt reference found on page',
      fix: 'Create a /llms.txt file at your domain root to guide AI models about your site.',
    },
    {
      label: 'No AI-specific bot blocks on page level',
      passed: !hasGptBot && !hasClaudeBot,
      impact: 'high',
      detail:
        hasGptBot || hasClaudeBot
          ? 'AI bot noindex directive found — check if intentional'
          : 'No AI-specific blocks detected at page level',
      fix: 'If you want AI citations, ensure major AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are allowed.',
    },
    {
      label: 'HTTPS protocol in use',
      passed: !!(hasCanonical && canonicalUrl && canonicalUrl.startsWith('https://')),
      impact: 'medium',
      detail: 'AI models and search engines prioritize secure pages',
      fix: 'Ensure the site is served over HTTPS and canonical points to HTTPS URL.',
    },
  ]

  const score = calculateCategoryScore(checks, 18)
  return { id: 'ai-crawl', name: 'AI Crawler Access', score, weight: 18, checks }
}

function analyzeContentStructure(html: string): Category {
  const cleanHtml = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')

  const h1Matches = cleanHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []
  const h1Count = h1Matches.length
  const h1Text = h1Count > 0 ? (h1Matches[0] ?? '').replace(/<[^>]+>/g, '').trim() : ''

  const h2Matches = cleanHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []
  const h2Texts = h2Matches.map((h) => h.replace(/<[^>]+>/g, '').trim())
  const questionH2s = h2Texts.filter((h) =>
    /^(what|how|why|when|where|who|which|can|does|is|are|should|will|do)/i.test(h)
  )
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
    {
      label: 'Single H1 tag present',
      passed: h1Count === 1,
      impact: 'high',
      detail:
        h1Count === 0
          ? 'No H1 found'
          : h1Count > 1
            ? `${h1Count} H1s found (should be 1)`
            : `H1: "${h1Text.slice(0, 60)}"`,
      fix: 'Use exactly one H1 per page. It should contain your primary keyword and clearly define the page topic.',
    },
    {
      label: 'Answer capsule in first 300 characters',
      passed: hasAnswerCapsule,
      impact: 'high',
      detail: hasAnswerCapsule
        ? `First paragraph: ${firstParaText.length} chars — good length`
        : 'First paragraph missing or too long/short for AI extraction',
      fix: 'Write a 120–300 character direct-answer paragraph as the very first content on the page.',
    },
    {
      label: 'Question-format H2 headings (2+ detected)',
      passed: hasQuestionH2s,
      impact: 'high',
      detail: hasQuestionH2s
        ? `${questionH2s.length} question H2s found`
        : `${h2Texts.length} H2s found but ${questionH2s.length} use question format`,
      fix: 'Rewrite at least 2–3 H2s as questions (What is X? How does Y work? Why should you Z?).',
    },
    {
      label: 'Statistics or data points present (3+ found)',
      passed: hasStats,
      impact: 'medium',
      detail: hasStats ? `${statMatches.length} data points found` : 'No numerical statistics detected',
      fix: 'Add cited statistics every 150–200 words. AI models prefer content with verifiable data.',
    },
    {
      label: 'Paragraphs are concise (under 120 words)',
      passed: !hasTooLongParas,
      impact: 'medium',
      detail: hasTooLongParas
        ? `${longParas.length} paragraphs exceed 120 words`
        : 'Paragraph lengths are appropriate',
      fix: 'Break paragraphs over 120 words into shorter chunks. AI models extract from shorter, focused paragraphs more accurately.',
    },
    {
      label: 'Comparison tables present',
      passed: hasTables,
      impact: 'medium',
      detail: hasTables ? 'Tables detected — good for AI structured data extraction' : 'No tables found',
      fix: 'Add comparison tables for decision queries. Tables are extracted directly by AI models for structured answers.',
    },
    {
      label: 'Content lists present (UL/OL)',
      passed: hasLists,
      impact: 'low',
      detail: hasLists ? 'Lists detected' : 'No bullet/numbered lists found',
      fix: 'Use lists for steps, features, and items. AI models cite list content frequently in answers.',
    },
    {
      label: 'Sufficient content depth (500+ words)',
      passed: wordCount >= 500,
      impact: 'medium',
      detail: `Estimated word count: ~${wordCount}`,
      fix: 'Pages under 500 words rarely get cited by AI models. Aim for 1,000+ for informational pages.',
    },
  ]

  const score = calculateCategoryScore(checks, 18)
  return { id: 'content', name: 'Content Structure', score, weight: 18, checks }
}

function analyzeEeat(html: string): Category {
  const lowerHtml = html.toLowerCase()

  const hasAuthorName = /author|written by|by [a-z]+ [a-z]+/i.test(html)
  const hasAuthorSchema = html.includes('"author"') && html.includes('"Person"')

  const expertiseTerms = [
    'years of experience',
    'certified',
    'expert',
    'specialist',
    'founder',
    'ceo',
    'cto',
    'phd',
    'mba',
    'award',
  ]
  const hasExpertiseSignal = expertiseTerms.some((t) => lowerHtml.includes(t))

  const hasAboutLink = /href=["'][^"']*\/(about|team|meet|experts|founder)[^"']*["']/i.test(html)
  const hasSocialProof = /(trustpilot|google review|clutch|g2|capterra|rated|reviews?)/i.test(html)

  const externalLinkMatches =
    html.match(/<a[^>]+href=["']https?:\/\/(?!seoshouts\.com)[^"']+["']/gi) || []
  const hasExternalCitations = externalLinkMatches.length >= 3

  const hasContactInfo = /(contact|email|phone|address|\+\d{5,})/i.test(html)
  const hasDateSignal = /(published|updated|last modified|datePublished|dateModified)/i.test(html)
  const hasLegalLinks = /href=["'][^"']*(privacy|terms|disclaimer)[^"']*["']/i.test(html)

  const checks: Check[] = [
    {
      label: 'Author name or byline visible',
      passed: hasAuthorName,
      impact: 'high',
      detail: hasAuthorName ? 'Author attribution detected' : 'No author attribution found',
      fix: 'Add a visible author byline with name and title. AI models use this as an expertise signal.',
    },
    {
      label: 'Author schema with Person type',
      passed: hasAuthorSchema,
      impact: 'high',
      detail: hasAuthorSchema ? 'Author schema (Person) present' : 'No Person schema for author',
      fix: 'Add schema with "@type": "Person", "name", "url", and "sameAs" for author profiles.',
    },
    {
      label: 'Expertise or credentials mentioned',
      passed: hasExpertiseSignal,
      impact: 'high',
      detail: hasExpertiseSignal
        ? 'Expertise/credential signals found'
        : 'No credentials or expertise signals detected',
      fix: 'Explicitly state credentials: "X years of experience," certifications, industry recognition.',
    },
    {
      label: 'About/Team page linked',
      passed: hasAboutLink,
      impact: 'medium',
      detail: hasAboutLink ? 'Link to About/Team page detected' : 'No link to About or Team page',
      fix: 'Link to your About or Meet the Experts page. AI models parse these to verify expertise claims.',
    },
    {
      label: 'External citations or references (3+)',
      passed: hasExternalCitations,
      impact: 'medium',
      detail: `${externalLinkMatches.length} external links found`,
      fix: 'Cite external authoritative sources. AI models trust content that references verifiable data.',
    },
    {
      label: 'Publication or update date present',
      passed: hasDateSignal,
      impact: 'medium',
      detail: hasDateSignal ? 'Date signal found' : 'No date signals detected',
      fix: 'Add datePublished and dateModified to your schema and visibly on the page.',
    },
    {
      label: 'Contact information present',
      passed: hasContactInfo,
      impact: 'low',
      detail: hasContactInfo ? 'Contact signals found' : 'No contact information detected',
      fix: 'Include contact email or phone. Signals legitimacy to AI trust assessment.',
    },
    {
      label: 'Privacy/Terms legal pages linked',
      passed: hasLegalLinks,
      impact: 'low',
      detail: hasLegalLinks ? 'Legal page links found' : 'No privacy/terms links detected',
      fix: 'Add links to Privacy Policy and Terms of Service — E-E-A-T trust signals.',
    },
  ]

  // use hasSocialProof to avoid unused var lint
  void hasSocialProof

  const score = calculateCategoryScore(checks, 15)
  return { id: 'eeat', name: 'E-E-A-T Signals', score, weight: 15, checks }
}

function analyzeFaq(html: string): Category {
  const hasFaqSchema = html.includes('"FAQPage"')
  const faqSchemaMatches = html.match(/"acceptedAnswer"/g) || []
  const faqSchemaCount = faqSchemaMatches.length

  const hasFaqSection = /(faq|frequently asked|common questions)/i.test(html)

  const questionMatches =
    html.match(
      /<h[2-4][^>]*>[^<]*(what|how|why|when|where|who|which|can|does|is|are)[^<]*\?<\/h[2-4]>/gi
    ) || []
  const hasQuestionHeadings = questionMatches.length >= 3

  let avgAnswerLength = 0
  if (hasFaqSchema) {
    const answerMatches = html.match(/"text"\s*:\s*"([^"]{50,})"/g) || []
    const lengths = answerMatches.map((m) => m.length)
    avgAnswerLength = lengths.length > 0 ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0
  }

  const checks: Check[] = [
    {
      label: 'FAQPage schema markup present',
      passed: hasFaqSchema,
      impact: 'high',
      detail: hasFaqSchema ? `FAQPage schema with ${faqSchemaCount} Q&A pairs` : 'No FAQPage schema',
      fix: 'Add FAQPage schema to every FAQ section. AI models extract these directly for answers.',
    },
    {
      label: 'FAQ schema has 3+ question-answer pairs',
      passed: faqSchemaCount >= 3,
      impact: 'high',
      detail: `${faqSchemaCount} acceptedAnswer entries in schema`,
      fix: 'Include at least 3 FAQ pairs in schema. More Q&A pairs = more opportunities for AI citations.',
    },
    {
      label: 'Visual FAQ section in page content',
      passed: hasFaqSection,
      impact: 'medium',
      detail: hasFaqSection ? 'FAQ section detected in HTML' : 'No FAQ section found',
      fix: 'Add a dedicated FAQ section with clear heading. Pair with FAQPage schema.',
    },
    {
      label: 'Question-format H2/H3 headings (3+ detected)',
      passed: hasQuestionHeadings,
      impact: 'high',
      detail: `${questionMatches.length} question-format headings found`,
      fix: 'Structure content with question headings. AI models match questions in queries to question headings on pages.',
    },
    {
      label: 'FAQ schema answers are substantive (50+ chars)',
      passed: avgAnswerLength > 100,
      impact: 'medium',
      detail: hasFaqSchema
        ? `Average answer length: ~${Math.round(avgAnswerLength)} chars`
        : 'No FAQ schema to evaluate',
      fix: 'Write complete answers in schema — at least 50 words each. Avoid one-sentence answers.',
    },
  ]

  const score = calculateCategoryScore(checks, 12)
  return { id: 'faq', name: 'FAQ & Q&A Readiness', score, weight: 12, checks }
}

function analyzeTechnical(html: string, headers: Record<string, string>): Category {
  const hasOgTitle = /property=["']og:title["']/i.test(html)
  const hasOgDescription = /property=["']og:description["']/i.test(html)
  const hasOgImage = /property=["']og:image["']/i.test(html)

  const hasMetaDescription =
    /name=["']description["'][^>]+content/i.test(html) ||
    /content=["'][^"']{50,}["'][^>]+name=["']description["']/i.test(html)

  const hasHreflang = /hreflang/i.test(html)

  const contentType = headers['content-type'] || ''
  const hasCharset = /charset=utf-8/i.test(contentType) || /charset=["']?utf-8["']?/i.test(html)

  const hasViewport = /name=["']viewport["']/i.test(html)
  const hasLangAttr = /<html[^>]+lang=["'][a-z]{2}/i.test(html)

  const checks: Check[] = [
    {
      label: 'Meta description present',
      passed: hasMetaDescription,
      impact: 'high',
      detail: hasMetaDescription ? 'Meta description found' : 'No meta description tag',
      fix: 'Add a 120–155 character meta description. AI models use this as page summary.',
    },
    {
      label: 'Open Graph tags (og:title, og:description, og:image)',
      passed: hasOgTitle && hasOgDescription && hasOgImage,
      impact: 'medium',
      detail: `OG tags: title=${hasOgTitle}, description=${hasOgDescription}, image=${hasOgImage}`,
      fix: 'Add all three core OG tags. AI models scrape OG data for entity understanding.',
    },
    {
      label: 'HTML lang attribute set',
      passed: hasLangAttr,
      impact: 'high',
      detail: hasLangAttr ? 'Lang attribute found on html element' : 'No lang attribute on <html>',
      fix: 'Add lang="en" (or appropriate language) to your <html> tag. Critical for AI language classification.',
    },
    {
      label: 'UTF-8 charset declared',
      passed: hasCharset,
      impact: 'medium',
      detail: hasCharset ? 'UTF-8 charset declared' : 'No UTF-8 charset found',
      fix: 'Declare charset="utf-8" in your HTML head and Content-Type header.',
    },
    {
      label: 'Viewport meta tag (mobile-friendly)',
      passed: hasViewport,
      impact: 'medium',
      detail: hasViewport ? 'Viewport meta present' : 'No viewport meta tag',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
    },
    {
      label: 'Hreflang tags (for multilingual sites)',
      passed: hasHreflang,
      impact: 'low',
      detail: hasHreflang ? 'Hreflang tags detected' : 'No hreflang (fine for single-language sites)',
      fix: 'Add hreflang tags if serving multiple languages/regions. Helps AI serve correct language version.',
    },
  ]

  const score = calculateCategoryScore(checks, 10)
  return { id: 'technical', name: 'Technical AI Readiness', score, weight: 10, checks }
}

function analyzePerformance(html: string, headers: Record<string, string>): Category {
  const hasLazyLoading = /loading=["']lazy["']/i.test(html)

  const imgTags = html.match(/<img[^>]+>/gi) || []
  const imgsWithAlt = imgTags.filter((img) => /alt=["'][^"']+["']/i.test(img))
  const altTextRatio = imgTags.length > 0 ? imgsWithAlt.length / imgTags.length : 1

  const cacheControl = headers['cache-control'] || ''
  const hasCaching = cacheControl.length > 0

  const hasGzip =
    (headers['content-encoding'] || '').includes('gzip') ||
    (headers['content-encoding'] || '').includes('br')

  const checks: Check[] = [
    {
      label: 'GZIP/Brotli compression enabled',
      passed: hasGzip,
      impact: 'medium',
      detail: hasGzip ? `Compression: ${headers['content-encoding']}` : 'No compression detected',
      fix: 'Enable GZIP or Brotli compression to reduce page weight and improve load speed.',
    },
    {
      label: 'Image alt texts present (80%+ of images)',
      passed: altTextRatio >= 0.8,
      impact: 'medium',
      detail:
        imgTags.length === 0
          ? 'No images found'
          : `${imgsWithAlt.length}/${imgTags.length} images have alt text`,
      fix: 'Add descriptive alt text to all images. AI models read alt text for content understanding.',
    },
    {
      label: 'Browser caching headers set',
      passed: hasCaching,
      impact: 'medium',
      detail: hasCaching ? `Cache-Control: ${cacheControl.slice(0, 60)}` : 'No Cache-Control header',
      fix: 'Set Cache-Control headers to reduce load times for returning visitors.',
    },
    {
      label: 'Lazy loading on images',
      passed: hasLazyLoading,
      impact: 'low',
      detail: hasLazyLoading ? 'Lazy loading detected' : 'No lazy loading found',
      fix: 'Add loading="lazy" to below-fold images to improve LCP.',
    },
  ]

  const score = calculateCategoryScore(checks, 7)
  return { id: 'performance', name: 'Page Performance Signals', score, weight: 7, checks }
}

// ─── Grade Color Helpers ──────────────────────────────────────────────────────

function getGradeColors(color: string) {
  const map: Record<string, { bg: string; text: string; border: string; ring: string }> = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      ring: 'stroke-green-500',
    },
    lime: {
      bg: 'bg-lime-100',
      text: 'text-lime-700',
      border: 'border-lime-200',
      ring: 'stroke-lime-500',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      ring: 'stroke-yellow-500',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-200',
      ring: 'stroke-orange-500',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      ring: 'stroke-red-500',
    },
  }
  return map[color] || map['red']
}

function getCategoryIcon(id: string): string {
  const icons: Record<string, string> = {
    schema: '📋',
    'ai-crawl': '🤖',
    content: '📄',
    eeat: '🏆',
    faq: '❓',
    technical: '⚙️',
    performance: '⚡',
  }
  return icons[id] || '📊'
}

function getImpactBadge(impact: string) {
  if (impact === 'high') return 'bg-red-100 text-red-700'
  if (impact === 'medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-600'
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GeoAeoCheckerClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showIssuesModal, setShowIssuesModal] = useState(false)

  const analyzeUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)
    setActiveCategory(null)

    try {
      const normalizedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`

      const res = await fetch('/api/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const { html, headers, finalUrl } = data

      const categories = [
        analyzeSchema(html),
        analyzeAiCrawlerAccess(html, headers),
        analyzeContentStructure(html),
        analyzeEeat(html),
        analyzeFaq(html),
        analyzeTechnical(html, headers),
        analyzePerformance(html, headers),
      ]

      const overallScore = calculateOverallScore(categories)
      const { grade, label, color } = getGrade(overallScore)

      const allChecks = categories.flatMap((c) => c.checks)
      const impactOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
      const topIssues = allChecks
        .filter((c) => !c.passed)
        .sort((a, b) => impactOrder[b.impact] - impactOrder[a.impact])
        .slice(0, 8)

      const passedChecks = allChecks.filter((c) => c.passed).length

      setResults({
        url: normalizedUrl,
        finalUrl,
        overallScore,
        grade,
        gradeLabel: label,
        gradeColor: color,
        categories,
        topIssues,
        passedChecks,
        totalChecks: allChecks.length,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Could not analyze page: ${message}. Check the URL and try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') analyzeUrl()
  }

  const gradeColors = results ? getGradeColors(results.gradeColor) : null

  // Score ring circumference
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const scoreOffset = results
    ? circumference - (results.overallScore / 100) * circumference
    : circumference

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">

      {/* ─── Hero + Tool Interface ─── */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free GEO & AEO Score Checker: Is Your Website Ready for AI Search?
              </span>
            </h1>

            {/* Answer Capsule */}
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                A GEO/AEO score checker audits your web page across seven AI readiness categories —
                schema markup, AI crawler access, content structure, E-E-A-T signals, FAQ readiness,
                technical signals, and performance — returning a 0–100 score with specific fixes for
                every failed check.
              </p>
            </div>

            {/* ─── Form + Grade Card Row ─── */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch mb-6">

              {/* Tool Form — left, flex-1 */}
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-left">
                    Enter Any Page URL to Check AI Search Readiness
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="https://example.com/your-page"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      aria-label="URL to analyze"
                    />
                    <button
                      onClick={analyzeUrl}
                      disabled={loading}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>🤖 Check GEO/AEO Score</>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 text-left mb-4">
                    Analyzes 30+ signals across 7 categories — results in under 15 seconds
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 text-left">
                      {error}
                    </div>
                  )}

                  {/* Feature checkmarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                    {FEATURE_ITEMS.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-600 text-left">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grade Card — right, empty until results arrive */}
              <div className="w-full lg:w-80 flex-shrink-0 flex flex-col">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-col flex-1">
                  {results ? (
                    <div className="flex flex-col items-center flex-1">
                      <div className="relative mb-2">
                        <svg width="100" height="100" className="-rotate-90">
                          <circle cx="50" cy="50" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
                          <circle
                            cx="50" cy="50" r={radius}
                            strokeWidth="8" fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={scoreOffset}
                            strokeLinecap="round"
                            className={`transition-all duration-1000 ${gradeColors?.ring || 'stroke-red-500'}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900 leading-none">{results.overallScore}</span>
                          <span className="text-[10px] text-gray-400">/100</span>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm mb-1 ${gradeColors?.bg} ${gradeColors?.text} ${gradeColors?.border} border`}>
                        Grade {results.grade}
                      </div>
                      <p className="text-xs text-gray-500 font-medium text-center mb-1">{results.gradeLabel}</p>
                      <p className="text-xs text-gray-600 mb-2 text-center">
                        <span className="font-bold text-gray-800 text-sm">{results.passedChecks}/{results.totalChecks}</span> checks passed
                      </p>
                      <div className="text-center mb-2 w-full px-2 truncate">
                        <a href={results.finalUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                          {results.finalUrl.replace(/^https?:\/\//, '').slice(0, 38)}{results.finalUrl.replace(/^https?:\/\//, '').length > 38 ? '…' : ''}
                        </a>
                      </div>
                      <button
                        onClick={analyzeUrl}
                        disabled={loading}
                        className="w-full px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                      >
                        🔄 Re-check
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-center">
                      <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center mb-3">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-400 mb-1">Your score appears here</p>
                      <p className="text-xs text-gray-400">Enter a URL above and<br />click Check GEO/AEO Score</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Results: Categories + Issues ─── */}
            {results && (
              <>
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                  {/* ── LEFT: Category List ── */}
                  <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-1">
                        Categories — click to inspect
                      </p>
                      <div className="space-y-1">
                        {results.categories.map((cat) => {
                          const pct = cat.score / cat.weight
                          const barColor = pct >= 0.85 ? 'bg-green-500' : pct >= 0.55 ? 'bg-yellow-500' : 'bg-red-500'
                          const scoreColor = pct >= 0.85 ? 'text-green-600' : pct >= 0.55 ? 'text-yellow-600' : 'text-red-600'
                          const isActive = activeCategory === cat.id
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setActiveCategory(isActive ? null : cat.id)}
                              className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-left transition-all ${isActive ? 'bg-primary/10 border border-primary/30' : 'hover:bg-gray-50 border border-transparent'}`}
                            >
                              <span className="text-lg flex-shrink-0">{getCategoryIcon(cat.id)}</span>
                              <span className="flex-1 text-sm font-medium text-gray-700 leading-tight min-w-0 truncate">{cat.name}</span>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-14 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct * 100}%` }} />
                                </div>
                                <span className={`text-sm font-bold w-10 text-right ${scoreColor}`}>{cat.score}/{cat.weight}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── MIDDLE: Category Detail ── */}
                  <div className="flex-1 min-w-0">
                    {activeCategory ? (
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                        {results.categories
                          .filter((c) => c.id === activeCategory)
                          .map((cat) => (
                            <div key={cat.id}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{getCategoryIcon(cat.id)}</span>
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
                                    <p className="text-sm text-gray-400">{cat.score}/{cat.weight} pts · {cat.checks.filter(c => c.passed).length}/{cat.checks.length} passed</p>
                                  </div>
                                </div>
                                <button onClick={() => setActiveCategory(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                              </div>
                              <div className="space-y-2">
                                {cat.checks.map((check, i) => (
                                  <details key={i} className="group">
                                    <summary className="flex items-start gap-2.5 cursor-pointer list-none p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                      <span className="mt-0.5 flex-shrink-0">{check.passed ? '✅' : '❌'}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-1.5 flex-wrap">
                                          <span className="text-sm font-medium text-gray-800">{check.label}</span>
                                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getImpactBadge(check.impact)}`}>{check.impact}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5">{check.detail}</p>
                                      </div>
                                      <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </summary>
                                    {!check.passed && (
                                      <div className="ml-8 mt-1.5 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm font-semibold text-blue-700 mb-0.5">💡 How to fix:</p>
                                        <p className="text-sm text-blue-600">{check.fix}</p>
                                      </div>
                                    )}
                                  </details>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : results.topIssues.length === 0 ? (
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                        <div className="text-4xl mb-3">🎉</div>
                        <p className="font-bold text-gray-900 mb-1 text-base">No critical issues found!</p>
                        <p className="text-sm text-gray-500">Click any category on the left to inspect individual checks.</p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 text-center">
                        <p className="text-sm text-blue-700">← Click any category to inspect individual checks and fixes</p>
                      </div>
                    )}
                  </div>

                  {/* ── RIGHT: Top Issues summary card (click → modal) ── */}
                  {results.topIssues.length > 0 && (
                    <div className="w-full lg:w-52 flex-shrink-0">
                      <button
                        onClick={() => setShowIssuesModal(true)}
                        className="w-full h-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4 text-left hover:shadow-md hover:border-red-200 transition-all group"
                      >
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5 text-sm group-hover:text-red-600 transition-colors">
                          <span>🔴</span> Top Issues to Fix
                        </h3>
                        <div className="space-y-2 mb-3">
                          {results.topIssues.slice(0, 4).map((issue, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-xs flex-shrink-0 mt-0.5">❌</span>
                              <span className="text-xs text-gray-600 leading-relaxed line-clamp-1">{issue.label}</span>
                            </div>
                          ))}
                        </div>
                        {results.topIssues.length > 4 && (
                          <p className="text-xs text-gray-400 mb-2">+{results.topIssues.length - 4} more</p>
                        )}
                        <div className="text-xs font-semibold text-primary flex items-center gap-1">
                          View all {results.topIssues.length} issues →
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Top Issues Modal ── */}
                {showIssuesModal && (
                  <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowIssuesModal(false)}
                  >
                    <div
                      className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                        <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                          <span>🔴</span> Top Issues to Fix
                          <span className="text-sm font-normal text-gray-400">— sorted by impact</span>
                        </h2>
                        <button onClick={() => setShowIssuesModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4">×</button>
                      </div>
                      <div className="overflow-y-auto p-5 space-y-3">
                        {results.topIssues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="flex-shrink-0 mt-0.5">❌</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span className="text-sm font-semibold text-gray-800">{issue.label}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getImpactBadge(issue.impact)}`}>
                                  {issue.impact}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 leading-relaxed">{issue.fix}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <ToolBreadcrumb toolName="GEO & AEO Score Checker" toolSlug="geo-aeo-checker" />

      {/* Author Expertise Block */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">RS</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    Built by Rohit Sharma — 13+ Years in Technical SEO
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "I started tracking AI search citations for clients in late 2024. The pattern was immediate: sites getting cited in ChatGPT, Perplexity, and Google AI Overviews all shared the same structural traits — question-format headings, FAQPage schema, clear E-E-A-T signals, and AI crawler access. Sites missing even one of these consistently got ignored. This checker scores all of them in one pass."
                  </p>
                  <p className="text-gray-800 font-medium">
                    — Rohit Sharma, Founder of SEOShouts | <a href="/meet-the-experts/" className="text-primary hover:underline">Meet Our Experts</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 1: What Are GEO and AEO ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                What Are GEO and AEO — and Why Do They Matter in 2026?
              </span>
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) are the two
                dominant optimization frameworks for AI-era search. While traditional SEO focuses on
                ranking in blue-link search results, GEO and AEO focus on getting your content cited,
                extracted, and surfaced by AI systems — including Google AI Overviews, ChatGPT,
                Perplexity, Claude, Gemini, and Copilot.
              </p>
              <p>
                The distinction matters because AI search is changing where web traffic originates.
                According to SparkToro&apos;s 2025 Zero-Click Search study,{' '}
                <strong>58.5% of Google searches now end without a click</strong> — users get their
                answers directly from AI-generated summaries. For brands not cited in these summaries,
                that traffic is invisible.
              </p>
              <p>
                <strong>AEO</strong> focuses on structuring content so that AI answer engines — voice
                assistants, featured snippets, and AI chatbots — can extract clear, direct answers to
                specific questions. It prioritizes question-format headings, FAQPage schema, concise
                answer paragraphs, and structured data markup.
              </p>
              <p>
                <strong>GEO</strong> is broader — it focuses on building content that generative AI
                models trust enough to cite as a source. This requires not just structural signals but
                also E-E-A-T signals, external citations, factual depth, and proprietary data that AI
                models cannot generate themselves.
              </p>
              <p>
                Research from Search Engine Journal&apos;s 2025 AI citation analysis found that{' '}
                <strong>pages with FAQPage schema were cited in AI Overviews 3.6x more frequently</strong>{' '}
                than pages without it. seoClarity found that pages with clear author attribution
                received <strong>2.8x more AI citations</strong> than anonymous content. The signals
                are measurable — and that&apos;s exactly what this tool measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: The 7 Categories ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The 7 Categories This Tool Audits
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '📋',
                  title: '1. Schema Markup (20 points)',
                  bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
                  border: 'border-blue-200',
                  iconBg: 'bg-primary',
                  text: "Schema markup is the single highest-impact signal for AI search readiness. AI models are trained to recognize Schema.org vocabulary as authoritative metadata about your page. This category checks for FAQPage schema (the most impactful for AI answer extraction), Organization schema with entity signals, BreadcrumbList for hierarchy understanding, Article schema with author attribution, and HowTo or SoftwareApplication for tool and tutorial pages. Pages with comprehensive schema markup are cited in Google AI Overviews at rates 3–4x higher than pages with no schema (Conductor, 2025).",
                },
                {
                  icon: '🤖',
                  title: '2. AI Crawler Access (18 points)',
                  bg: 'bg-gradient-to-br from-green-50 to-green-100/50',
                  border: 'border-green-200',
                  iconBg: 'bg-green-600',
                  text: "Your content cannot be cited by AI if AI crawlers cannot access it. This category checks whether major AI bots are blocked at the page level via meta robots tags or X-Robots-Tag headers, whether a canonical tag is present to prevent duplicate content confusion, whether the page is HTTPS (a baseline trust signal), and whether an llms.txt file is referenced — the emerging standard for telling AI models what a site is about.",
                },
                {
                  icon: '📄',
                  title: '3. Content Structure for AI Extraction (18 points)',
                  bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
                  border: 'border-purple-200',
                  iconBg: 'bg-purple-600',
                  text: "AI models extract answers from content that is structured for extraction. This category checks for a direct answer capsule in the first 300 characters, question-format H2/H3 headings, presence of data and statistics, appropriate paragraph length (under 120 words), comparison tables, and minimum content depth (500+ words). The key insight: AI models do not read content the way humans do. They parse structure.",
                },
                {
                  icon: '🏆',
                  title: '4. E-E-A-T Signals (15 points)',
                  bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50',
                  border: 'border-yellow-200',
                  iconBg: 'bg-yellow-500',
                  text: "Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) governs both traditional ranking and AI citation eligibility. This category checks for visible author attribution, author schema with Person type, explicit expertise or credential mentions, links to About/Team pages, external citations and references, publication dates, contact information, and legal page links.",
                },
                {
                  icon: '❓',
                  title: '5. FAQ & Q&A Readiness (12 points)',
                  bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50',
                  border: 'border-orange-200',
                  iconBg: 'bg-orange-500',
                  text: "FAQs are the highest-ROI content format for AI citation. AI models are specifically designed to match user questions to pages that answer them. This category checks for FAQPage schema with 3+ Q&A pairs, a visual FAQ section in the HTML, question-format headings throughout the content, and substantive answers (50+ words each) in the FAQ schema.",
                },
                {
                  icon: '⚙️',
                  title: '6. Technical AI Readiness (10 points)',
                  bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50',
                  border: 'border-indigo-200',
                  iconBg: 'bg-indigo-600',
                  text: "Basic technical signals that affect AI model confidence in your content: meta description presence, Open Graph tags (used by AI scraping tools for entity data), HTML lang attribute for language classification, UTF-8 charset declaration, viewport meta for mobile-friendliness, and hreflang for multilingual sites.",
                },
                {
                  icon: '⚡',
                  title: '7. Page Performance Signals (7 points)',
                  bg: 'bg-gradient-to-br from-pink-50 to-pink-100/50',
                  border: 'border-pink-200',
                  iconBg: 'bg-pink-600',
                  text: "Performance signals that correlate with AI citation worthiness: GZIP/Brotli compression, image alt text coverage, browser caching headers, and lazy loading. Slower pages are crawled less frequently by all bots — including AI training crawlers — reducing the recency and completeness of your content in AI model training data.",
                },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} border ${item.border} rounded-xl p-6 text-left`}>
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                      <span className="text-white text-xl">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: How to Read Your Score ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How to Read Your GEO/AEO Score
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      <th className="text-left px-6 py-4 font-bold">Score Range</th>
                      <th className="text-left px-6 py-4 font-bold">Grade</th>
                      <th className="text-left px-6 py-4 font-bold">What It Means</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      ['85–100', 'A — AI-Ready', 'Strong across all categories. Likely being cited in AI responses.'],
                      ['70–84', 'B — Good', 'Most signals present. Fix remaining high-impact issues to reach top tier.'],
                      ['55–69', 'C — Average', 'Several gaps. AI models may crawl but rarely cite this page.'],
                      ['40–54', 'D — Poor', 'Major structural issues. Content likely ignored by AI answer systems.'],
                      ['0–39', 'F — Critical', 'Not AI-ready. Fundamental signals missing across multiple categories.'],
                    ].map(([range, grade, meaning], i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{range}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{grade}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  Priority Order for Fixes
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-4">
                  Always fix <strong>high-impact failed checks</strong> first. The tool labels every failed check as High, Medium, or Low impact. High-impact fixes — missing FAQPage schema, no answer capsule, AI crawlers blocked — move your score the most.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  A page going from grade F to grade C typically requires fixing 3–5 high-impact checks. Going from C to A requires fixing medium-impact checks systematically.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">📈</span>
                  Score vs. Rankings: What to Expect
                </h3>
                <ul className="space-y-3">
                  {[
                    'Days 1–7: AI crawlers re-index updated pages',
                    'Weeks 2–4: Schema changes begin reflecting in rich results (visible in Google Search Console)',
                    'Weeks 4–12: AI citation frequency increases as models incorporate updated pages',
                    'Months 3–6: Compounding authority effects — more citations → more brand searches → more traffic',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-primary mt-1 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: GEO vs AEO vs SEO Table ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                GEO vs. AEO vs. SEO — What&apos;s the Difference?
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      {['Dimension', 'SEO', 'AEO', 'GEO'].map((h) => (
                        <th key={h} className="text-left px-6 py-4 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      ['Goal', 'Rank in blue-link results', 'Get extracted as a direct answer', 'Get cited by generative AI models'],
                      ['Primary signals', 'Backlinks, on-page, authority', 'FAQPage schema, question headings, answer capsules', 'E-E-A-T, structured data, proprietary data, citations'],
                      ['Traffic mechanism', 'User clicks on blue link', 'Featured snippet / voice answer (often zero-click)', 'Citation in AI response (brand awareness + some clicks)'],
                      ['Content format', 'Long-form, keyword-rich', 'Q&A structured, concise answers', 'Expert-authored, data-rich, citable'],
                      ['Time to results', '3–6 months', '2–8 weeks', '4–12 weeks'],
                    ].map(([dim, seo, aeo, geo], i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{dim}</td>
                        <td className="px-6 py-4 text-gray-700">{seo}</td>
                        <td className="px-6 py-4 text-gray-700">{aeo}</td>
                        <td className="px-6 py-4 text-gray-700">{geo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              The optimal strategy in 2026 is to optimize for all three simultaneously. They share many signals: structured content helps SEO and AEO; E-E-A-T signals help SEO and GEO; schema helps SEO, AEO, and GEO.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Fastest GEO/AEO Wins ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The Fastest GEO/AEO Wins (High Score Impact, Low Effort)
              </span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              If your score is below 60, these changes will have the biggest immediate impact:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Add FAQPage Schema</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">This single change is responsible for more AI citation improvements than any other. Use our <a href="/tools/schema-generator/" className="text-primary hover:underline">Schema Generator</a> to create FAQPage markup. <strong>Impact: +8–15 points.</strong></p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Write an Answer Capsule</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">A 120–300 character direct-answer paragraph as the first content on the page. No preamble — just a factual answer to the primary question. AI models extract this as the page summary.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">❓</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Convert H2s to Questions</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Change "Our Services" to "What SEO Services Does SEOShouts Offer?" AI models match user question intent to question-format headings directly. Convert 2–3 H2s per page.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Add Organization Schema</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Organization schema with sameAs links to your LinkedIn, Twitter/X, YouTube, and other profiles tells AI models that your brand is a real entity with verified presence across the web.</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-6 border border-pink-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Unblock AI Crawlers</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Check your robots.txt for blocks on GPTBot, ClaudeBot, PerplexityBot, and Google-Extended. Use our <a href="/tools/robots-txt-generator/" className="text-primary hover:underline">Robots.txt Generator</a> to fix this correctly.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-6 border border-indigo-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Track & Re-Test Weekly</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">After implementing fixes, re-run this checker weekly. AI crawlers re-index pages within days. Schema changes show in rich results within 2–4 weeks. Citation frequency increases in 4–12 weeks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: Testing AI Visibility ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Testing Your AI Visibility After Optimization
              </span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Improving your score is step one. Verifying it with real AI citation tests is step two.
              Here&apos;s the weekly testing protocol we recommend:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: 'Queries to test',
                  items: [
                    '"[Your brand name] reviews"',
                    '"best [service] for [audience]"',
                    '"[primary keyword your page targets]"',
                    '"how to [thing your tool helps with]"',
                    '"what is [topic your page defines]"',
                  ],
                },
                {
                  title: 'Platforms to test',
                  items: [
                    'ChatGPT (GPT-4)',
                    'Perplexity',
                    'Claude (claude.ai)',
                    'Google AI Overviews',
                    'Gemini & Microsoft Copilot',
                  ],
                },
                {
                  title: 'What to track',
                  items: [
                    'Was your brand cited? (Yes/No)',
                    'What content was cited? (URL)',
                    'Which competitors were cited?',
                    'What sentiment was expressed?',
                    'Change after GEO fixes (2–3 weeks)',
                  ],
                },
              ].map((col, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{col.title}</h3>
                  <ul className="space-y-2">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Table ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SEOShouts vs Other GEO/AEO Tools
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      {['Feature', 'SEOShouts', 'AI Rank Lab', 'HubSpot AEO Grader', 'Insites GEO', 'Zicy Extension'].map(
                        (h, i) => (
                          <th key={h} className={`text-left px-4 py-4 font-bold ${i === 1 ? 'bg-primary/20' : ''}`}>
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      ['Composite 0–100 Score', '✅', '✅', '✅', '✅', '✅'],
                      ['Schema Markup Analysis', '✅ Deep (6 checks)', '✅ Basic', '✅ Basic', '❌', '✅'],
                      ['AI Crawler Access Check', '✅', '✅', '❌', '✅', '✅'],
                      ['E-E-A-T Signal Scoring', '✅ 8 checks', '❌', '❌', '✅ Basic', '❌'],
                      ['FAQ/Q&A Readiness', '✅ 5 checks', '✅', '✅', '❌', '✅'],
                      ['Content Structure Audit', '✅ 8 checks', '❌', '❌', '✅', '❌'],
                      ['Per-Check Fix Recommendations', '✅ Every check', '❌', '❌', '❌', '❌'],
                      ['llms.txt Detection', '✅', '❌', '❌', '❌', '❌'],
                      ['No Login Required', '✅', '✅', '✅', '❌', '✅'],
                      ['Free', '✅ Fully free', '✅ Limited', '✅ Basic only', '❌ Paid', '✅'],
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-4 py-3 ${j === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'} ${j === 1 ? 'font-semibold text-primary bg-blue-50' : ''}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GEO/AEO Readiness Checklist ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                GEO/AEO Readiness Checklist (2026)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: '📋 Schema Markup',
                  items: [
                    'FAQPage schema with 3+ Q&A pairs',
                    'Organization schema with name, url, logo, sameAs',
                    'Article/WebPage schema with author Person entity',
                    'BreadcrumbList schema on all inner pages',
                    'HowTo or SoftwareApplication schema where applicable',
                  ],
                },
                {
                  title: '🤖 AI Crawler Access',
                  items: [
                    'GPTBot, ClaudeBot, PerplexityBot allowed in robots.txt',
                    'Google-Extended allowed (for AI Overviews)',
                    'Canonical tag on every page',
                    'HTTPS on all pages',
                    'llms.txt file at domain root',
                  ],
                },
                {
                  title: '📄 Content Structure',
                  items: [
                    'Answer capsule (120–300 chars) as first paragraph',
                    '2+ H2s in question format',
                    'Statistics cited every 150–200 words',
                    'No paragraphs over 120 words',
                    'Comparison table present for decision queries',
                    '500+ words minimum',
                  ],
                },
                {
                  title: '🏆 E-E-A-T',
                  items: [
                    'Visible author byline on all content pages',
                    'Author schema (Person) with credentials',
                    'Credentials explicitly stated ("X years experience")',
                    'Link to About/Team/Experts page',
                    '3+ external authoritative citations',
                    'Publication + last updated date visible',
                  ],
                },
                {
                  title: '❓ FAQ & Q&A',
                  items: [
                    'FAQ section present on key pages',
                    'FAQPage schema with answers 50+ words each',
                    'Question-format headings throughout content',
                  ],
                },
                {
                  title: '⚙️ Technical',
                  items: [
                    'Meta description 120–155 chars on every page',
                    'All OG tags (title, description, image) present',
                    'HTML lang attribute set',
                    'UTF-8 charset declared',
                    'Viewport meta tag for mobile',
                  ],
                },
              ].map((col, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">{col.title}</h3>
                  <ul className="space-y-2">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
                Frequently Asked Questions
              </h2>
              <p className="text-center text-gray-600">Everything you need to know about GEO & AEO optimization</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:grid-flow-row-dense">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                  <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                    <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>{item.q}</span>
                    <span className="text-primary text-xl group-open:rotate-90 transition-transform flex-shrink-0 ml-3">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related Tools ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Explore Our Other Free SEO Tools
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">GEO & AEO Score Checker</h3>
                <p className="text-sm text-gray-600 mb-4">Audit AI search readiness across 7 categories with per-check fix recommendations.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>
              {[
                { emoji: '🔬', name: 'On-Page SEO Analyzer', desc: 'Audit 150+ on-page SEO factors with real Google PageSpeed data.', href: '/tools/on-page-seo-analyzer/' },
                { emoji: '🔗', name: 'Internal Link Checker', desc: 'Visualize anchor text distribution and audit internal link structure.', href: '/tools/internal-link-checker/' },
                { emoji: '🏗️', name: 'Schema Generator', desc: 'Generate JSON-LD structured data for 39+ schema types instantly.', href: '/tools/schema-generator/' },
                { emoji: '🤖', name: 'Robots.txt Generator', desc: 'Create robots.txt rules including directives for AI crawlers.', href: '/tools/robots-txt-generator/' },
                { emoji: '🚫', name: 'Disavow File Generator', desc: 'Google-compliant disavow files from any backlink export format.', href: '/tools/disavow-file-generator/' },
              ].map((tool) => (
                <a key={tool.href} href={tool.href} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 block">
                  <div className="text-3xl mb-3">{tool.emoji}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{tool.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{tool.desc}</p>
                  <span className="text-primary font-medium">Try Tool →</span>
                </a>
              ))}
            </div>
            <div className="text-center">
              <a href="/tools/" className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="mr-2">🛠️</span>
                Browse All 18 Free SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">All tools are 100% free · No signup required · Instant results</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Find out if AI search engines are ignoring your website
              </span>
            </h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              And exactly what to fix — 30+ checks across 7 categories, results in under 15 seconds.
            </p>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🤖 Check Your GEO/AEO Score Now
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>⚡</span>
                <span>30+ checks across 7 categories in under 15 seconds</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>Every failed check includes a specific fix</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🔓</span>
                <span>Free forever — no login, no credit card</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
