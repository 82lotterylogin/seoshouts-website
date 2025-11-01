'use client'
import { useEffect, useRef, useState } from 'react'

export default function CoreWebVitalsScore() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left Column - Heading */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                SEOShouts Helps You Achieve <span className="text-blue-600">Perfect Core Web Vitals Score</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                These are Google's official ranking factors. We guarantee every site launches with "Good" scores.
              </p>
            </div>

            {/* Right Column - Circular Metrics */}
            <div className="flex justify-center lg:justify-end gap-8 lg:gap-10 flex-wrap lg:items-start lg:pt-16">

            {/* LCP Circle */}
            <div className="flex flex-col items-center group p-3">
              <div className="relative w-36 h-36 mb-4">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-full blur-md opacity-50"></div>

                {/* Background Circle */}
                <svg className="w-36 h-36 transform -rotate-90 relative z-10">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="white"
                  />
                  {/* Animated Progress Circle with Gradient */}
                  <defs>
                    <linearGradient id="lcpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="url(#lcpGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="402.12"
                    strokeDashoffset={isVisible ? "40.212" : "402.12"}
                    strokeLinecap="round"
                    className="transition-all duration-[2500ms] ease-out drop-shadow-lg"
                  />
                </svg>
                {/* Score Text with Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <svg className="w-6 h-6 text-green-600 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xl font-bold text-green-600">&lt;2.5s</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">LCP</h3>
              <p className="text-xs text-slate-500 text-center">Loading Performance</p>
            </div>

            {/* CLS Circle */}
            <div className="flex flex-col items-center group p-3">
              <div className="relative w-36 h-36 mb-4">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full blur-md opacity-50"></div>

                {/* Background Circle */}
                <svg className="w-36 h-36 transform -rotate-90 relative z-10">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="white"
                  />
                  {/* Animated Progress Circle with Gradient */}
                  <defs>
                    <linearGradient id="clsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="url(#clsGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="402.12"
                    strokeDashoffset={isVisible ? "20.106" : "402.12"}
                    strokeLinecap="round"
                    className="transition-all duration-[2500ms] ease-out delay-300 drop-shadow-lg"
                  />
                </svg>
                {/* Score Text with Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <svg className="w-6 h-6 text-blue-600 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xl font-bold text-blue-600">&lt;0.1</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">CLS</h3>
              <p className="text-xs text-slate-500 text-center">Visual Stability</p>
            </div>

            {/* INP Circle */}
            <div className="flex flex-col items-center group p-3">
              <div className="relative w-36 h-36 mb-4">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full blur-md opacity-50"></div>

                {/* Background Circle */}
                <svg className="w-36 h-36 transform -rotate-90 relative z-10">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="white"
                  />
                  {/* Animated Progress Circle with Gradient */}
                  <defs>
                    <linearGradient id="inpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="url(#inpGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="402.12"
                    strokeDashoffset={isVisible ? "36.19" : "402.12"}
                    strokeLinecap="round"
                    className="transition-all duration-[2500ms] ease-out delay-500 drop-shadow-lg"
                  />
                </svg>
                {/* Score Text with Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <svg className="w-6 h-6 text-indigo-600 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-lg font-bold text-indigo-600">&lt;200ms</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">INP</h3>
              <p className="text-xs text-slate-500 text-center">Responsiveness</p>
            </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
