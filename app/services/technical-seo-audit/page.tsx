import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical SEO Audit Services - Uncover Hidden Issues Killing Your Rankings | SEO Shouts',
  description: 'Professional Technical SEO Audit services by SEOShouts. Site speed optimization, mobile SEO, Core Web Vitals, schema markup, and security audits. Get your custom quote today.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/technical-seo-audit/',
  },
  openGraph: {
    title: 'Technical SEO Audit Services - Uncover Hidden Issues Killing Your Rankings | SEO Shouts',
    description: 'Professional Technical SEO Audit services including site speed optimization, mobile SEO, Core Web Vitals, schema markup, and security audits for Indian websites.',
    url: 'https://seoshouts.com/services/technical-seo-audit/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/technical-seo-audit-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Technical SEO Audit Services by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical SEO Audit Services - Uncover Hidden Issues Killing Your Rankings | SEO Shouts',
    description: 'Professional Technical SEO Audit services by SEOShouts. Site speed, mobile optimization, Core Web Vitals, and security audits.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/technical-seo-audit-twitter-image.jpg'],
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

export default function TechnicalSEOAuditServicePage() {
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
                "item": "https://seoshouts.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://seoshouts.com/services/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Technical SEO Audit",
                "item": "https://seoshouts.com/services/technical-seo-audit/"
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
            "name": "Technical SEO Audit Services",
            "description": "Comprehensive Technical SEO Audit services including site speed optimization, mobile SEO, Core Web Vitals analysis, schema markup implementation, and security audits.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "serviceType": "Technical SEO Audit Services",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Technical SEO Audit Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Site Speed Optimization"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile SEO Audit"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Core Web Vitals Analysis"
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
                "name": "How long does this actually take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most comprehensive audits are completed within 3-4 weeks. Rush jobs are available for an additional fee, but honestly, a thorough audit takes time to do right."
                }
              },
              {
                "@type": "Question",
                "name": "Will this help my Core Web Vitals scores?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. Core Web Vitals optimization is a major focus of every audit. We often help sites improve their scores dramatically."
                }
              },
              {
                "@type": "Question",
                "name": "Can you actually implement the fixes, or just identify them?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We can do both. While our audit gives you everything needed for implementation, we also offer hands-on technical services if your team needs help."
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-orange-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">🔍 Technical SEO Specialists</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  Technical SEO Audit Services
                </span>
                <br />
                <span className="text-red-600">
                  Uncover Hidden Issues Killing Your Rankings
                </span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
                The Truth About Why Your Website Isn't Ranking (And How to Fix It)
              </h2>
              
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 mb-8 text-left max-w-3xl mx-auto">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Three weeks ago, a furniture retailer from Mumbai called us in a panic. Their organic traffic had dropped 60% overnight, and they couldn't figure out why. Within 2 hours of running our technical audit, we found the culprit: a botched website update had created 1,200+ crawl errors that were blocking Google from seeing most of their product pages.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Sound familiar? You're not alone.</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Here's the thing about technical SEO - your website might look fantastic on the surface, but there could be dozens of invisible problems hemorrhaging your search rankings. <strong>SEOShouts' comprehensive Technical SEO Audit</strong> finds every single one of them and shows you exactly how to fix them.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact/"
                  className="group px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-red-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get free Technical SEO audit"
                >
                  🚀 Get Your FREE Technical SEO Audit
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-red-600 hover:text-red-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEO Shouts for Technical SEO consultation"
                >
                  📞 Call +91 8094888157
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Hidden Problems Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                The Hidden Problems That Are Costing You Traffic (And Money)
              </h2>
              
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8">
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Look, after 13+ years in the SEO trenches, we've seen it all. Beautiful websites that load slower than dial-up internet. "SEO-optimized" sites with 847 crawl errors. Mobile-friendly designs that break on actual Indian mobile networks.
                </p>

                <h3 className="text-2xl font-bold mb-6 text-center">Here's what's probably happening to your site right now:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Your pages are taking 8+ seconds to load on mobile (the average Indian user gives up after 3)</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Google's bots are getting confused by duplicate content issues you don't even know exist</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Your internal links are creating dead ends that waste crawl budget</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Image files are so massive they're choking your server</p>
                  </div>
                  <div className="flex items-start space-x-4 md:col-span-2 justify-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">⚠️</span>
                    </div>
                    <p className="text-gray-700">Broken schema markup is making you invisible in rich results</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-700 font-semibold bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <strong>Bottom line</strong>: Even if you're doing everything else right with content and backlinks, these technical issues are like having a Ferrari with flat tires. You're not going anywhere fast.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Actually Do Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">What We Actually Do in Our Technical SEO Audit</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive technical analysis that uncovers every issue hurting your search performance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Crawlability Issues */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🕷️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Hunt Down Every Crawlability Issue on Your Site</h3>
                <p className="text-gray-600 mb-6">Ever wondered why Google isn't indexing your important pages? We find out.</p>
                <p className="text-gray-600 mb-6">When we crawl your site, we're looking for the silent traffic killers:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Your robots.txt file accidentally blocking important pages</strong> (happens more than you'd think)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Broken internal links creating dead ends</strong> for both users and search bots</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>XML sitemap errors</strong> that are confusing Google about your site structure</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Crawl budget waste</strong> - especially critical for large sites with 1,000+ pages</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><strong>Orphaned pages sitting in no-man's land</strong> with no internal links pointing to them</li>
                </ul>
                <p className="text-sm text-gray-500 italic">Here's what this means for you: Google will efficiently discover and index all your valuable content, instead of wasting time on pages that don't matter.</p>
              </div>

              {/* Site Speed Issues */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Fix Your Site Speed Issues (The #1 Ranking Killer)</h3>
                <p className="text-gray-600 mb-6">I remember one client in Rajasthan whose site was taking 18 seconds to load on mobile. Turns out, their hero image was a 12MB file that nobody had optimized. One quick fix, and boom - 3-second load times.</p>
                <p className="text-gray-600 mb-6"><strong>What we analyze:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Page speed across different devices and connection speeds (crucial for India's varied internet infrastructure)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Core Web Vitals performance (Google's newest ranking factors)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Image optimization opportunities (we often find 70%+ file size reductions)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>JavaScript and CSS bloat that's slowing everything down</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Server response times and hosting performance issues</li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means your visitors get lightning-fast experiences, and Google rewards you with higher rankings.</p>
              </div>

              {/* Mobile Optimization */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📱</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Make Your Site Actually Work on Mobile</h3>
                <p className="text-gray-600 mb-6">Working with Indian websites, we've noticed some unique challenges. Mobile optimization that works in Mumbai but breaks in Tier-2 cities with slower connections. Touch elements so small you need a microscope to tap them.</p>
                <p className="text-gray-600 mb-6"><strong>Our mobile audit covers:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Real-world usability testing on actual devices</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Touch element spacing and navigation flow</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Mobile page speed optimization for slower networks</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Responsive design issues that break on different screen sizes</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Mobile-first indexing compliance (Google's primary ranking system)</li>
                </ul>
                <p className="text-sm text-gray-500 italic">So your website delivers exceptional experiences on the devices where 80% of your Indian traffic actually comes from.</p>
              </div>

              {/* Technical Elements */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🔧</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Perfect Every Technical Element on Your Pages</h3>
                <p className="text-gray-600 mb-6">Honestly, this is where most agencies drop the ball. They'll optimize your title tags but completely ignore the technical structure that makes or breaks your rankings.</p>
                <p className="text-gray-600 mb-6"><strong>What we fix:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Title tags and meta descriptions that are actually compelling (not just keyword-stuffed)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Header tag hierarchy that makes sense to both users and bots</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>URL structure optimization (we've seen some real nightmares)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Image alt text that helps with both accessibility and rankings</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Internal linking strategy that flows page authority where it needs to go</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Duplicate content issues that are confusing search engines</li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means every page sends crystal-clear signals to Google about what it should rank for.</p>
              </div>

              {/* Schema Markup */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🏷️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Implement Schema Markup That Actually Works</h3>
                <p className="text-gray-600 mb-6">Most sites either have no structured data or broken schema that's doing nothing. We fix both problems.</p>
                <p className="text-gray-600 mb-6"><strong>Our schema implementation:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Current markup validation and error fixing</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Strategic schema opportunities you're missing</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Rich snippet optimization for better click-through rates</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>FAQ, Product, and Local Business schema setup</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Testing and validation to ensure everything works</li>
                </ul>
                <p className="text-sm text-gray-500 italic">So your pages stand out in search results with rich snippets and enhanced visibility.</p>
              </div>

              {/* Security */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🔒</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We Secure Your Site and Fix Trust Issues</h3>
                <p className="text-gray-600 mb-6">Nothing kills rankings faster than security problems. We've seen sites get completely deindexed for malware they didn't even know existed.</p>
                <p className="text-gray-600 mb-6"><strong>Security audit includes:</strong></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>SSL certificate setup and configuration</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Mixed content issues that break HTTPS</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Security headers analysis</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Malware and vulnerability scanning</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>Google Safe Browsing status check</li>
                </ul>
                <p className="text-sm text-gray-500 italic">Which means your visitors trust your site, and Google doesn't penalize you for security issues.</p>
              </div>
            </div>

            {/* CTA in Services Section */}
            <div className="text-center">
              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
                aria-label="Get started with Technical SEO audit"
              >
                Get Your Technical SEO Audit Started
              </a>
            </div>
          </div>
        </section>

        {/* How We Conduct Audit Process */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">How We Actually Conduct Your Technical SEO Audit</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A thorough 4-week process that leaves no stone unturned
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Week 1 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">1</div>
                  <h3 className="text-xl font-bold mb-3">Deep Dive Investigation</h3>
                  <p className="text-sm text-gray-500 mb-4">Week 1</p>
                  <p className="text-sm text-gray-600 mb-4">We don't just run automated tools and call it a day. Our team manually reviews your site architecture, checks your Google Search Console data, and identifies issues that automated tools miss.</p>
                  <p className="text-sm font-semibold text-gray-700 mb-2">What happens:</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Complete site crawl using professional tools (Screaming Frog, SEMrush, Ahrefs)</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Google Search Console deep dive and historical analysis</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Competitor technical analysis to see where you're falling behind</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Manual testing on actual devices and connection speeds</li>
                  </ul>
                </div>
              </div>

              {/* Week 2 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">2</div>
                  <h3 className="text-xl font-bold mb-3">The Real Technical Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">Week 2</p>
                  <p className="text-sm text-gray-600 mb-4">This is where we get into the nitty-gritty. Core Web Vitals testing, mobile usability analysis, security scanning - basically, we stress-test your site from every angle.</p>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Key activities:</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Page speed testing across multiple scenarios</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Mobile usability testing on real devices</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Security vulnerability assessment</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Schema markup validation and opportunity analysis</li>
                  </ul>
                </div>
              </div>

              {/* Week 3 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">3</div>
                  <h3 className="text-xl font-bold mb-3">Building Your Custom Action Plan</h3>
                  <p className="text-sm text-gray-500 mb-4">Week 3</p>
                  <p className="text-sm text-gray-600 mb-4">We don't just tell you what's broken - we tell you exactly how to fix it, in order of priority.</p>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Report creation includes:</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Issues categorized by impact and difficulty</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Step-by-step fix instructions your developer can follow</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Before/after impact projections</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Timeline and resource requirements</li>
                  </ul>
                </div>
              </div>

              {/* Week 4 */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">4</div>
                  <h3 className="text-xl font-bold mb-3">Strategy Session & Implementation Support</h3>
                  <p className="text-sm text-gray-500 mb-4">Week 4</p>
                  <p className="text-sm text-gray-600 mb-4">We walk you through everything, answer your questions, and help you create an implementation roadmap that fits your resources.</p>
                  <p className="text-sm font-semibold text-gray-700 mb-2">What you get:</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Detailed report walkthrough with our team</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Priority implementation roadmap</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Technical implementation guidance</li>
                    <li className="flex items-start"><span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>Follow-up support options</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's in Your Report */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">What's Actually in Your Technical SEO Audit Report</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A comprehensive, actionable document that your team can use immediately
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Executive Summary */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📋</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">The Executive Summary (For Decision Makers)</h3>
                <p className="text-gray-600 mb-4">Cut through the technical jargon and get straight to what matters:</p>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Critical issues that need immediate attention</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Traffic and ranking improvement opportunities</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Implementation priorities based on your goals and resources</li>
                </ul>
              </div>

              {/* Technical Deep Dive */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🔧</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">The Technical Deep Dive (For Your Development Team)</h3>
                <p className="text-gray-600 mb-4">Every issue explained in detail with:</p>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Screenshot evidence and clear explanations</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Step-by-step fix instructions</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Code examples where applicable</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Tool recommendations for ongoing monitoring</li>
                </ul>
              </div>

              {/* Performance Benchmarks */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📊</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Performance Benchmarks (So You Know Where You Stand)</h3>
                <p className="text-gray-600 mb-4">We compare your site against:</p>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Direct competitors in your industry</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Industry standards for your sector</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Our database of high-performing sites</li>
                </ul>
              </div>

              {/* 90-Day Action Plan */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">🗓️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Your 90-Day Action Plan (What to Do First)</h3>
                <p className="text-gray-600 mb-4">A prioritized roadmap that includes:</p>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>30-day quick wins for immediate improvements</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>60-day medium-priority optimizations</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>90-day long-term technical enhancements</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Success metrics to track your progress</li>
                </ul>
              </div>
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
                <span className="text-red-600">SEOShouts for Your Technical Audit?</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                13+ years of technical SEO expertise you can trust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Experience Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🏆</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                    We've Been in the Trenches for 13+ Years
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We've audited everything from small WordPress sites to massive eCommerce stores with 50,000+ pages. There's no technical problem we haven't seen (and solved).
                  </p>
                </div>
              </div>

              {/* Indian Websites Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🇮🇳</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                    We Actually Understand Indian Websites
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Shared hosting providers that oversell resources. WordPress sites running 47 plugins (we counted). Mobile optimization challenges on slower networks. We get it because we work with it every day.
                  </p>
                </div>
              </div>

              {/* Developer-Friendly Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">👨‍💻</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                    Our Reports Are Developer-Friendly
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    No confusing jargon or vague recommendations. Your development team will get clear, actionable instructions they can implement immediately.
                  </p>
                </div>
              </div>

              {/* Professional Tools Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🛠️</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                    We Use Professional-Grade Tools
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Not just free online checkers. We use the same tools that enterprise SEO agencies use - Screaming Frog, SEMrush Site Audit, Ahrefs, and custom scripts we've developed.
                  </p>
                </div>
              </div>

              {/* Platform Agnostic Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                    We're Platform Agnostic
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    WordPress, Shopify, Magento, custom PHP builds - we've optimized them all. Our recommendations work regardless of your platform.
                  </p>
                </div>
              </div>

              {/* Ongoing Support Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-600/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                    Support Doesn't End with the Report
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Stuck during implementation? Got questions? We're here to help, not just deliver a report and disappear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Section */}
        <section className="py-16 sm:py-24 bg-red-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Technical SEO Audit Investment</h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <p className="text-lg text-white/90 mb-6">
                  Our comprehensive Technical SEO Audit is priced based on your website's complexity and your specific needs. No cookie-cutter packages - just fair pricing for the work required.
                </p>
                
                <h3 className="text-2xl font-bold text-white mb-4">Every audit includes:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Complete technical analysis (usually 40-80 pages of detailed findings)</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Priority-based implementation roadmap</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">1-hour strategy session to review everything</span></li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">30 days of implementation support via email</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-white">Optional follow-up audit after 60 days</span></li>
                  </ul>
                </div>
              </div>

              <p className="text-white/90 mb-8">
                <strong>Want to know the investment for your specific site?</strong> Contact us for a custom quote.
              </p>

              <a 
                href="/contact/"
                className="inline-block px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                aria-label="Get custom quote for Technical SEO audit"
              >
                Get Your Custom Quote Today
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Questions We Get About Technical SEO Audits</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Common questions about our Technical SEO audit process
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How long does this actually take?</h3>
                  <p className="text-gray-600">Most comprehensive audits are completed within 3-4 weeks. Rush jobs are available for an additional fee, but honestly, a thorough audit takes time to do right.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What if my site is huge (10,000+ pages)?</h3>
                  <p className="text-gray-600">We love big sites! Our process scales based on size and complexity. Large sites often have more opportunities for dramatic improvements.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Can you actually implement the fixes, or just identify them?</h3>
                  <p className="text-gray-600">We can do both. While our audit gives you everything needed for implementation, we also offer hands-on technical services if your team needs help.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Will this help my Core Web Vitals scores?</h3>
                  <p className="text-gray-600">Absolutely. Core Web Vitals optimization is a major focus of every audit. We often help sites improve their scores dramatically.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">What about international sites with multiple languages?</h3>
                  <p className="text-gray-600">We have extensive experience with complex international sites. Hreflang implementation, regional targeting, multi-language technical challenges - we handle it all.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">How often should I get audited?</h3>
                  <p className="text-gray-600">For most sites, annually is sufficient. Larger sites or those undergoing frequent changes might benefit from quarterly mini-audits.</p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">Do you work with WordPress specifically?</h3>
                  <p className="text-gray-600">WordPress is our bread and butter. We know the platform inside and out, including common plugin conflicts and theme-specific issues.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-red-600 to-orange-600">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to See What's Really Happening Under the Hood?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Stop guessing why your rankings aren't improving. Let's find out exactly what's wrong and how to fix it. <strong>SEOShouts' Technical SEO experts</strong> will conduct a thorough investigation of your site and give you a crystal-clear roadmap to technical excellence.
              </p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Let's Get Started:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Request Your Technical SEO Audit Quote</p>
                      <p className="text-white/80 text-sm">Get a custom proposal for your specific website</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Call: +91 8094888157</p>
                      <p className="text-white/80 text-sm">Talk directly with our technical team</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Email: seoshouts@gmail.com</p>
                      <p className="text-white/80 text-sm">Tell us about your technical challenges</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Book a Technical Consultation</p>
                      <p className="text-white/80 text-sm">Get expert advice on your site's technical health</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact/"
                  className="group px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Request Technical SEO audit quote from SEOShouts"
                >
                  🎯 Request Your Technical SEO Audit Quote
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+918094888157"
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEOShouts for Technical SEO consultation"
                >
                  📞 Call +91 8094888157
                </a>
              </div>

              <p className="text-white/80 mt-6">
                <strong>Based in Udaipur, Rajasthan - serving websites across India and beyond</strong>
              </p>
              
              <p className="text-white/70 mt-4 text-sm">
                <strong>Got specific technical concerns?</strong> Our team has seen every technical nightmare imaginable (and fixed most of them). With 13+ years of experience and a track record of solving complex technical problems, we'll help you build the solid foundation your SEO needs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
