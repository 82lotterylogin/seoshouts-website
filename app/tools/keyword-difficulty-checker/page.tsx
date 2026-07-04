import { Metadata } from 'next'
import KeywordDifficultyCheckerClient from './KeywordDifficultyCheckerClient'

export const metadata: Metadata = {
  title: 'Free Keyword Difficulty Checker — Bulk & By Location | SEOShouts',
  description: 'Check keyword difficulty free: score entire keyword lists in bulk with 1-100 difficulty scores for any country, then export to CSV. No signup required.',
  keywords: 'keyword difficulty checker, keyword difficulty tool, check keyword difficulty, keyword difficulty score, bulk keyword difficulty checker, SEO difficulty tool, free keyword difficulty checker',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/keyword-difficulty-checker/',
  },
  openGraph: {
    title: 'Free Keyword Difficulty Checker — Bulk & By Location | SEOShouts',
    description: 'Check keyword difficulty free: score entire keyword lists in bulk with 1-100 difficulty scores for any country, then export to CSV. No signup required.',
    url: 'https://seoshouts.com/tools/keyword-difficulty-checker/',
    siteName: 'SEOShouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/keyword-difficulty-checker-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Keyword Difficulty Checker Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Keyword Difficulty Checker — Bulk & By Location | SEOShouts',
    description: 'Bulk keyword difficulty scores for any country. 1-100 scale, CSV export, free with no signup.',
    images: ['https://seoshouts.com/images/keyword-difficulty-checker-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function KeywordDifficultyChecker() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SEOShouts Keyword Difficulty Checker",
            "description": "Free keyword difficulty checker that scores keywords from 1-100 in bulk, with location-specific difficulty for any country and CSV export. No signup required.",
            "url": "https://seoshouts.com/tools/keyword-difficulty-checker/",
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
              "Bulk Keyword Difficulty Analysis",
              "Location-Specific Difficulty Scores",
              "1-100 Difficulty Scale with Color Grading",
              "CSV Export",
              "Instant Results",
              "No Login Required"
            ],
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-07-04"
          })
        }}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a keyword difficulty score?",
                "acceptedAnswer": { "@type": "Answer", "text": "A keyword difficulty score is a number from 1 to 100 that estimates how hard it is to rank on the first page of Google for a specific search term. It is calculated from the strength of the pages that currently rank: their domain authority, backlink profiles, and content quality. A score under 30 means low competition, 31 to 50 is achievable with solid content, 51 to 70 requires strong authority, and 71+ demands significant resources and time." }
              },
              {
                "@type": "Question",
                "name": "How do I check keyword difficulty for free?",
                "acceptedAnswer": { "@type": "Answer", "text": "Paste your keywords into the checker, choose your target country, and click Check Difficulty. You get instant difficulty scores for every keyword with no signup, no credit card, and no trial limits. Each session allows 8 analyses, and every analysis can score multiple keywords at once." }
              },
              {
                "@type": "Question",
                "name": "Can I check keyword difficulty in bulk?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. This is a bulk keyword difficulty checker: enter your whole keyword list separated by commas or new lines and every term is scored in a single run. You can then export all scores to CSV to sort and prioritize your keyword strategy in a spreadsheet." }
              },
              {
                "@type": "Question",
                "name": "Does keyword difficulty change by location?",
                "acceptedAnswer": { "@type": "Answer", "text": "Significantly. Competition for the same keyword differs between countries because different sites rank in each market. A keyword with difficulty 65 in the United States might score 35 in India or 40 in Australia. That is why this tool includes a location selector, so you measure difficulty in the market you actually target rather than a global average." }
              },
              {
                "@type": "Question",
                "name": "How is this different from Moz or Semrush difficulty scores?",
                "acceptedAnswer": { "@type": "Answer", "text": "Every tool calculates difficulty differently, so scores are not interchangeable. Moz leans heavily on its Domain Authority metric, Semrush factors in its own backlink index, and Ahrefs counts referring domains of ranking pages. Our checker analyzes the competitive strength of the current top-ranking results for your chosen location. The absolute numbers matter less than the relative comparison: use one tool consistently and compare keywords against each other." }
              },
              {
                "@type": "Question",
                "name": "What is a good keyword difficulty for a new website?",
                "acceptedAnswer": { "@type": "Answer", "text": "New websites should target keywords with difficulty scores under 30. Sites with little authority and few backlinks rarely crack page one for competitive terms, no matter how good the content is. Build traffic with low-difficulty, long tail keywords first, then use that authority to attack medium-difficulty terms after 6 to 12 months." }
              },
              {
                "@type": "Question",
                "name": "Should I ignore high difficulty keywords completely?",
                "acceptedAnswer": { "@type": "Answer", "text": "No, but treat them as long-term goals rather than quick wins. High-difficulty keywords usually have the most volume and commercial value. The smart play is a pillar page strategy: rank for dozens of related low-difficulty long tail terms first, interlink them into a cluster, and let that combined authority push your pillar page up for the hard head term." }
              },
              {
                "@type": "Question",
                "name": "Is this keyword difficulty checker really free?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free. No account, no credit card, no premium tier hiding the real features. You get bulk analysis, location-specific scoring, and CSV export at no cost. The session limit of 8 analyses exists only to keep the tool fast for everyone, and it resets when you refresh the page." }
              }
            ]
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
            "name": "How to Check Keyword Difficulty in 4 Steps",
            "description": "Step-by-step guide to checking keyword difficulty in bulk with location-specific scores using the SEOShouts Keyword Difficulty Checker.",
            "totalTime": "PT2M",
            "tool": { "@type": "HowToTool", "name": "SEOShouts Keyword Difficulty Checker" },
            "step": [
              { "@type": "HowToStep", "position": 1, "name": "Enter your keywords", "text": "Paste keywords one per line or separated by commas. The tool checks keyword difficulty in bulk, so you can score an entire keyword list in one run instead of checking terms one at a time." },
              { "@type": "HowToStep", "position": 2, "name": "Choose your target location", "text": "Keyword difficulty varies by country: a term that is brutally competitive in the US can be wide open in India or Australia. Pick the market you actually sell in for location-specific scores." },
              { "@type": "HowToStep", "position": 3, "name": "Click Check Difficulty", "text": "Each keyword gets a difficulty score from 1 to 100. Green scores under 30 are realistic targets for newer sites, yellow and orange need solid content plus links, and red 71+ demands serious authority." },
              { "@type": "HowToStep", "position": 4, "name": "Export and prioritize", "text": "Download your scored list as CSV, then sort by difficulty. Target the low-difficulty keywords with decent volume first: those are the battles you can win this quarter." }
            ]
          })
        }}
      />

      {/* Speakable Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".tool-hero-sub"] },
        "url": "https://seoshouts.com/tools/keyword-difficulty-checker/"
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
                "name": "Keyword Difficulty Checker",
                "item": "https://seoshouts.com/tools/keyword-difficulty-checker"
              }
            ]
          })
        }}
      />

      <KeywordDifficultyCheckerClient />
    </>
  )
}