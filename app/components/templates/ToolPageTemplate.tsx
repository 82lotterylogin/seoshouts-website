/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║           TOOL PAGE DESIGN TEMPLATE — SEOShouts                     ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  Based on: /tools/internal-link-checker/InternalLinkCheckerClient   ║
 * ║  Apply to: on-page-seo-analyzer, schema-generator, robots-txt,      ║
 * ║            disavow-file-generator, meta-tag-generator, etc.         ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  RULES — READ BEFORE IMPLEMENTING:                                  ║
 * ║  1. Keep ALL existing tool logic, API calls, state management       ║
 * ║  2. Keep ALL metadata, JSON-LD schemas, canonical URLs in page.tsx  ║
 * ║  3. Keep ALL reCAPTCHA, rate limiting, error handling exactly       ║
 * ║  4. Keep ALL results, export, visualization components exactly      ║
 * ║  5. Only change: class names, wrapper divs, visual shell            ║
 * ║  6. Never add Tailwind classes — use CSS vars + class names only    ║
 * ║  7. No border-radius on containers, no box-shadows on tool boxes    ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  DESIGN SYSTEM COLORS (CSS vars defined in globals.css)             ║
 * ║  --blue: #2563eb       --blue-dark: #1d4ed8                         ║
 * ║  --blue-light: #3b82f6 --blue-pale: #eff6ff                         ║
 * ║  --ink: #08090a        --ink-2: #111318   --ink-3: #1c2030          ║
 * ║  --gray-1: #f3f4f7     --gray-4: #8891aa  --gray-5: #545d78         ║
 * ║  --white: #fff         --line: #e2e5ee                              ║
 * ║  --green: #16a34a      --red: #dc2626     --amber: #d97706          ║
 * ║  --green-bg: #f0fdf4   --amber-bg: rgba(217,119,6,0.04)             ║
 * ║                                                                      ║
 * ║  FONTS                                                               ║
 * ║  Headings: 'Space Grotesk', sans-serif                              ║
 * ║  Body:     'Inter', sans-serif                                      ║
 * ║  Mono:     'JetBrains Mono', monospace                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ── TOOL PAGE ARCHITECTURE ───────────────────────────────────────────────
 *
 * page.tsx              ← Server Component: metadata export + JSON-LD schemas
 *                          NEVER put 'use client' here
 *                          Imports and renders <ToolNameClient />
 *
 * ToolNameClient.tsx    ← Client Component ('use client')
 *                          All useState, useRef, fetch logic lives here
 *                          Renders all sections below in a single <>...</>
 *
 * ── SECTION ORDER ────────────────────────────────────────────────────────
 *
 *  1. Tool Hero            dark ink, ShapeGrid animation, breadcrumb, h1
 *  2. Tool Input Section   white/gray, form + key features
 *  3. Loading State        conditional — shows while isAnalyzing
 *  4. Results Panel        conditional — shows when results are ready
 *  5. Founder Quote        gray-1, trust builder
 *  6. Prose Section(s)     white + gray-1 alternating, "What is..." etc.
 *  7. Features Section     gray-1, feature-card grid
 *  8. How-To Section       white, numbered step-card grid
 *  9. Why Section          gray-1, why-card grid + alert-box
 * 10. Specialized Sections white, tool-specific (tables, comparisons, etc.)
 * 11. FAQ Section          gray-1, <details>/<summary> accordion
 * 12. Related Tools        white, related-card grid
 * 13. Final CTA            dark ink, btn-primary + btn-outline
 */

'use client'

import { useState, useRef } from 'react'
// ▼ KEEP: import ReCAPTCHA only if your tool uses it
import ReCAPTCHA from 'react-google-recaptcha'
// ▼ KEEP: import your tool-specific sub-components exactly as-is
// import ToolVisualization from './ToolVisualization'
// import ToolDataTable from './ToolDataTable'
// import ExportOptions from './ExportOptions'
import ShapeGrid from '../ShapeGrid'


