import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | SEO Shouts',
  description: 'Our commitment to protecting your privacy and handling your personal data with care. Learn how we collect, use, and safeguard your information.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | SEO Shouts',
    description: 'Detailed information on how SEO Shouts handles your personal data in compliance with Indian and international privacy laws.',
    url: 'https://seoshouts.com/privacy-policy',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/privacy-policy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | SEO Shouts',
    description: 'How we protect your privacy and handle personal data at SEO Shouts.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/privacy-policy-twitter.jpg'],
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

const PP_CSS = `
/* ── Privacy Policy (pp-) ──────────────────────────────── */
.pp-hero {
  background: var(--ink);
  padding: 1.5rem 2rem 2.5rem;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.pp-hero-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image:
    linear-gradient(rgba(37,99,235,0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.18) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 80% at 30% 30%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 30% 30%, #000 30%, transparent 80%);
}
.pp-hero-inner {
  max-width: 1280px; margin: 0 auto; position: relative; z-index: 2;
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; align-items: end;
}
.pp-hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(37,99,235,0.4); padding: 6px 13px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--blue-light); margin-bottom: 1.25rem;
  font-family: 'JetBrains Mono', monospace;
}
.pp-hero-tag .pp-dot { width: 5px; height: 5px; background: var(--blue-light); }
.pp-hero h1 {
  font-size: clamp(2.2rem, 4.4vw, 3.6rem); font-weight: 700; color: #fff;
  line-height: 1.02; letter-spacing: -0.035em; margin-bottom: 1rem;
}
.pp-hero h1 .blue { color: var(--blue-light); }
.pp-hero .pp-sub { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.65; max-width: 600px; }
.pp-hero-meta {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  padding: 1.25rem 1.4rem; display: flex; flex-direction: column; gap: 0.6rem;
}
.pp-hero-meta .pp-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
}
.pp-hero-meta .pp-row + .pp-row { padding-top: 0.6rem; border-top: 1px dashed rgba(255,255,255,0.1); }
.pp-hero-meta .pp-k { color: var(--gray-4); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
.pp-hero-meta .pp-v { color: #fff; letter-spacing: 0.04em; font-weight: 600; }
.pp-hero-meta .pp-v .accent { color: var(--blue-light); }

/* Layout */
.pp-layout { background: var(--gray-1); padding: 4rem 2rem 6rem; border-bottom: 1px solid var(--line); }
.pp-layout-grid {
  max-width: 1280px; margin: 0 auto;
  display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 3rem; align-items: start;
}

/* TOC */
.pp-toc { position: sticky; top: 110px; background: #fff; border: 1px solid var(--line); padding: 1.25rem; }
.pp-toc-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 0.75rem; margin-bottom: 0.85rem; border-bottom: 1px solid var(--line);
}
.pp-toc-head h3 { font-size: 0.78rem; font-weight: 700; color: var(--ink); letter-spacing: -0.005em; }
.pp-toc-head .pp-toc-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-5); letter-spacing: 0.1em; }
.pp-toc-list { display: flex; flex-direction: column; gap: 1px; }
.pp-toc-list a {
  display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px;
  font-size: 0.82rem; color: var(--gray-5); line-height: 1.4;
  transition: all 0.15s; border-left: 2px solid transparent; text-decoration: none;
}
.pp-toc-list a:hover { color: var(--ink); background: var(--gray-1); border-left-color: var(--blue-mid); }
.pp-toc-list a .pp-tnum {
  font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
  color: var(--blue); font-weight: 700; flex-shrink: 0; padding-top: 2px;
}

/* Document */
.pp-doc { background: #fff; border: 1px solid var(--line); padding: 3rem 3rem 3.5rem; }
.pp-doc .pp-intro { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--line); }
.pp-doc .pp-intro p { font-size: 1rem; color: var(--gray-5); line-height: 1.75; margin-bottom: 1rem; }
.pp-doc .pp-intro p:last-child { margin-bottom: 0; }
.pp-doc .pp-intro p strong { color: var(--ink); }
.pp-doc .pp-intro a { color: var(--blue); border-bottom: 1px dashed var(--blue); }
.pp-doc .pp-section { padding-top: 2.5rem; border-top: 1px solid var(--line); scroll-margin-top: 110px; }
.pp-doc h2 {
  font-size: 1.65rem; font-weight: 700; color: var(--ink); letter-spacing: -0.025em;
  line-height: 1.15; margin-bottom: 1rem; display: flex; align-items: baseline; gap: 14px;
}
.pp-doc h2 .pp-secnum {
  font-family: 'JetBrains Mono', monospace; font-size: 0.95rem;
  color: var(--blue); font-weight: 700; letter-spacing: 0.02em; flex-shrink: 0;
}
.pp-doc h3 {
  font-size: 1.1rem; font-weight: 700; color: var(--ink); letter-spacing: -0.015em;
  margin: 1.75rem 0 0.75rem; padding-left: 12px; border-left: 3px solid var(--blue); line-height: 1.3;
}
.pp-doc p { font-size: 0.96rem; color: var(--gray-5); line-height: 1.75; margin-bottom: 1rem; }
.pp-doc p strong { color: var(--ink); font-weight: 600; }
.pp-doc p a { color: var(--blue); border-bottom: 1px dashed var(--blue); }
.pp-doc ul { margin: 0.5rem 0 1.25rem 0; display: flex; flex-direction: column; gap: 8px; padding: 0; list-style: none; }
.pp-doc ul li {
  font-size: 0.95rem; color: var(--gray-5); line-height: 1.65;
  padding-left: 1.5rem; position: relative;
}
.pp-doc ul li::before {
  content: ''; position: absolute; left: 0; top: 0.65em;
  width: 8px; height: 8px; background: var(--blue-pale); border: 1.5px solid var(--blue);
}
.pp-doc ul li strong { color: var(--ink); font-weight: 600; }
.pp-doc ul ul { margin: 0.5rem 0 0.5rem 0; }
.pp-doc ul ul li::before { background: var(--gray-2); border-color: var(--gray-3); }

/* Contact block */
.pp-contact-block { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--line); }
.pp-contact-block h3 {
  font-size: 1.05rem; font-weight: 700; color: var(--ink); letter-spacing: -0.015em;
  margin-bottom: 1rem; border-left: none; padding-left: 0;
}
.pp-contact-rows { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.pp-cr {
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  background: var(--gray-1); border: 1px solid var(--line);
  transition: all 0.15s; text-decoration: none;
}
.pp-cr:hover { background: var(--blue-pale); border-color: var(--blue-mid); border-left: 3px solid var(--blue); }
.pp-cr .pp-cr-ico {
  width: 32px; height: 32px; background: #fff; border: 1px solid var(--line);
  color: var(--blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pp-cr .pp-cr-k { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-5); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }
.pp-cr .pp-cr-v { font-size: 0.88rem; color: var(--ink); font-weight: 600; }

/* Quick action */
.pp-quick {
  margin-top: 2.5rem; background: var(--ink); color: #fff;
  padding: 1.75rem 2rem; position: relative; overflow: hidden;
}
.pp-quick::before {
  content: ''; position: absolute; inset: 0; opacity: 0.35; pointer-events: none;
  background-image:
    linear-gradient(rgba(37,99,235,0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.22) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 100% 80% at 0% 0%, #000 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 100% 80% at 0% 0%, #000 0%, transparent 70%);
}
.pp-quick-inner { position: relative; display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center; }
.pp-quick h3 { font-size: 1.15rem; font-weight: 700; color: #fff; letter-spacing: -0.015em; margin-bottom: 0.4rem; padding: 0; border: none; }
.pp-quick p { font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.55; margin: 0; }
.pp-qa-btns { display: flex; gap: 8px; flex-shrink: 0; }
.pp-qa-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 11px 16px;
  font-weight: 700; font-size: 0.82rem; letter-spacing: -0.005em;
  border: 1px solid rgba(255,255,255,0.18); color: #fff;
  transition: all 0.15s; cursor: pointer; text-decoration: none; white-space: nowrap;
}
.pp-qa-btn.primary { background: var(--blue); border-color: var(--blue); }
.pp-qa-btn.primary:hover { background: var(--blue-dark); border-color: var(--blue-dark); }
.pp-qa-btn:hover { border-color: #fff; background: rgba(255,255,255,0.04); }

/* Responsive */
@media (max-width: 1024px) {
  .pp-hero-inner { grid-template-columns: 1fr; }
  .pp-layout-grid { grid-template-columns: 1fr; gap: 2rem; }
  .pp-toc { position: static; }
  .pp-doc { padding: 2.25rem; }
  .pp-quick-inner { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .pp-doc { padding: 1.5rem; }
  .pp-doc h2 { font-size: 1.35rem; }
  .pp-contact-rows { grid-template-columns: 1fr; }
  .pp-hero { padding: 3rem 1.25rem 2.5rem; }
  .pp-layout { padding: 2.5rem 1.25rem 4rem; }
}
`

