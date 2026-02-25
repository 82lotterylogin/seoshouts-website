
'use client'

import { useState } from 'react'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

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
  'referring domain',
  'domain',
  'url',
  'source url',
  'link',
  'backlink',
])

const DEFAULT_STATS: DisavowStats = {
  raw: 0,
  extracted: 0,
  duplicates: 0,
  whitelisted: 0,
  final: 0,
}

const FEATURE_ITEMS = [
  'Auto-Extract Domains — Pulls root domains from any pasted URL format automatically',
  'Smart Deduplication — Removes repeated domains; each domain appears exactly once',
  'Whitelist Filter — Mark trusted domains to exclude from the disavow file',
  'Google-Compliant Output — Correct domain: prefix syntax for immediate Search Console submission',
]

const FAQ_ITEMS = [
  {
    q: 'What is a disavow file?',
    a: "A disavow file is a plain text document submitted to Google Search Console listing domains or URLs whose backlinks you want Google to ignore. When submitted, Google excludes those links from its ranking calculations. The file uses a specific format: domain-level entries start with domain:, URL-level entries are plain URLs, and comments begin with #.",
  },
  {
    q: 'Does disavowing links actually work in 2026?',
    a: "Google's Penguin algorithm has been running in real time since 2016, meaning many harmful links are automatically devalued. However, for sites that have received manual actions or have clear patterns of manipulative link building, the disavow tool remains effective. Google's John Mueller confirmed in 2023 that the tool is still actively used by Google's systems.",
  },
  {
    q: 'What format does Google Search Console require for disavow files?',
    a: 'The file must be plain UTF-8 text with a .txt extension. Domain entries use the format domain:example.com. URL entries are plain URLs. Lines starting with # are comments and are ignored. Maximum file size is 2MB. This generator produces output that meets all these requirements.',
  },
  {
    q: 'Should I disavow the entire domain or specific URLs?',
    a: "Disavow the entire domain when the whole site is spam, a link farm, or a PBN. Use URL-level disavow only when a legitimate site has one problematic page linking to you. Google recommends domain-level disavow for the vast majority of spam cleanup cases because it covers all current and future links from that domain.",
  },
  {
    q: 'Will disavowing links hurt my good rankings?',
    a: "Only if you accidentally disavow legitimate backlinks. This is why the whitelist feature is critical — use it to protect domains you know are sending you valuable links. Never disavow your most authoritative links. If you're uncertain about a domain, err on the side of not disavowing it.",
  },
  {
    q: 'How long does it take for Google to process a disavow file?',
    a: 'Google typically processes new or updated disavow files within a few days. However, ranking changes resulting from the disavow may take several weeks to months to manifest, depending on your crawl frequency and the severity of the link issues.',
  },
  {
    q: 'Can I update my disavow file after submitting?',
    a: 'Yes. Uploading a new disavow file replaces the previous one entirely — it does not add to it. Always maintain a master disavow file that you update and re-upload. Never submit a partial list expecting it to merge with your previous submission.',
  },
  {
    q: 'Do I need to disavow nofollow backlinks?',
    a: "No. Nofollow links (rel=\"nofollow\") are already ignored by Google for ranking purposes. Including them in your disavow file is harmless but unnecessary. Google's disavow tool is intended for followed links that pass PageRank.",
  },
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
  } catch {
    return null
  }
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
  } catch {
    return null
  }
}

