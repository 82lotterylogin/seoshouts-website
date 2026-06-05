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

function ArrowSm() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  )
}

const SvcIcon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'gbp') return <svg {...p}><rect x="3" y="6" width="18" height="14" /><path d="M3 10h18" /><circle cx="8" cy="15" r="1.5" /></svg>
  if (name === 'kw') return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
  if (name === 'onpage') return <svg {...p}><rect x="4" y="3" width="16" height="18" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
  if (name === 'cite') return <svg {...p}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg>
  if (name === 'star') return <svg {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
  if (name === 'link') return <svg {...p}><path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" /><path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" /></svg>
  return null
}

function Crumbs() {
  return (
    <div className="crumbs">
      <div className="crumbs-inner">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/services/">Services</a>
        <span className="sep">/</span>
        <span className="current">Local SEO</span>
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
            🇮🇳 Local SEO Specialists for India
          </div>
          <h1>Local SEO Services India<br /><span className="blue">Dominate Your Local Market</span></h1>
          <p className="wd-hero-body">Get found by local customers <strong>right when they&apos;re ready to buy</strong> — not after they&apos;ve already called your competitor.</p>
          <p className="wd-hero-body"><strong>97% of Indian consumers</strong> use online search to find local businesses, yet most of your competition hasn&apos;t optimised their Google presence properly. That&apos;s your opportunity.</p>
          <p className="wd-hero-body">SEOShouts&apos; <strong>Local SEO services</strong> put your business at the top of Google Maps, the local pack, and organic results — driving real foot traffic and qualified leads from customers in your area.</p>
          <p className="wd-hero-body">With <strong>13+ years of SEO experience</strong> and a deep understanding of India&apos;s hyperlocal search landscape, we&apos;ve helped hundreds of businesses dominate their local markets.</p>
          <div className="phero-ctas">
            <a href="/contact/" aria-label="Get free Local SEO audit" className="btn-primary">
              🚀 Get Your Free Local SEO Audit <Arrow />
            </a>
            <a href="tel:+918094888157" aria-label="Call SEO Shouts for Local SEO consultation" className="btn-outline">
              📞 Call +91 8094888157
            </a>
          </div>
          <div className="wd-hero-trust">
            <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Ranking improvements visible within 60–90 days for most local markets
          </div>
        </div>
        <HeroQuoteForm />
      </div>
    </section>
  )
}

const STATS = [
  { num: '97%', text: <><strong>97% of Indian consumers</strong> use online search to find local businesses</>, label: '01 / Search-First' },
  { num: '80%', text: <><strong>Mobile searches dominate</strong> with 80% of local searches happening on mobile devices</>, label: '02 / Mobile-First' },
  { num: '150%', text: <><strong>&ldquo;Near me&rdquo; searches in India</strong> have grown by 150% year-over-year</>, label: '03 / Hyperlocal' },
  { num: '30%', text: <>Only <strong>30% of Indian businesses</strong> have optimized Google Business Profiles</>, label: '04 / Whitespace' },
]

