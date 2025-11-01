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

export default function TrendingHashtagFinderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrendingHashtagFinderClient />
    </>
  );
}