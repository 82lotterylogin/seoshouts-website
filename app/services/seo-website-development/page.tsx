import type { Metadata } from 'next'
import FaqAccordion, { type FaqItem } from './FaqAccordion'

export const metadata: Metadata = {
  title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
  description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in India. Professional SEO website development services for Indian businesses.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-website-development',
  },
  openGraph: {
    title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in India. Professional SEO website development services.',
    url: 'https://seoshouts.com/services/seo-website-development',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-website-development-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Website Development Services India by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in India.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/seo-website-development-twitter-image.jpg'],
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
      "SEO website development ensures that SEO is integrated directly into the website's structure, content, and design from the very beginning. Unlike regular websites, which may need SEO optimization later, an SEO-developed website is built to rank from day one, with optimized URL structures, mobile-first design, fast load times, and SEO-friendly coding practices.",
  },
  {
    question: 'Will you help optimize my website for mobile users?',
    answer:
      "Yes! All our websites are designed with mobile-first in mind. With a majority of internet traffic coming from mobile devices, we ensure that your website is responsive, loads quickly, and provides an optimal experience across all screen sizes and devices.",
  },
  {
    question: 'How do you ensure that my website ranks well on Google?',
    answer:
      "Our SEO website development process includes optimizing your site for critical SEO factors like page speed, core web vitals, structured data (schema markup), and internal linking. We also ensure your content is optimized for both user intent and Google's algorithms to help you rank higher for relevant search queries.",
  },
  {
    question: 'Will the website be optimized for local SEO and location-based searches?',
    answer:
      'Absolutely. We focus on local SEO optimization, which is crucial for businesses targeting customers in specific geographic locations. From integrating location-based keywords to optimizing your Google My Business profile and creating location-specific landing pages, we ensure that your website ranks well for relevant local searches.',
  },
  {
    question: 'How long does it take to develop an SEO-optimized website?',
    answer:
      "The development timeline depends on the complexity of your website, but typically, it takes about 4-6 weeks for a fully SEO-optimized website to be completed. This includes stages like research, design, development, content optimization, and testing. We'll keep you updated throughout the process to ensure the website aligns with your business goals.",
  },
  {
    question: 'Do you also handle the technical aspects of SEO for my website?',
    answer:
      "Yes, technical SEO is a crucial part of the SEO website development process. We focus on optimizing the back-end structure of your website, ensuring that it's crawlable, fast-loading, secure (with HTTPS), and follows best practices for technical SEO. This includes creating an XML sitemap, optimizing robots.txt, and setting up structured data to help search engines understand your website better.",
  },
  {
    question: 'How do you ensure that my website is fast and optimized for performance?',
    answer:
      'Website speed is crucial for SEO and user experience. We use a combination of image compression, code minification, caching strategies, and CDN integration to ensure your website loads quickly. Additionally, we optimize your website for Core Web Vitals, which is an important ranking factor for Google.',
  },
  {
    question: 'Will you provide support after my website is developed?',
    answer:
      "Yes! We provide post-launch support to ensure your website continues to perform well. This includes monitoring SEO performance, troubleshooting any issues, and offering guidance on how to update or add new content to maintain your rankings.",
  },
  {
    question: 'Do you provide content for the website, or should I supply it?',
    answer:
      'We can assist with SEO-optimized content creation, including writing compelling copy with targeted keywords, meta descriptions, and headlines. However, if you already have content, we can work with your existing material to optimize it for both SEO and user engagement.',
  },
  {
    question: 'Will my website be built with future SEO updates in mind?',
    answer:
      "Absolutely. We build websites with scalability and future-proofing in mind, ensuring they remain optimized even as SEO trends and Google algorithms evolve. Whether it's adopting new SEO techniques or preparing for major algorithm changes, your website will be ready for the future.",
  },
]

