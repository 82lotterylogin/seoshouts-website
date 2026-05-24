'use client'
import { useState, useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop'
import FloatingContactPopup from './components/FloatingContactPopup'
import './globals.css'

const SERVICES_MEGA = [
  { title: 'Local SEO', desc: 'Dominate local search & maps', href: '/services/local-seo/' },
  { title: 'eCommerce SEO', desc: 'Boost online sales & visibility', href: '/services/ecommerce-seo/' },
  { title: 'SEO Web Development', desc: 'Websites engineered for search', href: '/services/seo-website-development/' },
  { title: 'Link Building', desc: 'High-quality backlink acquisition', href: '/services/link-building/' },
  { title: 'Technical SEO Audit', desc: 'Comprehensive technical analysis', href: '/services/technical-seo-audit/' },
  { title: 'SEO Consulting', desc: 'Strategic SEO roadmaps', href: '/services/seo-consulting/' },
]

const TOOLS_MEGA = [
  { cat: 'Keyword Research', tools: [
    { name: 'Keyword Density Analyzer', desc: 'Analyze density & distribution', href: '/tools/keyword-density-analyzer/' },
    { name: 'Keyword Difficulty Checker', desc: 'Evaluate competition scores', href: '/tools/keyword-difficulty-checker/' },
    { name: 'Long Tail Keyword Generator', desc: 'Generate hundreds of variations', href: '/tools/long-tail-keyword-generator/' },
  ]},
  { cat: 'Technical SEO', tools: [
    { name: 'On-Page SEO Analyzer', desc: '150+ factor analysis', href: '/tools/on-page-seo-analyzer/' },
    { name: 'Internal Link Checker', desc: 'Visual anchor text analysis', href: '/tools/internal-link-checker/' },
    { name: 'Schema Generator', desc: '39+ schema types', href: '/tools/schema-generator/' },
    { name: 'Meta Tag Optimizer', desc: 'Title & description optimization', href: '/tools/meta-tag-optimizer/' },
    { name: 'Robots.txt Generator', desc: 'Generate & validate robots.txt', href: '/tools/robots-txt-generator/' },
    { name: 'XML Sitemap Generator', desc: 'Create XML sitemaps', href: '/tools/xml-sitemap-generator/' },
    { name: '.htaccess Generator', desc: 'Apache redirects & security rules', href: '/tools/htaccess-generator/' },
    { name: 'Disavow File Generator', desc: 'Google-compliant disavow files', href: '/tools/disavow-file-generator/' },
  ]},
  { cat: 'Content & AI', tools: [
    { name: 'Word Counter', desc: 'Count words, characters & more', href: '/tools/word-counter/' },
    { name: 'AI Copywriter', desc: 'Generate compelling copy with AI', href: '/tools/ai-copywriter/' },
    { name: 'AI Blog Ideas Generator', desc: 'Blog topics with AI', href: '/tools/blog-ideas-generator/' },
    { name: 'SEO Meta Writer', desc: 'AI-powered meta content', href: '/tools/seo-meta-writer/' },
    { name: 'GEO & AEO Score Checker', desc: 'AI search readiness audit', href: '/tools/geo-aeo-checker/' },
  ]},
  { cat: 'Developer', tools: [
    { name: 'HTML Editor', desc: 'Online HTML, CSS & JS editor', href: '/tools/html-editor/' },
  ]},
]

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14 M12 5l7 7-7 7" />
    </svg>
  )
}

