import ScrollToTop from './components/ScrollToTop'
import FloatingContactPopup from './components/FloatingContactPopup'
import SiteNav from './components/SiteNav'
import SiteCookieConsent from './components/SiteCookieConsent'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          "name": "SEO Shouts",
          "url": "https://seoshouts.com",
          "description": "Professional SEO tools and services for businesses, agencies, and marketers worldwide.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://seoshouts.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />

        {/* Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SEO Shouts",
          "alternateName": "SEOShouts",
          "url": "https://seoshouts.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://seoshouts.com/logo.png",
            "width": 150,
            "height": 40
          },
          "description": "Professional SEO services and free tools for businesses, agencies, and marketers worldwide. 13+ years of expertise in SEO website development, local SEO, link building, and technical audits.",
          "foundingDate": "2012",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Udaipur",
            "addressRegion": "Rajasthan",
            "addressCountry": "IN"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+91-8094888157",
              "contactType": "customer service",
              "areaServed": ["IN", "US", "GB", "AU", "CA"],
              "availableLanguage": "English"
            },
            {
              "@type": "ContactPoint",
              "email": "seoshouts@gmail.com",
              "contactType": "sales",
              "areaServed": ["IN", "US", "GB", "AU", "CA"],
              "availableLanguage": "English"
            }
          ],
          "sameAs": [
            "https://twitter.com/seo_shouts",
            "https://www.linkedin.com/company/seoshouts",
            "https://www.facebook.com/seoshouts"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "SEO Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Local SEO" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "eCommerce SEO" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Website Development" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Link Building" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Technical SEO Audit" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Consulting" } }
            ]
          }
        })}} />
      </head>

      <body>
        {/* Nav + announcement bar — client component (scroll state, mobile menu, tools dropdown) */}
        <SiteNav />

        {/* Main Content — offset handled by .site-main (responsive to header height) */}
        <main className="site-main">
          {children}
        </main>

        <ScrollToTop />
        <FloatingContactPopup />

        {/* Footer — fully static, server-rendered */}
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

        {/* Cookie consent banner — client component (localStorage check) */}
        <SiteCookieConsent />
      </body>
    </html>
  )
}
