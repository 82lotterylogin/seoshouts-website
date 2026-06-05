'use client'

import { useState, useEffect, useRef } from 'react'
import ShapeGrid from '../../components/ShapeGrid'
import HeroQuoteForm from '../../components/HeroQuoteForm'
import CoreWebVitalsQuickCheck from './CoreWebVitalsQuickCheck'
import CoreWebVitalsScore from './CoreWebVitalsScore'
import SeoChecklist from './SeoChecklist'
import PricingPackagesIndia from './PricingPackagesIndia'
import AdvancedFeaturesSection from './AdvancedFeaturesSection'
import FaqSection from './FaqSection'

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

// ─── Process Phases ───────────────────────────────────────────────────────────

const WD_PROCESS_PHASES = [
  {
    num: '01', week: 'Weeks 1–2', timing: 'Research & Planning',
    title: 'Strategic Foundation',
    subtitle: 'Built on Years of Experience',
    desc: 'Our <strong>seo development company</strong> approach begins with comprehensive research:',
    items: [
      { text: '<strong>Comprehensive competitor analysis</strong> using advanced SEO tools' },
      { text: '<strong>Local keyword research</strong> incorporating Hindi/vernacular trends' },
      { text: '<strong>Site architecture planning</strong> using proven principles' },
    ],
  },
  {
    num: '02', week: 'Weeks 2–4', timing: 'Build & Implement',
    title: 'Expert Development',
    subtitle: 'Implementation',
    desc: 'Where our <strong>seo website developer</strong> expertise converges:',
    items: [
      { text: '<strong>Standards-compliant coding</strong> with SEO considerations' },
      { text: '<strong>Custom database design</strong> optimised for speed' },
      { text: '<strong>Mobile-first responsive design</strong> tested across devices' },
    ],
  },
  {
    num: '03', week: 'Week 4–5', timing: 'Content & On-Page',
    title: 'Content & SEO Integration',
    subtitle: 'Expertise Applied',
    desc: 'Our <strong>web dev seo</strong> specialists ensure ranking success:',
    items: [
      { text: '<strong>SEO-optimised content creation</strong> using proven methodologies' },
      { text: '<strong>Meta tag optimisation</strong> based on CTR patterns' },
      { text: '<strong>Local SEO implementation</strong> with &quot;near me&quot; strategies' },
    ],
  },
  {
    num: '04', week: 'Week 5–6', timing: 'Testing & Review',
    title: 'Quality Assurance',
    subtitle: 'Testing Protocols',
    desc: 'Rigorous testing ensures flawless <strong>seo friendly web development</strong>:',
    items: [
      { text: '<strong>Cross-device compatibility</strong> testing across Indian devices' },
      { text: '<strong>Core Web Vitals optimisation</strong> using proven techniques' },
      { text: '<strong>Security vulnerability scanning</strong> and compliance checks' },
    ],
  },
  {
    num: '05', week: 'Ongoing', timing: 'Launch & Growth',
    title: 'Launch & Optimisation',
    subtitle: 'Lifetime SEO Partnership',
    desc: 'Your <strong>website development and seo</strong> journey continues:',
    items: [
      { text: '<strong>Strategic launch monitoring</strong> with expert protocols' },
      { text: '<strong>Performance tracking setup</strong> with metrics that matter' },
      { text: '<strong>Continuous optimisation</strong> adapted to Google updates' },
    ],
  },
]

// ─── Process section ──────────────────────────────────────────────────────────

