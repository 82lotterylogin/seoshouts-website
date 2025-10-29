import type { Metadata } from 'next'
import FaqAccordion, { type FaqItem } from '../seo-website-development/FaqAccordion'

export const metadata: Metadata = {
  title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
  description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States. Professional SEO website development services for American businesses.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-website-development-usa',
  },
  openGraph: {
    title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States. Professional SEO website development services.',
    url: 'https://seoshouts.com/services/seo-website-development-usa',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-website-development-usa-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Website Development Services USA by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/seo-website-development-usa-twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const faqItems: FaqItem[] = [
  {
    question: 'How is SEO website development different from regular website development?',
    answer:
      "SEO website development integrates search engine optimization directly into the website's architecture, code, and content strategy from inception. Unlike traditional websites that require post-launch SEO retrofitting, an SEO-developed website is engineered to rank from launch day, featuring optimized URL structures, mobile-first design, exceptional page speed, clean semantic HTML, and SEO-focused development practices throughout.",
  },
  {
    question: 'Will you optimize my website for mobile users?',
    answer:
      "Absolutely. Every website we build follows mobile-first design principles. With over 60% of US internet traffic originating from mobile devices, we ensure your website delivers flawless responsiveness, lightning-fast mobile loading speeds, and an exceptional user experience across all screen sizes, operating systems, and device types.",
  },
  {
    question: 'How do you ensure that my website ranks well on Google?',
    answer:
      "Our comprehensive SEO website development process optimizes your site for all critical ranking factors including page speed optimization, Core Web Vitals excellence, comprehensive structured data markup, strategic internal linking architecture, and content optimization. We align every technical element with both user intent and Google's evolving algorithms to maximize your ranking potential for commercially valuable search queries.",
  },
  {
    question: 'Will the website be optimized for local SEO and location-based searches?',
    answer:
      'Definitely. Local SEO optimization is fundamental for businesses targeting customers in specific US geographic markets. From integrating geo-targeted keywords to optimizing your Google Business Profile, creating location-specific service pages, implementing local schema markup, and building citation consistency, we ensure your website dominates relevant local searches and "near me" queries in your target markets.',
  },
  {
    question: 'How long does it take to develop an SEO-optimized website?',
    answer:
      "Development timelines vary based on project complexity, but typically range from 2-4 weeks for a comprehensive SEO-optimized website. This encompasses research and strategy, competitive analysis, design and development, content optimization, technical SEO implementation, and thorough testing. We maintain transparent communication throughout the entire process to ensure alignment with your business objectives and timeline requirements.",
  },
  {
    question: 'Do you also handle the technical aspects of SEO for my website?',
    answer:
      "Yes, technical SEO is a cornerstone of our website development process. We meticulously optimize your website's back-end infrastructure, ensuring optimal crawlability, exceptional loading speed, secure HTTPS implementation, and adherence to technical SEO best practices. This includes XML sitemap creation, robots.txt optimization, structured data implementation, canonical tag management, and comprehensive technical auditing to maximize search engine comprehension and indexation.",
  },
  {
    question: 'How do you ensure that my website is fast and optimized for performance?',
    answer:
      "Website performance is critical for both SEO rankings and user experience. We employ advanced optimization techniques including next-gen image format compression, CSS and JavaScript minification, sophisticated caching strategies, CDN integration for US markets, and database query optimization. We specifically optimize for Google's Core Web Vitals metrics (LCP, FID, CLS), which are confirmed ranking factors, ensuring your website meets and exceeds performance benchmarks.",
  },
  {
    question: 'Will you provide support after my website is developed?',
    answer:
      "Yes! We provide comprehensive post-launch support to ensure sustained website performance. This includes ongoing SEO performance monitoring, technical issue troubleshooting, Google algorithm update adaptation guidance, and strategic recommendations for content updates and expansion to maintain and improve your search rankings over time.",
  },
  {
    question: 'Do you provide content for the website, or should I supply it?',
    answer:
      "We offer professional SEO-optimized content creation services, including strategically crafted copy with targeted keyword integration, compelling meta descriptions, and conversion-focused headlines. However, if you have existing content, we'll work with your material to optimize it for maximum SEO impact and user engagement, ensuring it aligns with search intent and conversion objectives.",
  },
  {
    question: 'Will my website be built with future SEO updates in mind?',
    answer:
      "Absolutely. We engineer websites with long-term scalability and adaptability as core principles, ensuring they remain optimized as SEO best practices and Google's algorithms continue to evolve. Whether adopting emerging SEO techniques, preparing for major algorithm updates, or integrating new search features, your website's foundation will support sustained search visibility and competitive advantage for years to come.",
  },
]

export default function SEOWebsiteDevelopmentUSAPage() {
  return (
    <>
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
                "name": "Services",
                "item": "https://seoshouts.com/services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "SEO Website Development USA",
                "item": "https://seoshouts.com/services/seo-website-development-usa"
              }
            ]
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SEO Website Development Services USA",
            "description": "Professional SEO website development services including mobile-first design, performance optimization, eCommerce development, and conversion-focused builds for American businesses.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "serviceType": "SEO Website Development Services",
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Website Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Optimized Static Website"
                  },
                  "price": "100",
                  "priceCurrency": "USD"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Optimized Website with Backend"
                  },
                  "price": "250",
                  "priceCurrency": "USD"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Optimized eCommerce Website"
                  },
                  "price": "500",
                  "priceCurrency": "USD"
                }
              ]
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-6 sm:py-10 lg:py-12">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-indigo-500 rounded-full blur-2xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-blue-600 bg-clip-text text-transparent">
                  SEO Website Development Services USA – Build Websites That Rank and Convert
                </span>
              </h1>

              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 mb-8 text-left max-w-5xl mx-auto">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Are you frustrated by <strong>websites that look stunning but never appear on Google's first page</strong>?
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Searching for authentic <strong>SEO website development</strong> that delivers measurable results for your American business?
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At SEOShouts, you don't just hire a web developer—you partner directly with an experienced SEO expert who brings <strong>over 13 years of proven SEO expertise</strong> specifically for US and international markets.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Unlike conventional agencies that prioritize aesthetics over performance, our <strong>over a decade of hands-on SEO experience</strong> has taught us to embed search optimization into every line of code from the foundation up.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We've navigated Google's evolution, adapted to algorithm shifts, and consistently delivered high-ranking websites that drive genuine business growth across the United States.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rectangle CTA Banner Section */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-t-4 border-b-4 border-blue-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 items-center py-8 lg:py-10">
              {/* Left Side - Message */}
              <div>
                <div className="inline-block px-3 py-1 bg-yellow-400 rounded-md text-gray-900 font-bold text-xs uppercase mb-3">
                  🎯 Limited Time Offer
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                  Get Your FREE SEO Website Audit Worth $500
                </h3>
                <p className="text-blue-50 text-base lg:text-lg mb-2">
                  Discover exactly what's holding your website back from ranking on Google USA
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-white text-sm">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold">Complete Technical Analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white text-sm">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold">Actionable Recommendations</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white text-sm">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold">No Obligation</span>
                  </div>
                </div>
              </div>

              {/* Right Side - CTA Buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href="/contact/?region=usa"
                  className="group relative px-6 py-3.5 bg-white text-blue-600 rounded-xl font-bold text-base text-center overflow-hidden transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    REQUEST FREE AUDIT NOW
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="mailto:seoshouts@gmail.com"
                    className="group px-4 py-3 bg-red-500 rounded-xl text-white font-bold text-center hover:bg-red-600 transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex flex-col items-center gap-0.5">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      <span className="text-xs">EMAIL US</span>
                    </span>
                    <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </a>

                  <a
                    href="https://wa.me/918094888157?text=Hi, I'm interested in SEO Website Development services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-4 py-3 bg-[#25D366] rounded-xl text-white font-bold text-center hover:bg-[#20BA5A] transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex flex-col items-center gap-0.5">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-xs">WHATSAPP</span>
                    </span>
                    <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </a>
                </div>

                <p className="text-center text-blue-100 text-xs mt-1">
                  ⚡ Get response within 24 hours • 🔒 100% Confidential
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                  What Sets Our SEO Website Development Apart in the USA?
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Throughout <strong>over a decade of SEO practice</strong>, we've analyzed and rebuilt hundreds of American business websites.
                </p>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed">
                  Most struggled with the same critical issues—poor Core Web Vitals scores, missing structured data, inefficient URL architectures, and content that doesn't align with US search behavior and commercial intent.
                </p>
              </div>

              {/* Problems vs Solutions Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Problems Column */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-200/30 rounded-full blur-2xl"></div>
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100 relative z-10 h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Common Problems</h3>
                    </div>

                    <p className="text-gray-600 mb-6 font-medium">Issues we've resolved throughout the years:</p>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700">Sites loading in <strong>5+ seconds</strong> on desktop and mobile connections (Google penalizes anything over 2.5 seconds)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700">Visually impressive designs that <strong>search engine crawlers can't properly index</strong> or understand</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700"><strong>Inadequate local SEO</strong> optimization for US cities, states, and "near me" searches</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700">Missing <strong>Core Web Vitals</strong> optimization critical for US mobile and desktop users</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700">Content targeting <strong>generic keywords</strong> instead of US-specific search intent and buyer behavior</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Solutions Column */}
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200/30 rounded-full blur-2xl"></div>
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 relative z-10 h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Our Solutions</h3>
                    </div>

                    <p className="text-gray-600 mb-6 font-medium">With SEOShouts' proven decade-plus SEO expertise:</p>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700"><strong>Blazing-fast page speeds</strong> optimized for US broadband and mobile networks</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700"><strong>Comprehensive mobile-first design</strong> tested across iOS and Android devices</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700"><strong>SEO-optimized URL structures</strong> using American English and localized search terminology</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700"><strong>Complete technical SEO foundation</strong> built from over 13 years of proven strategies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700"><strong>Enterprise-grade security, HTTPS</strong> implementation, and US data privacy compliance (CCPA, state regulations)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                  <div>
                    <div className="text-4xl font-bold mb-2">13+</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">150+</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Websites Built</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">SEO-First Approach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Continued in next part due to length */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  Complete SEO Website Development Services
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  Transparent pricing with expert SEO integrated into every package
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Package 1 */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-blue-600 hover:shadow-xl transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">SEO Optimized Static Website</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">$100</div>
                    <p className="text-gray-600 text-sm"><strong>Perfect for:</strong> Startups, solopreneurs, consultants, and small business owners requiring a results-driven online presence.</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-4">What extensive SEO experience delivers for your static site:</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Up to 4-5 custom-designed pages with <strong>proven SEO architecture</strong></span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Google Core Web Vitals optimization (tested across US device ecosystems)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span><strong>SEO-friendly web development</strong> using strategies refined through years of testing</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Mobile-first responsive design optimized for American user behavior patterns</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Secure HTTPS/SSL implementation with US-based hosting optimization</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Schema markup for enhanced Google SERP visibility and rich snippets</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Google Search Console and Analytics 4 setup</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Image and code optimization for maximum performance across all devices</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>30 days post-launch support with <strong>expert SEO guidance</strong></span>
                    </li>
                  </ul>
                  <a href="/contact/?region=usa" className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Get Started
                  </a>
                </div>

                {/* Package 2 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-600 p-8 shadow-xl relative transform scale-105">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">SEO Optimized Website with Backend</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">$250</div>
                    <p className="text-gray-700 text-sm"><strong>Ideal for:</strong> Growing companies, service providers, and professionals requiring content management capabilities with <strong>enterprise-level SEO infrastructure</strong>.</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-4">Everything in Static Package, plus advanced SEO capabilities:</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Custom content management system designed with <strong>SEO best practices</strong></span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Blog/news section optimized for US local searches, featured snippets, and "near me" queries</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Strategic internal linking architecture based on <strong>proven link equity distribution strategies</strong></span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Multi-user access management with SEO workflow integration for US teams</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Advanced security protocols, spam prevention, and US privacy law compliance</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Built-in analytics dashboard tracking <strong>conversion-focused SEO metrics</strong> from extensive client reporting</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>60 days extended support with <strong>ongoing strategic SEO guidance</strong></span>
                    </li>
                  </ul>
                  <a href="/contact/?region=usa" className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Get Started
                  </a>
                </div>

                {/* Package 3 */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-blue-600 hover:shadow-xl transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">SEO Optimized eCommerce Website</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">$500</div>
                    <p className="text-gray-600 text-sm"><strong>Best for:</strong> US eCommerce brands, direct-to-consumer companies, retail businesses, and online merchants ready to dominate their market.</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-4">Complete eCommerce solution with conversion-optimized SEO:</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>All features from previous packages with <strong>enterprise-grade eCommerce SEO implementation</strong></span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Custom-built online store with <strong>conversion rate optimization strategies</strong> proven across US markets</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Product catalog with SEO-optimized descriptions targeting American consumer behavior</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Secure cart and checkout with major US payment gateways (Stripe, PayPal, Apple Pay, Google Pay)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span><strong>Advanced product schema markup</strong> for Google Shopping and merchant center visibility (techniques perfected over years)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Inventory management optimized for American shopping patterns (Black Friday, Cyber Monday, holiday seasons)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>90 days premium support including <strong>ongoing SEO optimization</strong> and quarterly performance reviews</span>
                    </li>
                  </ul>
                  <a href="/contact/?region=usa" className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Get Started
                  </a>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600">
                  <strong>Note:</strong> All prices are transparently listed with no hidden fees. Professional invoicing provided for business accounting and tax purposes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Development Process Timeline Section */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                Our Proven SEO Website Development Process for USA Businesses
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                Refined over 13+ years of delivering results for American businesses
              </p>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">
                Every phase leverages our extensive SEO expertise to ensure your website dominates US search results from launch day.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Vertical Timeline */}
              <div className="relative">
                {/* Timeline Line - Hidden on mobile, visible on desktop */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 transform -translate-x-1/2"></div>

                {/* Phase 1 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center mb-16">
                  {/* Content - Left */}
                  <div className="lg:text-right lg:pr-12">
                    <div className="inline-block lg:float-right bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex lg:flex-row-reverse items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          1
                        </div>
                        <div className="lg:text-right">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Strategic Foundation</h3>
                          <p className="text-sm text-blue-600 font-semibold">Built on Years of US Market Experience</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Our approach begins with comprehensive research for the USA market:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🎯</span>
                          <p className="text-gray-700 lg:text-right"><strong>Comprehensive competitor analysis</strong> using advanced SEO tools for US markets</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🔍</span>
                          <p className="text-gray-700 lg:text-right"><strong>USA keyword research</strong> incorporating American search behavior and local intent</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🏗️</span>
                          <p className="text-gray-700 lg:text-right"><strong>Site architecture planning</strong> using proven principles from 13+ years</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Icon - Right */}
                  <div className="hidden lg:flex lg:pl-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">📊</span>
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center mb-16">
                  {/* Icon - Left */}
                  <div className="hidden lg:flex lg:justify-end lg:pr-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">💻</span>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content - Right */}
                  <div className="lg:pl-12">
                    <div className="inline-block bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          2
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Expert Development</h3>
                          <p className="text-sm text-blue-600 font-semibold">Implementation</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Where our <strong>SEO website developer</strong> expertise converges:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">⚙️</span>
                          <p className="text-gray-700"><strong>Standards-compliant coding</strong> with SEO considerations for US markets</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🗄️</span>
                          <p className="text-gray-700"><strong>Custom database design</strong> optimized for speed and American user patterns</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">📱</span>
                          <p className="text-gray-700"><strong>Mobile-first responsive design</strong> tested across iOS and Android devices</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center mb-16">
                  {/* Content - Left */}
                  <div className="lg:text-right lg:pr-12">
                    <div className="inline-block lg:float-right bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex lg:flex-row-reverse items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          3
                        </div>
                        <div className="lg:text-right">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Content & SEO Integration</h3>
                          <p className="text-sm text-blue-600 font-semibold">Expertise Applied</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Our SEO specialists ensure ranking success in USA:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">✍️</span>
                          <p className="text-gray-700 lg:text-right"><strong>SEO-optimized content creation</strong> using proven methodologies for American audiences</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🏷️</span>
                          <p className="text-gray-700 lg:text-right"><strong>Meta tag optimization</strong> based on US CTR patterns</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">📍</span>
                          <p className="text-gray-700 lg:text-right"><strong>Local SEO implementation</strong> with "near me" strategies for US cities and states</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Icon - Right */}
                  <div className="hidden lg:flex lg:pl-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">📝</span>
                    </div>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center mb-16">
                  {/* Icon - Left */}
                  <div className="hidden lg:flex lg:justify-end lg:pr-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">✅</span>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content - Right */}
                  <div className="lg:pl-12">
                    <div className="inline-block bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          4
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Quality Assurance</h3>
                          <p className="text-sm text-blue-600 font-semibold">Testing Protocols</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Rigorous testing ensures flawless <strong>SEO friendly web development</strong>:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🧪</span>
                          <p className="text-gray-700"><strong>Cross-device compatibility</strong> testing across US mobile and desktop ecosystems</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">⚡</span>
                          <p className="text-gray-700"><strong>Core Web Vitals optimization</strong> using proven techniques for US networks</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🔒</span>
                          <p className="text-gray-700"><strong>Security vulnerability scanning</strong> and CCPA/US privacy compliance checks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 5 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Content - Left */}
                  <div className="lg:text-right lg:pr-12">
                    <div className="inline-block lg:float-right bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex lg:flex-row-reverse items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          5
                        </div>
                        <div className="lg:text-right">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Launch & Optimization</h3>
                          <p className="text-sm text-blue-100 font-semibold">Lifetime SEO Partnership</p>
                        </div>
                      </div>

                      <p className="text-blue-50 mb-4 text-sm leading-relaxed">Your <strong>website development and SEO</strong> journey continues:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">🚀</span>
                          <p className="text-white lg:text-right"><strong>Strategic launch monitoring</strong> with expert protocols for US markets</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">📈</span>
                          <p className="text-white lg:text-right"><strong>Performance tracking setup</strong> with metrics that matter for American businesses</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">🔄</span>
                          <p className="text-white lg:text-right"><strong>Continuous optimization</strong> adapted to Google updates and US market trends</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Icon - Right */}
                  <div className="hidden lg:flex lg:pl-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">🎯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* On-Page SEO Checklist Section */}
        <section className="relative py-16 sm:py-24 bg-gray-50 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-20 right-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                Our On-Page SEO Perfection Checklist
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                Every website we build comes with the full suite of technical and SEO on-page factors set up as standard.
              </p>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">
                These aren't add-ons—this is what genuine SEO website development means for your American business.
              </p>
            </div>

            {/* Grid Layout for Checklist Items */}
            <div className="max-w-7xl mx-auto">
              {/* Category: Technical SEO */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Technical SEO Foundation</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Title Tag</h4>
                        <p className="text-sm text-gray-600">Main headline for Google; includes your core business keyword for high CTR in US searches</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Meta Description</h4>
                        <p className="text-sm text-gray-600">Brief summary underneath your title in search results—makes American users want to click</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Canonical Tag</h4>
                        <p className="text-sm text-gray-600">Tells Google which version of the page is primary; avoids duplicate content issues</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Hreflang Tag</h4>
                        <p className="text-sm text-gray-600">Ensures Google shows the right page to the right region/language across US states</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">5</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">URL Structure</h4>
                        <p className="text-sm text-gray-600">Clean, readable addresses with keywords using American English (e.g., /seo-services-usa)</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">6</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Heading Tags (H1-H6)</h4>
                        <p className="text-sm text-gray-600">Logical sections and subheadings, including your target keywords for US market</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">7</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">HTML5 Semantic Tags</h4>
                        <p className="text-sm text-gray-600">Modern coding structure that helps Google understand your pages better</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">8</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Robots Meta Tags</h4>
                        <p className="text-sm text-gray-600">Instructions for Google on what to index/show; crucial for SEO hygiene</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category: Content & Keywords */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Content & Keywords Optimization</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">9</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Content Quality</h4>
                        <p className="text-sm text-gray-600">Original, detailed, and helpful information tailored for your American audience</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">10</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Keyword Optimization</h4>
                        <p className="text-sm text-gray-600">Primary and related keywords naturally worked into text without stuffing, using American English</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">11</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Internal Linking</h4>
                        <p className="text-sm text-gray-600">Links between your site's own pages for better navigation and ranking distribution</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">12</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Schema Markup</h4>
                        <p className="text-sm text-gray-600">Structured data that helps Google display stars, products, FAQs and business info</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category: Images & Media */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Images & Media Optimization</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">13</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Image Optimization</h4>
                        <p className="text-sm text-gray-600">Compressed, mobile-friendly images with descriptive filenames optimized for US networks</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">14</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Alt Text for Images</h4>
                        <p className="text-sm text-gray-600">Every image described for search engine crawlers and accessibility compliance</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">15</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Favicon</h4>
                        <p className="text-sm text-gray-600">Your mini logo in browser tabs/bookmarks for professional branding and recognition</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category: Performance & UX */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Performance & User Experience</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">16</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Page Speed / Core Web Vitals</h4>
                        <p className="text-sm text-gray-600">Loads fast on US networks (Verizon, AT&T, T-Mobile), optimized for Google's benchmarks</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">17</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Mobile Responsiveness</h4>
                        <p className="text-sm text-gray-600">Perfect usability and display on iPhone, Samsung, and all US mobile devices</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">18</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Structured Navigation</h4>
                        <p className="text-sm text-gray-600">Simple menus so anyone can find services/products easily on your site</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">19</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Breadcrumbs / Markup</h4>
                        <p className="text-sm text-gray-600">Shows user 'path' for navigation and helps Google understand your site structure</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">20</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Pagination Tags</h4>
                        <p className="text-sm text-gray-600">Makes long lists/blogs easier for users and Google crawlers to navigate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category: Security & Social */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Security & Social Integration</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">21</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">HTTPS Security</h4>
                        <p className="text-sm text-gray-600">SSL-enabled "lock" for trust, safety, and data protection with US compliance</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">22</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Sitemap.xml & robots.txt</h4>
                        <p className="text-sm text-gray-600">Essential files for Google's bots—ensures all your pages get discovered and indexed</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">23</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Open Graph Tags</h4>
                        <p className="text-sm text-gray-600">Optimizes your website's previews when shared via Facebook, LinkedIn, and other platforms</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">24</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Twitter Card Tags</h4>
                        <p className="text-sm text-gray-600">Customizes display for links shared across Twitter/X for better engagement</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">25</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Social Sharing Buttons</h4>
                        <p className="text-sm text-gray-600">Let users easily share your business to social media platforms and messaging apps</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">26</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Engagement CTAs</h4>
                        <p className="text-sm text-gray-600">Direct actions: Call, Email, Contact forms—optimized for American user conversions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl text-center">
                <p className="text-white text-lg leading-relaxed">
                  <strong>Every item above is handled for you</strong>, explained in plain language, and documented in your project report. That's why American businesses, startups, and US market leaders trust our developer-led SEO approach with over 13 years of proven expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Client Success Stories</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real results from real businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* AGP Nature Villa */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">🏡</span>
                  </div>
                  <a href="https://pagespeed.web.dev/analysis/https-agpnaturevilla-com/wn1w46uas0?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    Check Score →
                  </a>
                </div>
                <h3 className="text-2xl font-bold mb-3">AGP Nature Villa</h3>
                <p className="text-gray-600 mb-6">Successfully developed and optimized with proven SEO strategies for the real estate market.</p>

                {/* Core Web Vitals Scores */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Core Web Vitals Score</h4>

                  {/* Mobile Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">📱 Mobile</span>
                      <span className="text-lg font-bold text-green-600">86</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '86%'}}></div>
                    </div>
                  </div>

                  {/* Desktop Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">💻 Desktop</span>
                      <span className="text-lg font-bold text-green-600">96</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '96%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calcshark */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <a href="https://pagespeed.web.dev/analysis/https-calcshark-com/spkdcuvhgh?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    Check Score →
                  </a>
                </div>
                <h3 className="text-2xl font-bold mb-3">Calcshark</h3>
                <p className="text-gray-600 mb-6">Built with enterprise-grade SEO architecture to dominate their industry niche.</p>

                {/* Core Web Vitals Scores */}
                <div className="bg-white rounded-xl p-4 border border-blue-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Core Web Vitals Score</h4>

                  {/* Mobile Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">📱 Mobile</span>
                      <span className="text-lg font-bold text-green-600">97</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '97%'}}></div>
                    </div>
                  </div>

                  {/* Desktop Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">💻 Desktop</span>
                      <span className="text-lg font-bold text-green-600">100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEOShouts */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">🚀</span>
                  </div>
                  <a href="https://pagespeed.web.dev/analysis/https-seoshouts-com-services-ecommerce-seo/0c2nuniv9k?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    Check Score →
                  </a>
                </div>
                <h3 className="text-2xl font-bold mb-3">SEOShouts</h3>
                <p className="text-gray-600 mb-6">Our own website showcases SEO expertise, ranking for competitive keywords.</p>

                {/* Core Web Vitals Scores */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Core Web Vitals Score</h4>

                  {/* Mobile Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">📱 Mobile</span>
                      <span className="text-lg font-bold text-green-600">94</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '94%'}}></div>
                    </div>
                  </div>

                  {/* Desktop Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">💻 Desktop</span>
                      <span className="text-lg font-bold text-green-600">100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">SEOShouts vs. Typical Agency Comparison</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See why 13+ years of SEO experience matters for American businesses
              </p>
            </div>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <table className="w-full">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-4 text-left font-bold">Feature</th>
                      <th className="px-4 py-4 text-left font-bold">SEOShouts</th>
                      <th className="px-4 py-4 text-left font-bold">Typical US Agency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">SEO Experience</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">13+ years proven track record</td>
                      <td className="px-4 py-3 text-gray-600">Often 1-3 years, no portfolio</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Developer Leadership</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Coding + SEO expertise combined</td>
                      <td className="px-4 py-3 text-gray-600">Designers with basic SEO knowledge</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Algorithm Updates</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Survived and thrived through 13+ years of changes</td>
                      <td className="px-4 py-3 text-gray-600">Struggle with each update</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">USA Market Knowledge</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Deep local expertise from years of US practice</td>
                      <td className="px-4 py-3 text-gray-600">Generic global strategies</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Custom Development</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">100% custom, no platform limitations</td>
                      <td className="px-4 py-3 text-gray-600">Template-based WordPress/Wix with plugins</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Pricing Transparency</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Clear pricing with no surprises</td>
                      <td className="px-4 py-3 text-gray-600">Hidden costs and monthly fees</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Long-term Support</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Ongoing partnership based on proven relationships</td>
                      <td className="px-4 py-3 text-gray-600">Project-based, limited follow-up</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Results Guarantee</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Confident predictions based on 13+ years of data</td>
                      <td className="px-4 py-3 text-gray-600">Vague promises without backing</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Training & Knowledge Transfer</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Expert guidance from proven methodologies</td>
                      <td className="px-4 py-3 text-gray-600">Basic tutorials, limited expertise</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Choose SEOShouts Web Development Expertise Over Generic Agencies?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                13+ years of proven results for American businesses
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Unmatched Technical Authority */}
                <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Unmatched Technical and SEO Authority</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Coding</strong> foundation combined with <strong>over 13 years of hands-on SEO experience</strong> in US markets</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No platform dependencies</strong> – 100% custom solutions without licensing fees or template limitations</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>American market specialization</strong> developed through <strong>years of US client success stories</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Algorithm update experience</strong> – we've successfully navigated every major Google change over 13+ years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Direct communication</strong> with <strong>expert-level technical guidance</strong> tailored for US businesses</span></li>
                  </ul>
                </div>

                {/* Proven Track Record */}
                <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Proven Track Record</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Hundreds of successful websites</strong> launched and optimized for businesses across the United States</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Consistent ranking improvements</strong> achieved through algorithm updates and market changes over 13+ years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Long-term client relationships</strong> built on <strong>sustained SEO performance</strong> over years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Industry expertise</strong> across multiple US verticals gained through years of diverse projects</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Documented success stories</strong> showing <strong>measurable ROI</strong> from SEO website development investments</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Development Advantages Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Custom Development Advantages for American Businesses</h2>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Complete Control */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Complete Control & Flexibility</h3>
                <ul className="space-y-3">
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No platform limitations</strong> or feature restrictions that hurt SEO</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Unlimited customization</strong> possibilities based on your business needs</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No monthly licensing fees</strong> or subscription costs (only domain and hosting if needed)</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Full ownership</strong> of code and functionality</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Custom integrations</strong> with American business tools (QuickBooks, Stripe, US payment gateways)</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Scalable architecture</strong> that adapts to business growth and seasonal demands</span></li>
                </ul>
              </div>

              {/* Superior Performance */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Superior Performance for US Networks</h3>
                <ul className="space-y-3">
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Optimized codebase</strong> without bloated plugins that slow US connections</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Faster loading times</strong> through efficient coding and US CDN integration</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Better security</strong> with custom-built protection against common threats</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Unique functionality</strong> that competitors using templates can't replicate</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Direct database optimization</strong> for complex queries and high-traffic periods</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Comprehensive SEO Website Development Related FAQs</h2>
                <p className="text-lg text-gray-600">
                  Common questions about our SEO website development services
                </p>
              </div>
              <FaqAccordion faqs={faqItems} />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Leverage SEO Expertise for Your American Business?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Don't waste time and money on agencies that promise the world but can't deliver proven results. Partner with <strong>demonstrated SEO expertise</strong> and watch your American business dominate local and national search results.
              </p>

              <div className="flex justify-center mb-8">
                <a
                  href="/contact/?region=usa"
                  className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                  aria-label="Get website development quote from SEOShouts"
                >
                  🎯 Get Your Expert SEO Consultation
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              <div className="text-center">
                <p className="text-white font-bold text-xl mb-4">
                  SEOShouts: Proven SEO Success for American Businesses
                </p>
                <p className="text-white/80 italic">
                  Where experience meets expertise. Where results speak louder than promises.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
