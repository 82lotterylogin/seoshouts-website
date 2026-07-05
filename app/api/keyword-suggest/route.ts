import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Real long-tail keyword mining via Google Autocomplete.
// Google only suggests queries people actually type, and orders each suggest
// response by popularity — so every result here is a real search phrase with a
// genuine relative-demand signal. No fabricated volumes.

interface MinedKeyword {
  keyword: string
  group: 'Question' | 'Comparison' | 'Preposition' | 'Modifier' | 'Local' | 'Alphabetical'
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Local'
  demand: 'High' | 'Medium' | 'Low'
}

const LANGUAGE_TO_HL: Record<string, string> = {
  English: 'en',
  Hindi: 'hi',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Portuguese: 'pt',
}

const QUESTION_PREFIXES = ['how', 'what', 'why', 'when', 'where', 'which', 'who', 'can', 'is', 'does']
const PREPOSITION_SUFFIXES = ['for', 'with', 'without', 'near', 'to', 'like']
const COMPARISON_SUFFIXES = ['vs', 'or', 'alternative']
const MODIFIER_PREFIXES = ['best', 'cheap', 'free', 'top']
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

interface Probe {
  query: string
  group: MinedKeyword['group']
}

function buildProbes(seed: string, location: string): Probe[] {
  const probes: Probe[] = [{ query: seed, group: 'Alphabetical' }]
  ALPHABET.forEach(letter => probes.push({ query: `${seed} ${letter}`, group: 'Alphabetical' }))
  QUESTION_PREFIXES.forEach(q => probes.push({ query: `${q} ${seed}`, group: 'Question' }))
  PREPOSITION_SUFFIXES.forEach(p => probes.push({ query: `${seed} ${p}`, group: 'Preposition' }))
  COMPARISON_SUFFIXES.forEach(c => probes.push({ query: `${seed} ${c}`, group: 'Comparison' }))
  MODIFIER_PREFIXES.forEach(m => probes.push({ query: `${m} ${seed}`, group: 'Modifier' }))
  if (location) {
    probes.push({ query: `${seed} ${location}`, group: 'Local' })
    probes.push({ query: `${seed} in ${location}`, group: 'Local' })
    probes.push({ query: `${seed} near`, group: 'Local' })
  }
  return probes
}

async function fetchSuggestions(query: string, hl: string, gl: string): Promise<string[]> {
  const url =
    `https://suggestqueries.google.com/complete/search?client=firefox` +
    `&q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}`
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEOShouts-KeywordTool/1.0)' },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.[1]) ? data[1].filter((s: unknown) => typeof s === 'string') : []
  } catch {
    return []
  }
}

function classifyIntent(keyword: string, location: string): MinedKeyword['intent'] {
  const kw = keyword.toLowerCase()
  if (/\bnear me\b/.test(kw) || (location && kw.includes(location.toLowerCase()))) return 'Local'
  if (/\b(buy|order|price|cost|cheap|deal|discount|coupon|sale|shop)\b/.test(kw)) return 'Transactional'
  if (/\b(best|top|review|reviews|vs|versus|compare|comparison|alternative|alternatives)\b/.test(kw)) return 'Commercial'
  return 'Informational'
}

// Group priority when the same suggestion surfaces from multiple probe types
const GROUP_PRIORITY: MinedKeyword['group'][] = ['Question', 'Comparison', 'Local', 'Modifier', 'Preposition', 'Alphabetical']

export async function POST(req: NextRequest) {
  try {
    const { keyword, location, language, country } = await req.json()

    const seed = (keyword || '').trim().toLowerCase()
    if (!seed) {
      return NextResponse.json({ success: false, error: 'Please enter a seed keyword' }, { status: 400 })
    }
    if (seed.length > 80) {
      return NextResponse.json({ success: false, error: 'Seed keyword too long (max 80 characters)' }, { status: 400 })
    }

    const hl = LANGUAGE_TO_HL[language] || 'en'
    const gl = /^[a-z]{2}$/i.test(country || '') ? country.toLowerCase() : 'us'
    const loc = (location || '').trim()

    const probes = buildProbes(seed, loc)

    // Track best position + hit count per suggestion for the demand signal
    const found = new Map<string, { bestPos: number; hits: number; group: MinedKeyword['group'] }>()

    // Fan out with limited concurrency to stay polite
    const CHUNK = 8
    for (let i = 0; i < probes.length; i += CHUNK) {
      const chunk = probes.slice(i, i + CHUNK)
      const responses = await Promise.all(chunk.map(p => fetchSuggestions(p.query, hl, gl)))
      responses.forEach((suggestions, j) => {
        const probe = chunk[j]
        suggestions.forEach((raw, pos) => {
          const s = raw.trim().toLowerCase()
          if (!s || s === seed) return
          // Relevance: must contain the first seed token
          const firstToken = seed.split(/\s+/)[0]
          if (!s.includes(firstToken)) return

          const existing = found.get(s)
          if (existing) {
            existing.hits += 1
            existing.bestPos = Math.min(existing.bestPos, pos)
            // Upgrade to a more specific group if this probe's group ranks higher
            if (GROUP_PRIORITY.indexOf(probe.group) < GROUP_PRIORITY.indexOf(existing.group)) {
              existing.group = probe.group
            }
          } else {
            found.set(s, { bestPos: pos, hits: 1, group: probe.group })
          }
        })
      })
    }

    const keywords: MinedKeyword[] = Array.from(found.entries())
      .map(([kw, meta]) => {
        // Demand from Google's own popularity ordering: earlier position and
        // multiple probe hits = more heavily searched
        let demand: MinedKeyword['demand'] = 'Low'
        if (meta.bestPos <= 2 || meta.hits >= 3) demand = 'High'
        else if (meta.bestPos <= 5 || meta.hits === 2) demand = 'Medium'

        return {
          keyword: kw,
          group: meta.group,
          intent: classifyIntent(kw, loc),
          demand,
        }
      })
      // Highest-demand first, then alphabetical for stability
      .sort((a, b) => {
        const rank = { High: 0, Medium: 1, Low: 2 }
        return rank[a.demand] - rank[b.demand] || a.keyword.localeCompare(b.keyword)
      })

    if (keywords.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No autocomplete suggestions found for this seed keyword. Try a broader or more common term.',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      keywords,
      total: keywords.length,
      seed,
      source: 'google-autocomplete',
      note: 'Real queries from Google Autocomplete. Demand is derived from Google\'s own suggestion ranking; intent labels are heuristic.',
    })
  } catch (error) {
    console.error('Keyword suggest error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch keyword suggestions. Please try again.' }, { status: 500 })
  }
}
