import { Metadata } from 'next'
import SchemaGeneratorClient from './SchemaGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Schema Markup Generator (JSON-LD) — 39 Types | SEOShouts',
  description: 'Generate valid JSON-LD schema markup in seconds. 39 schema types including Organization, Article, Product, FAQ, Event & LocalBusiness. Built-in Google Rich Results Test. No signup.',
  keywords: 'schema markup generator, schema generator, JSON-LD generator, structured data generator, schema markup, SEO schema, rich snippets',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/schema-generator/',
  },
  openGraph: {
    title: 'Free Schema Markup Generator (JSON-LD) — 39 Types',
    description: 'Generate valid JSON-LD schema markup in seconds. 39 schema types with built-in Google Rich Results Test integration. Free, no signup.',
    url: 'https://seoshouts.com/tools/schema-generator/',
    siteName: 'SEOShouts',
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
    title: 'Free Schema Markup Generator (JSON-LD) — 39 Types',
    description: 'Generate valid JSON-LD schema markup in seconds. 39 schema types with built-in Google Rich Results Test integration. Free, no signup.',
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
            "name": "SEOShouts Schema Markup Generator",
            "description": "Free schema markup generator supporting 39 schema.org types. Generates valid JSON-LD structured data with built-in validation and direct Google Rich Results Test integration. No signup required.",
            "url": "https://seoshouts.com/tools/schema-generator/",
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
            "featureList": [
              "39 Schema.org Types Across 11 Categories",
              "Valid JSON-LD Output",
              "Built-in Required Field Validation",
              "Google Rich Results Test Integration",
              "FAQ, How-To, Address & Rating Builders",
              "No Login Required"
            ],
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-07-02"
          })
        }}
      />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is schema markup and why does it matter for SEO?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Schema markup is structured data code (JSON-LD format) that explicitly tells search engines what your content means — defining entities, relationships, and attributes using schema.org vocabulary. It matters because pages with schema rank higher on average due to enhanced CTR from rich snippets, which signals quality to Google's algorithm."
                }
              },
              {
                "@type": "Question",
                "name": "How many schema types does this generator support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The generator supports 39+ of the most popular schema.org types, organized across 11 categories: Business, Content, E-commerce, Events, People, Jobs, Creative, Places, Technology, Medical, and Automotive. This is significantly more than the 10-15 types offered by most free generators."
                }
              },
              {
                "@type": "Question",
                "name": "Is the generated schema markup valid and Google-compliant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. All generated markup follows schema.org standards and Google's structured data guidelines, with built-in validation, enforced required fields, and direct integration with Google's Rich Results Test so you can verify compliance before implementation."
                }
              },
              {
                "@type": "Question",
                "name": "How do I implement the generated schema on my website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Copy the generated JSON-LD code and paste it into the <head> section of your HTML page, preferably before the closing </head> tag. JSON-LD is Google's recommended format because all structured data lives in a single script tag. For WordPress sites, use a plugin like Schema Pro or Yoast SEO to add the code without editing theme files."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between JSON-LD and Microdata formats?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "JSON-LD is a script tag in the <head> section, while Microdata requires inline markup within HTML elements. Google explicitly recommends JSON-LD because it's easier to implement, maintain, and validate. This generator outputs only JSON-LD — the modern, preferred format."
                }
              },
              {
                "@type": "Question",
                "name": "Does this tool help with rich snippets in Google?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. The generator creates markup optimized for Google's rich results. Eligibility varies by schema type — not all types trigger enhanced SERP displays — so use the integrated Google Rich Results Test button to verify your specific schema."
                }
              },
              {
                "@type": "Question",
                "name": "Will schema markup improve my search rankings directly?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Schema doesn't directly boost rankings like backlinks or content quality, but it indirectly improves rankings through enhanced CTR from rich snippets. Schema also helps with voice search and AI search visibility — increasingly important as answer engines rely on structured data to understand pages."
                }
              },
              {
                "@type": "Question",
                "name": "Is there a limit on usage or do I need to create an account?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The tool is completely free with zero usage limits and no account required. No email signup, no credit card, no restrictions — generate unlimited schema markup anytime."
                }
              },
              {
                "@type": "Question",
                "name": "Can I customize schema types or add custom properties?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The generator provides all standard schema.org properties for each type through form builders. For specialized custom properties, generate the base schema and manually add properties to the exported JSON-LD code before implementation."
                }
              },
              {
                "@type": "Question",
                "name": "What happens after I implement schema on my site?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "After implementation: validate with Google Rich Results Test, submit your sitemap in Google Search Console, and monitor the Enhancements section for schema issues. Rich results typically appear within 1-4 weeks after Google recrawls and validates your markup."
                }
              }
            ]
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