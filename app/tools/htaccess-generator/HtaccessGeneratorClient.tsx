'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import ShapeGrid from '../../components/ShapeGrid'

type ToolTab = 'redirects' | 'security' | 'gzip' | 'caching' | 'error-pages' | 'php'
type RedirectType = '301' | '302' | '307' | '308'
type PresetKey = 'none' | 'wordpress' | 'shopify' | 'laravel' | 'joomla'

interface RedirectRule {
  from: string
  to: string
  type: RedirectType
}

interface SecuritySettings {
  disableDirectoryListing: boolean
  blockXssAttacks: boolean
  preventHotlinking: boolean
  blockBadBots: boolean
  forceHttps: boolean
  hstsEnabled: boolean
  clickjackingProtection: boolean
  contentTypeSniffing: boolean
  referrerPolicy: boolean
}

interface GzipSettings {
  enabled: boolean
  compressHtml: boolean
  compressCss: boolean
  compressJs: boolean
  compressXml: boolean
  compressFonts: boolean
  compressImages: boolean
}

interface CachingSettings {
  enabled: boolean
  htmlExpiry: string
  cssJsExpiry: string
  imagesExpiry: string
  fontsExpiry: string
  customExpiry: string
}

interface ErrorPageSettings {
  enabled: boolean
  error400: string
  error401: string
  error403: string
  error404: string
  error500: string
}

interface PhpSettings {
  enabled: boolean
  uploadMaxSize: string
  postMaxSize: string
  memoryLimit: string
  maxExecutionTime: string
  displayErrors: boolean
  outputBuffering: boolean
}

const CACHE_EXPIRY_OPTIONS = ['1 hour', '12 hours', '1 day', '1 week', '2 weeks', '1 month', '3 months', '6 months', '1 year']

const REDIRECT_TYPE_OPTIONS: Array<{ value: RedirectType; label: string }> = [
  { value: '301', label: '301 - Permanent' },
  { value: '302', label: '302 - Temporary' },
  { value: '307', label: '307 - Temporary (Preserve Method)' },
  { value: '308', label: '308 - Permanent (Preserve Method)' },
]

const DEFAULT_SECURITY: SecuritySettings = {
  disableDirectoryListing: true,
  blockXssAttacks: true,
  preventHotlinking: false,
  blockBadBots: false,
  forceHttps: false,
  hstsEnabled: false,
  clickjackingProtection: true,
  contentTypeSniffing: true,
  referrerPolicy: false,
}

const DEFAULT_GZIP: GzipSettings = {
  enabled: false,
  compressHtml: true,
  compressCss: true,
  compressJs: true,
  compressXml: true,
  compressFonts: true,
  compressImages: false,
}

const DEFAULT_CACHING: CachingSettings = {
  enabled: false,
  htmlExpiry: '1 hour',
  cssJsExpiry: '1 week',
  imagesExpiry: '1 month',
  fontsExpiry: '1 year',
  customExpiry: '',
}

const DEFAULT_ERROR_PAGES: ErrorPageSettings = {
  enabled: false,
  error400: '',
  error401: '',
  error403: '/403.html',
  error404: '/404.html',
  error500: '/500.html',
}

const DEFAULT_PHP: PhpSettings = {
  enabled: false,
  uploadMaxSize: '64M',
  postMaxSize: '64M',
  memoryLimit: '256M',
  maxExecutionTime: '300',
  displayErrors: false,
  outputBuffering: true,
}

const TAB_ITEMS: Array<{ key: ToolTab; label: string }> = [
  { key: 'redirects', label: 'Redirects' },
  { key: 'security', label: 'Security' },
  { key: 'gzip', label: 'GZIP' },
  { key: 'caching', label: 'Caching' },
  { key: 'error-pages', label: 'Error Pages' },
  { key: 'php', label: 'PHP' },
]

const PRESET_APPEND_RULES: Record<PresetKey, string> = {
  none: '',
  wordpress: `# WordPress Rewrite Rules
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>`,
  shopify: `# Shopify Proxy Rules (adjust subdirectory as needed)
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteCond %{HTTP_HOST} ^yourdomain\\.com$ [NC]
RewriteRule ^shop/(.*)$ https://yourstore.myshopify.com/$1 [P,L]
</IfModule>`,
  laravel: `# Laravel Public Directory Rewrite
<IfModule mod_rewrite.c>
<IfModule mod_negotiation.c>
    Options -MultiViews -Indexes
</IfModule>
RewriteEngine On
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
</IfModule>`,
  joomla: `# Joomla Rewrite Rules
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteCond %{REQUEST_URI} !^/index\\.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule .* index.php [L]
</IfModule>`,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--gray-3)',
  padding: '8px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.88rem',
  color: 'var(--ink)',
  outline: 'none',
  background: 'var(--white)',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--gray-3)',
  padding: '8px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.88rem',
  color: 'var(--ink)',
  outline: 'none',
  background: 'var(--white)',
  appearance: 'none' as const,
  cursor: 'pointer',
}

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      padding: '0.875rem 1rem',
      border: '1px solid var(--line)',
      background: 'var(--white)',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{label}</div>
        {description ? (
          <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexShrink: 0,
          width: 44,
          height: 24,
          alignItems: 'center',
          background: checked ? 'var(--blue)' : 'var(--gray-3)',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute',
          width: 20,
          height: 20,
          background: 'var(--white)',
          left: checked ? 22 : 2,
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label style={{
      display: 'block',
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      color: 'var(--ink)',
      marginBottom: '0.45rem',
      opacity: 0.65,
    }}>
      {children}
    </label>
  )
}

