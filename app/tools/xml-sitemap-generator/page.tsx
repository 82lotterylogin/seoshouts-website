import { Metadata } from 'next'
import XmlSitemapGeneratorClient from './XmlSitemapGeneratorClient'

export const metadata: Metadata = {
  title: 'Free XML Sitemap Generator Tool | SEO Shouts',
  description: 'Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs with custom priority and frequency settings.',
  keywords: 'XML sitemap generator, sitemap creator, SEO sitemap, website sitemap, search engine optimization',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/xml-sitemap-generator',
  },
  openGraph: {
    title: 'Free XML Sitemap Generator Tool | SEO Shouts',
    description: 'Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs with custom priority and frequency settings.',
    url: 'https://seoshouts.com/tools/xml-sitemap-generator',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/xml-sitemap-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'XML Sitemap Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free XML Sitemap Generator Tool | SEO Shouts',
    description: 'Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs.',
    images: ['https://seoshouts.com/images/xml-sitemap-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function XmlSitemapGenerator() {
  return <XmlSitemapGeneratorClient />
}