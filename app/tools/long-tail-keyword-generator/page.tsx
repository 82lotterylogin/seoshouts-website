import { Metadata } from 'next'
import LongTailKeywordGeneratorClient from './LongTailKeywordGeneratorClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Long Tail Keyword Generator Tool - No Signup - No Login - 100% Free - SEOShouts',
  description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
  keywords: 'long tail keywords, keyword research, SEO keywords, keyword generator, low competition keywords, keyword tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/long-tail-keyword-generator/',
  },
  openGraph: {
    title: 'Long Tail Keyword Generator Tool - No Signup - No Login - 100% Free - SEOShouts',
    description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
    url: 'https://seoshouts.com/tools/long-tail-keyword-generator/',
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
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Long Tail Keyword Generator",
            "description": "Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.",
            "url": "https://seoshouts.com/tools/long-tail-keyword-generator/",
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
                "name": "Long Tail Keyword Generator",
                "item": "https://seoshouts.com/tools/long-tail-keyword-generator"
              }
            ]
          })
        }}
      />

      <LongTailKeywordGeneratorClient />
      <RelatedTools currentTool="long-tail-keyword-generator" />
    </>
  )
}