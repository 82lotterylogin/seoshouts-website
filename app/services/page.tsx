import type { Metadata } from 'next'
import ServicesPageContent from './ServicesPageContent'

export const metadata: Metadata = {
  title: 'SEO Services - Professional SEO Solutions for Indian Businesses | SEO Shouts',
  description: 'Comprehensive SEO services including Local SEO, eCommerce SEO, Technical SEO Audits, Link Building, SEO Website Development and Consulting. Get results that matter.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services',
  },
  openGraph: {
    title: 'SEO Services - Professional SEO Solutions for Indian Businesses | SEO Shouts',
    description: 'Comprehensive SEO services including Local SEO, eCommerce SEO, Technical SEO Audits, Link Building, and more. Results-driven SEO for Indian businesses.',
    url: 'https://seoshouts.com/services',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/services-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Services - Professional SEO Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Services - Professional SEO Solutions | SEO Shouts',
    description: 'Comprehensive SEO services for Indian businesses. Local SEO, eCommerce SEO, Technical Audits, and more.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/services-twitter-image.jpg'],
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

const services = [
  { title: 'Local SEO', description: 'Get found by customers in your area when they search for your services.' },
  { title: 'eCommerce SEO', description: 'Optimise your online store to rank higher for product searches.' },
  { title: 'SEO Website Development', description: 'Get a website designed from the ground up with SEO best practices.' },
  { title: 'Technical SEO Audit', description: 'Comprehensive technical analysis to identify and fix ranking issues.' },
  { title: 'Link Building', description: 'Earn authoritative backlinks through ethical white-hat strategies.' },
  { title: 'SEO Consulting', description: 'Expert SEO advice, strategy development, and team training.' },
]

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SEO Shouts',
            url: 'https://seoshouts.com',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'SEO Services',
              itemListElement: services.map(service => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service.title,
                  description: service.description,
                },
              })),
            },
          }),
        }}
      />
      <ServicesPageContent />
    </>
  )
}
