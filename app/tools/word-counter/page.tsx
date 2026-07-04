import { Metadata } from 'next'
import WordCounterClient from './WordCounterClient'

export const metadata: Metadata = {
  title: 'Free Word & Character Counter — Instant Text Stats | SEOShouts',
  description: 'Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media. Check character limits for Twitter, Instagram and more.',
  keywords: 'word counter, character counter, text analysis, writing tools, social media character limits, reading time calculator',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/word-counter/',
  },
  openGraph: {
    title: 'Free Word & Character Counter — Instant Text Stats | SEOShouts',
    description: 'Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media. Check character limits for Twitter, Instagram and more.',
    url: 'https://seoshouts.com/tools/word-counter/',
    siteName: 'SEOShouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Word & Character Counter — Instant Text Stats | SEOShouts',
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
                "item": "https://seoshouts.com/tools/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Word Counter",
                "item": "https://seoshouts.com/tools/word-counter/"
              }
            ]
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is this word counter tool free?","acceptedAnswer":{"@type":"Answer","text":"Yes, our word counter tool is completely free to use. No registration required, no hidden fees — just paste your text and get instant results."}},{"@type":"Question","name":"How accurate is the word count?","acceptedAnswer":{"@type":"Answer","text":"Our word counter uses standard algorithms similar to Microsoft Word, providing accurate counts by splitting text on whitespace and filtering empty strings."}},{"@type":"Question","name":"Can I check character limits for social media?","acceptedAnswer":{"@type":"Answer","text":"Yes. The Social Media Limits panel shows live progress bars for X (Twitter), Instagram, LinkedIn, and Facebook, updating as you type."}},{"@type":"Question","name":"How is reading time calculated?","acceptedAnswer":{"@type":"Answer","text":"Reading time is estimated based on an average reading speed of 200 words per minute for adults, rounded up to the nearest whole minute."}},{"@type":"Question","name":"Does it work offline?","acceptedAnswer":{"@type":"Answer","text":"Yes, once the page loads, the word counter works entirely in your browser without needing an internet connection. No data is sent to our servers."}},{"@type":"Question","name":"Can I save my text?","acceptedAnswer":{"@type":"Answer","text":"Use the Copy Text button to save your text to the clipboard, or copy and paste into your preferred document editor. The text persists as long as the tab is open."}}]}) }} />

      <WordCounterClient />
    </>
  )
}