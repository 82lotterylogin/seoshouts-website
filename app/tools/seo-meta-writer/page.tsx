import { Metadata } from 'next'
import SeoMetaWriterClient from './SeoMetaWriterClient'

export const metadata: Metadata = {
  title: 'Free Online AI SEO Meta Title and Description Generator - No Sign - No Login',
  description: 'Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags. Free tool, no signup required.',
  keywords: 'SEO meta title generator, meta description generator, AI meta tags, SEO optimization, title tag generator, SERP optimization',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/seo-meta-writer/',
  },
  openGraph: {
    title: 'Free Online AI SEO Meta Title and Description Generator - No Sign - No Login',
    description: 'Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags. Free tool, no signup required.',
    url: 'https://seoshouts.com/tools/seo-meta-writer/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/seo-meta-writer-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Meta Writer Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online AI SEO Meta Title and Description Generator - No Sign - No Login',
    description: 'Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags.',
    images: ['https://seoshouts.com/images/seo-meta-writer-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function SeoMetaWriter() {
  return <SeoMetaWriterClient />
}