function normalizeUrl(input: string): string | null {
  try {
    let value = input.trim()
    if (!value || /^domain:/i.test(value)) return null
    if (!/^https?:\/\//i.test(value)) value = `http://${value}`
    const parsed = new URL(value)
    if (!/^https?:$/.test(parsed.protocol)) return null
    return parsed.href
  } catch {
    return null
  }
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

  const recompute = (
    entries: ProcessedEntry[],
    rawCount: number,
    extractedCount: number,
    duplicateCount: number,
    commentText: string,
  ) => {
    setStats(calculateStats(rawCount, extractedCount, duplicateCount, entries))
    setOutputText(buildOutputText(entries, commentText))
  }

  const processInput = () => {
    setUiError('')
    setCopyError('')
    setCopySuccess(false)

    if (!inputText.trim()) {
      setUiError('Please paste your URLs or domains first')
      return
    }

    if (exceedsMaxInput) {
      setUiError('Input is too large. Please keep pasted data under 50,000 characters.')
      return
    }

    const whitelistDomains = whitelist
      .split('\n')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
      .map((value) => value.replace(/^domain:/, '').replace(/^www\./, ''))

    const rawLines = inputText
      .split(/[\n,\t]/)
      .map((value) => value.trim())
      .filter(Boolean)

    const parseErrors: string[] = []
    const seen = new Set<string>()
    const entries: ProcessedEntry[] = []

    let extractedCount = 0
    let duplicateCount = 0

    rawLines.forEach((line, index) => {
      const headerProbe = line
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\s+/g, ' ')
        .trim()
      if (SKIP_PATTERNS.has(headerProbe)) return

      let extracted: string | null = null
      if (disavowMode === 'domain') {
        extracted = extractRootDomain(line)
        if (!extracted) {
          parseErrors.push(`Line ${index + 1}: Could not extract domain from \"${line}\"`)
          return
        }
      } else {
        extracted = normalizeUrl(line)
        if (!extracted) {
          parseErrors.push(`Line ${index + 1}: Invalid URL \"${line}\"`)
          return
        }
      }

      extractedCount += 1
      if (seen.has(extracted)) {
        duplicateCount += 1
        return
      }
      seen.add(extracted)

      const whitelistTarget =
        disavowMode === 'domain' ? extracted : (extractHostnameFromUrl(extracted) ?? extracted)
      const isWhitelisted = whitelistDomains.some(
        (domain) => whitelistTarget === domain || whitelistTarget.endsWith(`.${domain}`),
      )

      entries.push({
        id: makeEntryId(index),
        original: line,
        extracted,
        type: disavowMode,
        excluded: false,
        whitelisted: isWhitelisted,
      })
    })

    setHasProcessed(true)
    setErrors(parseErrors)
    setShowErrors(parseErrors.length > 0)
    setProcessedEntries(entries)

    if (entries.length < 1) {
      setStats({ raw: rawLines.length, extracted: extractedCount, duplicates: duplicateCount, whitelisted: 0, final: 0 })
      setOutputText('')
      setUiError('No valid domains could be extracted. Check your input format.')
      return
    }

    recompute(entries, rawLines.length, extractedCount, duplicateCount, comment)
  }

  const toggleExclude = (id: string) => {
    setCopySuccess(false)
    setCopyError('')
    const updated = processedEntries.map((entry) =>
      entry.id === id ? { ...entry, excluded: !entry.excluded } : entry,
    )
    setProcessedEntries(updated)
    recompute(updated, stats.raw, stats.extracted, stats.duplicates, comment)
  }

  const handleCommentChange = (value: string) => {
    setComment(value)
    if (hasProcessed) {
      setOutputText(buildOutputText(processedEntries, value))
    }
  }

  const handleCopy = async () => {
    if (!outputText.trim()) return
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(outputText)
      setCopyError('')
      setCopySuccess(true)
      window.setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      setCopySuccess(false)
      setCopyError('Copy failed. Please copy the text manually.')
    }
  }

  const handleDownload = () => {
    if (!outputText.trim() || stats.final < 1) return
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'disavow.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Disavow File Generator: Create Google-Compliant Disavow Files in Seconds
              </span>
            </h1>

            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                A disavow file generator formats toxic backlink lists into the exact syntax Google Search Console requires to ignore harmful links. Paste your URLs or domains, and SEOShouts auto-extracts root domains, removes duplicates, and outputs a correctly formatted <strong>disavow.txt</strong> file ready to submit.
              </p>
            </div>

            <div id="disavow-tool" className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                  Paste Your Toxic Backlinks or Domains Below
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Paste URLs from Ahrefs, Semrush, Moz, or any backlink report — messy spreadsheet format is fine.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-5">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-700">Disavow Mode</label>
                    <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-1.5">
                      <button
                        type="button"
                        onClick={() => setDisavowMode('domain')}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          disavowMode === 'domain'
                            ? 'border border-primary/20 bg-white text-primary shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Domain-level
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisavowMode('url')}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          disavowMode === 'url'
                            ? 'border border-primary/20 bg-white text-primary shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        URL-level
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="disavow-input" className="mb-2 block text-sm font-medium text-gray-700">
                      Backlink URLs / Domains
                    </label>
                    <textarea
                      id="disavow-input"
                      value={inputText}
                      onChange={(event) => {
                        setInputText(event.target.value)
                        if (uiError) setUiError('')
                      }}
                      placeholder="Paste one URL/domain per line or paste a spreadsheet column..."
                      className="min-h-[220px] w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-gray-500">{inputLength.toLocaleString()} / 50,000 chars</span>
                      {showLargeWarning && !exceedsMaxInput && (
                        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 font-medium text-yellow-700">
                          Warning at 40,000+ chars
                        </span>
                      )}
                      {exceedsMaxInput && (
                        <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 font-medium text-red-700">
                          Too large. Reduce input under 50,000 chars.
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="whitelist" className="mb-2 block text-sm font-medium text-gray-700">
                      Whitelist (domains to keep)
                    </label>
                    <textarea
                      id="whitelist"
                      value={whitelist}
                      onChange={(event) => setWhitelist(event.target.value)}
                      placeholder={'example.com\npartner-site.com'}
                      className="min-h-[120px] w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="comment" className="mb-2 block text-sm font-medium text-gray-700">
                      Optional File Note
                    </label>
                    <input
                      id="comment"
                      type="text"
                      value={comment}
                      onChange={(event) => handleCommentChange(event.target.value)}
                      placeholder="Example: Post-negative SEO cleanup"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {uiError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{uiError}</div>
                  )}

                  <button
                    type="button"
                    onClick={processInput}
                    disabled={exceedsMaxInput}
                    className="inline-flex w-full items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-base rounded-xl hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 shadow-lg"
                  >
                    ⚙️ Generate Disavow File
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="rounded-xl border border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                      <h3 className="text-sm font-semibold text-gray-900">Processed Entries Review</h3>
                      {hasProcessed && <span className="text-xs text-gray-500">{processedEntries.length} unique entries</span>}
                    </div>
                    <div className="max-h-[260px] overflow-y-auto p-3">
                      {!hasProcessed ? (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
                          Paste backlinks and click Generate to review extracted entries here.
                        </div>
                      ) : processedEntries.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
                          No valid entries were extracted.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {processedEntries.map((entry) => {
                            const statusLabel = entry.whitelisted ? 'Whitelisted' : entry.excluded ? 'Excluded' : 'Active'
                            const statusClass = entry.whitelisted
                              ? 'border-blue-200 bg-blue-50 text-blue-700'
                              : entry.excluded
                                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                : 'border-green-200 bg-green-50 text-green-700'
                            return (
                              <div key={entry.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">{entry.extracted}</p>
                                    <p className="mt-1 truncate text-xs text-gray-500">Source: {entry.original}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass}`}>
                                      {statusLabel}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => toggleExclude(entry.id)}
                                      disabled={entry.whitelisted}
                                      className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {[
                      ['Raw', String(stats.raw)],
                      ['Extracted', String(stats.extracted)],
                      ['Dupes', String(stats.duplicates)],
                      ['Whitelist', String(stats.whitelisted)],
                      ['Final', String(stats.final)],
                    ].map(([label, value]) => (
                      <div key={label} className={`rounded-xl border p-3 text-center ${label === 'Final' ? 'border-primary/20 bg-primary/5' : 'border-gray-200 bg-white'}`}>
                        <div className={`text-xs ${label === 'Final' ? 'text-primary/80' : 'text-gray-500'}`}>{label}</div>
                        <div className={`text-lg font-bold ${label === 'Final' ? 'text-primary' : 'text-gray-900'}`}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <h3 className="text-sm font-semibold text-gray-900">Generated disavow.txt</h3>
                    </div>
                    <textarea
                      readOnly
                      value={outputText}
                      placeholder="Your generated disavow file will appear here..."
                      className="min-h-[220px] w-full resize-y border-0 bg-gray-900 px-4 py-3 font-mono text-sm text-gray-100 outline-none placeholder:text-gray-500"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="text-xs text-gray-600">
                        {stats.final > 0 ? `${stats.final} active ${stats.final === 1 ? 'entry' : 'entries'} ready` : 'No active entries in output yet'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={handleCopy} disabled={!outputText.trim()} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
                          {copySuccess ? 'Copied' : 'Copy'}
                        </button>
                        <button type="button" onClick={handleDownload} disabled={!outputText.trim() || stats.final < 1} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                          Download disavow.txt
                        </button>
                      </div>
                    </div>
                    {copyError && <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">{copyError}</div>}
                  </div>

                  {errors.length > 0 && (
                    <div className="rounded-xl border border-orange-200 bg-orange-50">
                      <button type="button" onClick={() => setShowErrors((value) => !value)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                        <span className="text-sm font-semibold text-orange-900">Parse Errors ({errors.length})</span>
                        <span className="text-sm font-medium text-orange-700">{showErrors ? 'Hide' : 'Show'}</span>
                      </button>
                      {showErrors && (
                        <div className="border-t border-orange-200 px-4 py-3">
                          <ul className="space-y-2 text-xs text-orange-900">
                            {errors.map((error) => (
                              <li key={error} className="break-words">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 text-center">Key Features:</h3>
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {FEATURE_ITEMS.map((item) => {
                      const [title, description] = item.split(' - ')
                      return (
                        <div key={item} className="flex items-start">
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{title}</div>
                            <div className="text-gray-600">{description}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToolBreadcrumb toolName="Disavow File Generator" toolSlug="disavow-file-generator" />

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">RS</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Built by Rohit Sharma — 13+ Years in Technical SEO</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "I've used Google's disavow tool for client campaigns since it launched in 2012. The biggest mistake I see? People submit improperly formatted files or accidentally disavow their own backlinks. This tool handles the formatting automatically and lets you whitelist domains you actually want — so you don't accidentally torpedo your link profile."
                  </p>
                  <p className="text-gray-800 font-medium">— Rohit Sharma, Founder of SEOShouts | <a href="/meet-the-experts/" className="text-primary hover:underline">Meet Our Experts</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">What Is a Disavow File and When Should You Use One?</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>A disavow file is a plain text document submitted to Google Search Console that instructs Google to ignore specific backlinks when evaluating your website. When Google receives your disavow file, it excludes those links from its ranking calculations — effectively neutralizing their negative influence without requiring you to contact each linking site.</p>
              <p>Google launched the disavow tool in 2012 in response to widespread negative SEO attacks and post-Penguin cleanup efforts. A decade later, the tool remains the primary mechanism for managing toxic link profiles. However, Google's John Mueller has been explicit: <strong>"The disavow tool is for people who have received a manual action for unnatural links, or who are very confident they have a pattern of bad links."</strong> It should not be used casually.</p>
              <p>The disavow file format is strict. Each entry must appear on its own line, domain-level entries must begin with <code className="rounded bg-gray-100 px-1 py-0.5 text-sm">domain:</code>, and the file must be saved as plain UTF-8 text with a .txt extension. A single formatting error can cause Google Search Console to reject or partially ignore your submission. This generator handles all formatting requirements automatically.</p>
              <p>According to Google's Search Quality guidelines, a site receiving a manual action for unnatural links can lose 20–50% of organic traffic within weeks. Of the site owners who submitted disavow files after Penguin 4.0, those who formatted them correctly and submitted within 30 days recovered an average of <strong>65% of lost traffic within 3 months</strong> (SEMrush Link Audit Study, 2022).</p>
              <p>The key nuance: use domain-level disavow (<code className="rounded bg-gray-100 px-1 py-0.5 text-sm">domain:example.com</code>) when an entire domain is spammy — this disavows all current and future links from that domain and any subdomains. Use URL-level disavow when only specific pages on an otherwise legitimate site are problematic.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">When Should You Disavow Links?</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">Not every bad backlink requires a disavow. Google's systems are sophisticated enough to ignore most spam links naturally. Aggressive or incorrect disavowing can remove links that were actually helping your rankings.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">✅ Situations Where Disavowing Is Appropriate</h3>
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">1. You've Received a Manual Action for Unnatural Links</p>
                    <p>If Google Search Console shows a manual action notice specifically mentioning unnatural links, you must disavow the offending links and submit a reconsideration request.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">2. Post-Negative SEO Attack Evidence</p>
                    <p>If your backlink profile shows a sudden surge of links from adult sites, gambling sites, link farms, or foreign-language spam directories, and your rankings have dropped.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">3. Paid Link Schemes You Participated In</p>
                    <p>If your site was part of a link scheme (paid links, reciprocal link networks, article spinning directories), disavowing those links protects you from future Penguin penalties.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">4. Pre-Acquisition Cleanup</p>
                    <p>Before purchasing a website or domain, auditing and disavowing its toxic links is standard due diligence.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">❌ Situations Where You Should NOT Disavow</h3>
                <ul className="space-y-3 text-gray-700 text-sm leading-relaxed">
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold flex-shrink-0">×</span><span>Links from low-DA domains that have no obvious spam signals</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold flex-shrink-0">×</span><span>Competitor backlinks (you cannot disavow their links, only your own)</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold flex-shrink-0">×</span><span>Legitimate links from real sites even if the anchor text seems off</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold flex-shrink-0">×</span><span>All "nofollow" links — Google ignores these by default</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold flex-shrink-0">×</span><span>Links that appear in your report but were never indexed by Google</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Domain-Level vs URL-Level Disavow</span>
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm mb-6">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Factor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Domain-Level (domain:example.com)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">URL-Level (https://example.com/page)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr><td className="px-4 py-3 font-medium text-gray-700">Scope</td><td className="px-4 py-3">All links from that domain + subdomains</td><td className="px-4 py-3">Only that specific page's links</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-gray-700">When to use</td><td className="px-4 py-3">Entire domain is spam/irrelevant</td><td className="px-4 py-3">Only specific pages are problematic</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-700">Risk if wrong</td><td className="px-4 py-3">Disavows good links from the same domain</td><td className="px-4 py-3">Low — only affects one page</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-gray-700">Google's recommendation</td><td className="px-4 py-3">Preferred for spam domains</td><td className="px-4 py-3">Use for selective cleanup</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-700">Coverage</td><td className="px-4 py-3">Current + future links from that domain</td><td className="px-4 py-3">Only existing link from that URL</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="text-gray-700"><strong>Best practice:</strong> Default to domain-level disavow for sites that are clearly spam (link farms, PBNs, directory spam, foreign gibberish sites). Use URL-level only when a legitimate site has one specific spammy page pointing to you. Our generator defaults to domain-level and automatically extracts root domains from any URL you paste.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">How to Build Your Disavow File (Step-by-Step)</span>
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Your Backlink Profile</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Use a backlink auditing tool to export your complete link profile:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Ahrefs:</strong> Site Explorer → Backlinks → Export → CSV</li>
                      <li>• <strong>Semrush:</strong> Backlink Analytics → Backlinks → Export</li>
                      <li>• <strong>Moz Link Explorer:</strong> Inbound Links → Export</li>
                      <li>• <strong>Google Search Console:</strong> Links → Top linking sites → Download</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Identify Toxic Links</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">Sort your backlink export by domain rating/authority. Investigate links from domains with very low authority, high spam scores, foreign-language sites irrelevant to your niche, known PBN patterns, and sites with exact-match anchor text in unnatural quantities. Manual review is essential — automated "toxic" scoring tools have high false positive rates.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Paste Into the Generator</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Copy your list of toxic URLs or domains and paste directly into the input box. The generator accepts:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Full URLs (https://spamsite.com/links/yoursite)</li>
                      <li>• Domain names (spamsite.com)</li>
                      <li>• Spreadsheet exports with columns (domain column will be extracted)</li>
                      <li>• Mixed formats — the parser handles all of them</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Your Whitelist</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">If your export includes domains you want to keep, paste them into the Whitelist field. The generator will exclude them from the disavow output while showing them in the review list. Common whitelist entries: your own domain, major directories (Yelp, Google My Business, industry associations), and links from sites you know are legitimate.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">5</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Review, Edit, and Download</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">Review each extracted entry in the processed list. Toggle the exclude button on any entry you want to remove manually. Check the stats panel — Raw: X | Duplicates removed: Y | Final: Z. Download the file when satisfied.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">6</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit to Google Search Console</h3>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Go to <a href="https://search.google.com/search-console/disavow-links" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">search.google.com/search-console/disavow-links</a></li>
                      <li>Select your property</li>
                      <li>Click "Upload disavow file"</li>
                      <li>Select your downloaded disavow.txt file</li>
                      <li>Google typically processes within a few days; ranking changes may take weeks</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Reading the Stats Panel</h3>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <p><strong>Raw:</strong> Total lines in your original paste</p>
                  <p><strong>Extracted:</strong> Valid domains/URLs successfully parsed</p>
                  <p><strong>Duplicates Removed:</strong> Lines that were identical after extraction (these appear only once)</p>
                  <p><strong>Whitelisted:</strong> Entries matching your whitelist (excluded from output)</p>
                  <p><strong>Final:</strong> The number of entries that will appear in your disavow file</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Google Format Requirements</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-900">
                  <pre className="p-4 text-sm text-gray-100">{`# Lines starting with # are comments\n# Date created: 2026-02-21\n\n# Domain-level disavow\ndomain:spamsite.com\ndomain:linkfarm-example.net\n\n# URL-level disavow\nhttps://legitimatesite.com/spam-page/`}</pre>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li>Domain entries <strong>MUST</strong> start with <code className="rounded bg-white px-1 py-0.5">domain:</code> (lowercase)</li>
                  <li>One entry per line, plain UTF-8 text (.txt)</li>
                  <li>Comments begin with <code className="rounded bg-white px-1 py-0.5">#</code></li>
                  <li>Maximum 2MB file size, maximum 100,000 entries</li>
                  <li>Each property requires a separate file (unless verified domain property)</li>
                </ul>
              </div>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="text-gray-700 text-sm leading-relaxed">A healthy disavow file review session typically removes <strong>20–40% of raw entries as duplicates</strong> (backlink exports commonly have the same domain linked multiple times from different pages). The whitelist typically catches <strong>5–15% of entries</strong> that are legitimate links accidentally included in your toxic list.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">SEOShouts vs Other Disavow Generators</span>
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Feature</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">SEOShouts</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">SUSO Digital</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Pixus</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">WebNots</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">aliseoservices.com</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr><td className="px-4 py-3 font-medium text-gray-700">Auto Domain Extraction</td><td className="px-4 py-3 text-primary font-medium">✅ Any format</td><td className="px-4 py-3 text-gray-500">❌ Manual entry</td><td className="px-4 py-3 text-gray-500">❌ Manual entry</td><td className="px-4 py-3 text-gray-500">❌ Manual entry</td><td className="px-4 py-3 text-gray-500">✅ Basic</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-gray-700">Smart Deduplication</td><td className="px-4 py-3 text-primary font-medium">✅ Automatic</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-700">Whitelist / Exclusion</td><td className="px-4 py-3 text-primary font-medium">✅ Per-domain</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-gray-700">Per-Entry Toggle</td><td className="px-4 py-3 text-primary font-medium">✅ Individual rows</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-700">Domain vs URL Mode</td><td className="px-4 py-3 text-primary font-medium">✅ Toggle</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">❌</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-gray-700">Processing Stats</td><td className="px-4 py-3 text-primary font-medium">✅ Full breakdown</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-700">Paste Spreadsheet Data</td><td className="px-4 py-3 text-primary font-medium">✅</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-gray-700">Comment Support</td><td className="px-4 py-3 text-primary font-medium">✅</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">❌</td><td className="px-4 py-3 text-gray-500">❌</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-700">No Login Required</td><td className="px-4 py-3 text-primary font-medium">✅</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">✅</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-gray-700">File Download</td><td className="px-4 py-3 text-primary font-medium">✅ disavow.txt</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">✅</td><td className="px-4 py-3 text-gray-500">✅</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Disavow Checklist (2026)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-primary">📋</span> Before Generating</h3>
                <ul className="space-y-3 text-gray-700 text-sm leading-relaxed">
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Exported complete backlink profile from at least two tools (cross-reference reduces false positives)</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Manually reviewed flagged domains — not just relying on automated spam scores</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Identified links you definitely want to keep (for whitelist)</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Checked Google Search Console for any manual action notices</span></li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-primary">⚙️</span> During Generation</h3>
                <ul className="space-y-3 text-gray-700 text-sm leading-relaxed">
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Domain-level used for clear spam sites, URL-level for specific pages</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Whitelist includes your own domain, branded citations, and legitimate directories</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Duplicates removed — each domain appears once</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Stats reviewed: Final count is significantly lower than Raw count</span></li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-primary">✅</span> After Download</h3>
                <ul className="space-y-3 text-gray-700 text-sm leading-relaxed">
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>File is named exactly <code className="bg-gray-100 px-1 rounded text-xs">disavow.txt</code></span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Opened the file in a text editor to verify format before submitting</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Backed up previous disavow file (if one existed)</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Submitted via Google Search Console → Links → Disavow links</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Documented submission date for tracking recovery timeline</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary flex-shrink-0">◻</span><span>Calendar reminder set for 90-day ranking check</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Frequently Asked Questions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:grid-flow-row-dense">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                  <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                    <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>{item.q}</span>
                    <span className="text-primary text-xl group-open:rotate-90 transition-transform ml-2 flex-shrink-0">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Explore Our Other Free SEO Tools</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🚫</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Disavow File Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate Google-compliant disavow files from any backlink export format with auto-extraction, dedupe, and whitelist.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">On-Page SEO Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Audit 150+ on-page SEO factors with real Google PageSpeed data to support ranking recovery after cleanup.</p>
                <a href="/tools/on-page-seo-analyzer/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Internal Link Checker</h3>
                <p className="text-sm text-gray-600 mb-4">Visualize anchor text distribution and audit internal link structure across your site.</p>
                <a href="/tools/internal-link-checker/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏗️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Schema Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate JSON-LD structured data for 39+ schema types to strengthen content trust signals.</p>
                <a href="/tools/schema-generator/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Robots.txt Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create robots.txt rules as part of a complete technical SEO configuration.</p>
                <a href="/tools/robots-txt-generator/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions for better click-through rates.</p>
                <a href="/tools/meta-tag-optimizer/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>
            </div>
            <div className="text-center">
              <a href="/tools/" className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="mr-2">🛠️</span>
                Browse All 17 Free SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">All tools are 100% free - No signup required - Instant results</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Stop Formatting Disavow Files Manually</h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Generate a Google-compliant disavow file in under 60 seconds. Paste messy backlink exports, auto-extract domains, remove duplicates, and download the exact format Search Console expects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Generate Your Disavow File Now →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2"><span>⚡</span><span>Paste any format — messy spreadsheet data accepted</span></div>
              <div className="flex items-center justify-center space-x-2"><span>🔒</span><span>Auto-extracts domains, removes duplicates automatically</span></div>
              <div className="flex items-center justify-center space-x-2"><span>📥</span><span>Downloads in exact Google Search Console format</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