function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function MegaTools() {
  const [activeCat, setActiveCat] = useState(0)
  const active = TOOLS_MEGA[activeCat]
  return (
    <div className="mega" style={{ minWidth: 680 }}>
      <div className="mega-head">Free SEO Tools — No Registration Required</div>
      <div className="mega-tools-body">
        <div className="mega-tools-sidebar">
          {TOOLS_MEGA.map((cat, i) => (
            <button
              key={cat.cat}
              className={`mega-tools-cat${activeCat === i ? ' active' : ''}`}
              onMouseEnter={() => setActiveCat(i)}
              onClick={() => setActiveCat(i)}
            >
              {cat.cat}
              <span style={{ fontSize: '0.65rem', color: activeCat === i ? '#93c5fd' : 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                {cat.tools.length}
              </span>
            </button>
          ))}
        </div>
        <div className="mega-tools-grid">
          {active.tools.map(tool => (
            <a key={tool.name} href={tool.href} className="mega-link" style={{ padding: '9px 12px' }}>
              <div className="mega-link-title" style={{ fontSize: '0.82rem', marginBottom: 2 }}>{tool.name}</div>
              <div className="mega-link-sub" style={{ fontSize: '0.7rem' }}>{tool.desc}</div>
            </a>
          ))}
        </div>
      </div>
      <div className="mega-foot">
        <a href="/tools/">View all 18 free tools <ArrowRight size={12} /></a>
      </div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sessionConsent = sessionStorage.getItem('cookieConsentSession')
    const permanentConsent = localStorage.getItem('cookieConsent')
    if (!sessionConsent && !permanentConsent) setShowCookieConsent(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMobileMenuOpen(false); setShowCookieConsent(false) }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingRobots = document.querySelector('meta[name="robots"]')
      if (!existingRobots) {
        const robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        const isAdminPage = window.location.pathname.startsWith('/admin')
        robotsMeta.setAttribute('content', isAdminPage
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        )
        document.head.appendChild(robotsMeta)
      }
    }
  }, [])

  const handleAccept = () => {
    setShowCookieConsent(false)
    sessionStorage.setItem('cookieConsentSession', 'accepted')
    localStorage.setItem('cookieConsent', 'accepted')
  }
  const handleDecline = () => {
    setShowCookieConsent(false)
    sessionStorage.setItem('cookieConsentSession', 'declined')
    localStorage.setItem('cookieConsent', 'declined')
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="SEOShouts" />
        <meta name="generator" content="Next.js" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="msapplication-TileImage" content="/favicon.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-29PVGYBCLV"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-29PVGYBCLV');` }} />
        <meta name="google-site-verification" content="F4Sh8t9pk3YXNPz_tdyQ9GOXLjUEtbknVOBM3A2KN-Y" />

        {/* Website Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "SEOShouts",
          "url": "https://seoshouts.com",
          "description": "Professional SEO tools and services",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://seoshouts.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />
      </head>

      <body>
        {/* Announcement Bar */}
        <div className="announce">
          New:{' '}
          <a href="/tools/geo-aeo-checker/">GEO &amp; AEO Score Checker</a>
          {' '}— Audit your AI search readiness →
        </div>

        {/* Navigation */}
        <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
          <div className="nav-inner">
            {/* Logo */}
            <a href="/" className="nav-logo">
              <img src="/logo.png" alt="SEO Shouts Logo" width={150} height={40} />
            </a>

            {/* Desktop Links */}
            <div className="nav-links">
              {/* Services */}
              <div className="nav-item">
                <button className="nav-link">
                  Services <ChevronDown />
                </button>
                <div className="mega" style={{ minWidth: 420 }}>
                  <div className="mega-head">SEO Services</div>
                  <div style={{ padding: '0.5rem 0' }}>
                    {SERVICES_MEGA.map(s => (
                      <a key={s.href} href={s.href} className="mega-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px' }}>
                        <div className="mega-link-title" style={{ fontSize: '0.9rem', marginBottom: 0 }}>{s.title}</div>
                        <ArrowRight size={12} />
                      </a>
                    ))}
                  </div>
                  <div className="mega-foot">
                    <a href="/services/">View all services <ArrowRight size={12} /></a>
                  </div>
                </div>
              </div>

              {/* Free Tools */}
              <div className="nav-item">
                <button className="nav-link">
                  Free Tools <ChevronDown />
                </button>
                <MegaTools />
              </div>

              <a href="/blog/" className="nav-link">Blog</a>
              <a href="/meet-the-experts/" className="nav-link">Experts</a>
              <a href="/newsletter/" className="nav-link">Newsletter</a>
            </div>

            {/* Desktop CTA */}
            <div className="nav-right">
              <a href="/tools/on-page-seo-analyzer/" className="nav-ghost">Free Audit</a>
              <a href="/contact/" className="nav-cta">Get a Proposal</a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setIsMobileMenuOpen(p => !p)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {isMobileMenuOpen
                  ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
                  : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
                }
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu${isMobileMenuOpen ? ' open' : ''}`}>
            <a href="/services/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            <a href="/tools/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Free Tools</a>
            <a href="/blog/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
            <a href="/meet-the-experts/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Experts</a>
            <a href="/newsletter/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Newsletter</a>
            <div className="mobile-menu-actions">
              <a href="/tools/on-page-seo-analyzer/" className="nav-ghost" style={{ flex: 1, textAlign: 'center' }}>Free Audit</a>
              <a href="/contact/" className="nav-cta" style={{ flex: 1, textAlign: 'center' }}>Get a Proposal</a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ paddingTop: 99 }}>
          {children}
        </main>

        <ScrollToTop />
        <FloatingContactPopup />

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-top">
              {/* Brand + Contact */}
              <div>
                <a href="/" className="footer-logo-link">
                  <img src="/logo.png" alt="SEO Shouts Logo" width={150} height={40} />
                </a>
                <p className="footer-desc">Professional SEO services and free tools for businesses, agencies, and marketers worldwide.</p>
                <div className="footer-contact">
                  <a href="tel:+918094888157">📞 +91 8094888157</a>
                  <a href="mailto:seoshouts@gmail.com">✉ seoshouts@gmail.com</a>
                  <span style={{ fontSize: '0.72rem' }}>Udaipur, Rajasthan, India</span>
                </div>
              </div>

              {/* Services */}
              <div>
                <div className="footer-col-title">Services</div>
                <a href="/services/local-seo/" className="footer-link">Local SEO</a>
                <a href="/services/ecommerce-seo/" className="footer-link">eCommerce SEO</a>
                <a href="/services/seo-website-development/" className="footer-link">Website Development</a>
                <a href="/services/link-building/" className="footer-link">Link Building</a>
                <a href="/services/technical-seo-audit/" className="footer-link">Technical Audit</a>
                <a href="/services/seo-consulting/" className="footer-link">SEO Consulting</a>
              </div>

              {/* Tools */}
              <div>
                <div className="footer-col-title">Tools</div>
                <a href="/tools/on-page-seo-analyzer/" className="footer-link">On-Page Analyzer</a>
                <a href="/tools/internal-link-checker/" className="footer-link">Internal Link Checker</a>
                <a href="/tools/schema-generator/" className="footer-link">Schema Generator</a>
                <a href="/tools/geo-aeo-checker/" className="footer-link">GEO &amp; AEO Checker</a>
                <a href="/tools/meta-tag-optimizer/" className="footer-link">Meta Tag Optimizer</a>
                <a href="/tools/" className="footer-link">All 18 Tools</a>
              </div>

              {/* Company */}
              <div>
                <div className="footer-col-title">Company</div>
                <a href="/blog/" className="footer-link">SEO Blog</a>
                <a href="/newsletter/" className="footer-link">Newsletter</a>
                <a href="/meet-the-experts/" className="footer-link">Meet the Experts</a>
                <a href="/contact/" className="footer-link">Contact Us</a>
                <a href="/sitemap.xml" className="footer-link">Sitemap</a>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-copy">© 2026 SEOShouts. All rights reserved.</div>
              <div className="footer-legal">
                <a href="/privacy-policy/">Privacy</a>
                <a href="/terms/">Terms</a>
                <a href="/cookie-policy/">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Cookie Consent */}
        {showCookieConsent && (
          <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: 320, zIndex: 9999 }}>
            <div style={{ background: 'var(--ink-2)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative' }}>
              <button
                onClick={() => { setShowCookieConsent(false); sessionStorage.setItem('cookieConsentSession', 'closed') }}
                style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--gray-4)', cursor: 'pointer', lineHeight: 1 }}
                aria-label="Close"
              >✕</button>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>We value your privacy</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-4)', lineHeight: 1.6, marginBottom: '1rem' }}>
                This website uses cookies to improve user experience. Read our{' '}
                <a href="/privacy-policy/" style={{ color: 'var(--blue-light)', textDecoration: 'underline' }}>Privacy Policy</a>.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleAccept} style={{ flex: 1, background: 'var(--blue)', color: '#fff', border: 'none', padding: '8px 0', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Accept All
                </button>
                <button onClick={handleDecline} style={{ flex: 1, background: 'none', color: 'var(--gray-4)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 0', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  )
}
