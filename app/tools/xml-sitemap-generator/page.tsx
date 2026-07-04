import { Metadata } from 'next'
import XmlSitemapGeneratorClient from './XmlSitemapGeneratorClient'

export const metadata: Metadata = {
  title: 'Free XML Sitemap Generator — sitemap.xml in Seconds | SEOShouts',
  description: 'Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs with custom priority and frequency settings.',
  keywords: 'XML sitemap generator, sitemap creator, SEO sitemap, website sitemap, search engine optimization',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/xml-sitemap-generator/',
  },
  openGraph: {
    title: 'Free XML Sitemap Generator — sitemap.xml in Seconds | SEOShouts',
    description: 'Generate XML sitemaps instantly for better search engine indexing. Free sitemap generator supports up to 500 URLs with custom priority and frequency settings.',
    url: 'https://seoshouts.com/tools/xml-sitemap-generator/',
    siteName: 'SEOShouts',
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
    title: 'Free XML Sitemap Generator — sitemap.xml in Seconds | SEOShouts',
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

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
        {"@type":"Question","name":"What is an XML sitemap?","acceptedAnswer":{"@type":"Answer","text":"An XML sitemap is a file listing every URL on your website that you want search engines to crawl and index, along with optional metadata like last-modified dates and priority. Search engines read it to discover pages they might otherwise miss, especially new pages, deep pages, and pages with few internal links."}},
        {"@type":"Question","name":"Is this XML sitemap generator free?","acceptedAnswer":{"@type":"Answer","text":"Yes, completely free with no signup, no page-limit paywall, and no watermarks. Enter your site URL, let the crawler collect your pages, and download a standards-compliant sitemap.xml ready to upload."}},
        {"@type":"Question","name":"Do I need a sitemap if my site is small?","acceptedAnswer":{"@type":"Answer","text":"Google can usually find every page on a well-linked small site without one, but a sitemap still helps: it speeds up discovery of new content and gives you Search Console indexing reports per URL. Since generating one takes under a minute, there is no reason to skip it."}},
        {"@type":"Question","name":"Where do I upload the sitemap file?","acceptedAnswer":{"@type":"Answer","text":"Place sitemap.xml in your website root so it loads at yoursite.com/sitemap.xml. Then reference it in your robots.txt file (Sitemap: https://yoursite.com/sitemap.xml) and submit it in Google Search Console under Indexing > Sitemaps."}},
        {"@type":"Question","name":"How often should I update my sitemap?","acceptedAnswer":{"@type":"Answer","text":"Whenever you add, remove, or significantly change pages. For frequently updated sites, regenerate monthly or use a CMS plugin that maintains the sitemap automatically. A stale sitemap with deleted URLs wastes crawl budget and produces Search Console errors."}},
        {"@type":"Question","name":"How many URLs can one sitemap contain?","acceptedAnswer":{"@type":"Answer","text":"The protocol limit is 50,000 URLs or 50MB uncompressed per file. Larger sites split URLs across multiple sitemaps tied together by a sitemap index file. This generator handles standard sites well within the single-file limit."}}
      ]}) }} />

      <XmlSitemapGeneratorClient />
    </>
  )
}