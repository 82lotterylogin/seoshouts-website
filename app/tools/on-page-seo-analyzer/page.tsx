import { Metadata } from 'next'
import OnPageSEOAnalyzerClient from './OnPageSEOAnalyzerClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
  description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
  keywords: 'on-page SEO analyzer, website SEO audit, SEO analysis tool, Core Web Vitals, technical SEO, content optimization, SEO checker, website analysis',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/on-page-seo-analyzer/',
  },
  openGraph: {
    title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
    description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
    url: 'https://seoshouts.com/tools/on-page-seo-analyzer/',
    siteName: 'SEO Shouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
    description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
  },
}

export default function OnPageSEOAnalyzer() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "On-Page SEO Analyzer",
            "description": "Free on-page SEO analyzer with 100+ ranking factors. Analyze title tags, meta descriptions, headings, Core Web Vitals, and technical SEO using Google PageSpeed API. No account needed.",
            "url": "https://seoshouts.com/tools/on-page-seo-analyzer/",
            "applicationCategory": "SEO Tool",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "SEOShouts"
            }
          })
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seoshouts.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": "https://seoshouts.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "On-Page SEO Analyzer",
                "item": "https://seoshouts.com/tools/on-page-seo-analyzer"
              }
            ]
          })
        }}
      />

      <OnPageSEOAnalyzerClient />
      <RelatedTools currentTool="on-page-seo-analyzer" />
    </>
  )
}