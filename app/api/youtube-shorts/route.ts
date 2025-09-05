import { NextRequest, NextResponse } from 'next/server'
import ytdl from '@distube/ytdl-core'

async function verifyRecaptcha(token: string) {
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  })
  const data = await response.json()
  return data.success
}

export const runtime = 'nodejs'

function parseISODurationToSeconds(d: string): number {
  const m = d?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  const h = parseInt(m[1] || '0', 10)
  const min = parseInt(m[2] || '0', 10)
  const s = parseInt(m[3] || '0', 10)
  return h * 3600 + min * 60 + s
}

export async function POST(req: NextRequest) {
  try {
    const { url, recaptchaToken } = await req.json()

    // CAPTCHA verification
    if (!recaptchaToken || !await verifyRecaptcha(recaptchaToken)) {
      return NextResponse.json({ success: false, error: 'Invalid reCAPTCHA' }, { status: 400 })
    }

    // Basic input validation
    if (!url || typeof url !== 'string' || !ytdl.validateURL(url)) {
      return NextResponse.json({ success: false, error: 'Please provide a valid YouTube URL' }, { status: 400 })
    }

    // Extract video ID
    let videoId: string
    try {
      videoId = ytdl.getURLVideoID(url)
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid YouTube URL' }, { status: 400 })
    }

    // Try YouTube Data API for duration and title
    let lengthSeconds = 0
    let title = ''
    const apiKey = process.env.YOUTUBE_API_KEY
    if (apiKey) {
      try {
        const resp = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${apiKey}`)
        const json = await resp.json()
        const item = json.items?.[0]
        if (item) {
          lengthSeconds = parseISODurationToSeconds(item.contentDetails?.duration)
          title = item.snippet?.title || ''
        }
      } catch {}
    }

    // Fallback to ytdl if needed
    if (!lengthSeconds || !title) {
      const info = await ytdl.getInfo(url)
      title = title || info.videoDetails.title
      lengthSeconds = lengthSeconds || parseInt(info.videoDetails.lengthSeconds || '0', 10)
    }

    if (!lengthSeconds) {
      return NextResponse.json({ success: false, error: 'Could not determine video duration' }, { status: 400 })
    }

    if (lengthSeconds > 600) { // 10 minutes
      return NextResponse.json({ success: false, error: 'Only videos up to 10 minutes are supported' }, { status: 400 })
    }

    // Compute 1-minute (max) segments
    const totalSegments = Math.ceil(lengthSeconds / 60)
    const segments = [] as Array<{
      index: number
      start: number
      duration: number
      preview_url: string
      download_url: string
    }>

    for (let i = 0; i < totalSegments; i++) {
      const start = i * 60
      const duration = Math.min(60, lengthSeconds - start)
      const base = `/api/youtube-shorts/segment?url=${encodeURIComponent(url)}&start=${start}&duration=${duration}`
      const previewUrl = base
      const downloadUrl = `${base}&download=1`
      segments.push({ index: i + 1, start, duration, preview_url: previewUrl, download_url: downloadUrl })
    }

    return NextResponse.json({
      success: true,
      results: {
        videoId,
        title,
        lengthSeconds,
        totalSegments,
        segments,
      }
    })
  } catch (error) {
    console.error('YouTube shorts creation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to process video. Please try again.' }, { status: 500 })
  }
}
