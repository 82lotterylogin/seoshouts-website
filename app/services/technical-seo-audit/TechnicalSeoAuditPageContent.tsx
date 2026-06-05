'use client'

import { useState, useEffect, useRef } from 'react'
import ShapeGrid from '../../components/ShapeGrid'
import HeroQuoteForm from '../../components/HeroQuoteForm'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight + 80 && r.bottom > 0) { setVis(true); return }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold: 0, rootMargin: '80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, vis }
}

function Arrow() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  )
}

// ─── SVG icon set ─────────────────────────────────────────────────────────────

const SvcIcon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'search') return <svg {...p}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
  if (name === 'zap') return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  if (name === 'smartphone') return <svg {...p}><rect x="5" y="2" width="14" height="20" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
  if (name === 'code') return <svg {...p}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  if (name === 'tag') return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  if (name === 'shield') return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  if (name === 'clipboard') return <svg {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" /></svg>
  if (name === 'bar-chart') return <svg {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  if (name === 'calendar') return <svg {...p}><rect x="3" y="4" width="18" height="18" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  if (name === 'tool') return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
  if (name === 'layers') return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  if (name === 'cpu') return <svg {...p}><rect x="4" y="4" width="16" height="16" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
  if (name === 'award') return <svg {...p}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
  if (name === 'pin') return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
  if (name === 'file') return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
  if (name === 'users') return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  return null
}

// ─── Hero card data ────────────────────────────────────────────────────────────


// ─── Section data ─────────────────────────────────────────────────────────────

const PROBLEMS = [
  { icon: 'zap',    title: '8+ second mobile load time',   desc: 'Your pages are taking 8+ seconds to load on mobile (the average Indian user gives up after 3)' },
  { icon: 'layers', title: 'Duplicate content confusion',  desc: "Google's bots are getting confused by duplicate content issues you don't even know exist" },
  { icon: 'search', title: 'Crawl budget waste',           desc: 'Your internal links are creating dead ends that waste crawl budget on unimportant pages' },
  { icon: 'cpu',    title: 'Oversized image files',        desc: "Image files are so massive they're choking your server and destroying Core Web Vitals scores" },
  { icon: 'code',   title: 'Broken schema markup',         desc: 'Broken schema markup is making you invisible in rich results and Google Knowledge Panel' },
]

const SERVICES = [
  {
    icon: 'search', num: '01',
    title: 'Crawlability & Indexation Issues',
    intro: 'We hunt down every crawlability issue on your site:',
    items: [
      "robots.txt accidentally blocking important pages (happens more than you'd think)",
      'Broken internal links creating dead ends for both users and search bots',
      'XML sitemap errors confusing Google about your site structure',
      'Crawl budget waste — especially critical for large sites with 1,000+ pages',
      "Orphaned pages sitting in no-man's land with no internal links pointing to them",
    ],
    out: "Google will efficiently discover and index all your valuable content, instead of wasting crawl budget on pages that don't matter.",
  },
  {
    icon: 'zap', num: '02',
    title: 'Site Speed & Core Web Vitals',
    intro: 'We fix your site speed issues — the #1 ranking killer:',
    items: [
      "Page speed across different devices and connection speeds (crucial for India's varied internet infrastructure)",
      'Core Web Vitals performance — LCP, FID, and CLS — Google\'s newest ranking factors',
      'Image optimization opportunities (we often find 70%+ file size reductions)',
      'JavaScript and CSS bloat that\'s slowing everything down',
      'Server response times and hosting performance issues',
    ],
    out: 'Your visitors get lightning-fast experiences, and Google rewards you with the higher rankings your content deserves.',
  },
  {
    icon: 'smartphone', num: '03',
    title: 'Mobile Optimization Audit',
    intro: 'We make your site actually work on mobile:',
    items: [
      'Real-world usability testing on actual devices (not just desktop simulators)',
      'Touch element spacing and navigation flow for real mobile users',
      'Mobile page speed optimization for slower networks across India',
      'Responsive design issues that break on different screen sizes',
      "Mobile-first indexing compliance — Google's primary ranking system",
    ],
    out: 'Your website delivers exceptional experiences on the devices where 80% of your Indian traffic actually comes from.',
  },
  {
    icon: 'code', num: '04',
    title: 'On-Page Technical Elements',
    intro: 'We perfect every technical element on your pages:',
    items: [
      'Title tags and meta descriptions that are actually compelling (not keyword-stuffed)',
      'Header tag hierarchy that makes sense to both users and bots',
      "URL structure optimization (we've seen some real nightmares)",
      'Image alt text that helps with both accessibility and rankings',
      'Internal linking strategy that flows page authority where it needs to go',
      'Duplicate content issues that are confusing search engines',
    ],
    out: 'Every page sends crystal-clear signals to Google about what it should rank for and who it should rank for.',
  },
  {
    icon: 'tag', num: '05',
    title: 'Schema Markup Implementation',
    intro: 'We implement schema markup that actually works:',
    items: [
      'Current markup validation and error fixing on all pages',
      "Strategic schema opportunities you're missing in your industry",
      'Rich snippet optimization for better click-through rates',
      'FAQ, Product, and Local Business schema setup',
      'Testing and validation to ensure everything works correctly',
    ],
    out: 'Your pages stand out in search results with rich snippets and enhanced visibility that drives more clicks.',
  },
  {
    icon: 'shield', num: '06',
    title: 'Security & Trust Signals',
    intro: 'We secure your site and fix trust issues:',
    items: [
      'SSL certificate setup and configuration verification',
      'Mixed content issues that break HTTPS protection',
      'Security headers analysis and implementation',
      'Malware and vulnerability scanning',
      'Google Safe Browsing status check and remediation',
    ],
    out: "Your visitors trust your site, and Google doesn't penalize you for security issues that kill rankings overnight.",
  },
]

const PROCESS_PHASES = [
  {
    num: '01', week: 'Week 1', timing: 'Days 1-7',
    title: 'Deep Dive Investigation',
    sections: [
      {
        heading: 'Initial Analysis',
        items: [
          'Complete site crawl using professional tools (Screaming Frog, SEMrush, Ahrefs)',
          'Google Search Console deep dive and historical analysis',
          "Competitor technical analysis to see where you're falling behind",
          'Manual testing on actual devices and connection speeds',
        ],
      },
      {
        heading: 'Discovery Focus',
        items: [
          'Site architecture review and information hierarchy mapping',
          'Indexation status check and crawl error identification',
          'Performance baseline measurement across key pages',
          'Critical blocker identification for immediate action',
        ],
      },
    ],
  },
  {
    num: '02', week: 'Week 2', timing: 'Days 8-14',
    title: 'The Real Technical Analysis',
    sections: [
      {
        heading: 'Core Analysis',
        items: [
          'Page speed testing across multiple scenarios and devices',
          'Mobile usability testing on real devices',
          'Security vulnerability assessment',
          'Schema markup validation and opportunity analysis',
        ],
      },
      {
        heading: 'Deep Testing',
        items: [
          'Core Web Vitals measurement with field and lab data',
          'Structured data testing and SERP preview analysis',
          'Internal link architecture mapping and authority flow',
          'Content duplication and canonicalization review',
        ],
      },
    ],
  },
  {
    num: '03', week: 'Week 3', timing: 'Days 15-21',
    title: 'Building Your Custom Action Plan',
    sections: [
      {
        heading: 'Report Creation',
        items: [
          'Issues categorized by impact and difficulty (quick wins vs. long-term)',
          'Step-by-step fix instructions your developer can follow',
          'Before/after impact projections for each fix',
          'Timeline and resource requirements for implementation',
        ],
      },
      {
        heading: 'Prioritization',
        items: [
          'High-impact quick wins for immediate improvement',
          'Medium-priority optimizations for 60-day window',
          'Long-term strategic enhancements for 90+ days',
          'Success metrics and tracking framework setup',
        ],
      },
    ],
  },
  {
    num: '04', week: 'Week 4', timing: 'Days 22-28',
    title: 'Strategy Session & Implementation Support',
    sections: [
      {
        heading: 'Delivery & Walkthrough',
        items: [
          'Detailed report walkthrough with our technical team',
          'Priority implementation roadmap creation together',
          'Technical implementation guidance for complex issues',
          'Follow-up support options and ongoing monitoring setup',
        ],
      },
      {
        heading: 'What You Receive',
        items: [
          'Complete technical analysis (40-80 pages of detailed findings)',
          '1-hour strategy session to review everything in detail',
          '30 days of implementation support via email',
          'Optional follow-up audit after 60 days to verify fixes',
        ],
      },
    ],
  },
]

const REPORT_CARDS = [
  {
    icon: 'clipboard',
    title: 'The Executive Summary (For Decision Makers)',
    intro: 'Cut through the technical jargon and get straight to what matters:',
    items: [
      'Critical issues that need immediate attention',
      'Traffic and ranking improvement opportunities',
      'Implementation priorities based on your goals and resources',
    ],
  },
  {
    icon: 'tool',
    title: 'The Technical Deep Dive (For Your Development Team)',
    intro: 'Every issue explained in detail with:',
    items: [
      'Screenshot evidence and clear explanations',
      'Step-by-step fix instructions',
      'Code examples where applicable',
      'Tool recommendations for ongoing monitoring',
    ],
  },
  {
    icon: 'bar-chart',
    title: 'Performance Benchmarks (So You Know Where You Stand)',
    intro: 'We compare your site against:',
    items: [
      'Direct competitors in your industry',
      'Industry standards for your sector',
      'Our database of high-performing sites',
    ],
  },
  {
    icon: 'calendar',
    title: 'Your 90-Day Action Plan (What to Do First)',
    intro: 'A prioritized roadmap that includes:',
    items: [
      '30-day quick wins for immediate improvements',
      '60-day medium-priority optimizations',
      '90-day long-term technical enhancements',
      'Success metrics to track your progress',
    ],
  },
]

const WHY_CARDS = [
  { icon: 'award',  title: "We've Been in the Trenches for 13+ Years",      body: "We've audited everything from small WordPress sites to massive eCommerce stores with 50,000+ pages. There's no technical problem we haven't seen (and solved)." },
  { icon: 'pin',    title: 'We Actually Understand Indian Websites',         body: 'Shared hosting providers that oversell resources. WordPress sites running 47 plugins. Mobile optimization challenges on slower networks. We get it because we work with it every day.' },
  { icon: 'file',   title: 'Our Reports Are Developer-Friendly',             body: 'No confusing jargon or vague recommendations. Your development team will get clear, actionable instructions they can implement immediately.' },
  { icon: 'tool',   title: 'We Use Professional-Grade Tools',               body: 'Not free online checkers. We use the same tools enterprise SEO agencies use — Screaming Frog, SEMrush Site Audit, Ahrefs, and custom scripts we\'ve developed.' },
  { icon: 'layers', title: "We're Platform Agnostic",                        body: "WordPress, Shopify, Magento, custom PHP builds — we've optimized them all. Our recommendations work regardless of your platform." },
  { icon: 'users',  title: "Support Doesn't End with the Report",            body: "Stuck during implementation? Got questions? We're here to help, not just deliver a report and disappear. 30 days of email support included in every audit." },
]

const FAQS = [
  { q: 'How long does this actually take?',                                a: 'Most comprehensive audits are completed within 3-4 weeks. Rush jobs are available for an additional fee, but honestly, a thorough audit takes time to do right.' },
  { q: 'What if my site is huge (10,000+ pages)?',                        a: "We love big sites! Our process scales based on size and complexity. Large sites often have more opportunities for dramatic improvements." },
  { q: 'Can you actually implement the fixes, or just identify them?',    a: "We can do both. While our audit gives you everything needed for implementation, we also offer hands-on technical services if your team needs help." },
  { q: 'Will this help my Core Web Vitals scores?',                       a: 'Absolutely. Core Web Vitals optimization is a major focus of every audit. We often help sites improve their scores dramatically.' },
  { q: 'What about international sites with multiple languages?',         a: "We have extensive experience with complex international sites. Hreflang implementation, regional targeting, multi-language technical challenges — we handle it all." },
  { q: 'How often should I get audited?',                                 a: 'For most sites, annually is sufficient. Larger sites or those undergoing frequent changes might benefit from quarterly mini-audits.' },
  { q: 'Do you work with WordPress specifically?',                        a: 'WordPress is our bread and butter. We know the platform inside and out, including common plugin conflicts and theme-specific issues.' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProblemCard({ p, i }: { p: typeof PROBLEMS[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`feature-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="feature-icon"><SvcIcon name={p.icon} /></div>
      <strong>{p.title}</strong>
      <p>{p.desc}</p>
    </div>
  )
}

function ReportCard({ c, i }: { c: typeof REPORT_CARDS[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`choose-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="choose-icon"><SvcIcon name={c.icon} size={22} /></div>
      <h3>{c.title}</h3>
      <p>{c.intro}</p>
      <ul className="choose-list" style={{ listStyle: 'none', margin: '0.5rem 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {c.items.map(item => (
          <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--ink-2)' }}>
            <span style={{ color: 'var(--blue)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function WhyCard({ c, i }: { c: typeof WHY_CARDS[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`choose-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="choose-icon"><SvcIcon name={c.icon} size={22} /></div>
      <h3>{c.title}</h3>
      <p>{c.body}</p>
    </div>
  )
}

// ─── Sections ──────────────────────────────────────────────────────────────────

function Crumbs() {
  return (
    <div className="crumbs">
      <div className="crumbs-inner">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/services/">Services</a>
        <span className="sep">/</span>
        <span className="current">Technical SEO Audit</span>
      </div>
    </div>
  )
}

function PageHero() {
  return (
    <section className="phero">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
        <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 40%, transparent 20%, rgba(8,9,10,0.85) 100%)', pointerEvents: 'none' }} />
      <div className="phero-inner">
        <div>
          <div className="phero-tag">
            <span className="dot" />
            🔍 Technical SEO Specialists
          </div>
          <h1>
            Technical SEO Audit Services
            <br />
            <span className="blue">Uncover Hidden Issues Killing Your Rankings</span>
          </h1>
          <p className="wd-hero-body">Three weeks ago, a furniture retailer from Mumbai called us in a panic. Their organic traffic had dropped 60% overnight. Within 2 hours of our audit, we found the culprit: a botched update had created <strong>1,200+ crawl errors</strong> blocking Google from seeing most of their product pages.</p>
          <p className="wd-hero-body"><strong>Sound familiar? You&apos;re not alone.</strong> Your website might look perfect on the surface, but dozens of invisible technical problems could be silently killing your rankings right now.</p>
          <p className="wd-hero-body">SEOShouts&apos; <strong>comprehensive Technical SEO Audit</strong> finds every hidden issue — from crawlability gaps to Core Web Vitals failures — and gives you a clear, prioritised fix plan.</p>
          <p className="wd-hero-body">Built on <strong>13+ years of hands-on SEO experience</strong>, our audit process is thorough enough to surface issues most tools and agencies simply miss.</p>
          <div className="phero-ctas">
            <a href="/contact/" aria-label="Get free Technical SEO audit" className="btn-primary">
              🚀 Get Your FREE Technical SEO Audit <Arrow />
            </a>
            <a href="tel:+918094888157" aria-label="Call SEOShouts for Technical SEO consultation" className="btn-outline">
              📞 Call +91 8094888157
            </a>
          </div>
          <div className="wd-hero-trust">
            <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Full audit report delivered within 5 business days — actionable, not just a spreadsheet
          </div>
        </div>

        <HeroQuoteForm />
      </div>
    </section>
  )
}

function ProblemsSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section features-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">The Problem</div>
          <h2 className="s-title">The Hidden Problems That Are Costing You Traffic (And Money)</h2>
        </div>
        <p className="why-lede">
          Look, after 13+ years in the SEO trenches, we&apos;ve seen it all. Beautiful websites that load slower than dial-up internet. &ldquo;SEO-optimized&rdquo; sites with 847 crawl errors. Mobile-friendly designs that break on actual Indian mobile networks.
        </p>
        <div className="why-substat-label">Here&apos;s what&apos;s probably happening to your site right now:</div>
        <div className="features-grid">
          {PROBLEMS.map((p, i) => <ProblemCard key={p.title} p={p} i={i} />)}
        </div>
        <div style={{ marginTop: '2.5rem', borderLeft: '3px solid var(--blue)', paddingLeft: '1.75rem', position: 'relative' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '0.75rem' }}>The Bottom Line</span>
          <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.7 }}>
            Even if you&apos;re doing everything else right with content and backlinks, these technical issues are like having a Ferrari with flat tires.{' '}
            <strong>You&apos;re not going anywhere fast.</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const { ref, vis } = useReveal()
  const [active, setActive] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  function select(i: number) {
    if (i === active) return
    setActive(i)
    setPanelKey(k => k + 1)
  }

  const svc = SERVICES[active]

  return (
    <section className="section svc-section">
      <style>{`
        @keyframes taSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ta-explorer {
          display: flex; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09); min-height: 480px;
        }
        .ta-tabs {
          width: 300px; flex-shrink: 0;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.09);
          display: flex; flex-direction: column;
        }
        .ta-tab {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 15px 18px; cursor: pointer; border: none;
          background: transparent; text-align: left;
          color: rgba(255,255,255,0.5);
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          border-left: 3px solid transparent;
        }
        .ta-tab:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.82); }
        .ta-tab.ta-active {
          background: rgba(37,99,235,0.14); color: #fff;
          border-left-color: var(--blue);
        }
        .ta-tab-icon {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07); flex-shrink: 0; margin-top: 1px;
          transition: background 0.18s, color 0.18s;
        }
        .ta-tab.ta-active .ta-tab-icon { background: rgba(37,99,235,0.28); color: var(--blue); }
        .ta-tab-body { flex: 1; min-width: 0; }
        .ta-tab-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); opacity: 0.85; margin-bottom: 3px; }
        .ta-tab.ta-active .ta-tab-num { opacity: 1; }
        .ta-tab-label { font-size: 0.9rem; font-weight: 600; line-height: 1.35; }
        .ta-tab-arr { flex-shrink: 0; align-self: center; opacity: 0; transition: opacity 0.18s; color: var(--blue); }
        .ta-tab.ta-active .ta-tab-arr { opacity: 1; }
        .ta-panel { flex: 1; padding: 34px 38px; overflow-y: auto; }
        .ta-panel-anim { animation: taSlideIn 0.3s cubic-bezier(0.2,0.6,0.4,1) both; }
        .ta-panel-head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .ta-panel-bigicon {
          width: 50px; height: 50px;
          background: rgba(37,99,235,0.18); border: 1px solid rgba(37,99,235,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--blue); flex-shrink: 0;
        }
        .ta-panel-meta { flex: 1; }
        .ta-panel-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); margin-bottom: 4px; }
        .ta-panel-h3 { font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.3; margin: 0; }
        .ta-panel-intro { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 20px; line-height: 1.65; }
        .ta-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
        .ta-panel-list li {
          font-size: 0.875rem; color: rgba(255,255,255,0.68);
          line-height: 1.45; display: flex; align-items: flex-start; gap: 8px;
        }
        .ta-panel-list li::before {
          content: ''; width: 4px; height: 4px; min-width: 4px;
          background: var(--blue); margin-top: 7px;
        }
        .ta-panel-outcome {
          margin-top: 20px; background: rgba(37,99,235,0.1);
          border-left: 3px solid var(--blue); padding: 11px 16px;
        }
        .ta-panel-outcome p { font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.78); margin: 0; font-style: italic; }
        @media (max-width: 900px) {
          .ta-explorer { flex-direction: column; min-height: unset; }
          .ta-tabs {
            width: 100%; flex-direction: row;
            border-right: none; border-bottom: 1px solid rgba(255,255,255,0.09);
            overflow-x: auto; scrollbar-width: none;
          }
          .ta-tabs::-webkit-scrollbar { display: none; }
          .ta-tab {
            flex: 1; flex-direction: column; align-items: center;
            justify-content: center; gap: 0;
            padding: 14px 6px; min-width: 50px;
            border-left: none; border-bottom: 3px solid transparent;
          }
          .ta-tab.ta-active { border-bottom-color: var(--blue); border-left-color: transparent; }
          .ta-tab-body { display: none; }
          .ta-tab-arr { display: none; }
          .ta-tab-icon { width: 28px; height: 28px; margin-top: 0; }
          .ta-panel { padding: 20px 16px; }
          .ta-panel-bigicon { width: 38px; height: 38px; }
          .ta-panel-h3 { font-size: 1rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">What We Cover</div>
          <h2 className="s-title light">What We Actually Do in Our Technical SEO Audit</h2>
          <p className="s-sub light">Comprehensive technical analysis that uncovers every issue hurting your search performance</p>
        </div>

        <div className="ta-explorer">
          <div className="ta-tabs" role="tablist" aria-label="Technical SEO Audit Services">
            {SERVICES.map((s, i) => (
              <button
                key={s.num}
                role="tab"
                aria-selected={active === i}
                aria-controls="ta-panel"
                className={`ta-tab${active === i ? ' ta-active' : ''}`}
                onClick={() => select(i)}
              >
                <div className="ta-tab-icon">
                  <SvcIcon name={s.icon} />
                </div>
                <div className="ta-tab-body">
                  <div className="ta-tab-num">SERVICE / {s.num}</div>
                  <div className="ta-tab-label">{s.title}</div>
                </div>
                <span className="ta-tab-arr"><Arrow /></span>
              </button>
            ))}
          </div>

          <div className="ta-panel" id="ta-panel" role="tabpanel">
            <div key={panelKey} className="ta-panel-anim">
              <div className="ta-panel-head">
                <div className="ta-panel-bigicon">
                  <SvcIcon name={svc.icon} size={24} />
                </div>
                <div className="ta-panel-meta">
                  <div className="ta-panel-num">SERVICE / {svc.num}</div>
                  <h3 className="ta-panel-h3">{svc.title}</h3>
                </div>
              </div>
              <p className="ta-panel-intro">{svc.intro}</p>
              <ul className="ta-panel-list">
                {svc.items.map(item => <li key={item}>{item}</li>)}
              </ul>
              <div className="ta-panel-outcome">
                <p>{svc.out}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="svc-cta">
          <a href="/contact/" aria-label="Get started with Technical SEO audit" className="btn-primary">
            Get Your Technical SEO Audit Started <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const { ref, vis } = useReveal()
  const [active, setActive] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  function selectPhase(i: number) {
    if (i === active) return
    setActive(i)
    setPanelKey(k => k + 1)
  }

  const gridCols = PROCESS_PHASES.map((_, i) => (i === active ? '1fr' : '72px')).join(' ')

  return (
    <section className="section process-section">
      <style>{`
        @keyframes ta-pslabIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ta-pslab-track {
          display: grid;
          height: 360px;
          border: 1px solid rgba(0,0,0,0.13);
          transition: grid-template-columns 0.48s cubic-bezier(0.4,0,0.2,1);
        }
        .ta-pslab-slab {
          position: relative; overflow: hidden; cursor: pointer;
          border-right: 1px solid rgba(0,0,0,0.1);
          background: var(--ink);
          display: flex; flex-direction: column;
          transition: background 0.25s;
        }
        .ta-pslab-slab:last-child { border-right: none; }
        .ta-pslab-slab:hover:not(.ta-pslab-on) { background: rgba(14,18,24,0.82); }
        .ta-pslab-slab.ta-pslab-on { cursor: default; background: #fff; }
        .ta-pslab-stripe {
          height: 3px; flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          transition: background 0.3s;
        }
        .ta-pslab-slab.ta-pslab-on .ta-pslab-stripe { background: var(--blue); }
        .ta-pslab-fold {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; padding: 22px 0 20px; gap: 10px;
        }
        .ta-pslab-slab.ta-pslab-on .ta-pslab-fold { display: none; }
        .ta-pslab-fold-num {
          font-size: 1.5rem; font-weight: 900; line-height: 1;
          letter-spacing: -0.04em; color: rgba(255,255,255,0.65);
          transition: color 0.2s;
        }
        .ta-pslab-slab:hover:not(.ta-pslab-on) .ta-pslab-fold-num { color: rgba(255,255,255,0.9); }
        .ta-pslab-fold-line { width: 1px; flex: 1; background: rgba(255,255,255,0.12); }
        .ta-pslab-fold-tag {
          writing-mode: vertical-rl; transform: rotate(180deg);
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(255,255,255,0.58);
          white-space: nowrap; transition: color 0.2s; line-height: 1;
        }
        .ta-pslab-slab:hover:not(.ta-pslab-on) .ta-pslab-fold-tag { color: rgba(255,255,255,0.85); }
        .ta-pslab-fold-time {
          font-size: 0.75rem; font-family: 'JetBrains Mono', monospace;
          color: rgba(255,255,255,0.42); letter-spacing: 0.04em;
          writing-mode: vertical-rl; transform: rotate(180deg);
          transition: color 0.2s;
        }
        .ta-pslab-slab:hover:not(.ta-pslab-on) .ta-pslab-fold-time { color: rgba(255,255,255,0.66); }
        .ta-pslab-open {
          display: none; padding: 18px 26px 16px;
          flex: 1; overflow: hidden; flex-direction: column;
        }
        .ta-pslab-slab.ta-pslab-on .ta-pslab-open { display: flex; }
        .ta-pslab-open-anim {
          animation: ta-pslabIn 0.36s 0.22s cubic-bezier(0.2,0.6,0.4,1) both;
          display: flex; flex-direction: column; height: 100%;
        }
        .ta-pslab-hd {
          display: flex; align-items: flex-start; gap: 12px;
          margin-bottom: 14px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.07); flex-shrink: 0;
        }
        .ta-pslab-hd-ghost {
          font-size: 2.8rem; font-weight: 900; line-height: 0.8;
          color: rgba(37,99,235,0.07); letter-spacing: -0.06em;
          flex-shrink: 0; user-select: none; pointer-events: none;
        }
        .ta-pslab-hd-chips { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
        .ta-pslab-hd-chip {
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--blue);
          background: rgba(37,99,235,0.08); padding: 3px 8px;
          border: 1px solid rgba(37,99,235,0.18);
        }
        .ta-pslab-hd-time {
          font-size: 0.875rem; color: rgba(0,0,0,0.28);
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
        }
        .ta-pslab-hd-title {
          font-size: 1.04rem; font-weight: 700; color: var(--ink);
          line-height: 1.28; margin: 0;
        }
        .ta-pslab-sections {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          flex: 1; align-content: start;
        }
        .ta-pslab-sec-hd {
          font-size: 0.875rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--blue);
          margin-bottom: 11px; padding-bottom: 7px;
          border-bottom: 1px solid rgba(37,99,235,0.12);
        }
        .ta-pslab-sec-ul {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 7px;
        }
        .ta-pslab-sec-ul li {
          font-size: 0.875rem; color: #3a4a5c;
          line-height: 1.44; display: flex; align-items: flex-start; gap: 9px;
        }
        .ta-pslab-sec-ul li::before {
          content: ''; width: 3px; height: 3px; min-width: 3px;
          background: var(--blue); margin-top: 7px; flex-shrink: 0;
        }
        .ta-pslab-nav { display: flex; justify-content: center; gap: 7px; margin-top: 14px; }
        .ta-pslab-nav-dot {
          width: 24px; height: 3px; padding: 0; border: none; cursor: pointer;
          background: rgba(0,0,0,0.1);
          transition: background 0.2s, width 0.25s;
        }
        .ta-pslab-nav-dot.ta-pslab-nav-on { background: var(--blue); width: 42px; }
        @media (max-width: 720px) {
          .ta-pslab-track { grid-template-columns: 1fr !important; height: auto; }
          .ta-pslab-slab { flex-direction: row; min-height: 52px; }
          .ta-pslab-slab.ta-pslab-on { flex-direction: column; }
          .ta-pslab-stripe { width: 4px; height: auto; flex-shrink: 0; }
          .ta-pslab-slab.ta-pslab-on .ta-pslab-stripe { width: 100%; height: 3px; }
          .ta-pslab-fold { flex-direction: row; padding: 0 14px; gap: 10px; }
          .ta-pslab-fold-tag, .ta-pslab-fold-time { writing-mode: horizontal-tb; transform: none; }
          .ta-pslab-fold-line { width: auto; height: 1px; flex: 1; }
          .ta-pslab-open { padding: 18px 16px; }
          .ta-pslab-sections { grid-template-columns: 1fr; gap: 14px; }
          .ta-pslab-hd-ghost { font-size: 2.2rem; }
          .ta-pslab-hd-title { font-size: 0.92rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Our Process</div>
          <h2 className="s-title">How We Actually Conduct Your Technical SEO Audit</h2>
          <p className="s-sub">A thorough 4-week process that leaves no stone unturned</p>
        </div>

        <div className="ta-pslab-track" style={{ gridTemplateColumns: gridCols }}>
          {PROCESS_PHASES.map((p, i) => (
            <div
              key={p.num}
              className={`ta-pslab-slab${active === i ? ' ta-pslab-on' : ''}`}
              onClick={() => selectPhase(i)}
              role="button"
              tabIndex={active === i ? -1 : 0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPhase(i) } }}
              aria-expanded={active === i}
              aria-label={active === i ? undefined : `Open ${p.week}: ${p.title}`}
            >
              <div className="ta-pslab-stripe" />

              {/* Inactive: vertical label strip */}
              <div className="ta-pslab-fold">
                <span className="ta-pslab-fold-num">{p.num}</span>
                <div className="ta-pslab-fold-line" aria-hidden="true" />
                <span className="ta-pslab-fold-tag">{p.week}</span>
                <span className="ta-pslab-fold-time">{p.timing}</span>
              </div>

              {/* Active: full content panel */}
              <div className="ta-pslab-open">
                <div key={panelKey} className="ta-pslab-open-anim">
                  <div className="ta-pslab-hd">
                    <div className="ta-pslab-hd-ghost" aria-hidden="true">{p.num}</div>
                    <div>
                      <div className="ta-pslab-hd-chips">
                        <span className="ta-pslab-hd-chip">{p.week}</span>
                        <span className="ta-pslab-hd-time">{p.timing}</span>
                      </div>
                      <h3 className="ta-pslab-hd-title">{p.title}</h3>
                    </div>
                  </div>
                  <div className="ta-pslab-sections">
                    {p.sections.map((sec) => (
                      <div key={sec.heading}>
                        <div className="ta-pslab-sec-hd">{sec.heading}</div>
                        <ul className="ta-pslab-sec-ul">
                          {sec.items.map(item => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ta-pslab-nav" aria-label="Phase navigation">
          {PROCESS_PHASES.map((_, i) => (
            <button
              key={i}
              className={`ta-pslab-nav-dot${active === i ? ' ta-pslab-nav-on' : ''}`}
              onClick={() => selectPhase(i)}
              aria-label={`Week ${i + 1}`}
              aria-current={active === i ? true : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReportSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section choose-section" style={{ background: '#fff' }}>
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">What You Get</div>
          <h2 className="s-title">What&apos;s Actually in Your Technical SEO Audit Report</h2>
          <p className="s-sub">A comprehensive, actionable document that your team can use immediately</p>
        </div>
        <div className="choose-grid">
          {REPORT_CARDS.map((c, i) => <ReportCard key={c.title} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section choose-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Why SEOShouts</div>
          <h2 className="s-title">Why Choose SEOShouts for Your Technical Audit?</h2>
          <p className="s-sub">13+ years of technical SEO expertise you can trust</p>
        </div>
        <div className="choose-grid">
          {WHY_CARDS.map((c, i) => <WhyCard key={c.title} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function InvestmentSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section svc-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">Pricing</div>
          <h2 className="s-title light">Technical SEO Audit Investment</h2>
          <p className="s-sub light">No cookie-cutter packages — just fair pricing for the work required</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2.5rem',
          maxWidth: 900,
          margin: '0 auto',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            {/* Left column */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                Our comprehensive Technical SEO Audit is priced based on your website&apos;s complexity and your specific needs.
              </p>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '0.75rem' }}>
                Every audit includes:
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  'Complete technical analysis (usually 40-80 pages of detailed findings)',
                  'Priority-based implementation roadmap',
                  '1-hour strategy session to review everything',
                  '30 days of implementation support via email',
                  'Optional follow-up audit after 60 days',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--blue)', fontWeight: 700, marginTop: 2, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column */}
            <div style={{
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.25)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.25rem',
            }}>
              <div style={{ fontSize: '2.2rem' }}>🔍</div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.35, margin: 0 }}>
                Want to know the investment for your specific site?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                Contact us for a custom quote. Every site is different, and we price based on what your site actually needs.
              </p>
              <a href="/contact/" aria-label="Get custom quote for Technical SEO audit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                Get Your Custom Quote Today <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section faq-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">FAQ</div>
          <h2 className="s-title">Questions We Get About <span className="blue">Technical SEO Audits</span></h2>
          <p className="s-sub">Common questions about our Technical SEO audit process</p>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.q}</summary>
              <div className="faq-answer">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { ref, vis } = useReveal()
  return (
    <section className="cta-section-svc">
      <div className="cta-svc-inner">
        <div ref={ref} className={`reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">Get Started</div>
          <h2 className="s-title light" style={{ maxWidth: 880, marginBottom: '1.25rem' }}>
            Ready to See What&apos;s Really Happening Under the Hood?
          </h2>
          <p className="s-sub light" style={{ marginBottom: '3rem' }}>
            Stop guessing why your rankings aren&apos;t improving. Let&apos;s find out exactly what&apos;s wrong and how to fix it.{' '}
            <strong style={{ color: '#fff' }}>SEOShouts&apos; Technical SEO experts</strong>{' '}
            will conduct a thorough investigation of your site and give you a crystal-clear roadmap to technical excellence.
          </p>
        </div>
        <div className="cta-start-label">→ Let&apos;s Get Your Technical Audit Started</div>
        <div className="cta-channels">
          <div className="cta-channel">
            <div className="cta-channel-icon">🎯</div>
            <div>
              <h4>Request Your Technical SEO Audit Quote</h4>
              <p>Get a custom proposal for your specific website</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📞</div>
            <div>
              <h4>Call: +91 8094888157</h4>
              <p>Talk directly with our technical team</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📧</div>
            <div>
              <h4>Email: seoshouts@gmail.com</h4>
              <p>Tell us about your technical challenges</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">💬</div>
            <div>
              <h4>Book a Technical Consultation</h4>
              <p>Get expert advice on your site&apos;s technical health</p>
            </div>
          </div>
        </div>
        <div className="cta-actions">
          <a href="/contact/" aria-label="Request Technical SEO audit quote from SEOShouts" className="btn-primary">
            🎯 Request Your Technical SEO Audit Quote → <Arrow />
          </a>
          <a href="tel:+918094888157" aria-label="Call SEOShouts for Technical SEO consultation" className="btn-outline">
            📞 Call +91 8094888157
          </a>
        </div>
        <div className="cta-foot">
          <p className="cta-served">Based in Udaipur, Rajasthan — serving websites across India and beyond</p>
          <p>
            Got specific technical concerns? Our team has seen every technical nightmare imaginable (and fixed most of them). With 13+ years of experience and a track record of solving complex technical problems, we&apos;ll help you build the solid foundation your SEO needs.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function TechnicalSeoAuditPageContent() {
  return (
    <>
      <Crumbs />
      <PageHero />
      <ProblemsSection />
      <ServicesSection />
      <ProcessSection />
      <ReportSection />
      <WhySection />
      <InvestmentSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
