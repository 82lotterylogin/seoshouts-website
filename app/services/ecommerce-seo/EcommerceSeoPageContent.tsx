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
  if (name === 'gear') return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  if (name === 'search') return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
  if (name === 'page') return <svg {...p}><rect x="4" y="3" width="16" height="18" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
  if (name === 'edit') return <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  if (name === 'link') return <svg {...p}><path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" /><path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" /></svg>
  if (name === 'chart') return <svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
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
        <span className="current">eCommerce SEO</span>
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
            🛒 eCommerce SEO Specialists for India
          </div>
          <h1>eCommerce SEO Services India<br /><span className="blue">Skyrocket Your Store&apos;s Growth</span></h1>
          <p className="wd-hero-body">Tap into India&apos;s booming eCommerce market and get your products in front of customers <strong>right when they&apos;re searching to buy</strong>.</p>
          <p className="wd-hero-body"><strong>53% of all eCommerce traffic</strong> comes from organic search — yet most online stores are leaving this revenue on the table by neglecting product page optimisation and technical SEO.</p>
          <p className="wd-hero-body">SEOShouts&apos; <strong>eCommerce SEO services</strong> are designed to turn your online store into a sales powerhouse — increasing visibility, outranking competitors, and driving revenue you can actually measure.</p>
          <p className="wd-hero-body">From category architecture to schema markup, our <strong>13+ years of SEO expertise</strong> means every rupee you invest works harder for your bottom line.</p>
          <div className="phero-ctas">
            <a href="/contact/" aria-label="Get free eCommerce SEO audit" className="btn-primary">
              🚀 Get Your FREE eCommerce SEO Audit <Arrow />
            </a>
            <a href="tel:+918094888157" aria-label="Call SEO Shouts for eCommerce SEO consultation" className="btn-outline">
              📞 Call +91 8094888157
            </a>
          </div>
          <div className="wd-hero-trust">
            <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Organic product traffic growth tracked monthly with transparent reporting
          </div>
        </div>

        <HeroQuoteForm />
      </div>
    </section>
  )
}

const STATS = [
  { num: '80%', text: <><strong>80%+ of online shoppers</strong> begin their buying journey on Google and other search engines</>, label: '01 / Search-First' },
  { num: '53%', text: <><strong>53% of all eCommerce traffic</strong> comes from organic search — more than any paid channel</>, label: '02 / Organic-Leads' },
  { num: '82%', text: <><strong>82% of mobile shoppers</strong> use search engines as their first tool for product discovery in India</>, label: '03 / Mobile-First' },
  { num: '2%', text: <>Only <strong>2% of users</strong> go beyond the first page of results for shopping queries</>, label: '04 / Page-One' },
]

function WhySection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section why-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">The eCommerce Opportunity</div>
          <h2 className="s-title">Why eCommerce SEO Matters <span className="blue">for Your Online Store</span></h2>
        </div>
        <p className="why-lede">
          Over <strong>80% of online shoppers begin their journey on Google</strong> and other search engines.
          With thousands of products and fierce competition, ranking in the top results is the difference
          between an abandoned cart and a loyal customer. If your products aren&apos;t visible,
          your customers buy from your competitors.
        </p>
        <div className="why-substat-label">Key eCommerce Search Insights</div>
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
          <span className="wbt">If your products aren&apos;t on page one, your competitors are capturing every customer searching to buy in India&apos;s booming eCommerce market.</span>
        </div>
      </div>
    </section>
  )
}

