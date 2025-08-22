import { Metadata } from 'next'
import WordCounterClient from './WordCounterClient'

export const metadata: Metadata = {
  title: 'Free Words and Character Counter Tool | SEO Shouts',
  description: 'Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media. Check character limits for Twitter, Instagram and more.',
  keywords: 'word counter, character counter, text analysis, writing tools, social media character limits, reading time calculator',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/word-counter',
  },
  openGraph: {
    title: 'Free Words and Character Counter Tool | SEO Shouts',
    description: 'Count words, characters, paragraphs and sentences in real-time. Perfect for writers, bloggers, and social media. Check character limits for Twitter, Instagram and more.',
    url: 'https://seoshouts.com/tools/word-counter',
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
  return <WordCounterClient />
}