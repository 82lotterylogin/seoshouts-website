import { Metadata } from 'next'
import OnPageSEOAnalyzerClient from './OnPageSEOAnalyzerClient'

export const metadata: Metadata = {
  title: 'Free On-Page SEO Checker — Analyze 150+ Ranking Factors | SEOShouts',
  description: 'Run a free on-page SEO check on any URL. Audits 150+ factors — title tags, headings, content, and Core Web Vitals from Google PageSpeed — with step-by-step fixes. No signup.',
  keywords: 'on-page SEO checker, on-page SEO analyzer, website SEO audit, SEO analysis tool, Core Web Vitals, technical SEO, content optimization, free SEO checker',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/on-page-seo-analyzer/',
  },
  openGraph: {
    title: 'Free On-Page SEO Checker — Analyze 150+ Ranking Factors',
    description: 'Audit any page against 150+ SEO factors with real Google PageSpeed data and step-by-step fixes. Free, instant, no signup.',
    url: 'https://seoshouts.com/tools/on-page-seo-analyzer/',
    siteName: 'SEOShouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free On-Page SEO Checker — Analyze 150+ Ranking Factors',
    description: 'Audit any page against 150+ SEO factors with real Google PageSpeed data and step-by-step fixes. Free, instant, no signup.',
  },
  robots: {
    index: true,
    follow: true,
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
            "name": "SEOShouts On-Page SEO Checker & Analyzer",
            "description": "Free on-page SEO checker that audits 150+ ranking factors including title tags, meta descriptions, headings, content quality, and Core Web Vitals using the Google PageSpeed API. No account needed.",
            "url": "https://seoshouts.com/tools/on-page-seo-analyzer/",
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
              "150+ On-Page SEO Factor Checks",
              "Real Core Web Vitals via Google PageSpeed API",
              "Target Keyword Placement Analysis",
              "Title Tag & Meta Description Audit",
              "Heading Structure Analysis",
              "Image Alt Text & Link Audit",
              "Step-by-Step Fix Recommendations",
              "No Login Required"
            ],
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-07-02"
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is on-page SEO and why does it matter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "On-page SEO refers to all optimization techniques applied directly on your website pages to improve search engine rankings. This includes optimizing content, HTML tags, images, internal links, URL structure, and technical elements. Unlike off-page SEO (backlinks, social signals), on-page factors are completely within your control. Proper on-page optimization can improve rankings by 25-50% and significantly increase organic traffic."
                }
              },
              {
                "@type": "Question",
                "name": "Is this on-page SEO checker completely free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the SEOShouts on-page SEO checker is 100% free with no hidden costs, subscriptions, or premium upsells. You get full access to analyze 150+ SEO factors including Core Web Vitals, keyword density, technical SEO, and mobile optimization. No credit card required, no registration needed."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate is the SEO analysis provided by this tool?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The analyzer uses real-time data from the Google PageSpeed Insights API for Core Web Vitals and performance metrics, so you get the same data Google uses for ranking decisions. It fetches and analyzes your actual HTML and page structure in real time, evaluating 150+ ranking factors based on Google's documented best practices."
                }
              },
              {
                "@type": "Question",
                "name": "Can I analyze competitor websites with this tool?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. You can analyze any publicly accessible URL, including competitor sites. SEO professionals use this to benchmark against top-ranking competitors, reverse-engineer successful strategies, and identify content gaps or technical advantages."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I run on-page SEO analysis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Analyze your key pages at least monthly to monitor SEO health, plus after significant changes like redesigns, content updates, or Google algorithm updates. For competitive industries, weekly analysis of key pages helps maintain optimal performance."
                }
              },
              {
                "@type": "Question",
                "name": "Do you store or share my website data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Each analysis runs in real time and results are only displayed during your active session. Once you close or refresh the page, all data is cleared. No accounts, no cross-session tracking, no personal data collection."
                }
              },
              {
                "@type": "Question",
                "name": "What should I do after getting my SEO analysis report?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Address critical issues first (shown in red) as these have the biggest ranking impact, then warnings (yellow). Prioritize technical issues like HTTPS, Core Web Vitals, and mobile-friendliness, then content optimization (title tags, headings, keyword placement). Re-analyze after each major fix and monitor ranking improvements over 2-4 weeks."
                }
              }
            ]
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