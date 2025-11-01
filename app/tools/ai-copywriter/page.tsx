import { Metadata } from 'next'
import AICopywriterClient from './AICopywriterClient'

export const metadata: Metadata = {
  title: 'Free AI Copywriting Tool for Web Copy, Ads & More — Write Like a Pro in Seconds',
  description: 'Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool with multiple variations and optimization tips.',
  keywords: 'AI copywriter, copywriting tool, ad copy generator, product description generator, email marketing copy, sales copy',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/ai-copywriter/',
  },
  openGraph: {
    title: 'Free AI Copywriting Tool for Web Copy, Ads & More — Write Like a Pro in Seconds',
    description: 'Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool with multiple variations and optimization tips.',
    url: 'https://seoshouts.com/tools/ai-copywriter/',
    siteName: 'SEO Shouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Copywriting Tool for Web Copy, Ads & More — Write Like a Pro in Seconds',
    description: 'Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool.',
  },
}

export default function AICopywriter() {
  return <AICopywriterClient />
}