export default function HtaccessGeneratorClient() {
  const [activeSection, setActiveSection] = useState<ToolTab>('redirects')
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('none')
  const [redirects, setRedirects] = useState<RedirectRule[]>([{ from: '', to: '', type: '301' }])
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY)
  const [gzip, setGzip] = useState<GzipSettings>(DEFAULT_GZIP)
  const [caching, setCaching] = useState<CachingSettings>(DEFAULT_CACHING)
  const [errorPages, setErrorPages] = useState<ErrorPageSettings>(DEFAULT_ERROR_PAGES)
  const [phpSettings, setPhpSettings] = useState<PhpSettings>(DEFAULT_PHP)
  const [generatedCode, setGeneratedCode] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // Redirect tester state
  const [rtTestPath, setRtTestPath] = useState('')
  const [rtResult, setRtResult] = useState<{
    hops: Array<{ from: string; to: string; type: string; rule: string }>
    loop: boolean
    final: string
  } | null>(null)
  const [rtError, setRtError] = useState('')

  const validRedirectCount = useMemo(
    () => redirects.filter((r) => r.from.trim() && r.to.trim()).length,
    [redirects]
  )

  // Simulate the configured Redirect rules against a test path.
  // Mirrors Apache mod_alias: first matching rule in file order wins, the
  // from-path matches complete URL segments as a prefix, and the remaining
  // suffix (plus query string) is appended to the target.
  const simulateRedirects = () => {
    setRtError('')
    setRtResult(null)

    const validRules = redirects.filter((r) => r.from.trim() && r.to.trim())
    if (validRules.length === 0) {
      setRtError('Add at least one redirect rule above (From + To), then test it here.')
      return
    }

    let path = rtTestPath.trim()
    if (!path) {
      setRtError('Enter a URL path to test, e.g. /old-page/')
      return
    }
    // Accept full URLs too — simulate against the path portion
    if (/^https?:\/\//i.test(path)) {
      try { const u = new URL(path); path = u.pathname + u.search } catch { /* keep as typed */ }
    }
    if (!path.startsWith('/')) path = '/' + path

    const normalizeFrom = (from: string): string => {
      let f = from.trim()
      if (/^https?:\/\//i.test(f)) {
        try { f = new URL(f).pathname } catch { /* keep */ }
      }
      return f.length > 1 ? f.replace(/\/+$/, '') : f
    }

    const hops: Array<{ from: string; to: string; type: string; rule: string }> = []
    const seen = new Set([path])
    let loop = false

    for (let i = 0; i < 10; i++) {
      const [pathOnly, query] = path.includes('?') ? [path.split('?')[0], '?' + path.split('?').slice(1).join('?')] : [path, '']

      const rule = validRules.find((r) => {
        const from = normalizeFrom(r.from)
        return pathOnly === from || pathOnly === from + '/' || pathOnly.startsWith(from === '/' ? '/' : from + '/')
      })
      if (!rule) break

      const from = normalizeFrom(rule.from)
      const suffix = from === '/' ? pathOnly : pathOnly.slice(from.length)
      const target = rule.to.trim()
      const isExternal = /^https?:\/\//i.test(target)
      const next = (suffix && suffix !== '/' ? target.replace(/\/+$/, '') + suffix : target) + query

      hops.push({ from: path, to: next, type: rule.type, rule: `Redirect ${rule.type} ${rule.from.trim()} ${target}` })

      if (seen.has(next)) { loop = true; path = next; break }
      seen.add(next)
      path = next
      if (isExternal) break // browser leaves this .htaccess after an absolute redirect
    }

    setRtResult({ hops, loop, final: path })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const validateRedirect = (from: string, to: string) => {
    const errors: string[] = []
    if (from.trim() && !from.startsWith('/') && !from.startsWith('http')) {
      errors.push('From path should start with / or be a full URL')
    }
    if (to.trim() && !to.startsWith('/') && !to.startsWith('http')) {
      errors.push('To path should start with / or be a full URL')
    }
    if (from.trim() && to.trim() && from.trim() === to.trim()) {
      errors.push('From and To cannot be the same')
    }
    return errors
  }

  const resetToDefaults = () => {
    setRedirects([{ from: '', to: '', type: '301' }])
    setSecurity({ ...DEFAULT_SECURITY })
    setGzip({ ...DEFAULT_GZIP })
    setCaching({ ...DEFAULT_CACHING })
    setErrorPages({ ...DEFAULT_ERROR_PAGES })
    setPhpSettings({ ...DEFAULT_PHP })
  }

  const applyPreset = (preset: PresetKey) => {
    setSelectedPreset(preset)
    resetToDefaults()
    if (preset === 'wordpress') {
      setSecurity((prev) => ({ ...prev, forceHttps: true, disableDirectoryListing: true }))
      setGzip((prev) => ({ ...prev, enabled: true }))
      setCaching((prev) => ({ ...prev, enabled: true }))
      setErrorPages((prev) => ({ ...prev, enabled: true, error404: '/404' }))
    }
    if (preset === 'shopify') setSecurity((prev) => ({ ...prev, forceHttps: true, hstsEnabled: true }))
    if (preset === 'laravel') {
      setSecurity((prev) => ({ ...prev, forceHttps: true, disableDirectoryListing: true }))
      setGzip((prev) => ({ ...prev, enabled: true }))
    }
    if (preset === 'joomla') setSecurity((prev) => ({ ...prev, forceHttps: true, disableDirectoryListing: true }))
  }

  const addRedirect = () => setRedirects((prev) => [...prev, { from: '', to: '', type: '301' }])
  const removeRedirect = (index: number) => setRedirects((prev) => prev.filter((_, i) => i !== index))
  const updateRedirect = <K extends keyof RedirectRule>(index: number, field: K, value: RedirectRule[K]) => {
    setRedirects((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  const generateHtaccess = () => {
    const lines: string[] = []
    const push = (line: string) => lines.push(line)
    const blank = () => lines.push('')
    const comment = (t: string) => lines.push(`# ${t}`)
    const divider = () => lines.push('# ==================================================')

    push('# Generated by SEOShouts .htaccess Generator')
    push(`# Generated on: ${new Date().toISOString().split('T')[0]}`)
    push('# https://seoshouts.com/tools/htaccess-generator/')
    blank()

    if (security.forceHttps) {
      divider(); comment('Force HTTPS')
      push('<IfModule mod_rewrite.c>')
      push('  RewriteEngine On')
      push('  RewriteCond %{HTTPS} off')
      push('  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]')
      push('</IfModule>'); blank()
    }

    if (security.hstsEnabled) {
      divider(); comment('HSTS')
      push('<IfModule mod_headers.c>')
      push('  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"')
      push('</IfModule>'); blank()
    }

    if (security.disableDirectoryListing) {
      divider(); comment('Disable Directory Listing')
      push('Options -Indexes'); blank()
    }

    const hasSecurityHeaders =
      security.blockXssAttacks || security.clickjackingProtection || security.contentTypeSniffing || security.referrerPolicy
    if (hasSecurityHeaders) {
      divider(); comment('Security Headers')
      push('<IfModule mod_headers.c>')
      if (security.blockXssAttacks) push('  Header set X-XSS-Protection "1; mode=block"')
      if (security.clickjackingProtection) push('  Header always append X-Frame-Options SAMEORIGIN')
      if (security.contentTypeSniffing) push('  Header set X-Content-Type-Options "nosniff"')
      if (security.referrerPolicy) push('  Header set Referrer-Policy "strict-origin-when-cross-origin"')
      push('</IfModule>'); blank()
    }

    if (security.blockBadBots) {
      divider(); comment('Block Common Bad Bots')
      push('<IfModule mod_rewrite.c>')
      push('  RewriteEngine On')
      push('  RewriteCond %{HTTP_USER_AGENT} (AhrefsBot|MJ12bot|DotBot|SemrushBot|ia_archiver|Majestic) [NC]')
      push('  RewriteRule .* - [F,L]')
      push('</IfModule>'); blank()
    }

    if (security.preventHotlinking) {
      divider(); comment('Prevent Image Hotlinking')
      push('<IfModule mod_rewrite.c>')
      push('  RewriteEngine On')
      push('  RewriteCond %{HTTP_REFERER} !^$')
      push('  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?%{HTTP_HOST} [NC]')
      push('  RewriteRule \\.(jpg|jpeg|png|gif|webp|svg)$ - [NC,F,L]')
      push('</IfModule>'); blank()
    }

    const validRedirects = redirects.filter((r) => r.from.trim() && r.to.trim())
    if (validRedirects.length) {
      divider(); comment('Redirects')
      validRedirects.forEach((r) => {
        const from = r.from.startsWith('/') || r.from.startsWith('http') ? r.from.trim() : `/${r.from.trim()}`
        push(`Redirect ${r.type} ${from} ${r.to.trim()}`)
      }); blank()
    }

    if (gzip.enabled) {
      divider(); comment('Enable GZIP Compression')
      push('<IfModule mod_deflate.c>')
      if (gzip.compressHtml) push('  AddOutputFilterByType DEFLATE text/html text/plain')
      if (gzip.compressCss) push('  AddOutputFilterByType DEFLATE text/css')
      if (gzip.compressJs) push('  AddOutputFilterByType DEFLATE application/javascript application/x-javascript text/javascript')
      if (gzip.compressXml) push('  AddOutputFilterByType DEFLATE text/xml application/xml application/xhtml+xml')
      if (gzip.compressFonts) push('  AddOutputFilterByType DEFLATE font/truetype font/opentype application/x-font-ttf application/vnd.ms-fontobject image/svg+xml')
      if (gzip.compressImages) push('  AddOutputFilterByType DEFLATE image/x-icon')
      push('</IfModule>'); blank()
    }

    if (caching.enabled) {
      divider(); comment('Browser Caching')
      push('<IfModule mod_expires.c>')
      push('  ExpiresActive On')
      push(`  ExpiresByType text/html "access plus ${caching.htmlExpiry}"`)
      push(`  ExpiresByType text/css "access plus ${caching.cssJsExpiry}"`)
      push(`  ExpiresByType application/javascript "access plus ${caching.cssJsExpiry}"`)
      push(`  ExpiresByType image/jpeg "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType image/png "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType image/webp "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType image/gif "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType font/truetype "access plus ${caching.fontsExpiry}"`)
      push(`  ExpiresByType font/opentype "access plus ${caching.fontsExpiry}"`)
      push(`  ExpiresByType application/x-font-ttf "access plus ${caching.fontsExpiry}"`)
      push(`  ExpiresByType font/woff2 "access plus ${caching.fontsExpiry}"`)
      if (caching.customExpiry.trim()) {
        comment('Custom cache directives')
        caching.customExpiry.split('\n').map((l) => l.trim()).filter(Boolean).forEach((l) => push(`  ${l}`))
      }
      push('</IfModule>'); blank()
    }

    if (errorPages.enabled) {
      divider(); comment('Custom Error Pages')
      if (errorPages.error400) push(`ErrorDocument 400 ${errorPages.error400}`)
      if (errorPages.error401) push(`ErrorDocument 401 ${errorPages.error401}`)
      if (errorPages.error403) push(`ErrorDocument 403 ${errorPages.error403}`)
      if (errorPages.error404) push(`ErrorDocument 404 ${errorPages.error404}`)
      if (errorPages.error500) push(`ErrorDocument 500 ${errorPages.error500}`)
      blank()
    }

    if (phpSettings.enabled) {
      divider(); comment('PHP Configuration')
      push(`php_value upload_max_filesize ${phpSettings.uploadMaxSize}`)
      push(`php_value post_max_size ${phpSettings.postMaxSize}`)
      push(`php_value memory_limit ${phpSettings.memoryLimit}`)
      push(`php_value max_execution_time ${phpSettings.maxExecutionTime}`)
      push(`php_flag display_errors ${phpSettings.displayErrors ? 'on' : 'off'}`)
      push(`php_flag output_buffering ${phpSettings.outputBuffering ? 'on' : 'off'}`)
      blank()
    }

    if (selectedPreset !== 'none' && PRESET_APPEND_RULES[selectedPreset]) {
      divider(); comment(`CMS Preset: ${selectedPreset}`)
      push(PRESET_APPEND_RULES[selectedPreset]); blank()
    }

    setGeneratedCode(lines.join('\n').trim() + '\n')
  }

  useEffect(() => {
    generateHtaccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset, redirects, security, gzip, caching, errorPages, phpSettings])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      setCopySuccess(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.htaccess'
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderTabContent = () => {
    if (activeSection === 'redirects') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.875rem 1rem', border: '1px solid var(--blue)', background: 'rgba(37,99,235,0.05)', fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.5 }}>
            Add 301/302/307/308 redirect rules. Use 301 for permanent SEO-safe URL changes.
          </div>
          {redirects.map((rule, index) => {
            const errors = validateRedirect(rule.from, rule.to)
            return (
              <div key={index} style={{ border: '1px solid var(--line)', background: 'var(--gray-1)', padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr auto', gap: '0.75rem', alignItems: 'end' }}>
                  <div>
                    <FieldLabel>Type</FieldLabel>
                    <select value={rule.type} onChange={(e) => updateRedirect(index, 'type', e.target.value as RedirectType)} style={selectStyle}>
                      {REDIRECT_TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>From</FieldLabel>
                    <input value={rule.from} onChange={(e) => updateRedirect(index, 'from', e.target.value)} placeholder="/old-page/" style={inputStyle} />
                  </div>
                  <div>
                    <FieldLabel>To</FieldLabel>
                    <input value={rule.to} onChange={(e) => updateRedirect(index, 'to', e.target.value)} placeholder="/new-page/ or https://..." style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => removeRedirect(index)}
                      disabled={redirects.length === 1}
                      style={{ border: '1px solid var(--line)', background: 'var(--white)', padding: '8px 14px', fontSize: '0.82rem', color: 'var(--gray-5)', cursor: redirects.length === 1 ? 'not-allowed' : 'pointer', opacity: redirects.length === 1 ? 0.45 : 1, fontFamily: 'Inter, sans-serif' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {errors.length > 0 ? (
                  <ul style={{ marginTop: '0.5rem', paddingLeft: 0, listStyle: 'none' }}>
                    {errors.map((e, i) => (
                      <li key={i} style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.2rem' }}>
                        <span>&#8212; </span><span>{e}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )
          })}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={addRedirect}
              style={{ border: 'none', background: 'var(--blue)', color: 'var(--white)', padding: '8px 18px', fontSize: '0.88rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer' }}
            >
              + Add Redirect Row
            </button>
            <div style={{ border: '1px solid var(--line)', background: 'var(--gray-1)', padding: '8px 14px', fontSize: '0.82rem', color: 'var(--gray-5)', fontFamily: 'Inter, sans-serif' }}>
              {validRedirectCount} valid redirect rule{validRedirectCount === 1 ? '' : 's'} ready
            </div>
          </div>
        </div>
      )
    }
    if (activeSection === 'security') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ToggleSwitch label="Disable Directory Listing" checked={security.disableDirectoryListing} onChange={(v) => setSecurity((p) => ({ ...p, disableDirectoryListing: v }))} />
          <ToggleSwitch label="Block XSS Attacks" checked={security.blockXssAttacks} onChange={(v) => setSecurity((p) => ({ ...p, blockXssAttacks: v }))} />
          <ToggleSwitch label="Prevent Hotlinking" checked={security.preventHotlinking} onChange={(v) => setSecurity((p) => ({ ...p, preventHotlinking: v }))} />
          <ToggleSwitch label="Block Bad Bots" checked={security.blockBadBots} onChange={(v) => setSecurity((p) => ({ ...p, blockBadBots: v }))} />
          <ToggleSwitch label="Force HTTPS" checked={security.forceHttps} onChange={(v) => setSecurity((p) => ({ ...p, forceHttps: v }))} />
          <ToggleSwitch label="Enable HSTS" description="Only enable if all traffic and subdomains are HTTPS-ready." checked={security.hstsEnabled} onChange={(v) => setSecurity((p) => ({ ...p, hstsEnabled: v }))} />
          <ToggleSwitch label="Clickjacking Protection" checked={security.clickjackingProtection} onChange={(v) => setSecurity((p) => ({ ...p, clickjackingProtection: v }))} />
          <ToggleSwitch label="Content-Type Sniffing Protection" checked={security.contentTypeSniffing} onChange={(v) => setSecurity((p) => ({ ...p, contentTypeSniffing: v }))} />
          <ToggleSwitch label="Referrer Policy" checked={security.referrerPolicy} onChange={(v) => setSecurity((p) => ({ ...p, referrerPolicy: v }))} />
        </div>
      )
    }
    if (activeSection === 'gzip') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ToggleSwitch label="Enable GZIP Compression" checked={gzip.enabled} onChange={(v) => setGzip((p) => ({ ...p, enabled: v }))} />
          <ToggleSwitch label="Compress HTML" checked={gzip.compressHtml} onChange={(v) => setGzip((p) => ({ ...p, compressHtml: v }))} />
          <ToggleSwitch label="Compress CSS" checked={gzip.compressCss} onChange={(v) => setGzip((p) => ({ ...p, compressCss: v }))} />
          <ToggleSwitch label="Compress JavaScript" checked={gzip.compressJs} onChange={(v) => setGzip((p) => ({ ...p, compressJs: v }))} />
          <ToggleSwitch label="Compress XML" checked={gzip.compressXml} onChange={(v) => setGzip((p) => ({ ...p, compressXml: v }))} />
          <ToggleSwitch label="Compress Fonts" checked={gzip.compressFonts} onChange={(v) => setGzip((p) => ({ ...p, compressFonts: v }))} />
          <ToggleSwitch label="Compress Images (usually not needed)" checked={gzip.compressImages} onChange={(v) => setGzip((p) => ({ ...p, compressImages: v }))} />
        </div>
      )
    }
    if (activeSection === 'caching') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <ToggleSwitch label="Enable Browser Caching" checked={caching.enabled} onChange={(v) => setCaching((p) => ({ ...p, enabled: v }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <FieldLabel>HTML Expiry</FieldLabel>
              <select value={caching.htmlExpiry} onChange={(e) => setCaching((p) => ({ ...p, htmlExpiry: e.target.value }))} style={selectStyle}>
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>CSS/JS Expiry</FieldLabel>
              <select value={caching.cssJsExpiry} onChange={(e) => setCaching((p) => ({ ...p, cssJsExpiry: e.target.value }))} style={selectStyle}>
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Images Expiry</FieldLabel>
              <select value={caching.imagesExpiry} onChange={(e) => setCaching((p) => ({ ...p, imagesExpiry: e.target.value }))} style={selectStyle}>
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Fonts Expiry</FieldLabel>
              <select value={caching.fontsExpiry} onChange={(e) => setCaching((p) => ({ ...p, fontsExpiry: e.target.value }))} style={selectStyle}>
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <FieldLabel>Custom Expires Directives (Optional)</FieldLabel>
            <textarea
              value={caching.customExpiry}
              onChange={(e) => setCaching((p) => ({ ...p, customExpiry: e.target.value }))}
              rows={4}
              style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', resize: 'vertical' }}
              placeholder='ExpiresByType application/json "access plus 1 hour"'
            />
          </div>
        </div>
      )
    }
    if (activeSection === 'error-pages') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <ToggleSwitch label="Enable Custom Error Pages" checked={errorPages.enabled} onChange={(v) => setErrorPages((p) => ({ ...p, enabled: v }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {([
              ['error400', '400'],
              ['error401', '401'],
              ['error403', '403'],
              ['error404', '404'],
              ['error500', '500'],
            ] as Array<[keyof ErrorPageSettings, string]>).map(([field, label]) => (
              <div key={field}>
                <FieldLabel>{label} ErrorDocument</FieldLabel>
                <input
                  value={errorPages[field] as string}
                  onChange={(e) => setErrorPages((p) => ({ ...p, [field]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (activeSection === 'php') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <ToggleSwitch label="Enable PHP Settings" description="Requires hosting support for php_value/php_flag in .htaccess." checked={phpSettings.enabled} onChange={(v) => setPhpSettings((p) => ({ ...p, enabled: v }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <FieldLabel>Upload Max Size</FieldLabel>
              <input value={phpSettings.uploadMaxSize} onChange={(e) => setPhpSettings((p) => ({ ...p, uploadMaxSize: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <FieldLabel>Post Max Size</FieldLabel>
              <input value={phpSettings.postMaxSize} onChange={(e) => setPhpSettings((p) => ({ ...p, postMaxSize: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <FieldLabel>Memory Limit</FieldLabel>
              <input value={phpSettings.memoryLimit} onChange={(e) => setPhpSettings((p) => ({ ...p, memoryLimit: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <FieldLabel>Max Execution Time</FieldLabel>
              <input value={phpSettings.maxExecutionTime} onChange={(e) => setPhpSettings((p) => ({ ...p, maxExecutionTime: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <ToggleSwitch label="Display Errors" checked={phpSettings.displayErrors} onChange={(v) => setPhpSettings((p) => ({ ...p, displayErrors: v }))} />
            <ToggleSwitch label="Output Buffering" checked={phpSettings.outputBuffering} onChange={(v) => setPhpSettings((p) => ({ ...p, outputBuffering: v }))} />
          </div>
        </div>
      )
    }
    return null
  }

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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>.htaccess Generator</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free .htaccess <span>Generator</span>
          </h1>
          <p className="tool-hero-sub">
            Generate production-ready Apache configuration files for redirects, security headers, GZIP compression, and browser
            caching. WordPress, Shopify, Laravel, and Joomla presets included &mdash; no server knowledge required.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['6-Tab Configuration', 'CMS Presets', 'Commented Output', '100% Free'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOOL INPUT ── */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: Configuration */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Configure Your .htaccess Rules</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', marginBottom: '1.25rem', lineHeight: 1.5, textAlign: 'center' }}>
              Download or copy your file &mdash; ready to upload to your server root.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>CMS Preset</FieldLabel>
              <select value={selectedPreset} onChange={(e) => applyPreset(e.target.value as PresetKey)} style={selectStyle}>
                <option value="none">No Preset</option>
                <option value="wordpress">WordPress</option>
                <option value="shopify">Shopify (Subdirectory Proxy)</option>
                <option value="laravel">Laravel</option>
                <option value="joomla">Joomla</option>
              </select>
            </div>

            <div className="tabs" style={{ marginBottom: '1.25rem' }}>
              {TAB_ITEMS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveSection(tab.key)}
                  className={`tab${activeSection === tab.key ? ' active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {renderTabContent()}
          </div>

          {/* RIGHT: Output */}
          <div className="tool-box" style={{ maxWidth: 'none', position: 'sticky', top: '6rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', margin: 0 }}>
                  Generated .htaccess Output
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginTop: '0.2rem' }}>
                  Commented Apache rules, ready to review and upload
                </p>
              </div>
              {copySuccess && (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)', border: '1px solid var(--green)', padding: '2px 10px', flexShrink: 0 }}>
                  Copied
                </span>
              )}
            </div>

            <textarea
              readOnly
              value={generatedCode}
              rows={22}
              style={{
                width: '100%',
                resize: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                background: 'var(--ink)',
                color: '#4ade80',
                padding: '1rem',
                border: '1px solid var(--gray-3)',
                outline: 'none',
                lineHeight: 1.65,
                display: 'block',
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={handleCopy}
                style={{ border: '1px solid var(--blue)', background: 'var(--blue)', color: 'var(--white)', padding: '8px', fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer' }}
              >
                {copySuccess ? '✓ Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                style={{ border: '1px solid var(--line)', background: 'var(--white)', color: 'var(--ink)', padding: '8px', fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer' }}
              >
                Download
              </button>
              <button
                type="button"
                onClick={() => applyPreset('none')}
                style={{ border: '1px solid var(--line)', background: 'var(--white)', color: 'var(--ink)', padding: '8px', fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>

            <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', border: '1px solid var(--amber)', background: 'rgba(245,158,11,0.07)', fontSize: '0.8rem', color: 'var(--ink)', lineHeight: 1.5 }}>
              <strong>Warning:</strong> Test your site immediately after upload. A syntax error can trigger a site-wide 500 error.
            </div>
          </div>
        </div>

        {/* ── REDIRECT TESTER ── */}
        <div style={{ maxWidth: 1360, margin: '1.5rem auto 0' }}>
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Redirect Tester — Simulate Before You Deploy</h2>
            <p className="tool-box-sub">
              Enter any URL path and see exactly how the <span>redirect rules you configured above</span> will handle it: final destination, status codes, redirect chains, and loops — before the file ever touches your server.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '1rem' }}>
              <div>
                <label className="tool-box-label" htmlFor="rt-test-path">URL path to test</label>
                <input
                  type="text"
                  id="rt-test-path"
                  className="tool-url-input"
                  value={rtTestPath}
                  onChange={(e) => setRtTestPath(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') simulateRedirects() }}
                  placeholder="/old-page/some-article?utm_source=x"
                />
              </div>
              <button onClick={simulateRedirects} className="tool-analyze-btn" style={{ whiteSpace: 'nowrap' }}>
                <div className="tool-analyze-btn-dot" />
                Simulate
              </button>
            </div>

            {rtError && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.85rem', color: 'var(--red)' }}>
                {rtError}
              </div>
            )}

            {rtResult && (
              <div>
                {rtResult.hops.length === 0 ? (
                  <div style={{ padding: '12px 16px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', fontSize: '0.85rem', color: 'var(--green)', fontWeight: 600 }}>
                    ✓ No redirect rule matches this path — the URL serves as-is (200).
                  </div>
                ) : (
                  <div>
                    {/* Chain visualization */}
                    <div style={{ border: '1px solid var(--line)', background: 'var(--gray-1)', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', lineHeight: 2 }}>
                      {rtResult.hops.map((hop, i) => (
                        <div key={i}>
                          <span style={{ color: 'var(--ink)' }}>{hop.from}</span>
                          <span style={{ color: 'var(--amber)', fontWeight: 700 }}> → {hop.type} → </span>
                          <span style={{ color: i === rtResult.hops.length - 1 && !rtResult.loop ? 'var(--green)' : 'var(--ink)' }}>{hop.to}</span>
                          <span style={{ color: 'var(--gray-4)', fontSize: '0.72rem' }}>  ({hop.rule})</span>
                        </div>
                      ))}
                    </div>

                    {/* Verdicts */}
                    {rtResult.loop && (
                      <div style={{ marginTop: '0.75rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)', fontSize: '0.85rem', color: 'var(--red)' }}>
                        <strong>✗ Redirect loop detected.</strong> This URL never resolves — browsers will show ERR_TOO_MANY_REDIRECTS. Fix the rule that points back into the chain.
                      </div>
                    )}
                    {!rtResult.loop && rtResult.hops.length > 1 && (
                      <div style={{ marginTop: '0.75rem', padding: '10px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                        <strong>⚠ Redirect chain ({rtResult.hops.length} hops).</strong> Each hop leaks link equity and adds latency. Point the first rule directly at <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{rtResult.final}</code>.
                      </div>
                    )}
                    {!rtResult.loop && rtResult.hops.length === 1 && (
                      <div style={{ marginTop: '0.75rem', padding: '10px 14px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', fontSize: '0.85rem', color: 'var(--green)', fontWeight: 600 }}>
                        ✓ Clean single-hop {rtResult.hops[0].type} redirect to {rtResult.final}
                      </div>
                    )}
                  </div>
                )}
                <p style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>
                  Simulates the Redirect rules configured in this generator (Apache mod_alias prefix matching, first match wins, suffix and query string preserved). RewriteRule directives from CMS presets are not simulated.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOUNDER ── */}
      <div className="founder-section" style={{ padding: '4rem 2rem' }}>
        <div className="founder-inner" style={{ margin: '0 auto' }}>
          <div className="founder-avatar">RS</div>
          <div>
            <p className="founder-quote-text">
              &ldquo;I&apos;ve fixed hundreds of Apache server misconfigurations for clients who did not know what an
              .htaccess file was &mdash; let alone how to write one correctly. This tool generates safe,
              production-tested rules so you do not have to guess.&rdquo;
            </p>
            <p className="founder-name">Rohit Sharma</p>
            <p className="founder-role">
              Founder of SEOShouts &mdash;{' '}
              <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
            </p>
          </div>
        </div>
      </div>

      {/* ── WHAT IS .htaccess ── gray */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">What Is an .htaccess File and Why Does It Matter for SEO?</h2>
          </div>
          <div className="prose-content reveal">
            <p>
              An .htaccess file is a directory-level Apache configuration file that lets you control redirects,
              security headers, compression, and caching from your site root. Apache reads it before serving matching
              requests.
            </p>
            <p>
              For SEO, this file controls some of the most important technical behaviors: URL migrations, HTTP to
              HTTPS redirects, redirect-chain cleanup, compression, and browser caching. Getting these wrong can hurt
              crawling, indexing, and page speed.
            </p>
            <p>
              The challenge is syntax. Apache rules are unforgiving, and one typo can produce a site-wide 500 error.
              This generator outputs structured, commented rules so you can review and upload with less risk.
            </p>
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── white */}
      <section className="section features-section" style={{ background: 'var(--white)' }}>
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Key Features of Our .htaccess Generator</h2>
          </div>
          <div className="features-grid">
            {[
              {
                title: 'Complete Redirect Builder',
                desc: 'Create 301, 302, 307, and 308 redirects with multiple rows and clean Apache output.',
                paths: ['M5 12h14', 'M14 6l6 6-6 6'],
              },
              {
                title: 'Security Headers Suite',
                desc: 'Toggle XSS protection, clickjacking protection, content-type sniffing protection, HSTS, and more.',
                paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
              },
              {
                title: 'GZIP Compression',
                desc: 'Enable compression for HTML, CSS, JS, XML, and fonts to reduce transfer size.',
                paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
              },
              {
                title: 'Browser Caching Rules',
                desc: 'Set cache expiries for HTML, CSS/JS, images, and fonts with practical presets.',
                paths: ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z', 'M12 6v6l4 2'],
              },
              {
                title: 'CMS Presets',
                desc: 'WordPress, Shopify, Laravel, and Joomla presets prefill common settings and rewrite blocks.',
                paths: ['M12 2 2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
              },
              {
                title: 'Error Pages + PHP Settings',
                desc: 'Add ErrorDocument routes and optional php_value/php_flag overrides when hosting allows them.',
                paths: ['M16 18 22 12 16 6', 'M8 6 2 12 8 18'],
              },
            ].map((f) => (
              <div key={f.title} className="feature-card reveal">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {f.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.65, marginTop: '0.5rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO ── gray */}
      <section className="section howto-section" style={{ background: 'var(--gray-1)' }}>
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">How to Create and Upload Your .htaccess File</h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {[
              { n: '01', title: 'Select Your CMS Preset', desc: 'Choose WordPress, Shopify, Laravel, Joomla, or no preset to load common rewrite and optimization defaults.' },
              { n: '02', title: 'Configure Redirects', desc: 'Add redirects for moved URLs. Use 301 for permanent changes, migrations, and HTTPS upgrades.' },
              { n: '03', title: 'Enable Security Headers', desc: 'Turn on X-XSS-Protection, X-Frame-Options, X-Content-Type-Options, and other relevant headers.' },
              { n: '04', title: 'Configure Performance Rules', desc: 'Enable GZIP compression and browser caching to improve page speed and repeat-visit performance.' },
              { n: '05', title: 'Generate, Download & Upload', desc: 'Generate the file, review the commented output, download as .htaccess, upload to your server root, and test immediately.' },
            ].map((s, i) => (
              <div key={s.n} className="step-card reveal">
                {i < 4 && (
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
        </div>
      </section>

      {/* ── REDIRECT BEST PRACTICES ── white */}
      <section className="section why-section" style={{ background: 'var(--white)' }}>
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">.htaccess Redirect Best Practices for SEO</h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>
            <div className="why-card reveal" style={{ borderTop: '3px solid var(--green)' }}>
              <div className="why-card-title">
                <div className="why-card-icon" style={{ background: 'var(--green)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                Always Use 301 for Permanent Moves
              </div>
              <p className="why-card-body">
                Use 301 redirects for permanent URL changes, rebrands, migrations, and HTTP to HTTPS upgrades. Reserve
                302 for temporary changes such as campaign pages or short-term maintenance flows.
              </p>
            </div>
            <div className="why-card reveal" style={{ borderTop: '3px solid var(--blue)' }}>
              <div className="why-card-title">
                <div className="why-card-icon" style={{ background: 'var(--blue)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                Avoid Redirect Chains
              </div>
              <p className="why-card-body">
                Redirect chains (A &#8594; B &#8594; C) add latency and create crawling inefficiency. Redirect the original
                URL directly to the final destination. Validate live pages with the{' '}
                <a href="/tools/on-page-seo-analyzer/" style={{ color: 'var(--blue)' }}>On-Page SEO Analyzer</a>{' '}
                after deploying.
              </p>
            </div>
            <div className="why-card reveal" style={{ borderTop: '3px solid var(--amber)' }}>
              <div className="why-card-title">
                <div className="why-card-icon" style={{ background: 'var(--amber)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                Do Not Redirect to the Homepage
              </div>
              <p className="why-card-body">
                Redirect deleted URLs to the most relevant replacement page. Homepage redirects are a poor substitute
                for page-level relevance and can behave like soft 404s in Google&apos;s eyes.
              </p>
            </div>
          </div>

          {/* Code comparison */}
          <div style={{ marginTop: '2.5rem' }} className="reveal">
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '1rem' }}>
              Redirect Directive vs mod_rewrite
            </h3>
            <div className="tool-grid-2col" style={{ gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-4)', marginBottom: '0.5rem' }}>Simple Redirect</p>
                <pre style={{ background: 'var(--ink)', color: '#4ade80', padding: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.6, margin: 0, border: '1px solid var(--gray-3)' }}>{`Redirect 301 /old-page/\nhttps://yourdomain.com/new-page/`}</pre>
              </div>
              <div>
                <p style={{ fontSize: '0.72rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-4)', marginBottom: '0.5rem' }}>RewriteRule (Pattern Match)</p>
                <pre style={{ background: 'var(--ink)', color: '#4ade80', padding: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.6, margin: 0, border: '1px solid var(--gray-3)' }}>{`RewriteRule ^old-page/(.*)$\n/new-page/$1 [R=301,L]`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GZIP + COMPARISON TABLE ── gray */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">GZIP Compression and Core Web Vitals</h2>
          </div>
          <div className="prose-content reveal">
            <p>
              GZIP is one of the highest-ROI performance optimizations you can apply via .htaccess. It compresses
              text-based resources before they are sent to the browser.
            </p>
            <p>
              Combined with browser caching, it can significantly reduce transfer size and repeat-load overhead,
              supporting faster pages and stronger Core Web Vitals.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '2rem' }} className="reveal">
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--line)', minWidth: 400 }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--white)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Resource Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--white)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Average Size Reduction</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['HTML', '70–80%'],
                  ['CSS', '60–75%'],
                  ['JavaScript', '60–75%'],
                  ['XML/SVG', '65–80%'],
                  ['Web Fonts', '30–50%'],
                  ['Images (JPEG/PNG)', '<5% — usually not recommended'],
                ].map(([a, b], i) => (
                  <tr key={a} style={{ background: i % 2 === 0 ? 'var(--white)' : 'rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--ink)', fontWeight: 500 }}><span>{a}</span></td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--gray-5)' }}><span>{b}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-callout reveal" style={{ marginTop: '1.5rem' }}>
            <div className="prose-callout-title">Pair server rules with crawler controls</div>
            <p>
              Use our <a href="/tools/robots-txt-generator/" style={{ color: 'var(--blue-dark)', fontWeight: 600 }}>Robots.txt Generator</a> and{' '}
              <a href="/tools/xml-sitemap-generator/" style={{ color: 'var(--blue-dark)', fontWeight: 600 }}>XML Sitemap Generator</a> alongside your .htaccess for a complete technical SEO setup.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="s-header" style={{ marginTop: '4rem' }}>
            <h2 className="s-title">SEOShouts vs Other .htaccess Generators</h2>
          </div>
          <div style={{ overflowX: 'auto', marginTop: '1.5rem' }} className="reveal">
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--line)', minWidth: 500 }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--white)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Feature</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--blue-light)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SEOShouts</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--white)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5 }}>Others (typical)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['CMS Presets', 'Yes (4 presets)', 'Often missing'],
                  ['Security Headers', 'Yes (6 toggles)', 'Basic or missing'],
                  ['GZIP + Caching', 'Yes (configurable)', 'Basic or missing'],
                  ['Custom Error Pages', 'Yes', 'Often missing'],
                  ['PHP Settings', 'Yes', 'Rarely included'],
                  ['Commented Output', 'Yes', 'Usually no'],
                ].map(([feat, ours, theirs], i) => (
                  <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--white)' : 'rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--ink)', fontWeight: 600 }}><span>{feat}</span></td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--green)', fontWeight: 600 }}><span>{ours}</span></td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--gray-4)' }}><span>{theirs}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CHECKLIST ── white */}
      <section className="section features-section" style={{ background: 'var(--white)' }}>
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">.htaccess Checklist (2026)</h2>
            <p className="s-sub">Verify technical behavior before and after deployment using this checklist.</p>
          </div>
          <div className="tool-grid-2col" style={{ gap: '0', border: '1px solid var(--line)', marginTop: '3rem' }}>
            {[
              {
                title: 'Redirects', color: 'var(--blue)',
                paths: ['M5 12h14', 'M14 6l6 6-6 6'],
                items: ['All permanent changes use 301', 'HTTP to HTTPS redirect is in place', 'No redirect chains (A &#8594; B &#8594; C)', 'No homepage redirects for unrelated pages'],
              },
              {
                title: 'Security', color: 'var(--red)',
                paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                items: ['X-XSS-Protection enabled', 'X-Frame-Options SAMEORIGIN', 'X-Content-Type-Options nosniff', 'Directory listing disabled', 'HSTS only if fully HTTPS-ready'],
              },
              {
                title: 'Performance', color: 'var(--amber)',
                paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
                items: ['GZIP enabled for HTML/CSS/JS/XML/fonts', 'Browser caching configured', 'Reasonable expiries for all resource types', 'Re-test PageSpeed/Core Web Vitals'],
              },
              {
                title: 'After Upload', color: 'var(--green)',
                paths: ['M20 6L9 17l-5-5'],
                items: ['Root domain loads correctly', 'No www/non-www redirect loops', 'HTTPS redirect works cleanly', 'Custom error pages display correctly'],
              },
            ].map((card, i) => (
              <div key={card.title} className="feature-card reveal" style={{
                borderTop: `3px solid ${card.color}`,
                borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
              }}>
                <div className="feature-icon" style={{ background: card.color }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {card.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{card.title}</div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-5)' }}>
                      <span style={{ color: card.color, fontWeight: 700, flexShrink: 0, marginTop: '0.05em' }}>&#10003;</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── gray */}
      <section className="section faq-section" style={{ background: 'var(--gray-1)' }}>
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Frequently Asked Questions</h2>
            <p className="s-sub">Everything you need to know about .htaccess files and Apache rules</p>
          </div>
          <div className="faq-list">
            {[
              ['What is an .htaccess file?', 'An .htaccess file is a directory-level configuration file for Apache web servers. It controls redirects, security, compression, and caching without editing the main server config.'],
              ['Is .htaccess supported on my hosting?', 'Most shared hosts support .htaccess. Nginx servers do not use .htaccess, and some VPS/dedicated setups disable it if AllowOverride is None.'],
              ['Can a wrong .htaccess file break my website?', 'Yes. A syntax error can trigger a 500 error across the site. Always back up the existing file before replacing it.'],
              ['What is the difference between 301 and 302 redirects?', '301 is for permanent moves and is the correct default for migrations and URL changes. 302 is for temporary moves.'],
              ['Does GZIP compression work with all browsers?', 'Yes. Modern browsers support GZIP and automatically decompress responses.'],
              ['How do I add .htaccess to a WordPress site?', 'Upload it to the WordPress root directory (the folder with wp-config.php). Back up the existing file before replacing or merging rules.'],
              ['What is the difference between .htaccess and robots.txt?', '.htaccess controls server behavior; robots.txt controls crawler access directives. Use our Robots.txt Generator for crawler access rules.'],
              ['Can I use .htaccess if I am on Cloudflare?', 'Yes, but some rules may be redundant or conflict with Cloudflare-level HTTPS, caching, or compression settings.'],
              ['How do I test my .htaccess file before going live?', 'Three-step protocol: validate the syntax by deploying to a staging copy first (a syntax error takes the whole site to a 500), test each redirect with a curl -I request to confirm the status code and Location header, and finally click through your key pages plus one deliberately wrong URL to confirm the error page. The rules this generator produces are syntax-checked patterns, so testing focuses on your paths, not the grammar.'],
              ['Why does my site show a 500 error after uploading .htaccess?', 'A 500 error immediately after upload almost always means a syntax error or a directive your host does not allow (often mod_headers or mod_expires not enabled). Restore your backup file first, then re-add the generated blocks one at a time to isolate the offending rule.'],
            ].map(([q, a]) => (
              <details key={q} className="faq-item reveal">
                <summary>{q}</summary>
                <div className="faq-answer">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── HTACCESS TESTER GUIDE ── white */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Htaccess Tester</div>
            <h2 className="s-title">How to test your .htaccess and <span className="blue">Apache rewrite rules</span></h2>
          </div>
          <div className="prose-content">
            <p>Generating the file is half the job; verifying it behaves is the other half. An .htaccess test takes five minutes and prevents the two classic disasters: a site-wide 500 error and silent redirect loops. Here is the protocol we use on every deployment:</p>
            <ul>
              <li><strong>Back up first.</strong> Download the current .htaccess before replacing it. Rollback is your fastest fix.</li>
              <li><strong>Test rewrite rules with curl.</strong> Run <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>curl -I https://yoursite.com/old-page/</code> for each redirect. You want exactly one <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>301</code> with the correct Location header, not a 302, and not a chain of hops.</li>
              <li><strong>Check the whole site still loads.</strong> Homepage, one inner page, one image, one CSS file. A blocked asset directory shows up here immediately.</li>
              <li><strong>Verify headers and compression.</strong> In browser DevTools (Network tab), confirm <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>content-encoding: gzip</code> and your security headers (X-Frame-Options, X-Content-Type-Options) are present on responses.</li>
              <li><strong>Test the error page.</strong> Visit a URL that does not exist and confirm your custom 404 renders instead of the server default.</li>
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">Testing rewrite regex specifically</div>
              <p>For complex RewriteRule patterns, test the regex against sample URLs before deploying: htaccess.madewithlove.com is the long-standing community tester for simulating Apache rewrite behavior. The patterns generated by this tool are pre-validated, so you only need to confirm your own paths and domains are correct.</p>
            </div>
            <p>After the .htaccess passes, confirm the SEO side: crawl your redirects with the <a href="/tools/internal-link-checker/" style={{ color: 'var(--blue)' }}>internal link checker</a> to catch links still pointing at old URLs, and re-run the <a href="/tools/on-page-seo-analyzer/" style={{ color: 'var(--blue)' }}>on-page SEO analyzer</a> to verify headers and HTTPS behavior.</p>
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
                name: '.htaccess Generator',
                desc: 'Generate Apache server rules for redirects, security headers, GZIP compression, and browser caching.',
                current: true,
                href: '/tools/htaccess-generator/',
                paths: ['M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z', 'M8 10h8', 'M8 14h5'],
              },
              {
                name: 'Robots.txt Generator',
                desc: 'Pair server-level Apache rules with crawler directives for a complete technical SEO setup.',
                current: false,
                href: '/tools/robots-txt-generator/',
                paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'],
              },
              {
                name: 'XML Sitemap Generator',
                desc: 'Rebuild your XML sitemap after migrations so redirected or removed URLs are handled correctly.',
                current: false,
                href: '/tools/xml-sitemap-generator/',
                paths: ['M3 3h18v18H3z', 'M3 9h18', 'M3 15h18', 'M9 3v18', 'M15 3v18'],
              },
              {
                name: 'On-Page SEO Analyzer',
                desc: 'Audit redirects, status codes, crawlability, and 150+ technical SEO factors after deploying .htaccess rules.',
                current: false,
                href: '/tools/on-page-seo-analyzer/',
                paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
              },
              {
                name: 'Schema Generator',
                desc: 'Combine server optimization with structured data to improve how search engines understand your pages.',
                current: false,
                href: '/tools/schema-generator/',
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
          <h2 className="final-cta-title">Stop Guessing <span>Apache Syntax</span></h2>
          <p className="final-cta-sub">
            Generate a production-ready .htaccess file in under 2 minutes. Tested, commented rules — ready to upload.
          </p>
          <div className="final-cta-row">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-primary">
              Generate Your .htaccess File Now
            </button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {[
              'Instant results — no account required',
              'Tested, commented Apache syntax',
              'Download as ready-to-upload .htaccess',
            ].map((p) => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
