import { Metadata } from 'next'
import HTMLEditorClient from './HTMLEditorClient'

export const metadata: Metadata = {
  title: 'Free Online HTML5 Editor — Live Preview & Clean Code | SEOShouts',
  description: 'Professional HTML5 editor with live preview and syntax highlighting. Edit HTML, CSS, and JavaScript online with real-time preview. Free web development tool.',
  keywords: 'HTML editor, online HTML editor, live preview HTML, code editor, HTML CSS JS editor, web development tool',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/html-editor/',
  },
  openGraph: {
    title: 'Free Online HTML5 Editor — Live Preview & Clean Code | SEOShouts',
    description: 'Professional HTML5 editor with live preview and syntax highlighting. Edit HTML, CSS, and JavaScript online with real-time preview. Free web development tool.',
    url: 'https://seoshouts.com/tools/html-editor/',
    siteName: 'SEOShouts',
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
    title: 'Free Online HTML5 Editor — Live Preview & Clean Code | SEOShouts',
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
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "HTML Editor",
            "description": "Professional HTML5 editor with live preview and syntax highlighting. Edit HTML, CSS, and JavaScript online with real-time preview. Free web development tool.",
            "url": "https://seoshouts.com/tools/html-editor/",
            "applicationCategory": "BrowserApplication",
            "applicationSubCategory": "SEO Tool",
            "operatingSystem": "Any (Web Browser)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Rohit Sharma",
              "url": "https://seoshouts.com/meet-the-experts/",
              "jobTitle": "SEO Consultant & Founder",
              "worksFor": {
                "@type": "Organization",
                "name": "SEOShouts",
                "url": "https://seoshouts.com"
              }
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEOShouts",
              "url": "https://seoshouts.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://seoshouts.com/logo.png"
              }
            },
            "featureList": ["Live HTML Preview","Syntax Highlighting","HTML, CSS & JavaScript Editing","Clean Code Output","Runs Entirely in Browser","No Login Required"],
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-07-04"
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
                "name": "HTML Editor",
                "item": "https://seoshouts.com/tools/html-editor"
              }
            ]
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is this HTML editor really free?","acceptedAnswer":{"@type":"Answer","text":"Yes, completely free. No signup required, no hidden fees, no limitations on usage."}},{"@type":"Question","name":"Can I use this for professional projects?","acceptedAnswer":{"@type":"Answer","text":"Absolutely! It's great for prototyping, testing code snippets, and creating HTML templates for clients."}},{"@type":"Question","name":"Does it work offline?","acceptedAnswer":{"@type":"Answer","text":"Yes, after the page loads, you can continue coding even without an internet connection."}},{"@type":"Question","name":"Can I save my work?","acceptedAnswer":{"@type":"Answer","text":"Your work auto-saves to your browser's local storage. You can also copy or download your code anytime."}},{"@type":"Question","name":"What frameworks and libraries can I use?","acceptedAnswer":{"@type":"Answer","text":"You can include any client-side library via CDN links — Bootstrap, jQuery, React, Vue.js, etc."}},{"@type":"Question","name":"Is my code private and secure?","acceptedAnswer":{"@type":"Answer","text":"Yes, everything runs in your browser. We don't store, transmit, or see your code."}}]}) }} />

      <HTMLEditorClient />
    </>
  )
}