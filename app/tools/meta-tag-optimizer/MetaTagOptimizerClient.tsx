'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

export default function MetaTagOptimizerClient() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    keywords: '',
    url: 'https://example.com',
    author: '',
    viewport: 'width=device-width, initial-scale=1'
  })

  const [copied, setCopied] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Generate optimized meta tags
  const generateMetaTags = () => {
    const escapedTitle = form.title.replace(/"/g, '&quot;')
    const escapedDescription = form.description.replace(/"/g, '&quot;')
    const escapedKeywords = form.keywords.replace(/"/g, '&quot;')
    const escapedAuthor = form.author.replace(/"/g, '&quot;')
    const escapedUrl = form.url.replace(/"/g, '&quot;')

    return `<!-- Essential Meta Tags -->
<title>${escapedTitle}</title>
<meta name="description" content="${escapedDescription}" />
<meta name="keywords" content="${escapedKeywords}" />
<meta name="author" content="${escapedAuthor}" />
<meta name="viewport" content="${form.viewport}" />
<link rel="canonical" href="${escapedUrl}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${escapedUrl}" />
<meta property="og:title" content="${escapedTitle}" />
<meta property="og:description" content="${escapedDescription}" />
<meta property="og:image" content="${escapedUrl}/og-image.jpg" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${escapedUrl}" />
<meta property="twitter:title" content="${escapedTitle}" />
<meta property="twitter:description" content="${escapedDescription}" />
<meta property="twitter:image" content="${escapedUrl}/twitter-image.jpg" />

<!-- Additional SEO Meta Tags -->
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />
<meta name="revisit-after" content="1 days" />
<meta name="distribution" content="global" />
<meta name="rating" content="general" />
<meta http-equiv="Cache-Control" content="public" />`
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    const metaTags = generateMetaTags()
    navigator.clipboard.writeText(metaTags).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Calculate character counts and status
  const getTitleStatus = () => {
    const length = form.title.length
    if (length === 0) return { color: 'text-gray-400', message: 'Enter a title' }
    if (length < 30) return { color: 'text-yellow-600', message: 'Too short (30-60 chars recommended)' }
    if (length <= 60) return { color: 'text-green-600', message: 'Optimal length' }
    return { color: 'text-red-600', message: 'Too long (may be truncated)' }
  }

  const getDescriptionStatus = () => {
    const length = form.description.length
    if (length === 0) return { color: 'text-gray-400', message: 'Enter a description' }
    if (length < 120) return { color: 'text-yellow-600', message: 'Too short (120-160 chars recommended)' }
    if (length <= 160) return { color: 'text-green-600', message: 'Optimal length' }
    return { color: 'text-red-600', message: 'Too long (may be truncated)' }
  }

  const titleStatus = getTitleStatus()
  const descriptionStatus = getDescriptionStatus()

  const statusColor = (tailwindColor: string) => {
    if (tailwindColor === 'text-green-600') return 'var(--green)'
    if (tailwindColor === 'text-yellow-600') return 'var(--amber)'
    if (tailwindColor === 'text-red-600') return 'var(--red)'
    return 'var(--gray-4)'
  }

  return (
    <>
      {/* --- TOOL HERO --- */}
      <div id="top" className="tool-hero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.35)', pointerEvents: 'none' }} />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Meta Tag Optimizer</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Meta Tag Generator <span>&amp; Optimizer</span>
          </h1>
          <p className="tool-hero-sub">
            Craft title tags and meta descriptions that get clicked. Our{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Free Meta Tag Optimizer</strong>{' '}
            delivers real-time SERP preview, smart character count guidance, and ready-to-paste meta tag code &mdash; so every page you publish is search-engine ready from day one.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Live SERP Preview', 'Character Count Validation', 'Complete Meta Tag Code', '100% Free'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TOOL INPUT SECTION --- */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT BOX: Page Information */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Page Information</h2>

            {/* Page Title */}
            <label className="tool-box-label" htmlFor="meta-title">Page Title *</label>
            <input
              type="text"
              id="meta-title"
              className="tool-url-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter your page title..."
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', color: statusColor(titleStatus.color) }}>{titleStatus.message}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-4)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{form.title.length}/60</span>
            </div>

            {/* Meta Description */}
            <label className="tool-box-label" htmlFor="meta-desc">Meta Description *</label>
            <textarea
              id="meta-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Enter your meta description..."
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                color: 'var(--ink)', outline: 'none', lineHeight: 1.6, marginBottom: '0.35rem'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: statusColor(descriptionStatus.color) }}>{descriptionStatus.message}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-4)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{form.description.length}/160</span>
            </div>

            {/* Keywords */}
            <label className="tool-box-label" htmlFor="meta-keywords">Keywords</label>
            <input
              type="text"
              id="meta-keywords"
              className="tool-url-input"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3..."
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>Separate keywords with commas</p>

            {/* Page URL */}
            <label className="tool-box-label" htmlFor="meta-url">Page URL *</label>
            <input
              type="url"
              id="meta-url"
              className="tool-url-input"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com/page"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>Used for canonical and Open Graph URL tags</p>

            {/* Author */}
            <label className="tool-box-label" htmlFor="meta-author">Author</label>
            <input
              type="text"
              id="meta-author"
              className="tool-url-input"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Author name"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>Page author name for the author meta tag</p>

            {/* Viewport */}
            <label className="tool-box-label" htmlFor="meta-viewport">Viewport</label>
            <select
              id="meta-viewport"
              value={form.viewport}
              onChange={(e) => setForm({ ...form, viewport: e.target.value })}
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'var(--ink)',
                outline: 'none', background: 'var(--white)', marginBottom: '0.35rem', cursor: 'pointer'
              }}
            >
              <option value="width=device-width, initial-scale=1">Responsive (Recommended)</option>
              <option value="width=1024">Fixed Width (1024px)</option>
              <option value="width=768">Tablet Width (768px)</option>
            </select>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: 0 }}>Controls how the page scales on different devices</p>
          </div>

          {/* RIGHT BOX: Preview & Output */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Preview &amp; Output</h2>

            {/* SERP Preview */}
            {form.title && form.description ? (
              <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Google SERP Preview
                </div>
                <div style={{ maxWidth: 480 }}>
                  <div style={{ color: '#1a0dab', fontSize: '1.05rem', fontWeight: 400, marginBottom: '0.2rem', cursor: 'pointer', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {form.title}
                  </div>
                  <div style={{ color: '#006621', fontSize: '0.82rem', marginBottom: '0.25rem', fontFamily: 'Arial, sans-serif' }}>
                    {form.url} &#9660;
                  </div>
                  <div style={{ color: '#545454', fontSize: '0.85rem', lineHeight: 1.5, fontFamily: 'Arial, sans-serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {form.description}
                  </div>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: '0.75rem', marginBottom: 0 }}>This is how your page will appear in Google search results</p>
              </div>
            ) : (
              <div style={{ background: 'var(--gray-1)', border: '1px solid var(--line)', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>Google SERP Preview</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-4)', margin: 0 }}>Enter a title and description to see your SERP preview</p>
              </div>
            )}

            {/* Generated Meta Tags */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="tool-box-label" style={{ marginBottom: 0 }}>Generated Meta Tags</label>
              {(form.title && form.description) && (
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '6px 14px', background: 'var(--blue)', color: '#fff',
                    border: 'none', fontSize: '0.75rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div style={{ background: '#111318', padding: '1.25rem', overflowX: 'auto', fontSize: '0.77rem', fontFamily: 'JetBrains Mono, monospace', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              <pre style={{ color: '#86efac', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {form.title || form.description ? generateMetaTags() : '<!-- Enter title and description to generate meta tags -->'}
              </pre>
            </div>

            {/* reCAPTCHA */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                onChange={handleCaptchaChange}
                theme="light"
              />
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', textAlign: 'center', margin: 0 }}>
              Meta tags are generated in real-time as you type
            </p>
          </div>

        </div>
      </div>

      {/* --- OVERVIEW --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">Generate Optimized Meta Tags <span className="blue">for Better SEO</span></h2>
          </div>
          <div className="prose-content">
            <p>
              Create compelling title tags and meta descriptions that get clicked. Our free tool includes real-time SERP preview, character count validation, and generates complete meta tag code for your website.
            </p>
            <p>
              Perfect for SEO professionals, web developers, and content creators who want to optimize their pages for search engines and improve click-through rates from Google.
            </p>

            <h3>Why meta tags matter for SEO:</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem', margin: '1rem 0 1.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>Search Engine Benefits</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { bold: 'Better Rankings:', rest: ' Well-crafted meta tags help search engines understand your content' },
                    { bold: 'Higher CTR:', rest: ' Compelling descriptions increase click-through rates from search results' },
                    { bold: 'Rich Snippets:', rest: ' Proper meta tags can trigger enhanced search result features' },
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>&#10003;</span>
                      <span style={{ fontSize: '0.88rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>
                        <strong>{item.bold}</strong>{item.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>User Experience Benefits</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { bold: 'Clear Expectations:', rest: ' Users know what to expect before clicking your link' },
                    { bold: 'Better Sharing:', rest: ' Social media platforms use meta tags for link previews' },
                    { bold: 'Professional Appearance:', rest: ' Complete meta tags make your site look more credible' },
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>&#10003;</span>
                      <span style={{ fontSize: '0.88rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>
                        <strong>{item.bold}</strong>{item.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="prose-callout">
              <div className="prose-callout-title">Create SEO-Perfect Meta Tags</div>
              <p>Craft title tags and meta descriptions that get clicked &mdash; with live preview, character validation, and ready-to-paste code for every page.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- USE CASES --- */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Use Cases</div>
            <h2 className="s-title">Perfect for <span className="blue">Every Website</span></h2>
          </div>
          <div className="features-grid">
            {[
              {
                iconPaths: ['M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
                title: 'Business Websites',
                desc: 'Optimize your company pages, service descriptions, and product listings for better search visibility and higher click-through rates.',
              },
              {
                iconPaths: ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
                title: 'eCommerce Stores',
                desc: 'Create compelling product page meta tags that drive more organic traffic and increase sales from search engines.',
              },
              {
                iconPaths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
                title: 'Blog Content',
                desc: 'Optimize blog posts and articles with meta tags that accurately describe your content and attract more readers.',
              },
              {
                iconPaths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
                title: 'Landing Pages',
                desc: 'Create high-converting meta tags for landing pages that improve both SEO performance and user engagement.',
              },
              {
                iconPaths: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
                title: 'News & Media',
                desc: 'Generate compelling meta tags for news articles and media content that drive engagement and social sharing.',
              },
              {
                iconPaths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
                title: 'SEO Agencies',
                desc: 'Streamline your meta tag optimization process for client websites with real-time preview and validation.',
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.iconPaths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.75rem 0 0' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW TO USE --- */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How To Use</div>
            <h2 className="s-title">How Our Meta Tag Optimizer <span className="blue">Works</span></h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { n: '01', title: 'Enter Your Content', desc: 'Input your page title, meta description, keywords, and URL. Our tool provides real-time character count and optimization suggestions.' },
              { n: '02', title: 'Preview SERP Appearance', desc: 'See exactly how your page will appear in Google search results with our live SERP preview feature.' },
              { n: '03', title: 'Generate Complete Code', desc: 'Get ready-to-use HTML meta tag code including Open Graph and Twitter Card tags for social media sharing.' },
            ].map((s, i) => (
              <div key={s.n} className="step-card">
                {i < 2 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
                  </div>
                )}
                <div className="step-num-big">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ADVANCED FEATURES --- */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Advanced Features That Make <span className="blue">This Tool Essential</span></h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: '3rem' }}>
            {[
              {
                title: 'Smart Character Validation',
                iconPaths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
                body: 'Real-time validation ensures your titles (30-60 chars) and descriptions (120-160 chars) are optimal length.',
              },
              {
                title: 'Complete Meta Tag Set',
                iconPaths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
                body: 'Generates essential meta tags, Open Graph tags for social sharing, and Twitter Card markup.',
              },
              {
                title: 'Live SERP Preview',
                iconPaths: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
                body: 'See exactly how your page will appear in Google search results before publishing.',
              },
              {
                title: 'SEO Best Practices',
                iconPaths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                body: 'Built-in optimization guidelines help you create meta tags that follow SEO best practices.',
              },
              {
                title: 'One-Click Copy',
                iconPaths: ['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z'],
                body: 'Copy the generated HTML code to your clipboard with a single click for easy implementation.',
              },
              {
                title: 'Social Media Ready',
                iconPaths: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'],
                body: 'Includes Open Graph and Twitter Card tags for optimal social media sharing appearance.',
              },
            ].map((card) => (
              <div key={card.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {card.iconPaths.map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <div className="why-card-body">{card.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
            <p className="s-sub">Everything you need to know about meta tags and this optimizer.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'Are meta tags really important for SEO?', a: 'Yes, absolutely! Meta tags directly impact click-through rates and help search engines understand your content.' },
              { q: 'Can I use this for client projects?', a: "Absolutely! It's great for agencies, freelancers, and professionals optimizing client websites." },
              { q: "What's the ideal title tag length?", a: 'Keep titles between 30-60 characters. Our tool shows real-time character counts with color-coded validation.' },
              { q: 'How do I implement the generated code?', a: "Copy the HTML code and paste it in your page's <head> section, or use SEO plugins like Yoast." },
              { q: 'Do I need keywords in meta descriptions?', a: 'Include your primary keyword naturally, but write for humans first. Avoid keyword stuffing.' },
              { q: 'Are social media tags included?', a: 'Yes, we generate Open Graph and Twitter Card tags for optimal social media sharing.' },
            ].map(faq => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- RELATED TOOLS --- */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Free Tools</div>
            <h2 className="s-title">More Tools in the <span className="blue">SEOShouts Suite</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              { name: 'Meta Tag Optimizer', desc: 'Craft title tags and meta descriptions that get clicked, with live SERP preview.', current: true, href: '/tools/meta-tag-optimizer/', paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
              { name: 'On-Page SEO Analyzer', desc: 'Score any URL across 150+ on-page ranking signals with real PageSpeed data.', href: '/tools/on-page-seo-analyzer/', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
              { name: 'Keyword Density Analyzer', desc: 'Analyze keyword usage and optimize content for SEO without stuffing.', href: '/tools/keyword-density-analyzer/', paths: ['M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z'] },
              { name: 'Schema Generator', desc: 'Build structured data markup for 39+ schema types — no coding required.', href: '/tools/schema-generator/', paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'] },
              { name: 'Robots.txt Generator', desc: 'Control how AI and web crawlers access your site with precision.', href: '/tools/robots-txt-generator/', paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'] },
            ].map(t => (
              <div key={t.name} className={`related-card${t.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {t.paths.map((d, i) => <path key={i} d={d} />)}
                  </svg>
                </div>
                <div className="related-card-name"><a href={t.href}>{t.name}</a></div>
                <div className="related-card-desc">{t.desc}</div>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {t.current ? 'Current tool' : 'Free — no login'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Ready to Optimize <span>Your Meta Tags?</span></h2>
          <p className="final-cta-sub">
            Join thousands of SEO professionals and website owners who use our free meta tag optimizer to improve their search rankings and click-through rates.
          </p>
          <div className="final-cta-row">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary"
            >
              Start Optimizing Now
            </button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {[
              'Better CTR — Increase click-through rates with optimized meta descriptions',
              'Instant Results — Generate and preview meta tags in real-time',
              'Completely Free — No limits, no registration required',
            ].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
