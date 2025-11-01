import { Metadata } from 'next'
import KeywordDifficultyCheckerClient from './KeywordDifficultyCheckerClient'

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
  return <KeywordDifficultyCheckerClient />
}