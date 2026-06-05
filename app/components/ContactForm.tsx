'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ReCAPTCHA from 'react-google-recaptcha'

export default function ContactForm() {
  const searchParams = useSearchParams()
  const region = searchParams.get('region') // 'usa' or null

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    service: '',
    budget: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const generalBudgetOptions = [
    { value: 'under-25k', label: 'Under INR 25,000' },
    { value: '25k-50k', label: 'INR 25,000 - INR 50,000' },
    { value: '50k-100k', label: 'INR 50,000 - INR 100,000' },
    { value: '100k-200k', label: 'INR 100,000 - INR 200,000' },
    { value: 'above-200k', label: 'Above INR 200,000' },
    { value: 'discuss', label: 'Discuss Budget' },
  ]

  const generalBudgetOptionsUSA = [
    { value: 'under-300', label: 'Under $300' },
    { value: '300-600', label: '$300 - $600' },
    { value: '600-1200', label: '$600 - $1,200' },
    { value: '1200-2400', label: '$1,200 - $2,400' },
    { value: 'above-2400', label: 'Above $2,400' },
    { value: 'discuss', label: 'Discuss Budget' },
  ]

  const websiteDevelopmentBudgetOptions = [
    { value: 'website-static', label: 'SEO Optimised Static Website - INR 8,500' },
    { value: 'website-backend', label: 'SEO Optimised Website with Backend - INR 21,000' },
    { value: 'website-ecommerce', label: 'SEO Optimised eCommerce Website - INR 42,000' },
    { value: 'discuss', label: 'Discuss Custom Website Budget' },
  ]

  const websiteDevelopmentBudgetOptionsUSA = [
    { value: 'website-static-usa', label: 'SEO Optimized Static Website - $100' },
    { value: 'website-backend-usa', label: 'SEO Optimized Website with Backend - $250' },
    { value: 'website-ecommerce-usa', label: 'SEO Optimized eCommerce Website - $500' },
    { value: 'discuss', label: 'Discuss Custom Website Budget' },
  ]
  
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'service') {
      setFormData(prev => {
        const isWebsiteDevelopment = value === 'website-development'
        const budgetIsWebsiteSpecific = websiteDevelopmentBudgetOptions.some(option => option.value === prev.budget)

        return {
          ...prev,
          service: value,
          budget: isWebsiteDevelopment || budgetIsWebsiteSpecific ? '' : prev.budget,
        }
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
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
      const response = await fetch('/api/contact-submit', {
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
          name: '',
          email: '',
          phone: '',
          company: '',
          website: '',
          service: '',
          budget: '',
          message: ''
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
    <>
      {submitStatus === 'success' && (
        <div className="ct-form-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Sent &mdash; we will reply within 24 hours.</span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="ct-form-error">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="ct-form-grid">
          <div className="ct-field">
            <label htmlFor="cf-name" className="ct-label">Name <span className="req">*</span></label>
            <input type="text" id="cf-name" name="name" required className="ct-input" placeholder="Your full name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="ct-field">
            <label htmlFor="cf-email" className="ct-label">Email <span className="req">*</span></label>
            <input type="email" id="cf-email" name="email" required className="ct-input" placeholder="you@company.com" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="ct-field">
            <label htmlFor="cf-phone" className="ct-label">Phone <span className="opt">OPTIONAL</span></label>
            <input type="tel" id="cf-phone" name="phone" className="ct-input" placeholder="+91 8094888157" value={formData.phone} onChange={handleInputChange} />
          </div>
          <div className="ct-field">
            <label htmlFor="cf-company" className="ct-label">Company <span className="opt">OPTIONAL</span></label>
            <input type="text" id="cf-company" name="company" className="ct-input" placeholder="Your company" value={formData.company} onChange={handleInputChange} />
          </div>
          <div className="ct-field full">
            <label htmlFor="cf-website" className="ct-label">Website</label>
            <input type="url" id="cf-website" name="website" className="ct-input" placeholder="https://yourdomain.com" value={formData.website} onChange={handleInputChange} />
          </div>
          <div className="ct-field">
            <label htmlFor="cf-service" className="ct-label">Service needed</label>
            <select id="cf-service" name="service" className="ct-select" value={formData.service} onChange={handleInputChange}>
              <option value="">Select a service</option>
              <option value="local-seo">Local SEO</option>
              <option value="ecommerce-seo">eCommerce SEO</option>
              <option value="website-development">SEO Website Development</option>
              <option value="technical-audit">Technical SEO Audit</option>
              <option value="link-building">Link Building</option>
              <option value="seo-consulting">SEO Consulting</option>
              <option value="not-sure">Not sure yet</option>
            </select>
          </div>
          <div className="ct-field">
            <label htmlFor="cf-budget" className="ct-label">Monthly budget</label>
            <select id="cf-budget" name="budget" className="ct-select" value={formData.budget} onChange={handleInputChange}>
              <option value="">Select budget range</option>
              {(() => {
                const isUSA = region === 'usa'
                const isWebDev = formData.service === 'website-development'
                const options = isWebDev
                  ? (isUSA ? websiteDevelopmentBudgetOptionsUSA : websiteDevelopmentBudgetOptions)
                  : (isUSA ? generalBudgetOptionsUSA : generalBudgetOptions)
                return options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
              })()}
            </select>
          </div>
          <div className="ct-field full">
            <label htmlFor="cf-message" className="ct-label">Tell us more <span className="req">*</span></label>
            <textarea id="cf-message" name="message" required className="ct-textarea" placeholder="Goals, current rankings, where you're stuck, anything else we should know&hellip;" value={formData.message} onChange={handleInputChange} />
          </div>
        </div>

        <div className="ct-captcha">
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
            <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} theme="light" />
          ) : (
            <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.82rem', color: 'var(--amber)' }}>
              reCAPTCHA temporarily unavailable &mdash; form submission still enabled.
            </div>
          )}
        </div>

        <div className="ct-form-actions">
          <p className="ct-privacy">
            By submitting, you agree to our <a href="/privacy-policy/">privacy policy</a>. We never share your details.
          </p>
          <button type="submit" disabled={isSubmitting} className={`ct-submit-btn${submitStatus === 'success' ? ' success' : ''}`}>
            {isSubmitting ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                Sending&hellip;
              </>
            ) : (
              <>
                Send enquiry
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
