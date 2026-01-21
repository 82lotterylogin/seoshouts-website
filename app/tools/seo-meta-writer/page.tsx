import { Metadata } from 'next'
import SeoMetaWriterClient from './SeoMetaWriterClient'
import RelatedTools from '../../components/RelatedTools'

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
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SEO Meta Writer",
            "description": "Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags. Free tool, no signup required.",
            "url": "https://seoshouts.com/tools/seo-meta-writer/",
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
                "name": "SEO Meta Writer",
                "item": "https://seoshouts.com/tools/seo-meta-writer"
              }
            ]
          })
        }}
      />

      <SeoMetaWriterClient />
      <RelatedTools currentTool="seo-meta-writer" />
    </>
  )
}