import type { Metadata } from 'next'
import ContactForm from '../components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us - Get Your Free SEO Analysis | SEO Shouts',
  description: 'Ready to boost your search rankings? Contact SEO Shouts for a free SEO analysis. Call +91-809-488-8157 or email seoshouts@gmail.com. Based in Rajasthan, serving globally.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/contact/',
  },
  openGraph: {
    title: 'Contact Us - Get Your Free SEO Analysis | SEO Shouts',
    description: 'Ready to boost your search rankings? Contact SEO Shouts for expert SEO services.',
    url: 'https://seoshouts.com/contact/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/contact-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact SEO Shouts - Professional SEO Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get Your Free SEO Analysis | SEO Shouts',
    description: 'Ready to boost your search rankings? Contact SEO Shouts for expert SEO services.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/contact-twitter-image.jpg'],
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

export default function ContactPage() {
  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How fast will you reply?", "acceptedAnswer": { "@type": "Answer", "text": "Within 24 hours, Mon-Sat. If you reach out on a Sunday, expect a reply the next working day." } },
              { "@type": "Question", "name": "Is the SEO analysis really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free, no obligation. We do a short audit, flag the biggest opportunities and leaks, and send it over." } },
              { "@type": "Question", "name": "Do you work with clients outside India?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We are based in Udaipur, Rajasthan but serve clients globally across the US, UK, Middle East, and APAC." } },
              { "@type": "Question", "name": "What if I am not sure which service I need?", "acceptedAnswer": { "@type": "Answer", "text": "That is fine. Select Not sure yet in the form and describe your situation. We will suggest what makes sense." } },
              { "@type": "Question", "name": "Will my information stay private?", "acceptedAnswer": { "@type": "Answer", "text": "Always. We never share, sell, or rent your details." } }
            ]
          })
        }}
      />

      {/* Breadcrumb */}
      <div className="ct-crumbs">
        <div className="ct-crumbs-inner">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <span className="current">Contact</span>
        </div>
      </div>

      {/* Hero */}
      <section className="ct-hero">
        <div className="ct-hero-grid" />
        <div className="ct-hero-inner">
          <div className="ct-hero-tag">
            <span className="dot" />
            // Free SEO Analysis &nbsp;&middot;&nbsp; No Strings
          </div>
          <h1>Ready to boost your <span className="underline">search rankings?</span></h1>
          <p className="ct-lead">Tell us about your business and we&rsquo;ll get back with a <strong>free SEO analysis</strong> and an honest, no-fluff plan. Based in Rajasthan, serving clients globally.</p>
          <div className="ct-hero-quick">
            <a href="#form" className="ct-qc-pill solid">
              <div className="ct-qc-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <div><span className="ct-qc-meta">FILL THE FORM</span><span>Get a Free Analysis</span></div>
            </a>
            <a href="tel:+918094888157" className="ct-qc-pill">
              <div className="ct-qc-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
              <div><span className="ct-qc-meta">CALL DIRECT</span><span>+91 8094888157</span></div>
            </a>
            <a href="mailto:seoshouts@gmail.com" className="ct-qc-pill">
              <div className="ct-qc-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <div><span className="ct-qc-meta">EMAIL US</span><span>seoshouts@gmail.com</span></div>
            </a>
          </div>
          <div className="ct-hero-status">
            <span className="pdot" />
            <span className="accent">Replying within 24 hours</span>
            <span className="pipe">&middot;</span>
            <span>Mon &mdash; Sat &nbsp;&middot;&nbsp; 10:00 &mdash; 19:00 IST</span>
          </div>
        </div>
      </section>

      {/* Form + Rail */}
      <section className="ct-contact-section" id="form">
        <div className="ct-contact-grid">

          {/* Form card */}
          <div className="ct-form-card">
            <div className="ct-form-corner">FREE</div>
            <div className="ct-form-head">
              <div className="eyebrow">// Project enquiry</div>
              <h2>Tell us about <span className="blue">your project</span></h2>
              <p>The more context you give us, the sharper the free analysis we send back.</p>
            </div>
            <ContactForm />
          </div>

          {/* Info rail */}
          <div className="ct-rail">

            {/* Direct contact */}
            <div className="ct-rail-card dark">
              <div className="ct-rail-inner">
                <div className="ct-rail-head">
                  <h3>Talk to us directly</h3>
                  <span className="tag">// DIRECT</span>
                </div>
                {[
                  { href: "tel:+918094888157", label: "Call", value: "+91 8094888157", icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" },
                  { href: "mailto:seoshouts@gmail.com", label: "Email", value: "seoshouts@gmail.com", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" },
                  { href: "https://wa.me/918094888157", label: "WhatsApp", value: "Message us instantly", icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" },
                ].map((row, i) => (
                  <a key={i} href={row.href} className="ct-direct-row" target={row.href.startsWith("http") ? "_blank" : undefined} rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                    <div className="ct-dico">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {row.icon.split(" M").map((d, di) => <path key={di} d={di === 0 ? d : "M" + d} />)}
                      </svg>
                    </div>
                    <div className="ct-dmeta">
                      <div className="ct-dk">{row.label}</div>
                      <div className="ct-dv">{row.value}</div>
                    </div>
                    <svg className="ct-darrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="ct-rail-card">
              <div className="ct-rail-inner">
                <div className="ct-rail-head">
                  <h3>Where we are</h3>
                  <span className="tag">// HQ</span>
                </div>
                <div className="ct-loc-row">
                  <div className="ct-loc-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div className="ct-loc-txt">Udaipur, Rajasthan</div>
                    <div className="ct-loc-sub">Based in India &middot; Serving clients globally across Local, eCommerce &amp; B2B.</div>
                    <div className="ct-loc-pills">
                      <span>India</span>
                      <span>Remote</span>
                      <span>IST (UTC+5:30)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="ct-rail-card">
              <div className="ct-rail-inner">
                <div className="ct-rail-head">
                  <h3>Find us elsewhere</h3>
                  <span className="tag">// SOCIAL</span>
                </div>
                <div className="ct-socials-grid">
                  {[
                    { href: "https://www.linkedin.com/company/seoshouts/", label: "LinkedIn", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg> },
                    { href: "https://x.com/seo_shouts", label: "X (Twitter)", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                    { href: "https://www.facebook.com/seoshouts/", label: "Facebook", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99h-2.54V12h2.54V9.8c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg> },
                    { href: "https://www.reddit.com/r/seoshouts/", label: "Reddit", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.7 11.2c0 3-3.4 5.4-7.7 5.4s-7.7-2.4-7.7-5.4a3 3 0 0 1 .7-1.9 1.5 1.5 0 1 1 2 2.2 1.5 1.5 0 0 0-.2.8c0 1.9 2.4 3.4 5.2 3.4s5.2-1.5 5.2-3.4a1.5 1.5 0 0 0-.2-.8 1.5 1.5 0 1 1 2-2.2 3 3 0 0 1 .7 1.9zm-9-2.2a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm5.8 4.2a4.4 4.4 0 0 1-2.5.8 4.4 4.4 0 0 1-2.5-.8.4.4 0 0 1 .5-.6 3.7 3.7 0 0 0 2 .6 3.7 3.7 0 0 0 2-.6.4.4 0 0 1 .5.6zm-.8-2.2a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"/></svg> },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="ct-social-cell">
                      <div className="ct-social-ico">{s.icon}</div>
                      <span className="ct-social-txt">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="ct-process-section">
        <div className="ct-process-inner">
          <div className="s-header">
            <div className="eyebrow">// After you hit send</div>
            <h2 className="s-title">What happens <span className="blue">next.</span></h2>
            <p className="s-sub">A simple three-step path from enquiry to action &mdash; no agency runaround, no slow loops.</p>
          </div>
          <div className="ct-steps">
            {[
              { n: "01", when: "Step 01", accent: "Within 24 hours", title: "We reply with questions", body: "A real human (Rohit or Ajay) reads your message and replies with clarifying questions to scope the work properly.", conn: true },
              { n: "02", when: "Step 02", accent: "2 — 3 days", title: "Free SEO analysis", body: "We run a free audit of your site — opportunities, leaks, and a short list of priorities, no obligation.", conn: true },
              { n: "03", when: "Step 03", accent: "When you're ready", title: "Strategy call", body: "If it is a fit, we hop on a call to walk through the findings and outline a tailored plan — pricing included.", conn: false },
            ].map((s, i) => (
              <div key={i} className="ct-step">
                <div className="ct-step-block">
                  <span className="ct-step-num">{s.n}</span>
                  <span className="ct-step-when">{s.when}<span className="accent">{s.accent}</span></span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.conn && (
                  <div className="ct-step-conn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who you will talk to */}
      <section className="ct-team-strip">
        <div className="ct-team-inner">
          <div className="s-header">
            <div className="eyebrow">// Who you will actually talk to</div>
            <h2 className="s-title">No sales reps. <span className="blue">Just us.</span></h2>
            <p className="s-sub">Your enquiry lands with one of the founders &mdash; not a junior, not an SDR. Same person doing the work.</p>
          </div>
          <div className="ct-team-cards">
            {[
              { href: "/authors/rohit-sharma/", img: "/images/team/rohit-sharma.jpg", alt: "Rohit Sharma", name: "Rohit Sharma", role: "SEO & Founder", desc: "Organic, local, eCommerce & AI search. 10+ years." },
              { href: "/authors/ajay-porwal/", img: "/images/team/ajay-porwal.jpg", alt: "Ajay Porwal", name: "Ajay Porwal", role: "Ads & Social Founder", desc: "Paid ads & social that perform, not just spend." },
            ].map((m, i) => (
              <a key={i} href={m.href} className="ct-team-mini">
                <div className="ct-team-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.alt} />
                </div>
                <div className="ct-team-body">
                  <h3>{m.name}</h3>
                  <div className="ct-team-role">{m.role}</div>
                  <p>{m.desc}</p>
                  <span className="ct-team-arrow">
                    View profile
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="section-container" style={{ maxWidth: 880 }}>
          <div className="s-header">
            <div className="eyebrow">// Quick answers</div>
            <h2 className="s-title">Before you <span className="blue">reach out.</span></h2>
            <p className="s-sub">Five short answers to the questions we hear most.</p>
          </div>
          <div className="faq-list">
            {[
              { q: "How fast will you reply?", a: "Within 24 hours, Mon — Sat. If you reach out on a Sunday or holiday, expect a reply the next working day." },
              { q: "Is the SEO analysis really free?", a: "Yes, completely free, no obligation. We do a short audit, flag the biggest opportunities and leaks, and send it over. If you want to engage further, great. If not, no pressure." },
              { q: "Do you work with clients outside India?", a: "Yes. We are based in Udaipur, Rajasthan but serve clients globally across the US, UK, Middle East, and APAC. All work is delivered remotely." },
              { q: "What if I am not sure which service I need?", a: "That is fine. Pick Not sure yet in the form and describe your situation. We will suggest what makes sense, or whether you even need our help at all." },
              { q: "Will my information stay private?", a: "Always. We never share, sell, or rent your details." },
            ].map((faq, i) => (
              <details key={i} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
