import { NextRequest, NextResponse } from 'next/server'
import ytdl from '@distube/ytdl-core'
import { spawn } from 'node:child_process'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ffmpegPath from '@ffmpeg-installer/ffmpeg'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url') || ''
    const start = parseInt(searchParams.get('start') || '0', 10)
    const duration = parseInt(searchParams.get('duration') || '60', 10)
    const download = searchParams.get('download') === '1'

    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json({ success: false, error: 'Invalid YouTube URL' }, { status: 400 })
    }

    if (isNaN(start) || isNaN(duration) || start < 0 || duration <= 0 || duration > 60) {
      return NextResponse.json({ success: false, error: 'Invalid start/duration' }, { status: 400 })
    }

    // Use the highest quality stream available
    const videoStream = ytdl(url, {
      quality: 'highest',
      filter: format => format.hasVideo && format.hasAudio,
      highWaterMark: 1 << 25
    })

    // Special handling for the first clip (start=0) to avoid keyframe issues
    const args = start === 0 ? [
      '-i', 'pipe:0',
      '-t', String(duration),
      // For first clip, don't seek - just take from beginning
      '-vf', 'scale=1080:-2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-profile:v', 'main',
      '-level', '4.0',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', '44100',
      '-movflags', 'faststart+frag_keyframe+empty_moov',
      '-avoid_negative_ts', 'make_zero',
      '-f', 'mp4',
      'pipe:1'
    ] : [
      '-ss', String(start),
      '-i', 'pipe:0',
      '-t', String(duration),
      '-vf', 'scale=1080:-2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-profile:v', 'main',
      '-level', '4.0',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', '44100',
      '-movflags', 'faststart+frag_keyframe+empty_moov',
      '-avoid_negative_ts', 'make_zero',
      '-f', 'mp4',
      'pipe:1'
    ]

    const ff = spawn((ffmpegPath as any).path, args, {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    // Error handling
    videoStream.on('error', (err) => {
      console.error('Video stream error:', err)
      try { ff.kill('SIGKILL') } catch {}
    })

    ff.stdin.on('error', (err: any) => {
      if (err?.code !== 'EPIPE') {
        console.error('FFmpeg stdin error:', err)
      }
    })

    // Only log errors, not all ffmpeg output
    ff.stderr.on('data', (data) => {
      const output = data.toString()
      if (output.includes('Error') || output.includes('failed') || output.includes('Invalid')) {
        console.error('FFmpeg error:', output)
      }
    })

    videoStream.pipe(ff.stdin)

    let headers: HeadersInit = {
      'Content-Type': 'video/mp4',
      'Cache-Control': 'no-cache'
    }
    if (download) {
      headers = { ...headers, 'Content-Disposition': `attachment; filename="short_${start}_${duration}.mp4"` }
    }

    return new NextResponse(createReadable(ff), { headers })
  } catch (err) {
    console.error('Segment generation error:', err)
    return NextResponse.json({ success: false, error: 'Failed to generate segment' }, { status: 500 })
  }
}

function createReadable(ff: ReturnType<typeof spawn>) {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false

      const safeClose = () => {
        if (!closed) {
          closed = true
          try { controller.close() } catch {}
        }
      }

      ff.stdout.on('data', (chunk: Buffer) => {
        if (!closed) {
          try {
            controller.enqueue(new Uint8Array(chunk))
          } catch (e) {
            // Controller might be closed if client disconnected
            safeClose()
          }
        }
      })
      
      ff.stdout.on('end', () => {
        safeClose()
      })
      
      ff.on('error', (e) => {
        console.error('FFmpeg process error:', e)
        if (!closed) {
          try { controller.error(e) } catch {}
        }
        safeClose()
      })
      
      ff.on('close', (code) => {
        if (code !== 0 && code !== null) {
          console.log('FFmpeg process closed with code:', code)
        }
        safeClose()
      })
    },
    cancel() {
      try { ff.kill('SIGKILL') } catch {}
    }
  })
  return stream
}