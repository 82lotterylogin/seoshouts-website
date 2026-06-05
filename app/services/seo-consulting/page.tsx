import type { Metadata } from 'next'
import SeoConsultingPageContent from './SeoConsultingPageContent'

export const metadata: Metadata = {
  title: 'SEO Consulting Services - Strategic SEO Leadership & Expert Guidance | SEO Shouts',
  description: 'Professional SEO consulting services by SEOShouts. Strategic SEO planning, team training, technical consulting, and performance optimization. Transform your digital presence with expert guidance.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-consulting/',
  },
  openGraph: {
    title: 'SEO Consulting Services - Strategic SEO Leadership & Expert Guidance | SEO Shouts',
    description: 'Professional SEO consulting services including strategic planning, team training, technical consulting, and performance optimization for businesses across India.',
    url: 'https://seoshouts.com/services/seo-consulting/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-consulting-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Consulting Services by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Consulting Services - Strategic SEO Leadership & Expert Guidance | SEO Shouts',
    description: 'Professional SEO consulting services by SEOShouts. Strategic planning, team training, and performance optimization.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/seo-consulting-twitter-image.jpg'],
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

export default function SEOConsultingServicePage() {
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
                "name": "SEO Consulting",
                "item": "https://seoshouts.com/services/seo-consulting/"
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
            "name": "SEO Consulting Services",
            "description": "Strategic SEO consulting services including SEO strategy development, team training, technical consulting, and performance optimization for businesses across India.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "serviceType": "SEO Consulting Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Consulting Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Strategic SEO Assessment and Planning"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Team Development and Training"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Technical SEO Strategy Consulting"
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
                "name": "What distinguishes your SEO consulting from traditional SEO services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our consulting focuses on strategic guidance, capability building, and long-term value creation rather than task execution. We develop internal expertise while providing strategic direction, ensuring sustainable success and reduced dependency on external resources."
                }
              },
              {
                "@type": "Question",
                "name": "How do you customize consulting services for different business sizes and industries?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We conduct comprehensive assessments of business goals, current capabilities, competitive landscape, and available resources to develop customized strategies and consulting approaches that align with specific requirements and market conditions."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer both project-based and ongoing consulting arrangements?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we provide both project-based consulting for specific challenges and strategic initiatives, as well as ongoing strategic support through monthly or quarterly consulting arrangements based on client needs and objectives."
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
        "url": "https://seoshouts.com/services/seo-consulting/"
      })}} />

      <SeoConsultingPageContent />
    </>
  )
}
