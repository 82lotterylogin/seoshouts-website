import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | SEO Shouts',
  description: 'Learn about the cookies and tracking technologies we use on seoshouts.com to enhance your experience and how you can manage them.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/cookie-policy',
  },
  openGraph: {
    title: 'Cookie Policy | SEO Shouts',
    description: 'Detailed information on our use of cookies, types, purposes, and your management options.',
    url: 'https://seoshouts.com/cookie-policy',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/cookie-policy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Cookie Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | SEO Shouts',
    description: 'How we use cookies and tracking technologies at SEO Shouts.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/cookie-policy-twitter.jpg'],
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

const CP_CSS = `
/* ── Cookie Policy (cp-) ──────────────────────────────── */
.cp-main { background: var(--ink); }
.cp-hero {
  background: var(--ink);
  padding: 1.5rem 2rem 2.5rem;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.cp-hero-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image:
    linear-gradient(rgba(37,99,235,0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.18) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 80% at 30% 30%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 30% 30%, #000 30%, transparent 80%);
}
.cp-hero-inner {
  max-width: 1280px; margin: 0 auto; position: relative; z-index: 2;
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; align-items: end;
}
.cp-hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(37,99,235,0.4); padding: 6px 13px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--blue-light); margin-bottom: 1.25rem;
  font-family: 'JetBrains Mono', monospace;
}
.cp-hero-tag .cp-dot { width: 5px; height: 5px; background: var(--blue-light); }
.cp-hero h1 {
  font-size: clamp(2.2rem, 4.4vw, 3.6rem); font-weight: 700; color: #fff;
  line-height: 1.02; letter-spacing: -0.035em; margin-bottom: 1rem;
}
.cp-hero h1 .blue { color: var(--blue-light); }
.cp-hero .cp-sub { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.65; max-width: 600px; }
.cp-hero-meta {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  padding: 1.25rem 1.4rem; display: flex; flex-direction: column; gap: 0.6rem;
}
.cp-hero-meta .cp-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
}
.cp-hero-meta .cp-row + .cp-row { padding-top: 0.6rem; border-top: 1px dashed rgba(255,255,255,0.1); }
.cp-hero-meta .cp-k { color: var(--gray-4); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
.cp-hero-meta .cp-v { color: #fff; letter-spacing: 0.04em; font-weight: 600; }
.cp-hero-meta .cp-v .accent { color: var(--blue-light); }

/* Layout */
.cp-layout { background: var(--gray-1); padding: 4rem 2rem 6rem; border-bottom: 1px solid var(--line); }
.cp-layout-grid {
  max-width: 1280px; margin: 0 auto;
  display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 3rem; align-items: start;
}

/* TOC */
.cp-toc { position: sticky; top: 110px; background: #fff; border: 1px solid var(--line); padding: 1.25rem; }
.cp-toc-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 0.75rem; margin-bottom: 0.85rem; border-bottom: 1px solid var(--line);
}
.cp-toc-head h3 { font-size: 0.78rem; font-weight: 700; color: var(--ink); letter-spacing: -0.005em; }
.cp-toc-head .cp-toc-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-5); letter-spacing: 0.1em; }
.cp-toc-list { display: flex; flex-direction: column; gap: 1px; }
.cp-toc-list a {
  display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px;
  font-size: 0.82rem; color: var(--gray-5); line-height: 1.4;
  transition: all 0.15s; border-left: 2px solid transparent; text-decoration: none;
}
.cp-toc-list a:hover { color: var(--ink); background: var(--gray-1); border-left-color: var(--blue-mid); }
.cp-toc-list a .cp-tnum {
  font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
  color: var(--blue); font-weight: 700; flex-shrink: 0; padding-top: 2px;
}

/* Document */
.cp-doc { background: #fff; border: 1px solid var(--line); padding: 3rem 3rem 3.5rem; }
.cp-doc .cp-intro { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--line); }
.cp-doc .cp-intro p { font-size: 1rem; color: var(--gray-5); line-height: 1.75; margin-bottom: 1rem; }
.cp-doc .cp-intro p:last-child { margin-bottom: 0; }
.cp-doc .cp-intro p strong { color: var(--ink); }
.cp-doc .cp-intro a { color: var(--blue); border-bottom: 1px dashed var(--blue); }
.cp-doc .cp-section { padding-top: 2.5rem; scroll-margin-top: 110px; }
.cp-doc .cp-section:first-of-type { padding-top: 0; }
.cp-doc h2 {
  font-size: 1.65rem; font-weight: 700; color: var(--ink); letter-spacing: -0.025em;
  line-height: 1.15; margin-bottom: 1rem; display: flex; align-items: baseline; gap: 14px;
}
.cp-doc h2 .cp-secnum {
  font-family: 'JetBrains Mono', monospace; font-size: 0.95rem;
  color: var(--blue); font-weight: 700; letter-spacing: 0.02em; flex-shrink: 0;
}
.cp-doc h3 {
  font-size: 1.1rem; font-weight: 700; color: var(--ink); letter-spacing: -0.015em;
  margin: 1.75rem 0 0.75rem; padding-left: 12px; border-left: 3px solid var(--blue); line-height: 1.3;
}
.cp-doc p { font-size: 0.96rem; color: var(--gray-5); line-height: 1.75; margin-bottom: 1rem; }
.cp-doc p strong { color: var(--ink); font-weight: 600; }
.cp-doc p a { color: var(--blue); border-bottom: 1px dashed var(--blue); }
.cp-doc ul { margin: 0.5rem 0 1.25rem 0; display: flex; flex-direction: column; gap: 8px; padding: 0; list-style: none; }
.cp-doc ul li {
  font-size: 0.95rem; color: var(--gray-5); line-height: 1.65;
  padding-left: 1.5rem; position: relative;
}
.cp-doc ul li::before {
  content: ''; position: absolute; left: 0; top: 0.65em;
  width: 8px; height: 8px; background: var(--blue-pale); border: 1.5px solid var(--blue);
}
.cp-doc ul li strong { color: var(--ink); font-weight: 600; }
.cp-doc ul ul { margin: 0.5rem 0 0.5rem 0; }
.cp-doc ul ul li::before { background: var(--gray-2); border-color: var(--gray-3); }

/* Cookie type cards */
.cp-cookie-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 1.25rem 0 1.75rem; }
.cp-cookie-card { background: var(--gray-1); border: 1px solid var(--line); padding: 1rem 1.1rem; }
.cp-ckh {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  margin-bottom: 0.65rem; padding-bottom: 0.6rem; border-bottom: 1px dashed var(--line);
}
.cp-ckh .cp-ti { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.92rem; color: var(--ink); letter-spacing: -0.01em; }
.cp-ckh .cp-badge {
  font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; font-weight: 700;
  padding: 3px 7px; letter-spacing: 0.08em; text-transform: uppercase;
}
.cp-badge.req { background: var(--blue); color: #fff; }
.cp-badge.opt { background: #fff; color: var(--gray-5); border: 1px solid var(--line); }
.cp-cookie-card p { font-size: 0.82rem; color: var(--gray-5); line-height: 1.55; margin-bottom: 0.6rem; }
.cp-ck-meta {
  display: flex; flex-direction: column; gap: 4px;
  padding-top: 0.6rem; border-top: 1px dashed var(--line);
  font-family: 'JetBrains Mono', monospace; font-size: 0.62rem;
}
.cp-ck-meta .cp-mr { display: flex; gap: 8px; }
.cp-ck-meta .cp-mk { color: var(--gray-5); letter-spacing: 0.06em; text-transform: uppercase; min-width: 70px; }
.cp-ck-meta .cp-mv { color: var(--ink-3); font-weight: 600; }

/* Contact block */
.cp-contact-block { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--line); }
.cp-contact-block h3 { font-size: 1.05rem; font-weight: 700; color: var(--ink); letter-spacing: -0.015em; margin-bottom: 1rem; border-left: none; padding-left: 0; }
.cp-contact-rows { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.cp-cr {
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  background: var(--gray-1); border: 1px solid var(--line);
  transition: all 0.15s; text-decoration: none;
}
.cp-cr:hover { background: var(--blue-pale); border-color: var(--blue-mid); }
.cp-cr .cp-cr-ico {
  width: 32px; height: 32px; background: #fff; border: 1px solid var(--line);
  color: var(--blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cp-cr .cp-cr-k { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-5); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }
.cp-cr .cp-cr-v { font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem; color: var(--ink); font-weight: 600; }

/* Quick action box */
.cp-quick {
  margin-top: 2.5rem; background: var(--ink); color: #fff;
  padding: 1.75rem 2rem; position: relative; overflow: hidden;
}
.cp-quick::before {
  content: ''; position: absolute; inset: 0; opacity: 0.35; pointer-events: none;
  background-image:
    linear-gradient(rgba(37,99,235,0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.22) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 100% 80% at 0% 0%, #000 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 100% 80% at 0% 0%, #000 0%, transparent 70%);
}
.cp-quick-inner { position: relative; display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center; }
.cp-quick h3 { font-size: 1.15rem; font-weight: 700; color: #fff; letter-spacing: -0.015em; margin-bottom: 0.4rem; padding: 0; border: none; }
.cp-quick p { font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.55; margin: 0; }
.cp-qa-btns { display: flex; gap: 8px; flex-shrink: 0; }
.cp-qa-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 11px 16px;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.82rem;
  letter-spacing: -0.005em; border: 1px solid rgba(255,255,255,0.18);
  color: #fff; transition: all 0.15s; cursor: pointer; text-decoration: none; white-space: nowrap;
}
.cp-qa-btn.primary { background: var(--blue); border-color: var(--blue); }
.cp-qa-btn.primary:hover { background: var(--blue-dark); border-color: var(--blue-dark); }
.cp-qa-btn:hover { border-color: #fff; background: rgba(255,255,255,0.04); }

/* Responsive */
@media (max-width: 1024px) {
  .cp-hero-inner { grid-template-columns: 1fr; }
  .cp-layout-grid { grid-template-columns: 1fr; gap: 2rem; }
  .cp-toc { position: static; }
  .cp-doc { padding: 2.25rem; }
  .cp-cookie-grid { grid-template-columns: 1fr; }
  .cp-quick-inner { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .cp-doc { padding: 1.5rem; }
  .cp-doc h2 { font-size: 1.35rem; }
  .cp-contact-rows { grid-template-columns: 1fr; }
  .cp-hero { padding: 3rem 1.25rem 2.5rem; }
  .cp-layout { padding: 2.5rem 1.25rem 4rem; }
}
`

