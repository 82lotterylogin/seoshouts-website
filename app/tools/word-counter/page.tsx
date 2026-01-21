import { Metadata } from 'next'
import WordCounterClient from './WordCounterClient'
import RelatedTools from '../../components/RelatedTools'

export const metadata: Metadata = {
  title: 'Free Words and Character Counter Tool | SEO Shouts',
  description: 'Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media. Check character limits for Twitter, Instagram and more.',
  keywords: 'word counter, character counter, text analysis, writing tools, social media character limits, reading time calculator',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/word-counter/',
  },
  openGraph: {
    title: 'Free Words and Character Counter Tool | SEO Shouts',
    description: 'Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media. Check character limits for Twitter, Instagram and more.',
    url: 'https://seoshouts.com/tools/word-counter/',
    siteName: 'SEO Shouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Words and Character Counter Tool | SEO Shouts',
    description: 'Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media.',
  },
}

export default function WordCounter() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Word Counter",
            "description": "Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media. Check character limits for Twitter, Instagram and more.",
            "url": "https://seoshouts.com/tools/word-counter/",
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
                "name": "Word Counter",
                "item": "https://seoshouts.com/tools/word-counter"
              }
            ]
          })
        }}
      />

      <WordCounterClient />
      <RelatedTools currentTool="word-counter" />
    </>
  )
}