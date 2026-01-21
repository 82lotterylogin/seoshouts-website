import { Metadata } from 'next'
import SchemaGeneratorClient from './SchemaGeneratorClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free Online Schema Generator - 39 Types - No Login - No Signup - SEOShouts',
  description: 'Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required. Organization, Article, Product, Event schemas & more.',
  keywords: 'schema generator, JSON-LD generator, structured data, schema markup, SEO schema, rich snippets',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/schema-generator/',
  },
  openGraph: {
    title: 'Free Online Schema Generator - 39 Types - No Login - No Signup - SEOShouts',
    description: 'Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required. Organization, Article, Product, Event schemas & more.',
    url: 'https://seoshouts.com/tools/schema-generator/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/schema-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Schema Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Schema Generator - 39 Types - No Login - No Signup - SEOShouts',
    description: 'Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required.',
    images: ['https://seoshouts.com/images/schema-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function SchemaGenerator() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Schema Generator",
            "description": "Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required. Organization, Article, Product, Event schemas & more.",
            "url": "https://seoshouts.com/tools/schema-generator/",
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
                "name": "Schema Generator",
                "item": "https://seoshouts.com/tools/schema-generator"
              }
            ]
          })
        }}
      />

      <SchemaGeneratorClient />
      <RelatedTools currentTool="schema-generator" />
    </>
  )
}