export default function CookiePolicyPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CP_CSS }} />
      <div>

        {/* Breadcrumbs */}
        <div className="crumbs">
          <div className="crumbs-inner">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Cookie Policy</span>
          </div>
        </div>

        {/* Hero */}
        <section className="cp-hero">
          <div className="cp-hero-grid" aria-hidden="true" />
          <div className="cp-hero-inner">
            <div>
              <div className="cp-hero-tag">
                <span className="cp-dot" aria-hidden="true" />
                // LEGAL &middot; DOCUMENT
              </div>
              <h1>Cookie Policy <span className="blue">for SEOShouts.</span></h1>
              <p className="cp-sub">How we use cookies and similar tracking technologies on seoshouts.com, why we use them, and how you can manage them.</p>
            </div>
            <div className="cp-hero-meta">
              <div className="cp-row">
                <span className="cp-k">Effective</span>
                <span className="cp-v">January 01, 2026</span>
              </div>
              <div className="cp-row">
                <span className="cp-k">Last updated</span>
                <span className="cp-v"><span className="accent">&#9679;</span> March 11, 2026</span>
              </div>
              <div className="cp-row">
                <span className="cp-k">Governs</span>
                <span className="cp-v">seoshouts.com</span>
              </div>
              <div className="cp-row">
                <span className="cp-k">Jurisdiction</span>
                <span className="cp-v">India &middot; GDPR &middot; DPDPA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Layout: TOC + Doc */}
        <section className="cp-layout">
          <div className="cp-layout-grid">

            {/* Sticky TOC */}
            <aside className="cp-toc">
              <div className="cp-toc-head">
                <h3>On this page</h3>
                <span className="cp-toc-tag">// TOC</span>
              </div>
              <nav className="cp-toc-list">
                <a href="#s1"><span className="cp-tnum">01</span>What Are Cookies?</a>
                <a href="#s2"><span className="cp-tnum">02</span>Why We Use Cookies</a>
                <a href="#s3"><span className="cp-tnum">03</span>Types of Cookies</a>
                <a href="#s4"><span className="cp-tnum">04</span>Third-Party Cookies</a>
                <a href="#s5"><span className="cp-tnum">05</span>Managing Your Cookies</a>
                <a href="#s6"><span className="cp-tnum">06</span>Data Security &amp; Retention</a>
                <a href="#s7"><span className="cp-tnum">07</span>Children&apos;s Privacy</a>
                <a href="#s8"><span className="cp-tnum">08</span>International Transfers</a>
                <a href="#s9"><span className="cp-tnum">09</span>Changes to this Policy</a>
                <a href="#s10"><span className="cp-tnum">10</span>Contact Us</a>
              </nav>
            </aside>

            {/* Document */}
            <article className="cp-doc">

              <div className="cp-intro">
                <p>At <strong>SEOShouts</strong> (operated under seoshouts.com, headquartered in Udaipur, Rajasthan, India), we use cookies and similar tracking technologies to enhance your experience on our website, analyze site performance, and deliver personalized content. This Cookie Policy explains what cookies are, how we use them, the types we employ, and your choices for managing them. This policy complements our <a href="/privacy-policy/">Privacy Policy</a>, which details our broader data handling practices.</p>
                <p>We comply with applicable laws, including the <strong>Information Technology Act, 2000</strong>, the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> in India, and the <strong>General Data Protection Regulation (GDPR)</strong> for users in the European Union. By continuing to use our website, you consent to our use of cookies as described. If you do not agree, please adjust your browser settings or discontinue use.</p>
              </div>

              <div className="cp-section" id="s1">
                <h2><span className="cp-secnum">/01</span>What Are Cookies?</h2>
                <p>Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They allow the site to recognize your device and remember information about your visit, such as preferences, login details, or browsing behavior. Cookies can be <strong>&ldquo;persistent&rdquo;</strong> (stored until they expire or are deleted) or <strong>&ldquo;session&rdquo;</strong> (temporary and deleted when you close your browser).</p>
                <p>We also use similar technologies like <strong>web beacons</strong> (small images that track interactions), <strong>pixels</strong> (embedded code for analytics), and <strong>local storage</strong> (browser-based data storage). These help us understand how users interact with our site and improve functionality.</p>
              </div>

              <div className="cp-section" id="s2">
                <h2><span className="cp-secnum">/02</span>Why Do We Use Cookies?</h2>
                <p>We use cookies for essential operational purposes, to improve user experience, and for analytics and marketing. Specifically:</p>
                <ul>
                  <li><strong>Essential Functionality:</strong> To enable core site features, such as navigation, secure areas, and form submissions.</li>
                  <li><strong>Performance and Analytics:</strong> To monitor site usage, identify issues, and optimize content based on visitor behavior.</li>
                  <li><strong>Personalization:</strong> To remember your preferences (e.g., language or region) and provide tailored content.</li>
                  <li><strong>Marketing and Advertising:</strong> To deliver relevant ads and measure campaign effectiveness.</li>
                  <li><strong>Security:</strong> To detect and prevent fraudulent activity or unauthorized access.</li>
                </ul>
                <p>We do not use cookies to collect sensitive personal information without your explicit consent.</p>
              </div>

              <div className="cp-section" id="s3">
                <h2><span className="cp-secnum">/03</span>Types of Cookies We Use</h2>

                <div className="cp-cookie-grid">
                  <div className="cp-cookie-card">
                    <div className="cp-ckh">
                      <span className="cp-ti">Essential Cookies</span>
                      <span className="cp-badge req">Required</span>
                    </div>
                    <p>Necessary for the website to function properly. Cannot be disabled. Set in response to actions like logging in or filling out forms.</p>
                    <div className="cp-ck-meta">
                      <div className="cp-mr"><span className="cp-mk">Examples</span><span className="cp-mv">Session, auth</span></div>
                      <div className="cp-mr"><span className="cp-mk">Duration</span><span className="cp-mv">Session-based</span></div>
                      <div className="cp-mr"><span className="cp-mk">Managed by</span><span className="cp-mv">Us &middot; First-party</span></div>
                    </div>
                  </div>

                  <div className="cp-cookie-card">
                    <div className="cp-ckh">
                      <span className="cp-ti">Performance &amp; Analytics</span>
                      <span className="cp-badge opt">Optional</span>
                    </div>
                    <p>Collect anonymized data on how visitors use our site, helping us improve performance and content.</p>
                    <div className="cp-ck-meta">
                      <div className="cp-mr"><span className="cp-mk">Examples</span><span className="cp-mv">Google Analytics</span></div>
                      <div className="cp-mr"><span className="cp-mk">Duration</span><span className="cp-mv">Up to 2 years</span></div>
                      <div className="cp-mr"><span className="cp-mk">Managed by</span><span className="cp-mv">Third parties</span></div>
                    </div>
                  </div>

                  <div className="cp-cookie-card">
                    <div className="cp-ckh">
                      <span className="cp-ti">Marketing &amp; Targeting</span>
                      <span className="cp-badge opt">Optional</span>
                    </div>
                    <p>Enable personalized advertising and track ad effectiveness across sites.</p>
                    <div className="cp-ck-meta">
                      <div className="cp-mr"><span className="cp-mk">Examples</span><span className="cp-mv">Google Ads, FB Pixel</span></div>
                      <div className="cp-mr"><span className="cp-mk">Duration</span><span className="cp-mv">Up to 2 years</span></div>
                      <div className="cp-mr"><span className="cp-mk">Managed by</span><span className="cp-mv">Google, Meta</span></div>
                    </div>
                  </div>

                  <div className="cp-cookie-card">
                    <div className="cp-ckh">
                      <span className="cp-ti">Functional Cookies</span>
                      <span className="cp-badge opt">Optional</span>
                    </div>
                    <p>Enhance site functionality by remembering your choices like language or region settings.</p>
                    <div className="cp-ck-meta">
                      <div className="cp-mr"><span className="cp-mk">Examples</span><span className="cp-mv">Preference cookies</span></div>
                      <div className="cp-mr"><span className="cp-mk">Duration</span><span className="cp-mv">Up to 1 year</span></div>
                      <div className="cp-mr"><span className="cp-mk">Managed by</span><span className="cp-mv">Us &middot; First-party</span></div>
                    </div>
                  </div>
                </div>

                <h3>Essential Cookies</h3>
                <p>These are necessary for the website to function properly and cannot be disabled in our systems. They are usually set in response to actions like logging in or filling out forms.</p>
                <ul>
                  <li><strong>Examples:</strong> Session cookies for maintaining user sessions, security cookies for authentication.</li>
                  <li><strong>Duration:</strong> Session-based (deleted when you close your browser).</li>
                  <li><strong>Managed By:</strong> Us (first-party cookies).</li>
                </ul>

                <h3>Performance and Analytics Cookies</h3>
                <p>These collect anonymized data on how visitors use our site, helping us improve performance and content.</p>
                <ul>
                  <li><strong>Examples:</strong> Google Analytics cookies tracking page views, bounce rates, and traffic sources.</li>
                  <li><strong>Duration:</strong> Up to 2 years (persistent).</li>
                  <li><strong>Managed By:</strong> Third parties like Google (with data processed anonymously).</li>
                </ul>

                <h3>Marketing and Targeting Cookies</h3>
                <p>These enable personalized advertising and track ad effectiveness across sites.</p>
                <ul>
                  <li><strong>Examples:</strong> Google Ads or Facebook Pixel cookies for remarketing and conversion tracking.</li>
                  <li><strong>Duration:</strong> Up to 2 years (persistent).</li>
                  <li><strong>Managed By:</strong> Third parties like Google or Meta (with options to opt out).</li>
                </ul>

                <h3>Functional Cookies</h3>
                <p>These enhance site functionality by remembering your choices.</p>
                <ul>
                  <li><strong>Examples:</strong> Cookies storing your preferred language or region settings.</li>
                  <li><strong>Duration:</strong> Up to 1 year (persistent).</li>
                  <li><strong>Managed By:</strong> Us (first-party cookies).</li>
                </ul>
                <p>We do not use cookies for profiling or automated decision-making without your consent.</p>
              </div>

              <div className="cp-section" id="s4">
                <h2><span className="cp-secnum">/04</span>Third-Party Cookies</h2>
                <p>Some cookies on our site are set by third-party services we use for analytics, advertising, or social media integration. These include:</p>
                <ul>
                  <li><strong>Google Analytics and Google Ads:</strong> For traffic analysis and ad personalization (Google&apos;s privacy policy: policies.google.com/privacy).</li>
                  <li><strong>Facebook Pixel:</strong> For social media advertising and retargeting (Meta&apos;s privacy policy: facebook.com/privacy/policy).</li>
                  <li><strong>Other Tools:</strong> Such as Hotjar for heatmaps or Mailchimp for email marketing.</li>
                </ul>
                <p>These third parties may combine data from our site with information from other sources. We do not control their practices and recommend reviewing their policies.</p>
              </div>

              <div className="cp-section" id="s5">
                <h2><span className="cp-secnum">/05</span>Your Choices and Cookie Management</h2>
                <p>You have full control over cookies:</p>
                <ul>
                  <li><strong>Cookie Consent Banner:</strong> On your first visit, you&apos;ll see a banner allowing you to accept, reject, or customize cookie preferences (except essential cookies).</li>
                  <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies. For instructions:
                    <ul>
                      <li>Chrome: support.google.com/chrome/answer/95647</li>
                      <li>Firefox: support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop</li>
                      <li>Safari: support.apple.com/en-in/guide/safari/sfri11471/mac</li>
                      <li>Edge: support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge</li>
                    </ul>
                  </li>
                  <li><strong>Opt-Out Tools:</strong> Use tools like Google&apos;s opt-out (tools.google.com/dlpage/gaoptout) or the Network Advertising Initiative (optout.networkadvertising.org).</li>
                  <li><strong>Do Not Track (DNT):</strong> We respect DNT signals where enabled in your browser.</li>
                </ul>
                <p>Note: Disabling cookies may limit site functionality, such as personalized features or analytics-driven improvements.</p>
              </div>

              <div className="cp-section" id="s6">
                <h2><span className="cp-secnum">/06</span>Data Security and Retention</h2>
                <p>Cookies containing personal data are handled securely per our Privacy Policy. We retain cookie data only as long as necessary:</p>
                <ul>
                  <li>Essential cookies: For the session duration.</li>
                  <li>Analytics cookies: Up to 2 years.</li>
                  <li>Marketing cookies: Up to 2 years or until you withdraw consent.</li>
                </ul>
                <p>Data is deleted or anonymized when no longer needed.</p>
              </div>

              <div className="cp-section" id="s7">
                <h2><span className="cp-secnum">/07</span>Children&apos;s Privacy</h2>
                <p>We do not knowingly collect cookie data from children under 18. If such data is identified, it is deleted immediately.</p>
              </div>

              <div className="cp-section" id="s8">
                <h2><span className="cp-secnum">/08</span>International Data Transfers</h2>
                <p>For users outside India, cookie data may be transferred to our servers or third-party processors. We ensure compliance with DPDPA and GDPR through appropriate safeguards, such as Standard Contractual Clauses.</p>
              </div>

              <div className="cp-section" id="s9">
                <h2><span className="cp-secnum">/09</span>Changes to This Cookie Policy</h2>
                <p>We may update this policy to reflect changes in our practices or legal requirements. Updates will be posted here with a revised effective date. Significant changes will be notified via the website or email.</p>
              </div>

              <div className="cp-section" id="s10">
                <h2><span className="cp-secnum">/10</span>Contact Us</h2>
                <p>For questions or to exercise your rights regarding cookies, contact our Data Protection Officer:</p>

                <div className="cp-contact-block">
                  <h3>Get in touch</h3>
                  <div className="cp-contact-rows">
                    <a href="mailto:seoshouts@gmail.com" className="cp-cr">
                      <div className="cp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <div>
                        <div className="cp-cr-k">Email</div>
                        <div className="cp-cr-v">seoshouts@gmail.com</div>
                      </div>
                    </a>
                    <a href="tel:+918094888157" className="cp-cr">
                      <div className="cp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div>
                        <div className="cp-cr-k">Phone</div>
                        <div className="cp-cr-v">+91 8094888157</div>
                      </div>
                    </a>
                    <Link href="/contact/" className="cp-cr">
                      <div className="cp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </div>
                      <div>
                        <div className="cp-cr-k">Form</div>
                        <div className="cp-cr-v">Contact page</div>
                      </div>
                    </Link>
                    <div className="cp-cr" style={{ cursor: 'default' }}>
                      <div className="cp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div>
                        <div className="cp-cr-k">Address</div>
                        <div className="cp-cr-v">Udaipur, Rajasthan, India</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick action */}
              <div className="cp-quick">
                <div className="cp-quick-inner">
                  <div>
                    <h3>Manage your cookie preferences</h3>
                    <p>Update your consent at any time. Essential cookies will always remain active for the site to function.</p>
                  </div>
                  <div className="cp-qa-btns">
                    <Link href="/privacy-policy/" className="cp-qa-btn">Privacy Policy</Link>
                    <Link href="/contact/" className="cp-qa-btn primary">Contact Us</Link>
                  </div>
                </div>
              </div>

            </article>
          </div>
        </section>

      </div>
    </>
  )
}
