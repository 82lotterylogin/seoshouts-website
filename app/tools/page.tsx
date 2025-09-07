import type { Metadata } from 'next'

// dummy comment to force deploy

export const metadata: Metadata = {
  title: 'Free SEO Tools - 13 Professional Tools | SEO Shouts',
  description: 'Access 13 professional free SEO tools for keyword research, technical optimization, content creation, AI-powered assistance, and schema generation. No registration required.',
  keywords: 'free SEO tools, keyword density analyzer, meta tag optimizer, long tail keywords, robots txt generator, xml sitemap generator, word counter, AI copywriter, blog ideas generator, HTML editor',
  authors: [{ name: 'SEO Shouts' }],
  creator: 'SEO Shouts',
  publisher: 'SEO Shouts',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools',
  },
  openGraph: {
    title: 'Free SEO Tools - 13 Professional Tools | SEO Shouts',
    description: 'Access 13 professional SEO tools for free. Keyword research, technical SEO, content optimization, AI-powered tools, and schema generation.',
    url: 'https://seoshouts.com/tools',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/tools-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Free SEO Tools by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SEO Tools - 13 Professional Tools | SEO Shouts',
    description: 'Access 13 professional SEO tools for free. All tools available without registration.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/tools-twitter-image.jpg'],
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

