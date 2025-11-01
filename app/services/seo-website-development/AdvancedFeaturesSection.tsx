'use client'

import { useState } from 'react'

const advancedFeatures = {
  'Technical SEO Excellence': {
    description: 'From Years of Experience',
    icon: '⚙️',
    features: [
      { emoji: '📋', name: 'JSON-LD Structured Data', desc: 'Implementation using schemas proven effective over years' },
      { emoji: '🗺️', name: 'XML Sitemaps', desc: 'Priority & frequency settings optimised through years of crawl analysis' },
      { emoji: '🤖', name: 'Robots.txt Optimisation', desc: 'Best practices evolved through years of bot behaviour study' },
      { emoji: '🔗', name: 'Canonical URL Management', desc: 'Techniques refined through duplicate content challenges' },
      { emoji: '🌐', name: 'Hreflang Implementation', desc: 'For multi-language Indian markets based on years of international SEO' },
      { emoji: '📱', name: 'Open Graph & Social Media', desc: 'Strategies developed over years of social integration' }
    ]
  },
  'Performance Optimisation': {
    description: 'Proven Techniques',
    icon: '⚡',
    features: [
      { emoji: '🖼️', name: 'Image Compression', desc: 'Next-gen format conversion improving Core Web Vitals' },
      { emoji: '📦', name: 'CSS & JavaScript Optimisation', desc: 'Minification techniques mastered over years' },
      { emoji: '💾', name: 'Browser Caching', desc: 'Cache strategies proven effective across Indian hosting' },
      { emoji: '🌍', name: 'CDN Integration', desc: 'Optimised for Indian cities based on years of data' },
      { emoji: '🗄️', name: 'Database Query Optimisation', desc: 'Techniques from hundreds of custom builds' },
      { emoji: '⏳', name: 'Lazy Loading', desc: 'UX patterns observed over a decade' }
    ]
  },
  'User Experience Enhancements': {
    description: 'Conversion-Focused Design',
    icon: '💡',
    features: [
      { emoji: '🧭', name: 'Intuitive Navigation', desc: 'Designed for Indian user behaviour patterns' },
      { emoji: '🎯', name: 'Call-to-Action Placement', desc: 'Based on conversion data from years of testing' },
      { emoji: '📈', name: 'Conversion-Focused Design', desc: 'Proven effective across Indian markets' },
      { emoji: '♿', name: 'Accessibility Compliance', desc: 'WCAG 2.1 AA with SEO considerations' },
      { emoji: '🌐', name: 'Cross-Browser Compatibility', desc: 'Tested across popular Indian browsers' },
      { emoji: '📲', name: 'PWA Capabilities', desc: 'Enhanced mobile experience for Indian users' }
    ]
  }
}

export default function AdvancedFeaturesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Technical SEO Excellence')

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technical SEO Excellence': {
        gradient: 'from-blue-500 to-indigo-600',
        hover: 'hover:bg-blue-500/10',
        border: 'border-blue-400',
        text: 'text-blue-400',
        bg: 'bg-blue-500/10'
      },
      'Performance Optimisation': {
        gradient: 'from-purple-500 to-pink-600',
        hover: 'hover:bg-purple-500/10',
        border: 'border-purple-400',
        text: 'text-purple-400',
        bg: 'bg-purple-500/10'
      },
      'User Experience Enhancements': {
        gradient: 'from-green-500 to-teal-600',
        hover: 'hover:bg-green-500/10',
        border: 'border-green-400',
        text: 'text-green-400',
        bg: 'bg-green-500/10'
      }
    }
    return colors[category as keyof typeof colors]
  }

  const selectedData = advancedFeatures[selectedCategory as keyof typeof advancedFeatures]
  const colors = getCategoryColor(selectedCategory)

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
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
              </svg>
              <span className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Advanced Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">
                Advanced SEO Features
              </span>
              <br/>
              <span className="bg-gradient-to-r from-blue-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Mastered Over the Years
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Comprehensive <strong className="text-white">SEO implementation</strong> refined through over 13 years of experience
            </p>
          </div>

          {/* Two Column Layout: 60% Features (Left) | 40% Categories (Right) */}
          <div className="grid lg:grid-cols-5 gap-8">

            {/* LEFT COLUMN - Features List (60% = 3/5) */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>

                <div className="relative">
                  {/* Category Title */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{selectedData.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{selectedCategory}</h3>
                      <p className="text-sm text-blue-200">{selectedData.description}</p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedData.features.map((feature) => (
                      <div
                        key={feature.name}
                        className={`group/feature relative overflow-hidden bg-white/5 ${colors.hover} backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                      >
                        <div className="relative flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{feature.emoji}</span>
                          <div>
                            <h4 className="font-bold text-white mb-1 text-sm">{feature.name}</h4>
                            <p className="text-xs text-blue-200">{feature.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Category Selector (40% = 2/5) */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sticky top-4">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>

                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                    </svg>
                    Feature Categories
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(advancedFeatures).map(([category, data]) => {
                      const categoryColors = getCategoryColor(category)
                      const isSelected = selectedCategory === category

                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-br ${categoryColors.gradient} border-2 ${categoryColors.border} shadow-lg scale-105`
                              : `bg-white/5 border-2 border-white/10 ${categoryColors.hover} hover:border-white/20`
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 ${isSelected ? 'bg-white/20' : `bg-gradient-to-br ${categoryColors.gradient}`} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <span className="text-2xl">{data.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white text-sm sm:text-base truncate">{category}</div>
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

                  {/* Total Features Count */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Total Features</span>
                      <span className="font-bold text-white text-lg">18+</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-blue-300">Years Experience</span>
                      <span className="font-bold text-white">13+</span>
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
