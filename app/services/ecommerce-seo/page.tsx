import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'eCommerce SEO Services India - Skyrocket Your Online Store Growth | SEO Shouts',
  description: 'Professional eCommerce SEO services for Indian online stores. Product optimization, technical SEO, content marketing, and conversion optimization. 90-day performance guarantee.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/ecommerce-seo',
  },
  openGraph: {
    title: 'eCommerce SEO Services India - Skyrocket Your Online Store Growth | SEO Shouts',
    description: 'Professional eCommerce SEO services for Indian online stores. Technical SEO, product optimization, content marketing, and link building for Shopify, WooCommerce, Magento.',
    url: 'https://seoshouts.com/services/ecommerce-seo',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/ecommerce-seo-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'eCommerce SEO Services India by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eCommerce SEO Services India - Skyrocket Your Online Store Growth | SEO Shouts',
    description: 'Professional eCommerce SEO services for Indian online stores. 90-day performance guarantee.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/ecommerce-seo-twitter-image.jpg'],
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

export default function EcommerceSEOServicePage() {
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
                "name": "eCommerce SEO",
                "item": "https://seoshouts.com/services/ecommerce-seo"
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
            "name": "eCommerce SEO Services India",
            "description": "Professional eCommerce SEO services for Indian online stores including technical SEO, product optimization, content marketing, link building, and conversion optimization.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "serviceType": "eCommerce SEO Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "eCommerce SEO Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Technical eCommerce SEO"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Product Page Optimization"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "eCommerce Content Marketing"
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
                "name": "How long does it take to see eCommerce SEO results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most clients see initial improvements in product rankings within 6-8 weeks, with significant traffic and sales increases typically occurring within 3-6 months. eCommerce sites often see faster results due to high commercial intent keywords."
                }
              },
              {
                "@type": "Question",
                "name": "Which eCommerce platforms do you specialize in?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We have extensive experience with Shopify, WooCommerce, Magento, OpenCart, and custom-built eCommerce solutions. Our technical SEO strategies are platform-agnostic but optimized for each system's unique features."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with small stores or only large eCommerce businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We work with businesses of all sizes - from startup stores with 100 products to established retailers with 50,000+ SKUs. Our strategies are customized based on your inventory size, budget, and growth goals."
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">🛒 eCommerce SEO Specialists for India</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-primary to-purple-600 bg-clip-text text-transparent">
                  Skyrocket Your eCommerce Store's Growth
                </span>
                <br />
                <span className="text-primary">
                  with Proven SEO Strategies
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Tap into India's booming eCommerce market and get your brand in front of customers <em>right when they're searching to buy</em>. SEOShouts' <strong>eCommerce SEO services</strong> are designed to turn your online store into a sales powerhouse — increasing your organic visibility, ranking your products above competitors, and driving revenue with qualified traffic.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact/"
                  className="group px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get free eCommerce SEO audit"
                >
                  🚀 Get Your FREE eCommerce SEO Audit
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEO Shouts for eCommerce SEO consultation"
                >
                  📞 Call +91 8094888157
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why eCommerce SEO Matters */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                Why eCommerce SEO Matters for Your Online Store
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Over <strong>80% of online shoppers</strong> begin their journey on Google and other search engines. With thousands of products and fierce competition, ranking in the top results is the difference between an abandoned cart and a loyal customer.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Key eCommerce Search Insights:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-xl">53%</span>
                    </div>
                    <p><strong>53% of all website traffic</strong> for eCommerce comes from organic search</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-xl">82%</span>
                    </div>
                    <p><strong>82% of mobile shoppers</strong> use search engines as their first tool for product discovery in India</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-xl">2%</span>
                    </div>
                    <p><strong>Only 2% of users</strong> go beyond the first page of results for shopping queries</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 text-center font-semibold">
                If your products aren't visible, your customers buy from your competitors.
              </p>
            </div>
          </div>
        </section>

        {/* Comprehensive eCommerce SEO Services */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Comprehensive eCommerce SEO Services for Maximum Impact</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Complete eCommerce SEO solutions designed to drive traffic, rankings, and revenue for your online store
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Technical eCommerce SEO */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⚙️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Advanced Technical eCommerce SEO</h3>
                <p className="text-gray-600 mb-6">Make your site easy to crawl, fast, and mobile-optimized — the foundation of scalable eCommerce SEO:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Site architecture planning for stores with 100 to 50,000+ SKUs</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Crawl budget optimization and indexation management</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>XML Sitemap & robots.txt optimization for product/collection pages</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Core Web Vitals and page speed improvements for higher rankings</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Mobile-first technical strategies for seamless shopping experiences</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>HTTPS, secure checkout, and trust signal enhancements</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">So you get a robust, scalable store that Google and customers love.</p>
              </div>

              {/* Keyword Research & Mapping */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🔍</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">eCommerce Keyword Research & Mapping</h3>
                <p className="text-gray-600 mb-6">Drive targeted, purchase-ready traffic to every product and category:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>In-depth keyword research for main, transactional, and long-tail terms</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Product and category-level keyword mapping</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Competitive gap analysis of Indian and global eCommerce sites</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Brand, generic, and seasonal keyword targeting strategies</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Search intent analysis focused on buyer journeys</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means your products are discovered by customers ready to buy, not just browse.</p>
              </div>

              {/* On-Page SEO */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📄</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">On-Page SEO for Products & Category Pages</h3>
                <p className="text-gray-600 mb-6">Turn your website into a conversion-optimized, search-friendly marketplace:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>SEO-friendly titles, meta descriptions, and H1s for every product and collection page</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Unique, conversion-focused product descriptions built for humans and search engines</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Schema markup for products, reviews, availability, and FAQs</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Image SEO (alt text, file names, compression) for better visibility in Google Images</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Breadcrumb integration for improved navigation and rankings</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">So each page ranks for relevant queries and converts visitors into buyers.</p>
              </div>

              {/* Content Marketing */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Content Marketing & eCommerce Blogging</h3>
                <p className="text-gray-600 mb-6">Establish authority and drive consistent organic traffic with valuable content:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Category, collection, and buying guide creation</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Product comparisons and user intent-focused content</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>How-to articles, reviews, and eCommerce FAQs</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Seasonal campaign landing pages and content calendars</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Content clusters that boost topical authority</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means you attract shoppers at every stage of the buying cycle.</p>
              </div>

              {/* Link Building */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🔗</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Link Building & Digital PR for eCommerce</h3>
                <p className="text-gray-600 mb-6">Earn powerful, industry-relevant backlinks that boost domain authority:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Outreach to review sites and shopping directories</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Industry-specific link acquisition (fashion, electronics, home, etc.)</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Influencer collaboration for product launches and campaigns</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Brand mention reclamation and competitor link gap analysis</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Local, national, and international eCommerce PR strategies</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">So your products achieve sustainable, top-of-page visibility.</p>
              </div>

              {/* CRO & UX */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📈</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Conversion Rate Optimization (CRO) & UX for eCommerce</h3>
                <p className="text-gray-600 mb-6">Beyond rankings: convert traffic into sales with intelligent site design and analysis:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>User journey and checkout flow analysis</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>A/B testing on product page layouts and CTAs</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Trust badge placement and review integration</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Cart abandonment optimization and remarketing setup</strong></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Data-driven performance tracking</strong></li>
                </ul>
                <p className="text-sm text-gray-500 italic">So every visitor has a clear path from search to sale.</p>
              </div>
            </div>

            {/* CTA in Services Section */}
            <div className="text-center">
              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
                aria-label="Get started with eCommerce SEO services"
              >
                Get Started with eCommerce SEO Today
              </a>
            </div>
          </div>
        </section>

        {/* Our Proven Process */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Proven eCommerce SEO Process</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A systematic 4-phase approach that delivers measurable results for eCommerce businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Phase 1 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">1</div>
                  <h3 className="text-xl font-bold mb-3">Discovery & Audit</h3>
                  <p className="text-sm text-gray-500 mb-4">Weeks 1–2</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>In-depth technical and competitor audit</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Product and keyword opportunity analysis</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Custom SEO roadmap for your store's unique needs</li>
                  </ul>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">2</div>
                  <h3 className="text-xl font-bold mb-3">Implementation & Optimization</h3>
                  <p className="text-sm text-gray-500 mb-4">Weeks 3–8</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Technical fixes, on-page optimizations, and initial content rollout</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Schema markup and site speed improvements</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Category and product structure refinement</li>
                  </ul>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">3</div>
                  <h3 className="text-xl font-bold mb-3">Content & Authority Building</h3>
                  <p className="text-sm text-gray-500 mb-4">Months 2–4</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Ongoing blog, buying guide, and landing page creation</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Strategic link-building campaigns</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Internal linking and conversion optimization</li>
                  </ul>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">4</div>
                  <h3 className="text-xl font-bold mb-3">Growth & ROI Scaling</h3>
                  <p className="text-sm text-gray-500 mb-4">Month 4+ and ongoing</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Performance analytics, regular rankings reports, and CRO experiments</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Seasonal campaigns, new product launches, offer optimization</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>Ongoing competitor gap and trend analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-gray-900">Success Stories:</span>
                <br />
                <span className="text-primary">Results From Real Indian eCommerce Brands</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See how we've helped online stores across India dominate search results and drive revenue
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Case Study 1 - Leather Products Brand */}
              <article className="group bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl text-white">👜</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Leather Products Brand</h3>
                    <p className="text-sm text-orange-600 font-medium">Premium Leather Goods</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Challenge:</strong> Struggling to compete with established leather goods retailers online
                  </p>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Results Achieved:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Top 3 rankings achieved</strong> for 25 high-value leather product keywords</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>340% increase</strong> in organic visibility for premium leather categories</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Dominated search results</strong> for "buy leather bags online," "premium leather wallets," and related terms</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>₹4.2 lakh additional monthly revenue</strong> from organic search traffic</span>
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

              {/* Case Study 2 - Organic Products Store */}
              <article className="group bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl text-white">🌱</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Organic Products eCommerce Store</h3>
                    <p className="text-sm text-green-600 font-medium">Organic & Natural Products</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Challenge:</strong> Low organic lead generation despite quality product range
                  </p>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Results Achieved:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Leads increased from 30 to 150+ per month</strong> through strategic SEO optimization</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>400% improvement</strong> in organic lead generation within 8 months</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Top 5 rankings</strong> for "buy organic products online" and related keywords</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong>Sustained growth</strong> with consistent month-over-month lead increases</span>
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

        {/* Why Choose SEOShouts */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-gray-900">Why Choose</span>
                <br />
                <span className="text-primary">SEOShouts for eCommerce SEO?</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner for eCommerce SEO success in India's competitive online marketplace
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Experience Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    13+ Years of SEO Excellence, 5+ Years eCommerce Experience
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We understand the nuances of ranking, optimizing, and growing online stores in India's diverse marketplace.
                  </p>
                </div>
              </div>

              {/* Custom Strategies Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Custom Strategies, Not One-Size-Fits-All Packages
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every site — from 100 to 50,000+ SKUs — gets a bespoke SEO action plan aligned to your business, sector, and goals.
                  </p>
                </div>
              </div>

              {/* Full-Service Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🛠️</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Full-Service, Results-Driven Approach
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    From technical fixes to CRO, schema markup, and content, we handle every aspect required for eCommerce dominance.
                  </p>
                </div>
              </div>

              {/* Performance Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Performance Reporting & Tracking
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transparent monthly analytics, custom KPIs, and ongoing communication, so you always know your ROI.
                  </p>
                </div>
              </div>

              {/* Platforms Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">💻</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    Experience Across All eCommerce Platforms
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We specialize in Shopify, WooCommerce, Magento, OpenCart, and custom eCommerce builds.
                  </p>
                </div>
              </div>

              {/* India-Focused Card */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🇮🇳</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    India-Focused, Global-Ready
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    From Udaipur to Mumbai, Delhi, Bangalore and beyond — we optimize for Indian consumer behavior and international expansion alike.
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Our eCommerce SEO Guarantee</h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">90-Day Performance Guarantee</h3>
                <p className="text-lg text-white/90 mb-6">
                  We're so confident in our eCommerce SEO strategies that we guarantee measurable improvements in your organic search visibility and traffic within 90 days, or we'll continue working at no additional cost until you see results.
                </p>
                
                <h4 className="text-xl font-bold text-white mb-4">What We Promise:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Improved product and category page rankings</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Higher organic traffic from purchase-ready customers</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Enhanced product visibility in Google Shopping and Images</span></li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Better conversion rates from SEO-driven traffic</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Increased revenue from organic search channels</span></li>
                  </ul>
                </div>
              </div>

              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                aria-label="Claim your eCommerce SEO guarantee"
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
                Common questions about our eCommerce SEO services
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How long does it take to see eCommerce SEO results?</h3>
                  <p className="text-gray-600">Most clients see initial improvements in product rankings within 6-8 weeks, with significant traffic and sales increases typically occurring within 3-6 months. eCommerce sites often see faster results due to high commercial intent keywords.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Do you work with small stores or only large eCommerce businesses?</h3>
                  <p className="text-gray-600">We work with businesses of all sizes - from startup stores with 100 products to established retailers with 50,000+ SKUs. Our strategies are customized based on your inventory size, budget, and growth goals.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Can you help optimize my existing product descriptions?</h3>
                  <p className="text-gray-600">Absolutely. We audit and optimize all existing product descriptions for SEO while maintaining conversion-focused copy that encourages purchases. We also create new descriptions for products that need them.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Which eCommerce platforms do you specialize in?</h3>
                  <p className="text-gray-600">We have extensive experience with Shopify, WooCommerce, Magento, OpenCart, and custom-built eCommerce solutions. Our technical SEO strategies are platform-agnostic but optimized for each system's unique features.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How do you handle large inventory sites with thousands of products?</h3>
                  <p className="text-gray-600">We use advanced crawl budget optimization, strategic internal linking, and automated SEO processes to efficiently manage large inventories. Our approach ensures every important product gets proper search visibility.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Do you help with international eCommerce SEO?</h3>
                  <p className="text-gray-600">Yes, we help Indian businesses expand internationally and global brands enter the Indian market. Our strategies include multi-language SEO, international shipping optimization, and region-specific search tactics.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Transform Your eCommerce Store Into a Sales Machine?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Don't let competitors capture your potential customers. <strong>SEOShouts' eCommerce SEO experts</strong> are ready to develop a custom strategy that drives your products to the top of search results and converts visitors into loyal customers.
              </p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Get Started Today:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Get Your FREE eCommerce SEO Audit</p>
                      <p className="text-white/80 text-sm">Discover exactly what's preventing your products from ranking higher</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Call: +91 8094888157</p>
                      <p className="text-white/80 text-sm">Speak directly with our eCommerce SEO team in Udaipur, Rajasthan</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Email: contact@seoshouts.com</p>
                      <p className="text-white/80 text-sm">Discuss your eCommerce SEO goals with our specialists</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Schedule a Strategy Consultation</p>
                      <p className="text-white/80 text-sm">Get a custom eCommerce SEO roadmap for your online store</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact/"
                  className="group px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get free eCommerce SEO audit from SEOShouts"
                >
                  🎯 Get Your FREE eCommerce SEO Audit
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEOShouts for eCommerce SEO consultation"
                >
                  📞 Call +91 8094888157
                </a>
              </div>

              <p className="text-white/80 mt-6">
                <strong>Serving eCommerce businesses across India from our Udaipur, Rajasthan headquarters</strong>
              </p>
              
              <p className="text-white/70 mt-4 text-sm">
                <strong>Still have questions?</strong> Our eCommerce SEO specialists at SEOShouts are standing by to discuss your specific store's needs and goals. With 13+ years of SEO experience and proven success in the Indian eCommerce market, we're ready to help your online store dominate search results and drive sustainable growth.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