function WhySection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section why-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">The Indian Opportunity</div>
          <h2 className="s-title">Why Local SEO is Critical for Your Business <span className="blue">Success in India</span></h2>
        </div>
        <p className="why-lede">
          When potential customers search for businesses like yours,{' '}
          <strong>76% of people who conduct a local search visit a business within 24 hours</strong>.
          In India&apos;s rapidly growing digital marketplace, without strong local SEO, you&apos;re
          invisible to these high-intent prospects who are ready to buy.
        </p>
        <div className="why-substat-label">The Indian Local Search Reality</div>
        <div className="stat-grid">
          {STATS.map((s, i) => (
            <div className="stat-cell-big" key={i}>
              <span className="stat-badge">{s.label}</span>
              <div className="stat-num">{s.num}</div>
              <p className="stat-text">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="why-bottom">
          <span className="wbl">→ The bottom line</span>
          <span className="wbt">If you&apos;re not optimized for local search, your competitors are capturing your potential customers across India&apos;s diverse markets.</span>
        </div>
      </div>
    </section>
  )
}

const SERVICES = [
  {
    icon: 'gbp', title: 'Google Business Profile Optimization',
    intro: 'Transform your Google Business Profile into a customer-generating machine:',
    items: ['Complete profile setup and verification', 'Strategic keyword optimization in Hindi and English', 'High-quality photo and video uploads', 'Regular post scheduling and management', 'Multi-language review response management', 'Local Q&A optimization'],
    out: 'So you can appear prominently in local search results and attract more clicks than competitors across Indian cities.',
  },
  {
    icon: 'kw', title: 'India-Focused Local Keyword Research & Strategy',
    intro: 'Target the exact terms your local customers use:',
    items: ['City and region-specific keyword identification', 'Hindi and English "near me" search optimization', 'Local competitor keyword analysis across Indian markets', 'Search intent mapping for local queries in tier 1, 2, and 3 cities', 'Industry-specific local keyword opportunities'],
    out: 'Which means your website attracts visitors who are actively looking for your services in your specific Indian city or region.',
  },
  {
    icon: 'onpage', title: 'On-Page Local SEO Optimization',
    intro: 'Optimize every page of your website for Indian local search:',
    items: ['NAP (Name, Address, Phone) consistency across all pages', 'Local schema markup implementation for Indian businesses', 'Location-specific landing pages for multiple cities', 'Local keyword integration in Hindi and English content', 'Internal linking strategy for local relevance'],
    out: 'So you can rank higher for location-based searches and provide clear signals to search engines about your service areas across India.',
  },
  {
    icon: 'cite', title: 'Local Citation Building & Management',
    intro: 'Build authority and trust across Indian directories:',
    items: ['High-quality Indian directory submissions (JustDial, Sulekha, IndiaMART)', 'NAP consistency monitoring across Indian platforms', 'Industry-specific citation building on relevant Indian sites', 'Duplicate listing identification and removal', 'Google My Business category optimization for Indian markets'],
    out: "Which means search engines have consistent, authoritative information about your business across India's digital ecosystem.",
  },
  {
    icon: 'star', title: 'Review Management & Reputation Building',
    intro: 'Turn customer feedback into a competitive advantage:',
    items: ['Review monitoring across Google, Facebook, and Indian platforms', 'Professional review response in Hindi and English', 'Review generation strategy implementation', 'Negative review damage control and management', 'Star rating improvement tactics for Indian customers'],
    out: 'So you can build trust with potential customers and improve your local search rankings across Indian markets.',
  },
  {
    icon: 'link', title: 'Local Link Building for Indian Markets',
    intro: 'Earn high-quality backlinks from local Indian sources:',
    items: ['Local business partnership opportunities in your city', 'Regional publication and media outreach', 'Industry association and chamber links', 'Local event sponsorship and community involvement', 'City-specific resource page link building'],
    out: "Which means you'll build domain authority while establishing yourself as a trusted local business in India.",
  },
]

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
        @keyframes lseoSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .lseo-explorer {
          display: flex; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09); min-height: 480px;
        }
        .lseo-tabs {
          width: 300px; flex-shrink: 0;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.09);
          display: flex; flex-direction: column;
        }
        .lseo-tab {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 15px 18px; cursor: pointer; border: none;
          background: transparent; text-align: left;
          color: rgba(255,255,255,0.5);
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          border-left: 3px solid transparent;
        }
        .lseo-tab:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.82); }
        .lseo-tab.lseo-active {
          background: rgba(37,99,235,0.14);
          color: #fff;
          border-left-color: var(--blue);
        }
        .lseo-tab-icon {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07); flex-shrink: 0; margin-top: 1px;
          transition: background 0.18s, color 0.18s;
        }
        .lseo-tab.lseo-active .lseo-tab-icon { background: rgba(37,99,235,0.28); color: var(--blue); }
        .lseo-tab-body { flex: 1; min-width: 0; }
        .lseo-tab-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); opacity: 0.85; margin-bottom: 3px; }
        .lseo-tab.lseo-active .lseo-tab-num { opacity: 1; }
        .lseo-tab-label { font-size: 0.9rem; font-weight: 600; line-height: 1.35; }
        .lseo-tab-arr { flex-shrink: 0; align-self: center; opacity: 0; transition: opacity 0.18s; color: var(--blue); }
        .lseo-tab.lseo-active .lseo-tab-arr { opacity: 1; }
        /* Panel */
        .lseo-panel { flex: 1; padding: 34px 38px; overflow-y: auto; }
        .lseo-panel-anim { animation: lseoSlideIn 0.3s cubic-bezier(0.2,0.6,0.4,1) both; }
        .lseo-panel-head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .lseo-panel-bigicon {
          width: 50px; height: 50px;
          background: rgba(37,99,235,0.18); border: 1px solid rgba(37,99,235,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--blue); flex-shrink: 0;
        }
        .lseo-panel-meta { flex: 1; }
        .lseo-panel-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); margin-bottom: 4px; }
        .lseo-panel-h3 { font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.3; margin: 0; }
        .lseo-panel-intro { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 20px; line-height: 1.65; }
        .lseo-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
        .lseo-panel-list li {
          font-size: 0.875rem; color: rgba(255,255,255,0.68);
          line-height: 1.45; display: flex; align-items: flex-start; gap: 8px;
        }
        .lseo-panel-list li::before {
          content: ''; width: 5px; height: 5px; min-width: 5px;
          border-radius: 50%; background: var(--blue); margin-top: 6px;
        }
        .lseo-panel-outcome {
          margin-top: 20px; background: rgba(37,99,235,0.1);
          border-left: 3px solid var(--blue); padding: 11px 16px;
        }
        .lseo-panel-outcome p { font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.78); margin: 0; font-style: italic; }
        /* Mobile */
        @media (max-width: 900px) {
          .lseo-explorer { flex-direction: column; min-height: unset; }
          .lseo-tabs {
            width: 100%; flex-direction: row;
            border-right: none; border-bottom: 1px solid rgba(255,255,255,0.09);
            overflow-x: auto; scrollbar-width: none;
          }
          .lseo-tabs::-webkit-scrollbar { display: none; }
          .lseo-tab {
            flex: 1; flex-direction: column; align-items: center;
            justify-content: center; gap: 0;
            padding: 14px 6px; min-width: 50px;
            border-left: none; border-bottom: 3px solid transparent;
          }
          .lseo-tab.lseo-active { border-bottom-color: var(--blue); border-left-color: transparent; }
          .lseo-tab-body { display: none; }
          .lseo-tab-arr { display: none; }
          .lseo-tab-icon { width: 28px; height: 28px; margin-top: 0; }
          .lseo-panel { padding: 20px 16px; }
          .lseo-panel-bigicon { width: 38px; height: 38px; }
          .lseo-panel-h3 { font-size: 1rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">What We Do</div>
          <h2 className="s-title light">Our Comprehensive <span className="blue">Local SEO Services</span></h2>
          <p className="s-sub light">Complete local SEO solutions tailored specifically for Indian businesses and markets</p>
        </div>

        <div className="lseo-explorer">
          {/* ─── Left: Service Tabs ─── */}
          <div className="lseo-tabs" role="tablist" aria-label="Local SEO Services">
            {SERVICES.map((s, i) => (
              <button
                key={s.title}
                role="tab"
                aria-selected={active === i}
                aria-controls="lseo-panel"
                className={`lseo-tab${active === i ? ' lseo-active' : ''}`}
                onClick={() => select(i)}
              >
                <div className="lseo-tab-icon">
                  <SvcIcon name={s.icon} />
                </div>
                <div className="lseo-tab-body">
                  <div className="lseo-tab-num">SERVICE / {String(i + 1).padStart(2, '0')}</div>
                  <div className="lseo-tab-label">{s.title}</div>
                </div>
                <span className="lseo-tab-arr"><Arrow /></span>
              </button>
            ))}
          </div>

          {/* ─── Right: Content Panel ─── */}
          <div className="lseo-panel" id="lseo-panel" role="tabpanel">
            <div key={panelKey} className="lseo-panel-anim">
              <div className="lseo-panel-head">
                <div className="lseo-panel-bigicon">
                  <SvcIcon name={svc.icon} size={24} />
                </div>
                <div className="lseo-panel-meta">
                  <div className="lseo-panel-num">SERVICE / {String(active + 1).padStart(2, '0')}</div>
                  <h3 className="lseo-panel-h3">{svc.title}</h3>
                </div>
              </div>

              <p className="lseo-panel-intro">{svc.intro}</p>

              <ul className="lseo-panel-list">
                {svc.items.map(item => <li key={item}>{item}</li>)}
              </ul>

              <div className="lseo-panel-outcome">
                <p>{svc.out}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="svc-cta">
          <a href="/contact/" aria-label="Get started with Local SEO services" className="btn-primary">
            Get Started with Local SEO Today <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

const PHASES = [
  {
    num: '01', phase: 'Phase 1', week: 'Week 1–2', title: 'Local SEO Audit & Strategy',
    items: ['Comprehensive local search visibility analysis for Indian markets', 'Google Business Profile optimization audit', 'Local competitor research across your city and region', 'Custom local SEO strategy development for Indian businesses', 'Multi-language keyword research and mapping'],
  },
  {
    num: '02', phase: 'Phase 2', week: 'Week 3–6', title: 'Foundation Building',
    items: ['Google Business Profile complete optimization', 'Website technical SEO improvements for Indian audiences', 'Local schema markup implementation', 'NAP consistency fixes across Indian directories', 'Initial citation building campaign on Indian platforms'],
  },
  {
    num: '03', phase: 'Phase 3', week: 'Week 7–12', title: 'Content & Authority Building',
    items: ['Location-specific content creation in Hindi and English', 'Local link building campaign launch in Indian markets', 'Review management system implementation', 'Local social media optimization for Indian platforms', 'Performance monitoring and reporting setup'],
  },
  {
    num: '04', phase: 'Phase 4', week: 'Ongoing', title: 'Optimization & Growth',
    items: ['Monthly performance analysis and reporting', 'Continuous citation building on Indian platforms', 'Content updates and seasonal campaign optimization', 'Competitive monitoring across Indian markets', 'Strategy adjustments based on local market changes'],
  },
]

function ProcessStep({ p, i, last }: { p: typeof PHASES[0]; i: number; last: boolean }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`process-step reveal d${i + 1}${vis ? ' visible' : ''}`}>
      {!last && <div className="process-connector"><ArrowSm /></div>}
      <div className="num-block">
        <div className="process-num">{p.num}</div>
        <div className="num-side">
          <div className="process-phase">{p.phase}</div>
          <div className="process-week">{p.week}</div>
        </div>
      </div>
      <h3>{p.title}</h3>
      <ul className="plist">
        {p.items.map(it => <li key={it}>{it}</li>)}
      </ul>
    </div>
  )
}

function ProcessSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section process-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Our Process</div>
          <h2 className="s-title">Our Proven Local SEO Process <span className="blue">at SEOShouts</span></h2>
          <p className="s-sub">A systematic 4-phase approach that delivers measurable results for Indian businesses</p>
        </div>
        <div className="process-grid" style={{ background: '#fff' }}>
          {PHASES.map((p, i) => <ProcessStep key={p.num} p={p} i={i} last={i === PHASES.length - 1} />)}
        </div>
      </div>
    </section>
  )
}

const CASES = [
  {
    emoji: '🦷', name: 'Dental Practice Chain', cat: 'Multi-location Healthcare',
    challenge: 'Multiple dental clinics struggling to appear in local searches across different Indian cities',
    results: [
      ['Achieved top 3 rankings', ' in local pack for 10 high-value dental keywords'],
      ['280% increase', ' in appointment bookings through online search'],
      ['Consistent #1 rankings', ' for "dentist near me" across 3 cities'],
      ['₹2.4 lakh additional monthly revenue', ' within 6 months'],
    ],
  },
  {
    emoji: '🎓', name: 'Preschool Network', cat: 'Educational Institution',
    challenge: 'New preschool franchise competing against established local schools',
    results: [
      ['Top 3 local pack rankings', ' for 10 education-related keywords'],
      ['340% increase', ' in admission inquiries'],
      ['4.9-star average rating', ' across all Google Business Profiles'],
      ['Expanded enrollment', ' by 150 students within one academic year'],
    ],
  },
  {
    emoji: '🔧', name: 'Local Service Business', cat: 'Home Services Rajasthan',
    challenge: 'Home services company invisible in local search results',
    results: [
      ['#1 local rankings', ' for primary service keywords in Rajasthan'],
      ['400% increase', ' in service inquiry calls'],
      ['Dominated local pack', ' for 15+ service-related searches'],
      ['Geographic expansion', ' to 2 additional Rajasthan cities'],
    ],
  },
]

