import type { Metadata } from 'next'
import GeoAeoCheckerClient from './GeoAeoCheckerClient'

const faqItems = [
  {
    question: 'What is a GEO/AEO score?',
    answer:
      'A GEO/AEO score is a 0–100 composite measure of how well-optimized a web page is for AI search engines and answer engines. It combines scores across seven categories: schema markup, AI crawler access, content structure, E-E-A-T signals, FAQ readiness, technical signals, and page performance. A higher score correlates with higher citation frequency in Google AI Overviews, ChatGPT, Perplexity, and other AI search platforms.',
  },
  {
    question: 'What is the difference between GEO and AEO?',
    answer:
      'AEO (Answer Engine Optimization) focuses on structuring content so AI answer engines can extract direct answers — through FAQPage schema, question-format headings, and concise answer paragraphs. GEO (Generative Engine Optimization) is broader — it focuses on making content trustworthy and citable by generative AI models, which requires E-E-A-T signals, proprietary data, and expert attribution in addition to structural signals. In practice, optimizing for both simultaneously is the most effective approach.',
  },
  {
    question: 'How accurate is the GEO/AEO score?',
    answer:
      "The score is based on signals that are directly detectable in your page's HTML and HTTP headers. It does not access Google's internal scoring, Perplexity's index, or any AI model's training data. Think of it as a structural audit — it tells you whether your page has the signals that research shows correlate with AI citations. Actual citation frequency depends on many factors including domain authority, content quality, and competition.",
  },
  {
    question: 'Why is my schema score low when I have schema markup?',
    answer:
      'The checker looks for specific, high-impact schema types: FAQPage, Organization, Author (Person), and BreadcrumbList. Having WebSite or Product schema alone will not score highly. FAQPage schema is the single most impactful schema type for AI citation and receives the most weight in the schema category.',
  },
  {
    question: 'Can a page score 100?',
    answer:
      'In theory yes, but in practice a score of 85–90 is excellent. Some checks — like hreflang (relevant only for multilingual sites) — may not apply to your page. Focus on A grade (85+) rather than perfect 100.',
  },
  {
    question: 'How often should I run the GEO/AEO checker?',
    answer:
      'Run it after any significant content update, after adding schema markup, after changing your robots.txt, and monthly as part of your regular SEO audit. Track your score over time to measure the impact of individual improvements.',
  },
  {
    question: 'Does improving my GEO/AEO score hurt traditional SEO?',
    answer:
      'No — the signals this tool checks (schema markup, E-E-A-T, content structure, FAQ sections) are all positive signals for traditional Google search rankings too. GEO/AEO optimization and traditional SEO are complementary, not competing.',
  },
  {
    question: 'What should I fix first after getting my score?',
    answer:
      'Fix High-impact failed checks first. The tool sorts your issues by impact level. Typically, the fastest wins are: adding FAQPage schema (if missing), writing an answer capsule, converting H2s to question format, and ensuring AI crawlers are not blocked.',
  },
  {
    question: 'What makes this the best AEO checking tool to start with?',
    answer:
      'Most AEO checking tools either audit a single signal (like schema) or sit behind a paid subscription. This checker runs 30+ checks across all seven categories that influence AI citations: schema markup, AI crawler access, content structure, E-E-A-T, FAQ readiness, technical signals, and performance, and it is completely free with no login. It also explains how to fix every failed check, so it works as both an AEO checker and a prioritized to-do list.',
  },
]

export const metadata: Metadata = {
  title: 'Free AEO Checker & GEO Score Tool — 30+ AI Checks | SEOShouts',
  description:
    "Check your website's GEO and AEO readiness score. Audits schema, AI crawler access, content structure, E-E-A-T & FAQ signals across 7 categories. Free, instant.",
  keywords:
    'GEO AEO checker, AEO score checker, GEO readiness checker, AI search optimization checker, answer engine optimization checker, generative engine optimization tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/geo-aeo-checker/',
  },
  openGraph: {
    title: 'Free AEO Checker & GEO Score Tool — 30+ AI Checks',
    description:
      'Is your website ready for AI search? Get a 0–100 GEO/AEO score with actionable fixes across 7 categories.',
    url: 'https://seoshouts.com/tools/geo-aeo-checker/',
    siteName: 'SEOShouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AEO Checker & GEO Score Tool — 30+ AI Checks',
    description:
      'Audit schema markup, AI crawler access, E-E-A-T signals, FAQ readiness & more. Free, no login.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function GeoAeoCheckerPage() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SEOShouts AEO Checker & GEO Score Tool',
    url: 'https://seoshouts.com/tools/geo-aeo-checker/',
    applicationCategory: 'BrowserApplication',
    applicationSubCategory: 'SEO Tool',
    operatingSystem: 'Any (Web Browser)',
    softwareVersion: '1.1',
    datePublished: '2026-01-15',
    dateModified: '2026-07-04',
    publisher: {
      '@type': 'Organization',
      name: 'SEOShouts',
      url: 'https://seoshouts.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://seoshouts.com/logo.png',
      },
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Free GEO and AEO readiness checker. Audits any URL across 7 categories: schema markup, AI crawler access, content structure, E-E-A-T signals, FAQ readiness, technical signals, and performance.',
    featureList: [
      'Schema Analysis',
      'AI Crawler Detection',
      'Content Structure Audit',
      'E-E-A-T Scoring',
      'FAQ Schema Check',
      'Technical AI Signals',
      '0-100 Composite Score',
    ],
    author: {
      '@type': 'Person',
      name: 'Rohit Sharma',
      url: 'https://seoshouts.com/meet-the-experts/',
      jobTitle: 'Founder & SEO Strategist',
      worksFor: {
        '@type': 'Organization',
        name: 'SEOShouts',
      },
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://seoshouts.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'SEO Tools',
        item: 'https://seoshouts.com/tools/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'GEO & AEO Score Checker',
        item: 'https://seoshouts.com/tools/geo-aeo-checker/',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Check and Improve Your Website's AI Search Readiness",
          "description": "Use the free SEOShouts GEO & AEO Score Checker to audit any page across 7 AI search readiness categories and get a 0–100 composite score with specific fix recommendations.",
          "tool": { "@type": "HowToTool", "name": "SEOShouts GEO & AEO Score Checker", "url": "https://seoshouts.com/tools/geo-aeo-checker/" },
          "step": [
            { "@type": "HowToStep", "position": 1, "name": "Enter Your Page URL", "text": "Type the full URL of the page you want to audit into the input field. The tool fetches your live page and analyzes its HTML and HTTP headers." },
            { "@type": "HowToStep", "position": 2, "name": "Run the AI Readiness Audit", "text": "Click Analyze to start the audit. The tool checks 7 categories: schema markup, AI crawler access, content structure, E-E-A-T signals, FAQ readiness, technical signals, and page performance." },
            { "@type": "HowToStep", "position": 3, "name": "Review Your Score Across 7 Categories", "text": "See your overall 0–100 GEO/AEO score and individual category scores. High-impact failed checks are flagged first. Focus on A grade (85+) rather than perfect 100." },
            { "@type": "HowToStep", "position": 4, "name": "Implement the Recommended Fixes", "text": "Follow the per-check fix recommendations. The fastest wins are: adding FAQPage schema, writing an answer capsule, converting H2s to question format, and ensuring AI crawlers are not blocked in robots.txt." }
          ]
        })}}
      />

      {/* Speakable Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".tool-hero-sub"] },
          "url": "https://seoshouts.com/tools/geo-aeo-checker/"
        })}}
      />

      <GeoAeoCheckerClient />
    </>
  )
}
