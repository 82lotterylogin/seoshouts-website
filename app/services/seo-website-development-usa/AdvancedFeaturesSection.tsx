'use client'

import { useState } from 'react'

// ─── Icon set matching theme style ────────────────────────────────────────────
function WdIcon({ name, size = 20 }: { name: string; size?: number }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  if (name === 'settings')   return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  if (name === 'zap')        return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  if (name === 'layout')     return <svg {...p}><rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M9 21V9"/></svg>
  if (name === 'code')       return <svg {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  if (name === 'map')        return <svg {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
  if (name === 'cpu')        return <svg {...p}><rect x="4" y="4" width="16" height="16"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
  if (name === 'link')       return <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
  if (name === 'globe')      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  if (name === 'image')      return <svg {...p}><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  if (name === 'package')    return <svg {...p}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  if (name === 'database')   return <svg {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
  if (name === 'clock')      return <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  if (name === 'compass')    return <svg {...p}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
  if (name === 'target')     return <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  if (name === 'trending')   return <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  if (name === 'shield')     return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  if (name === 'smartphone') return <svg {...p}><rect x="5" y="2" width="14" height="20"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
  if (name === 'share')      return <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  if (name === 'accessibility') return <svg {...p}><circle cx="12" cy="4" r="1.5"/><path d="M9 9h6l-1 7-2 4-2-4-1-7"/><path d="M6.5 11.5c1.1 0.5 3.7 1 5.5 1s4.4-0.5 5.5-1"/></svg>
  if (name === 'monitor')    return <svg {...p}><rect x="2" y="3" width="20" height="14"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  if (name === 'wifi')       return <svg {...p}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
  return null
}

const advancedFeatures = {
  'Technical SEO Excellence': {
    description: 'From Years of Experience',
    icon: 'settings',
    features: [
      { icon: 'code',    name: 'JSON-LD Structured Data',    desc: 'Implementation using schemas proven effective over years' },
      { icon: 'map',     name: 'XML Sitemaps',               desc: 'Priority & frequency settings optimised through years of crawl analysis' },
      { icon: 'cpu',     name: 'Robots.txt Optimisation',    desc: 'Best practices evolved through years of bot behaviour study' },
      { icon: 'link',    name: 'Canonical URL Management',   desc: 'Techniques refined through duplicate content challenges' },
      { icon: 'globe',   name: 'Hreflang Implementation',    desc: 'For multi-language American markets based on years of international SEO' },
      { icon: 'share',   name: 'Open Graph & Social Media',  desc: 'Strategies developed over years of social integration' },
    ],
  },
  'Performance Optimisation': {
    description: 'Proven Techniques',
    icon: 'zap',
    features: [
      { icon: 'image',    name: 'Image Compression',              desc: 'Next-gen format conversion improving Core Web Vitals' },
      { icon: 'package',  name: 'CSS & JavaScript Optimisation',  desc: 'Minification techniques mastered over years' },
      { icon: 'database', name: 'Browser Caching',                desc: 'Cache strategies proven effective across American hosting' },
      { icon: 'globe',    name: 'CDN Integration',                desc: 'Optimised for American cities based on years of data' },
      { icon: 'database', name: 'Database Query Optimisation',    desc: 'Techniques from hundreds of custom builds' },
      { icon: 'clock',    name: 'Lazy Loading',                   desc: 'UX patterns observed over a decade' },
    ],
  },
  'User Experience Enhancements': {
    description: 'Conversion-Focused Design',
    icon: 'layout',
    features: [
      { icon: 'compass',      name: 'Intuitive Navigation',          desc: 'Designed for American user behaviour patterns' },
      { icon: 'target',       name: 'Call-to-Action Placement',      desc: 'Based on conversion data from years of testing' },
      { icon: 'trending',     name: 'Conversion-Focused Design',     desc: 'Proven effective across American markets' },
      { icon: 'shield',       name: 'Accessibility Compliance',      desc: 'WCAG 2.1 AA with SEO considerations' },
      { icon: 'monitor',      name: 'Cross-Browser Compatibility',   desc: 'Tested across popular American browsers' },
      { icon: 'smartphone',   name: 'PWA Capabilities',              desc: 'Enhanced mobile experience for American users' },
    ],
  },
}

const categories = Object.keys(advancedFeatures) as Array<keyof typeof advancedFeatures>

export default function AdvancedFeaturesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Technical SEO Excellence')

  const selectedData = advancedFeatures[selectedCategory as keyof typeof advancedFeatures]

  return (
    <section className="section features-section">
      <style>{`
        @keyframes wd-advSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wd-adv-feat-wrap { display: grid; grid-template-columns: 1fr 2fr; gap: 0; border: 1px solid var(--line); }
        .wd-adv-feat-tabs { border-right: 1px solid var(--line); background: var(--gray-1); }
        .wd-adv-feat-tab { display: flex; align-items: center; gap: 14px; padding: 20px 22px; cursor: pointer; border: none; background: transparent; text-align: left; width: 100%; color: var(--gray-5); transition: background 0.18s, color 0.18s; border-left: 3px solid transparent; border-bottom: 1px solid var(--line); }
        .wd-adv-feat-tab:last-child { border-bottom: none; }
        .wd-adv-feat-tab:hover { background: #fff; color: var(--ink); }
        .wd-adv-feat-tab.wd-adv-on { background: #fff; color: var(--ink); border-left-color: var(--blue); }
        .wd-adv-feat-tab-icon { width: 36px; height: 36px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .wd-adv-feat-tab-label { font-size: 0.875rem; font-weight: 600; line-height: 1.35; color: inherit; }
        .wd-adv-feat-tab-sub { font-size: 0.72rem; color: var(--gray-5); margin-top: 2px; }
        .wd-adv-feat-tab.wd-adv-on .wd-adv-feat-tab-sub { color: var(--blue); }
        .wd-adv-feat-panel { padding: 32px 36px; background: #fff; }
        .wd-adv-feat-panel-anim { animation: wd-advSlideIn 0.28s cubic-bezier(0.2,0.6,0.4,1) both; }
        .wd-adv-feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); }
        .wd-adv-feat-item { background: #fff; padding: 1.25rem; display: flex; gap: 12px; align-items: flex-start; position: relative; transition: background 0.18s ease; }
        .wd-adv-feat-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--blue); transform: scaleY(0); transform-origin: top; transition: transform 0.22s ease; }
        .wd-adv-feat-item:hover { background: rgba(37,99,235,0.04); }
        .wd-adv-feat-item:hover::before { transform: scaleY(1); }
        .wd-adv-feat-item-icon { width: 32px; height: 32px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .wd-adv-feat-item-body { flex: 1; min-width: 0; }
        .wd-adv-feat-item-name { font-size: 0.875rem; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
        .wd-adv-feat-item-desc { font-size: 0.78rem; color: var(--gray-5); line-height: 1.55; }
        @media (max-width: 900px) {
          .wd-adv-feat-wrap { grid-template-columns: 1fr; }
          .wd-adv-feat-tabs { border-right: none; border-bottom: 1px solid var(--line); display: flex; overflow-x: auto; scrollbar-width: none; }
          .wd-adv-feat-tabs::-webkit-scrollbar { display: none; }
          .wd-adv-feat-tab { flex: 1; flex-direction: column; align-items: center; gap: 6px; padding: 14px 10px; border-left: none; border-bottom: 3px solid transparent; border-right: 1px solid var(--line); min-width: 80px; }
          .wd-adv-feat-tab.wd-adv-on { border-bottom-color: var(--blue); border-left-color: transparent; }
          .wd-adv-feat-tab-sub { display: none; }
          .wd-adv-feat-panel { padding: 20px 18px; }
          .wd-adv-feat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="section-container">
        <div className="s-header">
          <div className="eyebrow">Advanced Features</div>
          <h2 className="s-title">Advanced SEO Features Mastered Over the Years</h2>
          <p className="s-sub">Comprehensive SEO implementation refined through over 13 years of experience</p>
        </div>

        <div className="wd-adv-feat-wrap">
          <div className="wd-adv-feat-tabs" role="tablist" aria-label="Advanced feature categories">
            {categories.map(cat => {
              const data = advancedFeatures[cat]
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  className={`wd-adv-feat-tab${selectedCategory === cat ? ' wd-adv-on' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <div className="wd-adv-feat-tab-icon">
                    <WdIcon name={data.icon} size={18} />
                  </div>
                  <div>
                    <div className="wd-adv-feat-tab-label">{cat}</div>
                    <div className="wd-adv-feat-tab-sub">{data.description}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="wd-adv-feat-panel" role="tabpanel">
            <div key={selectedCategory} className="wd-adv-feat-panel-anim">
              <div className="wd-adv-feat-grid">
                {selectedData.features.map(feature => (
                  <div key={feature.name} className="wd-adv-feat-item">
                    <div className="wd-adv-feat-item-icon">
                      <WdIcon name={feature.icon} size={16} />
                    </div>
                    <div className="wd-adv-feat-item-body">
                      <div className="wd-adv-feat-item-name">{feature.name}</div>
                      <div className="wd-adv-feat-item-desc">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
