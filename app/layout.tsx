'use client'
import { useState, useRef, useEffect } from 'react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCookieConsent, setShowCookieConsent] = useState(true)

  const servicesRef = useRef<HTMLDivElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)

  // All your existing handlers remain the same...
  const handleServicesToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsServicesOpen(prev => !prev)
    setIsToolsOpen(false)
  }

  const handleToolsToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsToolsOpen(prev => !prev)
    setIsServicesOpen(false)
  }

  const closeAllMenus = () => {
    setIsServicesOpen(false)
    setIsToolsOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  // Cookie consent handlers
  const handleAcceptCookies = () => {
    setShowCookieConsent(false)
    sessionStorage.setItem('cookieConsentSession', 'accepted') // Per session
    localStorage.setItem('cookieConsent', 'accepted') // Permanent across sessions
  }

  const handleDeclineCookies = () => {
    setShowCookieConsent(false)
    sessionStorage.setItem('cookieConsentSession', 'declined') // Per session
    localStorage.setItem('cookieConsent', 'declined') // Permanent
  }

  const closeCookieConsent = () => {
    setShowCookieConsent(false)
    sessionStorage.setItem('cookieConsentSession', 'closed') // Per session (shows again next session unless accepted/declined)
  }

  // Check cookie consent on mount (per session + permanent)
  useEffect(() => {
    const sessionConsent = sessionStorage.getItem('cookieConsentSession')
    const permanentConsent = localStorage.getItem('cookieConsent')
    if (sessionConsent || permanentConsent) {
      setShowCookieConsent(false)
    }
  }, [])

  // Enhanced outside click detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setIsServicesOpen(false)
      }
      if (toolsRef.current && !toolsRef.current.contains(target)) {
        setIsToolsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('touchstart', handleClickOutside, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('touchstart', handleClickOutside, true)
    }
  }, [])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllMenus()
        setShowCookieConsent(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        {/* Global SEO Elements */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="SEO Shouts" />
        <meta name="generator" content="Next.js" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Global Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com",
              "logo": "https://seoshouts.com/logo.png",
              "description": "Professional SEO tools and services for businesses worldwide. Free SEO analysis, keyword research, technical audits, and expert SEO consulting.",
              "foundingDate": "2024",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8094888157",
                "contactType": "customer service",
                "email": "contact@seoshouts.com"
              },
              "sameAs": [
                "https://www.facebook.com/seoshouts/",
                "https://www.linkedin.com/company/seoshouts/",
                "https://x.com/seo_shouts",
                "https://www.reddit.com/r/seoshouts/"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            })
          }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com",
              "description": "Professional SEO tools and services",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://seoshouts.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      
      <body className="overflow-x-hidden">
        {/* Cookie Consent Banner - Updated */}
        {showCookieConsent && (
          <div className="fixed bottom-4 right-4 max-w-sm w-full z-50 animate-fade-in-up">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <button 
                onClick={closeCookieConsent}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close cookie consent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">We value your privacy</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    This website uses cookies to improve user experience. Read more in our <a href="/privacy-policy" className="text-blue-300 hover:text-blue-200 underline">Privacy Policy</a>.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAcceptCookies}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleDeclineCookies}
                      className="flex-1 bg-transparent border border-gray-500 text-gray-300 hover:text-white hover:border-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105"
                    >
                      Decline All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with complete menu system */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <nav className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="SEO Shouts Logo" width={150} height={40}/>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {/* Services Dropdown - Updated with SEO Website Development */}
                <div className="relative" ref={servicesRef}>
                  <button 
                    onClick={handleServicesToggle}
                    className="text-gray-700 hover:text-primary transition-all duration-300 font-medium relative flex items-center focus:outline-none focus:text-primary cursor-pointer select-none bg-transparent border-none p-0"
                    type="button"
                  >
                    Services
                    <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Services Dropdown Menu - Updated */}
                  <div 
                    className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 ${
                      isServicesOpen 
                        ? 'opacity-100 visible translate-y-0 z-[70]' 
                        : 'opacity-0 invisible translate-y-2 z-[-1]'
                    }`}
                    style={{ pointerEvents: isServicesOpen ? 'auto' : 'none' }}
                  >
                    <div className="p-4">
                      <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Our SEO Services</div>
                      <div className="space-y-2">
                        <a href="/services/local-seo" className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group/item" onClick={closeAllMenus}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-gray-600">📍</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 group-hover/item:text-primary">Local SEO</div>
                            <div className="text-xs text-gray-500">Dominate local search results</div>
                          </div>
                        </a>
                        
                        <a href="/services/ecommerce-seo" className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group/item" onClick={closeAllMenus}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-gray-600">🛒</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 group-hover/item:text-primary">eCommerce SEO</div>
                            <div className="text-xs text-gray-500">Boost online sales & visibility</div>
                          </div>
                        </a>
                        
                        <a href="/services/seo-website-development" className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group/item" onClick={closeAllMenus}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-gray-600">💻</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 group-hover/item:text-primary">SEO Website Development</div>
                            <div className="text-xs text-gray-500">Build websites that rank & convert</div>
                          </div>
                        </a>
                        
                        <a href="/services/link-building" className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group/item" onClick={closeAllMenus}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-gray-600">🔗</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 group-hover/item:text-primary">Link Building</div>
                            <div className="text-xs text-gray-500">High-quality backlink acquisition</div>
                          </div>
                        </a>
                        
                        <a href="/services/technical-seo-audit" className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group/item" onClick={closeAllMenus}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-gray-600">🔧</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 group-hover/item:text-primary">Technical SEO Audit</div>
                            <div className="text-xs text-gray-500">Complete technical analysis</div>
                          </div>
                        </a>
                        
                        <a href="/services/seo-consulting" className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group/item" onClick={closeAllMenus}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-gray-600">💡</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 group-hover/item:text-primary">SEO Consulting</div>
                            <div className="text-xs text-gray-500">Strategic SEO guidance</div>
                          </div>
                        </a>
                      </div>
                      
                      <div className="pt-3 mt-3 border-t border-gray-100">
                        <a href="/services" className="flex items-center justify-center w-full p-2 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg transition-colors" onClick={closeAllMenus}>
                          View All Services
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Free Tools Mega Menu */}
                <div className="relative" ref={toolsRef}>
                  <button 
                    onClick={handleToolsToggle}
                    className="text-gray-700 hover:text-primary transition-all duration-300 font-medium relative flex items-center focus:outline-none focus:text-primary cursor-pointer select-none bg-transparent border-none p-0"
                    type="button"
                  >
                    Free Tools
                    <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Free Tools Mega Menu */}
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] max-w-[98vw] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 ${
                      isToolsOpen 
                        ? 'opacity-100 visible translate-y-0 z-[70]' 
                        : 'opacity-0 invisible translate-y-2 z-[-1]'
                    }`}
                    style={{ pointerEvents: isToolsOpen ? 'auto' : 'none' }}
                  >
                    <div className="p-6">
                      <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Free SEO Tools</div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {/* Keyword Research Tools */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-primary text-sm">🔍</span>
                            </span>
                            Keyword Research
                          </h4>
                          <div className="space-y-2">
                            <a href="/tools/keyword-density-analyzer" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">📊</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Keyword Density Analyzer</div>
                                <div className="text-xs text-gray-500">Analyze keyword density & optimization</div>
                              </div>
                            </a>
                            <a href="/tools/keyword-difficulty-checker" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🎯</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Keyword Difficulty Checker</div>
                                <div className="text-xs text-gray-500">Check keyword competition scores</div>
                              </div>
                            </a>
                            <a href="/tools/long-tail-keyword-generator" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🏷️</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Long Tail Generator</div>
                                <div className="text-xs text-gray-500">Generate long-tail keyword ideas</div>
                              </div>
                            </a>
                            <a href="/tools/serp-analyzer" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🔎</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">SERP Analyzer</div>
                                <div className="text-xs text-gray-500">Analyze search result pages</div>
                              </div>
                            </a>
                          </div>
                        </div>
                        {/* Technical SEO Tools */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-primary text-sm">⚙️</span>
                            </span>
                            Technical SEO
                          </h4>
                          <div className="space-y-2">
                            <a href="/tools/meta-tag-optimizer" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">📝</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Meta Tag Optimizer</div>
                                <div className="text-xs text-gray-500">Optimize title tags & meta descriptions</div>
                              </div>
                            </a>
                            <a href="/tools/website-speed-test" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">⚡</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Website Speed Test</div>
                                <div className="text-xs text-gray-500">Test Core Web Vitals & performance</div>
                              </div>
                            </a>
                            <a href="/tools/robots-txt-generator" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🤖</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Robots.txt Generator</div>
                                <div className="text-xs text-gray-500">Generate & validate robots.txt files</div>
                              </div>
                            </a>
                            <a href="/tools/xml-sitemap-generator" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🗺️</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">XML Sitemap Generator</div>
                                <div className="text-xs text-gray-500">Create XML sitemaps for search engines</div>
                              </div>
                            </a>
                          </div>
                        </div>
                        {/* Content Optimization Tools */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-primary text-sm">📄</span>
                            </span>
                            Content Optimization
                          </h4>
                          <div className="space-y-2">
                            <a href="/tools/content-analyzer" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">📋</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Content Analyzer</div>
                                <div className="text-xs text-gray-500">Analyze content readability & SEO</div>
                              </div>
                            </a>
                            <a href="/tools/heading-analyzer" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">📑</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Heading Structure Analyzer</div>
                                <div className="text-xs text-gray-500">Check H1-H6 heading structure</div>
                              </div>
                            </a>
                            <a href="/tools/word-counter" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🔢</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Word Counter</div>
                                <div className="text-xs text-gray-500">Count words, characters & paragraphs</div>
                              </div>
                            </a>
                            <a href="/tools/plagiarism-checker" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🛡️</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Plagiarism Checker</div>
                                <div className="text-xs text-gray-500">Check content originality</div>
                              </div>
                            </a>
                          </div>
                        </div>

                        {/* Authority & Performance Tools */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-primary text-sm">📊</span>
                            </span>
                            Authority & Performance
                          </h4>
                          <div className="space-y-2">
                            <a href="/tools/domain-authority-checker" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">📊</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Domain Authority Checker</div>
                                <div className="text-xs text-gray-500">Check domain & page authority</div>
                              </div>
                            </a>
                            <a href="/tools/google-indexing-checker" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool" onClick={closeAllMenus}>
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                <span className="text-gray-600 text-xs">🔍</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 group-hover/tool:text-primary">Google Index Checker</div>
                                <div className="text-xs text-gray-500">Check if pages are indexed</div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* View All Tools CTA */}
                      <div className="pt-4 mt-4 border-t border-gray-100">
                        <a href="/tools" className="flex items-center justify-center w-full p-3 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg transition-colors" onClick={closeAllMenus}>
                          View All 13+ Free Tools
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="/meet-the-experts" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium relative group">
                  Meet Our Experts
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="/blog" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium relative group">
                  Blog
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="/newsletter" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium relative group">
                  Newsletter
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                {/* === NEW MENU ITEM: Meet Our Experts === */}
               
                <button className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg">
                  Get Quote
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-2 pt-4">
                  <a href="/services" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Services
                  </a>
                  <a href="/tools" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Free Tools
                  </a>
                  <a href="/blog" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Blog
                  </a>
                  <a href="/newsletter" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Newsletter
                  </a>
                  {/* === NEW MENU ITEM IN MOBILE NAV === */}
                  <a
                    href="/meet-the-experts"
                    className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Meet Our Experts
                  </a>
                  <div className="px-4 pt-2">
                    <button className="w-full bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="min-h-screen">
          {children}
        </main>
        {/* Footer - Updated with SEO Website Development */}
        <footer className="bg-gray-900 text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
              {/* Contact Information Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <img src="/logo.png" alt="SEO Shouts Logo" width={150}  height={40}/>
                </div>
                
                {/* Contact Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-sm">📞</span>
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Phone</p>
                      <a href="tel:+918094888157" className="text-white hover:text-primary transition-colors">+91 8094888157</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-sm">📧</span>
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Email</p>
                      <div className="space-y-1">
                        <div><a href="mailto:seoshouts@gmail.com" className="text-white hover:text-primary transition-colors text-sm sm:text-base">seoshouts@gmail.com</a></div>
                        <div><a href="mailto:contact@seoshouts.com" className="text-white hover:text-primary transition-colors text-sm sm:text-base">contact@seoshouts.com</a></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.facebook.com/seoshouts/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110" title="Facebook" aria-label="Follow us on Facebook">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/seoshouts/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110" title="LinkedIn" aria-label="Follow us on LinkedIn">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://x.com/seo_shouts" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-black rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110" title="X (Twitter)" aria-label="Follow us on X (Twitter)">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://www.reddit.com/r/seoshouts/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-orange-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110" title="Reddit" aria-label="Follow us on Reddit">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                  </a>
                </div>
              </div>
              {/* SEO Services - Updated */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">SEO Services</h4>
                <ul className="space-y-3">
                  <li><a href="/services/local-seo" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Local SEO
                  </a></li>
                  <li><a href="/services/ecommerce-seo" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    eCommerce SEO
                  </a></li>
                  <li><a href="/services/seo-website-development" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Website Development
                  </a></li>
                  <li><a href="/services/link-building" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Link Building
                  </a></li>
                  <li><a href="/services/technical-seo-audit" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Technical Audit
                  </a></li>
                  <li><a href="/services/seo-consulting" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    SEO Consulting
                  </a></li>
                </ul>
              </div>
              
              {/* Free Tools */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">Free Tools</h4>
                <ul className="space-y-3">
                  <li><a href="/tools" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Keyword Analyzer
                  </a></li>
                  <li><a href="/tools" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Meta Tag Optimizer
                  </a></li>
                  <li><a href="/tools" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Speed Analyzer
                  </a></li>
                  <li><a href="/tools" className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    All Tools
                  </a></li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">Resources</h4>
                <ul className="space-y-3">
                  <li><a href="/blog" className="text-gray-300 hover:text-gray-400 transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    SEO Blog
                  </a></li>
                  <li><a href="/newsletter" className="text-gray-300 hover:text-gray-400 transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Newsletter
                  </a></li>
                  <li><a href="/meet-the-experts" className="text-gray-300 hover:text-gray-400 transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Meet Our Experts
                  </a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-gray-400 transition-colors duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Contact Us
                  </a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-gray-400 text-center lg:text-left text-sm sm:text-base">
                © 2025 SEO Shouts. Professional SEO tools and services for global success.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 sm:gap-6 text-gray-400 text-sm">
                <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</a>
                <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
