import type { Metadata } from 'next'
import NewsletterPageForm from '../components/NewsletterPageForm'

export const metadata: Metadata = {
  title: 'SEO Newsletter - Free Weekly SEO Tips & Updates | SEO Shouts',
  description: 'Get the latest SEO news, tips, and strategies delivered to your inbox every week. Join 5,000+ digital marketers who trust SEOShouts for actionable SEO insights.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/newsletter',
  },
  openGraph: {
    title: 'SEO Newsletter - Free Weekly SEO Tips & Updates | SEO Shouts',
    description: 'Join 5,000+ digital marketers getting weekly SEO insights. Free actionable tips, case studies, and industry updates.',
    url: 'https://seoshouts.com/newsletter',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/newsletter-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEOShouts Newsletter - Weekly SEO Tips',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Newsletter - Free Weekly SEO Tips & Updates | SEO Shouts',
    description: 'Join 5,000+ digital marketers getting weekly SEO insights. Free actionable tips and case studies.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/newsletter-twitter-image.jpg'],
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

const NL_BENEFITS = [
  { n: "/ 01", title: "Weekly SEO Updates", desc: "Latest algorithm changes, ranking factors, and search engine news delivered every Tuesday.", paths: ["M22 17L13.5 8.5L8.5 13.5L2 7", "M16 17L22 17L22 11"] },
  { n: "/ 02", title: "Actionable Tips", desc: "Step-by-step SEO strategies you can implement immediately to improve your rankings.", paths: ["M9 18h6", "M10 22h4", "M12 2a7 7 0 0 0-4 12.7c.4.4.7 1 .7 1.5V18h6.6v-1.8c0-.5.3-1.1.7-1.5A7 7 0 0 0 12 2z"] },
  { n: "/ 03", title: "Case Studies", desc: "Real client results and behind-the-scenes looks at successful SEO campaigns.", paths: ["M18 20L18 10", "M12 20L12 4", "M6 20L6 14", "M3 20L21 20"] },
  { n: "/ 04", title: "Free Tools & Resources", desc: "Exclusive access to SEO templates, checklists, and tools not available anywhere else.", paths: ["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"] },
  { n: "/ 05", title: "Indian Market Focus", desc: "SEO strategies specifically tailored for Indian businesses and Hindi keyword optimization.", paths: ["M12 2m-10 10a10 10 0 1 0 20 0a10 10 0 1 0-20 0", "M12 2m-6 10a6 6 0 1 0 12 0a6 6 0 1 0-12 0", "M12 2m-2 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0"] },
  { n: "/ 06", title: "Quick Reads", desc: "Under 5 minutes to read each newsletter. No fluff, just actionable insights.", paths: ["M13 2L3 14L12 14L11 22L21 10L12 10L13 2"] },
]

