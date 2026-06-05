import { Metadata } from 'next'
import OnPageSEOAnalyzerClient from './OnPageSEOAnalyzerClient'

export const metadata: Metadata = {
  title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
  description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
  keywords: 'on-page SEO analyzer, website SEO audit, SEO analysis tool, Core Web Vitals, technical SEO, content optimization, SEO checker, website analysis',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/on-page-seo-analyzer/',
  },
  openGraph: {
    title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
    description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
    url: 'https://seoshouts.com/tools/on-page-seo-analyzer/',
    siteName: 'SEO Shouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
    description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
  },
}

export default function OnPageSEOAnalyzer() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "On-Page SEO Analyzer",
            "description": "Free on-page SEO analyzer with 100+ ranking factors. Analyze title tags, meta descriptions, headings, Core Web Vitals, and technical SEO using Google PageSpeed API. No account needed.",
            "url": "https://seoshouts.com/tools/on-page-seo-analyzer/",
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
                "name": "On-Page SEO Analyzer",
                "item": "https://seoshouts.com/tools/on-page-seo-analyzer"
              }
            ]
          })
        }}
      />

      {/* HowTo Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Analyze Your Website's On-Page SEO",
        "description": "Use the free SEOShouts On-Page SEO Analyzer to audit 150+ ranking factors including title tags, meta descriptions, headings, Core Web Vitals, and technical SEO in seconds.",
        "tool": { "@type": "HowToTool", "name": "SEOShouts On-Page SEO Analyzer", "url": "https://seoshouts.com/tools/on-page-seo-analyzer/" },
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Enter Your Page URL", "text": "Type the full URL of the page you want to analyze into the input field. The tool supports any publicly accessible webpage." },
          { "@type": "HowToStep", "position": 2, "name": "Add a Target Keyword (Optional)", "text": "Enter your primary target keyword to unlock keyword-specific analysis including density checking, placement audit, and LSI keyword suggestions." },
          { "@type": "HowToStep", "position": 3, "name": "Run the Analysis", "text": "Click Analyze to start the audit. The tool fetches your page, runs 150+ SEO checks, and retrieves Core Web Vitals data from Google PageSpeed API." },
          { "@type": "HowToStep", "position": 4, "name": "Review & Fix Issues", "text": "Review your score breakdown across categories: title tags, meta descriptions, headings, content, images, links, and performance. Fix critical issues first for the biggest ranking impact." }
        ]
      })}} />

      {/* Speakable Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".tool-hero-sub"] },
        "url": "https://seoshouts.com/tools/on-page-seo-analyzer/"
      })}} />

      <OnPageSEOAnalyzerClient />
    </>
  )
}