export default function ToolsPage() {
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
                "name": "Tools",
                "item": "https://seoshouts.com/tools"
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
                "name": "Are your SEO tools really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all 13 SEO tools are completely free to use with no registration required. You can access keyword analyzers, meta tag optimizers, AI-powered content creators, schema generators, and more without any cost."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to register to use the tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No registration is required. All tools are accessible immediately without creating an account or providing personal information."
                }
              },
              {
                "@type": "Question",
                "name": "What types of SEO tools do you offer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer tools in 4 main categories: Keyword Research (density analyzer, difficulty checker, long-tail generator), Technical SEO (meta tags, robots.txt, XML sitemap, schema generator), Content & AI Tools (word counter, AI copywriter, blog ideas generator, SEO meta writer), and Developer Tools (HTML editor)."
                }
              }
            ]
          })
        }}
      />

      <div>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 sm:py-24 lg:py-32">
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
                <span className="text-xs sm:text-sm font-medium text-gray-700">✨ 13 Professional Free SEO Tools</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
                  Complete Free SEO Toolkit
                </span>
                <br />
                <span className="text-primary">
                  100% Free Forever
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
                Professional-grade free SEO tools used by <span className="font-semibold text-primary">10,000+ marketers</span>, agencies, and businesses worldwide. No registration required.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
                <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="text-2xl font-bold text-primary mb-1">13</div>
                  <div className="text-sm text-gray-600">Free SEO Tools</div>
                </div>
                <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="text-2xl font-bold text-primary mb-1">10K+</div>
                  <div className="text-sm text-gray-600">Monthly Users</div>
                </div>
                <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-gray-600">Free Forever</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                <a 
                  href="#tools"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
                  aria-label="Explore all free SEO tools"
                >
                  🚀 Explore All Tools
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                
                <a 
                  href="#categories"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
                  aria-label="Browse free SEO tools by category"
                >
                  📋 Browse by Category
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Overview */}
        <section id="categories" className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium mb-6">
                <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                Free SEO Tools Categories
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Tools Organized by
                </span>
                <br />
                <span className="text-primary">
                  Category
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Choose from our organized collection of free SEO tools designed for every aspect of search optimization.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Keyword Research Category */}
              <div className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🔍</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Keyword Research
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Discover, analyze, and optimize keywords for better search rankings.
                  </p>
                  <div className="text-sm text-primary font-medium">3 Tools Available</div>
                </div>
              </div>

              {/* Technical SEO Category */}
              <div className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">⚙️</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Technical SEO
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Optimize technical aspects of your website for search engines.
                  </p>
                  <div className="text-sm text-primary font-medium">4 Tools Available</div>
                </div>
              </div>

              {/* Content & AI Tools Category */}
              <div className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">📄</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Content & AI Tools
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Create and optimize content with AI-powered assistance.
                  </p>
                  <div className="text-sm text-primary font-medium">5 Tools Available</div>
                </div>
              </div>

              {/* Developer Tools Category */}
              <div className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-xl sm:text-2xl text-white" aria-hidden="true">💻</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Developer Tools
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    Code and test HTML, CSS, and JavaScript online.
                  </p>
                  <div className="text-sm text-primary font-medium">1 Tool Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Tools Section */}
        <section id="tools" className="py-16 sm:py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                All Free SEO Tools
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Complete List of
                </span>
                <br />
                <span className="text-primary">
                  Free SEO Tools
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Access our full collection of professional free SEO tools. Click any tool to start using it immediately - no registration needed.
              </p>
            </div>
            
            {/* Keyword Research Tools */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-primary text-xl" aria-hidden="true">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Keyword Research Tools</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tool 1 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">📊</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Keyword Density Analyzer
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Analyze keyword density, distribution, and optimization opportunities in your content. Get insights on how to improve keyword balance.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Real-time density analysis</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Keyword distribution mapping</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Optimization recommendations</li>
                    </ul>
                    <a 
                      href="/tools/keyword-density-analyzer/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Keyword Density Analyzer tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Tool 2 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🎯</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Keyword Difficulty Checker
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Evaluate keyword competition and difficulty scores. Make informed decisions about which keywords to target in your SEO strategy.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Competition analysis</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Difficulty scoring</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Alternative suggestions</li>
                    </ul>
                    <a 
                      href="/tools/keyword-difficulty-checker/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Keyword Difficulty Checker tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Tool 3 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🏷️</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Long Tail Keyword Generator
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Generate hundreds of long-tail keyword variations from your seed keywords. Find less competitive, high-converting keyword opportunities.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Bulk keyword generation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Search volume data</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Export functionality</li>
                    </ul>
                    <a 
                      href="/tools/long-tail-keyword-generator/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Long Tail Keyword Generator tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>
              </div>
            </div>

            {/* Technical SEO Tools */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-primary text-xl" aria-hidden="true">⚙️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Technical SEO Tools</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Technical Tool 1 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">📝</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Meta Tag Optimizer
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Create and optimize meta titles and descriptions with real-time SERP preview, character count, and CTR improvement suggestions.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>SERP preview simulation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Character count optimization</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>CTR improvement tips</li>
                    </ul>
                    <a 
                      href="/tools/meta-tag-optimizer/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Meta Tag Optimizer tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Technical Tool 2 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🤖</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Robots.txt Generator
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Generate and validate robots.txt files to control how search engines crawl your website. Includes syntax validation and testing.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Automated generation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Syntax validation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Testing functionality</li>
                    </ul>
                    <a 
                      href="/tools/robots-txt-generator/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Robots.txt Generator tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Technical Tool 3 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🗺️</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      XML Sitemap Generator
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Create comprehensive XML sitemaps for search engines. Supports various content types and includes priority and frequency settings.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Automated sitemap creation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Priority & frequency settings</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Multi-format support</li>
                    </ul>
                    <a 
                      href="/tools/xml-sitemap-generator/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch XML Sitemap Generator tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Technical Tool 4 - Schema Generator */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🏗️</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Schema Generator
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Generate JSON-LD schema markup for 39+ schema types. Perfect structured data for rich snippets and better SEO performance.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>39 schema types</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>JSON-LD format</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Rich snippets optimization</li>
                    </ul>
                    <a 
                      href="/tools/schema-generator/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Schema Generator tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>
              </div>
            </div>

            {/* Content & AI Tools */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-primary text-xl" aria-hidden="true">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Content & AI Tools</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Content Tool 1 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🔢</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Word Counter
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Count words, characters, paragraphs, and sentences in your content. Track reading time and optimize for target word counts.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Real-time counting</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Reading time estimation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Multiple metrics tracking</li>
                    </ul>
                    <a 
                      href="/tools/word-counter/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Word Counter tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Content Tool 2 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">✍️</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      AI Copywriter
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Generate compelling copy and marketing content with AI assistance. Create headlines, descriptions, and engaging content in seconds.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>AI-powered content generation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Multiple content types</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Instant results</li>
                    </ul>
                    <a 
                      href="/tools/ai-copywriter/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch AI Copywriter tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Content Tool 3 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">🤖</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      AI Blog Ideas Generator
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Generate compelling blog topics and content ideas with AI assistance. Get inspired with hundreds of topic suggestions tailored to your niche.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>AI topic generation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Niche-specific ideas</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>SEO-friendly suggestions</li>
                    </ul>
                    <a 
                      href="/tools/blog-ideas-generator/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch AI Blog Ideas Generator tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Content Tool 4 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">📝</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      SEO Meta Writer
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      AI-powered meta content writer that creates optimized titles, descriptions, and meta tags for better search engine visibility.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>AI meta generation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>SEO optimization</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Character count compliance</li>
                    </ul>
                    <a 
                      href="/tools/seo-meta-writer/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch SEO Meta Writer tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>

                {/* Content Tool 5 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">📊</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      Word Counter
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Count words, characters, paragraphs, and reading time for your content with detailed analytics and insights.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Word & character counting</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Reading time estimation</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Paragraph & sentence analysis</li>
                    </ul>
                    <a 
                      href="/tools/word-counter/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch Word Counter tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>
              </div>
            </div>

            {/* Developer Tools */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-primary text-xl" aria-hidden="true">💻</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Developer Tools</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Developer Tool 1 */}
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-xl sm:text-2xl text-white" aria-hidden="true">💻</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      HTML Editor
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      Online HTML, CSS, and JavaScript editor with live preview. Code, test, and debug web pages instantly in your browser.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Live preview</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Syntax highlighting</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" aria-hidden="true"></span>Export functionality</li>
                    </ul>
                    <a 
                      href="/tools/html-editor/"
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                      aria-label="Launch HTML Editor tool"
                    >
                      Launch Tool
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 sm:mb-8">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-medium text-white">Ready to Boost Your SEO?</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Start Using Our Free SEO Tools Today
                <br />
                <span className="text-white/80">And See Immediate Improvements</span>
              </h2>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
                Stay ahead of the competition with exclusive SEO strategies, tool updates, and marketing tips that you won't find anywhere else.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                <a 
                  href="#tools"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
                  aria-label="Start using free SEO tools"
                >
                  <span className="flex items-center">
                    🚀 Start Using Tools
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                
                <a 
                  href="/services/"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
                  aria-label="View professional SEO services"
                >
                  <span className="flex items-center">
                    💼 View SEO Services
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}