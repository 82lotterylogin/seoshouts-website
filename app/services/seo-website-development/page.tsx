import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO Website Development Services - Build Websites That Rank & Convert | SEO Shouts',
  description: 'Professional SEO website development services by SEOShouts. We build websites that rank high, load fast, and convert visitors into customers. Mobile-first, performance-focused web development.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-website-development',
  },
  openGraph: {
    title: 'SEO Website Development Services - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Professional SEO website development services including mobile-first design, performance optimization, eCommerce development, and conversion-focused builds for Indian businesses.',
    url: 'https://seoshouts.com/services/seo-website-development',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-website-development-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Website Development Services by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Website Development Services - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Professional SEO website development services by SEOShouts. Mobile-first, performance-focused web development.',
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
            "name": "SEO Website Development Services",
            "description": "Professional SEO website development services including mobile-first design, performance optimization, eCommerce development, and conversion-focused builds for businesses.",
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
                "name": "How long does it actually take to build a website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most projects take 8-12 weeks from start to finish. Rush jobs are possible but usually result in corners being cut. We'd rather do it right than do it fast."
                }
              },
              {
                "@type": "Question",
                "name": "Can you redesign my existing website without losing my current rankings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We specialize in redesigns that preserve (and often improve) SEO performance. It requires careful planning, but it's definitely doable."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with WordPress, or do you use other platforms?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We work with whatever platform makes sense for your business. WordPress, Shopify, custom builds - we choose based on your needs, not our preferences."
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">💻 SEO Website Development Experts</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Stop Building Websites
                </span>
                <br />
                <span className="text-green-600">
                  That Google Ignores
                </span>
              </h1>
              
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 mb-8 text-left max-w-3xl mx-auto">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Last month, a jewelry business owner from Delhi called me, frustrated. They'd spent ₹2.5 lakhs on a "stunning" website that looked like it belonged in a design magazine. Six months later? Zero organic traffic.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>The problem?</strong> Their developer built a beautiful website that Google couldn't understand, crawl, or rank.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Here's what I've learned after building websites for 13+ years: <strong>Pretty doesn't pay the bills. Performance does.</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Most web developers build first, optimize later (if at all). At <strong>SEOShouts</strong>, we flip that approach. Every line of code, every design decision, every technical choice is made with one question in mind: "Will this help or hurt search rankings?"
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact/"
                  className="group px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-green-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get SEO website development quote"
                >
                  🚀 Let's Build Something That Actually Ranks
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-green-600 hover:text-green-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEO Shouts for website development"
                >
                  📞 Call +91 8094888157
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* The Brutal Truth Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                The Brutal Truth About Most "SEO-Friendly" Websites
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                I've audited hundreds of websites over the years, and honestly? Most of them are SEO disasters wrapped in pretty designs.
              </p>

              <div className="bg-red-50 rounded-2xl p-6 sm:p-8 mb-8 border border-red-200">
                <h3 className="text-2xl font-bold mb-6 text-center text-red-800">Here's what I find all the time:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Sites that take 12+ seconds to load on mobile (Google gives up after 3)</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Beautiful images that are 8MB files nobody optimized</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">URLs like "yoursite.com/page1?id=12345&category=xyz"</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Zero schema markup, so Google has no clue what your business actually does</p>
                  </div>
                  <div className="flex items-start space-x-4 md:col-span-2 justify-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Mobile designs that break on real Indian mobile networks</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-700 mb-4">
                  The worst part? These problems are baked into the foundation. You can't fix them with plugins or patches later. You need to rebuild from scratch.
                </p>
                <p className="text-xl font-bold bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                  That's expensive. That's why we build it right the first time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Build Websites Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">How We Actually Build Websites That Dominate Search</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our approach puts SEO at the foundation, not as an afterthought
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Site Architecture */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🏗️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Plan Your Site Architecture Like Military Strategy</h3>
                <p className="text-gray-600 mb-6">Before we write a single line of code, we map out your entire site structure like we're planning a military campaign.</p>
                <p className="text-gray-600 mb-6"><strong>What this looks like:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Every URL is designed to make sense to both users and search bots</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>We create logical content hierarchies that flow page authority where you need it</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Internal linking strategies that guide visitors (and Google) through your site</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Schema markup planned for every page type and business entity</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Mobile-first architecture that works on everything from the latest iPhone to a ₹5,000 Android</li>
                </ul>
                <p className="text-sm text-gray-500 italic">Why this matters: Google needs to understand your site structure instantly. Confuse the bots, lose the rankings.</p>
              </div>

              {/* Site Speed */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Obsess Over Site Speed (Because Google Does Too)</h3>
                <p className="text-gray-600 mb-6">I remember one client whose "fast" website was taking 18 seconds to load. Their previous developer swore it was optimized. Turns out, they had 47 different JavaScript files loading on every page.</p>
                <p className="text-gray-600 mb-6"><strong>Our performance approach:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>We optimize images before they even touch your server (we're talking 70-80% file size reductions)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Custom caching strategies that make your pages load in under 2 seconds</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Code that's cleaner than my grandmother's kitchen</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>CDN setup that serves your content from servers closest to your customers</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Database optimization that prevents crashes during traffic spikes</li>
                </ul>
                <p className="text-sm text-gray-500 italic">The result: Websites that load fast enough to keep impatient Indian mobile users happy.</p>
              </div>

              {/* Content Management */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Build Content Management That Makes SEO Easy</h3>
                <p className="text-gray-600 mb-6">Look, you shouldn't need a computer science degree to update your website content without breaking your SEO.</p>
                <p className="text-gray-600 mb-6"><strong>What we build for you:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>CMS interfaces that prompt you to optimize as you write</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Automated XML sitemaps that update every time you add content</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Built-in SEO checklists that prevent common mistakes</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>One-click social media integration that doesn't slow down your site</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Content templates that maintain SEO structure while giving you creative freedom</li>
                </ul>
                <p className="text-sm text-gray-500 italic">So you can focus on running your business instead of fighting with your website.</p>
              </div>

              {/* eCommerce Sites */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🛒</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Make eCommerce Sites That Actually Sell</h3>
                <p className="text-gray-600 mb-6">Building an eCommerce site that ranks and converts? That's a whole different beast. I've seen beautiful online stores with zero sales because nobody optimized the buying process.</p>
                <p className="text-gray-600 mb-6"><strong>Our eCommerce development includes:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Product pages that rank for buying keywords, not just brand names</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Category structures that make sense to customers and search engines</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Shopping cart systems that don't break under pressure</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Review systems that generate fresh content and build trust</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Product schema that gets your items into Google Shopping results</li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means your products show up when people are ready to buy.</p>
              </div>

              {/* Local Business Websites */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📍</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Nail Local Business Websites (Especially Multi-Location)</h3>
                <p className="text-gray-600 mb-6">Managing SEO for multiple business locations? It's like juggling flaming torches while riding a unicycle. Possible, but you better know what you're doing.</p>
                <p className="text-gray-600 mb-6"><strong>For local businesses, we handle:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Google Business Profile integration that actually works</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Location-specific landing pages that don't confuse Google</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>NAP (Name, Address, Phone) consistency across every page and platform</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Local schema markup that tells Google exactly what you do and where</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Review integration that showcases your reputation</li>
                </ul>
                <p className="text-sm text-gray-500 italic">So you dominate local search in every city you serve.</p>
              </div>

              {/* Conversion Machines */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">💰</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Build Conversion Machines, Not Just Pretty Websites</h3>
                <p className="text-gray-600 mb-6">Rankings without conversions are like having a Ferrari with no engine. Looks impressive, goes nowhere.</p>
                <p className="text-gray-600 mb-6"><strong>Our conversion optimization includes:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>User experience testing on real devices with real Indian internet speeds</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>A/B testing frameworks built into your site architecture</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Lead capture forms that don't scare away visitors</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Call-to-action placement that guides users toward your goals</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Analytics setup that tracks what actually matters for your business</li>
                </ul>
                <p className="text-sm text-gray-500 italic">Because we want you to make money, not just impress visitors.</p>
              </div>
            </div>

            {/* CTA in Services Section */}
            <div className="text-center">
              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                aria-label="Get started with SEO website development"
              >
                Start Your SEO Website Project Today
              </a>
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">How We Actually Build Your Website (The Real Process)</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A transparent, step-by-step process that puts your business goals first
              </p>
            </div>

            <div className="space-y-12">
              {/* Weeks 1-2 */}
              <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">1-2</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">We Become Experts on Your Business</h3>
                    <p className="text-gray-500">Weeks 1-2</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">We don't just ask "what colors do you like?" We dig deep into your business model, competition, and customers.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">What happens:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>I personally interview you about your business goals and challenges</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>We research your competitors' websites and find their weaknesses</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>We analyze your target audience's search behavior</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>We plan your site structure and content strategy</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>We choose the right platform and technology stack</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎯</span>
                      </div>
                      <h5 className="font-semibold text-gray-900">Discovery & Strategy</h5>
                      <p className="text-sm text-gray-600 mt-2">Foundation planning for long-term success</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weeks 3-8 */}
              <div className="bg-emerald-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">3-8</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Development That Makes Sense</h3>
                    <p className="text-gray-500">Weeks 3-8</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">No cookie-cutter templates here. Every website is built specifically for your business and your customers.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Development includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Custom design that reflects your brand while optimizing for conversions</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Clean, efficient code that loads fast and scales with your business</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Mobile-first responsive design that works on every device</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>SEO optimization built into every page and feature</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Integration with tools you actually use</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">💻</span>
                      </div>
                      <h5 className="font-semibold text-gray-900">Custom Development</h5>
                      <p className="text-sm text-gray-600 mt-2">Building your unique digital presence</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weeks 6-10 */}
              <div className="bg-teal-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">6-10</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Content That Converts and Ranks</h3>
                    <p className="text-gray-500">Weeks 6-10</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">Content isn't just words on a page. It's your sales team working 24/7.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Our content approach:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>SEO-optimized copy that speaks to humans, not robots</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Strategic keyword integration that feels natural</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Compelling calls-to-action that guide visitors toward purchases</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Image optimization that maintains quality while improving speed</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Schema markup that helps Google understand your content</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📝</span>
                      </div>
                      <h5 className="font-semibold text-gray-900">Content Creation</h5>
                      <p className="text-sm text-gray-600 mt-2">Words that work around the clock</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weeks 9-12 */}
              <div className="bg-cyan-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">9-12</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Testing Like Your Business Depends on It (Because It Does)</h3>
                    <p className="text-gray-500">Weeks 9-12</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">We don't guess. We test everything.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Quality assurance includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Performance testing across different devices and connection speeds</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>User experience testing with real people</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>SEO validation to ensure everything's optimized</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Security testing to protect your business and customers</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Cross-browser compatibility checks</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🧪</span>
                      </div>
                      <h5 className="font-semibold text-gray-900">Testing & QA</h5>
                      <p className="text-sm text-gray-600 mt-2">Ensuring everything works perfectly</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Week 12+ */}
              <div className="bg-blue-50 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">12+</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Launch and Beyond</h3>
                    <p className="text-gray-500">Week 12+</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">Launching is just the beginning. A good website needs ongoing care and optimization.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Post-launch support:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Search engine submission and indexing acceleration</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Performance monitoring and optimization recommendations</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Training your team on content management and basic SEO</li>
                      <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Ongoing support for technical issues and updates</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚀</span>
                      </div>
                      <h5 className="font-semibold text-gray-900">Launch & Support</h5>
                      <p className="text-sm text-gray-600 mt-2">Your website's journey begins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We're Different */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-gray-900">Why We're Different from</span>
                <br />
                <span className="text-green-600">Other Web Developers</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                13+ years of building websites that actually work for businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-8">
              {/* SEO Understanding */}
              <div className="xl:col-span-1 group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">
                    We Actually Understand SEO (Not Just the Buzzwords)
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Most web developers know SEO exists. We've been doing it professionally for 13+ years. There's a difference.
                  </p>
                </div>
              </div>

              {/* India Focus */}
              <div className="xl:col-span-1 group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🇮🇳</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">
                    We Build for India's Real Internet Conditions
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Slow mobile networks, diverse devices, varying connection speeds. We test on actual Indian internet conditions, not just fast office WiFi.
                  </p>
                </div>
              </div>

              {/* Long-term Commitment */}
              <div className="xl:col-span-1 group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">
                    We Don't Disappear After Launch
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your website is a business asset that needs ongoing care. We're here for the long term, not just the initial build.
                  </p>
                </div>
              </div>

              {/* Business Focus */}
              <div className="xl:col-span-1 group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">💼</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">
                    We Speak Business, Not Just Tech
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We understand that your website needs to make money, not just win design awards. Every decision supports your business goals.
                  </p>
                </div>
              </div>

              {/* Honest Communication */}
              <div className="xl:col-span-1 group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">
                    We're Honest About Timelines and Costs
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    No surprises, no hidden fees, no "oh, we forgot to mention that'll be extra." Just straight talk about what it takes to build a great website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 sm:py-24 bg-green-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">What It Actually Costs to Build a Website That Works</h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <p className="text-lg text-white/90 mb-6">
                  Every business has different needs, so every project has different costs. Here's what affects pricing:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white"><strong>Website complexity and features needed</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white"><strong>Number of pages and content requirements</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white"><strong>eCommerce functionality and product catalog size</strong></span></li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white"><strong>Custom features and third-party integrations</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white"><strong>Ongoing maintenance and support needs</strong></span></li>
                  </ul>
                </div>
              </div>

              <p className="text-white/90 mb-8">
                <strong>Want to know what your specific project would cost?</strong> Let's have a conversation about your needs and goals.
              </p>

              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                aria-label="Get custom website development quote"
              >
                Get Your Custom Quote Today
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Questions You're Probably Asking</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Common questions about our SEO website development process
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How long does it actually take to build a website?</h3>
                  <p className="text-gray-600">Most projects take 8-12 weeks from start to finish. Rush jobs are possible but usually result in corners being cut. We'd rather do it right than do it fast.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Can you redesign my existing website without losing my current rankings?</h3>
                  <p className="text-gray-600">Absolutely. We specialize in redesigns that preserve (and often improve) SEO performance. It requires careful planning, but it's definitely doable.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What if I need to make changes after the website is built?</h3>
                  <p className="text-gray-600">That's what content management systems are for. We build websites that you can update yourself, and we train you how to do it without breaking anything.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Do you work with WordPress, or do you use other platforms?</h3>
                  <p className="text-gray-600">We work with whatever platform makes sense for your business. WordPress, Shopify, custom builds - we choose based on your needs, not our preferences.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What happens if something breaks or needs updating?</h3>
                  <p className="text-gray-600">We offer ongoing maintenance packages, or we can train your team to handle basic updates. Complex technical issues? We're always here to help.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Can you integrate with my existing business systems?</h3>
                  <p className="text-gray-600">Most likely, yes. CRM integration, email marketing tools, inventory systems - we've connected websites to all sorts of business tools.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How do you handle mobile optimization?</h3>
                  <p className="text-gray-600">We build mobile-first, meaning we design for mobile devices first, then enhance for desktop. This ensures your site works perfectly on the devices most of your customers use.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-green-600 to-emerald-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Build a Website That Actually Works for Your Business?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Stop settling for websites that look pretty but don't perform. Let's build something that attracts customers, ranks in search engines, and grows your revenue. <strong>SEOShouts' development team</strong> doesn't just build websites - we build business assets that work around the clock to grow your company.
              </p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Let's Start Building:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Get Your Website Development Quote</p>
                      <p className="text-white/80 text-sm">Tell us about your project and get a custom proposal</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Call: +91 8094888157</p>
                      <p className="text-white/80 text-sm">Talk directly with our development team</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Email: contact@seoshouts.com</p>
                      <p className="text-white/80 text-sm">Share your website ideas and business goals</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Schedule a Website Strategy Call</p>
                      <p className="text-white/80 text-sm">Get expert advice on your website project</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact/"
                  className="group px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get website development quote from SEOShouts"
                >
                  🎯 Get Your Website Development Quote
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEOShouts for website development"
                >
                  📞 Call +91 8094888157
                </a>
              </div>

              <p className="text-white/80 mt-6">
                <strong>Building high-performance websites for businesses across India</strong>
              </p>
              
              <p className="text-white/70 mt-4 text-sm">
                <strong>Ready for a website that actually works?</strong> Our team at SEOShouts has been building and optimizing websites for over 13 years. We know what works, what doesn't, and what it takes to create websites that rank high and convert visitors into customers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
