import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | SEO Shouts',
  description: 'Read the terms and conditions governing your use of SEOShouts services, website, and related content.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms of Service | SEO Shouts',
    description: 'Detailed terms of service for using SEO Shouts website and services.',
    url: 'https://seoshouts.com/terms-and-conditions',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/terms-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Terms of Service',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | SEO Shouts',
    description: 'Terms governing the use of SEO Shouts services and website.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/terms-twitter-image.jpg'],
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

const TC_CSS = `
/* ── Terms of Service (tc-) ──────────────────────────────── */
.tc-hero {
  background: var(--ink);
  padding: 1.5rem 2rem 2.5rem;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.tc-hero-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image:
    linear-gradient(rgba(37,99,235,0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.18) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 80% at 30% 30%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 30% 30%, #000 30%, transparent 80%);
}
.tc-hero-inner {
  max-width: 1280px; margin: 0 auto; position: relative; z-index: 2;
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; align-items: end;
}
.tc-hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(37,99,235,0.4); padding: 6px 13px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--blue-light); margin-bottom: 1.25rem;
  font-family: 'JetBrains Mono', monospace;
}
.tc-hero-tag .tc-dot { width: 5px; height: 5px; background: var(--blue-light); }
.tc-hero h1 {
  font-size: clamp(2.2rem, 4.4vw, 3.6rem); font-weight: 700; color: #fff;
  line-height: 1.02; letter-spacing: -0.035em; margin-bottom: 1rem;
}
.tc-hero h1 .blue { color: var(--blue-light); }
.tc-hero .tc-sub { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.65; max-width: 600px; }
.tc-hero-meta {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  padding: 1.25rem 1.4rem; display: flex; flex-direction: column; gap: 0.6rem;
}
.tc-hero-meta .tc-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
}
.tc-hero-meta .tc-row + .tc-row { padding-top: 0.6rem; border-top: 1px dashed rgba(255,255,255,0.1); }
.tc-hero-meta .tc-k { color: var(--gray-4); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
.tc-hero-meta .tc-v { color: #fff; letter-spacing: 0.04em; font-weight: 600; }
.tc-hero-meta .tc-v .accent { color: var(--blue-light); }

/* Layout */
.tc-layout { background: var(--gray-1); padding: 4rem 2rem 6rem; border-bottom: 1px solid var(--line); }
.tc-layout-grid {
  max-width: 1280px; margin: 0 auto;
  display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 3rem; align-items: start;
}

/* TOC */
.tc-toc { position: sticky; top: 110px; background: #fff; border: 1px solid var(--line); padding: 1.25rem; }
.tc-toc-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 0.75rem; margin-bottom: 0.85rem; border-bottom: 1px solid var(--line);
}
.tc-toc-head h3 { font-size: 0.78rem; font-weight: 700; color: var(--ink); letter-spacing: -0.005em; }
.tc-toc-head .tc-toc-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-5); letter-spacing: 0.1em; }
.tc-toc-list { display: flex; flex-direction: column; gap: 1px; }
.tc-toc-list a {
  display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px;
  font-size: 0.82rem; color: var(--gray-5); line-height: 1.4;
  transition: all 0.15s; border-left: 2px solid transparent; text-decoration: none;
}
.tc-toc-list a:hover { color: var(--ink); background: var(--gray-1); border-left-color: var(--blue-mid); }
.tc-toc-list a .tc-tnum {
  font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
  color: var(--blue); font-weight: 700; flex-shrink: 0; padding-top: 2px;
}

/* Document */
.tc-doc { background: #fff; border: 1px solid var(--line); padding: 3rem 3rem 3.5rem; }
.tc-doc .tc-intro { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--line); }
.tc-doc .tc-intro p { font-size: 1rem; color: var(--gray-5); line-height: 1.75; margin-bottom: 1rem; }
.tc-doc .tc-intro p:last-child { margin-bottom: 0; }
.tc-doc .tc-intro p strong { color: var(--ink); }
.tc-doc .tc-intro a { color: var(--blue); border-bottom: 1px dashed var(--blue); }
.tc-doc .tc-section { padding-top: 2.5rem; border-top: 1px solid var(--line); scroll-margin-top: 110px; }
.tc-doc h2 {
  font-size: 1.65rem; font-weight: 700; color: var(--ink); letter-spacing: -0.025em;
  line-height: 1.15; margin-bottom: 1rem; display: flex; align-items: baseline; gap: 14px;
}
.tc-doc h2 .tc-secnum {
  font-family: 'JetBrains Mono', monospace; font-size: 0.95rem;
  color: var(--blue); font-weight: 700; letter-spacing: 0.02em; flex-shrink: 0;
}
.tc-doc h3 {
  font-size: 1.1rem; font-weight: 700; color: var(--ink); letter-spacing: -0.015em;
  margin: 1.75rem 0 0.75rem; padding-left: 12px; border-left: 3px solid var(--blue); line-height: 1.3;
}
.tc-doc p { font-size: 0.96rem; color: var(--gray-5); line-height: 1.75; margin-bottom: 1rem; }
.tc-doc p strong { color: var(--ink); font-weight: 600; }
.tc-doc p a { color: var(--blue); border-bottom: 1px dashed var(--blue); }
.tc-doc ul { margin: 0.5rem 0 1.25rem 0; display: flex; flex-direction: column; gap: 8px; padding: 0; list-style: none; }
.tc-doc ul li {
  font-size: 0.95rem; color: var(--gray-5); line-height: 1.65;
  padding-left: 1.5rem; position: relative;
}
.tc-doc ul li::before {
  content: ''; position: absolute; left: 0; top: 0.65em;
  width: 8px; height: 8px; background: var(--blue-pale); border: 1.5px solid var(--blue);
}
.tc-doc ul li strong { color: var(--ink); font-weight: 600; }
.tc-doc ul ul { margin: 0.5rem 0 0.5rem 0; }
.tc-doc ul ul li::before { background: var(--gray-2); border-color: var(--gray-3); }

/* Contact block */
.tc-contact-block { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--line); }
.tc-contact-block h3 {
  font-size: 1.05rem; font-weight: 700; color: var(--ink); letter-spacing: -0.015em;
  margin-bottom: 1rem; border-left: none; padding-left: 0;
}
.tc-contact-rows { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.tc-cr {
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  background: var(--gray-1); border: 1px solid var(--line);
  transition: all 0.15s; text-decoration: none;
}
.tc-cr:hover { background: var(--blue-pale); border-color: var(--blue-mid); border-left: 3px solid var(--blue); }
.tc-cr .tc-cr-ico {
  width: 32px; height: 32px; background: #fff; border: 1px solid var(--line);
  color: var(--blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.tc-cr .tc-cr-k { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-5); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }
.tc-cr .tc-cr-v { font-size: 0.88rem; color: var(--ink); font-weight: 600; }

/* Quick action */
.tc-quick {
  margin-top: 2.5rem; background: var(--ink); color: #fff;
  padding: 1.75rem 2rem; position: relative; overflow: hidden;
}
.tc-quick::before {
  content: ''; position: absolute; inset: 0; opacity: 0.35; pointer-events: none;
  background-image:
    linear-gradient(rgba(37,99,235,0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.22) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 100% 80% at 0% 0%, #000 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 100% 80% at 0% 0%, #000 0%, transparent 70%);
}
.tc-quick-inner { position: relative; display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center; }
.tc-quick h3 { font-size: 1.15rem; font-weight: 700; color: #fff; letter-spacing: -0.015em; margin-bottom: 0.4rem; padding: 0; border: none; }
.tc-quick p { font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.55; margin: 0; }
.tc-qa-btns { display: flex; gap: 8px; flex-shrink: 0; }
.tc-qa-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 11px 16px;
  font-weight: 700; font-size: 0.82rem; letter-spacing: -0.005em;
  border: 1px solid rgba(255,255,255,0.18); color: #fff;
  transition: all 0.15s; cursor: pointer; text-decoration: none; white-space: nowrap;
}
.tc-qa-btn.primary { background: var(--blue); border-color: var(--blue); }
.tc-qa-btn.primary:hover { background: var(--blue-dark); border-color: var(--blue-dark); }
.tc-qa-btn:hover { border-color: #fff; background: rgba(255,255,255,0.04); }

/* Responsive */
@media (max-width: 1024px) {
  .tc-hero-inner { grid-template-columns: 1fr; }
  .tc-layout-grid { grid-template-columns: 1fr; gap: 2rem; }
  .tc-toc { position: static; }
  .tc-doc { padding: 2.25rem; }
  .tc-quick-inner { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .tc-doc { padding: 1.5rem; }
  .tc-doc h2 { font-size: 1.35rem; }
  .tc-contact-rows { grid-template-columns: 1fr; }
  .tc-hero { padding: 3rem 1.25rem 2.5rem; }
  .tc-layout { padding: 2.5rem 1.25rem 4rem; }
}
`

