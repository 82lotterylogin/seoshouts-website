'use client'

import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

function SEOMetaWriterClient() {
  // ── STATE ─────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentType: 'Landing Page',
    numberOfVariations: 3,
    isLoading: false,
    error: '',
    results: null as any
  })
  const [usageInfo, setUsageInfo] = useState({
    usageCount: 0,
    maxUsage: 5,
    isLimitReached: false
  })
  const [inputMode, setInputMode] = useState<'manual' | 'url'>('manual')
  const [url, setUrl] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // ── EFFECTS ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsage = sessionStorage.getItem('seo-meta-writer-usage')
      const currentUsage = storedUsage ? parseInt(storedUsage) : 0
      setUsageInfo({ usageCount: currentUsage, maxUsage: 5, isLimitReached: currentUsage >= 5 })
    }
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // ── HANDLERS ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (usageInfo.isLimitReached) {
      setFormData(prev => ({ ...prev, error: 'You have reached the maximum limit of 5 generations. Please try again tomorrow or clear your browser data to reset.' }))
      return
    }
    if (inputMode === 'manual') {
      if (!formData.title.trim()) { setFormData(prev => ({ ...prev, error: 'Please enter a title for your content' })); return }
      if (!formData.content.trim()) { setFormData(prev => ({ ...prev, error: 'Please enter content for context' })); return }
    } else {
      if (!url.trim()) { setFormData(prev => ({ ...prev, error: 'Please enter a URL to analyze' })); return }
    }
    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) { setFormData(prev => ({ ...prev, error: 'Please complete the reCAPTCHA verification' })); return }
    setFormData(prev => ({ ...prev, isLoading: true, error: '', results: null }))
    try {
      const requestBody = inputMode === 'manual'
        ? { title: formData.title, content: formData.content, contentType: formData.contentType, numberOfVariations: formData.numberOfVariations, recaptchaToken, mode: 'manual' }
        : { url, contentType: formData.contentType, numberOfVariations: formData.numberOfVariations, recaptchaToken, mode: 'url' }
      const response = await fetch('/api/generate-meta-tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })
      const data = await response.json()
      if (response.ok && data.success) {
        setFormData(prev => ({ ...prev, isLoading: false, results: data.results }))
        const newUsageCount = usageInfo.usageCount + 1
        sessionStorage.setItem('seo-meta-writer-usage', newUsageCount.toString())
        setUsageInfo({ usageCount: newUsageCount, maxUsage: 5, isLimitReached: newUsageCount >= 5 })
        recaptchaRef.current?.reset()
      } else {
        throw new Error(data.error || 'Failed to generate meta tags')
      }
    } catch (error) {
      setFormData(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : 'Failed to generate meta tags. Please try again.' }))
      recaptchaRef.current?.reset()
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllResults = () => {
    if (!formData.results) return
    let allText = 'Generated Meta Tags:\n\n'
    formData.results.forEach((result: any, i: number) => {
      allText += `Option ${i + 1}:\nTitle: ${result.title}\nDescription: ${result.description}\n\n`
    })
    navigator.clipboard.writeText(allText)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const resetUsageLimit = () => {
    sessionStorage.removeItem('seo-meta-writer-usage')
    setUsageInfo({ usageCount: 0, maxUsage: 5, isLimitReached: false })
    setFormData(prev => ({ ...prev, error: '' }))
  }

  const resetForm = () => {
    setFormData({ title: '', content: '', contentType: 'Landing Page', numberOfVariations: 3, isLoading: false, error: '', results: null })
    setInputMode('manual')
    setUrl('')
    if (recaptchaRef.current) recaptchaRef.current.reset()
  }

  // ── DATA ──────────────────────────────────────────────────────────────────
  const features = [
    { title: 'Instant Multiple Variations', desc: 'Get 5 different options for both title and description with one click. Perfect for A/B testing or finding the right tone.', path: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
    { title: 'Character Count Precision', desc: 'Real-time character counting ensures nothing gets cut off in search results. Separate counts for mobile and desktop display.', path: 'M3 7h18M3 12h18M3 17h12' },
    { title: 'Tone Customization', desc: 'Choose from professional, casual, exciting, authoritative, or other tones to match your brand voice.', path: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6' },
    { title: 'Competitor Analysis Integration', desc: "See what's working for top-ranking pages in your niche and get suggestions that can outperform them.", path: 'M18 20V10M12 20V4M6 20v-6M2 20h20' },
    { title: 'Bulk Generation Capability', desc: 'Upload multiple topics or URLs and generate optimized meta tags for dozens of pages at once.', path: 'M4 4h16v4H4zM4 12h16v4H4zM4 3v18' },
    { title: 'Preview Mode', desc: 'See exactly how your meta tags will look in Google search results before you publish.', path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z' },
  ]

  const userTypes = [
    { title: 'Content Creators and Bloggers', desc: 'Turn "5 Tips for Better Sleep" into "Sleep Like a Baby Tonight: 5 Science-Backed Tips That Actually Work"', path: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { title: 'eCommerce Store Owners', desc: 'Transform boring product descriptions into click-magnets that drive sales and improve search rankings.', path: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0' },
    { title: 'Digital Marketing Agencies', desc: 'Speed up client work without sacrificing quality. Generate options fast, then customize for each brand.', path: 'M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07' },
    { title: 'Small Business Owners', desc: 'Create professional-sounding meta tags without hiring a copywriter or spending hours learning SEO.', path: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10' },
    { title: 'Web Developers', desc: "Add this to your workflow when launching client sites — they'll love the professional touch.", path: 'M16 18l6-6-6-6M8 6l-6 6 6 6' },
  ]

  const scenarios = [
    { title: '"I Have 50 Blog Posts Without Meta Descriptions"', desc: 'Bulk generate descriptions for your entire content library in under an hour instead of spending days writing them manually.', path: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
    { title: '"My Meta Tags Are Getting Zero Clicks"', desc: "AI analyzes what's currently working in your niche and suggests approaches that actually get clicked.", path: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    { title: '"I Can\'t Think of Anything Creative"', desc: 'When your brain is fried, AI provides fresh angles and approaches you hadn\'t considered.', path: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' },
    { title: '"My Client Needs Meta Tags Yesterday"', desc: 'Generate professional options instantly, then customize the winners to match their brand voice.', path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2' },
    { title: '"I\'m Not a Natural Copywriter"', desc: 'Let AI handle the creative heavy lifting while you focus on what you do best.', path: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  ]

  const differentiators = [
    { title: 'Trained on Current SEO Data', desc: "Our AI knows what's working in 2025, not what worked in 2020. It understands current search trends and user behavior.", path: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' },
    { title: 'Context-Aware Generation', desc: "Doesn't just stuff keywords into templates. Understands your content type, audience, and goals.", path: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
    { title: 'Conversion-Focused', desc: 'Optimizes for clicks and user engagement, not just search engine rankings.', path: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    { title: 'Brand Voice Learning', desc: 'The more you use it, the better it gets at matching your specific style and tone.', path: 'M12 1a3 3 0 100 6 3 3 0 000-6zM6 8a6 6 0 1112 0M12 14v7M8 21h8' },
  ]

  const tips = [
    { title: 'Be Specific About Your Content', desc: 'Instead of "marketing tips," try "email marketing tips for small restaurants." More specific input = better output.', path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01' },
    { title: 'Test Multiple Angles', desc: "Don't just take the first suggestion. Try different tones and approaches to see what resonates.", path: 'M4 6h16M4 12h16M4 18h7' },
    { title: 'Include Your Main Benefit', desc: 'Tell the AI what problem your content solves or what benefit readers get.', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { title: 'Consider Your Audience', desc: 'Specify whether you\'re targeting beginners, experts, business owners, consumers, etc.', path: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  ]

  const faqs = [
    { q: 'Will AI-generated meta tags hurt my SEO?', a: 'Not if they\'re good quality and relevant to your content. Search engines care about user experience, and better meta tags improve click-through rates.' },
    { q: 'Can Google tell if meta tags are AI-generated?', a: 'Google cares about quality and relevance, not who or what wrote them. As long as they accurately describe your content, you\'re fine.' },
    { q: 'Should I edit the AI suggestions?', a: 'Usually just minor tweaks are needed. The AI handles the heavy lifting, but you might want to adjust for brand voice or specific details.' },
    { q: 'How many options should I test?', a: 'Start with 3–5 variations and A/B test them if possible. Different audiences respond to different approaches.' },
    { q: 'Can I use this for different languages?', a: 'Yes, our AI supports multiple languages and understands cultural nuances for different markets.' },
    { q: 'Will this replace human copywriters?', a: 'No, but it makes them more efficient. Use AI for speed and volume, humans for strategy and final polish.' },
    { q: 'Is this tool completely free?', a: 'Yes, completely free with no registration required. Generate as many meta tags as you need.' },
  ]

  const relatedTools = [
    {
      name: 'SEO Meta Writer', current: true, href: '/tools/seo-meta-writer/',
      desc: 'Generate compelling meta titles and descriptions for better click-through rates in search.',
      paths: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'],
    },
    {
      name: 'AI Copywriter', current: false, href: '/tools/ai-copywriter/',
      desc: 'Generate high-converting copy for ads, product descriptions, emails, and more with AI.',
      paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'],
    },
    {
      name: 'Blog Ideas Generator', current: false, href: '/tools/blog-ideas-generator/',
      desc: 'Never run out of blog topics with AI-powered idea generation tailored to your niche.',
      paths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'],
    },
    {
      name: 'Keyword Density Analyzer', current: false, href: '/tools/keyword-density-analyzer/',
      desc: 'Analyze keyword density and optimize content for target keywords without over-optimization.',
      paths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
    },
    {
      name: 'Meta Tag Optimizer', current: false, href: '/tools/meta-tag-optimizer/',
      desc: 'Generate perfect title tags and meta descriptions with real-time SERP preview and character counters.',
      paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
    },
  ]

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style jsx global>{`
        .g-recaptcha { transform: scale(0.85); transform-origin: 0 0; }
        @media (max-width: 380px) { .g-recaptcha { transform: scale(0.72); transform-origin: 0 0; } }
        .smw-input, .smw-select, .smw-textarea {
          width: 100%; padding: 0.625rem 0.75rem;
          border: 1px solid var(--line); background: #fff;
          color: var(--ink); font-size: 0.875rem;
          font-family: 'Inter', sans-serif; transition: border-color 0.15s;
        }
        .smw-input:focus, .smw-select:focus, .smw-textarea:focus {
          outline: none; border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .smw-input:disabled, .smw-select:disabled, .smw-textarea:disabled { opacity: 0.5; cursor: not-allowed; }
        .smw-textarea { resize: none; }
        .smw-mode-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 0.5rem 0.75rem; border: 1px solid var(--line);
          background: none; cursor: pointer; font-size: 0.8rem;
          font-weight: 600; color: var(--gray-4);
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          flex: 1; justify-content: center;
        }
        .smw-mode-btn.active { border-color: var(--blue); color: var(--blue); background: rgba(37,99,235,0.04); }
        .smw-mode-btn:hover:not(.active) { border-color: var(--gray-3); color: var(--ink); }
        .smw-copy-btn {
          font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.5rem;
          border: 1px solid var(--line); background: none; cursor: pointer;
          color: var(--blue); transition: background 0.15s;
          font-family: 'Inter', sans-serif; white-space: nowrap;
        }
        .smw-copy-btn:hover { background: var(--blue-pale); }
        .smw-copy-btn.copied { color: var(--green); border-color: var(--green); }
        .smw-gen-btn {
          flex: 1; background: var(--blue); color: #fff;
          font-size: 0.9rem; font-weight: 700; padding: 0.75rem 1.25rem;
          border: none; cursor: pointer; font-family: 'Space Grotesk', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s;
        }
        .smw-gen-btn:hover { background: var(--blue-dark); }
        .smw-gen-btn:disabled { background: var(--gray-3); cursor: not-allowed; }
        .smw-reset-btn {
          background: none; color: var(--gray-5); font-size: 0.875rem;
          font-weight: 600; padding: 0.75rem 1.25rem; border: 1px solid var(--line);
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: border-color 0.15s, color 0.15s;
        }
        .smw-reset-btn:hover { border-color: var(--blue); color: var(--blue); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="tool-hero" id="top">
        <ShapeGrid />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>SEO Meta Writer</span>
          </nav>
          <div className="tool-hero-badge">Free AI Tool</div>
          <h1 className="tool-hero-h1">
            AI SEO Meta Title &amp; <span>Description Writer</span>
          </h1>
          <p className="tool-hero-sub">
            Generate AI-powered meta titles and descriptions that actually get clicks. Our Free SEO Meta Writer creates perfectly optimized, character-aware meta tags tailored to your content type — for better click-through rates from search results.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['AI-Powered Generation', 'Content-Type Aware', 'Character Optimization', '100% Free'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOL INPUT ───────────────────────────────────────────────────────── */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: FORM */}
          <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>

            {/* Usage strip header bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Session Usage
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '72px', height: '3px', background: 'var(--line)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.min((usageInfo.usageCount / usageInfo.maxUsage) * 100, 100)}%`, background: usageInfo.isLimitReached ? 'var(--red)' : 'var(--green)', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--mono, monospace)', color: usageInfo.isLimitReached ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                  {usageInfo.usageCount}/{usageInfo.maxUsage}
                </span>
                {usageInfo.isLimitReached && (
                  <button onClick={resetUsageLimit} style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--blue)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Reset</button>
                )}
              </div>
            </div>

            {/* Form content */}
            <div style={{ padding: '2rem' }}>
              <h2 className="tool-box-heading">AI Meta Tag Generator</h2>
              <p className="tool-box-sub">Describe your content and let AI craft perfectly optimized meta tags.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Input mode */}
                <div>
                  <label className="tool-box-label">Choose Analysis Method</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem' }}>
                    <button type="button" onClick={() => setInputMode('manual')} className={`smw-mode-btn${inputMode === 'manual' ? ' active' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Manual Input
                    </button>
                    <button type="button" onClick={() => setInputMode('url')} className={`smw-mode-btn${inputMode === 'url' ? ' active' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                      Website URL
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-4)', marginTop: '0.3rem' }}>
                    {inputMode === 'manual' ? 'Enter title and content description manually' : 'Analyze content from any webpage automatically'}
                  </p>
                </div>

                {/* Content Type */}
                <div>
                  <label htmlFor="contentType" className="tool-box-label">Content Type</label>
                  <select id="contentType" value={formData.contentType} onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value, error: '' }))} className="smw-select" disabled={formData.isLoading || usageInfo.isLimitReached}>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Service Page">Service Page</option>
                    <option value="Blog Article">Blog Article</option>
                  </select>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-4)', marginTop: '0.3rem' }}>
                    {formData.contentType === 'Landing Page' && 'For homepages and conversion-focused pages'}
                    {formData.contentType === 'Service Page' && 'For service descriptions and business offerings'}
                    {formData.contentType === 'Blog Article' && 'For informational content and guides'}
                  </p>
                </div>

                {/* Variations */}
                <div>
                  <label htmlFor="variations" className="tool-box-label">Number of Variations</label>
                  <select id="variations" value={formData.numberOfVariations} onChange={(e) => setFormData(prev => ({ ...prev, numberOfVariations: parseInt(e.target.value), error: '' }))} className="smw-select" disabled={formData.isLoading || usageInfo.isLimitReached}>
                    <option value={1}>1 Variation</option>
                    <option value={2}>2 Variations</option>
                    <option value={3}>3 Variations</option>
                    <option value={4}>4 Variations</option>
                    <option value={5}>5 Variations</option>
                  </select>
                </div>

                {/* URL mode */}
                {inputMode === 'url' && (
                  <div>
                    <label htmlFor="url" className="tool-box-label">Website URL to Analyze</label>
                    <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/your-page" className="smw-input" disabled={formData.isLoading || usageInfo.isLimitReached} />
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-4)', marginTop: '0.3rem' }}>Enter the URL of the webpage you want to generate meta tags for</p>
                  </div>
                )}

                {/* Manual mode fields */}
                {inputMode === 'manual' && (
                  <>
                    <div>
                      <label htmlFor="title" className="tool-box-label">Content Title</label>
                      <input type="text" id="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, error: '' }))} placeholder="Enter your content title or main topic" className="smw-input" disabled={formData.isLoading || usageInfo.isLimitReached} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                        <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', margin: 0 }}>Enter your main topic</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', margin: 0 }}>{formData.title.length}/100 characters</p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="content" className="tool-box-label">Content Description</label>
                      <textarea id="content" value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value, error: '' }))} placeholder="Describe your content, key benefits, target audience, and what makes it valuable..." rows={4} className="smw-textarea" disabled={formData.isLoading || usageInfo.isLimitReached} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                        <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', margin: 0 }}>Provide context for better AI results</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', margin: 0 }}>{formData.content.length}/500 characters</p>
                      </div>
                    </div>
                  </>
                )}

                {/* reCAPTCHA */}
                <div style={{ borderLeft: '3px solid var(--line)', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.72rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>Human Verification</p>
                  <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} />
                </div>

                {/* Generate + Reset */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={handleSubmit} disabled={formData.isLoading || usageInfo.isLimitReached} className="smw-gen-btn">
                    {formData.isLoading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        Generating AI Meta Tags...
                      </>
                    ) : usageInfo.isLimitReached ? 'Daily Limit Reached' : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Generate {formData.numberOfVariations} AI Meta Tag{formData.numberOfVariations > 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                  <button type="button" onClick={resetForm} className="smw-reset-btn">Reset</button>
                </div>

                {/* Error */}
                {formData.error && (
                  <div style={{ padding: '0.75rem 1rem', borderLeft: '3px solid var(--red)', background: 'rgba(220,38,38,0.05)', fontSize: '0.875rem', color: 'var(--red)', lineHeight: 1.5 }}>
                    {formData.error}
                  </div>
                )}

                {/* Limit / remaining status */}
                {usageInfo.isLimitReached && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--red)', fontFamily: 'var(--mono, monospace)', textAlign: 'center' }}>
                    Session limit reached. Refresh page to continue.
                  </p>
                )}
                {!usageInfo.isLimitReached && usageInfo.usageCount >= 4 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--amber)', fontFamily: 'var(--mono, monospace)', textAlign: 'center' }}>
                    Only {usageInfo.maxUsage - usageInfo.usageCount} generation(s) remaining this session.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS + TIPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Results panel */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0, position: 'sticky', top: '6rem' }}>

              {/* Panel header bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Generated Meta Tags
                </span>
                {formData.results && (
                  <button onClick={copyAllResults} className={`smw-copy-btn${copiedAll ? ' copied' : ''}`}>
                    {copiedAll ? '✓ Copied All!' : 'Copy All'}
                  </button>
                )}
              </div>

              {/* Results content */}
              <div style={{ padding: '1.5rem 2rem 2rem' }}>
                {!formData.results ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                    <div style={{ width: 44, height: 44, background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '0.4rem' }}>Ready to generate meta tags</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-4)', fontFamily: 'var(--mono, monospace)', margin: 0, lineHeight: 1.5 }}>Fill in the details and click &ldquo;Generate&rdquo;</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', fontFamily: 'var(--mono, monospace)', margin: 0 }}>
                      {formData.results.length} variation{formData.results.length > 1 ? 's' : ''} generated
                    </p>
                    {formData.results.map((result: any, index: number) => (
                      <div key={index} style={{ border: '1px solid var(--line)', padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Option {index + 1} — {formData.contentType}
                          </span>
                          <button onClick={() => copyToClipboard(`Title: ${result.title}\nDescription: ${result.description}`, index)} className={`smw-copy-btn${copiedIndex === index ? ' copied' : ''}`}>
                            {copiedIndex === index ? '✓ Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Meta Title</span>
                            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--mono, monospace)', fontWeight: 700, color: result.title.length >= 55 && result.title.length <= 60 ? 'var(--green)' : 'var(--amber)' }}>
                              {result.title.length}/60
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', background: 'var(--gray-1)', border: '1px solid var(--line)', padding: '0.5rem 0.625rem', margin: 0, lineHeight: 1.5 }}>
                            {result.title}
                          </p>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Meta Description</span>
                            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--mono, monospace)', fontWeight: 700, color: result.description.length >= 155 && result.description.length <= 160 ? 'var(--green)' : 'var(--amber)' }}>
                              {result.description.length}/160
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', background: 'var(--gray-1)', border: '1px solid var(--line)', padding: '0.5rem 0.625rem', margin: 0, lineHeight: 1.65, minHeight: '3.5rem' }}>
                            {result.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tips panel */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>

              {/* Panel header bar */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Meta Tag Tips
                </span>
              </div>

              {/* Tips content */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div className="tool-grid-2col" style={{ gap: '1.25rem' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Title Guidelines</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {[
                        <span key="t1">Optimal length: <strong>50–60 characters</strong></span>,
                        <span key="t2">Include main keyword early</span>,
                        <span key="t3">Make it compelling and clickable</span>,
                        <span key="t4">Avoid keyword stuffing</span>,
                      ].map((item, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--gray-5)', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--blue)', flexShrink: 0 }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Description Tips</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {[
                        <span key="d1">Optimal length: <strong>150–160 characters</strong></span>,
                        <span key="d2">Include a clear call-to-action</span>,
                        <span key="d3">Match user search intent</span>,
                        <span key="d4">Avoid duplicate descriptions</span>,
                      ].map((item, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--gray-5)', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--blue)', flexShrink: 0 }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── ABOUT ────────────────────────────────────────────────────────────── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal" style={{ marginBottom: 0 }}>
            <p className="eyebrow">About This Tool</p>
            <h2 className="s-title">Write Perfect Meta Tags in Seconds</h2>
            <p className="s-sub">Generate AI-powered meta titles and descriptions that actually get clicks. Perfect for content creators, agencies, and businesses who want better search results.</p>
          </div>
        </div>
      </section>

      {/* ── INTRO STORY ──────────────────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">The Problem</p>
            <h2 className="s-title">Stop Staring at Blank Screens Trying to Write Meta Tags</h2>
          </div>
          <div className="prose-content reveal">
            <p>
              Picture this: It's 11 PM, you've got 47 blog posts that need meta descriptions, and your brain feels like mush.
              You stare at the blank text box for the fifth time today, typing "Best tips for..." then deleting it because it sounds terrible.
            </p>
            <p><strong>Sound familiar?</strong></p>
            <p>
              I've been there. Spent way too many late nights trying to craft the "perfect" meta description, only to end up with something boring like
              "Learn about our services and how we can help your business grow." Yawn.
            </p>
            <p>
              <strong>Here's what changed everything:</strong> AI that actually understands SEO and writes like a human.
            </p>
            <p>
              Our <strong>AI SEO Meta Title and Description Generator</strong> doesn't just stuff keywords into templates.
              It analyzes your content, understands what makes people click, and creates meta tags that actually work.
            </p>
            <div className="prose-callout">
              <p>Ready to never write another boring meta tag again? Use the tool above.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT THIS TOOL DOES ──────────────────────────────────────────────── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">How It Helps</p>
            <h2 className="s-title">What This AI Tool Actually Does (And Why It's Different)</h2>
          </div>
          <div className="prose-content reveal">
            <p>
              Think of this as having a copywriter who's read every high-performing meta tag on the internet, knows exactly what makes people click, and can write faster than you can type.
            </p>
            <h3>Here's what happens when you use it:</h3>
            <ul>
              <li>Paste your title and content of the page.</li>
              <li>AI analyzes what your page is really about</li>
              <li>Generates multiple title and description options</li>
              <li>Shows you character counts, so nothing gets cut off</li>
              <li>Gives you click-worthy options that actually sound human</li>
            </ul>
            <div className="prose-callout">
              <p><strong>The difference?</strong> Most tools just rearrange your keywords. This AI understands context, user intent, and what actually gets clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY AI WORKS BETTER ──────────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">The Advantage</p>
            <h2 className="s-title">Why AI-Generated Meta Tags Actually Work Better</h2>
          </div>
          <div className="prose-content reveal">
            <p>
              I'll be honest — I was skeptical about AI writing at first. But then I tested AI-generated meta tags against ones I'd written manually, and the results were eye-opening.
            </p>
          </div>
          <div className="why-grid reveal" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
            <div className="why-card">
              <p className="why-card-title">
                <span className="why-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                What AI does better than humans
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  ['Analyzes thousands of successful examples', 'It knows what patterns work'],
                  ["Never gets writer's block", 'No more staring at blank screens for 20 minutes'],
                  ['Tests multiple angles instantly', 'Get 5 different approaches in seconds'],
                  ['Optimizes for both search engines and humans', 'The sweet spot most people miss'],
                  ['Stays consistent', 'No "phoning it in" on the 47th meta description'],
                ].map(([bold, rest], i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-5)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>+</span>
                    <span><strong style={{ color: 'var(--ink)' }}>{bold}</strong> — {rest}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="why-card">
              <p className="why-card-title">
                <span className="why-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                </span>
                What I still do better than AI
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  ['Know my brand voice intimately', 'Though AI is getting scary good at this'],
                  ['Understand specific industry nuances', 'But I can teach the AI these'],
                  ['Make final editorial decisions', 'AI gives options, I pick winners'],
                ].map(([bold, rest], i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-5)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--blue)', fontWeight: 700, flexShrink: 0 }}>→</span>
                    <span><strong style={{ color: 'var(--ink)' }}>{bold}</strong> — {rest}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1.5rem', padding: '0.875rem 1rem', background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', borderLeft: '3px solid var(--blue)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--blue-dark)', margin: 0, fontWeight: 600 }}>
                  The magic happens when you combine AI speed with human judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Under the Hood</p>
            <h2 className="s-title">How Our AI Meta Tag Generator Actually Works</h2>
          </div>
          <div className="steps-grid reveal" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              {
                num: '01',
                title: 'Smart Content Analysis',
                desc: "The AI reads your entire page and figures out what it's actually about — main topics, user intent, competitive landscape, and trending phrases in your niche.",
                tip: 'So you get meta tags that match what your page actually delivers.',
              },
              {
                num: '02',
                title: 'Multiple Creative Angles',
                desc: 'Instead of one option, get benefit-focused, question-based, number-driven, authority-building, and problem-solving approaches — all tailored to your content.',
                tip: 'Because different approaches work for different audiences and search intents.',
              },
              {
                num: '03',
                title: 'Real-Time Optimization',
                desc: 'Character counts, keyword placement, action words, emotional triggers, and brand voice — all automatically calibrated so every option is ready to use.',
                tip: 'Titles under 60 chars, descriptions under 160 — every time, guaranteed.',
              },
            ].map((step, i) => (
              <div key={i} className="step-card">
                {i < 2 && (
                  <div className="step-connector">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                )}
                <div className="step-num-big">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                <div className="step-tip">{step.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ─────────────────────────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Features</p>
            <h2 className="s-title">Key Features That Make This Tool Essential</h2>
          </div>
          <div className="features-grid reveal">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.path} />
                  </svg>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO USES THIS ────────────────────────────────────────────────────── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Who It's For</p>
            <h2 className="s-title">Who Actually Uses This Tool?</h2>
          </div>
          <div className="features-grid reveal">
            {userTypes.map((u, i) => (
              <div key={i} className="feature-card" style={{
                borderRight: (i % 3 === 2 || i === 4) ? 'none' : '1px solid var(--line)',
                borderBottom: i >= 3 ? 'none' : '1px solid var(--line)',
              }}>
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={u.path} />
                  </svg>
                </div>
                <h3 className="feature-title">{u.title}</h3>
                <p className="feature-desc">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMON SCENARIOS ─────────────────────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Real Situations</p>
            <h2 className="s-title">Common Scenarios Where This Tool Saves Your Sanity</h2>
          </div>
          <div className="features-grid reveal">
            {scenarios.map((s, i) => (
              <div key={i} className="feature-card" style={{
                borderRight: (i % 3 === 2 || i === 4) ? 'none' : '1px solid var(--line)',
                borderBottom: i >= 3 ? 'none' : '1px solid var(--line)',
              }}>
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path} />
                  </svg>
                </div>
                <h3 className="feature-title">{s.title}</h3>
                <p className="feature-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES AI DIFFERENT ──────────────────────────────────────────── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Our Difference</p>
            <h2 className="s-title">What Makes Our AI Different from Generic Tools</h2>
          </div>
          <div className="why-grid reveal" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
            {differentiators.map((d, i) => (
              <div key={i} className="why-card">
                <p className="why-card-title">
                  <span className="why-card-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d.path} />
                    </svg>
                  </span>
                  {d.title}
                </p>
                <p className="why-card-body">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK TIPS ───────────────────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">Best Practices</p>
            <h2 className="s-title">Quick Tips for Getting the Best Results</h2>
          </div>
          <div className="why-grid reveal" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
            {tips.map((t, i) => (
              <div key={i} className="why-card">
                <p className="why-card-title">
                  <span className="why-card-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={t.path} />
                    </svg>
                  </span>
                  {t.title}
                </p>
                <p className="why-card-body">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header reveal">
            <p className="eyebrow">FAQ</p>
            <h2 className="s-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list reveal">
            {faqs.map((faq, i) => (
              <details key={i} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS ────────────────────────────────────────────────────── */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Explore Our Other <span className="blue">SEO Tools</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO and content tools designed to help you optimize, rank, and create better content.
            </p>
          </div>
          <div className="related-tools-grid reveal">
            {relatedTools.map((tool) => (
              <div key={tool.name} className={`related-card${tool.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    {tool.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="related-card-name"><a href={tool.href}>{tool.name}</a></div>
                <div className="related-card-desc">{tool.desc}</div>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {tool.current ? 'Current tool' : 'Free — no login'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Never Write Another Boring <span>Meta Tag Again</span></h2>
          <p className="final-cta-sub">
            Stop struggling with blank screens and boring meta descriptions. Let AI handle the creative
            heavy lifting while you focus on growing your business.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', fontWeight: 600, maxWidth: 640, margin: '0 auto 2rem', textAlign: 'center', lineHeight: 1.7 }}>
            Our AI Meta Title and Description Generator gives you professional-quality options in seconds, not hours.
          </p>

          <div className="tool-grid-2col" style={{ gap: '1rem', maxWidth: 680, margin: '0 auto 2rem', textAlign: 'left' }}>
            {[
              { title: 'Generate Meta Tags Now', desc: 'Create perfectly optimized meta tags instantly — completely free, no account required.' },
              { title: 'Works for Any Content Type', desc: 'Landing pages, service pages, blog articles — optimized character counts for every format.' },
            ].map((card) => (
              <div key={card.title} style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="final-cta-row">
            <a href="#top" className="btn-primary">Generate Meta Tags Now</a>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {['AI-powered — completely free', 'No signup required · instant results', 'Built by SEO professionals'].map((p) => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SEOMetaWriterClient
