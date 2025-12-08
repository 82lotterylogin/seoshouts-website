'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import the USA map to avoid SSR issues
const USAMap = dynamic(() => import('@mirawision/usa-map-react'), { ssr: false })

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

// Color gradient for states - from blue to cyan
const getStateColor = (stateAbbr: string, isHovered: boolean) => {
  if (isHovered) return '#3b82f6' // Bright blue on hover

  // Create a colorful gradient effect based on state position
  const colors = [
    '#1e40af', // Dark blue
    '#2563eb', // Blue
    '#3b82f6', // Lighter blue
    '#06b6d4', // Cyan
    '#0891b2', // Dark cyan
    '#0e7490', // Teal
  ]

  // Use state abbreviation to determine color (simple hash)
  const hash = stateAbbr.charCodeAt(0) + stateAbbr.charCodeAt(1)
  return colors[hash % colors.length]
}

export default function USAStatesSection() {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const router = useRouter()

  // Handle state click
  const handleStateClick = (stateAbbr: string) => {
    const state = stateData[stateAbbr]
    if (state) {
      router.push(`/usa/${state.slug}/seo-website-development/`)
    }
  }

  // Handle state hover
  const handleStateHover = (stateAbbr: string) => {
    setHoveredState(stateAbbr)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredState(null)
  }

  // Create custom styles for each state with click handlers
  const stateCustomStyles = Object.keys(stateData).reduce((acc, stateAbbr) => {
    acc[stateAbbr] = {
      fill: getStateColor(stateAbbr, hoveredState === stateAbbr),
      stroke: '#1e293b',
      strokeWidth: 1,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      filter: hoveredState === stateAbbr ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'none',
      onClick: () => handleStateClick(stateAbbr),
      onMouseEnter: () => handleStateHover(stateAbbr),
      onMouseLeave: handleMouseLeave,
    }
    return acc
  }, {} as Record<string, any>)

  const hoveredStateName = hoveredState ? stateData[hoveredState]?.name : null

  return (
    <section className="relative py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg mb-6">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Nationwide Coverage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">
                SEO Website Development Service
              </span>
              <br/>
              <span className="bg-gradient-to-r from-blue-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                By US States
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Click on your state to learn about our professional <strong className="text-white">SEO website development services</strong>
            </p>
          </div>

          {/* Hover State Display */}
          {hoveredStateName && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl border border-white/20 backdrop-blur-xl">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span className="text-white font-bold text-lg">{hoveredStateName}</span>
              </div>
            </div>
          )}

          {/* Interactive USA Map */}
          <div className="relative">
            <div className="w-full max-w-[70%] mx-auto">
              <USAMap
                customStates={stateCustomStyles}
                width="100%"
                height="auto"
              />
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm sm:text-base">
                <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                Hover and click on any state to explore our SEO website development services
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
