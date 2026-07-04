import { Metadata } from 'next';
import TrendingHashtagFinderClient from './TrendingHashtagFinderClient';

export const metadata: Metadata = {
  title: 'Free Trending Hashtag Finder & Generator - Discover Viral Hashtags | SEOShouts',
  description: 'Find trending hashtags across 15+ social media platforms. Generate viral hashtags for Instagram, TikTok, Twitter, LinkedIn & more. Real-time hashtag analytics, difficulty scores & competitor insights - completely free!',
  keywords: 'hashtag finder, trending hashtags, hashtag generator, Instagram hashtags, TikTok hashtags, Twitter hashtags, social media hashtags, viral hashtags, hashtag analytics, free hashtag tool',
  openGraph: {
    title: 'Free Trending Hashtag Finder & Generator | SEOShouts',
    description: 'Discover trending hashtags across 15+ platforms with real-time analytics, difficulty scores & AI-powered generation. The most comprehensive free hashtag tool on the internet.',
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
    description: 'Find viral hashtags across 15+ social platforms with real-time trending analysis & AI generation.',
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
  description: 'Free tool to find trending hashtags and generate viral hashtags across 15+ social media platforms with real-time analytics.',
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
    'Multi-platform support (15+ platforms)',
    'AI-powered hashtag generation',
    'Hashtag difficulty scoring',
    'Competitor hashtag analysis',
    'Multi-language support',
    'Viral potential prediction',
    'Custom hashtag creation'
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
    { '@type': 'Question', name: 'How many platforms does this tool support?', acceptedAnswer: { '@type': 'Answer', text: 'The hashtag finder currently supports 6+ popular social media platforms including Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, and Threads, with platform-specific optimization strategies.' } },
    { '@type': 'Question', name: 'Are the hashtags real trending data?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. For supported platforms like Twitter and LinkedIn, real API data is used. For others, strategically curated hashtags are provided based on current trends and platform best practices.' } },
    { '@type': 'Question', name: 'Can I analyze competitor hashtags?', acceptedAnswer: { '@type': 'Answer', text: "The competitor analysis feature lets you analyze any competitor's hashtag strategy and discover opportunities they're missing in your industry (available for most platforms)." } },
    { '@type': 'Question', name: 'How do I use the generated hashtags?', acceptedAnswer: { '@type': 'Answer', text: 'Copy the hashtags using the copy buttons and paste them into your social media posts. Both individual hashtag copying and bulk copy are supported.' } },
    { '@type': 'Question', name: 'Does this tool help increase engagement?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The tool provides engagement analytics and trending patterns to help you choose hashtags that actually drive results and increase your content visibility.' } },
    { '@type': 'Question', name: 'Is there a limit on usage?', acceptedAnswer: { '@type': 'Answer', text: 'The tool is completely free with reasonable rate limits to ensure quality service for all users.' } },
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