import { Metadata } from 'next'
import MetaTagOptimizerClient from './MetaTagOptimizerClient'

export const metadata: Metadata = {
  title: 'Free Meta Tag Generator & Optimizer — Live SERP Preview | SEOShouts',
  description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.',
  keywords: 'meta tag generator, title tag optimizer, meta description tool, SERP preview, SEO meta tags',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/meta-tag-optimizer/',
  },
  openGraph: {
    title: 'Free Meta Tag Generator & Optimizer — Live SERP Preview | SEOShouts',
    description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.',
    url: 'https://seoshouts.com/tools/meta-tag-optimizer/',
    siteName: 'SEOShouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Meta Tag Generator & Optimizer — Live SERP Preview | SEOShouts',
    description: 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview.',
  },
}

export default function MetaTagOptimizer() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Meta Tag Optimizer",
            "description": "Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.",
            "url": "https://seoshouts.com/tools/meta-tag-optimizer/",
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
            "featureList": ["Live SERP Preview","Title & Description Length Checking","Keyword Placement Analysis","Instant Optimization Feedback","Free Unlimited Use","No Login Required"],
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
                "item": "https://seoshouts.com/tools/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Meta Tag Optimizer",
                "item": "https://seoshouts.com/tools/meta-tag-optimizer/"
              }
            ]
          })
        }}
      />

      {/* HowTo Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Optimize Your Meta Tags for Better SEO",
        "description": "Use the free SEOShouts Meta Tag Optimizer to write, preview, and optimize your page title and meta description for maximum click-through rate.",
        "tool": { "@type": "HowToTool", "name": "SEOShouts Meta Tag Optimizer", "url": "https://seoshouts.com/tools/meta-tag-optimizer/" },
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Enter Your Meta Content", "text": "Input your page title, meta description, target keywords, and URL. The tool provides real-time character count and optimization suggestions as you type." },
          { "@type": "HowToStep", "position": 2, "name": "Preview SERP Appearance", "text": "See exactly how your page will appear in Google search results with the live SERP preview. Adjust until your title and description fit within the recommended character limits." },
          { "@type": "HowToStep", "position": 3, "name": "Generate and Copy the Code", "text": "Get ready-to-use HTML meta tag code including Open Graph and Twitter Card tags. Copy and paste the output into your page's <head> section." }
        ]
      })}} />

      {/* Speakable Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".tool-hero-sub"] },
        "url": "https://seoshouts.com/tools/meta-tag-optimizer/"
      })}} />

      {/* FAQPage Schema — mirrors the visible FAQ section */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Are meta tags really important for SEO?","acceptedAnswer":{"@type":"Answer","text":"Yes, absolutely! Meta tags directly impact click-through rates and help search engines understand your content."}},{"@type":"Question","name":"Can I use this for client projects?","acceptedAnswer":{"@type":"Answer","text":"Absolutely! It's great for agencies, freelancers, and professionals optimizing client websites."}},{"@type":"Question","name":"What's the ideal title tag length?","acceptedAnswer":{"@type":"Answer","text":"Keep titles between 30-60 characters. Our tool shows real-time character counts with color-coded validation."}},{"@type":"Question","name":"How do I implement the generated code?","acceptedAnswer":{"@type":"Answer","text":"Copy the HTML code and paste it in your page's <head> section, or use SEO plugins like Yoast."}},{"@type":"Question","name":"Do I need keywords in meta descriptions?","acceptedAnswer":{"@type":"Answer","text":"Include your primary keyword naturally, but write for humans first. Avoid keyword stuffing."}},{"@type":"Question","name":"Are social media tags included?","acceptedAnswer":{"@type":"Answer","text":"Yes, we generate Open Graph and Twitter Card tags for optimal social media sharing."}}]}) }} />

      <MetaTagOptimizerClient />
    </>
  )
}