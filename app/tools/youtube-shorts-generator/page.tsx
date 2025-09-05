import { Metadata } from 'next'
import YouTubeShortsGeneratorClient from './YouTubeShortsGeneratorClient'

export const metadata: Metadata = {
  title: 'Free YouTube to Shorts Converter — Split, Verticalize, and Download 60s Clips',
  description: 'Enter a YouTube URL (max 10 mins). We automatically split it into 60s vertical Shorts, and provide preview and download links for each clip.',
  keywords: 'YouTube to Shorts converter, split long video into shorts, vertical crop, 9:16, download shorts, 60s clips',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/youtube-shorts-generator',
  },
  openGraph: {
    title: 'Free YouTube to Shorts Converter — Split, Verticalize, and Download 60s Clips',
    description: 'Enter a YouTube URL (max 10 mins). We automatically split it into 60s vertical Shorts, and provide preview and download links for each clip.',
    url: 'https://seoshouts.com/tools/youtube-shorts-generator',
    siteName: 'SEO Shouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free YouTube to Shorts Converter — Split, Verticalize, and Download 60s Clips',
    description: 'Enter a YouTube URL (max 10 mins). We automatically split it into 60s vertical Shorts, and provide preview and download links for each clip.',
  },
}

export default function YouTubeShortsGeneratorPage() {
  return <YouTubeShortsGeneratorClient />
}
