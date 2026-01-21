import { Metadata } from 'next'
import KeywordDensityAnalyzerClient from './KeywordDensityAnalyzerClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free Keyword Density Analyzer Tool | SEO Shouts',
  description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.',
  keywords: 'keyword density analyzer, keyword density checker, SEO content analysis, keyword optimization, content SEO tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/keyword-density-analyzer/',
  },
  openGraph: {
    title: 'Free Keyword Density Analyzer Tool | SEO Shouts',
    description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.',
    url: 'https://seoshouts.com/tools/keyword-density-analyzer/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/keyword-density-analyzer-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Keyword Density Analyzer Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Keyword Density Analyzer Tool | SEO Shouts',
    description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations.',
    images: ['https://seoshouts.com/images/keyword-density-analyzer-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function KeywordDensityAnalyzer() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Keyword Density Analyzer",
            "description": "Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.",
            "url": "https://seoshouts.com/tools/keyword-density-analyzer/",
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
                "name": "Keyword Density Analyzer",
                "item": "https://seoshouts.com/tools/keyword-density-analyzer"
              }
            ]
          })
        }}
      />

      <KeywordDensityAnalyzerClient />
      <RelatedTools currentTool="keyword-density-analyzer" />
    </>
  )
}