function WdProcessSection() {
  const { ref, vis } = useReveal()
  const [active, setActive] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  function selectPhase(i: number) {
    if (i === active) return
    setActive(i)
    setPanelKey(k => k + 1)
  }

  const gridCols = WD_PROCESS_PHASES.map((_, i) => (i === active ? '1fr' : '72px')).join(' ')

  return (
    <section className="section process-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Our Process</div>
          <h2 className="s-title">Our Proven SEO Website Development Process <span className="blue">Refined Over the Years</span></h2>
          <p className="s-sub">A transparent, step-by-step process that puts your business goals first</p>
        </div>

        <div className="wd-pslab-track" style={{ gridTemplateColumns: gridCols }}>
          {WD_PROCESS_PHASES.map((p, i) => (
            <div
              key={p.num}
              className={`wd-pslab-slab${active === i ? ' wd-pslab-on' : ''}`}
              onClick={() => selectPhase(i)}
              role="button"
              tabIndex={active === i ? -1 : 0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPhase(i) } }}
              aria-expanded={active === i}
              aria-label={active === i ? undefined : `Open ${p.week}: ${p.title}`}
            >
              <div className="wd-pslab-stripe" />
              <div className="wd-pslab-fold">
                <span className="wd-pslab-fold-num">{p.num}</span>
                <div className="wd-pslab-fold-line" aria-hidden="true" />
                <span className="wd-pslab-fold-tag">{p.week}</span>
                <span className="wd-pslab-fold-time">{p.timing}</span>
              </div>
              <div className="wd-pslab-open">
                <div key={panelKey} className="wd-pslab-open-anim">
                  <div className="wd-pslab-hd">
                    <div className="wd-pslab-hd-ghost" aria-hidden="true">{p.num}</div>
                    <div>
                      <div className="wd-pslab-hd-chips">
                        <span className="wd-pslab-hd-chip">{p.week}</span>
                        <span className="wd-pslab-hd-time">{p.timing}</span>
                      </div>
                      <h3 className="wd-pslab-hd-title">{p.title}</h3>
                      <div className="wd-pslab-hd-sub">{p.subtitle}</div>
                    </div>
                  </div>
                  <p className="wd-pslab-desc" dangerouslySetInnerHTML={{ __html: p.desc }} />
                  <ul className="wd-pslab-sec-ul">
                    {p.items.map(item => (
                      <li key={item.text}>
                        <span dangerouslySetInnerHTML={{ __html: item.text }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wd-pslab-nav" role="tablist" aria-label="Process phases navigation">
          {WD_PROCESS_PHASES.map((p, i) => (
            <button
              key={p.num}
              role="tab"
              aria-selected={active === i}
              className={`wd-pslab-nav-dot${active === i ? ' wd-pslab-nav-on' : ''}`}
              onClick={() => selectPhase(i)}
              aria-label={p.week}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SeoWebDevPageContent({ blogPosts }: { blogPosts: any[] }) {
  const heroReveal = useReveal()
  const whatIsReveal = useReveal()
  const setsApartReveal = useReveal()
  const pricingReveal = useReveal()
  const teamReveal = useReveal()
  const storiesReveal = useReveal()
  const compReveal = useReveal()
  const whyReveal = useReveal()
  const advReveal = useReveal()
  const blogReveal = useReveal()
  const ctaReveal = useReveal()

  return (
    <>
      <style>{`
        /* ─── Hero ─────────────────────────────────────────── */
        .wd-hero-body { font-size: 0.95rem; color: rgba(255,255,255,0.68); line-height: 1.75; margin-bottom: 0.875rem; }
        .wd-hero-body strong { color: #fff; font-weight: 600; }
        .wd-btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: 1rem; font-weight: 700; padding: 14px 28px; transition: background 0.2s; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .wd-btn-ghost:hover { background: rgba(255,255,255,0.09); }
        .wd-hero-trust { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.09); padding: 8px 18px; font-size: 0.78rem; color: rgba(255,255,255,0.52); margin-top: 1rem; }
        .wd-hero-trust svg { color: var(--blue); flex-shrink: 0; }

        /* ─── What Is: prose lede ──────────────────────────── */
        .wd-what-is-body { max-width: 780px; }
        .wd-what-is-body p { font-size: 1rem; color: var(--ink-2); line-height: 1.75; margin-bottom: 1.25rem; }
        .wd-what-is-body p:last-child { margin-bottom: 0; }
        .wd-what-is-body strong { color: var(--ink); font-weight: 600; }

        /* ─── Compare table (What Sets Apart) ───────────────── */
        .wd-cmp { margin-top: 1.75rem; border: 1px solid var(--line); }
        .wd-cmp-hd { display: grid; grid-template-columns: 1fr 44px 1fr; background: var(--ink); }
        .wd-cmp-hd-cell { padding: 0.7rem 1.25rem; font-size: 0.63rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
        .wd-cmp-hd-bad  { color: #f87171; }
        .wd-cmp-hd-mid  { border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08); }
        .wd-cmp-hd-good { color: #60a5fa; }
        .wd-cmp-row { display: grid; grid-template-columns: 1fr 44px 1fr; border-top: 1px solid var(--line); transition: background 0.15s; }
        .wd-cmp-prob { padding: 0.9rem 1.25rem; background: #fff; border-left: 3px solid var(--red); font-size: 0.875rem; line-height: 1.6; color: var(--ink-2); transition: background 0.15s; }
        .wd-cmp-row:hover .wd-cmp-prob { background: #fff5f5; }
        .wd-cmp-prob strong { color: var(--ink); font-weight: 600; }
        .wd-cmp-mid { display: flex; align-items: center; justify-content: center; background: var(--gray-1); border-left: 1px solid var(--line); border-right: 1px solid var(--line); color: var(--blue); flex-shrink: 0; }
        .wd-cmp-sol { padding: 0.9rem 1.25rem; background: #fff; font-size: 0.875rem; line-height: 1.6; color: var(--ink-2); border-right: 3px solid var(--blue); transition: background 0.15s; }
        .wd-cmp-row:hover .wd-cmp-sol { background: #f0f6ff; }
        .wd-cmp-sol strong { color: var(--ink); font-weight: 600; }
        @media (max-width: 700px) {
          .wd-cmp-hd { grid-template-columns: 1fr 1fr; }
          .wd-cmp-hd-mid { display: none; }
          .wd-cmp-row { grid-template-columns: 1fr; }
          .wd-cmp-mid { display: none; }
          .wd-cmp-prob { border-left: 3px solid var(--red); border-right: none; border-bottom: 1px solid var(--line); }
          .wd-cmp-sol  { border-right: none; border-left: 3px solid var(--blue); }
        }

        /* ─── Stats bar ─────────────────────────────────────── */
        .wd-stats-bar { display: grid; grid-template-columns: repeat(4,1fr); margin-top: 2.5rem; background: var(--blue); }
        .wd-stats-bar-cell { padding: 1.75rem 1.25rem; border-right: 1px solid rgba(255,255,255,0.12); text-align: center; }
        .wd-stats-bar-cell:last-child { border-right: none; }
        .wd-stats-bar-val { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; line-height: 1.1; }
        .wd-stats-bar-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: rgba(255,255,255,0.68); margin-top: 0.5rem; display: block; }
        @media (max-width: 640px) { .wd-stats-bar { grid-template-columns: repeat(2,1fr); } }

        /* ─── Team ─────────────────────────────────────────── */
        .wd-team-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center; }
        .wd-team-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .wd-team-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09); overflow: hidden; }
        .wd-team-card-img { overflow: hidden; }
        .wd-team-card-img img { width: 100%; height: auto; display: block; transition: transform 0.35s; }
        .wd-team-card:hover .wd-team-card-img img { transform: scale(1.05); }
        .wd-team-card-info { padding: 1.25rem; text-align: center; }
        .wd-team-card-name { font-size: 1rem; font-weight: 700; color: #fff; }
        .wd-team-card-role { font-size: 0.78rem; color: var(--blue-light); font-weight: 500; margin-top: 0.25rem; line-height: 1.4; }
        @media (max-width: 900px) { .wd-team-grid { grid-template-columns: 1fr; gap: 2rem; } }

        /* ─── Process pslab ─────────────────────────────────── */
        @keyframes wd-pslabIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
        .wd-pslab-track { display: grid; height: 360px; border: 1px solid rgba(0,0,0,0.13); transition: grid-template-columns 0.48s cubic-bezier(0.4,0,0.2,1); }
        .wd-pslab-slab { position: relative; overflow: hidden; cursor: pointer; border-right: 1px solid rgba(0,0,0,0.1); background: var(--ink); display: flex; flex-direction: column; transition: background 0.25s; }
        .wd-pslab-slab:last-child { border-right: none; }
        .wd-pslab-slab:hover:not(.wd-pslab-on) { background: rgba(14,18,24,0.82); }
        .wd-pslab-slab.wd-pslab-on { cursor: default; background: #fff; }
        .wd-pslab-stripe { height: 3px; flex-shrink: 0; background: rgba(255,255,255,0.06); transition: background 0.3s; }
        .wd-pslab-slab.wd-pslab-on .wd-pslab-stripe { background: var(--blue); }
        .wd-pslab-fold { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 22px 0 20px; gap: 10px; }
        .wd-pslab-slab.wd-pslab-on .wd-pslab-fold { display: none; }
        .wd-pslab-fold-num { font-size: 1.5rem; font-weight: 900; line-height: 1; letter-spacing: -0.04em; color: rgba(255,255,255,0.65); transition: color 0.2s; }
        .wd-pslab-slab:hover:not(.wd-pslab-on) .wd-pslab-fold-num { color: rgba(255,255,255,0.9); }
        .wd-pslab-fold-line { width: 1px; flex: 1; background: rgba(255,255,255,0.12); }
        .wd-pslab-fold-tag { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.58); white-space: nowrap; transition: color 0.2s; line-height: 1; }
        .wd-pslab-slab:hover:not(.wd-pslab-on) .wd-pslab-fold-tag { color: rgba(255,255,255,0.85); }
        .wd-pslab-fold-time { font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.42); letter-spacing: 0.04em; writing-mode: vertical-rl; transform: rotate(180deg); transition: color 0.2s; }
        .wd-pslab-slab:hover:not(.wd-pslab-on) .wd-pslab-fold-time { color: rgba(255,255,255,0.66); }
        .wd-pslab-open { display: none; padding: 18px 26px 16px; flex: 1; overflow: hidden; flex-direction: column; }
        .wd-pslab-slab.wd-pslab-on .wd-pslab-open { display: flex; }
        .wd-pslab-open-anim { animation: wd-pslabIn 0.36s 0.22s cubic-bezier(0.2,0.6,0.4,1) both; display: flex; flex-direction: column; height: 100%; }
        .wd-pslab-hd { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.07); flex-shrink: 0; }
        .wd-pslab-hd-ghost { font-size: 2.8rem; font-weight: 900; line-height: 0.8; color: rgba(37,99,235,0.07); letter-spacing: -0.06em; flex-shrink: 0; user-select: none; pointer-events: none; }
        .wd-pslab-hd-chips { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
        .wd-pslab-hd-chip { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); background: rgba(37,99,235,0.08); padding: 3px 8px; border: 1px solid rgba(37,99,235,0.18); }
        .wd-pslab-hd-time { font-size: 0.875rem; color: rgba(0,0,0,0.28); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em; }
        .wd-pslab-hd-title { font-size: 1.04rem; font-weight: 700; color: var(--ink); line-height: 1.28; margin: 0 0 2px; }
        .wd-pslab-hd-sub { font-size: 0.78rem; font-weight: 600; color: var(--blue); margin-top: 2px; }
        .wd-pslab-desc { font-size: 0.875rem; color: #3a4a5c; line-height: 1.55; margin: 10px 0 12px; }
        .wd-pslab-desc strong { color: var(--ink); font-weight: 600; }
        .wd-pslab-sec-ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .wd-pslab-sec-ul li { font-size: 0.875rem; color: #3a4a5c; line-height: 1.5; display: flex; align-items: flex-start; gap: 10px; }
        .wd-pslab-sec-ul li::before { content: '→'; color: var(--blue); flex-shrink: 0; font-weight: 700; line-height: 1.5; font-size: 0.85rem; }
        .wd-pslab-sec-ul li strong { color: var(--ink); font-weight: 600; }
        .wd-pslab-nav { display: flex; justify-content: center; gap: 7px; margin-top: 14px; }
        .wd-pslab-nav-dot { width: 24px; height: 3px; padding: 0; border: none; cursor: pointer; background: rgba(0,0,0,0.1); transition: background 0.2s, width 0.25s; }
        .wd-pslab-nav-dot.wd-pslab-nav-on { background: var(--blue); width: 42px; }
        @media (max-width: 720px) {
          .wd-pslab-track { grid-template-columns: 1fr !important; height: auto; }
          .wd-pslab-slab { flex-direction: row; min-height: 52px; }
          .wd-pslab-slab.wd-pslab-on { flex-direction: column; }
          .wd-pslab-stripe { width: 4px; height: auto; flex-shrink: 0; }
          .wd-pslab-slab.wd-pslab-on .wd-pslab-stripe { width: 100%; height: 3px; }
          .wd-pslab-fold { flex-direction: row; padding: 0 14px; gap: 10px; }
          .wd-pslab-fold-tag, .wd-pslab-fold-time { writing-mode: horizontal-tb; transform: none; }
          .wd-pslab-fold-line { width: auto; height: 1px; flex: 1; }
          .wd-pslab-open { padding: 18px 16px; }

          .wd-pslab-hd-ghost { font-size: 2.2rem; }
          .wd-pslab-hd-title { font-size: 0.92rem; }
        }

        /* ─── Success Stories CWV cards ─────────────────────── */
        .wd-cwv-grid { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--line); }
        .wd-cwv-card { border-right: 1px solid var(--line); padding: 2rem; }
        .wd-cwv-card:last-child { border-right: none; }
        .wd-cwv-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .wd-cwv-icon { width: 48px; height: 48px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .wd-cwv-link { font-size: 0.75rem; font-weight: 700; color: var(--blue); text-decoration: none; letter-spacing: 0.04em; }
        .wd-cwv-link:hover { text-decoration: underline; }
        .wd-cwv-title { font-size: 1.3rem; font-weight: 700; color: var(--ink); margin-bottom: 0.625rem; }
        .wd-cwv-desc { font-size: 0.875rem; color: var(--gray-5); line-height: 1.6; margin-bottom: 1.25rem; }
        .wd-cwv-scores { background: var(--gray-1); border: 1px solid var(--line); padding: 1.25rem; }
        .wd-cwv-scores-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-5); margin-bottom: 0.875rem; }
        .wd-cwv-score-row { margin-bottom: 0.75rem; }
        .wd-cwv-score-row:last-child { margin-bottom: 0; }
        .wd-cwv-score-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
        .wd-cwv-score-device { font-size: 0.75rem; font-weight: 600; color: var(--ink-2); display: inline-flex; align-items: center; gap: 4px; }
        .wd-cwv-score-val { font-size: 1rem; font-weight: 800; color: #16a34a; font-family: 'Space Grotesk', sans-serif; }
        .wd-cwv-score-bar { height: 4px; background: var(--line); }
        .wd-cwv-score-fill { height: 100%; background: #16a34a; }
        @media (max-width: 900px) { .wd-cwv-grid { grid-template-columns: 1fr; } .wd-cwv-card { border-right: none; border-bottom: 1px solid var(--line); } .wd-cwv-card:last-child { border-bottom: none; } }

        /* ─── Comparison vs Agency (choose-grid cards) ────────── */
        .wd-comp-vs { display: flex; flex-direction: column; gap: 0.625rem; margin-top: 0.875rem; }
        .wd-comp-row { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.875rem; line-height: 1.55; color: var(--ink-2); }
        .wd-comp-mark-us   { color: var(--blue); font-weight: 700; flex-shrink: 0; font-size: 1rem; }
        .wd-comp-mark-them { color: var(--red);  font-weight: 700; flex-shrink: 0; font-size: 1rem; }
        .wd-comp-row strong { color: var(--ink); }

        /* ─── Why Choose guarantee grid ─────────────────────── */
        .wd-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-top: 2rem; }
        .wd-why-box-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 1.25rem; padding-bottom: 0.875rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .wd-why-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.875rem; }
        .wd-why-list li { display: flex; align-items: flex-start; gap: 0.875rem; font-size: 0.875rem; color: rgba(255,255,255,0.62); line-height: 1.6; }
        .wd-why-list li::before { content: ''; width: 4px; height: 4px; min-width: 4px; background: var(--blue); margin-top: 8px; flex-shrink: 0; }
        .wd-why-list strong { color: rgba(255,255,255,0.88); font-weight: 600; }
        @media (max-width: 640px) { .wd-why-grid { grid-template-columns: 1fr; } }

        /* ─── Custom dev advantages ──────────────────────────── */
        .wd-adv-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid rgba(255,255,255,0.08); margin-top: 2.5rem; }
        .wd-adv-card { padding: 2.5rem 2.25rem; border-right: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
        .wd-adv-card:last-child { border-right: none; }
        .wd-adv-card-head { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.75rem; }
        .wd-adv-icon { width: 44px; height: 44px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .wd-adv-card-title { font-size: 1.15rem; font-weight: 700; color: #fff; line-height: 1.3; }
        .wd-adv-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.875rem; }
        .wd-adv-list li { font-size: 0.875rem; color: rgba(255,255,255,0.62); line-height: 1.6; display: flex; align-items: flex-start; gap: 0.75rem; }
        .wd-adv-list li::before { content: '→'; color: var(--blue); flex-shrink: 0; font-weight: 700; line-height: 1.6; }
        .wd-adv-list strong { color: rgba(255,255,255,0.88); font-weight: 600; }
        @media (max-width: 640px) { .wd-adv-grid { grid-template-columns: 1fr; } .wd-adv-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); } .wd-adv-card:last-child { border-bottom: none; } }

        /* ─── Blog cards ─────────────────────────────────────── */
        .wd-blog-grid { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--line); }
        .wd-blog-card { border-right: 1px solid var(--line); overflow: hidden; display: flex; flex-direction: column; }
        .wd-blog-card:last-child { border-right: none; }
        .wd-blog-img { height: 180px; overflow: hidden; position: relative; background: var(--gray-1); }
        .wd-blog-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .wd-blog-card:hover .wd-blog-img img { transform: scale(1.04); }
        .wd-blog-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--gray-1); color: var(--blue); }
        .wd-blog-badge { position: absolute; top: 10px; right: 10px; background: var(--blue); color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 9px; }
        .wd-blog-body { padding: 1.5rem 1.5rem 1.25rem; flex: 1; display: flex; flex-direction: column; }
        .wd-blog-title { font-size: 1rem; font-weight: 700; color: var(--ink); line-height: 1.4; margin-bottom: 0.625rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .wd-blog-title a { color: inherit; text-decoration: none; }
        .wd-blog-title a:hover { color: var(--blue); }
        .wd-blog-excerpt { font-size: 0.825rem; color: var(--gray-5); line-height: 1.65; flex: 1; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .wd-blog-meta { display: flex; align-items: center; gap: 0.75rem; padding-top: 0.875rem; border-top: 1px solid var(--line); }
        .wd-blog-avatar { width: 28px; height: 28px; background: var(--blue); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .wd-blog-author-name { font-size: 0.75rem; font-weight: 600; color: var(--ink); }
        .wd-blog-date { font-size: 0.7rem; color: var(--gray-5); }
        .wd-blog-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.625rem; }
        .wd-blog-read-more { font-size: 0.78rem; font-weight: 700; color: var(--blue); text-decoration: none; letter-spacing: 0.04em; }
        .wd-blog-read-more:hover { text-decoration: underline; }
        @media (max-width: 900px) { .wd-blog-grid { grid-template-columns: 1fr; } .wd-blog-card { border-right: none; border-bottom: 1px solid var(--line); } .wd-blog-card:last-child { border-bottom: none; } }

        /* ─── Final CTA steps ────────────────────────────────── */
        .wd-cta-inner { max-width: 860px; margin: 0 auto; text-align: center; }
        .wd-cta-steps { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid rgba(255,255,255,0.08); margin: 2.5rem 0; }
        .wd-cta-step { padding: 2rem; border-right: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .wd-cta-step:nth-child(2n) { border-right: none; }
        .wd-cta-step:nth-last-child(-n+2) { border-bottom: none; }
        .wd-cta-step-row { display: flex; align-items: flex-start; gap: 1.25rem; text-align: left; }
        .wd-cta-step-num { width: 44px; height: 44px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800; color: #fff; font-family: 'Space Grotesk', sans-serif; flex-shrink: 0; }
        .wd-cta-step-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
        .wd-cta-step-desc { font-size: 0.875rem; color: rgba(255,255,255,0.58); line-height: 1.65; }
        .wd-cta-trust { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.75rem; margin-top: 2rem; }
        .wd-cta-trust-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: rgba(255,255,255,0.68); }
        .wd-cta-trust-item svg { color: var(--blue); flex-shrink: 0; }
        @media (max-width: 640px) {
          .wd-cta-steps { grid-template-columns: 1fr; }
          .wd-cta-step { border-right: none !important; }
          .wd-cta-step:nth-last-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,0.08); }
          .wd-cta-step:last-child { border-bottom: none !important; }
        }

        /* ─── Pricing note ───────────────────────────────────── */
        .wd-pricing-note { margin-top: 1.75rem; font-size: 0.875rem; color: var(--gray-5); text-align: center; }
        .wd-pricing-note strong { color: var(--ink); }
      `}</style>

      {/* ── Breadcrumbs ────────────────────────────────────────────────────── */}
      <div className="crumbs">
        <div className="crumbs-inner">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <a href="/services/">Services</a>
          <span className="sep">/</span>
          <span className="current">SEO Website Development</span>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="phero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 40%, transparent 20%, rgba(8,9,10,0.88) 100%)', pointerEvents: 'none' }} />
        <div className="phero-inner" style={{ position: 'relative' }}>
          <div>
            <div className="phero-tag">
              <span className="dot" />
              Expert Developer-Led Team
              <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />
              Over 13 Years of SEO Expertise in India
            </div>
            <h1>SEO Website Development Services India – Build Websites That Rank and Convert</h1>

            <p className="wd-hero-body">Are you frustrated by <strong>websites that look beautiful but never get found on Google India</strong>?</p>
            <p className="wd-hero-body">Looking for genuine <strong>SEO website development</strong> that delivers measurable results for your Indian business?</p>
            <p className="wd-hero-body">At SEOShouts, you don&apos;t just get a web developer—you work directly with an experienced SEO expert who brings <strong>over 13 years of proven SEO expertise</strong> specifically for Indian and global markets.</p>
            <p className="wd-hero-body">Unlike typical agencies that design first and worry about SEO later, our <strong>over a decade of hands-on SEO experience</strong> has taught us to build search optimisation into every line of code from Day 1.</p>
            <p className="wd-hero-body">We&apos;ve witnessed Google&apos;s evolution, weathered algorithm updates, and consistently delivered ranking websites that drive real business growth across India.</p>

            <div className="phero-ctas">
              <a href="#core-web-vitals-check" aria-label="Get a Free Performance Check" className="btn-primary">
                Get a Free Performance Check <Arrow />
              </a>
              <a href="#pricing" aria-label="View Pricing and Packages" className="wd-btn-ghost">
                View Pricing &amp; Packages
              </a>
            </div>

            <div className="wd-hero-trust">
              <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              All sites launch with &quot;Good&quot; Core Web Vitals &amp; full Google Search Console indexation
            </div>
          </div>

          {/* Right: quote request form */}
          <HeroQuoteForm />
        </div>
      </section>

      {/* ── What Is SEO Website Development ────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-container">
          <div ref={whatIsReveal.ref} className={`s-header reveal${whatIsReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow">The Foundation</div>
            <h2 className="s-title">What Is SEO Website Development?</h2>
          </div>
          <div className="wd-what-is-body">
            <p>SEO website development means creating a website that&apos;s built to rank — right from the code level.</p>
            <p>Instead of designing first and &quot;doing SEO later,&quot; we combine smart coding, content architecture, and search-intent mapping during development itself. Every page structure, heading tag, and line of code is optimized for speed, crawlability, and conversion.</p>
            <p>From Core Web Vitals and schema markup to mobile responsiveness and internal linking, our goal is simple: <strong>build a site that both Google and your visitors love.</strong></p>
            <p>Whether you&apos;re a startup or a scaling brand, SEO-first development ensures your site loads fast, indexes correctly, and drives leads organically — without endless ad spend.</p>
          </div>
        </div>
      </section>

      {/* ── Quick Core Web Vitals Check ────────────────────────────────────── */}
      <CoreWebVitalsQuickCheck />

      {/* ── What Sets Us Apart ─────────────────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-container">
          <div ref={setsApartReveal.ref} className={`s-header reveal${setsApartReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow">What Makes Us Different</div>
            <h2 className="s-title">What Sets Our SEO Website Development <span className="blue">Apart in India?</span></h2>
            <p className="s-sub">Over <strong>a decade of SEO practice</strong>, we&apos;ve analysed and rebuilt hundreds of Indian business websites. Most were held back by the same recurring issues—slow loading on Indian mobile networks, missing schema markup, poor URL structures, and content that doesn&apos;t match Indian search behaviour.</p>
          </div>

          <div className="wd-cmp">
            {/* Header row */}
            <div className="wd-cmp-hd">
              <div className="wd-cmp-hd-cell wd-cmp-hd-bad">✗ &nbsp;Common Problems</div>
              <div className="wd-cmp-hd-mid" />
              <div className="wd-cmp-hd-cell wd-cmp-hd-good">✓ &nbsp;SEOShouts Fix</div>
            </div>

            {[
              {
                problem: <>Sites taking <strong>12+ seconds</strong> to load on Jio/Airtel networks — <span style={{ color: 'var(--red)' }}>Google gives up after 3 seconds</span></>,
                solution: <><strong>Lightning-fast loading</strong> optimised specifically for Indian 4G/5G networks</>
              },
              {
                problem: <>Beautiful designs that <strong>Google&apos;s bots can&apos;t understand</strong> or crawl properly</>,
                solution: <><strong>Fully mobile-first design</strong> tested on popular Indian smartphone brands</>
              },
              {
                problem: <><strong>Zero local SEO</strong> optimisation for Indian cities and &quot;near me&quot; searches</>,
                solution: <><strong>Clean, SEO-ready URLs</strong> using Indian English and local search terms</>
              },
              {
                problem: <>Missing <strong>Core Web Vitals</strong> optimisation for Indian smartphone users</>,
                solution: <><strong>Complete technical SEO foundation</strong> built from over a decade of proven strategies</>
              },
              {
                problem: <>Content written for <strong>global audiences</strong>, not Indian search intent</>,
                solution: <><strong>Robust security, HTTPS</strong> implementation, and Indian privacy compliance</>
              },
            ].map((row, i) => (
              <div key={i} className="wd-cmp-row">
                <div className="wd-cmp-prob">{row.problem}</div>
                <div className="wd-cmp-mid">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <div className="wd-cmp-sol">{row.solution}</div>
              </div>
            ))}
          </div>

          <div className="wd-stats-bar">
            {[
              { val: '100+',    label: 'Websites Delivered' },
              { val: '98%',     label: 'Client Satisfaction' },
              { val: '90%',     label: 'Page 1 in 90 Days' },
              { val: '13+ Yrs', label: 'Industry Experience' },
            ].map(s => (
              <div key={s.label} className="wd-stats-bar-cell">
                <span className="wd-stats-bar-val">{s.val}</span>
                <span className="wd-stats-bar-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Web Vitals Score ──────────────────────────────────────────── */}
      <CoreWebVitalsScore />

      {/* ── Pricing ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="section cases-section" style={{ background: '#fff' }}>
        <div className="section-container">
          <div ref={pricingReveal.ref} className={`s-header center reveal${pricingReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow">Transparent Pricing</div>
            <h2 className="s-title" style={{ maxWidth: '100%' }}>Transparent Pricing That Reflects <span className="blue">True SEO Value</span></h2>
            <p className="s-sub" style={{ maxWidth: '560px', margin: '0.875rem auto 0' }}>Transparent pricing with expert SEO built into every package</p>
          </div>
          <PricingPackagesIndia />
          <p className="wd-pricing-note"><strong>Note:</strong> All prices are clearly mentioned with no hidden costs. Proper invoicing provided for your business records.</p>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────────────── */}
      <section className="section svc-section">
        <div className="section-container">
          <div ref={teamReveal.ref} className={`wd-team-grid reveal${teamReveal.vis ? ' visible' : ''}`}>
            <div>
              <div className="eyebrow light">Team</div>
              <h2 className="s-title light">Experts SEO developers who deliver results.</h2>
              <p className="s-sub light" style={{ marginTop: '0.875rem' }}>
                Meet the dedicated professionals behind your India SEO success. Our team combines technical expertise with deep market knowledge to build websites that rank and convert.
              </p>
            </div>
            <div className="wd-team-cards">
              <div className="wd-team-card">
                <div className="wd-team-card-img">
                  <img src="/images/team/rohit-sharma.jpg" alt="Rohit Sharma" />
                </div>
                <div className="wd-team-card-info">
                  <div className="wd-team-card-name">Rohit Sharma</div>
                  <div className="wd-team-card-role">SEO Developer, Strategist &amp; Founder</div>
                </div>
              </div>
              <div className="wd-team-card">
                <div className="wd-team-card-img">
                  <img src="/images/team/ajay-porwal.jpg" alt="Ajay Porwal" />
                </div>
                <div className="wd-team-card-info">
                  <div className="wd-team-card-name">Ajay Porwal</div>
                  <div className="wd-team-card-role">Digital Marketing Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Development Process ────────────────────────────────────────────── */}
      <WdProcessSection />

      {/* ── SEO Checklist ──────────────────────────────────────────────────── */}
      <SeoChecklist />

      {/* ── Success Stories ────────────────────────────────────────────────── */}
      <section className="section cases-section" style={{ background: '#fff' }}>
        <div className="section-container">
          <div ref={storiesReveal.ref} className={`s-header reveal${storiesReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow">Client Results</div>
            <h2 className="s-title">Indian Client Success Stories</h2>
            <p className="s-sub">Real results from real Indian businesses</p>
          </div>

          <div className="wd-cwv-grid">
            {/* AGP Nature Villa */}
            <div className="wd-cwv-card">
              <div className="wd-cwv-card-head">
                <div className="wd-cwv-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <a href="https://pagespeed.web.dev/analysis/https-agpnaturevilla-com/wn1w46uas0?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="wd-cwv-link">Check Score →</a>
              </div>
              <div className="wd-cwv-title">AGP Nature Villa</div>
              <p className="wd-cwv-desc">Successfully developed and optimized with proven SEO strategies for the Indian real estate market.</p>
              <div className="wd-cwv-scores">
                <div className="wd-cwv-scores-label">Core Web Vitals Score</div>
                <div className="wd-cwv-score-row">
                  <div className="wd-cwv-score-meta">
                    <span className="wd-cwv-score-device"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Mobile</span>
                    <span className="wd-cwv-score-val">86</span>
                  </div>
                  <div className="wd-cwv-score-bar"><div className="wd-cwv-score-fill" style={{ width: '86%' }} /></div>
                </div>
                <div className="wd-cwv-score-row">
                  <div className="wd-cwv-score-meta">
                    <span className="wd-cwv-score-device"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Desktop</span>
                    <span className="wd-cwv-score-val">96</span>
                  </div>
                  <div className="wd-cwv-score-bar"><div className="wd-cwv-score-fill" style={{ width: '96%' }} /></div>
                </div>
              </div>
            </div>

            {/* Calcshark */}
            <div className="wd-cwv-card">
              <div className="wd-cwv-card-head">
                <div className="wd-cwv-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                </div>
                <a href="https://pagespeed.web.dev/analysis/https-calcshark-com/spkdcuvhgh?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="wd-cwv-link">Check Score →</a>
              </div>
              <div className="wd-cwv-title">Calcshark</div>
              <p className="wd-cwv-desc">Built with enterprise-grade SEO architecture to dominate their industry niche in Indian markets.</p>
              <div className="wd-cwv-scores">
                <div className="wd-cwv-scores-label">Core Web Vitals Score</div>
                <div className="wd-cwv-score-row">
                  <div className="wd-cwv-score-meta">
                    <span className="wd-cwv-score-device"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Mobile</span>
                    <span className="wd-cwv-score-val">97</span>
                  </div>
                  <div className="wd-cwv-score-bar"><div className="wd-cwv-score-fill" style={{ width: '97%' }} /></div>
                </div>
                <div className="wd-cwv-score-row">
                  <div className="wd-cwv-score-meta">
                    <span className="wd-cwv-score-device"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Desktop</span>
                    <span className="wd-cwv-score-val">100</span>
                  </div>
                  <div className="wd-cwv-score-bar"><div className="wd-cwv-score-fill" style={{ width: '100%' }} /></div>
                </div>
              </div>
            </div>

            {/* SEOShouts */}
            <div className="wd-cwv-card">
              <div className="wd-cwv-card-head">
                <div className="wd-cwv-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <a href="https://pagespeed.web.dev/analysis/https-seoshouts-com-services-ecommerce-seo/0c2nuniv9k?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="wd-cwv-link">Check Score →</a>
              </div>
              <div className="wd-cwv-title">SEOShouts</div>
              <p className="wd-cwv-desc">Our own website showcases SEO expertise, ranking for competitive keywords across India.</p>
              <div className="wd-cwv-scores">
                <div className="wd-cwv-scores-label">Core Web Vitals Score</div>
                <div className="wd-cwv-score-row">
                  <div className="wd-cwv-score-meta">
                    <span className="wd-cwv-score-device"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Mobile</span>
                    <span className="wd-cwv-score-val">94</span>
                  </div>
                  <div className="wd-cwv-score-bar"><div className="wd-cwv-score-fill" style={{ width: '94%' }} /></div>
                </div>
                <div className="wd-cwv-score-row">
                  <div className="wd-cwv-score-meta">
                    <span className="wd-cwv-score-device"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Desktop</span>
                    <span className="wd-cwv-score-val">100</span>
                  </div>
                  <div className="wd-cwv-score-bar"><div className="wd-cwv-score-fill" style={{ width: '100%' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison: SEOShouts vs Agency ────────────────────────────────── */}
      <section className="section choose-section">
        <div className="section-container">
          <div ref={compReveal.ref} className={`s-header reveal${compReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow">Why Choose Us</div>
            <h2 className="s-title">SEOShouts vs. <span className="blue">Typical Agency</span></h2>
            <p className="s-sub">See why over 13 years of experience makes all the difference in SEO website development</p>
          </div>

          <div className="choose-grid">
            {[
              {
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
                title: 'SEO Experience',
                us:    '13+ years proven track record',
                them:  'Often 1-3 years, no portfolio',
              },
              {
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                ),
                title: 'Developer Leadership',
                us:    'Coding + SEO expertise combined',
                them:  'Designers with basic SEO knowledge',
              },
              {
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                ),
                title: 'Algorithm Updates',
                us:    'Thrived through years of Google changes',
                them:  'Struggle with each update',
              },
              {
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                title: 'Indian Market Expertise',
                us:    'Deep local expertise from years of practice',
                them:  'Generic global strategies',
              },
              {
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                ),
                title: 'Custom Development',
                us:    '100% custom, no platform limitations',
                them:  'Template-based with SEO plugins',
              },
              {
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
                title: 'Pricing Transparency',
                us:    'Clear upfront pricing, no surprises',
                them:  'Hidden costs and surprise fees',
              },
            ].map((card, i) => (
              <div key={card.title} className={`choose-card reveal d${(i % 3) + 1}${compReveal.vis ? ' visible' : ''}`}>
                <div className="choose-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <div className="wd-comp-vs">
                  <div className="wd-comp-row">
                    <span className="wd-comp-mark-us">✓</span>
                    <span><strong>SEOShouts:</strong> {card.us}</span>
                  </div>
                  <div className="wd-comp-row">
                    <span className="wd-comp-mark-them">✗</span>
                    <span><strong>Others:</strong> {card.them}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="svc-cta" style={{ marginTop: '2.5rem' }}>
            <a href="#pricing" aria-label="See our packages" className="btn-primary">See Our Packages <Arrow /></a>
            <a href="/contact/" aria-label="Contact SEOShouts" className="btn-outline">Contact Us</a>
          </div>
        </div>
      </section>

      {/* ── Why Choose SEOShouts ───────────────────────────────────────────── */}
      <section className="section guarantee-section">
        <div className="section-container">
          <div ref={whyReveal.ref} className={`s-header reveal${whyReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow light">Why Choose Us</div>
            <h2 className="s-title light">Why Choose SEOShouts Web Development Expertise <span className="blue">Over Generic Agencies?</span></h2>
          </div>

          <div className="guarantee-card">
            <div className="wd-why-grid">
              <div>
                <div className="wd-why-box-title">Unmatched Technical and SEO Authority</div>
                <ul className="wd-why-list">
                  <li><span><strong>Coding</strong> foundation combined with <strong>over a decade of hands-on SEO experience</strong></span></li>
                  <li><span><strong>No platform dependencies</strong> – 100% custom solutions without licensing fees or template limitations</span></li>
                  <li><span><strong>Indian market specialisation</strong> developed through <strong>years of local client success stories</strong></span></li>
                  <li><span><strong>Algorithm update experience</strong> – we&apos;ve successfully navigated every major Google change over the years</span></li>
                  <li><span><strong>Direct communication</strong> in plain Indian English with <strong>expert-level technical guidance</strong></span></li>
                </ul>
              </div>
              <div>
                <div className="wd-why-box-title">Proven Track Record</div>
                <ul className="wd-why-list">
                  <li><span><strong>Hundreds of successful websites</strong> launched and optimised for Indian businesses</span></li>
                  <li><span><strong>Consistent ranking improvements</strong> achieved through algorithm updates and market changes</span></li>
                  <li><span><strong>Long-term client relationships</strong> built on <strong>sustained SEO performance</strong> over years</span></li>
                  <li><span><strong>Industry expertise</strong> across multiple verticals gained through years of diverse projects</span></li>
                  <li><span><strong>Documented case studies</strong> showing <strong>measurable ROI</strong> from SEO website development investments</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Advanced Features Section ──────────────────────────────────────── */}
      <AdvancedFeaturesSection />

      {/* ── Custom Development Advantages ─────────────────────────────────── */}
      <section className="section svc-section">
        <div className="section-container">
          <div ref={advReveal.ref} className={`s-header reveal${advReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow light">Custom Development</div>
            <h2 className="s-title light">Custom Development Advantages for <span className="blue">Indian Businesses</span></h2>
          </div>

          <div className="wd-adv-grid">
            {/* Complete Control & Flexibility */}
            <div className="wd-adv-card">
              <div className="wd-adv-card-head">
                <div className="wd-adv-icon">
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                  </svg>
                </div>
                <div className="wd-adv-card-title">Complete Control &amp; Flexibility</div>
              </div>
              <ul className="wd-adv-list">
                <li><span><strong>No platform limitations</strong> or feature restrictions that hurt SEO</span></li>
                <li><span><strong>Unlimited customisation</strong> possibilities based on your business needs</span></li>
                <li><span><strong>No monthly licensing fees</strong> or subscription costs (only domain and hosting if needed)</span></li>
                <li><span><strong>Full ownership</strong> of code and functionality</span></li>
                <li><span><strong>Custom integrations</strong> with Indian business tools, and payment gateways.</span></li>
                <li><span><strong>Scalable architecture</strong> that adapts to business growth and seasonal demands</span></li>
              </ul>
            </div>

            {/* Superior Performance */}
            <div className="wd-adv-card">
              <div className="wd-adv-card-head">
                <div className="wd-adv-icon">
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div className="wd-adv-card-title">Superior Performance for Indian Networks</div>
              </div>
              <ul className="wd-adv-list">
                <li><span><strong>Optimised codebase</strong> without bloated plugins that slow Indian connections</span></li>
                <li><span><strong>Faster loading times</strong> through efficient coding and Indian CDN integration</span></li>
                <li><span><strong>Better security</strong> with custom-built protection against common threats</span></li>
                <li><span><strong>Unique functionality</strong> that competitors using templates can&apos;t replicate</span></li>
                <li><span><strong>Direct database optimisation</strong> for complex queries and high-traffic periods</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── Latest from the Blog ───────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="section-container">
          <div ref={blogReveal.ref} className={`s-header center reveal${blogReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow">Expert SEO Insights</div>
            <h2 className="s-title" style={{ maxWidth: '100%' }}>Latest SEO <span className="blue">Strategies &amp; Tips</span></h2>
            <p className="s-sub" style={{ maxWidth: '580px', margin: '0.875rem auto 0' }}>Stay ahead with cutting-edge SEO strategies and marketing insights from industry experts</p>
          </div>

          <div className="wd-blog-grid">
            {blogPosts.length > 0 ? (
              blogPosts.map((post: any, index: number) => (
                <article key={post.id} className="wd-blog-card">
                  <div className="wd-blog-img">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title || 'Blog post image'} />
                    ) : (
                      <div className="wd-blog-img-placeholder">
                        {index === 0 ? (
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        ) : index === 1 ? (
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        ) : (
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                        )}
                      </div>
                    )}
                    <div className="wd-blog-badge">
                      {index === 0 ? 'LATEST' : index === 1 ? 'FEATURED' : 'POPULAR'}
                    </div>
                  </div>
                  <div className="wd-blog-body">
                    <div className="wd-blog-title">
                      <a href={`/blog/${post.slug}/`}>{post.title}</a>
                    </div>
                    <p className="wd-blog-excerpt">
                      {post.excerpt || 'Expert SEO insights and strategies to help your business grow online.'}
                    </p>
                    <div className="wd-blog-footer">
                      <div className="wd-blog-meta">
                        <div className="wd-blog-avatar">
                          {(post.author?.name || 'SE').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="wd-blog-author-name">{post.author?.name || 'SEO Expert'}</div>
                          <div className="wd-blog-date">
                            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <a href={`/blog/${post.slug}/`} className="wd-blog-read-more" aria-label={`Read ${post.title}`}>Read More →</a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <>
                {[
                  { badge: 'LATEST',   title: 'Expert SEO Insights Coming Soon',         excerpt: 'Master the latest SEO techniques with our comprehensive guides covering technical optimization and content strategy.',     author: 'SEO Expert',      initials: 'SE', date: 'Publishing Soon' },
                  { badge: 'FEATURED', title: 'Website Performance Optimization',          excerpt: "Learn how to optimize your website's Core Web Vitals and achieve lightning-fast page speeds for better rankings.",         author: 'Web Optimizer',   initials: 'WO', date: 'Publishing Soon' },
                  { badge: 'POPULAR',  title: 'Digital Marketing Insights',               excerpt: 'Stay informed about the latest digital marketing trends and tactics that deliver measurable results.',                   author: 'Digital Marketer', initials: 'DM', date: 'Publishing Soon' },
                ].map((fb, i) => (
                  <article key={i} className="wd-blog-card">
                    <div className="wd-blog-img">
                      <div className="wd-blog-img-placeholder">
                        {i === 0 ? (
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        ) : i === 1 ? (
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        ) : (
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                        )}
                      </div>
                      <div className="wd-blog-badge">{fb.badge}</div>
                    </div>
                    <div className="wd-blog-body">
                      <div className="wd-blog-title"><a href="/blog/">{fb.title}</a></div>
                      <p className="wd-blog-excerpt">{fb.excerpt}</p>
                      <div className="wd-blog-footer">
                        <div className="wd-blog-meta">
                          <div className="wd-blog-avatar">{fb.initials}</div>
                          <div>
                            <div className="wd-blog-author-name">{fb.author}</div>
                            <div className="wd-blog-date">{fb.date}</div>
                          </div>
                        </div>
                        <a href="/blog/" className="wd-blog-read-more" aria-label="Visit our blog">Visit Blog →</a>
                      </div>
                    </div>
                  </article>
                ))}
              </>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href="/blog/" className="btn-primary" aria-label="View all articles">
              View All Articles <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="cta-section-svc">
        <div className="cta-svc-inner">
          <div ref={ctaReveal.ref} className={`reveal${ctaReveal.vis ? ' visible' : ''}`}>
            <div className="eyebrow light">Take the Next Step</div>
            <h2 className="s-title light" style={{ maxWidth: 880, marginBottom: '1.25rem' }}>
              Ready to Launch Your Business with <span style={{ color: 'var(--blue)' }}>Expert SEO Website Development?</span>
            </h2>
            <p className="s-sub light" style={{ marginBottom: '3rem' }}>
              Don&apos;t settle for a website that just looks good. Partner with India&apos;s specialist{' '}
              <strong style={{ color: '#fff' }}>SEO web development company</strong> that delivers measurable rankings and revenue from day one.
            </p>
          </div>

          <div className="cta-start-label">→ Get Started Today</div>

          <div className="cta-channels">
            <div className="cta-channel">
              <div className="cta-channel-icon">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div>
                <h4>Get Your Free Website SEO Audit</h4>
                <p>Discover the technical and SEO gaps holding your website back from ranking</p>
              </div>
            </div>
            <div className="cta-channel">
              <div className="cta-channel-icon">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <h4>Call: +91 8094888157</h4>
                <p>Speak directly with our SEO web development team in Udaipur, Rajasthan</p>
              </div>
            </div>
            <div className="cta-channel">
              <div className="cta-channel-icon">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <h4>Email: seoshouts@gmail.com</h4>
                <p>Share your project brief and get a detailed proposal within 24 hours</p>
              </div>
            </div>
            <div className="cta-channel">
              <div className="cta-channel-icon">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h4>Schedule a Strategy Consultation</h4>
                <p>Get a custom SEO development roadmap tailored for your Indian business</p>
              </div>
            </div>
          </div>

          <div className="cta-actions">
            <a href="/contact/" aria-label="Get your free SEO website development audit from SEOShouts" className="btn-primary">
              Get Your Free Website SEO Audit <Arrow />
            </a>
            <a href="tel:+918094888157" aria-label="Call SEOShouts for SEO website development" className="btn-outline">
              Call +91 8094888157
            </a>
          </div>

          <div className="cta-foot">
            <p className="cta-served"><strong>Serving businesses across India from our Udaipur, Rajasthan headquarters</strong></p>
            <p>Still have questions? Our SEO web development specialists are ready to discuss your project goals and timelines. With 13+ years of building high-ranking websites for Indian businesses, we&apos;re here to help you launch a site that genuinely grows your revenue.</p>
          </div>
        </div>
      </section>
    </>
  )
}
