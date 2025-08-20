'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    website: '',
    email: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.website || !formData.email) {
      setErrorMessage('Please fill in all required fields.')
      setSubmitStatus('error')
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !recaptchaToken) {
      setErrorMessage('Please complete the reCAPTCHA verification.')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/inquiry-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: recaptchaToken || 'recaptcha_disabled'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          website: '',
          email: ''
        })
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Thank you! We'll send you a detailed SEO report within 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Website SEO Analysis Inquiry">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg" aria-hidden="true">🌐</span>
            </div>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 text-gray-800 placeholder-gray-500 font-medium text-base sm:text-lg transition-all duration-300 shadow-lg"
              required
              disabled={isSubmitting}
              aria-label="Website URL for SEO analysis"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg" aria-hidden="true">📧</span>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 text-gray-800 placeholder-gray-500 font-medium text-base sm:text-lg transition-all duration-300 shadow-lg"
              required
              disabled={isSubmitting}
              aria-label="Your email address for detailed report"
            />
          </div>
          
          {/* reCAPTCHA */}
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                theme="light"
              />
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-yellow-800 text-sm">
                ⚠️ reCAPTCHA is temporarily unavailable. Form submission is still enabled.
              </p>
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 overflow-hidden w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            aria-label="Get detailed SEO report"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Request...
                </>
              ) : (
                <>
                  📊 GET A DETAILED REPORT
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}