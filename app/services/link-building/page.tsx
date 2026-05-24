import type { Metadata } from 'next'
import LinkBuildingPageContent from './LinkBuildingPageContent'

export const metadata: Metadata = {
  title: 'Link Building Services - Earn High-Quality Backlinks That Move Rankings | SEO Shouts',
  description: 'Professional link building services by SEOShouts. Earn high-quality, relevant backlinks through relationship building and strategic outreach. No spam, no penalties - just sustainable authority building.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/link-building/',
  },
  openGraph: {
    title: 'Link Building Services - Earn High-Quality Backlinks | SEO Shouts',
    description: 'Professional link building services that focus on earning high-quality, relevant backlinks through relationship building and strategic outreach.',
    url: 'https://seoshouts.com/services/link-building/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/link-building-service-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEOShouts Link Building Services - Quality Backlinks',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Building Services - Earn High-Quality Backlinks | SEO Shouts',
    description: 'Professional link building services focused on earning quality backlinks through relationship building.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/link-building-service-twitter.jpg'],
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

// Kept at module level — used by FAQ schema below
const faqs = [
  { question: 'How long does it take to see results from link building?', answer: 'Quality link building typically takes 3-6 months to show significant ranking improvements. We focus on sustainable growth, not quick fixes that backfire.' },
  { question: 'How many links do you build per month?', answer: "We don't set arbitrary numbers. Some months we might earn 5 high-quality links, other months it might be 15. Quality always trumps quantity." },
  { question: 'Do you guarantee specific links or publications?', answer: "We can't guarantee specific placements, but we do guarantee professional outreach and relationship building. The best publications can't be bought - they have to be earned." },
  { question: 'What if my industry is really competitive or boring?', answer: "Every industry has stories to tell and value to provide. We've built links for everything from accounting firms to wedding planners. It's about finding the right angle." },
  { question: 'Can you help if my site has been penalized for bad links?', answer: 'Yes, we include link cleanup and disavowal as part of our process when needed. Sometimes you need to clean up before you can build up.' },
  { question: 'Do you work with new websites or just established ones?', answer: 'We work with businesses at all stages. New sites need a different approach than established ones, but both can benefit from strategic link building.' },
  { question: 'How do you avoid Google penalties?', answer: "By following Google's guidelines, focusing on genuine value creation, and never trying to manipulate rankings through artificial means." },
]

export default function LinkBuildingPage() {
  return (
    <>
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Link Building Services",
            "description": "Professional link building services that earn high-quality, relevant backlinks through relationship building and strategic outreach",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "serviceType": "Link Building Services"
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
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <LinkBuildingPageContent />
    </>
  )
}
