import { Metadata } from 'next'
import InternalLinkCheckerClient from './InternalLinkCheckerClient'

export const metadata: Metadata = {
  title: 'Free Internal Link Checker - No Login - Upto 500 Pages Anchor Cloud | SEO Shouts',
  description: 'Free internal link checker with anchor cloud visualization. Analyze up to 500 pages without login. Check anchor text distribution, internal link patterns, and optimize your SEO strategy instantly.',
  keywords: 'internal link checker, anchor text analyzer, internal link analysis, internal linking tool, SEO analysis, anchor text distribution, internal link audit, link checker, anchor cloud, free SEO tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/internal-link-checker/',
  },
  openGraph: {
    title: 'Free Internal Link Checker - No Login - Upto 500 Pages Anchor Cloud | SEO Shouts',
    description: 'Free internal link checker with anchor cloud visualization. Analyze up to 500 pages without login. Check anchor text distribution and optimize your internal linking strategy.',
    url: 'https://seoshouts.com/tools/internal-link-checker/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/internal-link-checker-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Internal Link Checker - Anchor Cloud Visualization - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Internal Link Checker - No Login - Upto 500 Pages Anchor Cloud | SEO Shouts',
    description: 'Free internal link checker with anchor cloud visualization. Analyze up to 500 pages without login and optimize your SEO strategy instantly.',
    images: ['https://seoshouts.com/images/internal-link-checker-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function InternalLinkCheckerPage() {
  return (
    <>
      {/* Tool Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Internal Link Checker",
            "description": "Free internal link checker with anchor cloud visualization. Analyze up to 500 pages without login. Check anchor text distribution, internal link patterns, and optimize your SEO strategy instantly.",
            "url": "https://seoshouts.com/tools/internal-link-checker",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "datePublished": "2025-01-27",
            "dateModified": "2025-01-27",
            "featureList": [
              "Internal link analysis up to 500 pages",
              "Anchor text distribution visualization",
              "Interactive word cloud",
              "Detailed data tables",
              "Export functionality",
              "No login required"
            ]
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
                "name": "Internal Link Checker",
                "item": "https://seoshouts.com/tools/internal-link-checker"
              }
            ]
          })
        }}
      />

      <InternalLinkCheckerClient />
    </>
  )
}