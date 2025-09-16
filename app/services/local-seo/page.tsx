import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Local SEO Services India - Dominate Your Local Market | SEO Shouts',
  description: 'Professional Local SEO services for Indian businesses. Get found by local customers, dominate Google My Business, and increase foot traffic. 90-day performance guarantee.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/local-seo',
  },
  openGraph: {
    title: 'Local SEO Services India - Dominate Your Local Market | SEO Shouts',
    description: 'Professional Local SEO services for Indian businesses. Google My Business optimization, local citations, review management, and multi-language SEO.',
    url: 'https://seoshouts.com/services/local-seo',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/local-seo-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Local SEO Services India by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local SEO Services India - Dominate Your Local Market | SEO Shouts',
    description: 'Professional Local SEO services for Indian businesses. 90-day performance guarantee.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/local-seo-twitter-image.jpg'],
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

export default function LocalSEOServicePage() {
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
                "name": "Local SEO",
                "item": "https://seoshouts.com/services/local-seo"
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
            "name": "Local SEO Services India",
            "description": "Professional Local SEO services for Indian businesses including Google My Business optimization, local citations, review management, and multi-language SEO.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "serviceType": "Local SEO Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Local SEO Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Google Business Profile Optimization"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Local Citation Building"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Review Management"
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
                "name": "How long does it take to see Local SEO results in India?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most clients see initial improvements in local rankings within 4-6 weeks, with significant traffic and lead increases typically occurring within 3-4 months. Indian local markets often have less competition than global markets, allowing for faster results."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with businesses in competitive Indian cities like Mumbai, Delhi, or Bangalore?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we specialize in helping businesses compete in India's most competitive local markets. Our strategies include hyper-local content creation, niche service targeting, and comprehensive reputation management tailored for metro markets."
                }
              },
              {
                "@type": "Question",
                "name": "Do you optimize for both Hindi and English searches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we create comprehensive multi-language strategies that capture both Hindi and English local search traffic, ensuring maximum visibility across India's diverse linguistic markets."
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gray-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">🇮🇳 Local SEO Specialists for India</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
                  Local SEO Services India
                </span>
                <br />
                <span className="text-primary">
                  Dominate Your Local Market
                </span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
                Get Found by Local Customers When They're Ready to Buy
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your business into the go-to choice in your local market with <strong>SEOShouts' comprehensive Local SEO services</strong>. We help businesses across India increase their visibility in local search results, drive more foot traffic, and generate qualified leads from customers in their area.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact/"
                  className="group px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get free Local SEO audit"
                >
                  🚀 Get Your Free Local SEO Audit
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <a
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEO Shouts for Local SEO consultation"
                >
                  📞 Call +91 8094888157
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Local SEO is Critical */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                Why Local SEO is Critical for Your Business Success in India
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                When potential customers search for businesses like yours, <strong>76% of people who conduct a local search visit a business within 24 hours</strong>. In India's rapidly growing digital marketplace, without strong local SEO, you're invisible to these high-intent prospects who are ready to buy.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-center">The Indian Local Search Reality:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">97%</span>
                    </div>
                    <p><strong>97% of Indian consumers</strong> use online search to find local businesses</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">80%</span>
                    </div>
                    <p><strong>Mobile searches dominate</strong> with 80% of local searches happening on mobile devices</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">150%</span>
                    </div>
                    <p><strong>"Near me" searches in India</strong> have grown by 150% year-over-year</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">30%</span>
                    </div>
                    <p>Only <strong>30% of Indian businesses</strong> have optimized Google Business Profiles</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 text-center">
                <strong>The bottom line</strong>: If you're not optimized for local search, your competitors are capturing your potential customers across India's diverse markets.
              </p>
            </div>
          </div>
        </section>

        {/* Our Local SEO Services */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Comprehensive Local SEO Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Complete local SEO solutions tailored specifically for Indian businesses and markets
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Google Business Profile Optimization */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🏢</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Google Business Profile Optimization</h3>
                <p className="text-gray-600 mb-6">Transform your Google Business Profile into a customer-generating machine:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Complete profile setup and verification</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Strategic keyword optimization in Hindi and English</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>High-quality photo and video uploads</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Regular post scheduling and management</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Multi-language review response management</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Local Q&A optimization</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">So you can appear prominently in local search results and attract more clicks than competitors across Indian cities.</p>
              </div>

              {/* India-Focused Keyword Research */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🔍</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">India-Focused Local Keyword Research & Strategy</h3>
                <p className="text-gray-600 mb-6">Target the exact terms your local customers use:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>City and region-specific keyword identification</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Hindi and English "near me" search optimization</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Local competitor keyword analysis across Indian markets</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Search intent mapping for local queries in tier 1, 2, and 3 cities</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Industry-specific local keyword opportunities</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means your website attracts visitors who are actively looking for your services in your specific Indian city or region.</p>
              </div>

              {/* On-Page Local SEO */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⚙️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">On-Page Local SEO Optimization</h3>
                <p className="text-gray-600 mb-6">Optimize every page of your website for Indian local search:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>NAP (Name, Address, Phone) consistency across all pages</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Local schema markup implementation for Indian businesses</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Location-specific landing pages for multiple cities</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Local keyword integration in Hindi and English content</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Internal linking strategy for local relevance</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">So you can rank higher for location-based searches and provide clear signals to search engines about your service areas across India.</p>
              </div>

              {/* Local Citation Building */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📂</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Local Citation Building & Management</h3>
                <p className="text-gray-600 mb-6">Build authority and trust across Indian directories:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>High-quality Indian directory submissions (JustDial, Sulekha, IndiaMART)</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>NAP consistency monitoring across Indian platforms</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Industry-specific citation building on relevant Indian sites</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Duplicate listing identification and removal</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Google My Business category optimization for Indian markets</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means search engines have consistent, authoritative information about your business across India's digital ecosystem.</p>
              </div>

              {/* Review Management */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⭐</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Review Management & Reputation Building</h3>
                <p className="text-gray-600 mb-6">Turn customer feedback into a competitive advantage:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Review monitoring across Google, Facebook, and Indian platforms</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Professional review response in Hindi and English</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Review generation strategy implementation</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Negative review damage control and management</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Star rating improvement tactics for Indian customers</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">So you can build trust with potential customers and improve your local search rankings across Indian markets.</p>
              </div>

              {/* Local Link Building */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🔗</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Local Link Building for Indian Markets</h3>
                <p className="text-gray-600 mb-6">Earn high-quality backlinks from local Indian sources:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Local business partnership opportunities in your city</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Regional publication and media outreach</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Industry association and chamber links</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Local event sponsorship and community involvement</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>City-specific resource page link building</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means you'll build domain authority while establishing yourself as a trusted local business in India.</p>
              </div>
            </div>

            {/* CTA in Services Section */}
            <div className="text-center">
              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
                aria-label="Get started with Local SEO services"
              >
                Get Started with Local SEO Today
              </a>
            </div>
          </div>
        </section>

        {/* Our Proven Process */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Proven Local SEO Process at SEOShouts</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A systematic 4-phase approach that delivers measurable results for Indian businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Phase 1 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">1</div>
                  <h3 className="text-xl font-bold mb-3">Local SEO Audit & Strategy</h3>
                  <p className="text-sm text-gray-500 mb-4">Week 1-2</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Comprehensive local search visibility analysis for Indian markets</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Google Business Profile optimization audit</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Local competitor research across your city and region</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Custom local SEO strategy development for Indian businesses</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Multi-language keyword research and mapping</li>
                  </ul>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">2</div>
                  <h3 className="text-xl font-bold mb-3">Foundation Building</h3>
                  <p className="text-sm text-gray-500 mb-4">Week 3-6</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Google Business Profile complete optimization</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Website technical SEO improvements for Indian audiences</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Local schema markup implementation</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>NAP consistency fixes across Indian directories</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Initial citation building campaign on Indian platforms</li>
                  </ul>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">3</div>
                  <h3 className="text-xl font-bold mb-3">Content & Authority Building</h3>
                  <p className="text-sm text-gray-500 mb-4">Week 7-12</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Location-specific content creation in Hindi and English</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Local link building campaign launch in Indian markets</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Review management system implementation</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Local social media optimization for Indian platforms</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Performance monitoring and reporting setup</li>
                  </ul>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">4</div>
                  <h3 className="text-xl font-bold mb-3">Optimization & Growth</h3>
                  <p className="text-sm text-gray-500 mb-4">Ongoing</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Monthly performance analysis and reporting</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Continuous citation building on Indian platforms</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Content updates and seasonal campaign optimization</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Competitive monitoring across Indian markets</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Strategy adjustments based on local market changes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories - IMPROVED */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-gray-900">Success Stories:</span>
                <br />
                <span className="text-primary">Real Results from Indian Businesses</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See how we've helped businesses across India dominate their local markets
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Case Study 1 - Dental Practice */}
              <article className="group bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl text-white">🦷</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Dental Practice Chain</h3>
                    <p className="text-sm text-blue-600 font-medium">Multi-location Healthcare</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Challenge:</strong> Multiple dental clinics struggling to appear in local searches across different Indian cities
                  </p>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Results Achieved:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Achieved top 3 rankings</strong> in local pack for 10 high-value dental keywords</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>280% increase</strong> in appointment bookings through online search</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Consistent #1 rankings</strong> for "dentist near me" across 3 cities</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>₹2.4 lakh additional monthly revenue</strong> within 6 months</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Project Success
                  </div>
                </div>
              </article>

              {/* Case Study 2 - Preschool Network */}
              <article className="group bg-gradient-to-br from-yellow-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl text-white">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Preschool Network</h3>
                    <p className="text-sm text-yellow-600 font-medium">Educational Institution</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Challenge:</strong> New preschool franchise competing against established local schools
                  </p>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Results Achieved:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Top 3 local pack rankings</strong> for 10 education-related keywords</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>340% increase</strong> in admission inquiries</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>4.9-star average rating</strong> across all Google Business Profiles</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Expanded enrollment</strong> by 150 students within one academic year</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Project Success
                  </div>
                </div>
              </article>

              {/* Case Study 3 - Local Service Business */}
              <article className="group bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl text-white">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Local Service Business</h3>
                    <p className="text-sm text-green-600 font-medium">Home Services Rajasthan</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Challenge:</strong> Home services company invisible in local search results
                  </p>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Results Achieved:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>#1 local rankings</strong> for primary service keywords in Rajasthan</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>400% increase</strong> in service inquiry calls</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Dominated local pack</strong> for 15+ service-related searches</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Geographic expansion</strong> to 2 additional Rajasthan cities</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Project Success
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose SEOShouts - IMPROVED */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-gray-900">Why Choose</span>
                <br />
                <span className="text-primary">SEOShouts for Local SEO Services</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner for Local SEO success in India's diverse markets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Expertise Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🇮🇳</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Deep Indian Market Expertise
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    With <strong className="text-primary">5+ years specialized Local SEO experience</strong> and <strong className="text-primary">13+ years total SEO expertise</strong>, we understand the unique challenges and opportunities in Indian local search markets.
                  </p>
                </div>
              </div>

              {/* Track Record Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Proven Track Record Across Industries
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our portfolio spans dental practices, educational institutions, home services, restaurants, and retail businesses across India - each with documented success in local search rankings.
                  </p>
                </div>
              </div>

              {/* Multi-Language Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🌐</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Multi-Language Optimization
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We optimize for both Hindi and English searches, ensuring your business captures the full spectrum of local search traffic in India.
                  </p>
                </div>
              </div>

              {/* India Strategy Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    India-Specific Strategy
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our approach accounts for unique Indian factors: mobile-first usage patterns, local directory ecosystems, regional search behaviors, and tier-wise city characteristics.
                  </p>
                </div>
              </div>

              {/* Transparent Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">📈</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Transparent, Results-Focused Approach
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Receive detailed monthly reports showing exactly how your local rankings, traffic, and leads are improving. Every strategy is customized for Indian market conditions.
                  </p>
                </div>
              </div>

              {/* Full Service Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🛠️</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Full-Service Local SEO Solution
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    From technical optimization to multi-language content creation to reputation management across Indian platforms - we handle every aspect so you can focus on serving customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Guarantee */}
        <section className="py-16 sm:py-24 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Our Local SEO Guarantee at SEOShouts</h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">90-Day Performance Guarantee</h3>
                <p className="text-lg text-white/90 mb-6">
                  We're so confident in our Local SEO strategies that we guarantee measurable improvements in your local search visibility within 90 days, or we'll continue working at no additional cost until you see results.
                </p>
                
                <h4 className="text-xl font-bold text-white mb-4">What We Promise:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Improved Google Business Profile visibility</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Higher local search rankings for target keywords</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Increased website traffic from local searches</span></li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Enhanced online reputation and review ratings</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">More qualified leads from local customers</span></li>
                  </ul>
                </div>
              </div>

              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                aria-label="Claim your Local SEO guarantee"
              >
                Claim Your 90-Day Guarantee Today
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Common questions about our Local SEO services in India
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How long does it take to see Local SEO results in India?</h3>
                  <p className="text-gray-600">Most clients see initial improvements in local rankings within 4-6 weeks, with significant traffic and lead increases typically occurring within 3-4 months. Indian local markets often have less competition than global markets, allowing for faster results.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Do you work with businesses in competitive Indian cities like Mumbai, Delhi, or Bangalore?</h3>
                  <p className="text-gray-600">Yes, we specialize in helping businesses compete in India's most competitive local markets. Our strategies include hyper-local content creation, niche service targeting, and comprehensive reputation management tailored for metro markets.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Can you help if my business serves multiple cities across India?</h3>
                  <p className="text-gray-600">Absolutely. Our multi-location Local SEO expertise includes city-specific optimization, centralized review management across Indian platforms, and coordinated citation building for all your service areas.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What if my business has negative reviews on Indian platforms?</h3>
                  <p className="text-gray-600">Our reputation management services include professional review responses in Hindi and English, review generation campaigns across Google and Indian platforms, and strategies to improve your overall ratings.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Do you optimize for both Hindi and English searches?</h3>
                  <p className="text-gray-600">Yes, we create comprehensive multi-language strategies that capture both Hindi and English local search traffic, ensuring maximum visibility across India's diverse linguistic markets.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Which Indian industries do you have experience with?</h3>
                  <p className="text-gray-600">We've successfully helped businesses across industries including healthcare (dental practices), education (preschools), home services, restaurants, retail, automotive, real estate, professional services, and more.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How do you handle local SEO for tier 2 and tier 3 Indian cities?</h3>
                  <p className="text-gray-600">We understand the unique characteristics of different city tiers in India and adjust our strategies accordingly - from directory selection to keyword targeting to content creation approaches.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Dominate Your Local Market in India?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Don't let another day pass while competitors capture your potential customers. <strong>SEOShouts' Local SEO experts</strong> are ready to develop a custom strategy that puts your business at the top of local search results across India.
              </p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Get Started Today:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Get Your Free Local SEO Audit</p>
                      <p className="text-white/80 text-sm">Discover exactly what's holding back your local rankings in Indian markets</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Call: +91 8094888157</p>
                      <p className="text-white/80 text-sm">Speak directly with our Local SEO team in Udaipur, Rajasthan</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Email: contact@seoshouts.com</p>
                      <p className="text-white/80 text-sm">Discuss your local SEO goals with our Indian market specialists</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Schedule a Strategy Consultation</p>
                      <p className="text-white/80 text-sm">Get a custom Local SEO roadmap for your Indian business</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact/"
                  className="group px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get free Local SEO audit from SEOShouts"
                >
                  🎯 Get Your Free Local SEO Audit
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEOShouts for Local SEO consultation"
                >
                  📞 Call +91 8094888157
                </a>
              </div>

              <p className="text-white/80 mt-6">
                <strong>Serving businesses across India from our Udaipur, Rajasthan headquarters</strong>
              </p>
              
              <p className="text-white/70 mt-4 text-sm">
                <strong>Still have questions?</strong> Our Local SEO specialists at SEOShouts are standing by to discuss your specific situation and goals. With 13+ years of SEO experience and deep understanding of Indian local markets, we're ready to help your business dominate local search results.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
