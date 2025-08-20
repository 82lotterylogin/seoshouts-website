import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO Consulting Services - Strategic SEO Leadership & Expert Guidance | SEO Shouts',
  description: 'Professional SEO consulting services by SEOShouts. Strategic SEO planning, team training, technical consulting, and performance optimization. Transform your digital presence with expert guidance.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-consulting',
  },
  openGraph: {
    title: 'SEO Consulting Services - Strategic SEO Leadership & Expert Guidance | SEO Shouts',
    description: 'Professional SEO consulting services including strategic planning, team training, technical consulting, and performance optimization for businesses across India.',
    url: 'https://seoshouts.com/services/seo-consulting',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-consulting-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Consulting Services by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Consulting Services - Strategic SEO Leadership & Expert Guidance | SEO Shouts',
    description: 'Professional SEO consulting services by SEOShouts. Strategic planning, team training, and performance optimization.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/seo-consulting-twitter-image.jpg'],
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

export default function SEOConsultingServicePage() {
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
                "name": "SEO Consulting",
                "item": "https://seoshouts.com/services/seo-consulting"
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
            "name": "SEO Consulting Services",
            "description": "Strategic SEO consulting services including SEO strategy development, team training, technical consulting, and performance optimization for businesses across India.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "serviceType": "SEO Consulting Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Consulting Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Strategic SEO Assessment and Planning"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Team Development and Training"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Technical SEO Strategy Consulting"
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
                "name": "What distinguishes your SEO consulting from traditional SEO services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our consulting focuses on strategic guidance, capability building, and long-term value creation rather than task execution. We develop internal expertise while providing strategic direction, ensuring sustainable success and reduced dependency on external resources."
                }
              },
              {
                "@type": "Question",
                "name": "How do you customize consulting services for different business sizes and industries?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We conduct comprehensive assessments of business goals, current capabilities, competitive landscape, and available resources to develop customized strategies and consulting approaches that align with specific requirements and market conditions."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer both project-based and ongoing consulting arrangements?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we provide both project-based consulting for specific challenges and strategic initiatives, as well as ongoing strategic support through monthly or quarterly consulting arrangements based on client needs and objectives."
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-teal-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">🎯 Strategic SEO Leadership</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  SEO Consulting Services
                </span>
                <br />
                <span className="text-blue-600">
                  Strategic SEO Leadership for Competitive Advantage
                </span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
                Transform Your Digital Presence with Expert SEO Strategy and Implementation Guidance
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Navigate the complexities of modern search engine optimization with comprehensive SEO consulting that delivers sustainable competitive advantage. SEOShouts provides strategic SEO consulting services designed to help businesses develop sophisticated search strategies, optimize implementation processes, and achieve measurable growth in an increasingly competitive digital landscape.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Schedule Strategic SEO Consultation"
                >
                  🚀 Schedule Your Strategic SEO Consultation
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEO Shouts for SEO consulting"
                >
                  📞 Call +91 8094888157
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Imperative Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                The Strategic Imperative of Professional SEO Consulting
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The search landscape has fundamentally transformed. With Google's AI Overviews reaching two billion users, the integration of helpful content signals into core algorithms, and the evolution of E-E-A-T as a critical ranking factor, effective SEO requires strategic expertise that goes far beyond traditional optimization tactics.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Current SEO Landscape Challenges:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">🔄</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Algorithm complexity</p>
                      <p className="text-gray-600 text-sm">has increased exponentially with 4,000+ annual updates</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">🤖</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">AI-powered search features</p>
                      <p className="text-gray-600 text-sm">now influence 60% of query results</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">🎯</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">User intent sophistication</p>
                      <p className="text-gray-600 text-sm">requires nuanced content and technical strategies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">📱</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Mobile-first indexing</p>
                      <p className="text-gray-600 text-sm">demands comprehensive responsive optimization</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">🏷️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Entity-based search</p>
                      <p className="text-gray-600 text-sm">prioritizes topical authority over keyword density</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">⚡</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Core Web Vitals</p>
                      <p className="text-gray-600 text-sm">significantly impact both rankings and user experience</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-700 font-semibold bg-blue-50 border border-blue-200 rounded-lg p-4">
                  Professional SEO consulting provides the strategic framework necessary to navigate these complexities and achieve sustainable organic growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive SEO Consulting Services */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Comprehensive SEO Consulting Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Strategic guidance and expertise across all aspects of modern search engine optimization
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Strategic SEO Assessment */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📊</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Strategic SEO Assessment and Planning</h3>
                <p className="text-gray-600 mb-6">Develop comprehensive SEO strategies aligned with business objectives and market realities:</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Business and Market Analysis</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Comprehensive business goal alignment and KPI framework development</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Market opportunity assessment and competitive landscape analysis</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Customer journey mapping and search behavior analysis</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Technical infrastructure evaluation and optimization planning</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Resource allocation strategy and implementation timeline development</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">SEO Strategy Development</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Custom SEO roadmap creation with priority-based implementation phases</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content strategy development aligned with search intent and business goals</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Technical SEO architecture planning for scalability and performance</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Link acquisition strategy and authority building framework</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Performance measurement and optimization methodology establishment</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic">Ensuring your SEO strategy directly supports revenue growth and competitive positioning.</p>
              </div>

              {/* Technical SEO Strategy */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⚙️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Technical SEO Strategy and Implementation Support</h3>
                <p className="text-gray-600 mb-6">Navigate complex technical challenges with expert guidance and industry best practices:</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Advanced Technical Optimization</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Site architecture planning for optimal crawlability and user experience</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Core Web Vitals optimization strategy for performance and rankings</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Schema markup implementation for enhanced search visibility</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>International SEO planning for multi-market expansion</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Mobile-first optimization strategy for diverse device and connection scenarios</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Platform-Specific Consulting</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>eCommerce SEO strategy for product and category optimization</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>WordPress optimization and performance enhancement</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Enterprise CMS integration and optimization planning</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Migration strategy development and execution guidance</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Security and HTTPS implementation best practices</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic">Providing technical expertise to ensure optimal search engine accessibility and user experience.</p>
              </div>

              {/* Content Strategy Consulting */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Content Strategy and Optimization Consulting</h3>
                <p className="text-gray-600 mb-6">Create content frameworks that establish authority and drive qualified traffic:</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Strategic Content Development</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Comprehensive keyword research and semantic mapping</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content gap analysis and competitive opportunity identification</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Editorial calendar development with search-optimized content planning</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content cluster strategy for topical authority establishment</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>E-E-A-T optimization for expertise demonstration and trust building</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Content Performance Optimization</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Existing content audit and optimization recommendations</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content refreshing strategy for sustained performance</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Featured snippet and AI Overview optimization</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Voice search and conversational query optimization</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content ROI measurement and performance enhancement</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic">Developing content strategies that attract qualified traffic and support conversion objectives.</p>
              </div>

              {/* Local SEO Strategy */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📍</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Local SEO Strategy and Implementation</h3>
                <p className="text-gray-600 mb-6">Maximize local search visibility across single and multi-location scenarios:</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Local Search Optimization</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Google Business Profile optimization and management strategy</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Local citation development and consistency management</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Local content strategy for geographic market targeting</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Review management and reputation optimization</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Local link building and community engagement strategies</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Multi-Location SEO Coordination</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Scalable local SEO framework for multiple locations</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Location-specific content strategy and implementation</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Centralized management system development</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Performance tracking across geographic markets</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Regional optimization for diverse market conditions</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic">Ensuring comprehensive local search dominance and qualified lead generation.</p>
              </div>

              {/* Team Development */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">👥</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">SEO Team Development and Training</h3>
                <p className="text-gray-600 mb-6">Build internal SEO capabilities through structured training and knowledge transfer:</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Team Capability Building</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>SEO fundamentals training for marketing teams</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Advanced technical SEO education for developers</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content optimization training and best practices implementation</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>SEO tools training and workflow optimization</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Performance analysis and reporting skill development</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Ongoing Education and Support</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Industry update briefings and algorithm change guidance</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Advanced skill development workshops</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Best practices documentation and process optimization</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Quality assurance and performance review sessions</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Strategic planning and goal setting facilitation</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic">Developing sustainable internal expertise for long-term SEO success.</p>
              </div>

              {/* Performance Analysis */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📈</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Performance Analysis and Optimization</h3>
                <p className="text-gray-600 mb-6">Maximize ROI through comprehensive analysis and continuous improvement:</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Performance Measurement and Analysis</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Advanced analytics implementation and tracking setup</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>SEO performance auditing and optimization identification</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Competitive analysis and benchmarking</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>ROI analysis and budget optimization recommendations</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>User experience analysis and conversion optimization</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Strategic Optimization and Growth Planning</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Algorithm update impact assessment and response planning</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Seasonal optimization and campaign planning</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Scalability planning for business growth</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Advanced SEO technique implementation</li>
                    <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Long-term strategic planning and goal adjustment</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic">Providing data-driven insights for sustained growth and competitive advantage.</p>
              </div>
            </div>

            {/* CTA in Services Section */}
            <div className="text-center">
              <a 
                href="/contact"
                className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                aria-label="Get started with SEO consulting"
              >
                Get Started with SEO Consulting Today
              </a>
            </div>
          </div>
        </section>

        {/* Strategic Consulting Process */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Strategic SEO Consulting Process</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A comprehensive 3-phase approach designed to deliver sustainable SEO success
              </p>
            </div>

            <div className="space-y-12">
              {/* Phase 1 */}
              <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mr-6">1</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Comprehensive Assessment and Strategy Development</h3>
                    <p className="text-gray-500">Weeks 1-3</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Initial Business and SEO Analysis</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Detailed business objective assessment and KPI establishment</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Comprehensive SEO performance audit and gap identification</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Competitive landscape analysis and opportunity mapping</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Technical infrastructure evaluation and optimization planning</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Market research and customer search behavior analysis</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Strategic Framework Development</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Custom SEO strategy creation aligned with business goals</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Implementation roadmap with priority-based action items</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Resource requirements and timeline development</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Success metrics and measurement framework establishment</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Risk assessment and mitigation strategy development</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-teal-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mr-6">2</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Implementation Planning and Team Enablement</h3>
                    <p className="text-gray-500">Weeks 4-6</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Implementation Planning</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Comprehensive action plan development with specific deliverables</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Technical implementation guidance and best practices documentation</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content strategy implementation and editorial calendar creation</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Team training and skill development sessions</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Quality assurance framework and monitoring system setup</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Capability Building and Training</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Customized training programs for internal teams</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Tool implementation and workflow optimization</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Process documentation and standard operating procedures</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Performance tracking and reporting system establishment</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Ongoing support structure and communication framework</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-cyan-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mr-6">3</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Ongoing Strategic Support and Optimization</h3>
                    <p className="text-gray-500">Monthly/Quarterly</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Review and Strategic Adjustment</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Comprehensive performance analysis and optimization recommendations</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Strategic planning adjustments based on market changes and results</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Advanced training and skill development continuation</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Competitive monitoring and strategic response planning</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Growth planning and scalability assessment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Continuous Improvement and Innovation</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Industry trend analysis and strategic integration</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>New opportunity identification and implementation planning</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Performance optimization and efficiency improvement</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Strategic partnership and collaboration opportunities</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Long-term growth planning and market expansion strategy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Packages */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">SEO Consulting Service Packages</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Flexible consulting solutions tailored to your business needs and objectives
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strategic SEO Consulting */}
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Strategic SEO Consulting</h3>
                  <p className="text-gray-600 italic">Comprehensive strategy development and implementation guidance</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Includes:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Initial comprehensive SEO audit and strategic assessment</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Custom SEO roadmap and implementation planning</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Quarterly strategy reviews and optimization recommendations</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Ongoing consultation and strategic guidance</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Team training and capability development</span></li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic mb-8">Ideal for businesses seeking comprehensive SEO strategy development and implementation support.</p>

                <div className="text-center">
                  <a 
                    href="/contact"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 inline-block"
                    aria-label="Get Strategic SEO Consulting"
                  >
                    Get Started
                  </a>
                </div>
              </div>

              {/* Technical SEO Consulting */}
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Technical SEO Consulting</h3>
                  <p className="text-gray-600 italic">Specialized technical optimization and implementation expertise</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Includes:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Advanced technical SEO auditing and optimization planning</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Implementation guidance for complex technical challenges</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Performance optimization and Core Web Vitals enhancement</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Migration planning and execution support</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Technical team training and capability building</span></li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic mb-8">Perfect for businesses with complex technical requirements and implementation challenges.</p>

                <div className="text-center">
                  <a 
                    href="/contact"
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 inline-block"
                    aria-label="Get Technical SEO Consulting"
                  >
                    Get Started
                  </a>
                </div>
              </div>

              {/* Enterprise SEO Consulting */}
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Enterprise SEO Consulting</h3>
                  <p className="text-gray-600 italic">Large-scale SEO strategy and coordination for complex organizations</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Includes:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Multi-site and international SEO strategy development</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Comprehensive team training and capability development</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Advanced analytics and performance optimization</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Executive reporting and strategic business alignment</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700">Large-scale implementation project management</span></li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 italic mb-8">Designed for enterprise organizations with multiple sites, complex requirements, and substantial resources.</p>

                <div className="text-center">
                  <a 
                    href="/contact"
                    className="w-full px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-300 inline-block"
                    aria-label="Get Enterprise SEO Consulting"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 italic">All consulting services are customized based on specific requirements, organizational structure, and business objectives.</p>
            </div>
          </div>
        </section>

        {/* Why Choose SEOShouts */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-gray-900">Why Choose</span>
                <br />
                <span className="text-blue-600">SEOShouts for SEO Consulting</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Strategic expertise and proven methodology that drives sustainable SEO success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Expertise Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🏆</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    Proven Strategic Expertise and Industry Leadership
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Over 13 years of SEO experience across diverse industries, market conditions, and algorithm changes, providing deep strategic knowledge and practical implementation expertise that drives sustainable results.
                  </p>
                </div>
              </div>

              {/* Data-Driven Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    Comprehensive Data-Driven Methodology
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    All strategic recommendations are supported by comprehensive data analysis, competitive research, and performance measurement frameworks that ensure informed decision-making and measurable outcomes.
                  </p>
                </div>
              </div>

              {/* Industry-Specific Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    Industry-Specific Knowledge and Customization
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Deep understanding of unique challenges and opportunities across various sectors, enabling tailored strategies that address specific business needs, market conditions, and competitive landscapes.
                  </p>
                </div>
              </div>

              {/* Technical Excellence Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    Technical Excellence and Strategic Integration
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Combining advanced technical SEO knowledge with strategic business acumen to deliver holistic solutions that support broader organizational goals and sustainable growth.
                  </p>
                </div>
              </div>

              {/* Communication Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    Transparent Communication and Collaborative Approach
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Professional communication standards with regular updates, detailed reporting, and collaborative approach to strategy development that ensures alignment with business objectives.
                  </p>
                </div>
              </div>

              {/* Scalable Solutions Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">📈</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    Scalable Solutions and Long-Term Value
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Consulting approaches that adapt to organizational size, resources, and growth objectives, providing sustainable value and capability building for long-term success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Common questions about our SEO consulting services
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What distinguishes your SEO consulting from traditional SEO services?</h3>
                  <p className="text-gray-600">Our consulting focuses on strategic guidance, capability building, and long-term value creation rather than task execution. We develop internal expertise while providing strategic direction, ensuring sustainable success and reduced dependency on external resources.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How do you customize consulting services for different business sizes and industries?</h3>
                  <p className="text-gray-600">We conduct comprehensive assessments of business goals, current capabilities, competitive landscape, and available resources to develop customized strategies and consulting approaches that align with specific requirements and market conditions.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What level of implementation support do you provide?</h3>
                  <p className="text-gray-600">Our consulting services range from high-level strategy development to detailed technical implementation guidance and hands-on support, depending on client needs and internal capabilities. We adapt our approach to complement existing resources and fill capability gaps.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How do you measure the success and ROI of consulting engagements?</h3>
                  <p className="text-gray-600">Success is measured through predefined KPIs aligned with business objectives, including organic traffic growth, ranking improvements, conversion increases, team capability development, and overall ROI from SEO investments.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Can you work effectively with existing marketing teams and agency relationships?</h3>
                  <p className="text-gray-600">Absolutely. We excel at collaborative environments, providing strategic oversight, coordination, and training that enhances existing capabilities while ensuring all SEO efforts align with broader marketing and business objectives.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What industries and business types do you have consulting experience with?</h3>
                  <p className="text-gray-600">We have extensive consulting experience across multiple industries including eCommerce, healthcare, education, professional services, technology, manufacturing, and local businesses throughout India and international markets.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Do you offer both project-based and ongoing consulting arrangements?</h3>
                  <p className="text-gray-600">Yes, we provide both project-based consulting for specific challenges and strategic initiatives, as well as ongoing strategic support through monthly or quarterly consulting arrangements based on client needs and objectives.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How do you ensure knowledge transfer and sustainable capability building?</h3>
                  <p className="text-gray-600">Our consulting methodology emphasizes documentation, training, and process development that builds internal expertise. We provide comprehensive training materials, standard operating procedures, and ongoing support to ensure sustainable capability development.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-teal-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Transform Your SEO Strategy and Results?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Accelerate your search engine optimization success with strategic guidance from SEO experts who understand both the technical complexities and business impact of effective SEO strategy in today's competitive digital landscape. <strong>SEOShouts' SEO consulting team</strong> combines deep technical expertise with strategic business acumen to help you develop and implement SEO strategies that drive sustainable organic growth and competitive advantage.
              </p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Begin Your Strategic SEO Transformation:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Schedule Your Strategic SEO Consultation</p>
                      <p className="text-white/80 text-sm">Discuss your SEO challenges and business objectives with our strategic consulting experts</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Call: +91 8094888157</p>
                      <p className="text-white/80 text-sm">Speak directly with our SEO consulting team</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Email: contact@seoshouts.com</p>
                      <p className="text-white/80 text-sm">Outline your consulting needs, current challenges, and strategic objectives</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Request a Custom Consulting Proposal</p>
                      <p className="text-white/80 text-sm">Receive a tailored consulting plan designed for your specific requirements and objectives</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Schedule Strategic SEO Consultation with SEOShouts"
                >
                  🎯 Schedule Your Strategic SEO Consultation
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEOShouts for SEO consulting"
                >
                  📞 Call +91 8094888157
                </a>
              </div>

              <p className="text-white/80 mt-6">
                <strong>Professional SEO consulting services delivered to businesses across India and international markets</strong>
              </p>
              
              <p className="text-white/70 mt-4 text-sm">
                <strong>Ready to achieve sustainable SEO success?</strong> Our experienced SEO consultants at SEOShouts combine strategic thinking with practical implementation expertise to help you achieve measurable search engine success. With 13+ years of SEO experience and deep understanding of Indian and international markets, we provide the strategic guidance necessary to maximize your SEO investments and achieve long-term competitive advantage.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