const SERVICES = [
  {
    icon: 'gear',
    title: 'Advanced Technical eCommerce SEO',
    intro: 'Make your site easy to crawl, fast, and mobile-optimized — the foundation of scalable eCommerce SEO:',
    items: [
      'Site architecture planning for stores with 100 to 50,000+ SKUs',
      'Crawl budget optimization and indexation management',
      'XML Sitemap & robots.txt optimization for product/collection pages',
      'Core Web Vitals and page speed improvements for higher rankings',
      'Mobile-first technical strategies for seamless shopping experiences',
      'HTTPS, secure checkout, and trust signal enhancements',
    ],
    out: 'So you get a robust, scalable store that Google and customers love.',
  },
  {
    icon: 'search',
    title: 'eCommerce Keyword Research & Mapping',
    intro: 'Drive targeted, purchase-ready traffic to every product and category:',
    items: [
      'In-depth keyword research for main, transactional, and long-tail terms',
      'Product and category-level keyword mapping',
      'Competitive gap analysis of Indian and global eCommerce sites',
      'Brand, generic, and seasonal keyword targeting strategies',
      'Search intent analysis focused on buyer journeys',
    ],
    out: 'Which means your products are discovered by customers ready to buy, not just browse.',
  },
  {
    icon: 'page',
    title: 'On-Page SEO for Products & Category Pages',
    intro: 'Turn your website into a conversion-optimized, search-friendly marketplace:',
    items: [
      'SEO-friendly titles, meta descriptions, and H1s for every product and collection page',
      'Unique, conversion-focused product descriptions built for humans and search engines',
      'Schema markup for products, reviews, availability, and FAQs',
      'Image SEO (alt text, file names, compression) for better visibility in Google Images',
      'Breadcrumb integration for improved navigation and rankings',
    ],
    out: 'So each page ranks for relevant queries and converts visitors into buyers.',
  },
  {
    icon: 'edit',
    title: 'Content Marketing & eCommerce Blogging',
    intro: 'Establish authority and drive consistent organic traffic with valuable content:',
    items: [
      'Category, collection, and buying guide creation',
      'Product comparisons and user intent-focused content',
      'How-to articles, reviews, and eCommerce FAQs',
      'Seasonal campaign landing pages and content calendars',
      'Content clusters that boost topical authority',
    ],
    out: 'Which means you attract shoppers at every stage of the buying cycle.',
  },
  {
    icon: 'link',
    title: 'Link Building & Digital PR for eCommerce',
    intro: 'Earn powerful, industry-relevant backlinks that boost domain authority:',
    items: [
      'Outreach to review sites and shopping directories',
      'Industry-specific link acquisition (fashion, electronics, home, etc.)',
      'Influencer collaboration for product launches and campaigns',
      'Brand mention reclamation and competitor link gap analysis',
      'Local, national, and international eCommerce PR strategies',
    ],
    out: 'So your products achieve sustainable, top-of-page visibility.',
  },
  {
    icon: 'chart',
    title: 'Conversion Rate Optimization (CRO) & UX',
    intro: 'Beyond rankings: convert traffic into sales with intelligent site design and analysis:',
    items: [
      'User journey and checkout flow analysis',
      'A/B testing on product page layouts and CTAs',
      'Trust badge placement and review integration',
      'Cart abandonment optimization and remarketing setup',
      'Data-driven performance tracking',
    ],
    out: 'So every visitor has a clear path from search to sale.',
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
        @keyframes ecSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ec-explorer {
          display: flex; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09); min-height: 480px;
        }
        .ec-tabs {
          width: 300px; flex-shrink: 0;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.09);
          display: flex; flex-direction: column;
        }
        .ec-tab {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 15px 18px; cursor: pointer; border: none;
          background: transparent; text-align: left;
          color: rgba(255,255,255,0.5);
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          border-left: 3px solid transparent;
        }
        .ec-tab:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.82); }
        .ec-tab.ec-active {
          background: rgba(37,99,235,0.14);
          color: #fff;
          border-left-color: var(--blue);
        }
        .ec-tab-icon {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07); flex-shrink: 0; margin-top: 1px;
          transition: background 0.18s, color 0.18s;
        }
        .ec-tab.ec-active .ec-tab-icon { background: rgba(37,99,235,0.28); color: var(--blue); }
        .ec-tab-body { flex: 1; min-width: 0; }
        .ec-tab-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); opacity: 0.85; margin-bottom: 3px; }
        .ec-tab.ec-active .ec-tab-num { opacity: 1; }
        .ec-tab-label { font-size: 0.9rem; font-weight: 600; line-height: 1.35; }
        .ec-tab-arr { flex-shrink: 0; align-self: center; opacity: 0; transition: opacity 0.18s; color: var(--blue); }
        .ec-tab.ec-active .ec-tab-arr { opacity: 1; }
        /* Panel */
        .ec-panel { flex: 1; padding: 34px 38px; overflow-y: auto; }
        .ec-panel-anim { animation: ecSlideIn 0.3s cubic-bezier(0.2,0.6,0.4,1) both; }
        .ec-panel-head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .ec-panel-bigicon {
          width: 50px; height: 50px;
          background: rgba(37,99,235,0.18); border: 1px solid rgba(37,99,235,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--blue); flex-shrink: 0;
        }
        .ec-panel-meta { flex: 1; }
        .ec-panel-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); margin-bottom: 4px; }
        .ec-panel-h3 { font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.3; margin: 0; }
        .ec-panel-intro { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 20px; line-height: 1.65; }
        .ec-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
        .ec-panel-list li {
          font-size: 0.875rem; color: rgba(255,255,255,0.68);
          line-height: 1.45; display: flex; align-items: flex-start; gap: 8px;
        }
        .ec-panel-list li::before {
          content: ''; width: 5px; height: 5px; min-width: 5px;
          border-radius: 50%; background: var(--blue); margin-top: 6px;
        }
        .ec-panel-outcome {
          margin-top: 20px; background: rgba(37,99,235,0.1);
          border-left: 3px solid var(--blue); padding: 11px 16px;
        }
        .ec-panel-outcome p { font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.78); margin: 0; font-style: italic; }
        /* Mobile */
        @media (max-width: 900px) {
          .ec-explorer { flex-direction: column; min-height: unset; }
          .ec-tabs {
            width: 100%; flex-direction: row;
            border-right: none; border-bottom: 1px solid rgba(255,255,255,0.09);
            overflow-x: auto; scrollbar-width: none;
          }
          .ec-tabs::-webkit-scrollbar { display: none; }
          .ec-tab {
            flex: 1; flex-direction: column; align-items: center;
            justify-content: center; gap: 0;
            padding: 14px 6px; min-width: 50px;
            border-left: none; border-bottom: 3px solid transparent;
          }
          .ec-tab.ec-active { border-bottom-color: var(--blue); border-left-color: transparent; }
          .ec-tab-body { display: none; }
          .ec-tab-arr { display: none; }
          .ec-tab-icon { width: 28px; height: 28px; margin-top: 0; }
          .ec-panel { padding: 20px 16px; }
          .ec-panel-bigicon { width: 38px; height: 38px; }
          .ec-panel-h3 { font-size: 1rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">What We Do</div>
          <h2 className="s-title light">Comprehensive eCommerce SEO Services <span className="blue">for Maximum Impact</span></h2>
          <p className="s-sub light">Complete eCommerce SEO solutions designed to drive traffic, rankings, and revenue for your online store</p>
        </div>

        <div className="ec-explorer">
          {/* ─── Left: Service Tabs ─── */}
          <div className="ec-tabs" role="tablist" aria-label="eCommerce SEO Services">
            {SERVICES.map((s, i) => (
              <button
                key={s.title}
                role="tab"
                aria-selected={active === i}
                aria-controls="ec-panel"
                className={`ec-tab${active === i ? ' ec-active' : ''}`}
                onClick={() => select(i)}
              >
                <div className="ec-tab-icon">
                  <SvcIcon name={s.icon} />
                </div>
                <div className="ec-tab-body">
                  <div className="ec-tab-num">SERVICE / {String(i + 1).padStart(2, '0')}</div>
                  <div className="ec-tab-label">{s.title}</div>
                </div>
                <span className="ec-tab-arr"><Arrow /></span>
              </button>
            ))}
          </div>

          {/* ─── Right: Content Panel ─── */}
          <div className="ec-panel" id="ec-panel" role="tabpanel">
            <div key={panelKey} className="ec-panel-anim">
              <div className="ec-panel-head">
                <div className="ec-panel-bigicon">
                  <SvcIcon name={svc.icon} size={24} />
                </div>
                <div className="ec-panel-meta">
                  <div className="ec-panel-num">SERVICE / {String(active + 1).padStart(2, '0')}</div>
                  <h3 className="ec-panel-h3">{svc.title}</h3>
                </div>
              </div>

              <p className="ec-panel-intro">{svc.intro}</p>

              <ul className="ec-panel-list">
                {svc.items.map(item => <li key={item}>{item}</li>)}
              </ul>

              <div className="ec-panel-outcome">
                <p>{svc.out}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="svc-cta">
          <a href="/contact/" aria-label="Get started with eCommerce SEO services" className="btn-primary">
            Get Started with eCommerce SEO Today <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

const PHASES = [
  {
    num: '01', phase: 'Phase 1', week: 'Weeks 1–2', title: 'Discovery & Audit',
    items: [
      'In-depth technical and competitor audit',
      'Product and keyword opportunity analysis',
      'Custom SEO roadmap for your store\'s unique needs',
    ],
  },
  {
    num: '02', phase: 'Phase 2', week: 'Weeks 3–8', title: 'Implementation & Optimization',
    items: [
      'Technical fixes, on-page optimizations, and initial content rollout',
      'Schema markup and site speed improvements',
      'Category and product structure refinement',
    ],
  },
  {
    num: '03', phase: 'Phase 3', week: 'Months 2–4', title: 'Content & Authority Building',
    items: [
      'Ongoing blog, buying guide, and landing page creation',
      'Strategic link-building campaigns',
      'Internal linking and conversion optimization',
    ],
  },
  {
    num: '04', phase: 'Phase 4', week: 'Month 4+ Ongoing', title: 'Growth & ROI Scaling',
    items: [
      'Performance analytics, regular rankings reports, and CRO experiments',
      'Seasonal campaigns, new product launches, offer optimization',
      'Ongoing competitor gap and trend analysis',
    ],
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
          <h2 className="s-title">Our Proven eCommerce SEO Process <span className="blue">at SEOShouts</span></h2>
          <p className="s-sub">A systematic 4-phase approach that delivers measurable results for eCommerce businesses</p>
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
    emoji: '👜',
    name: 'Leather Products Brand',
    cat: 'Premium Leather Goods',
    challenge: 'Struggling to compete with established leather goods retailers online',
    results: [
      ['Top 3 rankings achieved', ' for 25 high-value leather product keywords'],
      ['340% increase', ' in organic visibility for premium leather categories'],
      ['Dominated search results', ' for "buy leather bags online," "premium leather wallets," and related terms'],
      ['₹4.2 lakh additional monthly revenue', ' from organic search traffic'],
    ],
  },
  {
    emoji: '🌱',
    name: 'Organic Products eCommerce Store',
    cat: 'Organic & Natural Products',
    challenge: 'Low organic lead generation despite quality product range',
    results: [
      ['Leads increased from 30 to 150+ per month', ' through strategic SEO optimization'],
      ['400% improvement', ' in organic lead generation within 8 months'],
      ['Top 5 rankings', ' for "buy organic products online" and related keywords'],
      ['Sustained growth', ' with consistent month-over-month lead increases'],
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
          <h2 className="s-title">Success Stories:<br />Real Results from <span className="blue">Indian eCommerce Brands</span></h2>
          <p className="s-sub">See how we&apos;ve helped online stores across India dominate search results and drive revenue</p>
        </div>
        <div className="cases-grid">
          {CASES.map((c, i) => <CaseCard key={c.name} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

const CHOOSE = [
  { mark: 'EX', title: '13+ Years of SEO Excellence, 5+ Years eCommerce', body: <p>We understand the nuances of <strong>ranking, optimizing, and growing online stores</strong> in India&apos;s diverse marketplace.</p> },
  { mark: 'CS', title: 'Custom Strategies, Not One-Size-Fits-All Packages', body: <p>Every site — from <strong>100 to 50,000+ SKUs</strong> — gets a bespoke SEO action plan aligned to your business, sector, and goals.</p> },
  { mark: 'FS', title: 'Full-Service, Results-Driven Approach', body: <p>From <strong>technical fixes to CRO, schema markup, and content</strong>, we handle every aspect required for eCommerce dominance.</p> },
  { mark: 'PR', title: 'Performance Reporting & Tracking', body: <p>Transparent <strong>monthly analytics, custom KPIs, and ongoing communication</strong>, so you always know your ROI.</p> },
  { mark: 'PL', title: 'Experience Across All eCommerce Platforms', body: <p>We specialize in <strong>Shopify, WooCommerce, Magento, OpenCart</strong>, and custom eCommerce builds.</p> },
  { mark: '🇮🇳', title: 'India-Focused, Global-Ready', body: <p>From Udaipur to Mumbai, Delhi, Bangalore and beyond — we optimize for <strong>Indian consumer behavior and international expansion</strong> alike.</p> },
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
          <h2 className="s-title">Why Choose<br />SEOShouts for <span className="blue">eCommerce SEO?</span></h2>
          <p className="s-sub">Your trusted partner for eCommerce SEO success in India&apos;s competitive online marketplace</p>
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
          <h2>Our eCommerce SEO Guarantee at SEOShouts</h2>
          <h3>90-Day Performance Guarantee</h3>
          <p className="gtext">
            We&apos;re so confident in our eCommerce SEO strategies that we guarantee measurable
            improvements in your organic search visibility and traffic within 90 days, or we&apos;ll
            continue working at no additional cost until you see results.
          </p>
          <div className="guarantee-sub-label">What We Promise</div>
          <div className="guarantee-promise">
            <ul>
              <li>Improved product and category page rankings</li>
              <li>Higher organic traffic from purchase-ready customers</li>
              <li>Enhanced product visibility in Google Shopping and Images</li>
            </ul>
            <ul>
              <li>Better conversion rates from SEO-driven traffic</li>
              <li>Increased revenue from organic search channels</li>
            </ul>
          </div>
          <a href="/contact/" aria-label="Claim your eCommerce SEO guarantee" className="btn-primary">
            Claim Your 90-Day Guarantee Today <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  { q: 'How long does it take to see eCommerce SEO results?', a: 'Most clients see initial improvements in product rankings within 6-8 weeks, with significant traffic and sales increases typically occurring within 3-6 months. eCommerce sites often see faster results due to high commercial intent keywords.' },
  { q: 'Do you work with small stores or only large eCommerce businesses?', a: 'We work with businesses of all sizes - from startup stores with 100 products to established retailers with 50,000+ SKUs. Our strategies are customized based on your inventory size, budget, and growth goals.' },
  { q: 'Can you help optimize my existing product descriptions?', a: "Absolutely. We audit and optimize all existing product descriptions for SEO while maintaining conversion-focused copy that encourages purchases. We also create new descriptions for products that need them." },
  { q: 'Which eCommerce platforms do you specialize in?', a: "We have extensive experience with Shopify, WooCommerce, Magento, OpenCart, and custom-built eCommerce solutions. Our technical SEO strategies are platform-agnostic but optimized for each system's unique features." },
  { q: 'How do you handle large inventory sites with thousands of products?', a: 'We use advanced crawl budget optimization, strategic internal linking, and automated SEO processes to efficiently manage large inventories. Our approach ensures every important product gets proper search visibility.' },
  { q: 'Do you help with international eCommerce SEO?', a: "Yes, we help Indian businesses expand internationally and global brands enter the Indian market. Our strategies include multi-language SEO, international shipping optimization, and region-specific search tactics." },
]

function FAQSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section faq-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">FAQ</div>
          <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          <p className="s-sub">Common questions about our eCommerce SEO services</p>
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
            Ready to Transform Your eCommerce Store Into a <span style={{ color: 'var(--blue)' }}>Sales Machine?</span>
          </h2>
          <p className="s-sub light" style={{ marginBottom: '3rem' }}>
            Don&apos;t let competitors capture your potential customers.{' '}
            <strong style={{ color: '#fff' }}>SEOShouts&apos; eCommerce SEO experts</strong> are ready
            to develop a custom strategy that drives your products to the top of search results and
            converts visitors into loyal customers.
          </p>
        </div>
        <div className="cta-start-label">→ Get Started Today</div>
        <div className="cta-channels">
          <div className="cta-channel">
            <div className="cta-channel-icon">🎯</div>
            <div>
              <h4>Get Your FREE eCommerce SEO Audit</h4>
              <p>Discover exactly what&apos;s preventing your products from ranking higher</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📞</div>
            <div>
              <h4>Call: +91 8094888157</h4>
              <p>Speak directly with our eCommerce SEO team in Udaipur, Rajasthan</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📧</div>
            <div>
              <h4>Email: seoshouts@gmail.com</h4>
              <p>Discuss your eCommerce SEO goals with our specialists</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">💬</div>
            <div>
              <h4>Schedule a Strategy Consultation</h4>
              <p>Get a custom eCommerce SEO roadmap for your online store</p>
            </div>
          </div>
        </div>
        <div className="cta-actions">
          <a href="/contact/" aria-label="Get free eCommerce SEO audit from SEOShouts" className="btn-primary">
            🎯 Get Your FREE eCommerce SEO Audit <Arrow />
          </a>
          <a href="tel:+918094888157" aria-label="Call SEOShouts for eCommerce SEO consultation" className="btn-outline">
            📞 Call +91 8094888157
          </a>
        </div>
        <div className="cta-foot">
          <p className="cta-served"><strong>Serving eCommerce businesses across India from our Udaipur, Rajasthan headquarters</strong></p>
          <p><strong>Still have questions?</strong> Our eCommerce SEO specialists at SEOShouts are standing by to discuss your specific store&apos;s needs and goals. With 13+ years of SEO experience and proven success in the Indian eCommerce market, we&apos;re ready to help your online store dominate search results and drive sustainable growth.</p>
        </div>
      </div>
    </section>
  )
}

export default function EcommerceSeoPageContent() {
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
