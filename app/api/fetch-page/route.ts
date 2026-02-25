import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Validate URL
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'Invalid URL protocol' }, { status: 400 })
    }

    // Block internal/private IPs
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1']
    if (blockedHosts.includes(parsed.hostname)) {
      return NextResponse.json({ error: 'Private URLs not allowed' }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEOShoutsSEOBot/1.0 (+https://seoshouts.com/tools/geo-aeo-checker/)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    })

    const html = await response.text()
    const headers = Object.fromEntries(response.headers.entries())

    return NextResponse.json({
      html,
      headers,
      status: response.status,
      finalUrl: response.url,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
