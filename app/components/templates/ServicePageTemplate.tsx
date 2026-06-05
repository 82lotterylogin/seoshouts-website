/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║          SERVICE PAGE DESIGN TEMPLATE — SEOShouts                   ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  Based on: /services/local-seo/LocalSeoPageContent.tsx              ║
 * ║  Apply to: ecommerce-seo, link-building, technical-seo-audit,       ║
 * ║            seo-consulting, seo-website-development                  ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  RULES — READ BEFORE IMPLEMENTING:                                  ║
 * ║  1. Keep ALL existing page content exactly as-is                    ║
 * ║  2. Keep ALL metadata, JSON-LD schemas, canonical URLs              ║
 * ║  3. Keep ALL backend/API calls, form submissions, functionality     ║
 * ║  4. Only change: class names, wrapper structure, visual shell       ║
 * ║  5. Never add Tailwind classes — use CSS vars + class names only    ║
 * ║  6. No border-radius, no gradients on cards, no box shadows         ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  DESIGN SYSTEM COLORS (CSS vars defined in globals.css)             ║
 * ║  --blue: #2563eb       --blue-dark: #1d4ed8                         ║
 * ║  --blue-light: #3b82f6 --blue-pale: #eff6ff                         ║
 * ║  --ink: #08090a        --ink-2: #111318   --ink-3: #1c2030          ║
 * ║  --gray-1: #f3f4f7     --gray-4: #8891aa  --gray-5: #545d78         ║
 * ║  --white: #fff         --line: #e2e5ee                              ║
 * ║                                                                      ║
 * ║  FONTS                                                               ║
 * ║  Headings: 'Space Grotesk', sans-serif                              ║
 * ║  Body:     'Inter', sans-serif                                      ║
 * ║  Mono:     'JetBrains Mono', monospace                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import ShapeGrid from '../ShapeGrid'

// ─── SCROLL REVEAL HOOK ────────────────────────────────────────────────────
// Attach to any section wrapper with ref={ref} className={`reveal${vis ? ' visible' : ''}`}
// CSS classes .reveal / .reveal.visible / .d1–.d6 defined in globals.css
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

// ─── ARROW SVG ─────────────────────────────────────────────────────────────
// Use inside btn-primary / btn-outline CTA links
function Arrow() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  )
}

