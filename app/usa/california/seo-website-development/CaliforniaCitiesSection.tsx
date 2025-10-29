'use client'

import { useState } from 'react'

const californiaRegions = {
  'Northern California': {
    description: 'Silicon Valley, Bay Area & Sacramento',
    cities: [
      'San Francisco', 'San Jose', 'Oakland', 'Sacramento', 'Fremont',
      'Sunnyvale', 'Santa Clara', 'Hayward', 'Concord', 'Santa Rosa',
      'Roseville', 'Elk Grove'
    ]
  },
  'Southern California': {
    description: 'Los Angeles, San Diego & Orange County',
    cities: [
      'Los Angeles', 'San Diego', 'Anaheim', 'Long Beach', 'Irvine',
      'Santa Ana', 'Chula Vista', 'Santa Clarita', 'Riverside', 'Glendale',
      'Huntington Beach', 'Oxnard', 'Moreno Valley', 'Ontario', 'Oceanside',
      'Garden Grove', 'Lancaster', 'Palmdale', 'Corona', 'Escondido',
      'Victorville', 'Fullerton', 'Torrance', 'Orange', 'Pasadena',
      'Simi Valley', 'Thousand Oaks', 'Pomona'
    ]
  },
  'Central California': {
    description: 'Central Valley & Agricultural Hub',
    cities: [
      'Fresno', 'Bakersfield', 'Stockton', 'Modesto', 'Salinas',
      'Visalia', 'Clovis'
    ]
  },
  'Inland Empire': {
    description: 'Riverside & San Bernardino Counties',
    cities: [
      'San Bernardino', 'Fontana', 'Rancho Cucamonga'
    ]
  }
}

export default function CaliforniaCitiesSection() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Northern California')

  const getRegionColor = (region: string) => {
    const colors = {
      'Northern California': {
        gradient: 'from-blue-500 to-indigo-600',
        hover: 'hover:bg-blue-500/10',
        border: 'border-blue-400',
        text: 'text-blue-400',
        bg: 'bg-blue-500/10'
      },
      'Southern California': {
        gradient: 'from-indigo-500 to-purple-600',
        hover: 'hover:bg-indigo-500/10',
        border: 'border-indigo-400',
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/10'
      },
      'Central California': {
        gradient: 'from-green-500 to-teal-600',
        hover: 'hover:bg-green-500/10',
        border: 'border-green-400',
        text: 'text-green-400',
        bg: 'bg-green-500/10'
      },
      'Inland Empire': {
        gradient: 'from-orange-500 to-red-600',
        hover: 'hover:bg-orange-500/10',
        border: 'border-orange-400',
        text: 'text-orange-400',
        bg: 'bg-orange-500/10'
      }
    }
    return colors[region as keyof typeof colors]
  }

  const selectedData = californiaRegions[selectedRegion as keyof typeof californiaRegions]
  const colors = getRegionColor(selectedRegion)

  return (
    <section className="relative py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg mb-6">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Statewide Coverage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">
                California SEO Website Development Service
              </span>
              <br/>
              <span className="bg-gradient-to-r from-blue-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                By Major Cities
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Professional <strong className="text-white">SEO website development</strong> tailored to your city's unique market and search landscape
            </p>
          </div>

          {/* Two Column Layout: 60% Cities (Left) | 40% Regions (Right) */}
          <div className="grid lg:grid-cols-5 gap-8">

            {/* LEFT COLUMN - Cities List (60% = 3/5) */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>

                <div className="relative">
                  {/* Region Title */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{selectedRegion}</h3>
                      <p className="text-sm text-blue-200">{selectedData.cities.length} Cities Available</p>
                    </div>
                  </div>

                  {/* Cities Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedData.cities.map((city) => (
                      <a
                        key={city}
                        href={`#`}
                        className={`group/city relative overflow-hidden bg-white/5 ${colors.hover} backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-lg p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                      >
                        <div className="relative flex items-center gap-2">
                          <svg className={`w-4 h-4 ${colors.text} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-sm font-semibold text-white group-hover/city:text-blue-300 transition-colors truncate">
                            {city}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Region Selector (40% = 2/5) */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sticky top-4">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>

                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                    Select Region
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(californiaRegions).map(([region, data]) => {
                      const regionColors = getRegionColor(region)
                      const isSelected = selectedRegion === region

                      return (
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(region)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-br ${regionColors.gradient} border-2 ${regionColors.border} shadow-lg scale-105`
                              : `bg-white/5 border-2 border-white/10 ${regionColors.hover} hover:border-white/20`
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${isSelected ? 'bg-white/20' : `bg-gradient-to-br ${regionColors.gradient}`} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white text-sm sm:text-base truncate">{region}</div>
                              <div className="text-xs text-blue-200 truncate">{data.description}</div>
                            </div>
                            {isSelected && (
                              <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Total Cities Count */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Total California Cities</span>
                      <span className="font-bold text-white text-lg">
                        {Object.values(californiaRegions).reduce((acc, region) => acc + region.cities.length, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
