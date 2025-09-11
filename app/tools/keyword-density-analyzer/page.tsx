import { Metadata } from 'next'
import KeywordDensityAnalyzerClient from './KeywordDensityAnalyzerClient'

export const metadata: Metadata = {
  title: 'Free Keyword Density Analyzer Tool | SEO Shouts',
  description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.',
  keywords: 'keyword density analyzer, keyword density checker, SEO content analysis, keyword optimization, content SEO tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/keyword-density-analyzer',
  },
  openGraph: {
    title: 'Free Keyword Density Analyzer Tool | SEO Shouts',
    description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.',
    url: 'https://seoshouts.com/tools/keyword-density-analyzer',
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
  return <KeywordDensityAnalyzerClient />
}