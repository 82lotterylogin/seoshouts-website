'use client'

import { useState, useEffect } from 'react'
import ShapeGrid from '../../components/ShapeGrid'

type DisavowMode = 'domain' | 'url'

interface ProcessedEntry {
  id: string
  original: string
  extracted: string
  type: DisavowMode
  excluded: boolean
  whitelisted: boolean
}

interface DisavowStats {
  raw: number
  extracted: number
  duplicates: number
  whitelisted: number
  final: number
}

const SKIP_PATTERNS = new Set([
  'referring domain', 'domain', 'url', 'source url', 'link', 'backlink',
])

const DEFAULT_STATS: DisavowStats = { raw: 0, extracted: 0, duplicates: 0, whitelisted: 0, final: 0 }

const FEATURE_ITEMS = [
  { title: 'Auto-Extract Domains', desc: 'Pulls root domains from any pasted URL format automatically — spreadsheet exports, full URLs, or bare domains all work.' },
  { title: 'Smart Deduplication', desc: 'Removes repeated domains; each domain appears exactly once in the output, even if it appeared hundreds of times in your export.' },
  { title: 'Whitelist Filter', desc: 'Mark trusted domains to exclude from the disavow file. Protects legitimate backlinks from being accidentally disavowed.' },
  { title: 'Google-Compliant Output', desc: 'Correct domain: prefix syntax with proper UTF-8 encoding for immediate Google Search Console submission.' },
]

const FAQ_ITEMS = [
  { q: 'What is a disavow file?', a: 'A disavow file is a plain text document submitted to Google Search Console listing domains or URLs whose backlinks you want Google to ignore. When submitted, Google excludes those links from its ranking calculations. The file uses a specific format: domain-level entries start with domain:, URL-level entries are plain URLs, and comments begin with #.' },
  { q: 'Does disavowing links still work?', a: "Google's Penguin algorithm has been running in real time since 2016, meaning many harmful links are automatically devalued. However, for sites that have received manual actions or have clear patterns of manipulative link building, the disavow tool remains effective. Google's John Mueller confirmed in 2023 that the tool is still actively used by Google's systems." },
  { q: 'What format does Google Search Console require for disavow files?', a: 'The file must be plain UTF-8 text with a .txt extension. Domain entries use the format domain:example.com. URL entries are plain URLs. Lines starting with # are comments and are ignored. Maximum file size is 2MB. This generator produces output that meets all these requirements.' },
  { q: 'Should I disavow the entire domain or specific URLs?', a: 'Disavow the entire domain when the whole site is spam, a link farm, or a PBN. Use URL-level disavow only when a legitimate site has one problematic page linking to you. Google recommends domain-level disavow for the vast majority of spam cleanup cases because it covers all current and future links from that domain.' },
  { q: 'Will disavowing links hurt my good rankings?', a: "Only if you accidentally disavow legitimate backlinks. This is why the whitelist feature is critical — use it to protect domains you know are sending you valuable links. Never disavow your most authoritative links. If you're uncertain about a domain, err on the side of not disavowing it." },
  { q: 'How long does it take for Google to process a disavow file?', a: 'Google typically processes new or updated disavow files within a few days. However, ranking changes resulting from the disavow may take several weeks to months to manifest, depending on your crawl frequency and the severity of the link issues.' },
  { q: 'Can I update my disavow file after submitting?', a: 'Yes. Uploading a new disavow file replaces the previous one entirely — it does not add to it. Always maintain a master disavow file that you update and re-upload. Never submit a partial list expecting it to merge with your previous submission.' },
  { q: 'Do I need to disavow nofollow backlinks?', a: 'No. Nofollow links (rel="nofollow") are already ignored by Google for ranking purposes. Including them in your disavow file is harmless but unnecessary. The disavow tool is intended for followed links that pass PageRank.' },
  { q: 'How do I make a disavow file from scratch?', a: 'Collect your toxic domains from a backlink audit, then either type them into this generator (it handles the formatting automatically) or create a plain UTF-8 .txt file manually: one entry per line, domain:example.com for whole domains, full URLs for single pages, and # for comment lines. Save as .txt and upload it at google.com/webmasters/tools/disavow-links in Search Console.' },
]

function makeEntryId(index: number): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `entry-${Date.now()}-${index}`
}

function extractHostnameFromUrl(input: string): string | null {
  try {
    const parsed = new URL(input)
    let hostname = parsed.hostname.toLowerCase()
    if (hostname.startsWith('www.')) hostname = hostname.slice(4)
    return hostname
  } catch { return null }
}

