import { Metadata } from 'next'
import BlogIdeasGeneratorClient from './BlogIdeasGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Blog Ideas Generator Tool — Never Stare at a Blank Screen Again | SEO Shouts',
  description: 'Get unlimited AI-powered blog ideas instantly. Break through writer\'s block with creative topics and angles tailored to your niche. Free content idea generator.',
  keywords: 'blog ideas generator, content ideas, blog topics, AI writing tool, content marketing, blog inspiration, writing prompts',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/blog-ideas-generator',
  },
  openGraph: {
    title: 'Free Blog Ideas Generator Tool — Never Stare at a Blank Screen Again | SEO Shouts',
    description: 'Get unlimited AI-powered blog ideas instantly. Break through writer\'s block with creative topics and angles tailored to your niche. Free content idea generator.',
    url: 'https://seoshouts.com/tools/blog-ideas-generator',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/blog-ideas-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Ideas Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Blog Ideas Generator Tool — Never Stare at a Blank Screen Again | SEO Shouts',
    description: 'Get unlimited AI-powered blog ideas instantly. Break through writer\'s block with creative topics and angles tailored to your niche.',
    images: ['https://seoshouts.com/images/blog-ideas-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function BlogIdeasGenerator() {
  return <BlogIdeasGeneratorClient />
}