import { Metadata } from 'next'
import KeywordDensityAnalyzerClient from './KeywordDensityAnalyzerClient'

export const metadata: Metadata = {
  title: 'Free Keyword Density Analyzer — Word & Phrase Analysis | SEOShouts',
  description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.',
  keywords: 'keyword density analyzer, keyword density checker, SEO content analysis, keyword optimization, content SEO tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/keyword-density-analyzer/',
  },
  openGraph: {
    title: 'Free Keyword Density Analyzer — Word & Phrase Analysis | SEOShouts',
    description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.',
    url: 'https://seoshouts.com/tools/keyword-density-analyzer/',
    siteName: 'SEOShouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/keyword-density-analyzer-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Keyword Density Analyzer Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Keyword Density Analyzer — Word & Phrase Analysis | SEOShouts',
    description: 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations.',
    images: ['https://seoshouts.com/images/keyword-density-analyzer-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function KeywordDensityAnalyzer() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Keyword Density Analyzer",
            "description": "Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.",
            "url": "https://seoshouts.com/tools/keyword-density-analyzer/",
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
                "name": "Keyword Density Analyzer",
                "item": "https://seoshouts.com/tools/keyword-density-analyzer"
              }
            ]
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What's the ideal keyword density percentage?","acceptedAnswer":{"@type":"Answer","text":"There's no universal perfect percentage, but 1–3% for primary keywords is generally recommended. Focus more on natural usage and user value than hitting exact percentages. Some competitive topics may require different densities depending on what's already ranking."}},{"@type":"Question","name":"Can high keyword density hurt my rankings?","acceptedAnswer":{"@type":"Answer","text":"Yes, keyword stuffing (excessive keyword repetition) can result in penalties from Google's algorithms. Our tool helps you identify when density is too high so you can adjust before publishing or making your content live."}},{"@type":"Question","name":"Should I analyze just my main content or include navigation?","acceptedAnswer":{"@type":"Answer","text":"For best results, analyze just your main content (body text) rather than including navigation, footers, or sidebar elements which can dilute or significantly skew your density readings."}},{"@type":"Question","name":"How often should I check keyword density?","acceptedAnswer":{"@type":"Answer","text":"Check density during content creation and before publishing. Also analyze when updating existing content or if you notice ranking changes that might indicate over- or under-optimization issues."}},{"@type":"Question","name":"Does the tool work for non-English content?","acceptedAnswer":{"@type":"Answer","text":"Yes, our analyzer works with content in multiple languages, though optimal density ranges may vary by language and the stop word filtering may be less comprehensive for non-English content."}},{"@type":"Question","name":"Can I analyze competitor content?","acceptedAnswer":{"@type":"Answer","text":"Yes, you can analyze any publicly accessible webpage using the URL analysis feature, including competitor pages. This helps you benchmark your density against pages that are already ranking well for your target keyword."}}]}) }} />

      <KeywordDensityAnalyzerClient />
    </>
  )
}