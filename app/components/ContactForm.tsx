// app/components/ContactForm.tsx
'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    service: '',
    budget: '',
    message: '',
    isLoading: false,
    isSuccess: false,
    error: ''
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value, 
      error: '', 
      isSuccess: false 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      setFormData(prev => ({ ...prev, error: 'Please fill in all required fields.' }))
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    
    if (!recaptchaToken) {
      setFormData(prev => ({ ...prev, error: 'Please complete the reCAPTCHA verification.' }))
      return
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: '', isSuccess: false }))

    try {
      const response = await fetch('/api/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          recaptchaToken: recaptchaToken
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          website: '',
          service: '',
          budget: '',
          message: '',
          isLoading: false,
          isSuccess: true,
          error: ''
        })
        
        recaptchaRef.current?.reset()
        
        setTimeout(() => {
          setFormData(prev => ({ ...prev, isSuccess: false }))
        }, 5000)
      } else {
        throw new Error(data.error || 'Submission failed')
      }
    } catch (error) {
      setFormData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Submission failed. Please try again.' 
      }))
      
      recaptchaRef.current?.reset()
    }
  }

  if (formData.isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully! 🎉</h3>
          <p className="text-gray-600">
            Thank you for contacting us! We'll review your request and get back to you within 24 hours with your free SEO analysis.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Get Your Free SEO Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={formData.isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={formData.isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={formData.isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 12345 67890"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              disabled={formData.isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your company name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            disabled={formData.isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Service Interested In
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              disabled={formData.isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a service</option>
              <option value="local-seo">Local SEO</option>
              <option value="ecommerce-seo">eCommerce SEO</option>
              <option value="website-development">SEO Website Development</option>
              <option value="technical-audit">Technical SEO Audit</option>
              <option value="link-building">Link Building</option>
              <option value="seo-consulting">SEO Consulting</option>
              <option value="not-sure">Not Sure - Need Guidance</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              disabled={formData.isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select budget range</option>
              <option value="under-25k">Under ₹25,000</option>
              <option value="25k-50k">₹25,000 - ₹50,000</option>
              <option value="50k-100k">₹50,000 - ₹1,00,000</option>
              <option value="100k-200k">₹1,00,000 - ₹2,00,000</option>
              <option value="above-200k">Above ₹2,00,000</option>
              <option value="discuss">Discuss Budget</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Tell Us About Your Goals *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            disabled={formData.isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What are your main SEO goals? What challenges are you facing? Any specific questions?"
          ></textarea>
        </div>

        {/* reCAPTCHA */}
        <div className="flex justify-center pt-4">
          <div className="bg-gray-50 rounded-lg p-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              theme="light"
            />
          </div>
        </div>

        {/* Error Message */}
        {formData.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
            {formData.error}
          </div>
        )}

        <button
          type="submit"
          disabled={formData.isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-lg font-bold hover:scale-105 transition transform shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {formData.isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Your Message...
            </span>
          ) : (
            '🎯 Get My Free SEO Analysis'
          )}
        </button>
      </form>
    </div>
  )
}