export default function NewsletterPage() {
  return (
    <>
      {/* Newsletter Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "SEO Newsletter",
            "description": "Weekly SEO tips and updates for digital marketers",
            "url": "https://seoshouts.com/newsletter",
            "mainEntity": {
              "@type": "Newsletter",
              "name": "SEOShouts Weekly",
              "description": "Weekly SEO insights, tips, and industry updates",
              "publisher": { "@type": "Organization", "name": "SEO Shouts", "url": "https://seoshouts.com" }
            }
          })
        }}
      />

      {/* Breadcrumb */}
      <div className="nl-crumbs">
        <div className="nl-crumbs-inner">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <span className="current">Newsletter</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="nl-hero">
        <div className="nl-hero-grid" />
        <div className="nl-hero-inner">

          {/* Left: signup */}
          <div>
            <div className="nl-hero-tag">
              <span className="dot" />
              // SEOShouts Weekly &middot; Free
            </div>
            <h1>The SEO Newsletter That <span className="underline">Actually Helps</span>.</h1>
            <p className="nl-tagline">Every Tuesday.<span className="pipe">/</span>5-minute read.<span className="pipe">/</span>Zero fluff.</p>
            <p className="nl-lead">Join <strong>5,000+ digital marketers</strong> getting weekly SEO insights, case studies, and actionable tips delivered every Tuesday.</p>

            <div className="nl-signup-wrap">
              <NewsletterPageForm />
              <div className="nl-signup-trust">
                <span><span className="ok">&#10003;</span> Free forever</span>
                <span><span className="ok">&#10003;</span> Unsubscribe anytime</span>
                <span><span className="ok">&#10003;</span> No spam, ever</span>
              </div>
              <div className="nl-signup-stats">
                <div className="nl-signup-stat">
                  <div className="num">5,000<span className="blue">+</span></div>
                  <div className="lbl">Subscribers</div>
                </div>
                <div className="nl-signup-stat">
                  <div className="num">Tue<span className="blue">.</span></div>
                  <div className="lbl">Every Week</div>
                </div>
                <div className="nl-signup-stat">
                  <div className="num">5<span className="blue">m</span></div>
                  <div className="lbl">Read Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: inbox mockup */}
          <div className="nl-inbox">
            <div className="nl-inbox-tag tl">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              New Issue
            </div>
            <div className="nl-inbox-tag br">
              <span className="blue-dot" />
              Tuesday &middot; 5min
            </div>
            <div className="nl-inbox-window">
              <div className="nl-inbox-chrome">
                <div className="dots"><span /><span /><span /></div>
                <div className="url">
                  <svg className="lock" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  mail &middot; seoshouts weekly
                </div>
              </div>
              <div className="nl-inbox-head">
                <div className="nl-from-avatar">SS</div>
                <div className="nl-from-meta">
                  <div className="nl-from-name">SEOShouts Weekly <span className="nl-verified">&#10003;</span></div>
                  <div className="nl-from-email">rohit@seoshouts.com &rarr; you</div>
                </div>
                <div className="nl-inbox-when">Tue &middot; 7:00am</div>
              </div>
              <div className="nl-inbox-subject">
                <div className="label">SUBJECT</div>
                <div className="subject">&#128269; This Week in <span className="blue">SEO</span></div>
              </div>
              <div className="nl-inbox-body">
                <h4><span className="pip">&rarr;</span>&#128200; Algorithm Update Alert</h4>
                <p>Google rolled out a minor core update affecting local search results. Here&rsquo;s what changed and how to adapt&hellip;</p>
                <div className="divline" />
                <h4><span className="pip">&rarr;</span>&#128161; Quick Win Tip</h4>
                <p>Add FAQ schema to your product pages. Takes 10 minutes, can boost rankings by 15&ndash;20%&hellip;</p>
                <div className="divline" />
                <h4><span className="pip">&rarr;</span>&#128202; Case Study</h4>
                <p>How we increased a Mumbai restaurant&rsquo;s local search traffic by 300% in 60 days&hellip;</p>
                <a className="preview-link" href="#subscribe">
                  Continue reading
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              </div>
              <div className="nl-inbox-foot">
                <span className="read-time">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Under 5 min read
                </span>
                <span>Every Tuesday</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="nl-benefits-section">
        <div className="nl-container">
          <div className="nl-s-header">
            <div className="nl-eyebrow">// What you&apos;ll get every week</div>
            <h2 className="nl-s-title">What You&apos;ll Get <span className="blue">Every Week</span></h2>
            <p className="nl-s-sub">No fluff. No outdated advice. Just practical SEO insights you can use immediately.</p>
          </div>
          <div className="nl-benefits-grid">
            {NL_BENEFITS.map((b, i) => (
              <div key={i} className="nl-benefit">
                <span className="num">{b.n}</span>
                <div className="nl-benefit-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {b.paths.map((p, pi) => <path key={pi} d={p} />)}
                  </svg>
                </div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE NEWSLETTER ── */}
      <section className="nl-sample-section">
        <div className="nl-sample-grid-bg" />
        <div className="nl-sample-inner">
          <div className="nl-s-header center">
            <div className="nl-eyebrow light">// Sample issue</div>
            <h2 className="nl-s-title light">Sample Newsletter <span style={{ color: "var(--blue-light)" }}>Content</span></h2>
            <p className="nl-s-sub light">Here&rsquo;s what a typical SEOShouts Weekly looks like in your inbox.</p>
          </div>
          <div className="nl-sample-card">
            <div className="nl-sample-head">
              <div className="left">
                <div className="nl-sample-logo">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 14L6 6L10 10L13 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="13" cy="3" r="1.5" fill="white"/></svg>
                </div>
                <div>
                  <div className="ti">SEOShouts Weekly</div>
                  <div className="meta">Tuesday &middot; 5-min read</div>
                </div>
              </div>
              <div className="issue-num">// SAMPLE</div>
            </div>
            <div className="nl-sample-body">
              <div className="nl-sample-subject">&#128269; This Week in <span className="blue">SEO</span> (Sample)</div>
              <div className="nl-sample-from">FROM <span className="blue">SEOShouts Weekly</span> &middot; TO <span className="blue">&#123;your_inbox&#125;</span> &middot; EVERY TUESDAY</div>
              {[
                { icon: "M22 17L13.5 8.5L8.5 13.5L2 7 M16 17L22 17L22 11", label: "&#128200; Algorithm Update Alert", body: "Google rolled out a minor core update affecting local search results. Here's what changed and how to adapt…" },
                { icon: "M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7c.4.4.7 1 .7 1.5V18h6.6v-1.8c0-.5.3-1.1.7-1.5A7 7 0 0 0 12 2z", label: "&#128161; Quick Win Tip", body: "Add FAQ schema to your product pages. Takes 10 minutes, can boost rankings by 15–20% (with step-by-step guide)." },
                { icon: "M18 20L18 10 M12 20L12 4 M6 20L6 14 M3 20L21 20", label: "&#128202; Case Study", body: "How we increased a Mumbai restaurant's local search traffic by 300% in 60 days using these 3 tactics…" },
                { icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10L12 15L17 10 M12 15L12 3", label: "&#128295; Free Resource", body: "Download: Technical SEO Checklist for Indian Websites (exclusive for subscribers)." },
              ].map((row, ri) => (
                <div key={ri} className="nl-sample-block">
                  <div className="nl-sample-tag">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {row.icon.split(" M").map((d, di) => <path key={di} d={di === 0 ? d : "M" + d} />)}
                    </svg>
                  </div>
                  <div>
                    <h4 dangerouslySetInnerHTML={{ __html: row.label }} />
                    <p>{row.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="nl-sample-cta-row">
              <div className="left-txt">Like what you see? <span>Get content like this every Tuesday.</span></div>
              <a href="#subscribe" className="nl-sample-cta-btn">
                Subscribe Now &mdash; Free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
            <div className="nl-sample-foot">
              <span>SEOShouts Weekly</span>
              <span><a href="/newsletter/">Unsubscribe</a> &middot; <a href="/newsletter/">View in browser</a></span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq-section">
        <div className="section-container" style={{ maxWidth: 880 }}>
          <div className="s-header">
            <div className="eyebrow">Newsletter FAQ</div>
            <h2 className="s-title">Newsletter <span className="blue">FAQ</span></h2>
            <p className="s-sub">Four quick answers before you subscribe.</p>
          </div>
          <div className="faq-list">
            {[
              { q: "How often do you send emails?", a: "Once a week, every Tuesday morning. No daily spam, no random promotional emails." },
              { q: "Can I unsubscribe anytime?", a: "Absolutely! One-click unsubscribe link in every email. No questions asked, no guilt trips." },
              { q: "Do you share my email address?", a: "Never. We hate spam as much as you do. Your email stays private and secure with us." },
              { q: "Is the content India-specific?", a: "We cover global SEO trends but always include insights specific to Indian markets and Hindi SEO." },
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
