import type { Metadata } from 'next'
import EcommerceSeoPageContent from './EcommerceSeoPageContent'

export const metadata: Metadata = {
  title: 'eCommerce SEO Services India - Skyrocket Your Online Store Growth | SEO Shouts',
  description: 'Professional eCommerce SEO services for Indian online stores. Product optimization, technical SEO, content marketing, and conversion optimization. 90-day performance guarantee.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/ecommerce-seo/',
  },
  openGraph: {
    title: 'eCommerce SEO Services India - Skyrocket Your Online Store Growth | SEO Shouts',
    description: 'Professional eCommerce SEO services for Indian online stores. Technical SEO, product optimization, content marketing, and link building for Shopify, WooCommerce, Magento.',
    url: 'https://seoshouts.com/services/ecommerce-seo/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/ecommerce-seo-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'eCommerce SEO Services India by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eCommerce SEO Services India - Skyrocket Your Online Store Growth | SEO Shouts',
    description: 'Professional eCommerce SEO services for Indian online stores. 90-day performance guarantee.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/ecommerce-seo-twitter-image.jpg'],
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

export default function EcommerceSEOServicePage() {
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
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seoshouts.com/" },
              { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://seoshouts.com/services/" },
              { "@type": "ListItem", "position": 3, "name": "eCommerce SEO", "item": "https://seoshouts.com/services/ecommerce-seo/" }
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
            "name": "eCommerce SEO Services India",
            "description": "Professional eCommerce SEO services for Indian online stores including technical SEO, product optimization, content marketing, link building, and conversion optimization.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "serviceType": "eCommerce SEO Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "eCommerce SEO Services",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Technical eCommerce SEO" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Product Page Optimization" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "eCommerce Content Marketing" } }
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
                "name": "How long does it take to see eCommerce SEO results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most clients see initial improvements in product rankings within 6-8 weeks, with significant traffic and sales increases typically occurring within 3-6 months. eCommerce sites often see faster results due to high commercial intent keywords."
                }
              },
              {
                "@type": "Question",
                "name": "Which eCommerce platforms do you specialize in?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We have extensive experience with Shopify, WooCommerce, Magento, OpenCart, and custom-built eCommerce solutions. Our technical SEO strategies are platform-agnostic but optimized for each system's unique features."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with small stores or only large eCommerce businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We work with businesses of all sizes - from startup stores with 100 products to established retailers with 50,000+ SKUs. Our strategies are customized based on your inventory size, budget, and growth goals."
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
        "url": "https://seoshouts.com/services/ecommerce-seo/"
      })}} />

      <EcommerceSeoPageContent />
    </>
  )
}
