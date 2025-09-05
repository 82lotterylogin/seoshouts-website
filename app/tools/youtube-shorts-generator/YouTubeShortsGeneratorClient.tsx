'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function YouTubeShortsGeneratorClient() {
  const [formData, setFormData] = useState({
    url: '',
    clipDuration: 60,
    quality: '1080p',
    format: 'mp4'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<any>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const onGenerate = async () => {
    setError('')

    if (!formData.url.trim()) {
      setError('Please enter a YouTube video URL.')
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA before generating.')
      return
    }

    setIsLoading(true)
    setResults(null)

    try {
      const res = await fetch('/api/youtube-shorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: formData.url, 
          clipDuration: formData.clipDuration,
          quality: formData.quality,
          recaptchaToken 
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate shorts')
      }

      setResults(data.results)
      recaptchaRef.current?.reset()
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
      recaptchaRef.current?.reset()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
            YouTube to Shorts Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enter a YouTube video (up to 10 minutes). This tool will automatically split it into 60s vertical Shorts with download links.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">🔗</span>
              Video URL
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Video URL *</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Maximum length supported: 10 minutes. Longer videos will be rejected.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="recaptcha-wrapper">
                  <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} />
                </div>

                <button
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Generate Shorts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">🎬</span>
              Generated Shorts
            </h2>

            {!results ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">📺</span></div>
                <p className="text-lg mb-2">No shorts yet</p>
                <p className="text-sm">Enter a YouTube URL and click "Generate Shorts" to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Video:</div>
                  <div className="font-semibold text-gray-900">{results.title}</div>
                  <div className="text-sm text-gray-600 mt-1">Duration: {Math.floor(results.lengthSeconds / 60)}m {results.lengthSeconds % 60}s</div>
                  <div className="text-sm text-gray-600">Segments: {results.totalSegments}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {results.segments.map((seg: any) => (
                    <div key={seg.index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">Clip {seg.index}</div>
                        <div className="text-xs text-gray-500">{seg.duration}s</div>
                      </div>
                      <video controls className="w-full rounded-lg bg-black aspect-[9/16]" src={seg.preview_url} />
                      <a
                        href={seg.download_url}
                        className="mt-3 inline-flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                      >
                        ⬇️ Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100">
          <h3 className="text-lg font-semibold mb-2">How it works</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
            <li>We analyze the video duration and split it into 60-second clips.</li>
            <li>All clips are auto-cropped to a vertical 9:16 frame and centered with smart cropping.</li>
            <li>Download each clip directly in MP4 format.</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .recaptcha-wrapper { overflow: hidden; width: 100%; display: flex; justify-content: center; }
        @media only screen and (max-width: 575px) { .g-recaptcha { transform: scale(0.77); -webkit-transform: scale(0.77); transform-origin: 0 0; -webkit-transform-origin: 0 0; margin-bottom: -20px; } }
        @media only screen and (max-width: 360px) { .g-recaptcha { transform: scale(0.70); -webkit-transform: scale(0.70); transform-origin: 0 0; -webkit-transform-origin: 0 0; } }
      `}</style>
    </div>
  )
}
