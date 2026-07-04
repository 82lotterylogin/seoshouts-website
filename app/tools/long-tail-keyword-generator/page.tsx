import { Metadata } from 'next'
import LongTailKeywordGeneratorClient from './LongTailKeywordGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
  description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
  keywords: 'long tail keywords, keyword research, SEO keywords, keyword generator, low competition keywords, keyword tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/long-tail-keyword-generator/',
  },
  openGraph: {
    title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
    description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
    url: 'https://seoshouts.com/tools/long-tail-keyword-generator/',
    siteName: 'SEOShouts',
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
    title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
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

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How many keywords can I generate?","acceptedAnswer":{"@type":"Answer","text":"There's no limit. Generate as many keyword lists as you need for your campaigns."}},{"@type":"Question","name":"Do you provide search volume data?","acceptedAnswer":{"@type":"Answer","text":"Yes, we include estimated monthly search volumes to help you prioritize keywords."}},{"@type":"Question","name":"Can I use this for PPC campaigns?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. Long tail keywords often have lower costs per click and higher conversion rates for paid ads."}},{"@type":"Question","name":"How often is the keyword data updated?","acceptedAnswer":{"@type":"Answer","text":"Our database is updated regularly to reflect current search trends and patterns."}},{"@type":"Question","name":"Is the tool free to use?","acceptedAnswer":{"@type":"Answer","text":"Yes, completely free with no hidden fees or usage limits."}},{"@type":"Question","name":"Can I save my keyword lists?","acceptedAnswer":{"@type":"Answer","text":"You can export keywords to CSV files or copy them for use in your preferred tools."}}]}) }} />

      <LongTailKeywordGeneratorClient />
    </>
  )
}