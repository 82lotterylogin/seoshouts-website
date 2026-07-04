import { Metadata } from 'next'
import AICopywriterClient from './AICopywriterClient'

export const metadata: Metadata = {
  title: 'Free AI Copywriting Tool — Ads, Web Copy & More | SEOShouts',
  description: 'Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool with multiple variations and optimization tips.',
  keywords: 'AI copywriter, copywriting tool, ad copy generator, product description generator, email marketing copy, sales copy',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/ai-copywriter/',
  },
  openGraph: {
    title: 'Free AI Copywriting Tool — Ads, Web Copy & More | SEOShouts',
    description: 'Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool with multiple variations and optimization tips.',
    url: 'https://seoshouts.com/tools/ai-copywriter/',
    siteName: 'SEOShouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Copywriting Tool — Ads, Web Copy & More | SEOShouts',
    description: 'Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool.',
  },
}

export default function AICopywriter() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Copywriter",
            "description": "Generate high-converting copy for ads, product descriptions, emails, and more. Professional AI copywriting tool with multiple variations and optimization tips.",
            "url": "https://seoshouts.com/tools/ai-copywriter/",
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
                "item": "https://seoshouts.com/tools/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "AI Copywriter",
                "item": "https://seoshouts.com/tools/ai-copywriter/"
              }
            ]
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is the AI copywriter tool free?","acceptedAnswer":{"@type":"Answer","text":"Yes, you can generate up to 5 copy variations per day for free. No signup required to start using the tool."}},{"@type":"Question","name":"What copy types can I generate?","acceptedAnswer":{"@type":"Answer","text":"You can create ads, product descriptions, emails, social media posts, blog intros, landing pages, sales copy, and PPC ads."}},{"@type":"Question","name":"How accurate is the AI-generated copy?","acceptedAnswer":{"@type":"Answer","text":"Our AI uses proven copywriting frameworks and is trained on high-converting copy examples. Always review and customize for your brand voice."}},{"@type":"Question","name":"Can I specify keywords to include?","acceptedAnswer":{"@type":"Answer","text":"Yes, you can add important keywords that the AI will naturally incorporate into your copy for better SEO and relevance."}},{"@type":"Question","name":"What tones and styles are available?","acceptedAnswer":{"@type":"Answer","text":"Choose from professional, friendly, persuasive, urgent, casual, authoritative, emotional, or informative tones to match your brand."}},{"@type":"Question","name":"Can I use the generated copy commercially?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. All generated copy is yours to use for any commercial purpose including ads, websites, emails, and marketing materials."}}]}) }} />

      <AICopywriterClient />
    </>
  )
}