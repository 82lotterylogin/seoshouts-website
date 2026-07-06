'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'
import { parseRobotsTxt, checkBotAccess, AI_CRAWLER_BOTS, SEARCH_CRAWLER_BOTS } from '../../lib/robots-parser'

interface RobotsRule {
  id: string
  label: string
  path: string
  description: string
  enabled: boolean
  type: 'disallow' | 'allow'
}

const platformTemplates = {
  wordpress: {
    name: 'WordPress',
    rules: [
      { id: 'wp-admin', label: 'Admin Area', path: '/wp-admin/', description: 'WordPress admin dashboard', enabled: true, type: 'disallow' as const },
      { id: 'wp-includes', label: 'WordPress Core Files', path: '/wp-includes/', description: 'WordPress system files', enabled: true, type: 'disallow' as const },
      { id: 'wp-content-plugins', label: 'Plugin Directories', path: '/wp-content/plugins/', description: 'WordPress plugin folders', enabled: true, type: 'disallow' as const },
      { id: 'wp-admin-ajax', label: 'Admin AJAX (Allow)', path: '/wp-admin/admin-ajax.php', description: 'Required for site functionality', enabled: true, type: 'allow' as const },
      { id: 'wp-uploads', label: 'Media Uploads (Allow)', path: '/wp-content/uploads/', description: 'Images and media files', enabled: true, type: 'allow' as const },
    ]
  },
  shopify: {
    name: 'Shopify',
    rules: [
      { id: 'admin', label: 'Admin Area', path: '/admin/', description: 'Store admin dashboard', enabled: true, type: 'disallow' as const },
      { id: 'cart', label: 'Shopping Cart', path: '/cart/', description: 'Shopping cart pages', enabled: true, type: 'disallow' as const },
      { id: 'checkout', label: 'Checkout Pages', path: '/checkout/', description: 'Checkout process pages', enabled: true, type: 'disallow' as const },
      { id: 'account', label: 'Customer Accounts', path: '/account/', description: 'Customer login and account pages', enabled: true, type: 'disallow' as const },
    ]
  },
  general: {
    name: 'General Website',
    rules: [
      { id: 'admin', label: 'Admin Area', path: '/admin/', description: 'Administrative pages', enabled: true, type: 'disallow' as const },
      { id: 'private', label: 'Private Directory', path: '/private/', description: 'Private content folder', enabled: true, type: 'disallow' as const },
      { id: 'tmp', label: 'Temporary Files', path: '/tmp/', description: 'Temporary file directory', enabled: true, type: 'disallow' as const },
      { id: 'staging', label: 'Staging Area', path: '/staging/', description: 'Development/staging environment', enabled: true, type: 'disallow' as const },
    ]
  }
}

// Bots for the live-tester access matrix: classic search + AI crawlers
const TESTER_BOTS: { name: string; kind: 'Search' | 'AI' }[] = [
  ...SEARCH_CRAWLER_BOTS.map(name => ({ name, kind: 'Search' as const })),
  ...AI_CRAWLER_BOTS.map(name => ({ name, kind: 'AI' as const })),
]

