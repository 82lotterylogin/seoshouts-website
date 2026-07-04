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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
        {"@type":"Question","name":"What is a meta tag optimization tool?","acceptedAnswer":{"@type":"Answer","text":"A meta tag optimization tool helps you write, validate, and preview the HTML meta tags that control how your page appears in search results and social shares. This one combines a live Google SERP preview, color-coded character validation for titles and descriptions, and a complete generated tag set including canonical, Open Graph, and Twitter Card markup."}},
        {"@type":"Question","name":"Are meta tags really important for SEO?","acceptedAnswer":{"@type":"Answer","text":"Yes. The title tag is a direct ranking signal, and both title and description control your click-through rate from search results. Two pages at the same position can differ in traffic by 30-40% purely on the strength of their meta tags, because searchers choose the listing that best promises what they want."}},
        {"@type":"Question","name":"What is the ideal title tag length?","acceptedAnswer":{"@type":"Answer","text":"Keep titles between 30 and 60 characters. Google truncates by pixel width (about 600 pixels), so 60 characters is the safe ceiling. Put your primary keyword in the first 30 characters, that portion survives truncation on every device."}},
        {"@type":"Question","name":"What is the ideal meta description length?","acceptedAnswer":{"@type":"Answer","text":"Aim for 120 to 160 characters. Below 120 wastes the space Google gives you; above 160 gets cut mid-sentence, usually right where your call to action was. The color-coded counter in the tool marks the optimal band as you type."}},
        {"@type":"Question","name":"Do meta keywords still matter?","acceptedAnswer":{"@type":"Answer","text":"No. Google has ignored the meta keywords tag since 2009, and no major engine uses it for ranking. The tool includes the field for completeness and for the few regional engines that still read it, but never spend optimization effort there."}},
        {"@type":"Question","name":"Why does Google rewrite my title tags?","acceptedAnswer":{"@type":"Answer","text":"Google rewrites titles it judges too long, keyword-stuffed, boilerplate, or mismatched to the query, industry studies put the rewrite rate around 60%. Titles that state the page topic honestly, lead with the keyword, and stay inside the pixel limit are the ones Google keeps."}},
        {"@type":"Question","name":"How do I implement the generated code?","acceptedAnswer":{"@type":"Answer","text":"Copy the HTML block and paste it inside your page's <head> section. On WordPress, transfer the title and description into your SEO plugin fields (Yoast, Rank Math) instead, the plugin renders the tags for you. On Shopify, Webflow, and most site builders, each page has dedicated SEO fields for the same values."}},
        {"@type":"Question","name":"Are social media tags included?","acceptedAnswer":{"@type":"Answer","text":"Yes. The generated code includes Open Graph tags (og:title, og:description, og:url, og:image) for Facebook, LinkedIn, and WhatsApp previews, plus Twitter Card markup for X. These tags are also increasingly read by AI assistants when they summarize and cite pages."}}
      ]}) }} />

      <MetaTagOptimizerClient />
    </>
  )
}