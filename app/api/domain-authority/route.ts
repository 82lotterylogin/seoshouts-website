import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Real domain authority via Open PageRank (openpagerank.com) — free API,
// data derived from Common Crawl. Returns a 0–10 PageRank-style score plus a
// global rank per domain. No fabricated numbers: if the key is missing or the
// upstream call fails, we say so instead of inventing a score.

interface DomainAuthority {
  domain: string
  pageRank: number | null // 0–10 decimal, null when Open PageRank has no data
  globalRank: number | null
}

// Open PageRank refreshes roughly monthly — cache aggressively.
// ponytail: in-memory per-instance cache; move to KV if instances multiply
const cache = new Map<string, { data: DomainAuthority; expires: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

function normalizeDomain(input: string): string | null {
  let d = input.trim().toLowerCase()
  if (!d) return null
  try {
    if (d.includes('://')) d = new URL(d).hostname
    else d = new URL(`https://${d}`).hostname
  } catch {
    return null
  }
  d = d.replace(/^www\./, '')
  // Must look like a real registrable domain
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(d)) return null
  return d
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPEN_PAGERANK_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Domain authority lookups are not configured on this server yet.' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const rawDomains: unknown = body?.domains
    if (!Array.isArray(rawDomains) || rawDomains.length === 0) {
      return NextResponse.json({ success: false, error: 'Please provide at least one domain.' }, { status: 400 })
    }
    if (rawDomains.length > 100) {
      return NextResponse.json({ success: false, error: 'Maximum 100 domains per request.' }, { status: 400 })
    }

    const domains = Array.from(
      new Set(
        rawDomains
          .filter((d): d is string => typeof d === 'string')
          .map(normalizeDomain)
          .filter((d): d is string => d !== null)
      )
    )
    if (domains.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid domains provided.' }, { status: 400 })
    }

    const now = Date.now()
    const results: DomainAuthority[] = []
    const toFetch: string[] = []

    for (const domain of domains) {
      const hit = cache.get(domain)
      if (hit && hit.expires > now) results.push(hit.data)
      else toFetch.push(domain)
    }

    if (toFetch.length > 0) {
      const qs = toFetch.map(d => `domains[]=${encodeURIComponent(d)}`).join('&')
      const res = await fetch(`https://openpagerank.com/api/v1.0/getPageRank?${qs}`, {
        headers: { 'API-OPR': apiKey },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: 'Domain authority service is temporarily unavailable. Please try again.' },
          { status: 502 }
        )
      }
      const data = await res.json()
      const rows: any[] = Array.isArray(data?.response) ? data.response : []
      for (const row of rows) {
        const domain = normalizeDomain(String(row?.domain || '')) || String(row?.domain || '')
        const ok = row?.status_code === 200
        const entry: DomainAuthority = {
          domain,
          pageRank: ok && row.page_rank_decimal !== '' ? Number(row.page_rank_decimal) : null,
          globalRank: ok && row.rank ? Number(row.rank) : null,
        }
        cache.set(domain, { data: entry, expires: now + CACHE_TTL })
        results.push(entry)
      }
    }

    return NextResponse.json({
      success: true,
      results,
      source: 'open-pagerank',
      note: 'Authority scores from Open PageRank (Common Crawl data), 0-10 scale.',
    })
  } catch (error) {
    console.error('Domain authority error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch domain authority.' }, { status: 500 })
  }
}
