import { Metadata } from 'next'
import SeoMetaWriterClient from './SeoMetaWriterClient'

export const metadata: Metadata = {
  title: 'Free AI Meta Title & Description Generator | SEOShouts',
  description: 'Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags. Free tool, no signup required.',
  keywords: 'SEO meta title generator, meta description generator, AI meta tags, SEO optimization, title tag generator, SERP optimization',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/seo-meta-writer/',
  },
  openGraph: {
    title: 'Free AI Meta Title & Description Generator | SEOShouts',
    description: 'Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags. Free tool, no signup required.',
    url: 'https://seoshouts.com/tools/seo-meta-writer/',
    siteName: 'SEOShouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/seo-meta-writer-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Meta Writer Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Meta Title & Description Generator | SEOShouts',
    description: 'Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags.',
    images: ['https://seoshouts.com/images/seo-meta-writer-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function SeoMetaWriter() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SEO Meta Writer",
            "description": "Generate SEO-optimized meta titles and descriptions with AI. Boost your click-through rates with compelling, keyword-rich meta tags. Free tool, no signup required.",
            "url": "https://seoshouts.com/tools/seo-meta-writer/",
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
                "name": "SEO Meta Writer",
                "item": "https://seoshouts.com/tools/seo-meta-writer"
              }
            ]
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Will AI-generated meta tags hurt my SEO?","acceptedAnswer":{"@type":"Answer","text":"Not if they're good quality and relevant to your content. Search engines care about user experience, and better meta tags improve click-through rates."}},{"@type":"Question","name":"Can Google tell if meta tags are AI-generated?","acceptedAnswer":{"@type":"Answer","text":"Google cares about quality and relevance, not who or what wrote them. As long as they accurately describe your content, you're fine."}},{"@type":"Question","name":"Should I edit the AI suggestions?","acceptedAnswer":{"@type":"Answer","text":"Usually just minor tweaks are needed. The AI handles the heavy lifting, but you might want to adjust for brand voice or specific details."}},{"@type":"Question","name":"How many options should I test?","acceptedAnswer":{"@type":"Answer","text":"Start with 3–5 variations and A/B test them if possible. Different audiences respond to different approaches."}},{"@type":"Question","name":"Can I use this for different languages?","acceptedAnswer":{"@type":"Answer","text":"Yes, our AI supports multiple languages and understands cultural nuances for different markets."}},{"@type":"Question","name":"Will this replace human copywriters?","acceptedAnswer":{"@type":"Answer","text":"No, but it makes them more efficient. Use AI for speed and volume, humans for strategy and final polish."}},{"@type":"Question","name":"Is this tool completely free?","acceptedAnswer":{"@type":"Answer","text":"Yes, completely free with no registration required. Generate as many meta tags as you need."}}]}) }} />

      <SeoMetaWriterClient />
    </>
  )
}