export default function RobotsTxtGeneratorClient() {

  const [selectedPlatform, setSelectedPlatform] = useState<'wordpress' | 'shopify' | 'general'>('wordpress')
  const [rules, setRules] = useState<RobotsRule[]>(platformTemplates.wordpress.rules)
  const [customRules, setCustomRules] = useState<string>('')
  const [sitemapUrl, setSitemapUrl] = useState('https://yoursite.com/sitemap.xml')
  const [crawlDelay, setCrawlDelay] = useState('')
  const [userAgents, setUserAgents] = useState<string[]>(['*'])
  const [robotsContent, setRobotsContent] = useState('')
  const [copied, setCopied] = useState(false)

  // Live tester state
  const [testerSite, setTesterSite] = useState('')
  const [testerPath, setTesterPath] = useState('/')
  const [testerLoading, setTesterLoading] = useState(false)
  const [testerError, setTesterError] = useState('')
  const [testerFile, setTesterFile] = useState('')
  const [testerResults, setTesterResults] = useState<Array<{ name: string; kind: string; allowed: boolean; matchedRule: string }>>([])

  const runLiveTest = async () => {
    setTesterError('')
    setTesterResults([])
    setTesterFile('')

    let site = testerSite.trim()
    if (!site) {
      setTesterError('Enter a website domain to test, e.g. example.com')
      return
    }
    if (!/^https?:\/\//i.test(site)) site = 'https://' + site

    let robotsUrl: string
    try {
      robotsUrl = new URL('/robots.txt', site).href
    } catch {
      setTesterError('That does not look like a valid domain')
      return
    }

    const path = testerPath.trim().startsWith('/') ? testerPath.trim() : '/' + testerPath.trim()

    setTesterLoading(true)
    try {
      const res = await fetch('/api/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: robotsUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not fetch robots.txt')

      if (data.status === 404) {
        setTesterFile('')
        setTesterResults(TESTER_BOTS.map(b => ({ ...b, allowed: true, matchedRule: 'No robots.txt found — everything is allowed by default' })))
        setTesterLoading(false)
        return
      }
      if (data.status >= 400) throw new Error(`robots.txt returned HTTP ${data.status}`)

      const content: string = data.html || ''
      setTesterFile(content)
      const groups = parseRobotsTxt(content)
      setTesterResults(TESTER_BOTS.map(b => ({ ...b, ...checkBotAccess(groups, b.name, path) })))
    } catch (err: any) {
      setTesterError(err.message || 'Failed to fetch robots.txt. Check the domain and try again.')
    } finally {
      setTesterLoading(false)
    }
  }

  // CAPTCHA states
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Update rules when platform changes
  useEffect(() => {
    setRules(platformTemplates[selectedPlatform].rules)
  }, [selectedPlatform])

  // Generate robots.txt content
  useEffect(() => {
    generateRobotsContent()
  }, [rules, customRules, sitemapUrl, crawlDelay, userAgents])

  const generateRobotsContent = () => {
    let content = ''

    userAgents.forEach((agent, index) => {
      content += `User-agent: ${agent}\n`

      const disallowRules = rules.filter(rule => rule.enabled && rule.type === 'disallow')
      disallowRules.forEach(rule => {
        content += `Disallow: ${rule.path}\n`
      })

      const allowRules = rules.filter(rule => rule.enabled && rule.type === 'allow')
      allowRules.forEach(rule => {
        content += `Allow: ${rule.path}\n`
      })

      if (crawlDelay) {
        content += `Crawl-delay: ${crawlDelay}\n`
      }

      if (index < userAgents.length - 1) {
        content += `\n`
      }
    })

    if (customRules.trim()) {
      content += `\n# Custom Rules\n${customRules}\n`
    }

    if (sitemapUrl) {
      content += `\nSitemap: ${sitemapUrl}`
    }

    setRobotsContent(content)
  }

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const copyToClipboard = async () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }
    try {
      await navigator.clipboard.writeText(robotsContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const downloadRobotsTxt = () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }
    const blob = new Blob([robotsContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'robots.txt'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetToDefaults = () => {
    setRules(platformTemplates[selectedPlatform].rules)
    setCustomRules('')
    setSitemapUrl('https://yoursite.com/sitemap.xml')
    setCrawlDelay('')
    setUserAgents(['*'])
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Robots.txt Generator</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free Robots.txt <span>Generator</span>
          </h1>
          <p className="tool-hero-sub">
            Tell search engines exactly where they can and can&apos;t go. Our{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Free Robots.txt Generator</strong>{' '}
            creates bulletproof robots.txt files with a simple click interface &mdash; no syntax errors, no accidentally blocking your entire site from Google.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Multi-Agent Support', 'AI Bot Control', 'Real-time Preview', '100% Free'].map(label => (
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

          {/* LEFT BOX: Configure */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Robots.txt Generator</h2>

            {/* Platform Selection */}
            <label className="tool-box-label">Choose Your Platform</label>
            <div className="tabs" style={{ marginBottom: '1.25rem' }}>
              {Object.entries(platformTemplates).map(([key, template]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPlatform(key as any)}
                  className={`tab${selectedPlatform === key ? ' active' : ''}`}
                >
                  {template.name}
                </button>
              ))}
            </div>

            {/* User Agents */}
            <label htmlFor="userAgents" className="tool-box-label">Select User Agents</label>
            <select
              id="userAgents"
              multiple
              value={userAgents}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value)
                setUserAgents(selectedOptions)
              }}
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '8px 12px',
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'var(--ink)',
                outline: 'none', background: 'var(--white)', height: 128, marginBottom: '0.35rem'
              }}
            >
              <option value="*">* (All Crawlers)</option>
              <optgroup label="Search Engine Bots">
                <option value="Googlebot">Googlebot</option>
                <option value="Bingbot">Bingbot</option>
                <option value="Slurp">Yahoo Slurp</option>
                <option value="DuckDuckBot">DuckDuckBot</option>
                <option value="Baiduspider">Baiduspider</option>
                <option value="YandexBot">YandexBot</option>
              </optgroup>
              <optgroup label="AI &amp; Training Bots">
                <option value="GPTBot">GPTBot (OpenAI)</option>
                <option value="ChatGPT-User">ChatGPT-User (OpenAI Web Browsing)</option>
                <option value="CCBot">CCBot (Common Crawl)</option>
                <option value="anthropic-ai">anthropic-ai (Claude)</option>
                <option value="ClaudeBot">ClaudeBot (Anthropic)</option>
                <option value="Google-Extended">Google-Extended (AI Training)</option>
                <option value="FacebookBot">FacebookBot (Meta AI)</option>
                <option value="Applebot-Extended">Applebot-Extended (Apple AI)</option>
                <option value="PerplexityBot">PerplexityBot</option>
                <option value="YouBot">YouBot (You.com)</option>
              </optgroup>
              <optgroup label="Social Media Bots">
                <option value="facebookexternalhit">Facebook External Hit</option>
                <option value="Twitterbot">Twitterbot</option>
                <option value="LinkedInBot">LinkedInBot</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="TelegramBot">TelegramBot</option>
              </optgroup>
              <optgroup label="SEO &amp; Analytics Bots">
                <option value="AhrefsBot">AhrefsBot</option>
                <option value="SemrushBot">SemrushBot</option>
                <option value="MJ12bot">MJ12bot (Majestic)</option>
                <option value="DotBot">DotBot (Moz)</option>
                <option value="SerpstatBot">SerpstatBot</option>
              </optgroup>
            </select>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '0.5rem' }}>
              Hold Ctrl (or Cmd on Mac) to select multiple. Selected: {userAgents.length} agent{userAgents.length !== 1 ? 's' : ''}
            </p>
            {userAgents.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {userAgents.map((agent, index) => (
                  <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '3px 9px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 600 }}>
                    {agent}
                    <button
                      onClick={() => setUserAgents(prev => prev.filter(a => a !== agent))}
                      style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: '0.85rem', lineHeight: 1, padding: 0 }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Rules */}
            <label className="tool-box-label">Select Rules to Apply</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 240, overflowY: 'auto', marginBottom: '1.25rem' }}>
              {rules.map((rule) => (
                <div key={rule.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--gray-1)', border: '1px solid var(--line)', cursor: 'pointer' }}
                  onClick={() => toggleRule(rule.id)}>
                  <input
                    type="checkbox"
                    id={rule.id}
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                    style={{ marginTop: 2, width: 15, height: 15, accentColor: 'var(--blue)', cursor: 'pointer', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div style={{ flex: 1 }}>
                    <label htmlFor={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', marginBottom: '0.2rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 16, height: 16, flexShrink: 0,
                        color: rule.type === 'disallow' ? 'var(--red)' : 'var(--green)',
                        fontWeight: 700, fontSize: '0.8rem'
                      }}>
                        {rule.type === 'disallow' ? '✗' : '✓'}
                      </span>
                      {rule.label}
                    </label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--blue)', fontFamily: 'JetBrains Mono, monospace', margin: '0 0 0.15rem' }}>
                      {rule.type === 'disallow' ? 'Disallow' : 'Allow'}: {rule.path}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-5)', margin: 0 }}>{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Rules */}
            <label htmlFor="customRules" className="tool-box-label">Custom Rules (Optional)</label>
            <textarea
              id="customRules"
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              placeholder="Add custom disallow/allow rules here..."
              rows={3}
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                resize: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: 'var(--ink)', outline: 'none', lineHeight: 1.6, marginBottom: '1.25rem'
              }}
            />

            {/* Sitemap URL */}
            <label htmlFor="sitemapUrl" className="tool-box-label">Sitemap URL</label>
            <input
              type="url"
              id="sitemapUrl"
              className="tool-url-input"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://yoursite.com/sitemap.xml"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>Added as a Sitemap directive at the end of the file</p>

            {/* Crawl Delay */}
            <label htmlFor="crawlDelay" className="tool-box-label">Crawl Delay (seconds, optional)</label>
            <input
              type="number"
              id="crawlDelay"
              className="tool-url-input"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
              placeholder="e.g., 10"
              min="0"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>Adds delay between crawler requests</p>

            {/* Human Verification */}
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Human Verification Required
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Please verify that you&apos;re not a robot to generate your robots.txt file.
              </p>
              <div style={{ marginBottom: '0.5rem' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={handleCaptchaChange}
                  theme="light"
                />
              </div>
              {isVerified && (
                <div style={{ marginTop: '0.5rem', padding: '8px 12px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--green)' }}>
                  &#10003; Verification successful! You can now copy and download your file.
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={resetToDefaults}
              style={{ padding: '12px 20px', background: 'var(--gray-1)', color: 'var(--gray-5)', border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Reset to Defaults
            </button>
          </div>

          {/* RIGHT BOX: Preview */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="tool-box-heading" style={{ marginBottom: 0 }}>Robots.txt Preview</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={copyToClipboard}
                  disabled={!isVerified}
                  style={{
                    padding: '7px 14px', background: 'var(--gray-1)', color: isVerified ? 'var(--gray-5)' : 'var(--gray-3)',
                    border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.78rem',
                    cursor: isVerified ? 'pointer' : 'not-allowed', opacity: isVerified ? 1 : 0.5,
                    borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadRobotsTxt}
                  disabled={!isVerified}
                  style={{
                    padding: '7px 14px', background: isVerified ? 'var(--blue)' : 'var(--gray-2)', color: '#fff',
                    border: 'none', fontWeight: 600, fontSize: '0.78rem',
                    cursor: isVerified ? 'pointer' : 'not-allowed', opacity: isVerified ? 1 : 0.5,
                    borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Download
                </button>
              </div>
            </div>

            {/* Code Preview */}
            <div style={{ background: '#111318', padding: '1.25rem', overflowX: 'auto', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', height: 280, overflowY: 'auto', marginBottom: '1.25rem' }}>
              <pre style={{ color: '#86efac', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {robotsContent || '# Your robots.txt file will appear here'}
              </pre>
            </div>

            {/* How to Use */}
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.5rem' }}>How to Use This File:</div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {[
                  'Complete human verification above',
                  'Download the robots.txt file',
                  "Upload it to your website's root directory",
                  'Test at: yoursite.com/robots.txt',
                  'Verify in Google Search Console',
                ].map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ width: 18, height: 18, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.68rem', fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{i + 1}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', lineHeight: 1.5 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Multi-Agent Info */}
            {userAgents.length > 1 && (
              <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--green)', marginBottom: '0.25rem' }}>Multi-Agent Rules Active</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-5)', margin: 0 }}>
                  Rules applied to {userAgents.length} user agents: {userAgents.join(', ')}
                </p>
              </div>
            )}

            {/* Warning if blocking everything */}
            {robotsContent.includes('Disallow: /') && !robotsContent.includes('Allow:') && (
              <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--red)', marginBottom: '0.25rem' }}>Warning: Blocking Entire Website</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-5)', margin: 0 }}>
                  You&apos;re blocking your entire website! This will prevent search engines from indexing any of your pages.
                </p>
              </div>
            )}

            {/* Verification Required Notice */}
            {!isVerified && (
              <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--amber)', marginBottom: '0.25rem' }}>Verification Required</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-5)', margin: 0 }}>
                  Complete human verification to download or copy your robots.txt file.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ── LIVE ROBOTS.TXT TESTER ── */}
        <div style={{ maxWidth: 1360, margin: '1.5rem auto 0' }}>
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Robots.txt Tester — Check Any Live Site</h2>
            <p className="tool-box-sub">
              Fetch a site&apos;s live robots.txt and see exactly which <span>search and AI crawlers</span> can access a URL. Follows Google&apos;s matching rules: longest path wins, Allow beats Disallow on ties, * and $ wildcards supported.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '1rem' }}>
              <div>
                <label className="tool-box-label" htmlFor="tester-site">Website</label>
                <input
                  type="text"
                  id="tester-site"
                  className="tool-url-input"
                  value={testerSite}
                  onChange={(e) => setTesterSite(e.target.value)}
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="tool-box-label" htmlFor="tester-path">URL path to test</label>
                <input
                  type="text"
                  id="tester-path"
                  className="tool-url-input"
                  value={testerPath}
                  onChange={(e) => setTesterPath(e.target.value)}
                  placeholder="/blog/my-post/"
                />
              </div>
              <button
                onClick={runLiveTest}
                disabled={testerLoading}
                className="tool-analyze-btn"
                style={{ whiteSpace: 'nowrap' }}
              >
                <div className="tool-analyze-btn-dot" />
                {testerLoading ? 'Fetching…' : 'Test Access'}
              </button>
            </div>

            {testerError && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.85rem', color: 'var(--red)' }}>
                {testerError}
              </div>
            )}

            {testerResults.length > 0 && (
              <div>
                {/* Summary strip */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '10px 14px', background: 'var(--gray-1)', border: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    <strong style={{ color: 'var(--green)' }}>{testerResults.filter(r => r.allowed).length}</strong> allowed
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    <strong style={{ color: 'var(--red)' }}>{testerResults.filter(r => !r.allowed).length}</strong> blocked
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    AI crawlers blocked: <strong style={{ color: testerResults.filter(r => r.kind === 'AI' && !r.allowed).length > 0 ? 'var(--amber)' : 'var(--green)' }}>
                      {testerResults.filter(r => r.kind === 'AI' && !r.allowed).length} / {testerResults.filter(r => r.kind === 'AI').length}
                    </strong>
                  </span>
                </div>

                {/* Bot access matrix */}
                <div style={{ border: '1px solid var(--line)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                    <thead>
                      <tr style={{ background: 'var(--ink)' }}>
                        {['Crawler', 'Type', 'Access', 'Matched Rule'].map((h, j) => (
                          <th key={h} style={{ textAlign: 'left', padding: '9px 14px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', borderRight: j < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {testerResults.map((r, i) => (
                        <tr key={r.name} style={{ borderBottom: i < testerResults.length - 1 ? '1px solid var(--line)' : 'none' }}>
                          <td style={{ padding: '8px 14px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}>{r.name}</td>
                          <td style={{ padding: '8px 14px', fontSize: '0.78rem', color: 'var(--gray-5)' }}>{r.kind}</td>
                          <td style={{ padding: '8px 14px' }}>
                            <span style={{
                              padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700,
                              background: r.allowed ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)',
                              color: r.allowed ? 'var(--green)' : 'var(--red)'
                            }}>
                              {r.allowed ? '✓ Allowed' : '✗ Blocked'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 14px', fontSize: '0.75rem', color: 'var(--gray-4)', fontFamily: 'JetBrains Mono, monospace' }}>{r.matchedRule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Fetched file preview */}
                {testerFile && (
                  <details style={{ marginTop: '1rem' }}>
                    <summary style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-5)', cursor: 'pointer' }}>
                      View fetched robots.txt ({testerFile.split('\n').length} lines)
                    </summary>
                    <div style={{ background: '#111318', padding: '1rem 1.25rem', marginTop: '0.5rem', maxHeight: 260, overflowY: 'auto' }}>
                      <pre style={{ color: '#86efac', margin: 0, fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap' }}>{testerFile}</pre>
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FOUNDER QUOTE --- */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in Technical SEO</div>
              <p className="founder-quote-text">
                &ldquo;Robots.txt is the highest-stakes small file on any website: one wrong line and Google stops crawling your entire site. I have fixed that exact disaster for more clients than I can count, almost always a hand-edited file with one typo. This generator exists so the file is correct by construction.&rdquo;
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
            <h2 className="s-title">Tell Search Engines Where They Can <span className="blue">(And Can&apos;t) Go</span></h2>
          </div>
          <div className="prose-content">
            <h3>Create Perfect Robots.txt Files Without Breaking Your Website</h3>
            <p>
              Last month, a small business owner called me in a panic. &ldquo;Google isn&apos;t showing any of my pages!&rdquo; he said. Turns out, he&apos;d tried to create a robots.txt file himself and accidentally blocked his entire website. One tiny typo cost him three weeks of lost traffic.
            </p>
            <p><strong>Don&apos;t be that guy.</strong></p>
            <p>
              Creating a robots.txt file might seem simple, but mess up the syntax and you could accidentally hide your whole site from Google. Or worse, you could leave sensitive pages completely exposed.
            </p>
            <p>
              <strong>Our Robots.txt Generator</strong> takes the guesswork out of it. Just click what you want to block or allow, and we&apos;ll create a bulletproof robots.txt file that actually works.
            </p>

            <h3>What The Heck Is Robots.txt Anyway?</h3>
            <p>
              Think of robots.txt as a bouncer for your website. It stands at the front door and tells visiting search engine bots, &ldquo;Hey, you can check out these pages, but stay away from those ones over there.&rdquo;
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem', margin: '1rem 0 1.5rem' }}>
              {[
                "It's just a simple text file that sits on your website",
                "Search engines read it before crawling your site",
                "Good bots respect it, sketchy ones might ignore it",
                "Get it wrong, and you could accidentally block everything",
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>&#10003;</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">Real-world example</div>
              <p>Your WordPress admin area is at <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>/wp-admin/</code>. You definitely don&apos;t want that showing up in Google search results, right? Robots.txt keeps it hidden. But here&apos;s what trips people up &mdash; the syntax is super picky. Miss a slash, forget a colon, or use the wrong case, and boom &mdash; your file either doesn&apos;t work or blocks the wrong stuff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY OUR GENERATOR BEATS DIY --- */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Why Our Generator <span className="blue">Beats DIY Robots.txt</span></h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              {
                iconPaths: ['M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-5-4H5z', 'M14 3v4h4', 'M9 11l3 3L22 4', 'M9 14l-2 3-1-1'],
                title: 'Point-and-Click Simplicity',
                desc: "No memorizing weird syntax or Googling \"how to write robots.txt\" for the hundredth time.",
                bullets: [
                  'Pick your website type (WordPress, Shopify, whatever)',
                  'Click the folders you want to block',
                  'Hit generate and boom &mdash; perfect robots.txt file',
                  "Because nobody has time to learn robot syntax when you've got a business to run.",
                ],
              },
              {
                iconPaths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                title: 'Mistake-Proof Templates',
                desc: "We've built templates for every major platform that already know what to block and what to leave alone.",
                bullets: [
                  '/wp-admin/ (your admin area)',
                  '/wp-includes/ (WordPress core files)',
                  '/wp-content/plugins/ (plugin folders)',
                  'But allows /wp-content/uploads/ and admin-ajax.php',
                ],
              },
              {
                iconPaths: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
                title: 'Real-Time Preview',
                desc: 'See exactly what your robots.txt file will look like before you download it.',
                bullets: [
                  "The actual code that'll go on your server",
                  'Warnings if something looks fishy',
                  'Explanations of what each rule does',
                  'Which means no surprises when you upload the file.',
                ],
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.iconPaths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.75rem 0 0.75rem' }}>{f.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {f.bullets.map((b, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.78rem', marginTop: 2 }}>&#10003;</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COMMON RULES EXAMPLES --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Code Examples</div>
            <h2 className="s-title">Common Robots.txt Rules <span className="blue">Every Website Should Consider</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '2.5rem' }}>
            {[
              {
                title: 'Essential Blocks for Most Websites',
                iconPaths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                code: `User-agent: *\nDisallow: /admin/\nDisallow: /private/\nDisallow: /tmp/\nDisallow: /staging/`,
              },
              {
                title: 'WordPress-Specific Rules',
                iconPaths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
                code: `User-agent: *\nDisallow: /wp-admin/\nDisallow: /wp-includes/\nAllow: /wp-admin/admin-ajax.php\nAllow: /wp-content/uploads/`,
              },
              {
                title: 'eCommerce Protection',
                iconPaths: ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
                code: `User-agent: *\nDisallow: /cart/\nDisallow: /checkout/\nDisallow: /account/\nDisallow: /admin/`,
              },
              {
                title: 'Development and Testing',
                iconPaths: ['M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
                code: `User-agent: *\nDisallow: /dev/\nDisallow: /test/\nDisallow: /staging/\nDisallow: /*.pdf$`,
              },
            ].map((item) => (
              <div key={item.title} className="mistake-card">
                <div className="mistake-card-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 28, height: 28, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        {item.iconPaths.map((d, j) => <path key={j} d={d} />)}
                      </svg>
                    </div>
                    <div className="mistake-title">{item.title}</div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', background: '#111318', padding: '1rem 1.25rem' }}>
                  <pre style={{ color: '#86efac', margin: 0, fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap' }}>{item.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHAT TO BLOCK --- */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Best Practices</div>
            <h2 className="s-title">What You Should <span className="blue">(And Shouldn&apos;t) Block</span></h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>
            {[
              {
                title: 'Always Block These',
                color: 'var(--red)',
                iconPaths: ['M18 6L6 18', 'M6 6l12 12'],
                items: ['/admin/ or /wp-admin/ (admin areas)', '/private/ (personal stuff)', '/tmp/ (temporary files)', '/staging/ (test environments)', 'User account and login pages'],
              },
              {
                title: 'Never Block These',
                color: 'var(--green)',
                iconPaths: ['M20 6L9 17l-5-5'],
                items: ['Your main content and blog posts', 'CSS and JavaScript files (Google needs these!)', 'Product pages or important landing pages', 'Your sitemap.xml file'],
              },
              {
                title: 'Maybe Block These',
                color: 'var(--amber)',
                iconPaths: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
                items: ['Search result pages (can create duplicate content)', 'Shopping cart pages (depends on your setup)', 'PDF files (unless they\'re important for SEO)'],
              },
            ].map((card) => (
              <div key={card.title} className="why-card" style={{ borderTop: `3px solid ${card.color}` }}>
                <div className="why-card-title">
                  <div className="why-card-icon" style={{ background: card.color }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      {card.iconPaths.map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {card.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: card.color, flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>•</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>
                        {item.includes('/') ? (
                          <><code style={{ background: 'var(--gray-1)', padding: '1px 5px', fontSize: '0.82em', fontFamily: 'JetBrains Mono, monospace' }}>{item.split(' (')[0]}</code>{item.includes(' (') ? ` (${item.split(' (')[1]}` : ''}</>
                        ) : item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WORDPRESS DEEP DIVE --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">WordPress Guide</div>
            <h2 className="s-title">Robots.txt generator for WordPress: <span className="blue">the complete setup</span></h2>
          </div>
          <div className="prose-content">
            <p>WordPress is the platform where robots.txt mistakes happen most, because WordPress serves a <strong>virtual robots.txt</strong> by default. There is no physical file until you create one, and plugins can silently override it. Here is the setup that works:</p>
            <h3>The ideal WordPress robots.txt</h3>
            <p>Select the WordPress preset in the generator above and you get exactly this structure: block <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>/wp-admin/</code> and <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>/wp-includes/</code>, but explicitly allow <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>/wp-admin/admin-ajax.php</code> (many themes and plugins call it from the front end) and <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>/wp-content/uploads/</code> (your images need to be crawlable to rank in image search).</p>
            <h3>Three ways to install it on WordPress</h3>
            <ul>
              <li><strong>SEO plugin (easiest):</strong> Yoast SEO (Tools → File editor) and Rank Math (General Settings → Edit robots.txt) both let you paste the generated file directly. The plugin serves it, no FTP needed.</li>
              <li><strong>Upload via FTP or file manager:</strong> save the generated file as <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>robots.txt</code> and place it in your site root (the same folder as wp-config.php). A physical file always beats the virtual one.</li>
              <li><strong>Hosting panel:</strong> most managed WordPress hosts (Hostinger, SiteGround, WP Engine) include a file manager where you can create the file in the web root.</li>
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">The WordPress mistakes to avoid</div>
              <p>Never block <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>/wp-content/</code> wholesale, that kills your CSS, JavaScript, and images, and Google demotes pages it cannot render. And do not use robots.txt to hide a page from search results: blocked pages can still appear in Google with no description. Use a <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>noindex</code> tag for that instead.</p>
            </div>
            <p>Once your file is live, verify your whole setup with the <a href="/tools/on-page-seo-analyzer/" style={{ color: 'var(--blue)' }}>on-page SEO analyzer</a> and generate a matching <a href="/tools/xml-sitemap-generator/" style={{ color: 'var(--blue)' }}>XML sitemap</a> to reference in the file.</p>
          </div>
        </div>
      </section>

      {/* --- TEST & SUBMIT --- */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Verify &amp; Deploy</div>
            <h2 className="s-title">How to test and submit your <span className="blue">robots.txt file</span></h2>
          </div>
          <div className="prose-content">
            <p>A robots.txt file fails silently, nothing errors, pages just quietly drop out of crawling. Always verify after uploading:</p>
            <ul>
              <li><strong>Use the live tester above:</strong> enter your domain and any URL path, and the built-in robots.txt tester fetches your live file and shows exactly which search and AI crawlers can access it, with the matching rule for each. Google retired its standalone tester; this one follows the same matching logic.</li>
              <li><strong>Check it loads:</strong> visit <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>yoursite.com/robots.txt</code> in a browser. You should see exactly the file you generated, not a plugin default or a 404.</li>
              <li><strong>Test in Search Console:</strong> Google Search Console&apos;s robots.txt report (Settings → robots.txt) shows the fetched file, when it was last crawled, and any parse errors, line by line.</li>
              <li><strong>Spot-check critical URLs:</strong> use the URL Inspection tool on your homepage, a key product page, and a CSS file. All three should show &ldquo;Crawl allowed: Yes.&rdquo;</li>
              <li><strong>Mind the AI crawlers:</strong> the generator includes toggles for GPTBot, ClaudeBot, PerplexityBot, and Google-Extended. Blocking them removes you from AI search answers, an increasingly expensive place to be invisible. Check your AI readiness with our <a href="/tools/geo-aeo-checker/" style={{ color: 'var(--blue)' }}>free AEO checker</a> before deciding.</li>
            </ul>
            <p>Changes take effect at the next crawl, usually within 24 hours for active sites. Keep a copy of your previous file before replacing it, rollback is the fastest fix if traffic dips.</p>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
            <p className="s-sub">Everything you need to know about robots.txt files.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'What is a robots.txt file?', a: 'Robots.txt is a plain text file at your website\'s root that tells search engine crawlers which parts of your site they may and may not crawl. Well-behaved bots (Googlebot, Bingbot, and major AI crawlers) read it before crawling anything else. It controls crawling, not indexing: use a noindex tag to keep a page out of search results.' },
              { q: 'How do I create a robots.txt for WordPress?', a: 'Select the WordPress preset in the generator above, it blocks /wp-admin/ and /wp-includes/ while keeping admin-ajax.php and your uploads folder crawlable. Then install it via your SEO plugin (Yoast: Tools > File editor; Rank Math: General Settings > Edit robots.txt) or upload the file to your site root via FTP.' },
              { q: 'Where do I upload the robots.txt file?', a: 'Always in the root of your domain, so it loads at yoursite.com/robots.txt. Subdirectories do not work: search engines only check the root. On WordPress, an SEO plugin can serve it for you without touching FTP.' },
              { q: 'Can robots.txt hide a page from Google?', a: 'Not reliably. Robots.txt blocks crawling, but a blocked URL can still appear in results (with no description) if other sites link to it. To keep a page out of Google, allow crawling and add a noindex meta tag, or protect it with a login.' },
              { q: 'Should I block AI crawlers like GPTBot?', a: 'It depends on your goals. Blocking GPTBot, ClaudeBot, and PerplexityBot keeps your content out of AI training and AI search answers, which also means zero visibility when customers ask AI assistants for recommendations. Most businesses now allow AI crawlers for the visibility. The generator gives you per-bot toggles either way.' },
              { q: 'Is this robots.txt generator free?', a: 'Yes, completely free with no signup. Pick your platform preset, toggle the rules you need, preview the exact file, and download it. Templates cover WordPress, Shopify, eCommerce, and custom sites.' },
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
            <h2 className="s-title">Explore Our Other <span className="blue">SEO Tools</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              { name: 'Robots.txt Generator', desc: 'Create robots.txt rules that control crawler access, including AI crawlers like GPTBot.', current: true, href: '/tools/robots-txt-generator/', paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'] },
              { name: 'On-Page SEO Analyzer', desc: 'Audit 150+ on-page SEO factors with real Google PageSpeed data and Core Web Vitals.', href: '/tools/on-page-seo-analyzer/', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
              { name: 'Internal Link Checker', desc: 'Visualize anchor text distribution and audit internal link structure across your site.', href: '/tools/internal-link-checker/', paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'] },
              { name: 'Schema Generator', desc: 'Build structured data markup for 39+ schema types instantly.', href: '/tools/schema-generator/', paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'] },
              { name: 'Keyword Density Analyzer', desc: 'Analyze keyword frequency and optimize content without over-optimization.', href: '/tools/keyword-density-analyzer/', paths: ['M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z'] },
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
          <h2 className="final-cta-title">Ready to <span>Take Control?</span></h2>
          <p className="final-cta-sub">
            Stop leaving your website&apos;s crawlability to chance. Create a professional robots.txt file that guides search engines to your good stuff while keeping the private pages private.
          </p>
          <div className="final-cta-row">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary"
            >
              Use the Robots.txt Generator &rarr;
            </button>
          </div>
          <div className="final-cta-pills">
            {[
              'Create your file in 2 minutes &mdash; completely free',
              'Multi-agent support including AI bots like GPTBot and ClaudeBot',
              "Built by people who've seen every robots.txt disaster imaginable",
            ].map(p => (
              <div key={p} className="final-pill" dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 600, margin: '1.5rem auto 0', textAlign: 'center' }}>
            <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Don&apos;t let a tiny text file break your SEO. Use SEO Shouts&apos; Robots.txt Generator and do it right the first time.</strong>
            <br />
            <em>Built by people who&apos;ve seen every robots.txt disaster imaginable, so you don&apos;t have to experience them yourself.</em>
          </p>
        </div>
      </div>
    </>
  )
}
