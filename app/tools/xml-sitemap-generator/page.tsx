import { Metadata } from 'next'
import XmlSitemapGeneratorClient from './XmlSitemapGeneratorClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free XML Sitemap Generator Tool | SEO Shouts',
  description: 'Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs with custom priority and frequency settings.',
  keywords: 'XML sitemap generator, sitemap creator, SEO sitemap, website sitemap, search engine optimization',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/xml-sitemap-generator/',
  },
  openGraph: {
    title: 'Free XML Sitemap Generator Tool | SEO Shouts',
    description: 'Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs with custom priority and frequency settings.',
    url: 'https://seoshouts.com/tools/xml-sitemap-generator/',
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
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "XML Sitemap Generator",
            "description": "Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs with custom priority and frequency settings.",
            "url": "https://seoshouts.com/tools/xml-sitemap-generator/",
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
                "name": "XML Sitemap Generator",
                "item": "https://seoshouts.com/tools/xml-sitemap-generator"
              }
            ]
          })
        }}
      />

      <XmlSitemapGeneratorClient />
      <RelatedTools currentTool="xml-sitemap-generator" />
    </>
  )
}