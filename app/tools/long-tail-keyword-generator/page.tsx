import { Metadata } from 'next'
import LongTailKeywordGeneratorClient from './LongTailKeywordGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
  description: 'Mine 300-500 real long tail keywords from Google Autocomplete in seconds. Free keyword research tool with demand signals, intent labels & CSV export. No signup.',
  keywords: 'long tail keywords, keyword research, SEO keywords, keyword generator, low competition keywords, keyword tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/long-tail-keyword-generator/',
  },
  openGraph: {
    title: 'Free Long Tail Keyword Generator — Hundreds of Ideas | SEOShouts',
    description: 'Mine 300-500 real long tail keywords from Google Autocomplete in seconds. Free keyword research tool with demand signals, intent labels & CSV export. No signup.',
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
    description: 'Mine 300-500 real long tail keywords from Google Autocomplete in seconds. Free tool with demand signals & intent labels.',
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
            "description": "Free long tail keyword generator that mines 300-500 real search phrases per seed keyword directly from Google Autocomplete, with demand signals, intent labels, and country and language targeting.",
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
              "Real Google Autocomplete Mining (50+ Query Patterns)",
              "300-500 Real Search Phrases per Seed",
              "Country-Specific Keyword Targeting",
              "Multi-Language Support",
              "Demand Signals and Intent Labels",
              "Keyword List Export",
              "No Login Required"
            ],
            "softwareVersion": "3.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-07-05"
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
              { "@type": "HowToStep", "position": 2, "name": "Choose Your Target Location", "text": "Pick the country whose Google Autocomplete you want to mine, and optionally add a city for local variations. Location changes which real phrases appear." },
              { "@type": "HowToStep", "position": 3, "name": "Pick Your Language", "text": "Choose the language your customers search in. The tool mines autocomplete suggestions in that language for global and local campaigns." },
              { "@type": "HowToStep", "position": 4, "name": "Generate Keywords", "text": "Complete the human verification and click Generate. The tool probes Google Autocomplete with 50+ query patterns and returns 300-500 real search phrases." },
              { "@type": "HowToStep", "position": 5, "name": "Analyze and Export", "text": "Review the suggestions with their demand signals and intent labels, then export your chosen keywords as CSV for use in your campaigns." }
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
        {"@type":"Question","name":"What is a long tail keyword generator?","acceptedAnswer":{"@type":"Answer","text":"A long tail keyword generator is a tool that expands one broad seed keyword into hundreds of longer, more specific search phrases that real people type into Google. SEOShouts' version mines them live from Google Autocomplete using 50+ query patterns, then adds demand signals and intent labels so you can prioritize instantly."}},
        {"@type":"Question","name":"Is this long tail keyword tool really free?","acceptedAnswer":{"@type":"Answer","text":"Yes, completely free. No account, no credit card, no daily paywall on core features. Real Google Autocomplete mining, intent classification, and CSV export, the features most tools reserve for paid plans, are included for every user."}},
        {"@type":"Question","name":"How do I find long tail keywords for free?","acceptedAnswer":{"@type":"Answer","text":"Enter a seed keyword in the generator, pick your location and language, and generate. Combine the results with Google Autocomplete, People Also Ask boxes, and your own Search Console query data for complete coverage. All four methods are free."}},
        {"@type":"Question","name":"What is the difference between short tail and long tail keywords?","acceptedAnswer":{"@type":"Answer","text":"Short tail keywords are 1-2 word phrases with huge volume and brutal competition, like \"running shoes.\" Long tail keywords are 3+ word phrases with lower individual volume but clearer intent and far easier rankings, like \"waterproof trail running shoes for women.\" Long tail phrases collectively account for roughly 70% of all searches."}},
        {"@type":"Question","name":"Where do the keyword suggestions come from?","acceptedAnswer":{"@type":"Answer","text":"Directly from Google Autocomplete, the same suggestions Google shows searchers as they type. Every phrase is a real query, and the High/Medium/Low demand signal is derived from Google's own popularity ordering of those suggestions, not a fabricated volume number."}},
        {"@type":"Question","name":"Can I use this for PPC campaigns?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. Long tail keywords typically cost less per click and convert better in paid search. Export the buyer-intent suggestions to CSV and use them as tightly themed exact-match ad groups."}},
        {"@type":"Question","name":"How many keywords can I generate?","acceptedAnswer":{"@type":"Answer","text":"Each generation produces a full list of suggestions from your seed keyword, and you can run multiple generations per session. Use different seed keywords to build out complete topic maps."}},
        {"@type":"Question","name":"Can I save or export my keyword lists?","acceptedAnswer":{"@type":"Answer","text":"Yes. Export any generated list to a CSV file or copy all keywords to your clipboard with one click, ready for spreadsheets, content calendars, or campaign builders."}}
      ]}) }} />

      <LongTailKeywordGeneratorClient />
    </>
  )
}