export default function PrivacyPolicyPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PP_CSS }} />
      <div>

        {/* Breadcrumbs */}
        <div className="crumbs">
          <div className="crumbs-inner">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Privacy Policy</span>
          </div>
        </div>

        {/* Hero */}
        <section className="pp-hero">
          <div className="pp-hero-grid" aria-hidden="true" />
          <div className="pp-hero-inner">
            <div>
              <div className="pp-hero-tag">
                <span className="pp-dot" aria-hidden="true" />
                // LEGAL &middot; PRIVACY
              </div>
              <h1>Privacy Policy <span className="blue">for SEOShouts.</span></h1>
              <p className="pp-sub">How we collect, use, and protect your personal data — and your rights under Indian and international privacy laws.</p>
            </div>
            <div className="pp-hero-meta">
              <div className="pp-row">
                <span className="pp-k">Effective</span>
                <span className="pp-v">January 01, 2024</span>
              </div>
              <div className="pp-row">
                <span className="pp-k">Last updated</span>
                <span className="pp-v"><span className="accent">&#9679;</span> March 11, 2026</span>
              </div>
              <div className="pp-row">
                <span className="pp-k">Governs</span>
                <span className="pp-v">seoshouts.com</span>
              </div>
              <div className="pp-row">
                <span className="pp-k">Jurisdiction</span>
                <span className="pp-v">India &middot; GDPR &middot; DPDPA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Layout: TOC + Doc */}
        <section className="pp-layout">
          <div className="pp-layout-grid">

            {/* Sticky TOC */}
            <aside className="pp-toc">
              <div className="pp-toc-head">
                <h3>On this page</h3>
                <span className="pp-toc-tag">// TOC</span>
              </div>
              <nav className="pp-toc-list">
                <a href="#s1"><span className="pp-tnum">01</span>Information We Collect</a>
                <a href="#s2"><span className="pp-tnum">02</span>How We Collect Information</a>
                <a href="#s3"><span className="pp-tnum">03</span>How We Use Your Information</a>
                <a href="#s4"><span className="pp-tnum">04</span>Sharing &amp; Disclosure</a>
                <a href="#s5"><span className="pp-tnum">05</span>Data Security Measures</a>
                <a href="#s6"><span className="pp-tnum">06</span>Your Rights &amp; Choices</a>
                <a href="#s7"><span className="pp-tnum">07</span>Cookies &amp; Tracking</a>
                <a href="#s8"><span className="pp-tnum">08</span>Data Retention</a>
                <a href="#s9"><span className="pp-tnum">09</span>Children&apos;s Privacy</a>
                <a href="#s10"><span className="pp-tnum">10</span>Third-Party Links</a>
                <a href="#s11"><span className="pp-tnum">11</span>Changes to Policy</a>
                <a href="#s12"><span className="pp-tnum">12</span>Contact Us</a>
              </nav>
            </aside>

            {/* Document */}
            <article className="pp-doc">

              <div className="pp-intro">
                <p>At <strong>SEOShouts</strong> (operated under seoshouts.com, headquartered in Udaipur, Rajasthan, India), we are committed to protecting your privacy and handling your personal data with the utmost care and transparency. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, engage with our services, or interact with us in any way.</p>
                <p>We comply with applicable Indian laws, including the <strong>Information Technology Act, 2000</strong>, the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, and the <strong>General Data Protection Regulation (GDPR)</strong> for users in the European Union. By accessing or using our website or services, you consent to the practices described in this Privacy Policy.</p>
              </div>

              <div className="pp-section" id="s1">
                <h2><span className="pp-secnum">/01</span>Information We Collect</h2>
                <p>We collect information that identifies, relates to, or could reasonably be linked with you as an individual (&ldquo;Personal Data&rdquo;). The types of information we may collect include:</p>

                <h3>Personal Identification Information</h3>
                <ul>
                  <li>Name, email address, phone number, postal address, and other contact details you provide when inquiring about services, subscribing to newsletters, or contacting us via forms on the website.</li>
                  <li>Billing and payment information (e.g., credit card details, bank account information) if you engage in paid services, processed securely through third-party payment gateways.</li>
                </ul>

                <h3>Professional or Business-Related Information</h3>
                <ul>
                  <li>Company name, job title, industry, and business contact details shared during consultations or service engagements.</li>
                  <li>Details about your website, SEO goals, or digital marketing needs provided in inquiries or project briefs.</li>
                </ul>

                <h3>Technical and Usage Data</h3>
                <ul>
                  <li>Device information, such as IP address, browser type, operating system, and device identifiers.</li>
                  <li>Usage data, including pages visited, time spent on the site, referral sources, and navigation patterns.</li>
                  <li>Log data, such as access times, error logs, and server interactions.</li>
                </ul>

                <h3>Marketing and Communication Data</h3>
                <ul>
                  <li>Preferences for receiving marketing communications from us.</li>
                  <li>Responses to surveys, feedback forms, or promotional campaigns.</li>
                </ul>

                <h3>Sensitive Personal Data</h3>
                <p>We do not intentionally collect sensitive personal data (e.g., racial or ethnic origin, religious beliefs, health information, or biometric data) unless voluntarily provided for a specific purpose. If such data is shared, we handle it with additional safeguards as required by law.</p>
                <p>We do not collect Personal Data from individuals under 18 years of age. If we become aware that we have collected such data, we will promptly delete it.</p>
              </div>

              <div className="pp-section" id="s2">
                <h2><span className="pp-secnum">/02</span>How We Collect Information</h2>

                <h3>Directly from You</h3>
                <ul>
                  <li>When you fill out contact forms, request quotes, subscribe to our newsletter, or engage in consultations.</li>
                  <li>During communications via email, phone, or our website&apos;s chat features.</li>
                  <li>When you provide feedback, participate in surveys, or interact with our blog comments.</li>
                </ul>

                <h3>Automatically Through Technology</h3>
                <ul>
                  <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and tracking pixels to collect usage data. Essential cookies enable core site functionality, while analytics cookies help us improve user experience. For details, see our <Link href="/cookie-policy/">Cookie Policy</Link>.</li>
                  <li><strong>Analytics Tools:</strong> We use Google Analytics to track website performance and user behavior. This may include anonymized data about your visit duration and pages viewed.</li>
                  <li><strong>Log Files:</strong> Our servers automatically log standard information for security and performance monitoring.</li>
                </ul>

                <h3>From Third Parties</h3>
                <ul>
                  <li>From business partners, such as analytics providers (e.g., Google) or advertising networks, who may share aggregated data.</li>
                  <li>From publicly available sources, such as social media profiles or business directories, when relevant to service delivery.</li>
                  <li>From payment processors during transactions, ensuring secure handling.</li>
                </ul>
              </div>

              <div className="pp-section" id="s3">
                <h2><span className="pp-secnum">/03</span>How We Use Your Information</h2>
                <p>We use your Personal Data for legitimate business purposes, always in compliance with applicable laws. Primary uses include:</p>
                <ul>
                  <li><strong>Providing Services:</strong> To respond to inquiries, deliver SEO consulting, link building, or other services, and manage client relationships.</li>
                  <li><strong>Website Operation and Improvement:</strong> To maintain site functionality, analyze usage patterns, and enhance user experience.</li>
                  <li><strong>Marketing and Communications:</strong> To send newsletters, promotional offers, or updates about our services (with your consent where required). You can opt out at any time via unsubscribe links or by contacting us.</li>
                  <li><strong>Legal Compliance and Security:</strong> To comply with legal obligations, prevent fraud, resolve disputes, and enforce our terms of service.</li>
                  <li><strong>Analytics and Research:</strong> To generate anonymized insights that help us improve our services and understand market trends.</li>
                  <li><strong>Personalization:</strong> To tailor content and recommendations based on your interactions and preferences.</li>
                </ul>
                <p>We do not use your data for automated decision-making that produces legal effects or significantly affects you without human oversight.</p>
              </div>

              <div className="pp-section" id="s4">
                <h2><span className="pp-secnum">/04</span>Sharing and Disclosure of Information</h2>
                <p>We do not sell, rent, or trade your Personal Data. We may share information in the following limited circumstances:</p>
                <ul>
                  <li><strong>Service Providers:</strong> With trusted third-party vendors (e.g., hosting providers, email services like Mailchimp, or analytics tools like Google Analytics) who assist in operating our website and services. These providers are contractually bound to use data only for specified purposes and maintain confidentiality.</li>
                  <li><strong>Business Partners:</strong> With affiliates or partners for joint marketing or service delivery, always with your consent.</li>
                  <li><strong>Legal Requirements:</strong> If required by law, court order, or government authority, or to protect our rights, property, or safety (e.g., in response to a subpoena or fraud investigation).</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the business assets, with notice provided where required.</li>
                  <li><strong>Aggregated or Anonymized Data:</strong> We may share non-personal, aggregated data for research or marketing purposes.</li>
                </ul>
                <p>For users in the EU/EEA, we ensure that any international data transfers comply with GDPR requirements, such as Standard Contractual Clauses.</p>
              </div>

              <div className="pp-section" id="s5">
                <h2><span className="pp-secnum">/05</span>Data Security Measures</h2>
                <p>We implement robust security measures to protect your Personal Data from unauthorized access, alteration, disclosure, or destruction:</p>
                <ul>
                  <li><strong>Technical Safeguards:</strong> Encryption (e.g., SSL/TLS for data in transit), firewalls, and secure servers hosted in compliant data centers.</li>
                  <li><strong>Organizational Measures:</strong> Access controls limiting data to authorized personnel only, regular security audits, and employee training on data protection.</li>
                  <li><strong>Physical Security:</strong> Secure facilities and restricted access to physical servers.</li>
                </ul>
                <p>While we strive to protect your data, no system is 100% secure. We cannot guarantee absolute security, but we commit to notifying you of any data breaches as required by law (e.g., within 72 hours under DPDPA or GDPR).</p>
              </div>

              <div className="pp-section" id="s6">
                <h2><span className="pp-secnum">/06</span>Your Rights and Choices</h2>
                <p>Under applicable laws (e.g., DPDPA in India or GDPR in the EU), you have the following rights regarding your Personal Data:</p>
                <ul>
                  <li><strong>Access:</strong> Request details about the data we hold about you.</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
                  <li><strong>Deletion:</strong> Request removal of your data (subject to legal obligations).</li>
                  <li><strong>Objection:</strong> Object to processing for certain purposes, such as marketing.</li>
                  <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                  <li><strong>Withdrawal of Consent:</strong> Revoke consent at any time (this won&apos;t affect prior lawful processing).</li>
                </ul>
                <p>To exercise these rights, contact us at <a href="mailto:seoshouts@gmail.com">seoshouts@gmail.com</a>. We will respond within 30 days (extendable under DPDPA or GDPR if complex). For complaints, you may approach the Data Protection Authority in your jurisdiction.</p>
              </div>

              <div className="pp-section" id="s7">
                <h2><span className="pp-secnum">/07</span>Cookies and Tracking Technologies</h2>
                <p>Our website uses cookies to enhance functionality and user experience:</p>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for basic site operation (e.g., session management).</li>
                  <li><strong>Analytics Cookies:</strong> Track usage patterns (e.g., Google Analytics) to improve our site.</li>
                  <li><strong>Marketing Cookies:</strong> Enable personalized ads (e.g., Google Ads remarketing).</li>
                </ul>
                <p>You can manage cookies via your browser settings or our cookie consent banner. Note that disabling cookies may limit site functionality. For full details, see our <Link href="/cookie-policy/">Cookie Policy</Link>.</p>
                <p>We do not track users across third-party sites without consent and respect Do Not Track (DNT) signals where applicable.</p>
              </div>

              <div className="pp-section" id="s8">
                <h2><span className="pp-secnum">/08</span>Data Retention</h2>
                <p>We retain Personal Data only as long as necessary for the purposes outlined in this policy:</p>
                <ul>
                  <li>Contact data: Up to 2 years after last interaction.</li>
                  <li>Service-related data: For the duration of our business relationship plus 7 years for legal compliance.</li>
                  <li>Analytics data: Anonymized and retained indefinitely for trend analysis.</li>
                </ul>
                <p>Data is securely deleted or anonymized when no longer needed.</p>
              </div>

              <div className="pp-section" id="s9">
                <h2><span className="pp-secnum">/09</span>Children&apos;s Privacy</h2>
                <p>Our services are not directed to children under 18. We do not knowingly collect data from minors. If we discover such data, we will delete it immediately.</p>
              </div>

              <div className="pp-section" id="s10">
                <h2><span className="pp-secnum">/10</span>Third-Party Links</h2>
                <p>Our website may contain links to third-party sites. We are not responsible for their privacy practices. We encourage reviewing their policies before providing information.</p>
              </div>

              <div className="pp-section" id="s11">
                <h2><span className="pp-secnum">/11</span>Changes to This Privacy Policy</h2>
                <p>We may update this policy to reflect changes in our practices or legal requirements. Significant changes will be notified via email or website notice, with the updated effective date. Continued use after changes constitutes acceptance.</p>
              </div>

              <div className="pp-section" id="s12">
                <h2><span className="pp-secnum">/12</span>Contact Us</h2>
                <p>For questions, rights requests, or concerns about this Privacy Policy, contact our Data Protection Officer. This Privacy Policy is governed by Indian law — disputes are subject to exclusive jurisdiction of the courts in Udaipur, Rajasthan.</p>

                <div className="pp-contact-block">
                  <h3>Get in touch</h3>
                  <div className="pp-contact-rows">
                    <a href="mailto:seoshouts@gmail.com" className="pp-cr">
                      <div className="pp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <div>
                        <div className="pp-cr-k">Email</div>
                        <div className="pp-cr-v">seoshouts@gmail.com</div>
                      </div>
                    </a>
                    <a href="tel:+918094888157" className="pp-cr">
                      <div className="pp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div>
                        <div className="pp-cr-k">Phone</div>
                        <div className="pp-cr-v">+91 8094888157</div>
                      </div>
                    </a>
                    <Link href="/contact/" className="pp-cr">
                      <div className="pp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </div>
                      <div>
                        <div className="pp-cr-k">Form</div>
                        <div className="pp-cr-v">Contact page</div>
                      </div>
                    </Link>
                    <div className="pp-cr" style={{ cursor: 'default' }}>
                      <div className="pp-cr-ico">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div>
                        <div className="pp-cr-k">Address</div>
                        <div className="pp-cr-v">Udaipur, Rajasthan, India</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick action */}
              <div className="pp-quick">
                <div className="pp-quick-inner">
                  <div>
                    <h3>Questions about your data?</h3>
                    <p>Review our cookie usage policy or reach out directly with any data rights requests.</p>
                  </div>
                  <div className="pp-qa-btns">
                    <Link href="/cookie-policy/" className="pp-qa-btn">Cookie Policy</Link>
                    <Link href="/contact/" className="pp-qa-btn primary">Contact Us</Link>
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
