import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meet Our SEO Experts - Rohit & Ajay | SEO Shouts Team',
  description: 'Meet Rohit Sharma and Ajay Porwal, the SEO experts behind SEO Shouts. Real results, honest advice, and proven digital marketing strategies for your business growth.',
  keywords: 'SEO experts, digital marketing team, Rohit Sharma SEO, Ajay Porwal, SEO consultants India, SEO agency team, local SEO experts',
  authors: [{ name: 'SEO Shouts Team' }],
  creator: 'SEO Shouts',
  publisher: 'SEO Shouts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: '/meet-the-experts/',
  },
  openGraph: {
    title: 'Meet Our SEO Experts - Rohit & Ajay | SEO Shouts Team',
    description: 'Meet Rohit Sharma and Ajay Porwal, the SEO experts behind SEO Shouts. Real results, honest advice, and proven digital marketing strategies.',
    url: '/meet-the-experts/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: '/images/team/rohit-sharma.jpg',
        width: 400,
        height: 400,
        alt: 'Rohit Sharma - SEO Expert',
      },
      {
        url: '/images/team/ajay-porwal.jpg', 
        width: 400,
        height: 400,
        alt: 'Ajay Porwal - Digital Marketing Expert',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Meet Our SEO Experts - Rohit & Ajay | SEO Shouts Team',
    description: 'Meet the SEO experts behind SEO Shouts. Real results, honest advice, and proven digital marketing strategies for business growth.',
    images: ['/images/team/rohit-sharma.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const WHY_CARDS = [
  { n: "/ 01", title: "Specialized", body: "Rohit = Organic. Ajay = Paid. No ego, no blurring, double the impact.", paths: ["M22 12h-4l-3 9L9 3l-3 9H2"] },
  { n: "/ 02", title: "Collaborative", body: "Constant communication: SEO and ads fuel each other — testing, feedback, wins.", paths: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"] },
  { n: "/ 03", title: "Transparent", body: "You always know what's working and what's not. We care about YOUR profits.", paths: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"] },
  { n: "/ 04", title: "Simple", body: "No jargon, no fluff reports. Straight facts and real strategy.", paths: ["M20 6L9 17l-5-5"] },
]

export default function MeetTheExperts() {
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
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seoshouts.com/" },
              { "@type": "ListItem", "position": 2, "name": "Meet Our Experts", "item": "https://seoshouts.com/meet-the-experts/" }
            ]
          })
        }}
      />

      {/* Breadcrumb bar */}
      <div className="mte-crumbs">
        <div className="mte-crumbs-inner">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <span className="current">Meet the Experts</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="mte-hero">
        <div className="mte-hero-grid" />
        <div className="mte-hero-inner">

          {/* Left: text */}
          <div>
            <div className="mte-hero-tag">
              <span className="dot" />
              The SEOShouts Team
            </div>
            <h1>Meet the Humans Behind Your <span className="stk">Results</span></h1>
            <p className="mte-tagline">Real Results.<span className="pipe">/</span>Real Conversation.<span className="pipe">/</span>No Agency Nonsense.</p>
            <p className="mte-lead">We&rsquo;re <strong>Rohit and Ajay</strong>. No suits. No buzzwords. Just two passionate digital marketers who deliver what matters: real growth and honest advice.</p>
            <div className="mte-hero-ctas">
              <a href="/contact/" className="mte-btn-blue">
                Let&rsquo;s Chat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a href="#team" className="mte-btn-ghost">Meet the Team</a>
            </div>
          </div>

          {/* Right: overlapping portraits + stats */}
          <div className="mte-hero-stack">
            <div className="mte-hero-badge">Hi, we&rsquo;re SEOShouts</div>
            <div className="mte-portraits">
              <div className="mte-portrait p1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/team/rohit-sharma.jpg" alt="Rohit Sharma — SEO Strategist" />
                <div className="mte-portrait-tag">ROHIT <span className="blu">/</span> SEO</div>
              </div>
              <div className="mte-portrait p2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/team/ajay-porwal.jpg" alt="Ajay Porwal — Paid Ads Specialist" />
                <div className="mte-portrait-tag">AJAY <span className="blu">/</span> ADS</div>
              </div>
            </div>
            <div className="mte-hero-stats">
              <div className="mte-hero-stat">
                <div className="num">2<span className="blue">.</span></div>
                <div className="lbl">Founders</div>
              </div>
              <div className="mte-hero-stat">
                <div className="num">10+</div>
                <div className="lbl">Years Combined</div>
              </div>
              <div className="mte-hero-stat">
                <div className="num">0<span className="blue">%</span></div>
                <div className="lbl">Agency Fluff</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TEAM CARDS ── */}
      <section className="mte-team-section" id="team">
        <div className="mte-container">
          <div className="mte-s-header">
            <div className="mte-eyebrow">The Founders</div>
            <h2 className="mte-s-title">Two people. <span className="blue">Two specialties.</span> Zero handoff loss.</h2>
            <p className="mte-s-sub">We don&rsquo;t outsource. We don&rsquo;t hand you off to a junior. You get us — talking to you, doing the work, owning the results.</p>
          </div>

          <div className="mte-team-grid">

            {/* Rohit */}
            <article className="mte-team-card">
              <div className="mte-team-photo-col">
                <div className="mte-team-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/team/rohit-sharma.jpg" alt="Rohit Sharma — SEO Strategist & Founder of SEOShouts" />
                  <div className="mte-team-photo-meta">
                    <span className="mte-pid">// FOUNDER #01</span>
                    <span className="mte-pdot" aria-hidden="true" />
                  </div>
                </div>
                <div className="mte-team-photo-detail">
                  <div className="mte-team-detail-inner">
                    <p className="mte-team-quote">SEO that outlives Google updates.</p>
                    <div className="mte-team-socials">
                      <a href="https://linkedin.com/in/seowithrohitsharma/" aria-label="Rohit on LinkedIn" target="_blank" rel="noopener noreferrer">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                      </a>
                      <a href="mailto:seowithrohitsharma@gmail.com" aria-label="Email Rohit">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mte-team-body">
                <span className="mte-role-pill"><span className="pdot" />SEO Guy Who Ranks</span>
                <h2>Rohit Sharma</h2>
                <p className="mte-team-tagline">SEO that outlives Google updates</p>
                <div className="mte-specialties">
                  <span className="mte-sp">SEO Developer</span>
                  <span className="mte-sp">Local SEO</span>
                  <span className="mte-sp">Global SEO</span>
                  <span className="mte-sp">eCommerce SEO</span>
                </div>
                <p className="mte-team-bio">Built SEOShouts out of frustration. Now, I build growth engines for businesses with practical, battle-tested SEO. No magic. Just strategies that outlive Google updates.</p>
                <div className="mte-team-feats">
                  <div className="mte-team-feat"><span className="star">★</span>Local &amp; International SEO</div>
                  <div className="mte-team-feat"><span className="star">★</span>Clear, jargon-free communication</div>
                  <div className="mte-team-feat"><span className="star">★</span>WordPress rescue specialist</div>
                </div>
                <div className="mte-team-foot">
                  <div className="mte-team-loc">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Udaipur, Rajasthan
                  </div>
                  <a href="/authors/rohit-sharma/" className="mte-team-link">
                    Know more about Rohit
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                </div>
              </div>
            </article>

            {/* Ajay */}
            <article className="mte-team-card">
              <div className="mte-team-photo-col">
                <div className="mte-team-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/team/ajay-porwal.jpg" alt="Ajay Porwal — Paid Ads & Social Media Specialist" />
                  <div className="mte-team-photo-meta">
                    <span className="mte-pid">// FOUNDER #02</span>
                    <span className="mte-pdot" aria-hidden="true" />
                  </div>
                </div>
                <div className="mte-team-photo-detail">
                  <div className="mte-team-detail-inner">
                    <p className="mte-team-quote">Ads that perform &mdash; not just &ldquo;spend.&rdquo;</p>
                    <div className="mte-team-socials">
                      <a href="https://linkedin.com/in/ajay-porwal/" aria-label="Ajay on LinkedIn" target="_blank" rel="noopener noreferrer">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                      </a>
                      <a href="mailto:seoshouts@gmail.com" aria-label="Email Ajay">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mte-team-body">
                <span className="mte-role-pill"><span className="pdot" />Ads &amp; Social Guy</span>
                <h2>Ajay Porwal</h2>
                <p className="mte-team-tagline">Ads that perform — not just &ldquo;spend&rdquo;</p>
                <div className="mte-specialties">
                  <span className="mte-sp">Facebook Ads</span>
                  <span className="mte-sp">Google Ads</span>
                </div>
                <p className="mte-team-bio">Passionate about what truly makes people click. I run ads that perform, not just &ldquo;spend,&rdquo; and turn social into a profit channel, not just a pretty page.</p>
                <div className="mte-team-feats">
                  <div className="mte-team-feat"><span className="star">★</span>Profit-focused ad campaigns</div>
                  <div className="mte-team-feat"><span className="star">★</span>Data-driven social strategy</div>
                  <div className="mte-team-feat"><span className="star">★</span>Relentless testing &amp; improvement</div>
                </div>
                <div className="mte-team-foot">
                  <div className="mte-team-loc">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Udaipur, Rajasthan
                  </div>
                  <a href="/authors/ajay-porwal/" className="mte-team-link">
                    Know more about Ajay
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ── WHY WE WORK WELL TOGETHER ── */}
      <section className="mte-why-section">
        <div className="mte-container">
          <div className="mte-s-header">
            <div className="mte-eyebrow">The Operating Principles</div>
            <h2 className="mte-s-title">Why We Actually Work <span className="blue">(Really)</span> Well Together</h2>
            <p className="mte-s-sub">Four reasons our two-person setup keeps outperforming bloated agencies on speed, clarity, and ROI.</p>
          </div>
          <div className="mte-why-grid">
            {WHY_CARDS.map((c, i) => (
              <div key={i} className="mte-why-card">
                <span className="mte-why-num">{c.n}</span>
                <div className="mte-why-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {c.paths.map((p, pi) => <path key={pi} d={p} />)}
                  </svg>
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS / TIMELINE ── */}
      <section className="mte-process-section">
        <div className="mte-process-grid-bg" />
        <div className="mte-process-inner">
          <div className="mte-s-header">
            <div className="mte-eyebrow light">The Engagement</div>
            <h2 className="mte-s-title light">What It&rsquo;s Like to <span style={{ color: 'var(--blue-light)' }}>Work With Us</span></h2>
            <p className="mte-s-sub light">A clear three-phase rhythm. No mystery. No &ldquo;we&rsquo;ll get back to you next quarter.&rdquo;</p>
          </div>
          <div className="mte-process-grid">
            {[
              { num: '01', phase: 'Phase 01', when: 'Month 1', title: 'Deep Dive', body: 'We go deep into your business, goals, and competition — no templates, no assumptions.', hasConn: true },
              { num: '02', phase: 'Phase 02', when: 'Month 2–3', title: 'Build & Action', body: 'Rohit builds SEO foundation. Ajay gets ads and social delivering results. Fast but strategic.', hasConn: true },
              { num: '03', phase: 'Phase 03', when: 'Month 4+', title: 'Optimize & Scale', body: 'Data, reporting, and constant improvement — double down where it\'s working.', hasConn: false },
            ].map((s, i) => (
              <div key={i} className="mte-process-step">
                <div className="mte-process-numblock">
                  <span className="mte-process-num">{s.num}</span>
                  <span className="mte-process-phase">{s.phase}<span className="when">{s.when}</span></span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.hasConn && (
                  <div className="mte-process-conn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <div className="mte-final-cta">
        <div className="mte-cta-card">
          <div className="mte-cta-inner">
            <h2>Ready to Work With Experts<br />Who <span style={{ color: 'var(--blue-light)' }}>Care?</span></h2>
            <p>No fluff. No upsells. Just an honest conversation about helping your business grow. Let&rsquo;s bring clarity and real results to your digital strategy.</p>
            <div className="mte-cta-row">
              <a href="/contact/" className="mte-cta-pill solid">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Book a Strategy Call
              </a>
              <a href="mailto:seoshouts@gmail.com" target="_blank" rel="noopener noreferrer" className="mte-cta-pill ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Us
              </a>
              <a href="tel:+918094888157" className="mte-cta-pill ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +91 8094888157
              </a>
            </div>
            <div className="mte-cta-foot">
              Helping businesses across <span className="blue">India and beyond</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature strip */}
      <div className="mte-sig">
        <p className="mte-sig-text">
          <span className="name">Rohit &amp; Ajay</span>
          <span style={{ color: 'var(--gray-4)' }}> – The SEOShouts Team</span>
          <span className="pipe">|</span>
          <span className="accent">Real Results</span>
          <span className="pipe">|</span>
          <span className="accent">No BS</span>
          <span className="pipe">|</span>
          <span>Actually Located in India</span>
        </p>
      </div>
    </>
  )
}
