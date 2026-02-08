import { Metadata } from 'next'
import InternalLinkCheckerClient from './InternalLinkCheckerClient'

export const metadata: Metadata = {
  title: 'Free Internal Link Checker — Analyze Anchor Text & Site Structure | SEOShouts',
  description: 'Free internal link checker that crawls up to 500 pages, analyzes anchor text distribution with a visual word cloud, and identifies over-optimization. No login required.',
  keywords: 'internal link checker, anchor text analyzer, internal link analysis, internal linking tool, SEO analysis, anchor text distribution, internal link audit, link checker, anchor cloud, free SEO tool, anchor text cloud',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/internal-link-checker/',
  },
  openGraph: {
    title: 'Free Internal Link Checker — Analyze Anchor Text & Site Structure',
    description: 'Crawl up to 500 pages, visualize anchor text with word clouds, detect keyword stuffing & generic links. The only free internal link checker with visual anchor analysis.',
    url: 'https://seoshouts.com/tools/internal-link-checker/',
    siteName: 'SEOShouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/internal-link-checker-og.png',
        width: 1200,
        height: 630,
        alt: 'Free Internal Link Checker — Analyze Anchor Text & Site Structure',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Internal Link Checker — Analyze Anchor Text & Site Structure',
    description: 'Visual word cloud analysis, anchor text distribution, keyword stuffing detection. Free, no login, up to 500 pages.',
    images: ['https://seoshouts.com/images/internal-link-checker-og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function InternalLinkCheckerPage() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SEOShouts Internal Link Checker",
            "description": "Free internal link checker that crawls up to 500 pages and analyzes anchor text distribution with visual word cloud visualization, keyword stuffing detection, and generic link identification.",
            "url": "https://seoshouts.com/tools/internal-link-checker/",
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
              "Visual Anchor Text Word Cloud",
              "Keyword Stuffing Detection",
              "Generic Link Identification",
              "Deep Crawl Up to 500 URLs",
              "Anchor Text Distribution Analysis",
              "Destination URL Mapping",
              "No Login Required",
              "Real-time Browser-based Analysis"
            ],
            "screenshot": "https://seoshouts.com/images/internal-link-checker-screenshot.png",
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-02-07"
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
                "name": "What is an internal link checker?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "An internal link checker is an SEO tool that crawls your website to analyze how pages link to each other. It examines anchor text patterns, link distribution, follow/nofollow attributes, and identifies issues like broken links, orphan pages, and over-optimized anchor text. SEOShouts' internal link checker adds visual word cloud analysis to show which anchor phrases dominate your linking profile."
                }
              },
              {
                "@type": "Question",
                "name": "How many internal links should a page have?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "According to Zyppy's analysis of 23 million internal links, pages with 40-44 internal links receive the most Google clicks, with 45-50 being the peak traffic range. Beyond 50 internal links per page, traffic declines significantly. Aim for 3-5 contextual internal links per 1,000 words of content."
                }
              },
              {
                "@type": "Question",
                "name": "What is the ideal anchor text ratio for internal links?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A healthy internal anchor text distribution is approximately: 50-60% descriptive or partial match anchors, 20-30% branded anchors, 10-15% exact match anchors, and less than 5% generic anchors like 'click here.' Never use the same anchor text repeatedly for the same target URL."
                }
              },
              {
                "@type": "Question",
                "name": "Can over-optimized anchor text hurt SEO rankings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Google's Penguin algorithm specifically targets unnatural anchor text patterns. Sites with anchor text diversity below 30% — meaning the same anchor used more than 70% of the time — have experienced ranking drops of up to 15 positions in competitive niches. Our internal link checker's word cloud visualization makes it easy to spot over-optimization before it triggers penalties."
                }
              },
              {
                "@type": "Question",
                "name": "Is the SEOShouts internal link checker free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, completely free. The tool crawls up to 500 URLs per analysis with no registration, no credit card, and no usage limits. You get full anchor text analysis, word cloud visualization, keyword stuffing detection, and generic link identification at zero cost."
                }
              },
              {
                "@type": "Question",
                "name": "What makes SEOShouts different from other internal link checkers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEOShouts is the only free internal link checker that generates visual word clouds of your anchor text profile. While tools like Screaming Frog, Ahrefs, and SEOptimer show data in tables, our word cloud gives you an instant visual health check of your anchor text distribution. We also offer anchor text grouping, destination URL analysis, and keyword stuffing detection — all without requiring login or payment."
                }
              },
              {
                "@type": "Question",
                "name": "How does internal linking affect AI search rankings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI search engines like ChatGPT, Perplexity, and Google Gemini use internal links to understand topical relationships between your pages. Descriptive, natural language anchor text helps AI models map your site's semantic structure more effectively than short keyword anchors. A strong internal linking structure gives AI engines clearer signals about which pages are authoritative on specific topics."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I audit internal links?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Run a full internal link audit monthly. Check for sudden spikes in exact-match anchor text, identify orphan pages with zero incoming links, verify all links return 200 status codes, and ensure important pages receive adequate link equity. After publishing new content, immediately add 3-5 internal links from existing relevant pages."
                }
              },
              {
                "@type": "Question",
                "name": "What are orphan pages and why do they matter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Orphan pages are website pages with zero internal links pointing to them. Search engines struggle to discover and index orphan pages, and they receive virtually no organic traffic. According to Semrush's site audit data, 25% of all web pages have zero incoming internal links. Every important page should have at least 3 incoming internal links from related content."
                }
              },
              {
                "@type": "Question",
                "name": "Does this tool analyze external links too?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This tool focuses specifically on internal links to help you control relevance flow and link equity within your own domain. For external link analysis, you can use our On-Page SEO Analyzer which audits both internal and external links along with 100+ other ranking factors."
                }
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
            "name": "How to Audit Your Internal Link Anchor Text",
            "description": "Step-by-step guide to analyzing and optimizing your website's internal link anchor text using the SEOShouts Internal Link Checker.",
            "totalTime": "PT5M",
            "tool": {
              "@type": "HowToTool",
              "name": "SEOShouts Internal Link Checker"
            },
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Enter Your Domain",
                "text": "Enter your homepage URL in the tool input field. The crawler reads your website's HTML, specifically extracting text between <a> and </a> tags across up to 500 pages."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Analyze the Word Cloud",
                "text": "Review the visual word cloud for an instant health check. Look for a diverse mix of natural anchor terms. If a single keyword dominates the cloud, your anchor profile is over-optimized."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Review the Anchor Text Data",
                "text": "Switch to the data view to see frequency, context, and destination URLs for each anchor text. Check your distribution against the recommended ratio: 50-60% partial match, 20-30% branded, 10-15% exact match, under 5% generic."
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Fix and Optimize",
                "text": "Replace generic anchors like 'click here' with descriptive phrases. Diversify over-used exact match keywords using synonyms and partial match variations. Ensure important pages have 3+ incoming internal links with varied anchor text."
              }
            ]
          })
        }}
      />

      {/* BreadcrumbList Schema */}
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
                "item": "https://seoshouts.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "SEO Tools",
                "item": "https://seoshouts.com/tools/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Internal Link Checker",
                "item": "https://seoshouts.com/tools/internal-link-checker/"
              }
            ]
          })
        }}
      />

      <InternalLinkCheckerClient />
    </>
  )
}
