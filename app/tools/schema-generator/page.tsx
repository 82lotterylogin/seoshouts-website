import { Metadata } from 'next'
import SchemaGeneratorClient from './SchemaGeneratorClient'

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
  return <SchemaGeneratorClient />
}