function CaseCard({ c, i }: { c: typeof CASES[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <article ref={ref} className={`case-card reveal d${i + 1}${vis ? ' visible' : ''}`}>
      <div className="case-head">
        <div className="case-emoji">{c.emoji}</div>
        <div className="case-h-text">
          <h3>{c.name}</h3>
          <p>{c.cat}</p>
        </div>
      </div>
      <div className="case-body">
        <div className="case-challenge">
          <strong>Challenge</strong>
          {c.challenge}
        </div>
        <div className="case-results">
          <h4>Results Achieved</h4>
          <ul>
            {c.results.map(([b, r], j) => (
              <li key={j}><span><strong>{b}</strong>{r}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="case-foot">Project Success</div>
    </article>
  )
}

function CasesSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section cases-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Proof in the Field</div>
          <h2 className="s-title">Success Stories:<br />Real Results from <span className="blue">Indian Businesses</span></h2>
          <p className="s-sub">See how we&apos;ve helped businesses across India dominate their local markets</p>
        </div>
        <div className="cases-grid">
          {CASES.map((c, i) => <CaseCard key={c.name} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

const CHOOSE = [
  { mark: 'IN', title: 'Deep Indian Market Expertise', body: <p>With <strong>5+ years specialized Local SEO experience</strong> and <strong>13+ years total SEO expertise</strong>, we understand the unique challenges and opportunities in Indian local search markets.</p> },
  { mark: 'TR', title: 'Proven Track Record Across Industries', body: <p>Our portfolio spans dental practices, educational institutions, home services, restaurants, and retail businesses across India — each with documented success in local search rankings.</p> },
  { mark: 'ML', title: 'Multi-Language Optimization', body: <p>We optimize for both Hindi and English searches, ensuring your business captures the full spectrum of local search traffic in India.</p> },
  { mark: 'ST', title: 'India-Specific Strategy', body: <p>Our approach accounts for unique Indian factors: mobile-first usage patterns, local directory ecosystems, regional search behaviors, and tier-wise city characteristics.</p> },
  { mark: 'TP', title: 'Transparent, Results-Focused Approach', body: <p>Receive detailed monthly reports showing exactly how your local rankings, traffic, and leads are improving. Every strategy is customized for Indian market conditions.</p> },
  { mark: 'FS', title: 'Full-Service Local SEO Solution', body: <p>From technical optimization to multi-language content creation to reputation management across Indian platforms — we handle every aspect so you can focus on serving customers.</p> },
]

function ChooseCard({ c, i }: { c: typeof CHOOSE[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`choose-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="choose-icon">{c.mark}</div>
      <h3>{c.title}</h3>
      {c.body}
    </div>
  )
}

function ChooseSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section choose-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Why SEOShouts</div>
          <h2 className="s-title">Why Choose<br />SEOShouts for <span className="blue">Local SEO Services</span></h2>
          <p className="s-sub">Your trusted partner for Local SEO success in India&apos;s diverse markets</p>
        </div>
        <div className="choose-grid">
          {CHOOSE.map((c, i) => <ChooseCard key={c.title} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function GuaranteeSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section guarantee-section">
      <div className="section-container">
        <div ref={ref} className={`guarantee-card reveal${vis ? ' visible' : ''}`}>
          <div className="guarantee-stamp">90-Day Guarantee</div>
          <h2>Our Local SEO Guarantee at SEOShouts</h2>
          <h3>90-Day Performance Guarantee</h3>
          <p className="gtext">
            We&apos;re so confident in our Local SEO strategies that we guarantee measurable
            improvements in your local search visibility within 90 days, or we&apos;ll continue
            working at no additional cost until you see results.
          </p>
          <div className="guarantee-sub-label">What We Promise</div>
          <div className="guarantee-promise">
            <ul>
              <li>Improved Google Business Profile visibility</li>
              <li>Higher local search rankings for target keywords</li>
              <li>Increased website traffic from local searches</li>
            </ul>
            <ul>
              <li>Enhanced online reputation and review ratings</li>
              <li>More qualified leads from local customers</li>
            </ul>
          </div>
          <a href="/contact/" aria-label="Claim your Local SEO guarantee" className="btn-primary">
            Claim Your 90-Day Guarantee Today <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  { q: 'How long does it take to see Local SEO results in India?', a: 'Most clients see initial improvements in local rankings within 4-6 weeks, with significant traffic and lead increases typically occurring within 3-4 months. Indian local markets often have less competition than global markets, allowing for faster results.' },
  { q: 'Do you work with businesses in competitive Indian cities like Mumbai, Delhi, or Bangalore?', a: "Yes, we specialize in helping businesses compete in India's most competitive local markets. Our strategies include hyper-local content creation, niche service targeting, and comprehensive reputation management tailored for metro markets." },
  { q: 'Can you help if my business serves multiple cities across India?', a: 'Absolutely. Our multi-location Local SEO expertise includes city-specific optimization, centralized review management across Indian platforms, and coordinated citation building for all your service areas.' },
  { q: 'What if my business has negative reviews on Indian platforms?', a: 'Our reputation management services include professional review responses in Hindi and English, review generation campaigns across Google and Indian platforms, and strategies to improve your overall ratings.' },
  { q: 'Do you optimize for both Hindi and English searches?', a: "Yes, we create comprehensive multi-language strategies that capture both Hindi and English local search traffic, ensuring maximum visibility across India's diverse linguistic markets." },
  { q: 'Which Indian industries do you have experience with?', a: "We've successfully helped businesses across industries including healthcare (dental practices), education (preschools), home services, restaurants, retail, automotive, real estate, professional services, and more." },
  { q: 'How do you handle local SEO for tier 2 and tier 3 Indian cities?', a: 'We understand the unique characteristics of different city tiers in India and adjust our strategies accordingly — from directory selection to keyword targeting to content creation approaches.' },
]

function FAQSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section faq-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">FAQ</div>
          <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          <p className="s-sub">Common questions about our Local SEO services in India</p>
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
          <div className="eyebrow light">Take the Next Step</div>
          <h2 className="s-title light" style={{ maxWidth: 880, marginBottom: '1.25rem' }}>
            Ready to Dominate Your <span style={{ color: 'var(--blue)' }}>Local Market in India?</span>
          </h2>
          <p className="s-sub light" style={{ marginBottom: '3rem' }}>
            Don&apos;t let another day pass while competitors capture your potential customers.{' '}
            <strong style={{ color: '#fff' }}>SEOShouts&apos; Local SEO experts</strong> are ready
            to develop a custom strategy that puts your business at the top of local search results
            across India.
          </p>
        </div>
        <div className="cta-start-label">→ Get Started Today</div>
        <div className="cta-channels">
          <div className="cta-channel">
            <div className="cta-channel-icon">🎯</div>
            <div>
              <h4>Get Your Free Local SEO Audit</h4>
              <p>Discover exactly what&apos;s holding back your local rankings in Indian markets</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📞</div>
            <div>
              <h4>Call: +91 8094888157</h4>
              <p>Speak directly with our Local SEO team in Udaipur, Rajasthan</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📧</div>
            <div>
              <h4>Email: seoshouts@gmail.com</h4>
              <p>Discuss your local SEO goals with our Indian market specialists</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">💬</div>
            <div>
              <h4>Schedule a Strategy Consultation</h4>
              <p>Get a custom Local SEO roadmap for your Indian business</p>
            </div>
          </div>
        </div>
        <div className="cta-actions">
          <a href="/contact/" aria-label="Get free Local SEO audit from SEOShouts" className="btn-primary">
            🎯 Get Your Free Local SEO Audit <Arrow />
          </a>
          <a href="tel:+918094888157" aria-label="Call SEOShouts for Local SEO consultation" className="btn-outline">
            📞 Call +91 8094888157
          </a>
        </div>
        <div className="cta-foot">
          <p className="cta-served"><strong>Serving businesses across India from our Udaipur, Rajasthan headquarters</strong></p>
          <p><strong>Still have questions?</strong> Our Local SEO specialists at SEOShouts are standing by to discuss your specific situation and goals. With 13+ years of SEO experience and deep understanding of Indian local markets, we&apos;re ready to help your business dominate local search results.</p>
        </div>
      </div>
    </section>
  )
}

export default function LocalSeoPageContent() {
  return (
    <>
      <Crumbs />
      <PageHero />
      <WhySection />
      <ServicesSection />
      <ProcessSection />
      <CasesSection />
      <ChooseSection />
      <GuaranteeSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
