import type { Metadata } from 'next'
import LocalSeoPageContent from './LocalSeoPageContent'

export const metadata: Metadata = {
  title: 'Local SEO Services India - Dominate Your Local Market | SEO Shouts',
  description: 'Professional Local SEO services for Indian businesses. Get found by local customers, dominate Google My Business, and increase foot traffic. 90-day performance guarantee.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/local-seo/',
  },
  openGraph: {
    title: 'Local SEO Services India - Dominate Your Local Market | SEO Shouts',
    description: 'Professional Local SEO services for Indian businesses. Google My Business optimization, local citations, review management, and multi-language SEO.',
    url: 'https://seoshouts.com/services/local-seo/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/local-seo-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Local SEO Services India by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local SEO Services India - Dominate Your Local Market | SEO Shouts',
    description: 'Professional Local SEO services for Indian businesses. 90-day performance guarantee.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/local-seo-twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function LocalSEOServicePage() {
  return (
    <>
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
                "item": "https://seoshouts.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://seoshouts.com/services/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Local SEO",
                "item": "https://seoshouts.com/services/local-seo/"
              }
            ]
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Local SEO Services India",
            "description": "Professional Local SEO services for Indian businesses including Google My Business optimization, local citations, review management, and multi-language SEO.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "serviceType": "Local SEO Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Local SEO Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Google Business Profile Optimization"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Local Citation Building"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Review Management"
                  }
                }
              ]
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How long does it take to see Local SEO results in India?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most clients see initial improvements in local rankings within 4-6 weeks, with significant traffic and lead increases typically occurring within 3-4 months. Indian local markets often have less competition than global markets, allowing for faster results."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with businesses in competitive Indian cities like Mumbai, Delhi, or Bangalore?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we specialize in helping businesses compete in India's most competitive local markets. Our strategies include hyper-local content creation, niche service targeting, and comprehensive reputation management tailored for metro markets."
                }
              },
              {
                "@type": "Question",
                "name": "Do you optimize for both Hindi and English searches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we create comprehensive multi-language strategies that capture both Hindi and English local search traffic, ensuring maximum visibility across India's diverse linguistic markets."
                }
              }
            ]
          })
        }}
      />

      <LocalSeoPageContent />
    </>
  )
}
