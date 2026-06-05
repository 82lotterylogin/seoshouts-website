import type { Metadata } from 'next'
import TechnicalSeoAuditPageContent from './TechnicalSeoAuditPageContent'

export const metadata: Metadata = {
  title: 'Technical SEO Audit Services - Uncover Hidden Issues Killing Your Rankings | SEO Shouts',
  description: 'Professional Technical SEO Audit services by SEOShouts. Site speed optimization, mobile SEO, Core Web Vitals, schema markup, and security audits. Get your custom quote today.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/technical-seo-audit/',
  },
  openGraph: {
    title: 'Technical SEO Audit Services - Uncover Hidden Issues Killing Your Rankings | SEO Shouts',
    description: 'Professional Technical SEO Audit services including site speed optimization, mobile SEO, Core Web Vitals, schema markup, and security audits for Indian websites.',
    url: 'https://seoshouts.com/services/technical-seo-audit/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/technical-seo-audit-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Technical SEO Audit Services by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical SEO Audit Services - Uncover Hidden Issues Killing Your Rankings | SEO Shouts',
    description: 'Professional Technical SEO Audit services by SEOShouts. Site speed, mobile optimization, Core Web Vitals, and security audits.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/technical-seo-audit-twitter-image.jpg'],
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

export default function TechnicalSEOAuditServicePage() {
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
                "name": "Technical SEO Audit",
                "item": "https://seoshouts.com/services/technical-seo-audit/"
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
            "name": "Technical SEO Audit Services",
            "description": "Comprehensive Technical SEO Audit services including site speed optimization, mobile SEO, Core Web Vitals analysis, schema markup implementation, and security audits.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "serviceType": "Technical SEO Audit Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Technical SEO Audit Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Site Speed Optimization"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile SEO Audit"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Core Web Vitals Analysis"
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
                "name": "How long does this actually take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most comprehensive audits are completed within 3-4 weeks. Rush jobs are available for an additional fee, but honestly, a thorough audit takes time to do right."
                }
              },
              {
                "@type": "Question",
                "name": "Will this help my Core Web Vitals scores?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. Core Web Vitals optimization is a major focus of every audit. We often help sites improve their scores dramatically."
                }
              },
              {
                "@type": "Question",
                "name": "Can you actually implement the fixes, or just identify them?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We can do both. While our audit gives you everything needed for implementation, we also offer hands-on technical services if your team needs help."
                }
              }
            ]
          })
        }}
      />

      {/* Speakable Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".s-sub"] },
        "url": "https://seoshouts.com/services/technical-seo-audit/"
      })}} />

      <TechnicalSeoAuditPageContent />
    </>
  )
}

