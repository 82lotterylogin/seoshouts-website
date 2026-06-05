'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// State abbreviation to slug mapping for all 50 states
const stateData: Record<string, { name: string; slug: string }> = {
  AL: { name: 'Alabama', slug: 'alabama' },
  AK: { name: 'Alaska', slug: 'alaska' },
  AZ: { name: 'Arizona', slug: 'arizona' },
  AR: { name: 'Arkansas', slug: 'arkansas' },
  CA: { name: 'California', slug: 'california' },
  CO: { name: 'Colorado', slug: 'colorado' },
  CT: { name: 'Connecticut', slug: 'connecticut' },
  DE: { name: 'Delaware', slug: 'delaware' },
  FL: { name: 'Florida', slug: 'florida' },
  GA: { name: 'Georgia', slug: 'georgia' },
  HI: { name: 'Hawaii', slug: 'hawaii' },
  ID: { name: 'Idaho', slug: 'idaho' },
  IL: { name: 'Illinois', slug: 'illinois' },
  IN: { name: 'Indiana', slug: 'indiana' },
  IA: { name: 'Iowa', slug: 'iowa' },
  KS: { name: 'Kansas', slug: 'kansas' },
  KY: { name: 'Kentucky', slug: 'kentucky' },
  LA: { name: 'Louisiana', slug: 'louisiana' },
  ME: { name: 'Maine', slug: 'maine' },
  MD: { name: 'Maryland', slug: 'maryland' },
  MA: { name: 'Massachusetts', slug: 'massachusetts' },
  MI: { name: 'Michigan', slug: 'michigan' },
  MN: { name: 'Minnesota', slug: 'minnesota' },
  MS: { name: 'Mississippi', slug: 'mississippi' },
  MO: { name: 'Missouri', slug: 'missouri' },
  MT: { name: 'Montana', slug: 'montana' },
  NE: { name: 'Nebraska', slug: 'nebraska' },
  NV: { name: 'Nevada', slug: 'nevada' },
  NH: { name: 'New Hampshire', slug: 'new-hampshire' },
  NJ: { name: 'New Jersey', slug: 'new-jersey' },
  NM: { name: 'New Mexico', slug: 'new-mexico' },
  NY: { name: 'New York', slug: 'new-york' },
  NC: { name: 'North Carolina', slug: 'north-carolina' },
  ND: { name: 'North Dakota', slug: 'north-dakota' },
  OH: { name: 'Ohio', slug: 'ohio' },
  OK: { name: 'Oklahoma', slug: 'oklahoma' },
  OR: { name: 'Oregon', slug: 'oregon' },
  PA: { name: 'Pennsylvania', slug: 'pennsylvania' },
  RI: { name: 'Rhode Island', slug: 'rhode-island' },
  SC: { name: 'South Carolina', slug: 'south-carolina' },
  SD: { name: 'South Dakota', slug: 'south-dakota' },
  TN: { name: 'Tennessee', slug: 'tennessee' },
  TX: { name: 'Texas', slug: 'texas' },
  UT: { name: 'Utah', slug: 'utah' },
  VT: { name: 'Vermont', slug: 'vermont' },
  VA: { name: 'Virginia', slug: 'virginia' },
  WA: { name: 'Washington', slug: 'washington' },
  WV: { name: 'West Virginia', slug: 'west-virginia' },
  WI: { name: 'Wisconsin', slug: 'wisconsin' },
  WY: { name: 'Wyoming', slug: 'wyoming' }
}

const getStateColor = (stateAbbr: string, isHovered: boolean) => {
  if (isHovered) return '#3b82f6'
  const colors = ['#1e40af', '#2563eb', '#3b82f6', '#1d4ed8', '#1e3a8a', '#2563eb']
  const hash = stateAbbr.charCodeAt(0) + stateAbbr.charCodeAt(1)
  return colors[hash % colors.length]
}

export default function USAStatesSection() {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [MapCmp, setMapCmp] = useState<React.ComponentType<any> | null>(null)
  const router = useRouter()

  // Import the map only on the client after mount — no next/dynamic, no stale chunks
  useEffect(() => {
    import('@mirawision/usa-map-react')
      .then((mod) => setMapCmp(() => mod.default ?? mod.USAMap))
      .catch(() => {/* map unavailable */})
  }, [])

  const handleStateClick = (stateAbbr: string) => {
    const state = stateData[stateAbbr]
    if (state) router.push(`/usa/${state.slug}/seo-website-development/`)
  }

  const stateCustomStyles = Object.keys(stateData).reduce((acc, stateAbbr) => {
    acc[stateAbbr] = {
      fill: getStateColor(stateAbbr, hoveredState === stateAbbr),
      stroke: 'rgba(255,255,255,0.18)',
      strokeWidth: 1,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      filter: hoveredState === stateAbbr ? 'drop-shadow(0 0 8px rgba(59,130,246,0.8))' : 'none',
      onClick: () => handleStateClick(stateAbbr),
      onMouseEnter: () => setHoveredState(stateAbbr),
      onMouseLeave: () => setHoveredState(null),
    }
    return acc
  }, {} as Record<string, any>)

  const hoveredStateName = hoveredState ? stateData[hoveredState]?.name : null

  return (
    <section className="section svc-section">
      <style>{`
        .wd-usa-chip { display: inline-flex; align-items: center; gap: 8px; background: var(--blue); color: #fff; font-size: 0.95rem; font-weight: 700; padding: 8px 18px; border: 1px solid var(--blue); }
        .wd-usa-chip-wrap { text-align: center; min-height: 40px; margin-bottom: 1.5rem; }
        .wd-usa-map-frame { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); padding: 2rem; }
        .wd-usa-map-inner { width: 100%; max-width: 70%; margin: 0 auto; }
        .wd-usa-map-loading { display: flex; align-items: center; justify-content: center; min-height: 320px; color: rgba(255,255,255,0.3); font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; }
        .wd-usa-hint { display: inline-flex; align-items: flex-start; gap: 8px; font-size: 0.875rem; color: rgba(255,255,255,0.55); line-height: 1.55; margin-top: 1.5rem; }
        .wd-usa-hint svg { color: var(--blue-light); flex-shrink: 0; margin-top: 2px; }
        @media (max-width: 768px) { .wd-usa-map-inner { max-width: 100%; } .wd-usa-map-frame { padding: 1.25rem; } }
      `}</style>

      <div className="section-container">
        <div className="s-header center">
          <div className="eyebrow light">Nationwide Coverage</div>
          <h2 className="s-title light">SEO Website Development Service <span className="blue">By US States</span></h2>
          <p className="s-sub light">Click on your state to learn about our professional <strong style={{ color: '#fff' }}>SEO website development services</strong></p>
        </div>

        <div className="wd-usa-chip-wrap">
          {hoveredStateName && (
            <div className="wd-usa-chip">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              {hoveredStateName}
            </div>
          )}
        </div>

        <div className="wd-usa-map-frame">
          <div className="wd-usa-map-inner">
            {MapCmp ? (
              <MapCmp customStates={stateCustomStyles} width="100%" height="auto" />
            ) : (
              <div className="wd-usa-map-loading">Loading map…</div>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="wd-usa-hint">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Hover and click on any state to explore our SEO website development services
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
