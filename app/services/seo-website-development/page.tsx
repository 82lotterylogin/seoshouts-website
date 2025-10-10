import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
  description: 'Expert Developer-Led Team | B.Tech Computer Science | 13+ Years\' SEO Expertise in India. Professional SEO website development services for Indian businesses.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-website-development',
  },
  openGraph: {
    title: 'SEO Website Development Services India - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | B.Tech Computer Science | 13+ Years\' SEO Expertise in India. Professional SEO website development services.',
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
    description: 'Expert Developer-Led Team | B.Tech Computer Science | 13+ Years\' SEO Expertise in India.',
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
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Are your prices including GST?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, all our prices are exclusive of applicable GST as per Indian business standards. Registered businesses receive a proper GST invoice for input credit purposes."
                }
              },
              {
                "@type": "Question",
                "name": "How can I trust that your SEO website development will actually work for my Indian business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "With 13+ years' proven SEO expertise, we've successfully launched and optimised hundreds of websites for Indian businesses. Our track record includes surviving multiple Google algorithm updates while maintaining and improving our clients' rankings."
                }
              },
              {
                "@type": "Question",
                "name": "What makes your 13+ years' experience different from other SEO agencies in India?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most agencies offer templated solutions with basic SEO knowledge. Our 13+ years of hands-on experience means we've actually built, tested, and optimised strategies through every major Google update since 2011."
                }
              }
            ]
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
                <span className="text-sm font-medium text-gray-700">💻 Expert Developer-Led Team | B.Tech Computer Science | 13+ Years' SEO Expertise in India</span>
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
                  At SEOShouts, you don't just get a web developer—you work directly with a B.Tech Computer Science professional who brings <strong>over 13 years' proven SEO expertise</strong> specifically for Indian and global markets.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Unlike typical agencies that design first and worry about SEO later, our <strong>13+ years of hands-on SEO experience</strong> has taught us to build search optimisation into every line of code from Day 1.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We've witnessed Google's evolution, weathered algorithm updates, and consistently delivered ranking websites that drive real business growth across India.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact/"
                  className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get SEO website development quote"
                >
                  🚀 Get Your Expert SEO Consultation
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <a
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEO Shouts for website development"
                >
                  📞 Call +91 8094888157
                </a>
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
                  Over <strong>13+ years of SEO practice</strong>, we've analysed and rebuilt hundreds of Indian business websites.
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

                    <p className="text-sm font-semibold text-red-600 mb-6 uppercase tracking-wide">Issues we've solved across 13+ years:</p>

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

                    <p className="text-sm font-semibold text-blue-600 mb-6 uppercase tracking-wide">With SEOShouts' 13+ years' expertise:</p>

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
                    <div className="text-4xl font-bold mb-2">13+</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="border-b md:border-b-0 md:border-r border-blue-400/30 pb-6 md:pb-0">
                    <div className="text-4xl font-bold mb-2">500+</div>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">₹8,500 <span className="text-lg font-normal text-gray-500">+ GST</span></div>
                <p className="text-gray-600 mb-6 text-sm"><strong>Perfect for:</strong> Startups, solo entrepreneurs, consultants, and small business owners needing a results-driven web presence.</p>

                <p className="text-sm font-semibold text-gray-700 mb-4">What 13+ years' SEO experience brings to your static site:</p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Up to 5 custom-designed pages with <strong>proven SEO architecture</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Google Core Web Vitals optimisation (tested across Indian devices and networks)</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600"><strong>SEO-friendly web development</strong> using strategies refined over 13+ years</span></li>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">₹21,000 <span className="text-lg font-normal text-gray-500">+ GST</span></div>
                <p className="text-gray-600 mb-6 text-sm"><strong>Ideal for:</strong> Growing companies, service providers, and professionals who need content management capabilities with <strong>enterprise-level SEO</strong>.</p>

                <p className="text-sm font-semibold text-gray-700 mb-4">Everything in Static Package, plus 13+ years' advanced SEO features:</p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Custom content management system designed with <strong>SEO best practices from over a decade</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Blog/news section optimised for Indian local searches and "near me" queries</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Advanced internal linking architecture based on <strong>13+ years of link equity strategies</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">User access management for Indian teams with SEO workflow integration</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Database optimisation techniques refined through <strong>years of performance testing</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Advanced security, anti-spam features, and Indian privacy compliance</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Built-in analytics dashboard showing <strong>SEO metrics that matter</strong> after 13+ years of client reporting</span></li>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">₹42,000 <span className="text-lg font-normal text-gray-500">+ GST</span></div>
                <p className="text-gray-600 mb-6 text-sm"><strong>Best for:</strong> Indian eCommerce brands, D2C companies, retail stores, and exporters ready to dominate online sales.</p>

                <p className="text-sm font-semibold text-gray-700 mb-4">Complete eCommerce solution with 13+ years' conversion-focused SEO:</p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">All features from previous packages with <strong>enterprise-grade SEO implementation</strong></span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Custom-built online store with <strong>conversion optimisation strategies</strong> proven over 13+ years</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Product catalogue with SEO-optimised descriptions targeting Indian buyer behaviour</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Secure cart and checkout with Indian payment gateways (UPI, Paytm, net banking)</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600"><strong>Advanced product schema</strong> for Google Shopping visibility (techniques refined over years of eCommerce SEO)</span></li>
                  <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span><span className="text-gray-600">Category and product page SEO using <strong>long-tail keyword strategies</strong> from 13+ years of research</span></li>
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
              <p className="text-sm text-gray-600"><strong>Note:</strong> All prices are exclusive of applicable GST. Registered businesses receive a GST invoice for input credit as per Indian tax regulations.</p>
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
                Refined Over 13+ Years
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
                          <p className="text-sm text-blue-600 font-semibold">Built on 13+ Years' Experience</p>
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
                          <p className="text-sm text-blue-600 font-semibold">13+ Years' Expertise Applied</p>
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
                          <p className="text-sm text-blue-600 font-semibold">13+ Years' Testing Protocols</p>
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Indian Client Success Stories (From 13+ Years' Portfolio)</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real results from real Indian businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🏡</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">AGP Nature Villa</h3>
                <p className="text-gray-600">Successfully developed and optimized with proven SEO strategies for the Indian real estate market.</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📊</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Calkshark</h3>
                <p className="text-gray-600">Built with enterprise-grade SEO architecture to dominate their industry niche in Indian markets.</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🚀</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">SEOShouts</h3>
                <p className="text-gray-600">Our own website showcases 13+ years of SEO expertise, ranking for competitive keywords across India.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">13+ Years' SEO vs. Typical Agency Comparison</h2>
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
                      <th className="px-4 py-4 text-left font-bold">SEOShouts (13+ Years' Expertise)</th>
                      <th className="px-4 py-4 text-left font-bold">Typical Indian Agency</th>
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
                      <td className="px-4 py-3 text-blue-600 font-semibold">B.Tech Computer Science + SEO expertise</td>
                      <td className="px-4 py-3 text-gray-600">Designers with basic SEO knowledge</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Algorithm Updates</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Survived and thrived through 13+ years of changes</td>
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
                      <td className="px-4 py-3 text-blue-600 font-semibold">Clear pricing + GST</td>
                      <td className="px-4 py-3 text-gray-600">Hidden costs and surprise fees</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Long-term Support</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Ongoing partnership based on proven relationships</td>
                      <td className="px-4 py-3 text-gray-600">Project-based, limited follow-up</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Results Guarantee</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold">Confident predictions based on 13+ years' data</td>
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Choose 13+ Years' SEO Expertise Over Generic Agencies?</h2>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Unmatched Technical Authority */}
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Unmatched Technical and SEO Authority</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>B.Tech Computer Science</strong> foundation combined with <strong>13+ years' hands-on SEO experience</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No platform dependencies</strong> – 100% custom solutions without licensing fees or template limitations</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Indian market specialisation</strong> developed through <strong>years of local client success stories</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Algorithm update experience</strong> – we've successfully navigated every major Google change over 13+ years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Direct communication</strong> in plain Indian English with <strong>expert-level technical guidance</strong></span></li>
                  </ul>
                </div>

                {/* Proven Track Record */}
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Proven Track Record Across 13+ Years</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Hundreds of successful websites</strong> launched and optimised for Indian businesses</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Consistent ranking improvements</strong> achieved through algorithm updates and market changes</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Long-term client relationships</strong> built on <strong>sustained SEO performance</strong> over years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Industry expertise</strong> across multiple verticals gained through 13+ years of diverse projects</span></li>
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
                Mastered Over 13+ Years
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
                              <p className="text-sm text-gray-600">Priority & frequency settings optimised through 13+ years of crawl analysis</p>
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
                  <p className="text-sm text-blue-600 font-semibold mb-6">13+ Years' Proven Techniques</p>

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
                        <p className="text-xs text-gray-600">UX patterns observed over 13+ years</p>
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
                    <div className="text-3xl font-bold mb-2">13+</div>
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Comprehensive FAQ (Answered from 13+ Years' Experience)</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Common questions about our SEO website development services
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: Are your prices including GST?</h3>
                  <p className="text-gray-600"><strong>A:</strong> No, all our prices are exclusive of applicable GST as per Indian business standards. Registered businesses receive a proper GST invoice for input credit purposes. This transparent pricing helps you budget accurately for your <strong>SEO website development</strong> investment.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: How can I trust that your SEO website development will actually work for my Indian business?</h3>
                  <p className="text-gray-600"><strong>A:</strong> With <strong>13+ years' proven SEO expertise</strong>, we've successfully launched and optimised hundreds of websites for Indian businesses. Our track record includes surviving multiple Google algorithm updates while maintaining and improving our clients' rankings. We provide detailed case studies and can connect you with long-term clients who've seen sustained growth.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: What makes your 13+ years' experience different from other SEO agencies in India?</h3>
                  <p className="text-gray-600"><strong>A:</strong> Most agencies offer templated solutions with basic SEO knowledge. Our <strong>13+ years of hands-on experience</strong> means we've actually built, tested, and optimised strategies through every major Google update since 2011. We understand what works long-term, not just short-term ranking tricks.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: Can you help with GST compliance and Indian business requirements?</h3>
                  <p className="text-gray-600"><strong>A:</strong> Absolutely. Our <strong>web development seo services</strong> include guidance for GST integration, Indian server selection, and compliance with local data protection and business laws. We understand Indian market requirements from years of local client work.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: How do you stay updated with SEO changes after 13+ years in the field?</h3>
                  <p className="text-gray-600"><strong>A:</strong> <strong>13+ years of experience</strong> has taught us to anticipate and adapt to Google's direction. We monitor algorithm updates, participate in SEO communities, test strategies on our own sites first, and maintain relationships with other long-term SEO professionals globally.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: Can you guarantee results based on your 13+ years' experience?</h3>
                  <p className="text-gray-600"><strong>A:</strong> While no ethical SEO can guarantee specific rankings, our <strong>13+ years of consistent client success</strong> allows us to make confident predictions about timeline and improvement potential. We provide realistic expectations based on proven data and industry knowledge.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: Do you accept UPI, NEFT, and other Indian payment methods?</h3>
                  <p className="text-gray-600"><strong>A:</strong> Yes, we accept all standard Indian payment methods including UPI, NEFT, RTGS, and major credit/debit cards. All transactions include proper invoicing for your business records and GST compliance.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: How has your approach changed over 13+ years of SEO experience?</h3>
                  <p className="text-gray-600"><strong>A:</strong> We've evolved from keyword-stuffing and link-building tactics to user-focused, technically excellent strategies. <strong>13+ years of experience</strong> has shown us that sustainable SEO success comes from building genuinely valuable websites that serve users while meeting technical requirements.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Q: What's your biggest advantage after 13+ years in SEO website development?</h3>
                  <p className="text-gray-600"><strong>A:</strong> <strong>Pattern recognition.</strong> After 13+ years, we can quickly identify what will and won't work for your specific business and market. This saves months of testing and gets you results faster with strategies we know succeed in the Indian market.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Leverage 13+ Years' SEO Expertise for Your Indian Business?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Don't waste time and money on agencies that promise the world but can't deliver proven results. Partner with <strong>13+ years of demonstrated SEO expertise</strong> and watch your Indian business dominate local and national search results.
              </p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Get Your Expert SEO Consultation</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Direct Line:</p>
                      <a href="tel:+918094888157" className="text-white/90 hover:text-white">+91 8094888157 (Call/WhatsApp)</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Email:</p>
                      <a href="mailto:seoshouts@gmail.com" className="text-white/90 hover:text-white">seoshouts@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌐</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">View 13+ Years' Portfolio:</p>
                      <p className="text-white/90 text-sm">Indian Client Success Stories</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Book Expert Strategy Call:</p>
                      <p className="text-white/90 text-sm">Schedule Free Consultation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Free SEO Analysis Available</h3>
                <p className="text-white/90 mb-4">
                  Send us your current website, and we'll provide a detailed analysis based on <strong>13+ years of SEO expertise</strong>—showing exactly what's holding back your Indian search rankings and how to fix it.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">💰</span>
                    <span className="text-white"><strong>Transparent Pricing:</strong> All costs clearly mentioned + GST</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">📋</span>
                    <span className="text-white"><strong>Proper Documentation:</strong> GST invoices provided for business compliance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">🇮🇳</span>
                    <span className="text-white"><strong>Indian Focus:</strong> Built for Indian networks, devices, and search behaviour</span>
                  </div>
                </div>
              </div>

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
                  SEOShouts: 13+ Years of Proven SEO Success for Indian Businesses
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
