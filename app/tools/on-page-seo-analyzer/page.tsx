import { Metadata } from 'next'
import OnPageSEOAnalyzerClient from './OnPageSEOAnalyzerClient'

export const metadata: Metadata = {
  title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
  description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
  keywords: 'on-page SEO analyzer, website SEO audit, SEO analysis tool, Core Web Vitals, technical SEO, content optimization, SEO checker, website analysis',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/on-page-seo-analyzer',
  },
  openGraph: {
    title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
    description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
    url: 'https://seoshouts.com/tools/on-page-seo-analyzer',
    siteName: 'SEO Shouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Page SEO Checker - On-page SEO Checker - No Sign Up',
    description: 'Boost your website\'s SEO with our free page checker. Instantly analyze your on-page elements to improve rankings—no account needed.',
  },
}

export default function OnPageSEOAnalyzer() {
  return <OnPageSEOAnalyzerClient />
}