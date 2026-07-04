'use client'

import { useState, useEffect } from 'react'
import ShapeGrid from '../../components/ShapeGrid'

export default function WordCounterClient() {
  const [text, setText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [paragraphCount, setParagraphCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const trimmed = text.trim()
    const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(word => word.length > 0) : []
    setWordCount(words.length)
    setCharCount(text.length)
    setCharCountNoSpaces(text.replace(/\s/g, '').length)
    setReadingTime(words.length > 0 ? Math.ceil(words.length / 200) : 0)
    const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    setParagraphCount(paragraphs.length > 0 ? paragraphs.length : (trimmed.length > 0 ? 1 : 0))
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setSentenceCount(sentences.length)
  }, [text])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const clearText = () => setText('')

  const SOCIAL_LIMITS = [
    { platform: 'X (Twitter)', limit: 280 },
    { platform: 'Instagram Caption', limit: 2200 },
    { platform: 'LinkedIn Post', limit: 3000 },
    { platform: 'Facebook Post', limit: 63206 },
  ]

  return (
    <>
      {/* ── HERO ── */}
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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Word Counter</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free Word &amp; Character <span>Counter</span>
          </h1>
          <p className="tool-hero-sub">
            Hit your target length every time. Track words, characters, paragraphs, sentences, and reading time
            in real-time &mdash; perfect for blog posts, essays, social media captions, and any content
            with strict length requirements.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Real-time Counting', 'Reading Time Estimate', 'Social Media Limits', '100% Free'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOOL ── */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: Textarea */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Enter Your Text</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', textAlign: 'center', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Start typing or paste your content below for instant real-time analysis.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your content here to see real-time word and character counts..."
              style={{
                width: '100%',
                minHeight: 400,
                border: '1px solid var(--gray-3)',
                padding: '13px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                color: 'var(--ink)',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.75,
                display: 'block',
                background: 'var(--white)',
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button
                onClick={copyToClipboard}
                disabled={!text}
                style={{
                  flex: 1,
                  border: 'none',
                  background: !text ? 'var(--gray-3)' : 'var(--blue)',
                  color: 'var(--white)',
                  padding: '10px 16px',
                  fontSize: '0.88rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  cursor: !text ? 'not-allowed' : 'pointer',
                  opacity: !text ? 0.5 : 1,
                }}
              >
                {copied ? '✓ Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={clearText}
                disabled={!text}
                style={{
                  border: '1px solid var(--line)',
                  background: 'var(--white)',
                  color: 'var(--ink)',
                  padding: '10px 24px',
                  fontSize: '0.88rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  cursor: !text ? 'not-allowed' : 'pointer',
                  opacity: !text ? 0.5 : 1,
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* RIGHT: Stats + Social Limits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Stats Grid */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--line)' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', margin: 0 }}>
                  Content Statistics
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { label: 'Words', value: wordCount },
                  { label: 'Characters', value: charCount },
                  { label: 'No Spaces', value: charCountNoSpaces },
                  { label: 'Paragraphs', value: paragraphCount },
                  { label: 'Sentences', value: sentenceCount },
                  { label: 'Read Time', value: readingTime, suffix: ' min' },
                ].map((s, i) => (
                  <div key={s.label} style={{
                    padding: '1.1rem 0.75rem',
                    borderRight: i % 3 !== 2 ? '1px solid var(--line)' : 'none',
                    borderBottom: i < 3 ? '1px solid var(--line)' : 'none',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: 'var(--blue)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}>
                      {s.value.toLocaleString()}{s.suffix ?? ''}
                    </div>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--gray-4)',
                      marginTop: '0.3rem',
                    }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Limits */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', margin: 0 }}>
                  Social Media Limits
                </h3>
              </div>
              <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {SOCIAL_LIMITS.map(({ platform, limit }) => {
                  const over = charCount > limit
                  const pct = Math.min((charCount / limit) * 100, 100)
                  return (
                    <div key={platform}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--gray-5)', fontFamily: 'Inter, sans-serif' }}>{platform}</span>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          fontFamily: 'Space Grotesk, sans-serif',
                          color: over ? 'var(--red)' : pct > 80 ? 'var(--amber)' : 'var(--green)',
                        }}>
                          {charCount.toLocaleString()}/{limit.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ height: 3, background: 'var(--gray-2)' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: over ? 'var(--red)' : pct > 80 ? 'var(--amber)' : 'var(--green)',
                          transition: 'width 0.15s ease, background 0.15s ease',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOUNDER QUOTE ── */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in SEO</div>
              <p className="founder-quote-text">
                &ldquo;Length limits are everywhere in content work: meta descriptions, ad copy, social posts, editorial word counts. A word counter sounds trivial until you realize how many times a day you paste text somewhere just to measure it. This one is instant, private, and free, the way a utility should be.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts ·{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── white (prose-section default) */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Count Words, Characters &amp; Track Reading Time Instantly</h2>
            <p className="s-sub">Perfect for writers, bloggers, and content creators who need precise length control.</p>
          </div>
          <div className="prose-content reveal">
            <h3>Perfect for Writers, Bloggers &amp; Content Creators</h3>
            <p>
              Need to hit a specific word count? Checking character limits for social media? Our word counter tool gives
              you real-time stats as you type. No delays, no page refreshes — every keystroke updates all six metrics
              simultaneously.
            </p>
            <p>
              Track words, characters (with and without spaces), paragraphs, sentences, and estimated reading time.
              Great for essays, blog posts, social media, and any content with specific length requirements. The social
              media limits panel shows live progress bars for Twitter, Instagram, LinkedIn, and Facebook so you know
              exactly where you stand before you post.
            </p>
          </div>
        </div>
      </section>

      {/* ── USE CASES ── gray (features-section default) */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Perfect for Every Content Creator</h2>
          </div>
          <div className="features-grid">
            {[
              {
                title: 'Writers &amp; Authors',
                desc: 'Hit target word counts for articles, essays, and manuscripts. Track progress and stay within limits.',
                paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'],
              },
              {
                title: 'Social Media Managers',
                desc: 'Check character limits for X, Instagram, LinkedIn, and Facebook before posting — with live progress bars.',
                paths: ['M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'],
              },
              {
                title: 'Students',
                desc: 'Meet assignment requirements with precise word counts for essays, reports, and research papers.',
                paths: ['M22 10v6M2 10l10-5 10 5-10 5z', 'M6 12v5c3 3 9 3 12 0v-5'],
              },
              {
                title: 'Bloggers',
                desc: 'Optimize blog post length for SEO and reader engagement. Track reading time estimates instantly.',
                paths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M8 10h8', 'M8 14h4'],
              },
              {
                title: 'Business Professionals',
                desc: 'Create concise emails, proposals, and marketing copy that meets specific length requirements.',
                paths: ['M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
              },
              {
                title: 'SEO Specialists',
                desc: 'Optimize meta descriptions, title tags, and content length for better search engine performance.',
                paths: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M21 21l-4.35-4.35'],
              },
            ].map((f) => (
              <div key={f.title} className="feature-card reveal">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {f.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title" dangerouslySetInnerHTML={{ __html: f.title }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.65, marginTop: '0.5rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── white (howto-section default) */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">How Our Word Counter Tool Works</h2>
            <p className="s-sub">Advanced text analysis running entirely in your browser — no data leaves your device.</p>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { n: '01', title: 'Real-time Processing', desc: 'As you type or paste text, the algorithm instantly analyzes every character and word. Every keystroke triggers an update with zero perceptible delay.' },
              { n: '02', title: 'Smart Word Detection', desc: 'Uses whitespace splitting and filters empty strings to ensure accurate word counting, identical in methodology to Microsoft Word and Google Docs.' },
              { n: '03', title: 'Multiple Metrics', desc: 'Simultaneously tracks words, characters (with and without spaces), paragraphs, sentences, and calculates reading time based on 200 words per minute.' },
            ].map((s, i) => (
              <div key={s.n} className="step-card reveal">
                {i < 2 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                <div className="step-num-big">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* What We Track */}
          <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: '1px solid var(--line)', background: 'var(--white)' }} className="reveal">
            {[
              { label: 'Word Count', note: 'Standard algorithm' },
              { label: 'Characters', note: 'With & without spaces' },
              { label: 'Paragraphs', note: 'Line break detection' },
              { label: 'Sentences', note: 'Punctuation-based' },
              { label: 'Reading Time', note: '200 WPM average' },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: '1rem',
                borderRight: i < 4 ? '1px solid var(--line)' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-4)', fontFamily: 'Inter, sans-serif' }}>
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRO TIPS ── gray (why-section default) */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Pro Tips for Content Creators</h2>
            <p className="s-sub">Use these benchmarks alongside the counter to optimize your content for every platform and use case.</p>
          </div>
          <div className="why-grid" style={{ marginTop: '3rem' }}>
            {[
              {
                title: 'Blog Posts',
                color: 'var(--blue)',
                paths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M8 10h8', 'M8 14h4'],
                body: 'Aim for 1,000–2,000 words for SEO-friendly content. Longer posts tend to rank better in search engines, but quality matters more than length.',
              },
              {
                title: 'Social Media',
                color: 'var(--green)',
                paths: ['M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'],
                body: 'X: 280 chars, Instagram: 2,200 chars, LinkedIn: 3,000 chars. Use the live limits panel to stay within platform requirements before copying.',
              },
              {
                title: 'Meta Descriptions',
                color: 'var(--amber)',
                paths: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M21 21l-4.35-4.35'],
                body: 'Keep meta descriptions between 150–160 characters for optimal display in search results without truncation. Google often rewrites longer ones.',
              },
              {
                title: 'Reading Time',
                color: 'var(--red)',
                paths: ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z', 'M12 6v6l4 2'],
                body: 'Average readers prefer 3–7 minute articles (600–1,400 words). Use the reading time estimate to gauge whether your content matches your audience\'s attention span.',
              },
            ].map((card) => (
              <div key={card.title} className="why-card reveal" style={{ borderTop: `3px solid ${card.color}` }}>
                <div className="why-card-title">
                  <div className="why-card-icon" style={{ background: card.color }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      {card.paths.map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <p className="why-card-body">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── white (faq-section default) */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {[
              { q: 'Is this word counter tool free?', a: 'Yes, our word counter tool is completely free to use. No registration required, no hidden fees — just paste your text and get instant results.' },
              { q: 'How accurate is the word count?', a: 'Our word counter uses standard algorithms similar to Microsoft Word, providing accurate counts by splitting text on whitespace and filtering empty strings.' },
              { q: 'Can I check character limits for social media?', a: 'Yes. The Social Media Limits panel shows live progress bars for X (Twitter), Instagram, LinkedIn, and Facebook, updating as you type.' },
              { q: 'How is reading time calculated?', a: 'Reading time is estimated based on an average reading speed of 200 words per minute for adults, rounded up to the nearest whole minute.' },
              { q: 'Does it work offline?', a: 'Yes, once the page loads, the word counter works entirely in your browser without needing an internet connection. No data is sent to our servers.' },
              { q: 'Can I save my text?', a: 'Use the Copy Text button to save your text to the clipboard, or copy and paste into your preferred document editor. The text persists as long as the tab is open.' },
            ].map((item) => (
              <details key={item.q} className="faq-item reveal">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS ── dark */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Explore Our Other SEO Tools</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO tools designed to help you optimize your website and improve rankings.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              {
                name: 'Word Counter', current: true, href: '/tools/word-counter/',
                desc: 'Real-time word and character counting with reading time estimates and social media limit tracking.',
                paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'],
              },
              {
                name: 'SEO Meta Writer', current: false, href: '/tools/seo-meta-writer/',
                desc: 'Generate compelling meta titles and descriptions for better click-through rates in search results.',
                paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8'],
              },
              {
                name: 'Keyword Density Analyzer', current: false, href: '/tools/keyword-density-analyzer/',
                desc: 'Analyze keyword density and optimize content for target keywords without over-optimization.',
                paths: ['M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z'],
              },
              {
                name: 'Meta Tag Optimizer', current: false, href: '/tools/meta-tag-optimizer/',
                desc: 'Generate perfect title tags and meta descriptions with real-time SERP preview and character counters.',
                paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
              },
              {
                name: 'Schema Generator', current: false, href: '/tools/schema-generator/',
                desc: 'Create JSON-LD structured data markup for 39+ schema types to improve search engine understanding.',
                paths: ['M16 18 22 12 16 6', 'M8 6 2 12 8 18'],
              },
            ].map((t) => (
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

      {/* ── FINAL CTA ── */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Start Your Complete <span>SEO Analysis Today</span></h2>
          <p className="final-cta-sub">
            Our word counter is just one tool in your content optimization arsenal. Get professional SEO services
            to maximize your website&apos;s potential and drive real organic growth.
          </p>

          {/* Service Highlights */}
          <div className="tool-grid-2col" style={{ gap: '1rem', maxWidth: 680, margin: '2rem auto', textAlign: 'left' }}>
            {[
              { title: 'Content Strategy', desc: 'Get expert guidance on content planning, keyword optimization, and performance tracking for maximum impact.' },
              { title: 'SEO Consulting', desc: 'Comprehensive SEO audits, technical optimization, and growth strategy development from industry experts.' },
            ].map((card) => (
              <div key={card.title} style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="final-cta-row">
            <a href="/services/" className="btn-primary">View SEO Services</a>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {['Instant results — no account required', 'Works entirely in your browser', '100% free, no limits'].map((p) => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
