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
]

export const metadata: Metadata = {
  title: 'Free GEO & AEO Score Checker — AI Search Readiness Audit | SEOShouts',
  description:
    "Check your website's GEO and AEO readiness score. Audits schema, AI crawler access, content structure, E-E-A-T & FAQ signals across 7 categories. Free, instant.",
  keywords:
    'GEO AEO checker, AEO score checker, GEO readiness checker, AI search optimization checker, answer engine optimization checker, generative engine optimization tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/geo-aeo-checker/',
  },
  openGraph: {
    title: 'Free GEO & AEO Score Checker — AI Search Readiness Audit',
    description:
      'Is your website ready for AI search? Get a 0–100 GEO/AEO score with actionable fixes across 7 categories.',
    url: 'https://seoshouts.com/tools/geo-aeo-checker/',
    siteName: 'SEOShouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free GEO & AEO Score Checker — AI Search Readiness Audit',
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
    name: 'GEO & AEO Score Checker',
    url: 'https://seoshouts.com/tools/geo-aeo-checker/',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
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
      <GeoAeoCheckerClient />
    </>
  )
}
