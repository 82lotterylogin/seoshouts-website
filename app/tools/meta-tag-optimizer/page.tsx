import { Metadata } from 'next'
import MetaTagOptimizerClient from './MetaTagOptimizerClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free Meta Tag Generator and Optimizer Tool | SEO Shouts',
  description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.',
  keywords: 'meta tag generator, title tag optimizer, meta description tool, SERP preview, SEO meta tags',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/meta-tag-optimizer/',
  },
  openGraph: {
    title: 'Free Meta Tag Generator and Optimizer Tool | SEO Shouts',
    description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.',
    url: 'https://seoshouts.com/tools/meta-tag-optimizer/',
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
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Meta Tag Optimizer",
            "description": "Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.",
            "url": "https://seoshouts.com/tools/meta-tag-optimizer/",
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
                "name": "Meta Tag Optimizer",
                "item": "https://seoshouts.com/tools/meta-tag-optimizer"
              }
            ]
          })
        }}
      />

      <MetaTagOptimizerClient />
      <RelatedTools currentTool="meta-tag-optimizer" />
    </>
  )
}