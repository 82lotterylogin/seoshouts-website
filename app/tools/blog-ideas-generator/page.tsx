import { Metadata } from 'next'
import BlogIdeasGeneratorClient from './BlogIdeasGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Blog Ideas & Topic Generator — AI-Powered | SEOShouts',
  description: 'Get unlimited AI-powered blog ideas instantly. Break through writer\'s block with creative topics and angles tailored to your niche. Free content idea generator.',
  keywords: 'blog ideas generator, content ideas, blog topics, AI writing tool, content marketing, blog inspiration, writing prompts',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/blog-ideas-generator/',
  },
  openGraph: {
    title: 'Free Blog Ideas & Topic Generator — AI-Powered | SEOShouts',
    description: 'Get unlimited AI-powered blog ideas instantly. Break through writer\'s block with creative topics and angles tailored to your niche. Free content idea generator.',
    url: 'https://seoshouts.com/tools/blog-ideas-generator/',
    siteName: 'SEOShouts',
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
    title: 'Free Blog Ideas & Topic Generator — AI-Powered | SEOShouts',
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
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Blog Ideas Generator",
            "description": "Get unlimited AI-powered blog ideas instantly. Break through writer's block with creative topics and angles tailored to your niche. Free content idea generator.",
            "url": "https://seoshouts.com/tools/blog-ideas-generator/",
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
            "featureList": ["AI-Powered Blog Topic Ideas","Multiple Content Angles per Keyword","Audience-Targeted Suggestions","Instant Results","Free Daily Usage","No Login Required"],
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2026-07-04"
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
              { "@type": "Question", "name": "What if someone else already wrote about my topic?", "acceptedAnswer": { "@type": "Answer", "text": "So what? Your perspective is different. Your experience is unique. Your way of explaining things might be exactly what someone needs to finally get it." } },
              { "@type": "Question", "name": "Are these topics going to be unique to my blog?", "acceptedAnswer": { "@type": "Answer", "text": "The generator gives suggestions based on what works in your niche. Other people might get similar ideas, but what you do with them is what makes them yours." } },
              { "@type": "Question", "name": "Can I change the suggested titles?", "acceptedAnswer": { "@type": "Answer", "text": "Of course! These are starting points, not commandments. Tweak them to fit your voice and style." } },
              { "@type": "Question", "name": "How often should I generate new ideas?", "acceptedAnswer": { "@type": "Answer", "text": "Whenever you're planning content. Some people batch it monthly, others prefer to generate as needed. Do whatever works for your workflow." } },
              { "@type": "Question", "name": "What if I don't like any of the suggestions?", "acceptedAnswer": { "@type": "Answer", "text": "Try different keywords or be more specific. Sometimes social media marketing gives you different results than Instagram marketing for restaurants." } },
              { "@type": "Question", "name": "Is this blog topic generator really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. No account, no credit card, no locked features. There is a fair-use daily limit to keep the AI fast for everyone, but every feature of the blog topic generator is available to every user at no cost." } }
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
                "name": "Blog Ideas Generator",
                "item": "https://seoshouts.com/tools/blog-ideas-generator"
              }
            ]
          })
        }}
      />

      <BlogIdeasGeneratorClient />
    </>
  )
}