function extractRootDomain(input: string): string | null {
  try {
    let value = input.trim()
    if (!value) return null
    if (/^domain:/i.test(value)) value = value.replace(/^domain:/i, '')
    if (!/^https?:\/\//i.test(value)) value = `http://${value}`
    const parsed = new URL(value)
    let hostname = parsed.hostname.toLowerCase()
    if (hostname.startsWith('www.')) hostname = hostname.slice(4)
    if (!hostname.includes('.')) return null
    if (!/^[a-z0-9.-]+$/.test(hostname)) return null
    if (hostname.includes('..')) return null
    return hostname
  } catch { return null }
}

function normalizeUrl(input: string): string | null {
  try {
    let value = input.trim()
    if (!value || /^domain:/i.test(value)) return null
    if (!/^https?:\/\//i.test(value)) value = `http://${value}`
    const parsed = new URL(value)
    if (!/^https?:$/.test(parsed.protocol)) return null
    return parsed.href
  } catch { return null }
}

function buildOutputText(entries: ProcessedEntry[], commentText: string): string {
  const lines: string[] = []
  const date = new Date().toISOString().split('T')[0]
  lines.push('# Disavow File')
  lines.push('# Generated by SEOShouts Disavow Generator')
  lines.push(`# Date: ${date}`)
  lines.push('# https://seoshouts.com/tools/disavow-file-generator/')
  lines.push('#')
  lines.push('# Submit this file via Google Search Console:')
  lines.push('# https://search.google.com/search-console/disavow-links')
  lines.push('#')
  if (commentText.trim()) {
    lines.push(`# Note: ${commentText.trim()}`)
    lines.push('#')
  }
  lines.push('')
  entries
    .filter((entry) => !entry.excluded && !entry.whitelisted)
    .forEach((entry) => {
      lines.push(entry.type === 'domain' ? `domain:${entry.extracted}` : entry.extracted)
    })
  return lines.join('\n')
}

function calculateStats(raw: number, extracted: number, duplicates: number, entries: ProcessedEntry[]): DisavowStats {
  const whitelisted = entries.filter((entry) => entry.whitelisted).length
  const final = entries.filter((entry) => !entry.whitelisted && !entry.excluded).length
  return { raw, extracted, duplicates, whitelisted, final }
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--gray-3)',
  padding: '10px 14px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.88rem',
  color: 'var(--ink)',
  outline: 'none',
  background: 'var(--white)',
  resize: 'vertical' as const,
}

export default function DisavowFileGeneratorClient() {
  const [inputText, setInputText] = useState('')
  const [disavowMode, setDisavowMode] = useState<DisavowMode>('domain')
  const [processedEntries, setProcessedEntries] = useState<ProcessedEntry[]>([])
  const [comment, setComment] = useState('')
  const [whitelist, setWhitelist] = useState('')
  const [outputText, setOutputText] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [stats, setStats] = useState<DisavowStats>(DEFAULT_STATS)
  const [errors, setErrors] = useState<string[]>([])
  const [uiError, setUiError] = useState('')
  const [copyError, setCopyError] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [hasProcessed, setHasProcessed] = useState(false)

  const inputLength = inputText.length
  const showLargeWarning = inputLength >= 40000 && inputLength <= 50000
  const exceedsMaxInput = inputLength > 50000

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const recompute = (entries: ProcessedEntry[], rawCount: number, extractedCount: number, duplicateCount: number, commentText: string) => {
    setStats(calculateStats(rawCount, extractedCount, duplicateCount, entries))
    setOutputText(buildOutputText(entries, commentText))
  }

  const processInput = () => {
    setUiError(''); setCopyError(''); setCopySuccess(false)
    if (!inputText.trim()) { setUiError('Please paste your URLs or domains first'); return }
    if (exceedsMaxInput) { setUiError('Input is too large. Please keep pasted data under 50,000 characters.'); return }

    const whitelistDomains = whitelist.split('\n').map((v) => v.trim().toLowerCase()).filter(Boolean).map((v) => v.replace(/^domain:/, '').replace(/^www\./, ''))
    const rawLines = inputText.split(/[\n,\t]/).map((v) => v.trim()).filter(Boolean)
    const parseErrors: string[] = []
    const seen = new Set<string>()
    const entries: ProcessedEntry[] = []
    let extractedCount = 0, duplicateCount = 0

    rawLines.forEach((line, index) => {
      const headerProbe = line.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\s+/g, ' ').trim()
      if (SKIP_PATTERNS.has(headerProbe)) return
      let extracted: string | null = null
      if (disavowMode === 'domain') {
        extracted = extractRootDomain(line)
        if (!extracted) { parseErrors.push(`Line ${index + 1}: Could not extract domain from "${line}"`); return }
      } else {
        extracted = normalizeUrl(line)
        if (!extracted) { parseErrors.push(`Line ${index + 1}: Invalid URL "${line}"`); return }
      }
      extractedCount += 1
      if (seen.has(extracted)) { duplicateCount += 1; return }
      seen.add(extracted)
      const whitelistTarget = disavowMode === 'domain' ? extracted : (extractHostnameFromUrl(extracted) ?? extracted)
      const isWhitelisted = whitelistDomains.some((domain) => whitelistTarget === domain || whitelistTarget.endsWith(`.${domain}`))
      entries.push({ id: makeEntryId(index), original: line, extracted, type: disavowMode, excluded: false, whitelisted: isWhitelisted })
    })

    setHasProcessed(true); setErrors(parseErrors); setShowErrors(parseErrors.length > 0); setProcessedEntries(entries)
    if (entries.length < 1) {
      setStats({ raw: rawLines.length, extracted: extractedCount, duplicates: duplicateCount, whitelisted: 0, final: 0 })
      setOutputText(''); setUiError('No valid domains could be extracted. Check your input format.'); return
    }
    recompute(entries, rawLines.length, extractedCount, duplicateCount, comment)
  }

  const toggleExclude = (id: string) => {
    setCopySuccess(false); setCopyError('')
    const updated = processedEntries.map((entry) => entry.id === id ? { ...entry, excluded: !entry.excluded } : entry)
    setProcessedEntries(updated)
    recompute(updated, stats.raw, stats.extracted, stats.duplicates, comment)
  }

  const handleCommentChange = (value: string) => {
    setComment(value)
    if (hasProcessed) setOutputText(buildOutputText(processedEntries, value))
  }

  const handleCopy = async () => {
    if (!outputText.trim()) return
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(outputText)
      setCopyError(''); setCopySuccess(true)
      window.setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      setCopySuccess(false); setCopyError('Copy failed. Please copy the text manually.')
    }
  }

  const handleDownload = () => {
    if (!outputText.trim() || stats.final < 1) return
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'disavow.txt'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Disavow File Generator</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free Disavow File <span>Generator</span>
          </h1>
          <p className="tool-hero-sub">
            Paste toxic backlinks from Ahrefs, Semrush, or Moz — auto-extract root domains, remove duplicates,
            whitelist trusted sites, and download a Google Search Console&ndash;compliant disavow.txt in seconds.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Auto Domain Extraction', 'Smart Deduplication', 'Whitelist Filter', '100% Free'].map((label) => (
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
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: Input */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Paste Your Toxic Backlinks</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', marginBottom: '1.25rem', lineHeight: 1.5, textAlign: 'center' }}>
              Paste URLs from Ahrefs, Semrush, Moz, or any backlink report &mdash; messy spreadsheet format is fine.
            </p>

            {/* Disavow Mode */}
            <label className="tool-box-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Disavow Mode</label>
            <div className="tabs" style={{ marginBottom: '1.25rem' }}>
              <button type="button" onClick={() => setDisavowMode('domain')} className={`tab${disavowMode === 'domain' ? ' active' : ''}`}>
                Domain-level
              </button>
              <button type="button" onClick={() => setDisavowMode('url')} className={`tab${disavowMode === 'url' ? ' active' : ''}`}>
                URL-level
              </button>
            </div>

            {/* Main Input */}
            <label htmlFor="disavow-input" className="tool-box-label">Backlink URLs / Domains</label>
            <textarea
              id="disavow-input"
              value={inputText}
              onChange={(e) => { setInputText(e.target.value); if (uiError) setUiError('') }}
              placeholder={'Paste one URL/domain per line or paste a spreadsheet column...\n\nhttps://spamsite.com/link\nlinkfarm.net\ndomain:badsite.org'}
              rows={10}
              style={{ ...inputStyle, lineHeight: 1.6 }}
            />
            <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--gray-4)' }}>{inputLength.toLocaleString()} / 50,000 chars</span>
              {showLargeWarning && !exceedsMaxInput && (
                <span style={{ color: 'var(--amber)', border: '1px solid var(--amber)', padding: '2px 8px', fontWeight: 600 }}>
                  Warning at 40,000+ chars
                </span>
              )}
              {exceedsMaxInput && (
                <span style={{ color: 'var(--red)', border: '1px solid var(--red)', padding: '2px 8px', fontWeight: 600 }}>
                  Too large. Keep under 50,000 chars.
                </span>
              )}
            </div>

            {/* Whitelist */}
            <label htmlFor="whitelist" className="tool-box-label">Whitelist (domains to keep)</label>
            <textarea
              id="whitelist"
              value={whitelist}
              onChange={(e) => setWhitelist(e.target.value)}
              placeholder={'example.com\npartner-site.com'}
              rows={4}
              style={{ ...inputStyle, lineHeight: 1.6, marginBottom: '1rem' }}
            />

            {/* File Note */}
            <label htmlFor="comment" className="tool-box-label">Optional File Note</label>
            <input
              id="comment"
              type="text"
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Example: Post-negative SEO cleanup"
              style={{ ...inputStyle, resize: undefined, marginBottom: '1rem' }}
            />

            {uiError && (
              <div style={{ padding: '0.75rem 1rem', border: '1px solid var(--red)', background: 'rgba(220,38,38,0.06)', fontSize: '0.82rem', color: 'var(--red)', marginBottom: '1rem' }}>
                {uiError}
              </div>
            )}

            <button
              type="button"
              onClick={processInput}
              disabled={exceedsMaxInput}
              style={{
                width: '100%', border: 'none', background: exceedsMaxInput ? 'var(--gray-3)' : 'var(--blue)',
                color: 'var(--white)', padding: '13px 24px', fontSize: '0.95rem',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                cursor: exceedsMaxInput ? 'not-allowed' : 'pointer', opacity: exceedsMaxInput ? 0.6 : 1,
                letterSpacing: '-0.01em',
              }}
            >
              Generate Disavow File
            </button>
          </div>

          {/* RIGHT: Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Processed Entries */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--line)' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', margin: 0 }}>
                  Processed Entries Review
                </h3>
                {hasProcessed && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-4)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {processedEntries.length} unique entries
                  </span>
                )}
              </div>
              <div style={{ maxHeight: 240, overflowY: 'auto', padding: '0.75rem' }}>
                {!hasProcessed ? (
                  <div style={{ border: '1px dashed var(--gray-3)', padding: '1rem', fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>
                    Paste backlinks and click Generate to review extracted entries here.
                  </div>
                ) : processedEntries.length === 0 ? (
                  <div style={{ border: '1px dashed var(--gray-3)', padding: '1rem', fontSize: '0.82rem', color: 'var(--gray-4)' }}>
                    No valid entries were extracted.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {processedEntries.map((entry) => {
                      const isWl = entry.whitelisted, isEx = entry.excluded
                      const statusColor = isWl ? 'var(--blue)' : isEx ? 'var(--amber)' : 'var(--green)'
                      const statusLabel = isWl ? 'Whitelisted' : isEx ? 'Excluded' : 'Active'
                      return (
                        <div key={entry.id} style={{ border: '1px solid var(--line)', background: 'var(--white)', padding: '0.6rem 0.875rem' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {entry.extracted}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--gray-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {entry.original}
                              </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: statusColor, border: `1px solid ${statusColor}`, padding: '1px 7px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
                                {statusLabel}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleExclude(entry.id)}
                                disabled={entry.whitelisted}
                                style={{ border: '1px solid var(--line)', background: 'var(--white)', padding: '2px 8px', fontSize: '0.72rem', color: 'var(--gray-5)', cursor: entry.whitelisted ? 'not-allowed' : 'pointer', opacity: entry.whitelisted ? 0.45 : 1, fontFamily: 'Inter, sans-serif' }}
                              >
                                {entry.excluded ? 'Include' : 'Exclude'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Strip */}
            <div className="stats-strip" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginTop: 0 }}>
              {[
                { label: 'Raw', value: stats.raw, highlight: false },
                { label: 'Extracted', value: stats.extracted, highlight: false },
                { label: 'Dupes', value: stats.duplicates, highlight: false },
                { label: 'Whitelist', value: stats.whitelisted, highlight: false },
                { label: 'Final', value: stats.final, highlight: true },
              ].map((s) => (
                <div key={s.label} className="stat-cell">
                  <div className={`stat-cell-num${s.highlight ? ' blue' : ''}`}>{s.value}</div>
                  <div className="stat-cell-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Output Panel */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', margin: 0 }}>Generated disavow.txt</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: '2px' }}>
                    {stats.final > 0 ? `${stats.final} active ${stats.final === 1 ? 'entry' : 'entries'} ready` : 'No active entries yet'}
                  </p>
                </div>
                {copySuccess && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)', border: '1px solid var(--green)', padding: '2px 10px' }}>Copied</span>}
              </div>
              <textarea
                readOnly
                value={outputText}
                placeholder="Your generated disavow.txt will appear here after clicking Generate..."
                rows={12}
                style={{
                  width: '100%', resize: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem',
                  background: 'var(--ink)', color: '#4ade80', padding: '1rem',
                  border: 'none', outline: 'none', lineHeight: 1.65, display: 'block',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--line)' }}>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!outputText.trim()}
                  style={{ border: '1px solid var(--line)', background: 'var(--white)', color: 'var(--ink)', padding: '8px', fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, cursor: !outputText.trim() ? 'not-allowed' : 'pointer', opacity: !outputText.trim() ? 0.5 : 1 }}
                >
                  {copySuccess ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!outputText.trim() || stats.final < 1}
                  style={{ border: 'none', background: !outputText.trim() || stats.final < 1 ? 'var(--gray-3)' : 'var(--blue)', color: 'var(--white)', padding: '8px', fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, cursor: !outputText.trim() || stats.final < 1 ? 'not-allowed' : 'pointer', opacity: !outputText.trim() || stats.final < 1 ? 0.5 : 1 }}
                >
                  Download disavow.txt
                </button>
              </div>
              {copyError && (
                <div style={{ padding: '0.5rem 0.875rem', borderTop: '1px solid var(--red)', background: 'rgba(220,38,38,0.06)', fontSize: '0.78rem', color: 'var(--red)' }}>
                  {copyError}
                </div>
              )}
            </div>

            {/* Parse Errors */}
            {errors.length > 0 && (
              <div style={{ border: '1px solid var(--amber)', background: 'rgba(245,158,11,0.05)' }}>
                <button
                  type="button"
                  onClick={() => setShowErrors((v) => !v)}
                  style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--amber)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Parse Errors ({errors.length})
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--amber)', fontWeight: 600 }}>{showErrors ? 'Hide' : 'Show'}</span>
                </button>
                {showErrors && (
                  <div style={{ borderTop: '1px solid rgba(245,158,11,0.3)', padding: '0.75rem 1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {errors.map((error) => (
                        <li key={error} style={{ fontSize: '0.75rem', color: 'var(--amber)', wordBreak: 'break-word' }}>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
              &ldquo;I&apos;ve used Google&apos;s disavow tool for client campaigns since it launched in 2012. The biggest
              mistake I see? People submit improperly formatted files or accidentally disavow their own backlinks. This
              tool handles the formatting automatically and lets you whitelist domains you actually want &mdash; so you
              don&apos;t accidentally torpedo your link profile.&rdquo;
            </p>
            <p className="founder-name">Rohit Sharma</p>
            <p className="founder-role">
              Founder of SEOShouts &mdash; 13+ Years in Technical SEO &mdash;{' '}
              <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
            </p>
          </div>
        </div>
      </div>

      {/* ── WHAT IS A DISAVOW FILE ── gray */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">What Is a Disavow File and When Should You Use One?</h2>
          </div>
          <div className="prose-content reveal">
            <p>
              A disavow file is a plain text document submitted to Google Search Console that instructs Google to ignore
              specific backlinks when evaluating your website. When Google receives your disavow file, it excludes those
              links from its ranking calculations — effectively neutralizing their negative influence without requiring you
              to contact each linking site.
            </p>
            <p>
              Google launched the disavow tool in 2012 in response to widespread negative SEO attacks and post-Penguin
              cleanup efforts. A decade later, the tool remains the primary mechanism for managing toxic link profiles.
              However, Google&apos;s John Mueller has been explicit: <strong>&ldquo;The disavow tool is for people who have
              received a manual action for unnatural links, or who are very confident they have a pattern of bad
              links.&rdquo;</strong> It should not be used casually.
            </p>
            <p>
              The disavow file format is strict. Each entry must appear on its own line, domain-level entries must begin
              with <code>domain:</code>, and the file must be saved as plain UTF-8 text with a .txt extension. A single
              formatting error can cause Google Search Console to reject or partially ignore your submission. This
              generator handles all formatting requirements automatically.
            </p>
            <p>
              The key nuance: use domain-level disavow (<code>domain:example.com</code>) when an entire domain is spammy
              — this disavows all current and future links from that domain and any subdomains. Use URL-level disavow only
              when specific pages on an otherwise legitimate site are problematic.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHEN TO DISAVOW / WHEN NOT TO ── white */}
      <section className="section why-section" style={{ background: 'var(--white)' }}>
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">When Should You Disavow Links?</h2>
            <p className="s-sub">Not every bad backlink requires a disavow. Google&apos;s systems are sophisticated enough to ignore most spam links naturally. Aggressive or incorrect disavowing can remove links that were actually helping your rankings.</p>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '3rem' }}>
            <div className="why-card reveal" style={{ borderTop: '3px solid var(--green)' }}>
              <div className="why-card-title">
                <div className="why-card-icon" style={{ background: 'var(--green)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                When Disavowing Is Appropriate
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                {[
                  ['Manual Action for Unnatural Links', 'If Google Search Console shows a manual action notice specifically mentioning unnatural links, you must disavow the offending links and submit a reconsideration request.'],
                  ['Post-Negative SEO Attack', 'A sudden surge of links from adult sites, gambling sites, link farms, or foreign-language spam directories, combined with ranking drops.'],
                  ['Paid Link Schemes You Participated In', 'If your site was part of a link scheme (paid links, reciprocal link networks, article spinning directories), disavowing those links protects you from future Penguin penalties.'],
                  ['Pre-Acquisition Cleanup', 'Before purchasing a website or domain, auditing and disavowing its toxic links is standard due diligence.'],
                ].map(([title, desc]) => (
                  <div key={title}>
                    <p style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>{title}</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-card reveal" style={{ borderTop: '3px solid var(--red)' }}>
              <div className="why-card-title">
                <div className="why-card-icon" style={{ background: 'var(--red)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                When You Should NOT Disavow
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Links from low-DA domains that have no obvious spam signals',
                  'Competitor backlinks (you cannot disavow their links, only your own)',
                  'Legitimate links from real sites even if the anchor text seems off',
                  'All nofollow links — Google ignores these by default',
                  'Links that appear in your report but were never indexed by Google',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0, fontSize: '0.85rem' }}>&#215;</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOMAIN vs URL LEVEL ── gray */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Domain-Level vs URL-Level Disavow</h2>
          </div>
          <div style={{ overflowX: 'auto', marginTop: '2rem' }} className="reveal">
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--line)', minWidth: 560 }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  {['Factor', 'Domain-Level (domain:example.com)', 'URL-Level (https://example.com/page)'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--white)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}><span>{h}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Scope', 'All links from that domain + subdomains', 'Only that specific page\'s links'],
                  ['When to use', 'Entire domain is spam or irrelevant', 'Only specific pages are problematic'],
                  ['Risk if wrong', 'Disavows good links from the same domain', 'Low — only affects one page'],
                  ['Google\'s recommendation', 'Preferred for spam domains', 'Use for selective cleanup'],
                  ['Coverage', 'Current + future links from that domain', 'Only the existing link from that URL'],
                ].map(([factor, domain, url], i) => (
                  <tr key={factor} style={{ background: i % 2 === 0 ? 'var(--white)' : 'rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--ink)', fontWeight: 600 }}><span>{factor}</span></td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--gray-5)' }}><span>{domain}</span></td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--gray-5)' }}><span>{url}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="prose-callout reveal" style={{ marginTop: '1.5rem' }}>
            <div className="prose-callout-title">Best practice</div>
            <p>Default to domain-level disavow for sites that are clearly spam (link farms, PBNs, directory spam, foreign gibberish sites). Use URL-level only when a legitimate site has one specific spammy page pointing to you. This generator defaults to domain-level and automatically extracts root domains from any URL you paste.</p>
          </div>
        </div>
      </section>

      {/* ── HOW TO BUILD YOUR DISAVOW FILE ── white (default) */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">How to Build Your Disavow File (Step-by-Step)</h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { n: '01', title: 'Export Your Backlink Profile', desc: 'Use Ahrefs, Semrush, Moz Link Explorer, or Google Search Console to export your complete link profile as CSV.' },
              { n: '02', title: 'Identify Toxic Links', desc: 'Sort by domain rating. Investigate low-authority, high-spam, foreign-language, and known PBN domains. Manual review is essential — automated spam scores have high false positive rates.' },
              { n: '03', title: 'Paste Into the Generator', desc: 'Copy your list of toxic URLs or domains and paste directly into the input box. Full URLs, bare domains, and spreadsheet exports are all accepted.' },
              { n: '04', title: 'Add Your Whitelist', desc: 'Paste trusted domains you want to keep into the Whitelist field. The generator excludes them from the disavow output while showing them in the review list.' },
              { n: '05', title: 'Review, Edit, and Download', desc: 'Review each extracted entry in the processed list. Toggle Exclude on any entry to remove it manually. Check the stats panel and download when satisfied.' },
              { n: '06', title: 'Submit to Google Search Console', desc: 'Go to search.google.com/search-console/disavow-links, select your property, click Upload disavow file, and select your downloaded disavow.txt.' },
            ].map((s, i) => (
              <div key={s.n} className="step-card reveal">
                {i % 3 !== 2 && i < 5 && (
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

      {/* ── KEY FEATURES ── gray (default) */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Key Features of This Disavow Generator</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {[
              {
                title: 'Auto-Extract Domains',
                desc: 'Pulls root domains from any pasted URL format automatically — spreadsheet exports, full URLs, or bare domains all work.',
                paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
              },
              {
                title: 'Smart Deduplication',
                desc: 'Removes repeated domains; each domain appears exactly once in the output, even if it appeared hundreds of times in your export.',
                paths: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4 12 14.01l-3-3'],
              },
              {
                title: 'Whitelist Filter',
                desc: 'Mark trusted domains to exclude from the disavow file. Protects legitimate backlinks from being accidentally disavowed.',
                paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
              },
              {
                title: 'Google-Compliant Output',
                desc: 'Correct domain: prefix syntax with proper UTF-8 encoding and commented header for immediate Google Search Console submission.',
                paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
              },
            ].map((f, i) => (
              <div key={f.title} className="feature-card reveal" style={{
                borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
              }}>
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

      {/* ── STATS PANEL + FORMAT REQUIREMENTS ── white */}
      <section className="section prose-section" style={{ background: 'var(--white)' }}>
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">Reading the Stats Panel and Google Format Requirements</h2>
          </div>
          <div className="tool-grid-2col" style={{ gap: '1.5rem', marginTop: '2rem' }}>
            <div className="why-card reveal">
              <div className="why-card-title">
                <div className="why-card-icon">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
                  </svg>
                </div>
                Reading the Stats Panel
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                {[
                  ['Raw', 'Total lines in your original paste'],
                  ['Extracted', 'Valid domains/URLs successfully parsed'],
                  ['Duplicates Removed', 'Lines that were identical after extraction'],
                  ['Whitelisted', 'Entries matching your whitelist — excluded from output'],
                  ['Final', 'The number of entries that will appear in your disavow file'],
                ].map(([term, def]) => (
                  <p key={term} style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif' }}>{term}:</strong> {def}
                  </p>
                ))}
              </div>
            </div>
            <div className="why-card reveal">
              <div className="why-card-title">
                <div className="why-card-icon">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                Google Format Requirements
              </div>
              <pre style={{ background: 'var(--ink)', color: '#4ade80', padding: '0.875rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', overflowX: 'auto', lineHeight: 1.65, margin: '0.75rem 0', border: '1px solid var(--gray-3)' }}>{`# Lines starting with # are comments\n# Date created: YYYY-MM-DD\n\n# Domain-level disavow\ndomain:spamsite.com\ndomain:linkfarm.net\n\n# URL-level disavow\nhttps://site.com/spam-page/`}</pre>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  'Domain entries MUST start with domain: (lowercase)',
                  'One entry per line, plain UTF-8 text (.txt)',
                  'Comments begin with #',
                  'Maximum 2MB file size, maximum 100,000 entries',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700 }}>&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── gray */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <h2 className="s-title">SEOShouts vs Other Disavow Generators</h2>
          </div>
          <div style={{ overflowX: 'auto', marginTop: '2rem' }} className="reveal">
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--line)', minWidth: 700 }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  {['Feature', 'SEOShouts', 'SUSO Digital', 'Pixus', 'WebNots', 'aliseoservices'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: i === 1 ? 'var(--blue-light)' : 'rgba(255,255,255,0.6)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}><span>{h}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Auto Domain Extraction', 'Any format', '&#215;', '&#215;', '&#215;', 'Basic only'],
                  ['Smart Deduplication', 'Automatic', '&#215;', '&#215;', '&#215;', '&#215;'],
                  ['Whitelist / Exclusion', 'Per-domain', '&#215;', '&#215;', '&#215;', '&#215;'],
                  ['Per-Entry Toggle', 'Individual rows', '&#215;', '&#215;', '&#215;', '&#215;'],
                  ['Domain vs URL Mode', 'Toggle', '&#10003;', '&#215;', '&#10003;', '&#215;'],
                  ['Processing Stats', 'Full breakdown', '&#215;', '&#215;', '&#215;', '&#215;'],
                  ['Paste Spreadsheet Data', '&#10003;', '&#215;', '&#215;', '&#215;', '&#215;'],
                  ['File Download', 'disavow.txt', '&#10003;', '&#10003;', '&#10003;', '&#10003;'],
                ].map(([feat, ours, ...others], i) => (
                  <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--white)' : 'rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600 }}><span>{feat}</span></td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--green)', fontWeight: 600 }}><span dangerouslySetInnerHTML={{ __html: ours }} /></td>
                    {others.map((val, j) => (
                      <td key={j} style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', fontSize: '0.85rem', color: val === '&#10003;' ? 'var(--green)' : val === '&#215;' ? 'var(--gray-3)' : 'var(--gray-5)' }}>
                        <span dangerouslySetInnerHTML={{ __html: val }} />
                      </td>
                    ))}
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
            <h2 className="s-title">Disavow File Checklist</h2>
            <p className="s-sub">Run through this list before generating, during, and after submitting your disavow file.</p>
          </div>
          <div className="features-grid">
            {[
              {
                title: 'Before Generating',
                color: 'var(--blue)',
                paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
                items: ['Exported complete backlink profile from at least two tools to cross-reference', 'Manually reviewed flagged domains — not just relying on automated spam scores', 'Identified links you definitely want to keep (for whitelist)', 'Checked Google Search Console for any manual action notices'],
              },
              {
                title: 'During Generation',
                color: 'var(--amber)',
                paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'],
                items: ['Domain-level used for clear spam sites; URL-level for specific pages only', 'Whitelist includes your own domain, branded citations, and legitimate directories', 'Duplicates removed — each domain appears exactly once', 'Stats reviewed: Final count is significantly lower than Raw count'],
              },
              {
                title: 'After Download',
                color: 'var(--green)',
                paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
                items: ['File is named exactly disavow.txt', 'Opened the file in a text editor to verify format before submitting', 'Backed up previous disavow file if one existed', 'Submitted via Google Search Console &#8594; Links &#8594; Disavow links', 'Documented submission date for tracking recovery timeline'],
              },
            ].map((card) => (
              <div key={card.title} className="feature-card reveal">
                <div className="feature-icon" style={{ background: card.color }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {card.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{card.title}</div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>
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
            <p className="s-sub">Everything you need to know about the disavow tool and how to use it correctly</p>
          </div>
          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="faq-item reveal">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMAT / TEMPLATE / EXAMPLE ── white */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Format Reference</div>
            <h2 className="s-title">Disavow file format, template <span className="blue">and example</span></h2>
          </div>
          <div className="prose-content">
            <p>Google Search Console accepts exactly one format: a plain UTF-8 text file with a <code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>.txt</code> extension, maximum 2MB, one entry per line. Here is a complete disavow file example you can use as a template:</p>
            <div style={{ background: '#111318', padding: '1.25rem', margin: '1.5rem 0', overflowX: 'auto' }}>
              <pre style={{ color: '#86efac', margin: 0, fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap' }}>{`# Disavow file for example.com
# Created: July 2026 after link audit
# Spam domains found in backlink profile

# Whole domains (covers every current and future link)
domain:spammy-directory.xyz
domain:paid-links-network.info
domain:casino-link-farm.top

# Individual URLs (only this specific page is disavowed)
https://otherwise-fine-blog.com/spun-article-linking-to-us/
https://forum-example.net/thread/spam-comment-page-12`}</pre>
            </div>
            <p>The three rules that matter:</p>
            <ul>
              <li><strong><code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>domain:</code> entries</strong> disavow every link from that domain, including subdomains and any links it adds in the future. Google recommends this form for nearly all spam cleanup.</li>
              <li><strong>Plain URL entries</strong> disavow only that exact page. Use them when a legitimate site has one bad page linking to you.</li>
              <li><strong><code style={{ background: 'var(--gray-2)', padding: '2px 6px', fontSize: '0.85em' }}>#</code> comment lines</strong> are ignored by Google. Use them to date your audits, future-you will thank you when updating the file.</li>
            </ul>
            <p>You do not need to memorize any of this: the generator above produces a correctly formatted file from pasted URLs or domains, deduplicates entries, protects whitelisted domains, and exports the finished .txt ready for <a href="https://search.google.com/search-console/disavow-links" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>Search Console&apos;s disavow tool</a>. Before disavowing anything, review your anchor profile with the <a href="/tools/internal-link-checker/" style={{ color: 'var(--blue)' }}>internal link checker</a> and read our guide on <a href="/blog/link-equity/" style={{ color: 'var(--blue)' }}>how link equity actually flows</a>.</p>
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
                name: 'Disavow File Generator', current: true, href: '/tools/disavow-file-generator/',
                desc: 'Generate Google-compliant disavow files from any backlink export with auto-extraction, dedupe, and whitelist.',
                paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
              },
              {
                name: 'On-Page SEO Analyzer', current: false, href: '/tools/on-page-seo-analyzer/',
                desc: 'Audit 150+ on-page SEO factors with real Google PageSpeed data to support ranking recovery after cleanup.',
                paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
              },
              {
                name: 'Internal Link Checker', current: false, href: '/tools/internal-link-checker/',
                desc: 'Visualize anchor text distribution and audit internal link structure across your site.',
                paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
              },
              {
                name: 'Schema Generator', current: false, href: '/tools/schema-generator/',
                desc: 'Generate JSON-LD structured data for 39+ schema types to strengthen content trust signals after recovery.',
                paths: ['M16 18 22 12 16 6', 'M8 6 2 12 8 18'],
              },
              {
                name: 'Robots.txt Generator', current: false, href: '/tools/robots-txt-generator/',
                desc: 'Create robots.txt rules to control crawler access as part of a complete technical SEO configuration.',
                paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'],
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
          <h2 className="final-cta-title">Stop Formatting Disavow Files <span>Manually</span></h2>
          <p className="final-cta-sub">
            Generate a Google-compliant disavow file in under 60 seconds. Paste messy backlink exports, auto-extract domains, remove duplicates, and download the exact format Search Console expects.
          </p>
          <div className="final-cta-row">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-primary">
              Generate Your Disavow File Now
            </button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {[
              'Paste any format — messy spreadsheet data accepted',
              'Auto-extracts domains, removes duplicates automatically',
              'Downloads in exact Google Search Console format',
            ].map((p) => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
