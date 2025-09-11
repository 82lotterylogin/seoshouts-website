import { Metadata } from 'next'
import LongTailKeywordGeneratorClient from './LongTailKeywordGeneratorClient'

export const metadata: Metadata = {
  title: 'Long Tail Keyword Generator Tool - No Signup - No Login - 100% Free - SEOShouts',
  description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
  keywords: 'long tail keywords, keyword research, SEO keywords, keyword generator, low competition keywords, keyword tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/long-tail-keyword-generator',
  },
  openGraph: {
    title: 'Long Tail Keyword Generator Tool - No Signup - No Login - 100% Free - SEOShouts',
    description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
    url: 'https://seoshouts.com/tools/long-tail-keyword-generator',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/long-tail-keyword-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Long Tail Keyword Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Long Tail Keyword Generator Tool - No Signup - No Login - 100% Free - SEOShouts',
    description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions.',
    images: ['https://seoshouts.com/images/long-tail-keyword-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function LongTailKeywordGenerator() {
  return <LongTailKeywordGeneratorClient />
}