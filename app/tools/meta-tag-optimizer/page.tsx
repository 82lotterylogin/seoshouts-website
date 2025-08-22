import { Metadata } from 'next'
import MetaTagOptimizerClient from './MetaTagOptimizerClient'

export const metadata: Metadata = {
  title: 'Free Meta Tag Generator and Optimizer Tool | SEO Shouts',
  description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.',
  keywords: 'meta tag generator, title tag optimizer, meta description tool, SERP preview, SEO meta tags',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/meta-tag-optimizer',
  },
  openGraph: {
    title: 'Free Meta Tag Generator and Optimizer Tool | SEO Shouts',
    description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.',
    url: 'https://seoshouts.com/tools/meta-tag-optimizer',
    siteName: 'SEO Shouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Meta Tag Generator and Optimizer Tool | SEO Shouts',
    description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview.',
  },
}

export default function MetaTagOptimizer() {
  return <MetaTagOptimizerClient />
}