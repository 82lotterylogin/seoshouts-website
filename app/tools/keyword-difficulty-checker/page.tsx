import { Metadata } from 'next'
import KeywordDifficultyCheckerClient from './KeywordDifficultyCheckerClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free Keyword Difficulty Checker Tool | SEO Shouts',
  description: 'Stop wasting time on impossible keywords. Free keyword difficulty checker shows which keywords you can actually rank for with difficulty scores.',
  keywords: 'keyword difficulty checker, keyword competition analysis, SEO difficulty tool, keyword ranking difficulty',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/keyword-difficulty-checker/',
  },
  openGraph: {
    title: 'Free Keyword Difficulty Checker Tool | SEO Shouts',
    description: 'Stop wasting time on impossible keywords. Free keyword difficulty checker shows which keywords you can actually rank for with difficulty scores.',
    url: 'https://seoshouts.com/tools/keyword-difficulty-checker/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/keyword-difficulty-checker-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Keyword Difficulty Checker Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Keyword Difficulty Checker Tool | SEO Shouts',
    description: 'Stop wasting time on impossible keywords. Free keyword difficulty checker shows which keywords you can actually rank for.',
    images: ['https://seoshouts.com/images/keyword-difficulty-checker-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function KeywordDifficultyChecker() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Keyword Difficulty Checker",
            "description": "Stop wasting time on impossible keywords. Free keyword difficulty checker shows which keywords you can actually rank for with difficulty scores.",
            "url": "https://seoshouts.com/tools/keyword-difficulty-checker/",
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
                "name": "Keyword Difficulty Checker",
                "item": "https://seoshouts.com/tools/keyword-difficulty-checker"
              }
            ]
          })
        }}
      />

      <KeywordDifficultyCheckerClient />
      <RelatedTools currentTool="keyword-difficulty-checker" />
    </>
  )
}