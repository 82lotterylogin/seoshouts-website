'use client'

import { useState, useRef, useEffect } from 'react'
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

  // Import existing meta tags from a live URL to audit/improve them
  const [importUrl, setImportUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // Tool chaining: on-page analyzer links here with ?import=<url> — auto-load its tags
  useEffect(() => {
    const chained = new URLSearchParams(window.location.search).get('import')
    if (chained) {
      setImportUrl(chained)
      importFromUrl(chained)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const importFromUrl = async (overrideUrl?: string) => {
    const target = (overrideUrl ?? importUrl).trim()
    if (!target) return
    setImporting(true)
    setImportMsg(null)
    try {
      const res = await fetch('/api/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.includes('://') ? target : `https://${target}` }),
      })
      const data = await res.json()
      if (!res.ok || !data.html) throw new Error(data.error || 'Could not fetch that page')
      const doc = new DOMParser().parseFromString(data.html, 'text/html')
      const meta = (name: string) =>
        doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
        doc.querySelector(`meta[property="${name}"]`)?.getAttribute('content') || ''
      const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || data.finalUrl || target
      setForm({
        title: doc.querySelector('title')?.textContent?.trim() || meta('og:title'),
        description: meta('description') || meta('og:description'),
        keywords: meta('keywords'),
        author: meta('author'),
        url: canonical,
        viewport: meta('viewport') || 'width=device-width, initial-scale=1',
      })
      setImportMsg({ ok: true, text: 'Imported. Existing tags are loaded below — edit and re-generate.' })
    } catch (err) {
      setImportMsg({ ok: false, text: err instanceof Error ? err.message : 'Import failed. Check the URL and try again.' })
    } finally {
      setImporting(false)
    }
  }

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

  // Pixel-width measurement — Google truncates titles at ~600px (desktop) and
  // descriptions at ~920px, rendered in Arial. Canvas measureText gives the
  // real cut point; character counts are only an approximation.
  const TITLE_PX_LIMIT = 600
  const DESC_PX_LIMIT = 920
  const [titlePx, setTitlePx] = useState(0)
  const [descPx, setDescPx] = useState(0)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = '20px Arial'
    setTitlePx(Math.round(ctx.measureText(form.title).width))
    ctx.font = '14px Arial'
    setDescPx(Math.round(ctx.measureText(form.description).width))
  }, [form.title, form.description])

  const pxMeter = (px: number, limit: number) => ({
    pct: Math.min(100, (px / limit) * 100),
    over: px > limit,
    color: px > limit ? 'var(--red)' : px > limit * 0.9 ? 'var(--amber)' : 'var(--green)',
  })
  const titleMeter = pxMeter(titlePx, TITLE_PX_LIMIT)
  const descMeter = pxMeter(descPx, DESC_PX_LIMIT)

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
            {['Live SERP Preview', 'Import From Any URL', 'Pixel-Width Validation', '100% Free'].map(label => (
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

            {/* Import from URL */}
            <label className="tool-box-label" htmlFor="import-url">Import From Existing Page (Optional)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <input
                type="url"
                id="import-url"
                className="tool-url-input"
                style={{ flex: 1 }}
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') importFromUrl() }}
                placeholder="yoursite.com/page — load its current meta tags"
              />
              <button
                onClick={() => importFromUrl()}
                disabled={importing || !importUrl.trim()}
                style={{
                  padding: '0 18px', background: importing || !importUrl.trim() ? 'var(--gray-3)' : 'var(--ink)',
                  color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.82rem',
                  fontFamily: 'Space Grotesk, sans-serif', cursor: importing || !importUrl.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {importing ? 'Importing…' : 'Import'}
              </button>
            </div>
            {importMsg && (
              <p style={{ fontSize: '0.78rem', color: importMsg.ok ? 'var(--green)' : 'var(--red)', marginBottom: '1rem' }}>
                {importMsg.text}
              </p>
            )}
            {!importMsg && (
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1rem' }}>
                Audit an existing page: import its live tags, see what fails the meters, and fix it here
              </p>
            )}

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', color: statusColor(titleStatus.color) }}>{titleStatus.message}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-4)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{form.title.length}/60</span>
            </div>
            {/* Pixel-width meter — how Google actually truncates */}
            <div style={{ marginBottom: '1.25rem', marginTop: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--gray-4)' }}>Pixel width (Google truncates at ~{TITLE_PX_LIMIT}px)</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: titleMeter.color }}>
                  {titlePx}px{titleMeter.over ? ' — will be cut' : ''}
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--gray-2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${titleMeter.pct}%`, background: titleMeter.color, transition: 'width 0.15s' }} />
              </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: statusColor(descriptionStatus.color) }}>{descriptionStatus.message}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-4)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{form.description.length}/160</span>
            </div>
            {/* Pixel-width meter */}
            <div style={{ marginBottom: '1.25rem', marginTop: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--gray-4)' }}>Pixel width (Google truncates at ~{DESC_PX_LIMIT}px)</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: descMeter.color }}>
                  {descPx}px{descMeter.over ? ' — will be cut' : ''}
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--gray-2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${descMeter.pct}%`, background: descMeter.color, transition: 'width 0.15s' }} />
              </div>
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

      {/* --- FOUNDER QUOTE --- */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in SEO</div>
              <p className="founder-quote-text">
                &ldquo;Titles and descriptions are the only part of your SEO that searchers actually see before they click. I have watched pages jump 40% in traffic with zero ranking change, purely from rewriting the title tag. This meta tag optimization tool exists so you can see exactly what Google will show, before you publish, not after.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts ·{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OVERVIEW --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">What is a meta tag optimization tool <span className="blue">and why does CTR depend on it?</span></h2>
          </div>
          <div className="prose-content">
            <p>A meta tag optimization tool helps you write, validate, and preview the HTML tags that control how your page appears in search results: the title tag, the meta description, canonical and viewport tags, plus the Open Graph and Twitter Card tags that shape social link previews. This one adds a live Google SERP preview and color-coded character validation, so you see truncation problems before Google&apos;s users do.</p>
            <p>Meta tags matter because they are your listing&apos;s advertisement. Rankings decide whether you appear; the title and description decide whether anyone clicks. A page ranking fifth with a compelling, complete title routinely out-earns a page ranking third with a truncated or generic one.</p>
            <p>Perfect for SEO professionals, web developers, and content creators who want every published page to be search-engine ready from day one. If you want AI to draft the copy for you first, use our <a href="/tools/seo-meta-writer/" style={{ color: 'var(--blue)' }}>AI meta writer</a>, then paste the results here to validate lengths and generate the full tag set.</p>

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
              { n: '01', title: 'Enter Your Content', desc: 'Input your page title, meta description, keywords, and URL. Our tool provides real-time character count and optimization suggestions as you type.', tip: 'Write the description as a one-sentence pitch: what the page delivers plus a reason to click.' },
              { n: '02', title: 'Preview SERP Appearance', desc: 'See exactly how your page will appear in Google search results with the live SERP preview. Truncated titles and cut-off descriptions are visible instantly, before publishing.', tip: 'Front-load your primary keyword in the first 30 characters of the title, that part always survives truncation.' },
              { n: '03', title: 'Generate Complete Code', desc: 'Get ready-to-use HTML meta tag code including canonical, Open Graph, and Twitter Card tags. Copy with one click and paste into your page\'s <head> section or your CMS SEO plugin fields.', tip: 'After implementing, re-check the page with the on-page SEO analyzer to confirm every tag is picked up.' },
            ].map((s, i, arr) => (
              <div key={s.n} className="step-card">
                {i < arr.length - 1 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
                  </div>
                )}
                <div className="step-num-big">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                {s.tip && <div className="step-tip">💡 Tip: {s.tip}</div>}
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

      {/* --- LENGTH LIMITS TABLE --- */}
      <section className="section ratio-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Length Guide</div>
            <h2 className="s-title">Title tag and meta description <span className="blue">length limits (2026)</span></h2>
            <p className="s-sub">Google truncates by pixel width, not characters, but these character ranges keep you safely inside the limits on both desktop and mobile.</p>
          </div>
          <table className="ratio-table">
            <thead>
              <tr>
                {['Element', 'Optimal Length', 'Hard Limit', 'What Happens Beyond It'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { el: 'Title Tag', opt: '30–60 characters', limit: '~600 pixels', beyond: 'Truncated with "..." or rewritten by Google', cls: 'risk-safe' },
                { el: 'Meta Description', opt: '120–160 characters', limit: '~920 pixels desktop, less on mobile', beyond: 'Cut mid-sentence, weakening the pitch', cls: 'risk-safe' },
                { el: 'OG Title (social)', opt: '40–60 characters', limit: '~88 characters', beyond: 'Clipped in Facebook/LinkedIn link cards', cls: 'risk-warn' },
                { el: 'OG Description', opt: '60–110 characters', limit: '~200 characters', beyond: 'Hidden entirely on some placements', cls: 'risk-warn' },
                { el: 'Meta Keywords', opt: 'Not used by Google since 2009', limit: 'n/a', beyond: 'Ignored, harmless but optional', cls: 'risk-bad' },
              ].map(r => (
                <tr key={r.el}>
                  <td className="ratio-anchor-type">{r.el}</td>
                  <td className="ratio-pct">{r.opt}</td>
                  <td>{r.limit}</td>
                  <td><span className={`ratio-risk ${r.cls}`}>{r.beyond}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ratio-note">
            <strong>Reality check:</strong> Google rewrites roughly 60% of title tags it considers suboptimal. The best defense is a title that already matches the query: primary keyword early, honest description of the page, within the pixel limit. Titles built that way get kept; clickbait and keyword strings get rewritten.
          </div>
        </div>
      </section>

      {/* --- MISTAKES SECTION --- */}
      <section className="section mistakes-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Mistakes</div>
            <h2 className="s-title">5 meta tag mistakes that <span className="blue">kill click-through rates</span></h2>
            <p className="s-sub">Run your existing pages through the optimizer above and check for these patterns.</p>
          </div>
          <div className="mistakes-grid">
            {[
              { n: '01', title: 'Duplicate Titles Across Pages', body: 'When dozens of pages share one boilerplate title, Google cannot tell them apart and searchers get no reason to click any of them. Every indexable page needs a unique title describing that specific page.', bad: '"Home | Acme Corp" on 40 different pages', good: '"Waterproof Hiking Boots for Women | Acme Corp" per page' },
              { n: '02', title: 'Stuffing Keywords Into the Title', body: 'Keyword-string titles look spammy to users and are the #1 trigger for Google rewriting your title entirely. One primary keyword plus a benefit beats five comma-separated keywords.', bad: '"SEO Tools, Free SEO Tools, Best SEO Software, SEO Checker"', good: '"19 Free SEO Tools That Replace Paid Subscriptions"' },
              { n: '03', title: 'Missing or Auto-Generated Descriptions', body: 'Leave the description empty and Google grabs an arbitrary page snippet, often navigation text or a cookie notice. You surrender your one chance to pitch the click.', bad: 'Description: "Home About Services Contact Menu Login"', good: 'A 150-character pitch stating what the page delivers and why it beats the other nine results' },
              { n: '04', title: 'Ignoring Social Preview Tags', body: 'Without Open Graph and Twitter Card tags, shared links render as bare URLs or with random images. Every share loses the visual real estate that drives social clicks.', bad: 'Link shared on LinkedIn shows no image, no headline', good: 'og:title, og:description, and og:image produce a full preview card' },
              { n: '05', title: 'Front-Loading Branding Instead of Keywords', body: 'Starting every title with your brand name pushes the keyword out of the visible window on mobile. Brand goes at the end; the topic goes first, where truncation cannot eat it.', bad: '"Acme Corporation Private Limited | Best Hiking Boots"', good: '"Best Hiking Boots for Monsoon Treks | Acme"' },
            ].map(m => (
              <div key={m.n} className="mistake-card">
                <div className="mistake-card-top">
                  <div className="mistake-num">Mistake {m.n}</div>
                  <div className="mistake-title">{m.title}</div>
                  <div className="mistake-body-text">{m.body}</div>
                </div>
                <div className="code-example">
                  <div className="code-bad"><span className="code-label">✗</span><span className="code-text">{m.bad}</span></div>
                  <div className="code-good"><span className="code-label">✓</span><span className="code-text">{m.good}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TITLE TAG DEEP DIVE --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Title Tag Optimization</div>
            <h2 className="s-title">How to write title tags that <span className="blue">earn the click</span></h2>
          </div>
          <div className="prose-content">
            <p>The title tag is the single highest-leverage line of text on any page. Here is the formula that consistently survives Google&apos;s rewriting and wins clicks:</p>
            <ul>
              <li><strong>Primary keyword in the first 30 characters.</strong> Mobile truncates hardest; the front of the title always survives.</li>
              <li><strong>One concrete differentiator.</strong> A number, a year, &ldquo;free,&rdquo; a speed claim: &ldquo;39 JSON-LD Types,&rdquo; &ldquo;in Under 5 Minutes.&rdquo; Specificity beats adjectives.</li>
              <li><strong>Match the dominant intent.</strong> If the top results all say &ldquo;checker,&rdquo; a title saying &ldquo;analysis platform&rdquo; fights the query. Mirror the language searchers use.</li>
              <li><strong>Brand last, if at all.</strong> &ldquo;| SEOShouts&rdquo; at the end builds recognition without spending the visible window.</li>
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">The rewrite test</div>
              <p>Before publishing, ask: if Google showed this title against the exact query I target, would a searcher know what they get and why it beats the other results? If yes, Google usually keeps your title. If it is vague, branded-first, or stuffed, expect a rewrite, and rewrites almost always convert worse than a well-crafted original.</p>
            </div>
            <p>Use the live preview above as a title tag optimizer: type variants, watch the truncation point, and keep the version that reads best at a glance.</p>
          </div>
        </div>
      </section>

      {/* --- WHICH TAGS MATTER --- */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tag Reference</div>
            <h2 className="s-title">Which meta tags still matter <span className="blue">in 2026 (and which are dead)</span></h2>
          </div>
          <div className="prose-content">
            <p>The generated code block includes every tag with a legitimate job. Knowing what each one does keeps you from cargo-culting dead tags or deleting live ones:</p>
            <ul>
              <li><strong>Title and meta description:</strong> the CTR pair. Description is not a ranking factor, but Google bolds query words inside it, which visibly lifts clicks.</li>
              <li><strong>Canonical:</strong> prevents duplicate-content dilution when a page is reachable at multiple URLs. One canonical per page, always absolute.</li>
              <li><strong>Viewport:</strong> required for mobile rendering; without it your page fails mobile-friendliness checks outright.</li>
              <li><strong>Robots:</strong> &ldquo;index, follow&rdquo; is the default and technically redundant, but explicit beats implicit when debugging indexing issues.</li>
              <li><strong>Open Graph and Twitter Cards:</strong> control social link previews everywhere links get shared, including in messaging apps. Increasingly read by AI assistants when summarizing pages.</li>
              <li><strong>Meta keywords:</strong> ignored by Google since 2009. The tool includes it because a few regional engines still read it, but never spend effort on it.</li>
            </ul>
            <p>For structured data beyond meta tags, JSON-LD schema for rich results, generate it with our <a href="/tools/schema-generator/" style={{ color: 'var(--blue)' }}>free schema markup generator</a> and validate the whole page with the <a href="/tools/on-page-seo-analyzer/" style={{ color: 'var(--blue)' }}>on-page SEO analyzer</a>.</p>
          </div>
        </div>
      </section>

      {/* --- COMPARISON SECTION --- */}
      <section className="section comparison-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Comparison</div>
            <h2 className="s-title">SEOShouts vs other <span className="blue">meta tag tools</span></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  {['Feature', 'SEOShouts', 'SEOptimer', 'ToTheWeb', 'Yoast (plugin)', 'Rank Math (plugin)'].map((c, i) => (
                    <th key={c} className={i === 1 ? 'highlight' : ''}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Live Google SERP Preview', '✅', '✅', '✅', '✅', '✅'],
                  ['Character Validation', '✅ Color-coded', '✅', '✅', '✅', '✅'],
                  ['Full HTML Tag Set Output', '✅', '❌ (Title/desc only)', '❌ (Preview only)', '❌ (WP fields)', '❌ (WP fields)'],
                  ['Open Graph + Twitter Tags', '✅', '❌', '❌', '✅', '✅'],
                  ['Works Without WordPress', '✅', '✅', '✅', '❌', '❌'],
                  ['No Login Required', '✅', '✅', '✅', '❌ (Install)', '❌ (Install)'],
                  ['Cost', 'Free forever', 'Free (limited)', 'Free', 'Free/$99 yr', 'Free/$59 yr'],
                ].map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={ci === 1 ? 'highlight-col' : ''}>
                        {cell.startsWith('✅') ? <span className="check-yes">{cell}</span> :
                         cell.startsWith('❌') ? <span className="check-no">{cell.replace('❌', '✗')}</span> :
                         cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-cards">
            <div style={{ background: 'var(--green-bg)', border: '1px solid #86efac', borderLeft: '4px solid var(--green)', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#14532d', marginBottom: '0.6rem' }}>When to Choose SEOShouts</h3>
              <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.7 }}>Use this optimizer when you need <strong>preview plus complete ready-to-paste code</strong> for any platform: custom sites, static builds, Shopify, Webflow, or client handoffs. Preview-only tools make you write the HTML yourself; plugin tools lock you into WordPress.</p>
            </div>
            <div style={{ background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--blue-dark)', marginBottom: '0.6rem' }}>When You Might Need More</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--blue-dark)', lineHeight: 1.7 }}>If you run WordPress and want meta fields managed inside the CMS with templates and bulk editing, Yoast or Rank Math is the right home for day-to-day management. Use this tool to craft and test the copy; store the winner in your plugin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CHECKLIST SECTION --- */}
      <section className="section checklist-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Publishing Checklist</div>
            <h2 className="s-title">Meta tag checklist <span className="blue">(before every publish)</span></h2>
            <p className="s-sub">Two minutes per page. Every box unchecked is CTR left on the table.</p>
          </div>
          <div className="checklist-grid">
            {[
              { title: '📊 Title Tag', items: ['Unique across the entire site', 'Primary keyword in first 30 characters', '30-60 characters, verified in the preview', 'Contains one concrete differentiator (number, year, benefit)', 'Brand at the end, not the start'] },
              { title: '🎯 Meta Description', items: ['120-160 characters, no mid-sentence truncation', 'Primary keyword included naturally (Google bolds it)', 'States what the page delivers plus a reason to click', 'Unique, not duplicated from another page', 'Written for humans, no keyword lists'] },
              { title: '🔧 Technical Tags', items: ['Canonical URL absolute and correct', 'Viewport set to responsive', 'Robots directive intentional (index, follow)', 'Charset UTF-8 declared', 'Language attribute matches page content'] },
              { title: '🏗️ Social Tags', items: ['og:title and og:description present', 'og:image points to a real 1200x630 image', 'twitter:card set to summary_large_image', 'Preview tested by sharing to a private channel', 'og:url matches the canonical'] },
            ].map(cat => (
              <div key={cat.title} className="checklist-card">
                <div className="checklist-head">{cat.title}</div>
                <div className="checklist-items">
                  {cat.items.map((item, i) => (
                    <div key={i} className="checklist-item">
                      <input type="checkbox" id={`${cat.title}-${i}`} />
                      <label htmlFor={`${cat.title}-${i}`} className="checklist-text">{item}</label>
                    </div>
                  ))}
                </div>
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
              { q: 'What is a meta tag optimization tool?', a: 'A meta tag optimization tool helps you write, validate, and preview the HTML meta tags that control how your page appears in search results and social shares. This one combines a live Google SERP preview, color-coded character validation for titles and descriptions, and a complete generated tag set including canonical, Open Graph, and Twitter Card markup.' },
              { q: 'Can I audit the meta tags on an existing page?', a: 'Yes. Use the "Import From Existing Page" field: enter any live URL and the tool loads its current title, description, keywords, author, and canonical into the form. The pixel-width meters and SERP preview immediately show what is too long, too short, or missing — edit right there and copy the fixed code. It also works on competitor pages when you want to study what they wrote.' },
              { q: 'Are meta tags really important for SEO?', a: 'Yes. The title tag is a direct ranking signal, and both title and description control your click-through rate from search results. Two pages at the same position can differ in traffic by 30-40% purely on the strength of their meta tags, because searchers choose the listing that best promises what they want.' },
              { q: 'What is the ideal title tag length?', a: 'Keep titles between 30 and 60 characters. Google truncates by pixel width (about 600 pixels), so 60 characters is the safe ceiling. Put your primary keyword in the first 30 characters, that portion survives truncation on every device.' },
              { q: 'What is the ideal meta description length?', a: 'Aim for 120 to 160 characters. Below 120 wastes the space Google gives you; above 160 gets cut mid-sentence, usually right where your call to action was. The color-coded counter in the tool marks the optimal band as you type.' },
              { q: 'Do meta keywords still matter?', a: 'No. Google has ignored the meta keywords tag since 2009, and no major engine uses it for ranking. The tool includes the field for completeness and for the few regional engines that still read it, but never spend optimization effort there.' },
              { q: 'Why does Google rewrite my title tags?', a: 'Google rewrites titles it judges too long, keyword-stuffed, boilerplate, or mismatched to the query, industry studies put the rewrite rate around 60%. Titles that state the page topic honestly, lead with the keyword, and stay inside the pixel limit are the ones Google keeps.' },
              { q: 'How do I implement the generated code?', a: 'Copy the HTML block and paste it inside your page\'s <head> section. On WordPress, transfer the title and description into your SEO plugin fields (Yoast, Rank Math) instead, the plugin renders the tags for you. On Shopify, Webflow, and most site builders, each page has dedicated SEO fields for the same values.' },
              { q: 'Are social media tags included?', a: 'Yes. The generated code includes Open Graph tags (og:title, og:description, og:url, og:image) for Facebook, LinkedIn, and WhatsApp previews, plus Twitter Card markup for X. These tags are also increasingly read by AI assistants when they summarize and cite pages.' },
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
