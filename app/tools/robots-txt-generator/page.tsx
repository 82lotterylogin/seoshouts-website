import { Metadata } from 'next'
import RobotsTxtGeneratorClient from './RobotsTxtGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Robots.txt Generator — AI Crawler Rules Included | SEOShouts',
  description: 'Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.',
  keywords: 'robots.txt generator, robots txt file, search engine crawling, website security, SEO tools',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/robots-txt-generator/',
  },
  openGraph: {
    title: 'Free Robots.txt Generator — AI Crawler Rules Included | SEOShouts',
    description: 'Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.',
    url: 'https://seoshouts.com/tools/robots-txt-generator/',
    siteName: 'SEOShouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/robots-txt-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Robots.txt Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Robots.txt Generator — AI Crawler Rules Included | SEOShouts',
    description: 'Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.',
    images: ['https://seoshouts.com/images/robots-txt-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function RobotsTxtGenerator() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Robots.txt Generator",
            "description": "Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.",
            "url": "https://seoshouts.com/tools/robots-txt-generator/",
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
                "name": "Robots.txt Generator",
                "item": "https://seoshouts.com/tools/robots-txt-generator"
              }
            ]
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
        {"@type":"Question","name":"What is a robots.txt file?","acceptedAnswer":{"@type":"Answer","text":"Robots.txt is a plain text file at your website's root that tells search engine crawlers which parts of your site they may and may not crawl. Well-behaved bots (Googlebot, Bingbot, and major AI crawlers) read it before crawling anything else. It controls crawling, not indexing: use a noindex tag to keep a page out of search results."}},
        {"@type":"Question","name":"How do I create a robots.txt for WordPress?","acceptedAnswer":{"@type":"Answer","text":"Select the WordPress preset in the generator, it blocks /wp-admin/ and /wp-includes/ while keeping admin-ajax.php and your uploads folder crawlable. Then install it via your SEO plugin (Yoast: Tools > File editor; Rank Math: General Settings > Edit robots.txt) or upload the file to your site root via FTP."}},
        {"@type":"Question","name":"Where do I upload the robots.txt file?","acceptedAnswer":{"@type":"Answer","text":"Always in the root of your domain, so it loads at yoursite.com/robots.txt. Subdirectories do not work: search engines only check the root. On WordPress, an SEO plugin can serve it for you without touching FTP."}},
        {"@type":"Question","name":"Can robots.txt hide a page from Google?","acceptedAnswer":{"@type":"Answer","text":"Not reliably. Robots.txt blocks crawling, but a blocked URL can still appear in results (with no description) if other sites link to it. To keep a page out of Google, allow crawling and add a noindex meta tag, or protect it with a login."}},
        {"@type":"Question","name":"Should I block AI crawlers like GPTBot?","acceptedAnswer":{"@type":"Answer","text":"It depends on your goals. Blocking GPTBot, ClaudeBot, and PerplexityBot keeps your content out of AI training and AI search answers, which also means zero visibility when customers ask AI assistants for recommendations. Most businesses now allow AI crawlers for the visibility. The generator gives you per-bot toggles either way."}},
        {"@type":"Question","name":"Is this robots.txt generator free?","acceptedAnswer":{"@type":"Answer","text":"Yes, completely free with no signup. Pick your platform preset, toggle the rules you need, preview the exact file, and download it. Templates cover WordPress, Shopify, eCommerce, and custom sites."}}
      ]}) }} />

      <RobotsTxtGeneratorClient />
    </>
  )
}