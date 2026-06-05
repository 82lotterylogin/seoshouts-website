import { Metadata } from 'next'
import SchemaGeneratorClient from './SchemaGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Online Schema Generator - 39 Types - No Login - No Signup - SEOShouts',
  description: 'Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required. Organization, Article, Product, Event schemas & more.',
  keywords: 'schema generator, JSON-LD generator, structured data, schema markup, SEO schema, rich snippets',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/schema-generator/',
  },
  openGraph: {
    title: 'Free Online Schema Generator - 39 Types - No Login - No Signup - SEOShouts',
    description: 'Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required. Organization, Article, Product, Event schemas & more.',
    url: 'https://seoshouts.com/tools/schema-generator/',
    siteName: 'SEO Shouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/schema-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Schema Generator Tool - SEO Shouts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Schema Generator - 39 Types - No Login - No Signup - SEOShouts',
    description: 'Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required.',
    images: ['https://seoshouts.com/images/schema-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'language': 'en',
  },
}

export default function SchemaGenerator() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Schema Generator",
            "description": "Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required. Organization, Article, Product, Event schemas & more.",
            "url": "https://seoshouts.com/tools/schema-generator/",
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
                "item": "https://seoshouts.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Schema Generator",
                "item": "https://seoshouts.com/tools/schema-generator"
              }
            ]
          })
        }}
      />

      {/* HowTo Schema — step-by-step guide for AI extraction */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Create Schema Markup (JSON-LD) for Your Website",
        "description": "Use the SEOShouts Schema Generator to create valid JSON-LD schema markup in minutes. Supports 39+ schema types including FAQPage, Article, Product, LocalBusiness, and more.",
        "tool": { "@type": "HowToTool", "name": "SEOShouts Schema Generator", "url": "https://seoshouts.com/tools/schema-generator/" },
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Choose Your Schema Type", "text": "Select from 39+ schema types using the searchable dropdown. Categories include Business, Content, E-commerce, Events, People, and specialized types." },
          { "@type": "HowToStep", "position": 2, "name": "Fill in the Required Information", "text": "Complete the dynamically generated form fields with your specific information. Required fields are marked with asterisks and include contextual examples." },
          { "@type": "HowToStep", "position": 3, "name": "Add Optional Properties", "text": "Include additional properties to enrich your schema using advanced builders for addresses, geo-coordinates, ratings, FAQ pairs, and step instructions." },
          { "@type": "HowToStep", "position": 4, "name": "Complete Human Verification", "text": "Verify with Google reCAPTCHA (one-time per session) to generate your schema markup." },
          { "@type": "HowToStep", "position": 5, "name": "Generate and Validate", "text": "Click Generate to create your JSON-LD schema. The tool validates required fields and provides error feedback." },
          { "@type": "HowToStep", "position": 6, "name": "Export and Test", "text": "Copy to clipboard or download as a JSON file. Use the Google Rich Results Test button to validate immediately." },
          { "@type": "HowToStep", "position": 7, "name": "Implement on Your Website", "text": "Paste the generated JSON-LD code into the <head> section of your HTML page. JSON-LD is Google's recommended format for structured data." }
        ]
      })}} />

      {/* Speakable Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".tool-hero-sub"] },
        "url": "https://seoshouts.com/tools/schema-generator/"
      })}} />

      <SchemaGeneratorClient />
    </>
  )
}