// ══════════════════════════════════════════════════════════════════════════
// SECTION 1 — TOOL HERO
// ══════════════════════════════════════════════════════════════════════════
// Full-width dark (ink) section.
// Background: ShapeGrid animated canvas + radial-gradient top vignette.
// Content: breadcrumb nav → badge pill → h1 (with <span>) → subtitle p
//
// CSS: .tool-hero / .tool-hero-inner / .tool-hero-badge
//      .tool-hero-h1 / .tool-hero-sub  (globals.css ~line 1060)
// Breadcrumb: .breadcrumb / .breadcrumb-sep
//
// VIGNETTE: top-focused gradient (light at top, dark at bottom)
//   'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, rgba(8,9,10,0.9) 100%)'
//   → content sits below the transparent center, ensuring text readability
//
// ShapeGrid wrapper MUST have: position:absolute; inset:0; overflow:hidden; pointerEvents:'all'
// Vignette div MUST have:      position:absolute; inset:0; pointerEvents:'none'
// .tool-hero-inner already has: position:relative; z-index:1
// ──────────────────────────────────────────────────────────────────────────
function ToolHero() {
  return (
    <div id="top" className="tool-hero">
      {/* Animated grid background — DO NOT MODIFY these props */}
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
      {/* Top vignette — fades the grid so text is legible */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, rgba(8,9,10,0.9) 100%)',
      }} />

      <div className="tool-hero-inner">
        {/* Breadcrumb — keep exact hrefs and labels */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">/</span>
          <a href="/tools/">SEO Tools</a>
          <span className="breadcrumb-sep">/</span>
          {/* ▼ REPLACE: tool name */}
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Tool Name</span>
        </nav>

        {/* Badge pill — emoji + category label + tier label */}
        {/* ▼ REPLACE: emoji, category, tier */}
        <div className="tool-hero-badge">🔍 SEO Analysis Tool — Free Forever</div>

        {/* Main headline — <span> gets the blue gradient/italic treatment */}
        {/* ▼ REPLACE: existing h1 text exactly */}
        <h1 className="tool-hero-h1">
          Free Tool Name: <span>Key Feature One</span>, Feature Two &amp; Feature Three
        </h1>

        {/* Subtitle — can include <strong> for key phrases */}
        {/* ▼ REPLACE: existing subtitle paragraph exactly */}
        <p className="tool-hero-sub">
          Brief description of what the tool does and why it matters. Include your unique
          differentiator here.{' '}
          <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Unique feature callout</strong>{' '}
          that no other free tool offers.
        </p>
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 2 — TOOL INPUT SECTION
// ══════════════════════════════════════════════════════════════════════════
// White/gray background section that contains the actual tool UI.
// Centered narrow column layout (max-width ~680px).
//
// CSS: .tool-input-section / .tool-input-inner / .tool-box
//      .tool-box-heading / .tool-box-sub / .tool-box-label
//      .tool-url-input / .tool-captcha / .tool-analyze-btn
//      .tool-analyze-btn-dot / .tool-key-features
//      .tool-key-features-title / .tool-features-grid
//      .tool-feat-item / .tool-feat-check / .tool-feat-name / .tool-feat-desc
//
// KEEP: all form logic, validation, reCAPTCHA, error handling exactly as-is
// KEEP: usageInfo display block (rate limiting UI) exactly as-is
// KEEP: userInputRequest block (multi-step workflow) exactly as-is
// KEEP: key features list data exactly as-is
// ──────────────────────────────────────────────────────────────────────────
//
// ▼ KEY FEATURES — keep your actual tool features
const KEY_FEATURES = [
  // ▼ REPLACE: keep exact existing feature names and descriptions
  { name: 'Feature One Name', desc: 'What this feature does and why it helps the user' },
  { name: 'Feature Two Name', desc: 'What this feature does and why it helps the user' },
  { name: 'Feature Three Name', desc: 'What this feature does and why it helps the user' },
  { name: 'Feature Four Name', desc: 'What this feature does and why it helps the user' },
]

// NOTE: The ToolInput section is intentionally left as a render-inline
// comment block because the form logic (state, handlers, reCAPTCHA ref)
// must stay in the parent component. See the full pattern in
// InternalLinkCheckerClient.tsx lines 356–518.
//
// Pattern to follow:
//
//   <div className="tool-input-section">
//     <div className="tool-input-inner">
//       <div className="tool-box">
//         <h2 className="tool-box-heading">▼ REPLACE: heading</h2>
//         <p className="tool-box-sub">▼ REPLACE: sub-heading with <span> accent</p>
//
//         {/* Usage counter — keep logic exactly */}
//         {(usageInfo.remainingRequests !== undefined || usageInfo.isLimitReached) && (
//           <div style={{ ... }}>...</div>
//         )}
//
//         <form onSubmit={handleAnalyze}>
//           <label className="tool-box-label" htmlFor="input-id">▼ REPLACE: label</label>
//           <input id="input-id" className="tool-url-input" ... />
//
//           {/* reCAPTCHA — keep exactly if your tool uses it */}
//           {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
//             <div className="tool-captcha">
//               <ReCAPTCHA ref={recaptchaRef} sitekey={...} />
//             </div>
//           )}
//
//           <button type="submit" className="tool-analyze-btn" disabled={...}>
//             <div className="tool-analyze-btn-dot" />
//             {isAnalyzing ? 'Analyzing...' : '▼ REPLACE: CTA text'}
//           </button>
//         </form>
//
//         {/* Error display — keep logic exactly */}
//         {error && (
//           <div style={{ marginTop:'1rem', padding:'1rem 1.25rem',
//             background: '...', border: '...', borderLeft: '3px solid ...' }}>
//             <div style={{ fontWeight:600, color:'...', marginBottom:4 }}>Error Title</div>
//             <div style={{ fontSize:'0.85rem', color:'var(--gray-5)' }}>{error}</div>
//           </div>
//         )}
//
//         {/* userInputRequest block — keep entire block exactly if used */}
//         {userInputRequest && ( <div style={{ ... }}>...</div> )}
//
//         {/* Key Features */}
//         <div className="tool-key-features">
//           <div className="tool-key-features-title">Key Features:</div>
//           <div className="tool-features-grid">
//             {KEY_FEATURES.map(f => (
//               <div key={f.name} className="tool-feat-item">
//                 <div className="tool-feat-check">
//                   <svg ...><path d="M20 6 9 17l-5-5" /></svg>
//                 </div>
//                 <div>
//                   <div className="tool-feat-name">{f.name}</div>
//                   <div className="tool-feat-desc">{f.desc}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>


// ══════════════════════════════════════════════════════════════════════════
// SECTION 3 — LOADING STATE (conditional)
// ══════════════════════════════════════════════════════════════════════════
// Shown only while isAnalyzing === true.
// Reuses .results-panel wrapper for consistent vertical rhythm.
//
// CSS: .results-panel / .results-inner / .loading-state
//      .loading-bar-track / .loading-bar-fill   (animated CSS bar)
//
// KEEP: the progress message, URL display, bar animation exactly as-is
// ──────────────────────────────────────────────────────────────────────────
//
// Pattern to follow (render inline in the parent component):
//
//   {isAnalyzing && (
//     <div className="results-panel">
//       <div className="results-inner">
//         <div className="loading-state">
//           <div style={{ fontSize:'0.9rem', color:'var(--gray-5)', fontWeight:600 }}>
//             Crawling {url}...
//           </div>
//           <div className="loading-bar-track"><div className="loading-bar-fill" /></div>
//           <div style={{ fontSize:'0.8rem', color:'var(--gray-4)' }}>
//             {progress || 'Analyzing...'}
//           </div>
//         </div>
//       </div>
//     </div>
//   )}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 4 — RESULTS PANEL (conditional)
// ══════════════════════════════════════════════════════════════════════════
// Shown only when results !== null.
// White background panel with full results UI.
//
// CSS: .results-panel / .results-inner / .results-header
//      .results-site / .results-site-url / .results-actions / .btn-sm
//      .stats-strip / .stat-cell / .stat-cell-num / .stat-cell-label
//      .stat-cell-num.blue / .stat-cell-num.green   (colored variants)
//      .result-card / .result-card-full
//      .tabs / .tab / .tab.active
//
// KEEP: all results data display, ExportOptions, tab logic, scroll behavior
// KEEP: ref={resultsPanelRef} on the outer .results-panel for auto-scroll
//
// Stats strip pattern (adapt values to your tool's output):
//   { val: data.metric1.toLocaleString(), label: 'Metric One', cls: 'blue' }
//   { val: data.metric2.toLocaleString(), label: 'Metric Two', cls: '' }
//   { val: data.metric3.toLocaleString(), label: 'Metric Three', cls: 'green' }
//
// Tab pattern (adapt to your tool's result views):
//   { key: 'view1', label: 'View One' }
//   { key: 'view2', label: 'View Two' }
//   { key: 'view3', label: `View Three (${count})` }
//
// ──────────────────────────────────────────────────────────────────────────
//
// Pattern to follow (render inline in the parent component):
//
//   {results && (
//     <div className="results-panel" ref={resultsPanelRef}>
//       <div className="results-inner">
//
//         {/* Header */}
//         <div className="results-header">
//           <div className="results-site">
//             <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)' }} />
//             Analysis complete
//             <span className="results-site-url">— {results.baseUrl}</span>
//           </div>
//           <div className="results-actions">
//             <ExportOptions results={results} />     {/* ▼ keep if your tool has export */}
//             <button className="btn-sm" onClick={resetAnalysis}>New Analysis</button>
//           </div>
//         </div>
//
//         {/* Stats strip */}
//         <div className="stats-strip">
//           {STATS_CONFIG.map(s => (
//             <div key={s.label} className="stat-cell">
//               <div className={`stat-cell-num ${s.cls}`}>{s.val}</div>
//               <div className="stat-cell-label">{s.label}</div>
//             </div>
//           ))}
//         </div>
//
//         {/* Tabbed results */}
//         <div className="result-card result-card-full" style={{ marginTop:'1.25rem' }}>
//           <div className="tabs">
//             {TABS.map(tab => (
//               <button key={tab.key}
//                 className={`tab${activeTab === tab.key ? ' active' : ''}`}
//                 onClick={() => setActiveTab(tab.key)}
//               >{tab.label}</button>
//             ))}
//           </div>
//           <div style={{ padding:'1.5rem' }}>
//             {activeTab === 'view1' && <View1Component data={results} />}
//             {activeTab === 'view2' && <View2Component data={results} />}
//           </div>
//         </div>
//
//       </div>
//     </div>
//   )}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 5 — FOUNDER QUOTE
// ══════════════════════════════════════════════════════════════════════════
// Light section (gray-1 or white). Trust-builder with founder avatar + quote.
// This section always shows — not conditional on results.
//
// CSS: .section .founder-section / .founder-inner / .founder-avatar
//      .founder-name / .founder-quote-text / .founder-role
//
// NOTE: .founder-section has reduced padding (3rem 2rem), not default section padding
//
// KEEP: quote text, attribution, "Meet Our Experts" link exactly as written
// ──────────────────────────────────────────────────────────────────────────
function FounderQuote() {
  return (
    <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
      <div className="section-container">
        <div className="founder-inner">
          {/* 2-letter monogram badge */}
          <div className="founder-avatar">RS</div>
          <div>
            {/* ▼ REPLACE: attribution line */}
            <div className="founder-name">Built by Rohit Sharma — 13+ Years in Technical SEO</div>
            {/* ▼ REPLACE: existing quote text exactly */}
            <p className="founder-quote-text">
              &ldquo;Keep exact existing founder quote here. This should explain why you
              built this tool and what problem it solves that other tools miss.&rdquo;
            </p>
            <div className="founder-role">
              — Rohit Sharma, Founder of SEOShouts ·{' '}
              <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 6 — PROSE SECTIONS ("What is...", "How Many...", etc.)
// ══════════════════════════════════════════════════════════════════════════
// Alternating white / gray-1 backgrounds.
// Text-heavy educational content with structured sub-sections.
//
// CSS: .section .prose-section / .section .prose-section.alt  (gray-1 bg)
//      .s-header / .eyebrow / .s-title / .blue (span in h2)
//      .prose-content / .prose-callout / .prose-callout-title
//
// .prose-content styles:  p, ul, li, strong, a, h3 automatically
// .prose-callout:         indented callout box with blue left border
// .prose-callout-title:   bold eyebrow label inside callout
//
// Use <section className="section prose-section"> for white background
// Use <section className="section prose-section alt"> for gray-1 background
//
// KEEP: all paragraph text, citations, statistics, links exactly as written
// ──────────────────────────────────────────────────────────────────────────
function WhatIsSection() {
  return (
    <section className="section prose-section">
      <div className="section-container">
        <div className="s-header">
          {/* ▼ REPLACE: eyebrow label */}
          <div className="eyebrow">Overview</div>
          {/* ▼ REPLACE: existing h2 exactly */}
          <h2 className="s-title">What is [Tool Name] <span className="blue">and why do you need one?</span></h2>
        </div>
        {/* ▼ REPLACE: existing prose paragraphs, lists, callouts exactly */}
        <div className="prose-content">
          <p>Introductory paragraph explaining what the tool is and what it does.</p>
          <p>Second paragraph with <strong>key insight bolded</strong> as it appears in the original.</p>
          <p>Third paragraph with any statistics and third-party data citations.</p>
          {/* Callout block for notable quotes or key findings */}
          <div className="prose-callout">
            <div className="prose-callout-title">Source Name, Year</div>
            <p>&ldquo;Keep exact quote text here.&rdquo;</p>
          </div>
          <p>Closing paragraph with internal links using{' '}
            <a href="/tools/related-tool/" style={{ color: 'var(--blue)' }}>descriptive anchor text</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

// ▼ ADD MORE PROSE SECTIONS as needed — alternate .prose-section and .prose-section.alt
// Each prose section covers one focused topic (link quantity, AI search, etc.)
// See ILC for examples: "How Many Internal Links", "AI Search Optimization"


// ══════════════════════════════════════════════════════════════════════════
// SECTION 7 — FEATURES SECTION
// ══════════════════════════════════════════════════════════════════════════
// Light gray (gray-1) background. 3-column feature card grid.
//
// CSS: .section .features-section / .features-grid / .feature-card
//      .feature-icon / .feature-title / .feature-desc / .feature-unique
//
// .feature-icon:   dark square with white SVG icon (20×20)
// .feature-unique: small blue badge "Unique to SEOShouts" — only add if truly unique
// .features-grid:  CSS grid, 3-col on desktop, 2-col tablet, 1-col mobile
//
// SVG icons: use 24×24 viewBox paths — search lucide.dev for icon names
// KEEP: all feature titles and descriptions exactly as written
// ──────────────────────────────────────────────────────────────────────────

// ▼ REPLACE: keep your actual feature data
const FEATURES = [
  {
    // SVG path string(s) — separate multiple paths with ' M' for the split-render below
    icon: 'M3 3h18v18H3z',
    title: 'Feature One Title',
    desc: 'Keep exact existing description for this feature. What it does, why it matters.',
    unique: true,  // set to true only for genuinely unique features
  },
  {
    icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0-3.42 0z M12 9v4 M12 17h.01',
    title: 'Feature Two Title',
    desc: 'Keep exact existing description for this feature.',
  },
  {
    icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    title: 'Feature Three Title',
    desc: 'Keep exact existing description for this feature.',
  },
  {
    icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
    title: 'Feature Four Title',
    desc: 'Keep exact existing description for this feature.',
  },
  {
    icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
    title: 'Feature Five Title',
    desc: 'Keep exact existing description for this feature.',
  },
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    title: 'Feature Six Title',
    desc: 'Keep exact existing description for this feature.',
  },
]

function FeaturesSection() {
  return (
    <section className="section features-section">
      <div className="section-container">
        <div className="s-header">
          {/* ▼ REPLACE: eyebrow */}
          <div className="eyebrow">Key Features</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">Key features of our <span className="blue">[tool name]</span></h2>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">
                {/* SVG icon — split ' M' handles multi-path icons */}
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  {f.icon.split(' M').map((d, j) => <path key={j} d={j === 0 ? d : 'M' + d} />)}
                </svg>
              </div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
              {/* ▼ Only add .feature-unique badge if genuinely exclusive */}
              {(f as any).unique && <div className="feature-unique">Unique to SEOShouts</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 8 — HOW-TO SECTION
// ══════════════════════════════════════════════════════════════════════════
// White background. Numbered step card grid — typically 4 steps.
// Each card has a large 2-digit number, title, description, and tip.
//
// CSS: .section .howto-section / .steps-grid / .step-card
//      .step-connector / .step-num-big / .step-title / .step-desc / .step-tip
//
// .step-connector: right-pointing arrow rendered between cards (not after last)
// .step-num-big:   large "01" / "02" etc. in blue, Space Grotesk font
// .step-tip:       subtle callout with 💡 prefix
//
// KEEP: all step titles, descriptions, tip text exactly as written
// ──────────────────────────────────────────────────────────────────────────

// ▼ REPLACE: keep your actual steps
const STEPS = [
  {
    n: '01',
    title: 'Step One Title',
    desc: 'Keep exact existing description for step one. What the user does and what happens.',
    tip: 'Keep exact existing tip text for step one.',
  },
  {
    n: '02',
    title: 'Step Two Title',
    desc: 'Keep exact existing description for step two.',
    tip: 'Keep exact existing tip text for step two.',
  },
  {
    n: '03',
    title: 'Step Three Title',
    desc: 'Keep exact existing description for step three.',
    tip: 'Keep exact existing tip text for step three.',
  },
  {
    n: '04',
    title: 'Step Four Title',
    desc: 'Keep exact existing description for step four.',
    tip: 'Keep exact existing tip text for step four.',
  },
]

function HowToSection() {
  return (
    <section className="section howto-section">
      <div className="section-container">
        <div className="s-header">
          {/* ▼ REPLACE: eyebrow */}
          <div className="eyebrow">How To Use</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">How to use [tool name] <span className="blue">(step-by-step)</span></h2>
          {/* ▼ REPLACE: existing subtitle with supporting data */}
          <p className="s-sub">Keep exact existing subtitle paragraph with any supporting statistics.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.n} className="step-card">
              {/* Arrow connector — rendered on all cards EXCEPT the last */}
              {i < STEPS.length - 1 && (
                <div className="step-connector">
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14 M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
              <div className="step-num-big">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
              {s.tip && <div className="step-tip">💡 Tip: {s.tip}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 9 — WHY SECTION
// ══════════════════════════════════════════════════════════════════════════
// Light gray (gray-1) background. 2-column card grid + alert callout box.
//
// CSS: .section .why-section / .why-grid / .why-card
//      .why-card-title / .why-card-icon / .why-card-body
//      .alert-box / .alert-box-title / .alert-box-body
//
// .why-card:       white bordered card with left-border accent on hover
// .why-card-title: flex row with emoji icon + bold heading text
// .why-card-icon:  emoji in a small container, left of the title text
// .alert-box:      full-width warning callout below the grid
//
// KEEP: all card titles, emoji icons, body copy, alert text exactly as written
// ──────────────────────────────────────────────────────────────────────────

// ▼ REPLACE: keep your actual "why it matters" cards
const WHY_CARDS = [
  {
    icon: '📡',
    title: 'Reason One Title',
    body: 'Keep exact existing body text for why this tool/topic matters. Include data citations.',
  },
  {
    icon: '🏗️',
    title: 'Reason Two Title',
    body: 'Keep exact existing body text for reason two.',
  },
  {
    icon: '🛡️',
    title: 'Reason Three Title',
    body: 'Keep exact existing body text for reason three.',
  },
  {
    icon: '⚡',
    title: 'Reason Four Title',
    body: 'Keep exact existing body text for reason four.',
  },
]

function WhySection() {
  return (
    <section className="section why-section">
      <div className="section-container">
        <div className="s-header">
          {/* ▼ REPLACE: eyebrow */}
          <div className="eyebrow">Why It Matters</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">Why [topic] is the most <span className="blue">underrated ranking factor</span></h2>
          {/* ▼ REPLACE: existing subtitle */}
          <p className="s-sub">Keep exact existing section subtitle here.</p>
        </div>
        <div className="why-grid">
          {WHY_CARDS.map(c => (
            <div key={c.title} className="why-card">
              <div className="why-card-title">
                <div className="why-card-icon">{c.icon}</div>
                {c.title}
              </div>
              <div className="why-card-body">{c.body}</div>
            </div>
          ))}
        </div>
        {/* Alert box — full-width warning below the grid */}
        <div className="alert-box">
          {/* ▼ REPLACE: existing alert title */}
          <div className="alert-box-title">⚠️ The Risk of Ignoring [Topic]</div>
          {/* ▼ REPLACE: existing alert body text */}
          <div className="alert-box-body">Keep exact existing warning paragraph here with the specific risk and what to do about it.</div>
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 10 — SPECIALIZED DATA SECTIONS (tool-specific)
// ══════════════════════════════════════════════════════════════════════════
// These sections vary by tool. The ILC has:
//   - Anchor Ratio Table (.ratio-section)
//   - Common Mistakes (.mistakes-section)
//   - Comparison Table (.comparison-section)
//   - Audit Checklist (.checklist-section)
//
// CSS for ratio table: .ratio-section / .ratio-table / .ratio-anchor-type
//   .ratio-pct / .ratio-risk / .ratio-risk.risk-safe / .risk-warn / .risk-bad
//   .ratio-note
//
// CSS for mistakes: .mistakes-section / .mistakes-grid / .mistake-card
//   .mistake-card-top / .mistake-num / .mistake-title / .mistake-body-text
//   .code-example / .code-bad / .code-good / .code-label / .code-text
//
// CSS for comparison: .comparison-section / .comparison-table
//   .comparison-table th.highlight / td.highlight-col
//   .check-yes / .check-no / .comparison-cards
//
// CSS for checklist: .checklist-section / .checklist-grid / .checklist-card
//   .checklist-head / .checklist-items / .checklist-item / .checklist-text
//
// ▼ KEEP: all tables, cards, checklist items with exact data as written
// ▼ Only use the sections that exist in your tool page — don't add new ones
// ──────────────────────────────────────────────────────────────────────────
//
// Example ratio table row structure:
//   { type: 'Row Category', example: '"example anchor"', pct: '50–60%', risk: 'Safe', cls: 'risk-safe' }
//   cls values: 'risk-safe' | 'risk-warn' | 'risk-bad'
//
// Example mistake card structure:
//   { n: '01', title: 'Mistake Title', body: 'Explanation...', bad: 'Bad example', good: 'Good example' }
//
// Example comparison table column:
//   First column = feature name, remaining = tool names
//   Use <span className="check-yes">✅</span> for yes, <span className="check-no">✗</span> for no
//
// Example checklist card:
//   { title: '📊 Category Name', items: ['Checkbox item 1', 'Checkbox item 2', ...] }


// ══════════════════════════════════════════════════════════════════════════
// SECTION 11 — FAQ SECTION
// ══════════════════════════════════════════════════════════════════════════
// White background. Native HTML <details>/<summary> accordion — no JS needed.
// Shared design system with service page FAQs — same CSS classes.
//
// CSS: .section .faq-section / .faq-list / .faq-item / .faq-answer
//
// .faq-list:   adds border: 1px solid var(--line) around the whole list
// .faq-item:   each <details> element — border-bottom divider between items
// .faq-answer: div inside <details> — shown when open, hidden when closed
//
// The <details> + <summary> pattern:
//   <details className="faq-item">
//     <summary>Question text here</summary>
//     <div className="faq-answer">Answer text here</div>
//   </details>
//
// DO NOT use useState for FAQ open/close — native <details> handles it
// KEEP: all FAQ questions and answers exactly as written
// ──────────────────────────────────────────────────────────────────────────

// ▼ REPLACE: keep your actual FAQ data exactly
const FAQS = [
  { q: 'FAQ question one?', a: 'Keep exact existing answer text. All supporting detail preserved.' },
  { q: 'FAQ question two?', a: 'Keep exact existing answer text.' },
  { q: 'FAQ question three?', a: 'Keep exact existing answer text.' },
  { q: 'FAQ question four?', a: 'Keep exact existing answer text.' },
  { q: 'FAQ question five?', a: 'Keep exact existing answer text.' },
  { q: 'FAQ question six?', a: 'Keep exact existing answer text.' },
  { q: 'FAQ question seven?', a: 'Keep exact existing answer text.' },
  { q: 'FAQ question eight?', a: 'Keep exact existing answer text.' },
  { q: 'FAQ question nine?', a: 'Keep exact existing answer text.' },
]

function FAQSection() {
  return (
    <section className="section faq-section">
      <div className="section-container">
        <div className="s-header">
          <div className="eyebrow">FAQ</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">Frequently asked questions</h2>
          {/* ▼ REPLACE: existing subtitle */}
          <p className="s-sub">Everything you need to know about [tool topic].</p>
        </div>
        {/* Native accordion — no useState required */}
        <div className="faq-list">
          {FAQS.map(faq => (
            <details key={faq.q} className="faq-item">
              <summary>{faq.q}</summary>
              <div className="faq-answer">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 12 — RELATED TOOLS
// ══════════════════════════════════════════════════════════════════════════
// White background. 5-card horizontal grid of related SEO tools.
// The "current" tool card gets a visual highlight (.related-card.current).
//
// CSS: .section .related-section / .related-tools-grid / .related-card
//      .related-card.current / .related-card-icon / .related-card-name
//      .related-card-desc / .related-card-status / .related-card-status-dot
//
// .related-card-icon: square container with SVG icon (stroke, 24×24 viewBox)
// .related-card-name: wraps an <a href={t.href}> — title link only, no CTA text
// .related-card-status: "Current tool" badge for current, "Free — no login" for others
//
// MEMORY: Links on cards go on the title only; never add "Learn more" etc.
//
// SVG paths: use lucide.dev paths — specify as array of path strings
// KEEP: all tool names, descriptions, hrefs, current flag exactly as written
// ──────────────────────────────────────────────────────────────────────────

// ▼ REPLACE: keep your actual related tools list
const RELATED_TOOLS = [
  {
    name: 'Current Tool Name',
    desc: 'Brief description of what this tool analyzes',
    current: true,
    href: '/tools/current-tool/',
    paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  },
  {
    name: 'Related Tool Two',
    desc: 'Brief description of related tool two',
    href: '/tools/related-tool-2/',
    paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  },
  {
    name: 'Related Tool Three',
    desc: 'Brief description of related tool three',
    href: '/tools/related-tool-3/',
    paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  },
  {
    name: 'Related Tool Four',
    desc: 'Brief description of related tool four',
    href: '/tools/related-tool-4/',
    paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'],
  },
  {
    name: 'Related Tool Five',
    desc: 'Brief description of related tool five',
    href: '/tools/related-tool-5/',
    paths: ['M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636'],
  },
]

function RelatedToolsSection() {
  return (
    <section className="section related-section">
      <div className="section-container">
        <div className="s-header">
          <div className="eyebrow">Free Tools</div>
          {/* ▼ REPLACE: existing h2 */}
          <h2 className="s-title">More tools in the <span className="blue">SEOShouts suite</span></h2>
        </div>
        <div className="related-tools-grid">
          {RELATED_TOOLS.map(t => (
            <div key={t.name} className={`related-card${t.current ? ' current' : ''}`}>
              <div className="related-card-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  {t.paths.map((d, i) => <path key={i} d={d} />)}
                </svg>
              </div>
              {/* Title link only — no generic CTA text (per project memory) */}
              <div className="related-card-name"><a href={t.href}>{t.name}</a></div>
              <div className="related-card-desc">{t.desc}</div>
              <div className="related-card-status">
                <div className="related-card-status-dot" />
                {t.current ? 'Current tool' : 'Free — no login'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// SECTION 13 — FINAL CTA
// ══════════════════════════════════════════════════════════════════════════
// Dark (ink) background with animated CSS grid pattern (::before pseudo-el).
// Centered layout: h2 + subtitle p + two buttons + pill badges.
//
// CSS: .final-cta / .final-cta-bg / .final-cta-inner
//      .final-cta-title / .final-cta-sub / .final-cta-row
//      .final-cta-pills / .final-pill
//
// .final-cta-bg:  absolute-positioned ::before animated grid (CSS-only)
// .final-cta-row: flex row containing btn-primary and btn-outline
// .final-pill:    small text badge with border, shown below the buttons
//
// Button href for primary: link back to #top (jumps to tool input)
// Button href for secondary: /contact/ or other relevant page
//
// KEEP: all headline, subtitle, pill text, and hrefs exactly as written
// ──────────────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <div className="final-cta">
      <div className="final-cta-bg" />
      <div className="final-cta-inner">
        {/* ▼ REPLACE: existing h2 with <span> for the animated gradient word */}
        <h2 className="final-cta-title">Start your [tool action] <span>now</span></h2>
        {/* ▼ REPLACE: existing subtitle paragraph */}
        <p className="final-cta-sub">Keep exact existing CTA section description. Explain the cost of inaction and the speed of the solution.</p>
        <div className="final-cta-row">
          {/* Primary: jumps back to #top to scroll to the tool */}
          <a href="#top" className="btn-primary">
            {/* ▼ REPLACE: existing CTA text with emoji */}
            🔍 Analyze [Topic] Now
          </a>
          {/* Secondary: links to contact or relevant service page */}
          <a href="/contact/" className="btn-outline">Get Expert Help</a>
        </div>
        <div className="final-cta-pills">
          {/* ▼ REPLACE: existing 3 pill labels — quick reassurance points */}
          {['Pill text one', 'Pill text two', 'Unique feature — only at SEOShouts'].map(p => (
            <div key={p} className="final-pill">{p}</div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT — Tool Client Component
// ══════════════════════════════════════════════════════════════════════════
// This is the 'use client' component imported by page.tsx.
// page.tsx stays as the server component with metadata + JSON-LD schemas.
//
// All tool state (url, isAnalyzing, results, error, progress, activeTab,
// userInputRequest, usageInfo, recaptchaRef, resultsPanelRef) is declared
// at the top of this export function — NOT in sub-components.
//
// The ToolHero, FounderQuote, prose sections, FeaturesSection, HowToSection,
// WhySection, FAQSection, RelatedToolsSection, and FinalCTA are extracted
// as named functions for readability. The Tool Input, Loading State, and
// Results Panel are rendered inline (JSX in the return block) so they can
// access the parent state directly without prop drilling.
//
// NOTE: The sections below marked "inline" must be written directly in the
// return of this exported function, not in extracted components.
// ──────────────────────────────────────────────────────────────────────────
export default function ToolNameClient() {
  // ▼ KEEP: all existing state declarations exactly as-is
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  // const [results, setResults] = useState<ResultType | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  // const [activeTab, setActiveTab] = useState<'view1' | 'view2'>('view1')
  const resultsPanelRef = useRef<HTMLDivElement>(null)
  // ▼ KEEP: multi-step workflow state if used
  // const [userInputRequest, setUserInputRequest] = useState<UserInputRequest | null>(null)
  // const [usageInfo, setUsageInfo] = useState<UsageInfo>({})
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // ▼ KEEP: all handler functions exactly as-is (handleAnalyze, performAnalysis,
  //         handleUserChoice, handleSitemapSubmit, handleManualUrlsSubmit, resetAnalysis)

  return (
    <>
      {/* ─── SECTION 1: TOOL HERO ─── */}
      <ToolHero />

      {/* ─── SECTION 2: TOOL INPUT (inline — needs parent state) ─── */}
      {/* ▼ KEEP: paste your exact tool input JSX here */}
      {/* See pattern comment in ToolInput section above */}

      {/* ─── SECTION 3: LOADING STATE (inline — conditional on isAnalyzing) ─── */}
      {/* ▼ KEEP: paste your exact loading state JSX here */}
      {/* See pattern comment in Loading State section above */}

      {/* ─── SECTION 4: RESULTS PANEL (inline — conditional on results) ─── */}
      {/* ▼ KEEP: paste your exact results panel JSX here */}
      {/* See pattern comment in Results Panel section above */}

      {/* ─── SECTION 5: FOUNDER QUOTE ─── */}
      <FounderQuote />

      {/* ─── SECTION 6: PROSE SECTIONS ─── */}
      <WhatIsSection />
      {/* ▼ ADD additional prose sections as needed (alt alternates bg color) */}

      {/* ─── SECTION 7: FEATURES ─── */}
      <FeaturesSection />

      {/* ─── SECTION 8: HOW-TO ─── */}
      <HowToSection />

      {/* ─── SECTION 9: WHY SECTION ─── */}
      <WhySection />

      {/* ─── SECTION 10: SPECIALIZED SECTIONS (tool-specific) ─── */}
      {/* ▼ KEEP: paste your ratio/mistakes/comparison/checklist sections here */}

      {/* ─── SECTION 11: FAQ ─── */}
      <FAQSection />

      {/* ─── SECTION 12: RELATED TOOLS ─── */}
      <RelatedToolsSection />

      {/* ─── SECTION 13: FINAL CTA ─── */}
      <FinalCTA />
    </>
  )
}
