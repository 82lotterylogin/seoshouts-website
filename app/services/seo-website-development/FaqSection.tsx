'use client'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

const categorizedFaqs = {
  general: [
    {
      question: 'What makes SEO website development different from regular web design?',
      answer: "Regular web design focuses on visuals; SEO website development focuses on visibility. We build every site structure, URL, and content block for speed, indexing, and conversions — ensuring design and SEO work hand in hand."
    },
    {
      question: 'Why is SEO-first development important for my business?',
      answer: "Without SEO foundations, your site might look great but remain invisible in search. SEO-first development ensures that your investment starts driving organic traffic and qualified leads from day one."
    },
    {
      question: 'Do you offer SEO-friendly development for WordPress, Shopify, or custom builds?',
      answer: "Absolutely. We work with WordPress, Shopify, and custom PHP/Next.js frameworks — all optimized for performance, Core Web Vitals, and structured data. You get both flexibility and ranking power."
    },
    {
      question: 'How is SEO website development different from regular website development?',
      answer: "SEO website development ensures that SEO is integrated directly into the website's structure, content, and design from the very beginning. Unlike regular websites, which may need SEO optimization later, an SEO-developed website is built to rank from day one, with optimized URL structures, mobile-first design, fast load times, and SEO-friendly coding practices tailored for Indian businesses."
    },
    {
      question: 'Will you help optimize my website for mobile users?',
      answer: "Yes! All our websites are designed with mobile-first in mind. With a majority of internet traffic coming from mobile devices, we ensure that your India-focused website is responsive, loads quickly, and provides an optimal experience across all screen sizes and devices."
    },
    {
      question: 'How do you ensure that my website ranks well on Google?',
      answer: "Our SEO website development process includes optimizing your site for critical SEO factors like page speed, core web vitals, structured data (schema markup), and internal linking. We also ensure your content is optimized for both user intent and Google's algorithms to help you rank higher for relevant search queries in Indian markets."
    },
    {
      question: 'Will the website be optimized for local SEO and location-based searches?',
      answer: 'Absolutely. We focus on local SEO optimization, which is crucial for Indian businesses targeting customers in specific geographic locations. From integrating location-based keywords to optimizing your Google My Business profile and creating location-specific landing pages, we ensure that your website ranks well for relevant local searches in India.'
    }
  ],
  technical: [
    {
      question: 'How do you optimize websites for Core Web Vitals and speed?',
      answer: "We build lightweight pages, compress media, preload critical CSS, and use clean code. Our goal: a Lighthouse score of 90+ and <2.5s LCP — even on 4G networks in India."
    },
    {
      question: 'Do you implement schema markup and structured data?',
      answer: "Yes. We add JSON-LD schema for services, FAQs, breadcrumbs, and local business. This improves click-through rates and visibility in Google's rich results."
    },
    {
      question: 'Can you migrate my existing site without losing SEO rankings?',
      answer: "Definitely. We audit your old URLs, set up 301 redirects, preserve meta data, and ensure seamless indexing — so you keep your traffic while upgrading to a faster, cleaner site."
    },
    {
      question: 'Do you build mobile-first websites?',
      answer: "Every site we create is fully responsive and optimized for mobile speed. With over 80% of Indian traffic on smartphones, this is a must for SEO success."
    },
    {
      question: 'Do you also handle the technical aspects of SEO for my website?',
      answer: "Yes, technical SEO is a crucial part of the SEO website development process. We focus on optimizing the back-end structure of your website, ensuring that it's crawlable, fast-loading, secure (with HTTPS), and follows best practices for technical SEO. This includes creating an XML sitemap, optimizing robots.txt, and setting up structured data to help search engines understand your website better."
    },
    {
      question: 'How do you ensure that my website is fast and optimized for performance?',
      answer: 'Website speed is crucial for SEO and user experience. We use a combination of image compression, code minification, caching strategies, and CDN integration to ensure your website loads quickly. Additionally, we optimize your website for Core Web Vitals, which is an important ranking factor for Google.'
    }
  ],
  pricing: [
    {
      question: "What's included in each SEO website package and what's extra?",
      answer: "Each plan covers full design, development, and on-page SEO. Higher tiers include backend integration, eCommerce setup, and extended support. Extra costs apply only for add-ons like custom plugins, premium themes, or content writing."
    },
    {
      question: 'How long does it take to complete an SEO-optimized website?',
      answer: "Typically 4–6 weeks, depending on features and content volume. You'll receive a detailed timeline after the audit."
    },
    {
      question: 'How long does it take to develop an SEO-optimized website?',
      answer: "The development timeline depends on the complexity of your website, but typically, it takes about 4-6 weeks for a fully SEO-optimized website to be completed. This includes stages like research, design, development, content optimization, and testing. We'll keep you updated throughout the process to ensure the website aligns with your Indian business goals."
    },
    {
      question: 'What kind of support do you offer after launch?',
      answer: "Every project includes post-launch support — 30 days for static, 60 for dynamic, and 90 for eCommerce sites. You'll get technical assistance, minor edits, and SEO health checks."
    },
    {
      question: 'Will you provide support after my website is developed?',
      answer: "Yes! We provide post-launch support to ensure your Indian business website continues to perform well. This includes monitoring SEO performance, troubleshooting any issues, and offering guidance on how to update or add new content to maintain your rankings."
    },
    {
      question: 'What payment options are available?',
      answer: "We accept UPI, Paytm, NetBanking, and all major Indian payment gateways. For international clients, PayPal and wire transfer options are also available."
    }
  ],
  content: [
    {
      question: 'Will you help with SEO content and keyword research?',
      answer: "Yes — we can handle everything from keyword strategy to SEO-optimized copywriting. Every page is crafted around real search intent and semantic keywords to boost visibility."
    },
    {
      question: "How can I track my website's performance after it goes live?",
      answer: "You'll receive Google Analytics and Search Console setup along with monthly reports highlighting impressions, clicks, rankings, and Core Web Vitals metrics."
    },
    {
      question: "Do you design websites optimized for local SEO and 'near me' searches?",
      answer: "Absolutely. We integrate Google Business Profile, NAP data, and local schema to help you rank for city- and region-specific searches."
    },
    {
      question: 'Do you provide content for the website, or should I supply it?',
      answer: 'We can assist with SEO-optimized content creation, including writing compelling copy with targeted keywords, meta descriptions, and headlines for Indian audiences. However, if you already have content, we can work with your existing material to optimize it for both SEO and user engagement.'
    },
    {
      question: 'Will my website be built with future SEO updates in mind?',
      answer: "Absolutely. We build websites with scalability and future-proofing in mind, ensuring they remain optimized even as SEO trends and Google algorithms evolve. Whether it's adopting new SEO techniques or preparing for major algorithm changes, your Indian business website will be ready for the future."
    }
  ]
}

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState<'general' | 'technical' | 'pricing' | 'content'>('general')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    package: 'bronze',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
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

    // Get reCAPTCHA token before setting submitting state
    let recaptchaToken = 'recaptcha_disabled'
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && recaptchaRef.current) {
      // Check if user already completed the checkbox
      const existingToken = recaptchaRef.current.getValue()
      if (!existingToken) {
        setErrorMessage('Please complete the reCAPTCHA verification.')
        setSubmitStatus('error')
        return
      }
      recaptchaToken = existingToken
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
          service: 'website-development',
          budget: formData.package,
          recaptchaToken
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          website: '',
          package: 'bronze',
          message: ''
        })
        // Reset reCAPTCHA
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
        // Reset reCAPTCHA on error
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      // Reset reCAPTCHA on error
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Comprehensive SEO Website Development Service Related FAQs
            </h2>
            <p className="text-lg text-slate-600">
              Common questions about our SEO development service in India
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left Column - FAQs with Tabs */}
            <div>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
                <button
                  onClick={() => {setActiveTab('general'); setOpenIndex(null)}}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'general'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  General FAQs
                </button>
                <button
                  onClick={() => {setActiveTab('technical'); setOpenIndex(null)}}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'technical'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Technical FAQs
                </button>
                <button
                  onClick={() => {setActiveTab('pricing'); setOpenIndex(null)}}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'pricing'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pricing & Delivery
                </button>
                <button
                  onClick={() => {setActiveTab('content'); setOpenIndex(null)}}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'content'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Content & Growth
                </button>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {categorizedFaqs[activeTab].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-400 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors duration-200"
                    >
                      <span className={`font-semibold text-base ${openIndex === index ? 'text-blue-600' : 'text-slate-900'}`}>
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0 ml-4">
                        {openIndex === index ? (
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </div>
                    </button>

                    {openIndex === index && (
                      <div className="px-5 pb-5 pt-2 text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Form */}
            <div id="faq-contact" className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Get Your Free SEO Analysis
              </h3>
              <p className="text-slate-600 mb-6">
                Start your India SEO website development journey today
              </p>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Package Selection */}
                <div>
                  <label htmlFor="package" className="block text-sm font-medium text-slate-700 mb-2">
                    Select Service Package
                  </label>
                  <select
                    id="package"
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="website-static-india">SEO Optimised Static Website - ₹8,500</option>
                    <option value="website-backend-india">SEO Optimised Website with Backend - ₹21,000</option>
                    <option value="website-ecommerce-india">SEO Optimised eCommerce Website - ₹42,000</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Tell Us About Your Goals *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="What are your main SEO goals? What challenges are you facing?"
                  />
                </div>

                {/* reCAPTCHA */}
                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Get My Free SEO Analysis'
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
