import type { Metadata } from 'next'
import SeoChecklist from './SeoChecklist'
import PricingPackages from './PricingPackages'
import FaqSection from './FaqSection'
import CoreWebVitalsQuickCheck from './CoreWebVitalsQuickCheck'

export const metadata: Metadata = {
  title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
  description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in India. Professional SEO website development services for Indian businesses.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-website-development',
  },
  openGraph: {
    title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in India. Professional SEO website development services.',
    url: 'https://seoshouts.com/services/seo-website-development',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-website-development-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Website Development Services India by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in India.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/seo-website-development-twitter-image.jpg'],
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

export default function SEOWebsiteDevelopmentServicePage() {
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
                "item": "https://seoshouts.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://seoshouts.com/services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "SEO Website Development",
                "item": "https://seoshouts.com/services/seo-website-development"
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
            "name": "SEO Website Development Services India",
            "description": "Professional SEO website development services including mobile-first design, performance optimization, eCommerce development, and conversion-focused builds for Indian businesses.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "serviceType": "SEO Website Development Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Website Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO-Optimized Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "eCommerce Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile-First Responsive Design"
                  }
                }
              ]
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-10 sm:py-14 lg:py-18">
