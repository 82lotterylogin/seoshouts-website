import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Lightweight URL status checker for the sitemap validator: HEAD requests
// (GET fallback) with redirect tracking. Capped and SSRF-guarded.

const MAX_URLS = 50
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1']

interface UrlCheck {
  url: string
  status: number
  ok: boolean
  redirected: boolean
  finalUrl: string
  error?: string
}

async function checkUrl(url: string): Promise<UrlCheck> {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol) || BLOCKED_HOSTS.includes(parsed.hostname)) {
      return { url, status: 0, ok: false, redirected: false, finalUrl: url, error: 'Blocked or invalid URL' }
    }

    const opts = {
      redirect: 'follow' as const,
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'SEOShoutsSitemapValidator/1.0 (+https://seoshouts.com/tools/xml-sitemap-generator/)' },
    }

    let res = await fetch(url, { ...opts, method: 'HEAD' })
    // Some servers reject HEAD — retry with GET
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { ...opts, method: 'GET' })
    }

    return {
      url,
      status: res.status,
      ok: res.ok,
      redirected: res.url !== url && res.url !== url + '/' && res.url + '/' !== url,
      finalUrl: res.url,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fetch failed'
    return { url, status: 0, ok: false, redirected: false, finalUrl: url, error: message }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json()
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Provide an array of URLs' }, { status: 400 })
    }

    const list: string[] = urls.filter((u: unknown) => typeof u === 'string').slice(0, MAX_URLS)
    const results: UrlCheck[] = []
    const CHUNK = 10
    for (let i = 0; i < list.length; i += CHUNK) {
      const chunk = await Promise.all(list.slice(i, i + CHUNK).map(checkUrl))
      results.push(...chunk)
    }

    return NextResponse.json({ results, checked: results.length, capped: urls.length > MAX_URLS })
  } catch (error) {
    console.error('check-urls error:', error)
    return NextResponse.json({ error: 'Failed to check URLs' }, { status: 500 })
  }
}
