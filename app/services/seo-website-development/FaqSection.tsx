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

const TAB_LABELS: Record<string, string> = {
  general:   'General FAQs',
  technical: 'Technical FAQs',
  pricing:   'Pricing & Delivery',
  content:   'Content & Growth',
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
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.')
      setSubmitStatus('error')
      return
    }
    let recaptchaToken = 'recaptcha_disabled'
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && recaptchaRef.current) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, service: 'website-development', budget: formData.package, recaptchaToken }),
      })
      const result = await response.json()
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', website: '', package: 'bronze', message: '' })
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
    <section className="section faq-section">
      <style>{`
        @keyframes wd-faqOpen {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wd-faq-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .wd-faq-tabs { display: flex; gap: 0; margin-bottom: 0; border: 1px solid var(--line); border-bottom: none; }
        .wd-faq-tab { flex: 1; padding: 10px 6px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; border: none; background: transparent; cursor: pointer; color: var(--gray-5); border-right: 1px solid var(--line); border-bottom: 3px solid transparent; transition: color 0.18s, border-color 0.18s; }
        .wd-faq-tab:last-child { border-right: none; }
        .wd-faq-tab:hover { color: var(--ink); }
        .wd-faq-tab.wd-faq-tab-on { color: var(--blue); border-bottom-color: var(--blue); background: rgba(37,99,235,0.03); }
        .wd-faq-list-wrap { border: 1px solid var(--line); }
        .wd-faq-item { border-bottom: 1px solid var(--line); }
        .wd-faq-item:last-child { border-bottom: none; }
        .wd-faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; background: transparent; border: none; cursor: pointer; text-align: left; transition: background 0.18s; }
        .wd-faq-q:hover { background: var(--gray-1); }
        .wd-faq-q-text { font-size: 0.925rem; font-weight: 600; color: var(--ink); line-height: 1.45; }
        .wd-faq-item.wd-faq-open .wd-faq-q-text { color: var(--blue); }
        .wd-faq-chevron { flex-shrink: 0; width: 18px; height: 18px; color: var(--gray-5); transition: transform 0.22s, color 0.18s; }
        .wd-faq-item.wd-faq-open .wd-faq-chevron { transform: rotate(180deg); color: var(--blue); }
        .wd-faq-a { padding: 0 1.5rem 1.25rem; font-size: 0.875rem; color: var(--ink-2); line-height: 1.7; animation: wd-faqOpen 0.22s ease both; }
        /* Contact form */
        .wd-faq-form-card { border: 1px solid var(--line); background: #fff; padding: 2.25rem 2rem; position: sticky; top: 100px; }
        .wd-faq-form-title { font-size: 1.25rem; font-weight: 700; color: var(--ink); margin-bottom: 0.375rem; }
        .wd-faq-form-sub { font-size: 0.875rem; color: var(--gray-5); margin-bottom: 1.5rem; }
        .wd-form-field { margin-bottom: 1rem; }
        .wd-form-label { display: block; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink); margin-bottom: 0.375rem; }
        .wd-form-input { width: 100%; padding: 10px 14px; border: 1px solid var(--line); background: #fff; font-size: 0.875rem; color: var(--ink); outline: none; transition: border-color 0.18s; font-family: inherit; }
        .wd-form-input:focus { border-color: var(--blue); }
        .wd-form-input::placeholder { color: var(--gray-5); }
        .wd-form-textarea { resize: vertical; min-height: 96px; }
        .wd-form-submit { width: 100%; padding: 13px 20px; background: var(--blue); color: #fff; font-size: 0.9rem; font-weight: 700; border: none; cursor: pointer; transition: background 0.2s; font-family: inherit; margin-top: 0.5rem; }
        .wd-form-submit:hover:not(:disabled) { background: var(--blue-dark); }
        .wd-form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .wd-form-submit-loading { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .wd-form-alert { padding: 12px 14px; font-size: 0.825rem; line-height: 1.5; margin-bottom: 1rem; }
        .wd-form-alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
        .wd-form-alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
        @media (max-width: 960px) {
          .wd-faq-layout { grid-template-columns: 1fr; gap: 2.5rem; }
          .wd-faq-form-card { position: static; }
        }
        @media (max-width: 540px) {
          .wd-faq-tabs { flex-wrap: wrap; }
          .wd-faq-tab { flex: 1 1 40%; }
        }
      `}</style>

      <div className="section-container">
        <div className="s-header">
          <div className="eyebrow">FAQs</div>
          <h2 className="s-title">Comprehensive SEO Website Development <span className="blue">Service Related FAQs</span></h2>
          <p className="s-sub">Common questions about our SEO development service in India</p>
        </div>

        <div className="wd-faq-layout">
          {/* Left: FAQ accordion with tabs */}
          <div>
            <div className="wd-faq-tabs" role="tablist" aria-label="FAQ categories">
              {(Object.keys(TAB_LABELS) as Array<keyof typeof TAB_LABELS>).map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`wd-faq-tab${activeTab === tab ? ' wd-faq-tab-on' : ''}`}
                  onClick={() => { setActiveTab(tab as any); setOpenIndex(null) }}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            <div className="wd-faq-list-wrap">
              {categorizedFaqs[activeTab].map((faq, index) => (
                <div
                  key={index}
                  className={`wd-faq-item${openIndex === index ? ' wd-faq-open' : ''}`}
                >
                  <button className="wd-faq-q" onClick={() => toggleFaq(index)} aria-expanded={openIndex === index}>
                    <span className="wd-faq-q-text">{faq.question}</span>
                    <svg className="wd-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="wd-faq-a">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact form */}
          <div id="faq-contact" className="wd-faq-form-card">
            <div className="wd-faq-form-title">Get Your Free SEO Analysis</div>
            <p className="wd-faq-form-sub">Start your India SEO website development journey today</p>

            {submitStatus === 'success' && (
              <div className="wd-form-alert wd-form-alert-success">
                Thank you! Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="wd-form-alert wd-form-alert-error">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="wd-form-field">
                <label htmlFor="wd-name" className="wd-form-label">Full Name *</label>
                <input
                  type="text" id="wd-name" name="name" required
                  value={formData.name} onChange={handleInputChange}
                  className="wd-form-input" placeholder="Your full name"
                />
              </div>
              <div className="wd-form-field">
                <label htmlFor="wd-email" className="wd-form-label">Email Address *</label>
                <input
                  type="email" id="wd-email" name="email" required
                  value={formData.email} onChange={handleInputChange}
                  className="wd-form-input" placeholder="your@email.com"
                />
              </div>
              <div className="wd-form-field">
                <label htmlFor="wd-phone" className="wd-form-label">Phone Number</label>
                <input
                  type="tel" id="wd-phone" name="phone"
                  value={formData.phone} onChange={handleInputChange}
                  className="wd-form-input" placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="wd-form-field">
                <label htmlFor="wd-website" className="wd-form-label">Website URL</label>
                <input
                  type="url" id="wd-website" name="website"
                  value={formData.website} onChange={handleInputChange}
                  className="wd-form-input" placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="wd-form-field">
                <label htmlFor="wd-package" className="wd-form-label">Select Service Package</label>
                <select
                  id="wd-package" name="package"
                  value={formData.package} onChange={handleInputChange}
                  className="wd-form-input"
                >
                  <option value="website-static-india">SEO Optimised Static Website - ₹8,500</option>
                  <option value="website-backend-india">SEO Optimised Website with Backend - ₹21,000</option>
                  <option value="website-ecommerce-india">SEO Optimised eCommerce Website - ₹42,000</option>
                </select>
              </div>
              <div className="wd-form-field">
                <label htmlFor="wd-message" className="wd-form-label">Tell Us About Your Goals *</label>
                <textarea
                  id="wd-message" name="message" rows={4} required
                  value={formData.message} onChange={handleInputChange}
                  className="wd-form-input wd-form-textarea"
                  placeholder="What are your main SEO goals? What challenges are you facing?"
                />
              </div>

              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="wd-form-submit"
              >
                {isSubmitting ? (
                  <span className="wd-form-submit-loading">
                    <svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
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
    </section>
  )
}
