'use client'

import { useState } from 'react'

interface CoreWebVitalMetric {
  value: number
  status: 'good' | 'needs-improvement' | 'poor'
}

interface CoreWebVitalsData {
  LCP: CoreWebVitalMetric
  INP: CoreWebVitalMetric
  CLS: CoreWebVitalMetric
}

interface PageSpeedData {
  score: number
  coreWebVitals: CoreWebVitalsData
}

interface PerformanceResult {
  desktop: PageSpeedData
  mobile: PageSpeedData
}

export default function CoreWebVitalsQuickCheck() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PerformanceResult | null>(null)
  const [error, setError] = useState('')

  const checkPerformance = async () => {
    if (!url) { setError('Please enter a valid URL'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)
      const response = await fetch('/api/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, targetKeyword: '', recaptchaToken: 'quick_check_bypass' }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const data = await response.json()
      if (response.ok && data.pageSpeed) {
        setResult(data.pageSpeed)
      } else if (response.ok && !data.pageSpeed) {
        setError('Performance data unavailable. The PageSpeed API may be temporarily down or not configured.')
      } else {
        setError(data.error || 'Failed to analyze performance. Please try again.')
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Analysis is taking longer than expected. The website might be slow or unavailable. Please try again.')
      } else {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const scoreColor   = (s: number) => s >= 90 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626'
  const scoreBg      = (s: number) => s >= 90 ? 'rgba(22,163,74,0.15)' : s >= 50 ? 'rgba(217,119,6,0.15)' : 'rgba(220,38,38,0.15)'
  const metricColor  = (st: string) => st === 'good' ? '#10b981' : st === 'needs-improvement' ? '#f59e0b' : '#ef4444'
  // r=27, circumference=169.65; good=10%, ni=50%, poor=70% offset
  const circleOffset = (st: string) => st === 'good' ? '16.97' : st === 'needs-improvement' ? '84.82' : '118.75'
  const formatValue  = (metric: string, value: number) => metric === 'CLS' ? value.toFixed(3) : `${(value / 1000).toFixed(2)}s`

  function MetricCell({ label, metric, full }: { label: string; metric: CoreWebVitalMetric; full: string }) {
    const col = metricColor(metric.status)
    return (
      <div className="wd-cwc-metric">
        <div className="wd-cwc-metric-ring">
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle cx="32" cy="32" r="27" stroke="rgba(255,255,255,0.14)" strokeWidth="6" fill="none" />
            <circle cx="32" cy="32" r="27"
              stroke={col}
              strokeWidth="6"
              fill="none"
              strokeDasharray="169.65"
              strokeDashoffset={circleOffset(metric.status)}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div className="wd-cwc-metric-val" style={{ color: col }}>
            {formatValue(label, metric.value)}
          </div>
        </div>
        <span className="wd-cwc-metric-key">{label}</span>
        <span className="wd-cwc-metric-full">{full}</span>
      </div>
    )
  }

  return (
    <section id="core-web-vitals-check" className="section svc-section">
      <style>{`
        @keyframes wd-cwc-spin { to { transform: rotate(360deg); } }

        .wd-cwc-wrap { display: grid; grid-template-columns: 1.1fr 1fr; gap: 5rem; align-items: center; }
        .wd-cwc-input-row { display: flex; margin-top: 1.75rem; border: 1px solid rgba(255,255,255,0.12); }
        .wd-cwc-input { flex: 1; padding: 14px 16px; background: rgba(255,255,255,0.05); border: none; color: #fff; font-size: 0.9rem; outline: none; min-width: 0; }
        .wd-cwc-input::placeholder { color: rgba(255,255,255,0.3); }
        .wd-cwc-input:focus { background: rgba(255,255,255,0.08); }
        .wd-cwc-btn { padding: 14px 20px; background: var(--blue); border: none; color: #fff; font-size: 0.875rem; font-weight: 700; cursor: pointer; white-space: nowrap; letter-spacing: 0.04em; transition: background 0.2s; flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; }
        .wd-cwc-btn:hover:not(:disabled) { background: var(--blue-dark); }
        .wd-cwc-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .wd-cwc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; animation: wd-cwc-spin 0.7s linear infinite; flex-shrink: 0; }
        .wd-cwc-error { margin-top: 1rem; padding: 12px 16px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); font-size: 0.85rem; color: #fca5a5; display: flex; align-items: flex-start; gap: 8px; line-height: 1.55; }

        .wd-cwc-panels { display: flex; flex-direction: column; gap: 1px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.2); }
        .wd-cwc-panel { background: #161821; padding: 1.5rem 1.75rem; }
        .wd-cwc-panel-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.12); }
        .wd-cwc-panel-left { display: flex; align-items: center; gap: 12px; }
        .wd-cwc-panel-icon { width: 34px; height: 34px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.8); flex-shrink: 0; }
        .wd-cwc-panel-name { font-size: 1rem; font-weight: 700; color: #fff; }
        .wd-cwc-score-num { font-size: 1.75rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif; line-height: 1; min-width: 52px; text-align: center; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.09); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.3); }

        .wd-cwc-metrics-row { display: grid; grid-template-columns: 1fr 1fr 1fr; }
        .wd-cwc-metric { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 0 8px; border-right: 1px solid rgba(255,255,255,0.1); }
        .wd-cwc-metric:last-child { border-right: none; }
        .wd-cwc-metric-ring { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .wd-cwc-metric-val { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif; }
        .wd-cwc-metric-key { font-size: 0.8rem; font-weight: 700; color: #fff; }
        .wd-cwc-metric-full { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.3); text-align: center; }

        @media (max-width: 900px) { .wd-cwc-wrap { grid-template-columns: 1fr; gap: 2rem; } }
        @media (max-width: 480px) { .wd-cwc-input-row { flex-direction: column; } .wd-cwc-btn { width: 100%; justify-content: center; } }
      `}</style>

      <div className="section-container">
        <div className="wd-cwc-wrap">

          {/* Left: heading + input */}
          <div>
            <div className="eyebrow light">Free Performance Check</div>
            <h2 className="s-title light">Quick Core Web Vitals Check</h2>
            <p className="s-sub light">Get instant mobile and desktop performance scores powered by Google PageSpeed Insights</p>

            <div className="wd-cwc-input-row">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL (e.g., https://example.com)"
                className="wd-cwc-input"
                onKeyPress={(e) => e.key === 'Enter' && checkPerformance()}
              />
              <button onClick={checkPerformance} disabled={loading || !url} className="wd-cwc-btn">
                {loading ? (
                  <><span className="wd-cwc-spinner" />Checking…</>
                ) : (
                  'Check Performance'
                )}
              </button>
            </div>

            {error && (
              <div className="wd-cwc-error">
                <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Right: score panels */}
          <div className="wd-cwc-panels">

            {/* Mobile */}
            <div className="wd-cwc-panel">
              <div className="wd-cwc-panel-hd">
                <div className="wd-cwc-panel-left">
                  <div className="wd-cwc-panel-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  </div>
                  <span className="wd-cwc-panel-name">Mobile</span>
                </div>
                <div className="wd-cwc-score-num"
                  style={result ? {
                    background: scoreBg(result.mobile.score),
                    color: scoreColor(result.mobile.score),
                    borderColor: 'transparent',
                  } : {}}>
                  {result ? result.mobile.score : '—'}
                </div>
              </div>
              {result && (
                <div className="wd-cwc-metrics-row">
                  <MetricCell label="LCP" metric={result.mobile.coreWebVitals.LCP} full="Largest Paint" />
                  <MetricCell label="CLS" metric={result.mobile.coreWebVitals.CLS} full="Layout Shift" />
                  <MetricCell label="INP" metric={result.mobile.coreWebVitals.INP} full="Interaction" />
                </div>
              )}
            </div>

            {/* Desktop */}
            <div className="wd-cwc-panel">
              <div className="wd-cwc-panel-hd">
                <div className="wd-cwc-panel-left">
                  <div className="wd-cwc-panel-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <span className="wd-cwc-panel-name">Desktop</span>
                </div>
                <div className="wd-cwc-score-num"
                  style={result ? {
                    background: scoreBg(result.desktop.score),
                    color: scoreColor(result.desktop.score),
                    borderColor: 'transparent',
                  } : {}}>
                  {result ? result.desktop.score : '—'}
                </div>
              </div>
              {result && (
                <div className="wd-cwc-metrics-row">
                  <MetricCell label="LCP" metric={result.desktop.coreWebVitals.LCP} full="Largest Paint" />
                  <MetricCell label="CLS" metric={result.desktop.coreWebVitals.CLS} full="Layout Shift" />
                  <MetricCell label="INP" metric={result.desktop.coreWebVitals.INP} full="Interaction" />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
