import { Metadata } from 'next'
import LongTailKeywordGeneratorClient from './LongTailKeywordGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
  description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
  keywords: 'long tail keywords, keyword research, SEO keywords, keyword generator, low competition keywords, keyword tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/long-tail-keyword-generator/',
  },
  openGraph: {
    title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
    description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions. Find less competitive, high-conversion keywords instantly.',
    url: 'https://seoshouts.com/tools/long-tail-keyword-generator/',
    siteName: 'SEOShouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/long-tail-keyword-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Long Tail Keyword Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
    description: 'Generate long tail keywords for better SEO rankings. Free keyword research tool with thousands of keyword suggestions.',
    images: ['https://seoshouts.com/images/long-tail-keyword-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function LongTailKeywordGenerator() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SEOShouts Long Tail Keyword Generator",
            "description": "Free long tail keyword generator that expands any seed keyword into hundreds of low-competition, high-intent keyword suggestions with country and language targeting.",
            "url": "https://seoshouts.com/tools/long-tail-keyword-generator/",
            "applicationCategory": "BrowserApplication",
            "applicationSubCategory": "SEO Tool",
            "operatingSystem": "Any (Web Browser)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Rohit Sharma",
              "url": "https://seoshouts.com/meet-the-experts/",
              "jobTitle": "SEO Consultant & Founder",
              "worksFor": {
                "@type": "Organization",
                "name": "SEOShouts",
                "url": "https://seoshouts.com"
              }
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEOShouts",
              "url": "https://seoshouts.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://seoshouts.com/logo.png"
              }
            },
            "featureList": [
              "Hundreds of Long Tail Keyword Suggestions per Seed",
              "Country-Specific Keyword Targeting",
              "Multi-Language Support",
              "Search Volume Data",
              "Keyword List Export",
              "No Login Required"
            ],
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-07-04"
          })
        }}
      />

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Use the Long Tail Keyword Generator",
            "description": "Step-by-step guide to generating hundreds of long tail keyword ideas from a single seed keyword using the SEOShouts Long Tail Keyword Generator.",
            "totalTime": "PT2M",
            "tool": { "@type": "HowToTool", "name": "SEOShouts Long Tail Keyword Generator" },
            "step": [
              { "@type": "HowToStep", "position": 1, "name": "Enter Your Main Keyword", "text": "Start with a broad term related to your business. For example: coffee maker, digital marketing, or yoga classes." },
              { "@type": "HowToStep", "position": 2, "name": "Choose Your Target Location", "text": "Select the country or region where your customers are located. This affects which keywords and search volumes you will see." },
              { "@type": "HowToStep", "position": 3, "name": "Pick Your Language", "text": "Choose the language your customers search in. The tool supports dozens of languages for global and local campaigns." },
              { "@type": "HowToStep", "position": 4, "name": "Generate Keywords", "text": "Complete the human verification, click the generate button, and watch hundreds of long tail keyword suggestions appear." },
              { "@type": "HowToStep", "position": 5, "name": "Analyze and Export", "text": "Review the suggestions, check search volumes, and export your chosen keywords for use in your campaigns." }
            ]
          })
        }}
      />

      {/* Speakable Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".tool-hero-sub"] },
        "url": "https://seoshouts.com/tools/long-tail-keyword-generator/"
      })}} />

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
                "name": "Long Tail Keyword Generator",
                "item": "https://seoshouts.com/tools/long-tail-keyword-generator"
              }
            ]
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How many keywords can I generate?","acceptedAnswer":{"@type":"Answer","text":"There's no limit. Generate as many keyword lists as you need for your campaigns."}},{"@type":"Question","name":"Do you provide search volume data?","acceptedAnswer":{"@type":"Answer","text":"Yes, we include estimated monthly search volumes to help you prioritize keywords."}},{"@type":"Question","name":"Can I use this for PPC campaigns?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. Long tail keywords often have lower costs per click and higher conversion rates for paid ads."}},{"@type":"Question","name":"How often is the keyword data updated?","acceptedAnswer":{"@type":"Answer","text":"Our database is updated regularly to reflect current search trends and patterns."}},{"@type":"Question","name":"Is the tool free to use?","acceptedAnswer":{"@type":"Answer","text":"Yes, completely free with no hidden fees or usage limits."}},{"@type":"Question","name":"Can I save my keyword lists?","acceptedAnswer":{"@type":"Answer","text":"You can export keywords to CSV files or copy them for use in your preferred tools."}}]}) }} />

      <LongTailKeywordGeneratorClient />
    </>
  )
}