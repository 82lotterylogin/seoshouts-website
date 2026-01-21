import { Metadata } from 'next'
import RobotsTxtGeneratorClient from './RobotsTxtGeneratorClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free Robots.txt Generator Tool | SEO Shouts',
  description: 'Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.',
  keywords: 'robots.txt generator, robots txt file, search engine crawling, website security, SEO tools',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/robots-txt-generator/',
  },
  openGraph: {
    title: 'Free Robots.txt Generator Tool | SEO Shouts',
    description: 'Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.',
    url: 'https://seoshouts.com/tools/robots-txt-generator/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/robots-txt-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Robots.txt Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Robots.txt Generator Tool | SEO Shouts',
    description: 'Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.',
    images: ['https://seoshouts.com/images/robots-txt-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function RobotsTxtGenerator() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Robots.txt Generator",
            "description": "Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.",
            "url": "https://seoshouts.com/tools/robots-txt-generator/",
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
                "name": "Robots.txt Generator",
                "item": "https://seoshouts.com/tools/robots-txt-generator"
              }
            ]
          })
        }}
      />

      <RobotsTxtGeneratorClient />
      <RelatedTools currentTool="robots-txt-generator" />
    </>
  )
}