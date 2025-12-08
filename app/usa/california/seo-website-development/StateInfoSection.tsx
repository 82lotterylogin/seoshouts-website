import React from 'react'
import { getStateInfo } from '../../stateData'

interface StateInfoSectionProps {
  stateSlug: string
}

export default function StateInfoSection({ stateSlug }: StateInfoSectionProps) {
  const stateInfo = getStateInfo(stateSlug)

  if (!stateInfo) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Why Choose {stateInfo.name} for SEO Website Development?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {stateInfo.businessEnvironment}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stateInfo.population}</div>
              <div className="text-gray-700 font-semibold">Population</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{stateInfo.gdp}</div>
              <div className="text-gray-700 font-semibold">GDP</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">91%</div>
              <div className="text-gray-700 font-semibold">Digital Adoption</div>
            </div>
          </div>

          {/* Major Industries */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Major Industries</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stateInfo.majorIndustries.map((industry, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-800">{industry}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Opportunities */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">SEO Opportunities in {stateInfo.name}</h3>
            <div className="space-y-4">
              {stateInfo.seoOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-gray-700">{opportunity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Markets */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Markets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stateInfo.keyMarkets.map((market, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                  <p className="text-gray-800 font-medium">{market}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