export default function TermsAndConditionsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TC_CSS }} />
      <div>

        {/* Breadcrumbs */}
        <div className="crumbs">
          <div className="crumbs-inner">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Terms of Service</span>
          </div>
        </div>

        {/* Hero */}
        <section className="tc-hero">
          <div className="tc-hero-grid" aria-hidden="true" />
          <div className="tc-hero-inner">
            <div>
              <div className="tc-hero-tag">
                <span className="tc-dot" aria-hidden="true" />
                // LEGAL &middot; TERMS
              </div>
              <h1>Terms of Service <span className="blue">for SEOShouts.</span></h1>
              <p className="tc-sub">The legal agreement governing your use of SEOShouts services, website, and related content.</p>
            </div>
            <div className="tc-hero-meta">
              <div className="tc-row">
                <span className="tc-k">Effective</span>
                <span className="tc-v">August 01, 2025</span>
              </div>
              <div className="tc-row">
                <span className="tc-k">Last updated</span>
                <span className="tc-v"><span className="accent">&#9679;</span> August 01, 2025</span>
              </div>
              <div className="tc-row">
                <span className="tc-k">Governs</span>
                <span className="tc-v">seoshouts.com</span>
              </div>
              <div className="tc-row">
                <span className="tc-k">Jurisdiction</span>
                <span className="tc-v">India &middot; Udaipur courts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Layout: TOC + Doc */}
        <section className="tc-layout">
          <div className="tc-layout-grid">

            {/* Sticky TOC */}
            <aside className="tc-toc">
              <div className="tc-toc-head">
                <h3>On this page</h3>
                <span className="tc-toc-tag">// TOC</span>
              </div>
              <nav className="tc-toc-list">
                <a href="#s1"><span className="tc-tnum">01</span>Acceptance of Terms</a>
                <a href="#s2"><span className="tc-tnum">02</span>Description of Services</a>
                <a href="#s3"><span className="tc-tnum">03</span>User Accounts &amp; Responsibilities</a>
                <a href="#s4"><span className="tc-tnum">04</span>Payment and Billing</a>
                <a href="#s5"><span className="tc-tnum">05</span>Intellectual Property</a>
                <a href="#s6"><span className="tc-tnum">06</span>Service Delivery &amp; Limits</a>
                <a href="#s7"><span className="tc-tnum">07</span>Limitations of Liability</a>
                <a href="#s8"><span className="tc-tnum">08</span>Indemnification</a>
                <a href="#s9"><span className="tc-tnum">09</span>Termination</a>
                <a href="#s10"><span className="tc-tnum">10</span>Dispute Resolution</a>
                <a href="#s11"><span className="tc-tnum">11</span>Governing Law</a>
                <a href="#s12"><span className="tc-tnum">12</span>Force Majeure</a>
                <a href="#s13"><span className="tc-tnum">13</span>Miscellaneous</a>
                <a href="#s14"><span className="tc-tnum">14</span>Changes to Terms</a>
                <a href="#s15"><span className="tc-tnum">15</span>Contact Us</a>
              </nav>
            </aside>

            {/* Document */}
            <article className="tc-doc">

              <div className="tc-intro">
                <p>Welcome to <strong>SEOShouts</strong> (operated under seoshouts.com, headquartered in Udaipur, Rajasthan, India). These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of our website, services, and any related content or features (collectively, the &ldquo;Services&rdquo;). By accessing or using our Services, you agree to be bound by these Terms, which form a legally binding agreement between you (&ldquo;User,&rdquo; &ldquo;Client,&rdquo; or &ldquo;You&rdquo;) and SEOShouts (&ldquo;We,&rdquo; &ldquo;Us,&rdquo; or &ldquo;Our&rdquo;).</p>
                <p>If you do not agree with any part of these Terms, please do not use our Services. We reserve the right to update these Terms at any time, with changes posted on this page. Continued use after updates constitutes acceptance of the revised Terms. These Terms are governed by the laws of India, including the <strong>Indian Contract Act, 1872</strong> and the <strong>Information Technology Act, 2000</strong>.</p>
              </div>

              <div className="tc-section" id="s1">
                <h2><span className="tc-secnum">/01</span>Acceptance of Terms</h2>
                <p>By using our Services, you confirm that:</p>
                <ul>
                  <li>You are at least 18 years old or have the legal capacity to enter into contracts under applicable law.</li>
                  <li>You will comply with these Terms and all applicable local, state, national, and international laws.</li>
                  <li>You are not prohibited from using our Services under any applicable laws or regulations.</li>
                </ul>
                <p>We may refuse service, terminate accounts, or cancel orders at our discretion if we believe these Terms have been violated.</p>
              </div>

              <div className="tc-section" id="s2">
                <h2><span className="tc-secnum">/02</span>Description of Services</h2>
                <p>SEOShouts provides digital marketing services, including but not limited to:</p>
                <ul>
                  <li>Search Engine Optimization (SEO) consulting, audits, and implementation.</li>
                  <li>Link building and authority development strategies.</li>
                  <li>Website development and optimization.</li>
                  <li>PPC (Pay-Per-Click) advertising and social media marketing.</li>
                  <li>Related consulting, training, and support services.</li>
                </ul>
                <p>Services are provided on a project or ongoing basis as agreed upon in a separate service agreement or proposal. We do not guarantee specific results, rankings, or outcomes due to the dynamic nature of search engines and external factors beyond our control.</p>
              </div>

              <div className="tc-section" id="s3">
                <h2><span className="tc-secnum">/03</span>User Accounts and Responsibilities</h2>

                <h3>Account Creation</h3>
                <ul>
                  <li>To access certain Services, you may need to create an account with accurate and complete information.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</li>
                  <li>Notify us immediately of any unauthorized access or security breach.</li>
                </ul>

                <h3>User Obligations</h3>
                <ul>
                  <li>Provide accurate, current, and complete information during registration, inquiries, or service engagements.</li>
                  <li>Use Services only for lawful purposes and in compliance with these Terms.</li>
                  <li>Not engage in any activity that interferes with or disrupts the Services, such as hacking, spamming, or distributing malware.</li>
                  <li>Not reproduce, duplicate, copy, sell, or exploit any part of the Services without our express written permission.</li>
                  <li>Respect intellectual property rights and not infringe on third-party copyrights, trademarks, or patents.</li>
                </ul>
                <p>Violation of these obligations may result in immediate termination of Services and potential legal action.</p>
              </div>

              <div className="tc-section" id="s4">
                <h2><span className="tc-secnum">/04</span>Payment and Billing</h2>
                <ul>
                  <li>Services are provided upon agreement to a proposal or contract, which outlines scope, deliverables, and payment terms.</li>
                  <li>Payments are due as specified in the invoice or contract (e.g., upfront, milestone-based, or monthly).</li>
                  <li>All payments are non-refundable except as explicitly stated in a service agreement.</li>
                  <li>We accept payments via bank transfer, credit card, or other methods specified. All transactions are processed securely through third-party gateways.</li>
                  <li>Late payments may incur fees or result in suspension of Services. Taxes, if applicable, are your responsibility.</li>
                </ul>
                <p>We reserve the right to modify payment terms with notice.</p>
              </div>

              <div className="tc-section" id="s5">
                <h2><span className="tc-secnum">/05</span>Intellectual Property Rights</h2>

                <h3>Our Intellectual Property</h3>
                <ul>
                  <li>All content on our website (text, graphics, logos, images, software, etc.) is owned by SEOShouts or our licensors and protected by copyright, trademark, and other intellectual property laws.</li>
                  <li>You may not copy, modify, distribute, or use our intellectual property without prior written consent.</li>
                </ul>

                <h3>Your Content and Submissions</h3>
                <ul>
                  <li>Any content you provide (e.g., project briefs, feedback, or materials for services) grants us a non-exclusive, royalty-free license to use it for delivering Services.</li>
                  <li>You retain ownership of your content but warrant that it does not infringe on third-party rights.</li>
                  <li>We may use anonymized case studies or results from our work with you for marketing purposes, unless otherwise agreed.</li>
                </ul>
              </div>

              <div className="tc-section" id="s6">
                <h2><span className="tc-secnum">/06</span>Service Delivery and Limitations</h2>
                <ul>
                  <li>We strive to deliver Services as described, but timelines may vary due to factors like client feedback delays or external dependencies.</li>
                  <li>Services are provided &ldquo;as is&rdquo; without warranties of any kind, express or implied, including fitness for a particular purpose or non-infringement.</li>
                  <li>We do not guarantee specific SEO results, traffic increases, or rankings, as these depend on search engine algorithms and external factors.</li>
                  <li>You acknowledge that digital marketing involves risks, such as algorithm changes or competitive shifts, and we are not liable for such outcomes.</li>
                </ul>
              </div>

              <div className="tc-section" id="s7">
                <h2><span className="tc-secnum">/07</span>Limitations of Liability</h2>
                <p>To the fullest extent permitted by law:</p>
                <ul>
                  <li>SEOShouts, its affiliates, employees, and agents shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from or related to the Services, even if advised of the possibility of such damages.</li>
                  <li>Our total liability shall not exceed the amount paid by you for the specific Services giving rise to the claim.</li>
                  <li>This limitation applies to all claims, including contract, tort, negligence, or strict liability.</li>
                </ul>
                <p>We are not responsible for losses due to events beyond our control, such as natural disasters, cyber-attacks, or third-party service failures.</p>
              </div>

              <div className="tc-section" id="s8">
                <h2><span className="tc-secnum">/08</span>Indemnification</h2>
                <p>You agree to indemnify, defend, and hold harmless SEOShouts, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising from:</p>
                <ul>
                  <li>Your violation of these Terms or applicable laws.</li>
                  <li>Your content or use of Services infringing on third-party rights.</li>
                  <li>Any negligent or willful misconduct on your part.</li>
                </ul>
              </div>

              <div className="tc-section" id="s9">
                <h2><span className="tc-secnum">/09</span>Termination</h2>
                <p>We may terminate or suspend your access to Services at any time, without notice, for reasons including:</p>
                <ul>
                  <li>Violation of these Terms.</li>
                  <li>Non-payment or breach of contract.</li>
                  <li>Legal requirements or business decisions.</li>
                </ul>
                <p>Upon termination, you must cease using Services, and any outstanding payments remain due. Provisions surviving termination include intellectual property, limitations of liability, and indemnification.</p>
              </div>

              <div className="tc-section" id="s10">
                <h2><span className="tc-secnum">/10</span>Dispute Resolution</h2>
                <p>Any disputes arising from these Terms or Services shall be resolved through good-faith negotiations. If unresolved, they will be submitted to binding arbitration in Udaipur, Rajasthan, under the <strong>Arbitration and Conciliation Act, 1996</strong>. The arbitrator&apos;s decision is final and enforceable in court.</p>
              </div>

              <div className="tc-section" id="s11">
                <h2><span className="tc-secnum">/11</span>Governing Law and Jurisdiction</h2>
                <p>These Terms are governed by the laws of India, without regard to conflict of laws principles. Exclusive jurisdiction for disputes lies with the courts in Udaipur, Rajasthan.</p>
              </div>

              <div className="tc-section" id="s12">
                <h2><span className="tc-secnum">/12</span>Force Majeure</h2>
                <p>We are not liable for delays or failures due to events beyond our reasonable control, such as acts of God, war, terrorism, pandemics, or government actions.</p>
              </div>

              <div className="tc-section" id="s13">
                <h2><span className="tc-secnum">/13</span>Miscellaneous</h2>
                <ul>
                  <li><strong>Severability:</strong> If any provision is deemed invalid, the remaining Terms remain in effect.</li>
                  <li><strong>Waiver:</strong> Failure to enforce any right does not constitute a waiver.</li>
                  <li><strong>Assignment:</strong> We may assign these Terms without notice; you may not assign without our consent.</li>
                  <li><strong>Entire Agreement:</strong> These Terms, along with any service agreements, constitute the full understanding between parties.</li>
                  <li><strong>Notices:</strong> Communications will be via email or posted on the website.</li>
                </ul>
              </div>

              <div className="tc-section" id="s14">
                <h2><span className="tc-secnum">/14</span>Changes to Terms</h2>
                <p>We may update these Terms at any time. Changes will be posted here with a revised effective date. Significant changes will be notified via email or website notice. Continued use constitutes acceptance.</p>
              </div>

              <div className="tc-section" id="s15">
                <h2><span className="tc-secnum">/15</span>Contact Us</h2>
                <p>For questions or concerns about these Terms, please reach out. We look forward to serving you and are happy to clarify any aspect of this agreement.</p>

                <div className="tc-contact-block">
                  <h3>Get in touch</h3>
                  <div className="tc-contact-rows">
                    <a href="mailto:seoshouts@gmail.com" className="tc-cr">
                      <div className="tc-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <div>
                        <div className="tc-cr-k">Email</div>
                        <div className="tc-cr-v">seoshouts@gmail.com</div>
                      </div>
                    </a>
                    <a href="tel:+918094888157" className="tc-cr">
                      <div className="tc-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div>
                        <div className="tc-cr-k">Phone</div>
                        <div className="tc-cr-v">+91 8094888157</div>
                      </div>
                    </a>
                    <Link href="/contact/" className="tc-cr">
                      <div className="tc-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </div>
                      <div>
                        <div className="tc-cr-k">Form</div>
                        <div className="tc-cr-v">Contact page</div>
                      </div>
                    </Link>
                    <div className="tc-cr" style={{ cursor: 'default' }}>
                      <div className="tc-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div>
                        <div className="tc-cr-k">Address</div>
                        <div className="tc-cr-v">Udaipur, Rajasthan, India</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick action */}
              <div className="tc-quick">
                <div className="tc-quick-inner">
                  <div>
                    <h3>Questions about our terms?</h3>
                    <p>Review our privacy practices or get in touch directly with any questions about this agreement.</p>
                  </div>
                  <div className="tc-qa-btns">
                    <Link href="/privacy-policy/" className="tc-qa-btn">Privacy Policy</Link>
                    <Link href="/contact/" className="tc-qa-btn primary">Contact Us</Link>
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