// Small arrow for process step connectors
function ArrowSm() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 1 — BREADCRUMBS
// ══════════════════════════════════════════════════════════════════════════
// A thin dark bar above the hero. Replace hrefs and labels with actual values.
// CSS: .crumbs / .crumbs-inner / .sep / .current  (globals.css ~line 990)
// ──────────────────────────────────────────────────────────────────────────
function Crumbs() {
  return (
    <div className="crumbs">
      <div className="crumbs-inner">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/services/">Services</a>
        <span className="sep">/</span>
        {/* ▼ REPLACE: page name */}
        <span className="current">Service Name</span>
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 2 — PAGE HERO
// ══════════════════════════════════════════════════════════════════════════
// Dark full-width hero. Split layout: text left, stat card right.
// Background: ShapeGrid canvas (animated) + radial-gradient vignette.
// CSS: .phero / .phero-inner / .phero-tag / .phero-ctas  (globals.css ~line 993)
// Card: .phero-card / .phero-card-head / .phero-card-live
//
// CONTENT TO KEEP: h1 text, h2 subtitle, lead paragraph, CTA links (exact hrefs)
// CARD: Adapt the card to show service-specific stats/preview — keep numbers exact
// ──────────────────────────────────────────────────────────────────────────
function PageHero() {
  return (
    <section className="phero">
      {/* Animated grid — DO NOT MODIFY speed/colors */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
        <ShapeGrid
          direction="diagonal"
          speed={0.4}
          borderColor="rgba(37,99,235,0.22)"
          squareSize={52}
          hoverFillColor="rgba(37,99,235,0.2)"
          hoverTrailAmount={6}
        />
      </div>
      {/* Vignette — fades grid at edges so text stays readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 40%, transparent 20%, rgba(8,9,10,0.85) 100%)', pointerEvents: 'none' }} />

      <div className="phero-inner">
        {/* ── LEFT COLUMN: text ── */}
        <div>
          {/* Small badge tag above h1 */}
          <div className="phero-tag">
            <span className="dot" />
            {/* ▼ REPLACE: e.g. "🛒 eCommerce SEO Specialists" */}
            🏷️ [Service Category Tag]
          </div>

          {/* Main headline — keep exact existing copy */}
          <h1>
            {/* ▼ REPLACE: existing h1 text */}
            Service Name India<br />
            <span className="blue">Service Value Proposition</span>
          </h1>

          {/* Sub-headline — keep exact existing copy */}
          <h2 className="sub">
            {/* ▼ REPLACE: existing subtitle */}
            Subheadline that reinforces the main promise
          </h2>

          {/* Lead paragraph — keep exact existing copy */}
          <p className="lead">
            {/* ▼ REPLACE: existing lead paragraph */}
            Your existing introductory paragraph goes here. Keep all content
            exactly as written. Only the wrapper HTML changes.{' '}
            <strong>Bold terms stay bold.</strong>
          </p>

          {/* CTA buttons — KEEP EXACT EXISTING HREFS */}
          <div className="phero-ctas">
            {/* Primary CTA: blue button */}
            <a href="/contact/" aria-label="[Keep existing aria-label]" className="btn-primary">
              {/* ▼ REPLACE: existing CTA text */}
              🚀 Get Your Free [Service] Audit <Arrow />
            </a>
            {/* Secondary CTA: ghost/outline button */}
            <a href="tel:+918094888157" aria-label="[Keep existing aria-label]" className="btn-outline">
              📞 Call +91 8094888157
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN: stat card ── */}
        {/* This is a visual card showing service-specific stats/preview */}
        <div className="phero-card">
          <div className="phero-card-head">
            {/* ▼ REPLACE: Relevant "live data" label for this service */}
            <span className="phero-card-title">service-preview.live</span>
            <span className="phero-card-live">
              <span className="live-dot" />LIVE
            </span>
          </div>

          {/* ▼ REPLACE: Card body content — use .phero-card-body for padding */}
          {/* For eCommerce: product rankings, for link building: backlink stats, etc. */}
          {/* Reference: local-seo uses map-box with India city pins */}
          {/* Reference: keyword pages use keyword data preview */}
          <div className="phero-card-body" style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-5)', fontSize: '0.85rem' }}>
            Service-specific preview card content
          </div>

          {/* Footer stats strip — 3 key metrics */}
          {/* CSS: .map-card-foot / .pcf-cell / .pcf-num / .pcf-label */}
          <div className="map-card-foot">
            <div className="pcf-cell">
              <div className="pcf-num">{/* ▼ e.g. "5x" */}0x</div>
              <div className="pcf-label">{/* ▼ e.g. "ROI Avg" */}Metric 1</div>
            </div>
            <div className="pcf-cell">
              <div className="pcf-num">{/* ▼ e.g. "280%" */}0%</div>
              <div className="pcf-label">{/* ▼ e.g. "Traffic Lift" */}Metric 2</div>
            </div>
            <div className="pcf-cell">
              <div className="pcf-num">{/* ▼ e.g. "90d" */}90d</div>
              <div className="pcf-label">Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 3 — WHY THIS SERVICE MATTERS (Stats Grid)
// ══════════════════════════════════════════════════════════════════════════
// Light gray background section. Lead paragraph + 4-stat grid + bottom callout.
// CSS: .section .why-section / .why-lede / .stat-grid / .stat-cell-big
//      .stat-num / .stat-text / .why-bottom / .wbl / .wbt
// KEEP: all stats, percentages, supporting copy exactly as written
// ──────────────────────────────────────────────────────────────────────────
const STATS = [
  // ▼ REPLACE: Keep your existing 4 stats. Format: { num, text (JSX), label }
  { num: '00%', text: <><strong>Stat 1 bold text</strong> supporting description</>, label: '01 / Label' },
  { num: '00%', text: <><strong>Stat 2 bold text</strong> supporting description</>, label: '02 / Label' },
  { num: '00%', text: <><strong>Stat 3 bold text</strong> supporting description</>, label: '03 / Label' },
  { num: '00%', text: <><strong>Stat 4 bold text</strong> supporting description</>, label: '04 / Label' },
]

function WhySection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section why-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          {/* ▼ REPLACE: eyebrow label e.g. "The eCommerce Opportunity" */}
          <div className="eyebrow">The Opportunity</div>
          {/* ▼ REPLACE: h2 with exact existing text */}
          <h2 className="s-title">Why [Service] is Critical for <span className="blue">Your Business</span></h2>
        </div>

        {/* ▼ REPLACE: existing lead paragraph */}
        <p className="why-lede">
          Your existing lead paragraph with <strong>bold key stats</strong> highlighted.
          Keep all existing supporting evidence and claims exactly as written.
        </p>

        {/* ▼ REPLACE: label above the stat grid */}
        <div className="why-substat-label">The [Service] Reality</div>

        <div className="stat-grid">
          {STATS.map((s, i) => (
            <div className="stat-cell-big" key={i}>
              <span className="stat-badge">{s.label}</span>
              <div className="stat-num">{s.num}</div>
              <p className="stat-text">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom callout strip — dark bar with key takeaway */}
        <div className="why-bottom">
          <span className="wbl">→ The bottom line</span>
          {/* ▼ REPLACE: existing bottom-line copy */}
          <span className="wbt">Your existing bottom-line summary sentence goes here.</span>
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 4 — SERVICES GRID (Dark Background)
// ══════════════════════════════════════════════════════════════════════════
// Dark (ink) background. 3-column grid of service cards.
// CSS: .section .svc-section / .svc-grid / .svc-card / .svc-num
//      .svc-icon-box / h3.svc-card-title / .svc-intro / .svc-list
//      .svc-li / .svc-out / .svc-cta
// KEEP: all service names, bullet points, outcome statements exactly as written
// ──────────────────────────────────────────────────────────────────────────

// Service icon SVGs — add/remove to match your services
const SvcIcon = ({ name }: { name: string }) => {
  const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  // ▼ ADD icon cases to match your specific services
  if (name === 'search') return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
  if (name === 'link') return <svg {...p}><path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" /><path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" /></svg>
  if (name === 'chart') return <svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  if (name === 'star') return <svg {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
  if (name === 'page') return <svg {...p}><rect x="4" y="3" width="16" height="18" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
  if (name === 'shield') return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  return null
}

// ▼ REPLACE: your actual services data — keep all existing content
const SERVICES = [
  {
    icon: 'search',  // matches SvcIcon case above
    title: 'Service One Name',
    intro: 'Brief intro sentence about what this service does:',
    items: [
      'Keep exact existing bullet point text',
      'Second bullet point',
      'Third bullet point',
      'Fourth bullet point',
      'Fifth bullet point',
    ],
    out: 'Keep exact existing outcome statement — the "so you can..." or "which means..." sentence.',
  },
  {
    icon: 'link',
    title: 'Service Two Name',
    intro: 'Brief intro for service two:',
    items: ['Bullet 1', 'Bullet 2', 'Bullet 3', 'Bullet 4'],
    out: 'Outcome statement for service two.',
  },
  {
    icon: 'chart',
    title: 'Service Three Name',
    intro: 'Brief intro for service three:',
    items: ['Bullet 1', 'Bullet 2', 'Bullet 3', 'Bullet 4'],
    out: 'Outcome statement for service three.',
  },
  // Add more services as needed — grid is 3-column, wraps naturally
]

function ServiceCard({ s, i }: { s: typeof SERVICES[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`svc-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="svc-num">SERVICE / {String(i + 1).padStart(2, '0')}</div>
      <div className="svc-icon-box"><SvcIcon name={s.icon} /></div>
      <h3 className="svc-card-title">{s.title}</h3>
      <p className="svc-intro">{s.intro}</p>
      <ul className="svc-list">
        {s.items.map(it => <li className="svc-li" key={it}><strong>{it}</strong></li>)}
      </ul>
      <p className="svc-out">{s.out}</p>
    </div>
  )
}

function ServicesGrid() {
  const { ref, vis } = useReveal()
  return (
    <section className="section svc-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          {/* Light variants for dark background */}
          <div className="eyebrow light">What We Do</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title light">Our Comprehensive <span className="blue">[Service] Services</span></h2>
          {/* ▼ REPLACE: existing subtitle */}
          <p className="s-sub light">Existing subtitle copy for the services section.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => <ServiceCard key={s.title} s={s} i={i} />)}
        </div>
        {/* Single CTA below the grid */}
        <div className="svc-cta">
          <a href="/contact/" aria-label="[Keep existing aria-label]" className="btn-primary">
            {/* ▼ REPLACE: existing CTA text */}
            Get Started with [Service] Today <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 5 — PROCESS (How We Work)
// ══════════════════════════════════════════════════════════════════════════
// Light gray background. 4-column horizontal process grid.
// CSS: .section .process-section / .process-grid / .process-step
//      .num-block / .process-num / .num-side / .process-phase
//      .process-week / .plist / .process-connector
// KEEP: all phase names, timelines, bullet points exactly as written
// ──────────────────────────────────────────────────────────────────────────
const PHASES = [
  // ▼ REPLACE: your actual process phases — keep exact existing content
  {
    num: '01', phase: 'Phase 1', week: 'Week 1–2', title: 'Phase One Name',
    items: ['Keep existing bullet 1', 'Keep existing bullet 2', 'Keep existing bullet 3', 'Bullet 4', 'Bullet 5'],
  },
  {
    num: '02', phase: 'Phase 2', week: 'Week 3–6', title: 'Phase Two Name',
    items: ['Keep existing bullet 1', 'Keep existing bullet 2', 'Keep existing bullet 3', 'Bullet 4'],
  },
  {
    num: '03', phase: 'Phase 3', week: 'Week 7–12', title: 'Phase Three Name',
    items: ['Keep existing bullet 1', 'Keep existing bullet 2', 'Keep existing bullet 3', 'Bullet 4'],
  },
  {
    num: '04', phase: 'Phase 4', week: 'Ongoing', title: 'Optimization & Growth',
    items: ['Keep existing bullet 1', 'Keep existing bullet 2', 'Keep existing bullet 3', 'Bullet 4'],
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
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">Our Proven [Service] Process <span className="blue">at SEOShouts</span></h2>
          {/* ▼ REPLACE: existing subtitle */}
          <p className="s-sub">Existing subtitle describing the systematic approach.</p>
        </div>
        {/* White card wrapping the process grid */}
        <div className="process-grid" style={{ background: '#fff' }}>
          {PHASES.map((p, i) => <ProcessStep key={p.num} p={p} i={i} last={i === PHASES.length - 1} />)}
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 6 — CASE STUDIES (Success Stories)
// ══════════════════════════════════════════════════════════════════════════
// White background. 3-column bordered card grid.
// CSS: .cases-section / .cases-grid / .case-card / .case-head
//      .case-emoji / .case-h-text / .case-body / .case-challenge
//      .case-results / .case-foot
// KEEP: all case study names, results, percentages exactly as written
// ──────────────────────────────────────────────────────────────────────────
const CASES = [
  // ▼ REPLACE: your actual case studies — keep exact existing content
  {
    emoji: '🏢',
    name: 'Case Study One Name',
    cat: 'Industry · Category',
    challenge: 'Keep exact existing challenge description for this case.',
    results: [
      // Format: [bold part, regular part]
      ['Key metric 1', ' — supporting detail'],
      ['Key metric 2', ' — supporting detail'],
      ['Key metric 3', ' — supporting detail'],
      ['Key metric 4', ' — supporting detail'],
    ],
  },
  {
    emoji: '🎯',
    name: 'Case Study Two Name',
    cat: 'Industry · Category',
    challenge: 'Keep exact existing challenge description for this case.',
    results: [
      ['Key metric 1', ' — supporting detail'],
      ['Key metric 2', ' — supporting detail'],
      ['Key metric 3', ' — supporting detail'],
    ],
  },
  {
    emoji: '📈',
    name: 'Case Study Three Name',
    cat: 'Industry · Category',
    challenge: 'Keep exact existing challenge description for this case.',
    results: [
      ['Key metric 1', ' — supporting detail'],
      ['Key metric 2', ' — supporting detail'],
      ['Key metric 3', ' — supporting detail'],
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
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">Success Stories:<br />Real Results from <span className="blue">Our Clients</span></h2>
          {/* ▼ REPLACE: existing subtitle */}
          <p className="s-sub">See how we&apos;ve helped businesses achieve their goals.</p>
        </div>
        <div className="cases-grid">
          {CASES.map((c, i) => <CaseCard key={c.name} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 7 — WHY CHOOSE US
// ══════════════════════════════════════════════════════════════════════════
// Light gray background. 3-column card grid (2 rows = 6 cards).
// CSS: .choose-section / .choose-grid / .choose-card / .choose-icon
// The choose-icon shows a 2-letter monogram badge (not emoji).
// KEEP: all card titles and body copy exactly as written
// ──────────────────────────────────────────────────────────────────────────
const CHOOSE = [
  // ▼ REPLACE: keep exact existing content. mark = 2-letter badge shown in blue square
  { mark: 'EX', title: 'Deep Industry Expertise', body: <p>Keep <strong>exact existing copy</strong> for this card.</p> },
  { mark: 'TR', title: 'Proven Track Record', body: <p>Keep <strong>exact existing copy</strong> for this card.</p> },
  { mark: 'RS', title: 'Results-Focused Approach', body: <p>Keep <strong>exact existing copy</strong> for this card.</p> },
  { mark: 'ST', title: 'Custom Strategy', body: <p>Keep <strong>exact existing copy</strong> for this card.</p> },
  { mark: 'TP', title: 'Transparent Reporting', body: <p>Keep <strong>exact existing copy</strong> for this card.</p> },
  { mark: 'FS', title: 'Full-Service Solution', body: <p>Keep <strong>exact existing copy</strong> for this card.</p> },
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
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">Why Choose<br />SEOShouts for <span className="blue">[Service] Services</span></h2>
          {/* ▼ REPLACE: existing subtitle */}
          <p className="s-sub">Your trusted partner for [service] success.</p>
        </div>
        <div className="choose-grid">
          {CHOOSE.map((c, i) => <ChooseCard key={c.title} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 8 — GUARANTEE
// ══════════════════════════════════════════════════════════════════════════
// Dark (ink) background with animated grid pattern (CSS ::before pseudo).
// Single centered card with guarantee stamp, heading, promise grid.
// CSS: .guarantee-section / .guarantee-card / .guarantee-stamp
//      .gtext / .guarantee-sub-label / .guarantee-promise
// KEEP: all promise bullets, guarantee terms exactly as written
// ──────────────────────────────────────────────────────────────────────────
function GuaranteeSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section guarantee-section">
      <div className="section-container">
        <div ref={ref} className={`guarantee-card reveal${vis ? ' visible' : ''}`}>
          {/* Corner stamp — adjust text as needed */}
          <div className="guarantee-stamp">90-Day Guarantee</div>

          {/* ▼ REPLACE: existing h2 */}
          <h2>Our [Service] Guarantee at SEOShouts</h2>
          {/* ▼ REPLACE: existing h3 */}
          <h3>90-Day Performance Guarantee</h3>

          {/* ▼ REPLACE: existing guarantee description paragraph */}
          <p className="gtext">
            Keep exact existing guarantee description paragraph here.
          </p>

          <div className="guarantee-sub-label">What We Promise</div>

          {/* Two-column promise list */}
          <div className="guarantee-promise">
            <ul>
              {/* ▼ REPLACE: existing left-column promise bullets */}
              <li>Keep existing promise bullet 1</li>
              <li>Keep existing promise bullet 2</li>
              <li>Keep existing promise bullet 3</li>
            </ul>
            <ul>
              {/* ▼ REPLACE: existing right-column promise bullets */}
              <li>Keep existing promise bullet 4</li>
              <li>Keep existing promise bullet 5</li>
            </ul>
          </div>

          <a href="/contact/" aria-label="[Keep existing aria-label]" className="btn-primary">
            {/* ▼ REPLACE: existing CTA text */}
            Claim Your 90-Day Guarantee Today <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 9 — FAQ
// ══════════════════════════════════════════════════════════════════════════
// White background. Native <details>/<summary> accordion — NO useState needed.
// CSS: .section .faq-section / .faq-list / .faq-item / .faq-answer
//      (shared with ILC tool FAQ — same classes, same visual pattern)
// KEEP: all question and answer text exactly as written
// ──────────────────────────────────────────────────────────────────────────
const FAQS = [
  // ▼ REPLACE: keep exact existing FAQ questions and answers
  { q: 'FAQ question one?', a: 'Complete answer text for question one. Keep all supporting detail.' },
  { q: 'FAQ question two?', a: 'Complete answer text for question two.' },
  { q: 'FAQ question three?', a: 'Complete answer text for question three.' },
  { q: 'FAQ question four?', a: 'Complete answer text for question four.' },
  { q: 'FAQ question five?', a: 'Complete answer text for question five.' },
  { q: 'FAQ question six?', a: 'Complete answer text for question six.' },
  { q: 'FAQ question seven?', a: 'Complete answer text for question seven.' },
]

function FAQSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section faq-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">FAQ</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          {/* ▼ REPLACE: existing subtitle */}
          <p className="s-sub">Common questions about our [service] services.</p>
        </div>
        {/* faq-list adds border: 1px solid var(--line) around the whole list */}
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


// ══════════════════════════════════════════════════════════════════════════
// SECTION 10 — FINAL CTA
// ══════════════════════════════════════════════════════════════════════════
// Dark (ink) background with animated grid pattern (CSS ::before pseudo).
// 4-channel grid (phone, email, audit, consultation) + action buttons.
// CSS: .cta-section-svc / .cta-svc-inner / .cta-start-label / .cta-channels
//      .cta-channel / .cta-channel-icon / .cta-actions / .cta-foot / .cta-served
// KEEP: all contact details, phone numbers, email, copy exactly as written
// ──────────────────────────────────────────────────────────────────────────
function CTASection() {
  const { ref, vis } = useReveal()
  return (
    <section className="cta-section-svc">
      <div className="cta-svc-inner">
        <div ref={ref} className={`reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">Take the Next Step</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title light" style={{ maxWidth: 880, marginBottom: '1.25rem' }}>
            Ready to Grow with <span style={{ color: 'var(--blue)' }}>[Service] in India?</span>
          </h2>
          {/* ▼ REPLACE: existing CTA section paragraph */}
          <p className="s-sub light" style={{ marginBottom: '3rem' }}>
            Keep exact existing paragraph copy here.{' '}
            <strong style={{ color: '#fff' }}>SEOShouts&apos; [service] experts</strong> are ready.
          </p>
        </div>

        <div className="cta-start-label">→ Get Started Today</div>

        {/* 4-channel contact grid */}
        <div className="cta-channels">
          <div className="cta-channel">
            <div className="cta-channel-icon">🎯</div>
            <div>
              <h4>Get Your Free [Service] Audit</h4>
              {/* ▼ REPLACE: existing description */}
              <p>Keep existing channel description.</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📞</div>
            <div>
              {/* ▼ KEEP EXACT: phone number */}
              <h4>Call: +91 8094888157</h4>
              <p>Speak directly with our [service] team in Udaipur, Rajasthan</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📧</div>
            <div>
              {/* ▼ KEEP EXACT: email */}
              <h4>Email: seoshouts@gmail.com</h4>
              {/* ▼ REPLACE: existing description */}
              <p>Keep existing channel description.</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">💬</div>
            <div>
              <h4>Schedule a Strategy Consultation</h4>
              {/* ▼ REPLACE: existing description */}
              <p>Keep existing channel description.</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="cta-actions">
          <a href="/contact/" aria-label="[Keep existing aria-label]" className="btn-primary">
            {/* ▼ REPLACE: existing CTA text */}
            🎯 Get Your Free [Service] Audit <Arrow />
          </a>
          <a href="tel:+918094888157" aria-label="[Keep existing aria-label]" className="btn-outline">
            📞 Call +91 8094888157
          </a>
        </div>

        {/* Footer copy */}
        <div className="cta-foot">
          {/* ▼ REPLACE: existing location/service line */}
          <p className="cta-served"><strong>Serving businesses across India from our Udaipur, Rajasthan headquarters</strong></p>
          {/* ▼ REPLACE: existing closing paragraph */}
          <p>
            <strong>Still have questions?</strong> Keep exact existing closing paragraph here.
          </p>
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT — Page Content Component
// ══════════════════════════════════════════════════════════════════════════
// This is the 'use client' component imported by page.tsx
// page.tsx stays as the server component with metadata + JSON-LD schemas.
// ──────────────────────────────────────────────────────────────────────────
export default function ServicePageContent() {
  return (
    <>
      <Crumbs />
      <PageHero />
      <WhySection />
      <ServicesGrid />
      <ProcessSection />
      <CasesSection />
      <ChooseSection />
      <GuaranteeSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
