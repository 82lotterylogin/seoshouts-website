import { Metadata } from 'next';
import TrendingHashtagFinderClient from './TrendingHashtagFinderClient';

export const metadata: Metadata = {
  title: 'Free Trending Hashtag Finder & Generator - Discover Viral Hashtags | SEOShouts',
  description: 'Find trending hashtags across 6+ social media platforms. Generate viral hashtags for Instagram, Twitter/X, YouTube, LinkedIn, Pinterest & Threads. Real-time trending data, AI generation & competitor analysis - completely free!',
  keywords: 'hashtag finder, trending hashtags, hashtag generator, Instagram hashtags, Twitter hashtags, LinkedIn hashtags, social media hashtags, viral hashtags, free hashtag tool',
  openGraph: {
    title: 'Free Trending Hashtag Finder & Generator | SEOShouts',
    description: 'Discover trending hashtags across 6+ platforms with real-time analytics, AI-powered generation, and competitor analysis. Completely free, no signup required.',
    type: 'website',
    url: 'https://seoshouts.com/tools/trending-hashtag-finder/',
    images: [
      {
        url: 'https://seoshouts.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trending Hashtag Finder Tool - SEOShouts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Trending Hashtag Finder & Generator | SEOShouts',
    description: 'Find viral hashtags across 6+ social platforms with real-time trending analysis & AI generation.',
    images: ['https://seoshouts.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://seoshouts.com/tools/trending-hashtag-finder/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Trending Hashtag Finder & Generator',
  applicationCategory: 'Social Media Tool',
  description: 'Free tool to find trending hashtags and generate viral hashtags across 6+ social media platforms with real-time analytics.',
  url: 'https://seoshouts.com/tools/trending-hashtag-finder/',
  provider: {
    '@type': 'Organization',
    name: 'SEOShouts',
    url: 'https://seoshouts.com',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Real-time trending hashtag discovery',
    'Multi-platform support (6+ platforms)',
    'AI-powered hashtag generation',
    'Competitor hashtag analysis',
    'Bulk hashtag generation',
    'Multi-language support',
  ],
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://seoshouts.com/' },
    { '@type': 'ListItem', position: 2, name: 'Free SEO Tools', item: 'https://seoshouts.com/tools/' },
    { '@type': 'ListItem', position: 3, name: 'Trending Hashtag Finder', item: 'https://seoshouts.com/tools/trending-hashtag-finder/' },
  ],
};

// mirrors the visible FAQ section in TrendingHashtagFinderClient
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How many platforms does this hashtag finder support?', acceptedAnswer: { '@type': 'Answer', text: 'Six-plus popular social platforms: Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, and Threads, each with its own optimization strategy and recommended hashtag count.' } },
    { '@type': 'Question', name: 'Are the hashtags real trending data?', acceptedAnswer: { '@type': 'Answer', text: 'For supported platforms like Twitter and LinkedIn, the tool uses real API data. For others, it provides strategically curated hashtags based on current trends and platform best practices.' } },
    { '@type': 'Question', name: "Can I analyze a competitor's hashtags?", acceptedAnswer: { '@type': 'Answer', text: 'Yes. The competitor analysis mode lets you enter any public handle and see the hashtag strategy behind their posts, so you can find tags they use successfully that you have missed.' } },
    { '@type': 'Question', name: 'How do I use the generated hashtags?', acceptedAnswer: { '@type': 'Answer', text: 'Copy individual hashtags with the per-tag copy button, or use Copy All to grab the entire generated set, then paste directly into your post caption or description.' } },
    { '@type': 'Question', name: 'Does this tool help increase engagement?', acceptedAnswer: { '@type': 'Answer', text: 'It gives you the data needed to choose better: post counts, engagement level, and trend direction per hashtag, so you pick tags with real current traction instead of guessing from memory.' } },
    { '@type': 'Question', name: 'Is this hashtag finder free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, completely free with reasonable rate limits to keep the service fast for everyone. No signup, no watermark, no hashtag-count paywall.' } },
  ],
};

export default function TrendingHashtagFinderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <TrendingHashtagFinderClient />
    </>
  );
}