export default function SEOWebsiteDevelopmentServicePage() {
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
                "name": "SEO Website Development",
                "item": "https://seoshouts.com/services/seo-website-development"
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
            "name": "SEO Website Development Services India",
            "description": "Professional SEO website development services including mobile-first design, performance optimization, eCommerce development, and conversion-focused builds for Indian businesses.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "serviceType": "SEO Website Development Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Website Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO-Optimized Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "eCommerce Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile-First Responsive Design"
                  }
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

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 py-6 sm:py-10 lg:py-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">Expert Developer-Led Team | Over 13 Years of SEO Expertise in India</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-blue-600 bg-clip-text text-transparent">
                  SEO Website Development Services India – Build Websites That Rank and Convert
                </span>
              </h1>

              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 mb-8 text-left max-w-5xl mx-auto">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Are you frustrated by <strong>websites that look beautiful but never get found on Google India</strong>?
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Looking for genuine <strong>SEO website development</strong> that delivers measurable results for your Indian business?
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At SEOShouts, you don't just get a web developer—you work directly with an experienced SEO expert who brings <strong>over 13 years of proven SEO expertise</strong> specifically for Indian and global markets.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Unlike typical agencies that design first and worry about SEO later, our <strong>over a decade of hands-on SEO experience</strong> has taught us to build search optimisation into every line of code from Day 1.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We've witnessed Google's evolution, weathered algorithm updates, and consistently delivered ranking websites that drive real business growth across India.
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
                  Get Your FREE SEO Website Audit Worth ₹5,000
                </h3>
                <p className="text-blue-50 text-base lg:text-lg mb-2">
                  Discover exactly what's holding your website back from ranking on Google India
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
                  href="/contact/"
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
                    href="tel:+918094888157"
                    className="group px-4 py-3 bg-green-500 rounded-xl text-white font-bold text-center hover:bg-green-600 transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex flex-col items-center gap-0.5">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      <span className="text-xs">CALL NOW</span>
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
                  What Sets Our SEO Website Development Apart in India?
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Over <strong>a decade of SEO practice</strong>, we've analysed and rebuilt hundreds of Indian business websites.
                </p>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed">
                  Most were held back by the same recurring issues—slow loading on Indian mobile networks, missing schema markup, poor URL structures, and content that doesn't match Indian search behaviour.
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
                        <span className="text-2xl">❌</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-red-700">Common Problems</h3>
                    </div>

                    <p className="text-sm font-semibold text-red-600 mb-6 uppercase tracking-wide">Issues we've solved over the years:</p>

                    <div className="space-y-5">
                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Sites taking <strong className="text-red-700">12+ seconds</strong> to load on Jio/Airtel networks <span className="text-red-600">(Google gives up after 3 seconds)</span></p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Beautiful designs that <strong className="text-red-700">Google's bots can't understand</strong> or crawl properly</p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-red-700">Zero local SEO</strong> optimisation for Indian cities and "near me" searches</p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Missing <strong className="text-red-700">Core Web Vitals</strong> optimisation for Indian smartphone users</p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Content written for <strong className="text-red-700">global audiences</strong>, not Indian search intent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solutions Column */}
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-xl border border-blue-200 relative z-10 h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">✅</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-blue-700">Our Solutions</h3>
                    </div>

                    <p className="text-sm font-semibold text-blue-600 mb-6 uppercase tracking-wide">With SEOShouts' over a decade of SEO expertise:</p>

                    <div className="space-y-5">
                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">⚡</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Lightning-fast loading</strong> optimised for Indian 4G/5G networks</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">📱</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Fully mobile-first design</strong> tested on popular Indian smartphone brands</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">🔗</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Clean, SEO-ready URLs</strong> using Indian English and local search terms</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">🎯</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Complete technical SEO foundation</strong> built from over a decade of proven strategies</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">🔒</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Robust security, HTTPS</strong> implementation, and Indian privacy compliance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
                  <div className="border-b md:border-b-0 md:border-r border-blue-400/30 pb-6 md:pb-0">
                    <div className="text-4xl font-bold mb-2">10+</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="border-b md:border-b-0 md:border-r border-blue-400/30 pb-6 md:pb-0">
                    <div className="text-4xl font-bold mb-2">100+</div>
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

        {/* Service Packages Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Complete SEO Website Development Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transparent pricing with expert SEO built into every package
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Static Website Package */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-blue-600">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📄</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">SEO Optimised Static Website</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">₹8,500</div>
                <p className="text-gray-600 mb-6 text-sm"><strong>Perfect for:</strong> Startups, solo entrepreneurs, consultants, and small business owners needing a results-driven web presence.</p>

                <p className="text-sm font-semibold text-gray-700 mb-4">What long-term SEO experience brings to your static site:</p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Up to 5 custom-designed pages with <strong>proven SEO architecture</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Google Core Web Vitals optimisation (tested across Indian devices and networks)</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600"><strong>SEO-friendly web development</strong> using strategies refined over years</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Mobile-first responsive design optimised for Indian smartphone usage patterns</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Secure HTTPS/SSL implementation with Indian hosting considerations</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Schema markup for better Google India snippet visibility</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">XML sitemap and robots.txt optimisation based on <strong>years of crawl data analysis</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Google Search Console setup with Indian market focus</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Image and code optimisation for budget smartphones popular in India</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">30 days post-launch support with <strong>expert SEO guidance</strong></span></li>
                </ul>

                <a
                  href="/contact/"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                  aria-label="Get static website quote"
                >
                  Get Started
                </a>
              </div>

              {/* Backend Website Package */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-600">
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">💼</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">SEO Optimised Website with Backend</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">₹21,000</div>
                <p className="text-gray-600 mb-6 text-sm"><strong>Ideal for:</strong> Growing companies, service providers, and professionals who need content management capabilities with <strong>enterprise-level SEO</strong>.</p>

                <p className="text-sm font-semibold text-gray-700 mb-4">Everything in Static Package, plus advanced SEO features:</p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Custom content management system designed with <strong>SEO best practices from over a decade</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Blog/news section optimised for Indian local searches and "near me" queries</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Advanced internal linking architecture based on <strong>long-term link equity strategies</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">User access management for Indian teams with SEO workflow integration</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Database optimisation techniques refined through <strong>years of performance testing</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Advanced security, anti-spam features, and Indian privacy compliance</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Built-in analytics dashboard showing <strong>SEO metrics that matter</strong> from long-term client reporting</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600"><strong>Expert SEO training</strong> for your team based on proven methodologies</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">60 days extended support with <strong>ongoing SEO guidance</strong></span></li>
                </ul>

                <a
                  href="/contact/"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                  aria-label="Get backend website quote"
                >
                  Get Started
                </a>
              </div>

              {/* eCommerce Package */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-blue-600">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🛒</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">SEO Optimised eCommerce Website</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">₹42,000</div>
                <p className="text-gray-600 mb-6 text-sm"><strong>Best for:</strong> Indian eCommerce brands, D2C companies, retail stores, and exporters ready to dominate online sales.</p>

                <p className="text-sm font-semibold text-gray-700 mb-4">Complete eCommerce solution with conversion-focused SEO:</p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">All features from previous packages with <strong>enterprise-grade SEO implementation</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Custom-built online store with <strong>conversion optimisation strategies</strong> proven over the years</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Product catalogue with SEO-optimised descriptions targeting Indian buyer behaviour</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Secure cart and checkout with Indian payment gateways (UPI, Paytm, net banking)</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600"><strong>Advanced product schema</strong> for Google Shopping visibility (techniques refined over years of eCommerce SEO)</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Category and product page SEO using <strong>long-tail keyword strategies</strong> from extensive research</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Inventory management optimised for Indian seasonal shopping patterns (Diwali, festivals)</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600"><strong>Conversion tracking and analytics</strong> based on proven eCommerce SEO methodologies</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">90 days premium support including <strong>ongoing SEO optimisation</strong> and performance reviews</span></li>
                </ul>

                <a
                  href="/contact/"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                  aria-label="Get eCommerce website quote"
                >
                  Get Started
                </a>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600"><strong>Note:</strong> All prices are clearly mentioned with no hidden costs. Proper invoicing provided for your business records.</p>
            </div>
          </div>
        </section>

        {/* Development Process Section */}
        <section className="relative py-16 sm:py-24 bg-white overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                Our Proven SEO Website Development Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
                Refined Over the Years
              </p>
              <p className="text-base text-gray-500 max-w-2xl mx-auto">
                A transparent, step-by-step process that puts your business goals first
              </p>
            </div>

            {/* Timeline Container */}
            <div className="max-w-6xl mx-auto relative">
              {/* Vertical Timeline Line - Hidden on mobile, visible on lg */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200"></div>

              <div className="space-y-16">
                {/* Phase 1 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Content - Left */}
                  <div className="lg:text-right lg:pr-12">
                    <div className="inline-block lg:float-right bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex lg:flex-row-reverse items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          1
                        </div>
                        <div className="lg:text-right">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Strategic Foundation</h3>
                          <p className="text-sm text-blue-600 font-semibold">Built on Years of Experience</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Our <strong>seo development company</strong> approach begins with comprehensive research:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🎯</span>
                          <p className="text-gray-700 lg:text-right"><strong>Comprehensive competitor analysis</strong> using advanced SEO tools</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🔍</span>
                          <p className="text-gray-700 lg:text-right"><strong>Local keyword research</strong> incorporating Hindi/vernacular trends</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🏗️</span>
                          <p className="text-gray-700 lg:text-right"><strong>Site architecture planning</strong> using proven principles</p>
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
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
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

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Where our <strong>seo website developer</strong> expertise converges:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">⚙️</span>
                          <p className="text-gray-700"><strong>Standards-compliant coding</strong> with SEO considerations</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🗄️</span>
                          <p className="text-gray-700"><strong>Custom database design</strong> optimised for speed</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">📱</span>
                          <p className="text-gray-700"><strong>Mobile-first responsive design</strong> tested across devices</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
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

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Our <strong>web dev seo</strong> specialists ensure ranking success:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">✍️</span>
                          <p className="text-gray-700 lg:text-right"><strong>SEO-optimised content creation</strong> using proven methodologies</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🏷️</span>
                          <p className="text-gray-700 lg:text-right"><strong>Meta tag optimisation</strong> based on CTR patterns</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">📍</span>
                          <p className="text-gray-700 lg:text-right"><strong>Local SEO implementation</strong> with "near me" strategies</p>
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
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
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

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Rigorous testing ensures flawless <strong>seo friendly web development</strong>:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🧪</span>
                          <p className="text-gray-700"><strong>Cross-device compatibility</strong> testing across Indian devices</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">⚡</span>
                          <p className="text-gray-700"><strong>Core Web Vitals optimisation</strong> using proven techniques</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🔒</span>
                          <p className="text-gray-700"><strong>Security vulnerability scanning</strong> and compliance checks</p>
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
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Launch & Optimisation</h3>
                          <p className="text-sm text-blue-100 font-semibold">Lifetime SEO Partnership</p>
                        </div>
                      </div>

                      <p className="text-blue-50 mb-4 text-sm leading-relaxed">Your <strong>website development and seo</strong> journey continues:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">🚀</span>
                          <p className="text-white lg:text-right"><strong>Strategic launch monitoring</strong> with expert protocols</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">📈</span>
                          <p className="text-white lg:text-right"><strong>Performance tracking setup</strong> with metrics that matter</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">🔄</span>
                          <p className="text-white lg:text-right"><strong>Continuous optimisation</strong> adapted to Google updates</p>
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
                These aren't add-ons—this is what genuine SEO website development means for your Indian business.
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
                        <p className="text-sm text-gray-600">Main headline for Google; includes your core business keyword for high CTR</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Meta Description</h4>
                        <p className="text-sm text-gray-600">Brief summary underneath your title in search results—makes users want to click</p>
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
                        <p className="text-sm text-gray-600">Ensures Google shows the right page to the right region/language</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">5</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">URL Structure</h4>
                        <p className="text-sm text-gray-600">Clean, readable addresses with keywords (e.g., /seo-services-india)</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">6</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Heading Tags (H1-H6)</h4>
                        <p className="text-sm text-gray-600">Logical sections and subheadings, including your target keywords</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">7</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">HTML5 Semantic Tags</h4>
                        <p className="text-sm text-gray-600">Modern coding structure that helps Google understand your pages</p>
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
                  <h3 className="text-2xl font-bold text-gray-900">Content & Keywords Optimisation</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">9</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Content Quality</h4>
                        <p className="text-sm text-gray-600">Original, detailed, and helpful information tailored for your Indian audience</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">10</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Keyword Optimisation</h4>
                        <p className="text-sm text-gray-600">Primary and related keywords naturally worked into text without stuffing</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">11</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Internal Linking</h4>
                        <p className="text-sm text-gray-600">Links between your site's own pages for better navigation and ranking</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">12</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Schema Markup</h4>
                        <p className="text-sm text-gray-600">Hidden code that helps Google display stars, products, FAQs and business info</p>
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
                  <h3 className="text-2xl font-bold text-gray-900">Images & Media Optimisation</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">13</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Image Optimisation</h4>
                        <p className="text-sm text-gray-600">Compressed, mobile-friendly images with descriptive filenames</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">14</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Alt Text for Images</h4>
                        <p className="text-sm text-gray-600">Every image described for search and accessibility</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">15</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Favicon</h4>
                        <p className="text-sm text-gray-600">Your mini logo in browser tabs/bookmarks for professional branding</p>
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
                        <p className="text-sm text-gray-600">Loads fast on Indian networks (Jio, Airtel), optimised for Google benchmarks</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">17</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Mobile Responsiveness</h4>
                        <p className="text-sm text-gray-600">Perfect usability and display on any Indian mobile brand/model</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">18</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Structured Navigation</h4>
                        <p className="text-sm text-gray-600">Simple menus so anyone can find services/products easily</p>
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
                        <p className="text-sm text-gray-600">Makes long lists/blogs easier for users and Google to navigate</p>
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
                        <p className="text-sm text-gray-600">SSL-enabled "lock" for trust, safety, and data protection</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">22</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Sitemap.xml & robots.txt</h4>
                        <p className="text-sm text-gray-600">Invisible files for Google's bots—ensures all your pages get discovered</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">23</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Open Graph Tags</h4>
                        <p className="text-sm text-gray-600">Optimises your website's previews when shared via WhatsApp, Facebook, etc.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">24</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Twitter Card Tags</h4>
                        <p className="text-sm text-gray-600">Customises display for links shared across Twitter/X</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">25</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Social Sharing Buttons</h4>
                        <p className="text-sm text-gray-600">Let users easily share your business to WhatsApp, Facebook, LinkedIn etc.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">26</span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Engagement CTAs</h4>
                        <p className="text-sm text-gray-600">Direct actions: Call, WhatsApp, Contact forms—optimised for conversions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl text-center">
                <p className="text-white text-lg leading-relaxed">
                  <strong>Every item above is handled for you</strong>, explained in plain language, and documented in your project report. That's why local businesses, startups, and Indian market leaders trust our developer-led SEO approach.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Indian Client Success Stories</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real results from real Indian businesses
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
                <p className="text-gray-600 mb-6">Successfully developed and optimized with proven SEO strategies for the Indian real estate market.</p>

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
                <p className="text-gray-600 mb-6">Built with enterprise-grade SEO architecture to dominate their industry niche in Indian markets.</p>

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
                <p className="text-gray-600 mb-6">Our own website showcases SEO expertise, ranking for competitive keywords across India.</p>

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
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">SEOShouts vs. Typical Agency Comparison</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See why experience matters in SEO website development
              </p>
            </div>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-4 text-left font-bold">Feature</th>
                      <th className="px-4 py-4 text-left font-bold">SEOShouts</th>
                      <th className="px-4 py-4 text-left font-bold">Typical Indian Agency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">SEO Experience</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">10+ years proven track record</td>
                      <td className="px-4 py-3 text-gray-600">Often 1-3 years, no portfolio</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Developer Leadership</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Coding + SEO expertise</td>
                      <td className="px-4 py-3 text-gray-600">Designers with basic SEO knowledge</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Algorithm Updates</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Survived and thrived through years of changes</td>
                      <td className="px-4 py-3 text-gray-600">Struggle with each update</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Indian Market Knowledge</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Deep local expertise from years of practice</td>
                      <td className="px-4 py-3 text-gray-600">Generic global strategies</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Custom Development</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">100% custom, no platform limitations</td>
                      <td className="px-4 py-3 text-gray-600">Template-based with SEO plugins</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Pricing Transparency</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Clear pricing</td>
                      <td className="px-4 py-3 text-gray-600">Hidden costs and surprise fees</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Long-term Support</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Ongoing partnership based on proven relationships</td>
                      <td className="px-4 py-3 text-gray-600">Project-based, limited follow-up</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Results Guarantee</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Confident predictions based on long-term data</td>
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
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Choose SEOShouts Web Development Expertise Over Generic Agencies?</h2>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Unmatched Technical Authority */}
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Unmatched Technical and SEO Authority</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Coding</strong> foundation combined with <strong>over a decade of hands-on SEO experience</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No platform dependencies</strong> – 100% custom solutions without licensing fees or template limitations</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Indian market specialisation</strong> developed through <strong>years of local client success stories</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Algorithm update experience</strong> – we've successfully navigated every major Google change over the years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Direct communication</strong> in plain Indian English with <strong>expert-level technical guidance</strong></span></li>
                  </ul>
                </div>

                {/* Proven Track Record */}
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Proven Track Record</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Hundreds of successful websites</strong> launched and optimised for Indian businesses</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Consistent ranking improvements</strong> achieved through algorithm updates and market changes</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Long-term client relationships</strong> built on <strong>sustained SEO performance</strong> over years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Industry expertise</strong> across multiple verticals gained through years of diverse projects</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Documented case studies</strong> showing <strong>measurable ROI</strong> from SEO website development investments</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="relative py-16 sm:py-24 bg-gray-50 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                Advanced SEO Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Mastered Over the Years
              </p>
            </div>

            {/* Feature Cards with Visual Hierarchy */}
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Technical SEO Excellence - Full Width Feature */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 lg:p-12 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-4xl">⚙️</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">Technical SEO Excellence</h3>
                      <p className="text-sm text-blue-600 font-semibold">From Years of Experience</p>
                    </div>
                    <div className="lg:w-3/4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">📋</span>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">JSON-LD Structured Data</h4>
                              <p className="text-sm text-gray-600">Implementation using schemas proven effective over years</p>
                            </div>
                          </div>
                        </div>
                        <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">🗺️</span>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">XML Sitemaps</h4>
                              <p className="text-sm text-gray-600">Priority & frequency settings optimised through years of crawl analysis</p>
                            </div>
                          </div>
                        </div>
                        <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">🤖</span>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">Robots.txt Optimisation</h4>
                              <p className="text-sm text-gray-600">Best practices evolved through years of bot behaviour study</p>
                            </div>
                          </div>
                        </div>
                        <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">🔗</span>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">Canonical URL Management</h4>
                              <p className="text-sm text-gray-600">Techniques refined through duplicate content challenges</p>
                            </div>
                          </div>
                        </div>
                        <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">🌐</span>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">Hreflang Implementation</h4>
                              <p className="text-sm text-gray-600">For multi-language Indian markets based on years of international SEO</p>
                            </div>
                          </div>
                        </div>
                        <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">📱</span>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">Open Graph & Social Media</h4>
                              <p className="text-sm text-gray-600">Strategies developed over years of social integration</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance & UX - Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Performance Optimisation */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Performance Optimisation</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-6">Proven Techniques</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">🖼️</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Image Compression</h4>
                        <p className="text-xs text-gray-600">Next-gen format conversion improving Core Web Vitals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">📦</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">CSS & JavaScript Optimisation</h4>
                        <p className="text-xs text-gray-600">Minification techniques mastered over years</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">💾</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Browser Caching</h4>
                        <p className="text-xs text-gray-600">Cache strategies proven effective across Indian hosting</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">🌍</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">CDN Integration</h4>
                        <p className="text-xs text-gray-600">Optimised for Indian cities based on years of data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">🗄️</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Database Query Optimisation</h4>
                        <p className="text-xs text-gray-600">Techniques from hundreds of custom builds</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">⏳</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Lazy Loading</h4>
                        <p className="text-xs text-gray-600">UX patterns observed over a decade</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Experience */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-3xl">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">User Experience Enhancements</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-6">Conversion-Focused Design</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">🧭</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Intuitive Navigation</h4>
                        <p className="text-xs text-gray-600">Designed for Indian user behaviour patterns</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">🎯</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Call-to-Action Placement</h4>
                        <p className="text-xs text-gray-600">Based on conversion data from years of testing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">📈</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Conversion-Focused Design</h4>
                        <p className="text-xs text-gray-600">Proven effective across Indian markets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">♿</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Accessibility Compliance</h4>
                        <p className="text-xs text-gray-600">WCAG 2.1 AA with SEO considerations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">🌐</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Cross-Browser Compatibility</h4>
                        <p className="text-xs text-gray-600">Tested across popular Indian browsers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <span className="text-xl flex-shrink-0">📲</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">PWA Capabilities</h4>
                        <p className="text-xs text-gray-600">Enhanced mobile experience for Indian users</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
                  <div>
                    <div className="text-3xl font-bold mb-2">18+</div>
                    <div className="text-blue-100 text-sm">Advanced Features Included</div>
                  </div>
                  <div className="border-t sm:border-t-0 sm:border-l border-blue-400/30 pt-6 sm:pt-0">
                    <div className="text-3xl font-bold mb-2">100%</div>
                    <div className="text-blue-100 text-sm">Custom Implementation</div>
                  </div>
                  <div className="border-t sm:border-t-0 sm:border-l border-blue-400/30 pt-6 sm:pt-0">
                    <div className="text-3xl font-bold mb-2">10+</div>
                    <div className="text-blue-100 text-sm">Years Mastering These Features</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Development Advantages Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Custom Development Advantages for Indian Businesses</h2>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Complete Control */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Complete Control & Flexibility</h3>
                <ul className="space-y-3">
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No platform limitations</strong> or feature restrictions that hurt SEO</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Unlimited customisation</strong> possibilities based on your business needs</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No monthly licensing fees</strong> or subscription costs (only hosting)</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Full ownership</strong> of code and functionality</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Custom integrations</strong> with Indian business tools (Tally, GST software, Indian payment gateways)</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Scalable architecture</strong> that adapts to business growth and seasonal demands</span></li>
                </ul>
              </div>

              {/* Superior Performance */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Superior Performance for Indian Networks</h3>
                <ul className="space-y-3">
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Optimised codebase</strong> without bloated plugins that slow Indian connections</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Faster loading times</strong> through efficient coding and Indian CDN integration</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Better security</strong> with custom-built protection against common threats</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Unique functionality</strong> that competitors using templates can't replicate</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Direct database optimisation</strong> for complex queries and high-traffic periods</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Comprehensive SEO Website Development Related FAQs</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Common questions about our SEO website development services
              </p>
            </div>

            <FaqAccordion faqs={faqItems} />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Leverage SEO Expertise for Your Indian Business?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Don't waste time and money on agencies that promise the world but can't deliver proven results. Partner with <strong>demonstrated SEO expertise</strong> and watch your Indian business dominate local and national search results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="/contact/"
                  className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get website development quote from SEOShouts"
                >
                  🎯 Get Your Expert SEO Consultation
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <a
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEOShouts for website development"
                >
                  📞 Call +91 8094888157
                </a>
              </div>

              <div className="text-center">
                <p className="text-white font-bold text-xl mb-4">
                  SEOShouts: Proven SEO Success for Indian Businesses
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
