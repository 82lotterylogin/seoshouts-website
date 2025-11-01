import { Metadata } from 'next'
import HTMLEditorClient from './HTMLEditorClient'

export const metadata: Metadata = {
  title: 'Online HTML5 Editor - Free Online Editor & Preview Tool',
  description: 'Professional HTML5 editor with live preview and syntax highlighting. Edit HTML, CSS, and JavaScript online with real-time preview. Free web development tool.',
  keywords: 'HTML editor, online HTML editor, live preview HTML, code editor, HTML CSS JS editor, web development tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/html-editor/',
  },
  openGraph: {
    title: 'Online HTML5 Editor - Free Online Editor & Preview Tool',
    description: 'Professional HTML5 editor with live preview and syntax highlighting. Edit HTML, CSS, and JavaScript online with real-time preview. Free web development tool.',
    url: 'https://seoshouts.com/tools/html-editor/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/html-editor-og.jpg',
        width: 1200,
        height: 630,
        alt: 'HTML Editor Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online HTML5 Editor - Free Online Editor & Preview Tool',
    description: 'Professional HTML5 editor with live preview and syntax highlighting. Edit HTML, CSS, and JavaScript online with real-time preview.',
    images: ['https://seoshouts.com/images/html-editor-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function HTMLEditor() {
  return <HTMLEditorClient />
}