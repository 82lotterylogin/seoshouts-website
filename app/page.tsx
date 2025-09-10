import type { Metadata } from 'next'
import NewsletterFormSection from './components/NewsletterFormSection'
import InquiryForm from './components/InquiryForm'

export const metadata: Metadata = {
  title: 'SEO Shouts - Professional SEO Tools & Services | Free Website Analysis',
  description: 'Professional SEO tools and services for businesses worldwide. Get free SEO analysis, keyword research, technical audits, and expert SEO consulting. 11+ free tools available.',
  keywords: 'SEO tools, SEO services, free SEO analysis, keyword research, technical SEO, link building, local SEO, SEO consulting',
  authors: [{ name: 'SEO Shouts' }],
  creator: 'SEO Shouts',
  publisher: 'SEO Shouts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com',
  },
  openGraph: {
    title: 'SEO Shouts - Professional SEO Tools & Services',
    description: 'Professional SEO tools and services for businesses worldwide. Get free SEO analysis, keyword research, technical audits, and expert SEO consulting.',
    url: 'https://seoshouts.com',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts - Professional SEO Tools and Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Shouts - Professional SEO Tools & Services',
    description: 'Professional SEO tools and services for businesses worldwide. 11+ free tools available.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/twitter-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

// Fetch latest blog posts from database
async function fetchLatestBlogPosts() {
  try {
    const { getDatabase } = await import('./lib/database');
    const db = getDatabase();
    
    const articles = db.prepare(`
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.featured_image,
        a.published_at,
        a.created_at,
        auth.name as author_name
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      WHERE a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT 3
    `).all() as any[];
    
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      featured_image: article.featured_image,
      published_at: article.published_at,
      created_at: article.created_at,
      author: {
        name: article.author_name
      }
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch latest blog posts from database
  const blogPosts = await fetchLatestBlogPosts();
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
            "name": "SEO Services",
            "description": "Professional SEO services including local SEO, eCommerce SEO, link building, technical audits, and SEO consulting.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "serviceType": "SEO Services",
            "offers": [
              {
                "@type": "Offer",
                "name": "Local SEO",
                "description": "Dominate local search results and Google My Business optimization.",
                "url": "https://seoshouts.com/services/local-seo"
              },
              {
                "@type": "Offer", 
                "name": "eCommerce SEO",
                "description": "Increase online sales with specialized eCommerce SEO strategies.",
                "url": "https://seoshouts.com/services/ecommerce-seo"
              }
            ]
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
                "name": "What SEO tools do you offer for free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer 11+ free SEO tools including keyword density analyzer, meta tag optimizer, website speed test, robots.txt generator, XML sitemap generator, content analyzer, and more."
                }
              },
              {
                "@type": "Question",
                "name": "Do you provide professional SEO services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we provide professional SEO services including local SEO, eCommerce SEO, link building, technical SEO audits, and SEO consulting for businesses worldwide."
                }
              }
            ]
          })
        }}
      />

      <div>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-8 sm:py-12 lg:py-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gray-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-spin-slow"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-6 sm:mb-8">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">✨ Free Website Analysis + Professional SEO Services</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
                  SEOShouts Complete SEO
                </span>
                <br />
                <span className="text-primary">
                  Solutions
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
                From <span className="font-semibold text-primary">free SEO analysis</span> to 
                <span className="font-semibold text-gray-700"> professional SEO services</span> - 
                everything you need to dominate search rankings and grow your business.
              </p>

              {/* Website Analysis Input Section */}
              <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      Step 1: Analyze your website
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Enter your website URL below to get started with your free SEO analysis
                    </p>
                  </div>
                  
                  <InquiryForm />
                    
                    {/* Analysis Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">SEO Score Analysis</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Core Web Vitals Check</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Optimization Suggestions</span>
                      </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 sm:mt-8 text-gray-600">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" aria-hidden="true">⚡</span>
                    <span className="font-medium">Results in 60 seconds</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" aria-hidden="true">🔒</span>
                    <span className="font-medium">100% Free & Secure</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" aria-hidden="true">📊</span>
                    <span className="font-medium">Detailed SEO Report</span>
                  </div>
                </div>
              </div>
              
              {/* Secondary CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                <a 
                  href="/services/" 
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
                  aria-label="View our professional SEO services"
                >
                  🎯 View SEO Services
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                
                <a 
                  href="/tools/" 
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-gray-400 hover:text-gray-800 transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
                  aria-label="Browse our free SEO tools"
                >
                  🔧 Browse Free Tools
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Professional SEO Services Section */}
        <section id="services" className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium mb-6">
                <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                Professional SEO Services
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Expert SEO Services
                </span>
                <br />
                <span className="text-primary">
                  That Drive Results
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Professional SEO services tailored to your business needs. From local visibility to enterprise-level optimization.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Local SEO Service */}
              <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">📍</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Local SEO
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Dominate local search results and Google My Business. Perfect for restaurants, law firms, medical practices, and local businesses.
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Google My Business optimization</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Local citations and directories</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Review management strategy</li>
                  </ul>
                  <a 
                    href="/services/local-seo/"
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                    aria-label="Get Local SEO service quote"
                  >
                    Get Local SEO Quote
                  </a>
                </div>
              </article>

              {/* eCommerce SEO Service */}
              <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🛒</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    eCommerce SEO
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Increase online sales with specialized eCommerce SEO. Product optimization, category pages, and conversion-focused strategies.
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Product page optimization</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Category structure optimization</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Shopping feed optimization</li>
                  </ul>
                  <a 
                    href="/services/ecommerce-seo/"
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                    aria-label="Get eCommerce SEO service quote"
                  >
                    Get eCommerce Quote
                  </a>
                </div>
              </article>

              {/* Link Building Service */}
              <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🔗</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Link Building
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    High-quality backlink acquisition from authoritative websites. White-hat strategies that improve domain authority and rankings.
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>High-authority backlinks</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Guest posting campaigns</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Broken link building</li>
                  </ul>
                  <a 
                    href="/services/link-building/"
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                    aria-label="Get Link Building service quote"
                  >
                    Get Link Building Quote
                  </a>
                </div>
              </article>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Technical SEO Audit Service */}
              <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🔧</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Technical SEO Audit
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Comprehensive technical analysis of your website. Identify and fix crawling issues, site speed problems, and technical barriers to ranking.
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Core Web Vitals optimization</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Site architecture analysis</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Mobile usability audit</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Schema markup implementation</li>
                  </ul>
                  <a 
                    href="/services/technical-seo-audit/"
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                    aria-label="Get Technical SEO Audit quote"
                  >
                    Get Technical Audit
                  </a>
                </div>
              </article>

              {/* SEO Consulting Service */}
              <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">💡</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    SEO Consulting
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Strategic SEO guidance for businesses and agencies. Custom strategies, team training, and ongoing consultation to maximize your SEO success.
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Custom SEO strategy development</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Team training and workshops</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Ongoing consultation calls</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Competitive analysis</li>
                  </ul>
                  <a 
                    href="/services/seo-consulting/"
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                    aria-label="Schedule SEO consulting session"
                  >
                    Schedule Consultation
                  </a>
                </div>
              </article>
            </div>

            {/* Services CTA */}
            <div className="text-center mt-12 sm:mt-16">
              <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Need a Custom SEO Strategy?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                  Every business is unique. Let's discuss your specific SEO needs and create a tailored plan that drives real results for your industry and goals.
                </p>
                <a 
                  href="/services/"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center mx-auto max-w-fit"
                  aria-label="Get custom SEO strategy"
                >
                  Get Custom SEO Strategy
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section - REPLACED WITH CLIENT COMPONENT */}
        <NewsletterFormSection />

        {/* Ultra-Modern Tools Section */}
        <section id="tools" className="py-16 sm:py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Free SEO Tools
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Powerful Free Tools
                </span>
                <br />
                <span className="text-primary">
                  For Everyone
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Access professional-grade SEO tools absolutely free. Perfect for businesses, agencies, and SEO professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Tool Card 1 */}
              <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🔍</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Keyword Density Analyzer
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Advanced keyword analysis with density optimization, semantic suggestions, and competitor comparison insights.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Free Forever</span>
                    </div>
                    <a 
                      href="/tools/keyword-density-analyzer/"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                      aria-label="Launch Keyword Density Analyzer tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </div>
              </article>

              {/* Tool Card 2 */}
              <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">📊</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Meta Tag Optimizer
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Intelligent meta tag analysis with SERP preview, character count optimization, and CTR improvement suggestions.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Free Forever</span>
                    </div>
                    <a 
                      href="/tools/meta-tag-optimizer/"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                      aria-label="Launch Meta Tag Optimizer tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </div>
              </article>

              {/* Tool Card 3 */}
              <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🤖</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Robots.txt Generator
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Professional robots.txt generator with advanced crawling directives, sitemap integration, and SEO best practices.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Free Forever</span>
                    </div>
                    <a 
                      href="/tools/robots-txt-generator/"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                      aria-label="Launch Robots.txt Generator tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </div>
              </article>
            </div>

            <div className="text-center mt-12 sm:mt-16">
              <a 
                href="/tools/"
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-300 flex items-center mx-auto max-w-fit"
                aria-label="View all 13+ free SEO tools"
              >
                View All 13+ Free Tools
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Modern Blog Section */}
        <section id="blog" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium mb-6">
                <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                Expert SEO Insights
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Latest SEO
                </span>
                <br />
                <span className="text-primary">
                  Strategies & Tips
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Stay ahead with cutting-edge SEO strategies and marketing insights from industry experts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogPosts.length > 0 ? (
                blogPosts.map((post: any, index: number) => (
                  <article key={post.id} className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    {/* Featured Image */}
                    <div className="relative overflow-hidden h-48 sm:h-56">
                      {post.featured_image ? (
                        <img 
                          src={post.featured_image}
                          alt={post.title || 'Blog post image'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-4xl sm:text-5xl" aria-hidden="true">
                            {index === 0 ? '📈' : index === 1 ? '🎯' : '📊'}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        {index === 0 ? 'LATEST' : index === 1 ? 'FEATURED' : 'POPULAR'}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 sm:p-8">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                        {post.excerpt || 'Expert SEO insights and strategies to help your business grow online.'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {(post.author?.name || 'SEO Expert').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {post.author?.name || 'SEO Expert'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <a 
                          href={`/blog/${post.slug}/`}
                          className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-primary/20 text-sm"
                          aria-label={`Read ${post.title}`}
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                // Fallback content when no blog posts are available
                <>
                  <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl" aria-hidden="true">📈</span>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        LATEST
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                        Expert SEO Insights Coming Soon
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                        Master the latest SEO techniques with our comprehensive guides covering technical optimization and content strategy.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">SE</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">SEO Expert</p>
                            <p className="text-xs text-gray-500">Publishing Soon</p>
                          </div>
                        </div>
                        <a 
                          href="/blog/"
                          className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-primary/20 text-sm"
                          aria-label="Visit our blog"
                        >
                          Visit Blog
                        </a>
                      </div>
                    </div>
                  </article>

                  <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl" aria-hidden="true">🎯</span>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                        FEATURED
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-secondary transition-colors duration-300 leading-tight">
                        SEO Strategies & Tips
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                        Discover the latest SEO strategies that are driving organic traffic and conversions for businesses worldwide.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">SS</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">SEO Strategist</p>
                            <p className="text-xs text-gray-500">Publishing Soon</p>
                          </div>
                        </div>
                        <a 
                          href="/blog/"
                          className="px-4 py-2 bg-white text-secondary rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-secondary/20 text-sm"
                          aria-label="Visit our blog"
                        >
                          Visit Blog
                        </a>
                      </div>
                    </div>
                  </article>

                  <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl" aria-hidden="true">📊</span>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                        POPULAR
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
                        Technical SEO Guide
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                        Learn how to optimize your website's technical foundation for better search engine performance and user experience.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">TS</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">Tech SEO Expert</p>
                            <p className="text-xs text-gray-500">Publishing Soon</p>
                          </div>
                        </div>
                        <a 
                          href="/blog/"
                          className="px-4 py-2 bg-white text-accent rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-accent/20 text-sm"
                          aria-label="Visit our blog"
                        >
                          Visit Blog
                        </a>
                      </div>
                    </div>
                  </article>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
