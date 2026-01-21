import { Metadata } from 'next'
import AICopywriterClient from './AICopywriterClient'
import RelatedTools from '../../components/RelatedTools'

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
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Copywriter",
            "description": "Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool with multiple variations and optimization tips.",
            "url": "https://seoshouts.com/tools/ai-copywriter/",
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
                "name": "AI Copywriter",
                "item": "https://seoshouts.com/tools/ai-copywriter"
              }
            ]
          })
        }}
      />

      <AICopywriterClient />
      <RelatedTools currentTool="ai-copywriter" />
    </>
  )
}