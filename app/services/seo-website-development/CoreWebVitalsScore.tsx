'use client'
import { useEffect, useRef, useState } from 'react'

export default function CoreWebVitalsScore() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3, rootMargin: '0px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [])

  const metrics = [
    {
      id: 'lcp',
      label: 'LCP',
      sub: 'Loading Performance',
      value: '<2.5s',
      color: '#10b981',
      glowColor: 'rgba(16,185,129,0.28)',
      gradId: 'cvs-lcp',
      from: '#10b981',
      to: '#059669',
      dashOffset: isVisible ? '40.212' : '402.12',
      delay: '0ms',
    },
    {
      id: 'cls',
      label: 'CLS',
      sub: 'Visual Stability',
      value: '<0.1',
      color: '#3b82f6',
      glowColor: 'rgba(59,130,246,0.28)',
      gradId: 'cvs-cls',
      from: '#3b82f6',
      to: '#2563eb',
      dashOffset: isVisible ? '20.106' : '402.12',
      delay: '300ms',
    },
    {
      id: 'inp',
      label: 'INP',
      sub: 'Responsiveness',
      value: '<200ms',
      color: '#818cf8',
      glowColor: 'rgba(129,140,248,0.28)',
      gradId: 'cvs-inp',
      from: '#818cf8',
      to: '#6366f1',
      dashOffset: isVisible ? '36.19' : '402.12',
      delay: '500ms',
    },
  ]

  return (
    <section ref={sectionRef} className="section svc-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{`
        /* Subtle grid decoration */
        .wd-cvs-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        /* Left accent stripe */
        .wd-cvs-stripe {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(to bottom, transparent, var(--blue), transparent);
          pointer-events: none;
        }

        .wd-cvs-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; position: relative; }
        .wd-cvs-label-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--blue); margin-bottom: 1rem; }
        .wd-cvs-label-tag::before { content: ''; display: block; width: 24px; height: 2px; background: var(--blue); }
        .wd-cvs-headline { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; color: #fff; line-height: 1.18; margin-bottom: 1rem; }
        .wd-cvs-headline span { color: var(--blue); }
        .wd-cvs-desc { font-size: 0.9rem; line-height: 1.7; color: rgba(255,255,255,0.55); max-width: 400px; }

        /* Google score badge */
        .wd-cvs-badge { display: inline-flex; align-items: center; gap: 10px; margin-top: 1.5rem; padding: 8px 14px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); }
        .wd-cvs-badge-dot { width: 8px; height: 8px; background: #10b981; flex-shrink: 0; }
        .wd-cvs-badge-text { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; color: rgba(255,255,255,0.55); text-transform: uppercase; }
        .wd-cvs-badge-score { font-size: 0.85rem; font-weight: 800; color: #10b981; font-family: 'JetBrains Mono', monospace; }

        /* Circles */
        .wd-cvs-circles { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
        .wd-cvs-circle { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
        .wd-cvs-ring { position: relative; width: 144px; height: 144px; }
        .wd-cvs-ring svg { display: block; }
        .wd-cvs-ring-inner { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
        .wd-cvs-ring-check { width: 20px; height: 20px; flex-shrink: 0; }
        .wd-cvs-ring-val { font-size: 1.05rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; line-height: 1; }
        .wd-cvs-metric-label { font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; color: #fff; text-transform: uppercase; }
        .wd-cvs-metric-sub { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.35); text-align: center; text-transform: uppercase; letter-spacing: 0.06em; }

        @media (max-width: 900px) {
          .wd-cvs-layout { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        @media (max-width: 480px) {
          .wd-cvs-circles { gap: 1.25rem; }
          .wd-cvs-ring { width: 112px; height: 112px; }
        }
      `}</style>

      {/* Background decoration */}
      <div className="wd-cvs-grid" />
      <div className="wd-cvs-stripe" />

      <div className="section-container">
        <div className="wd-cvs-layout">

          {/* Left: heading */}
          <div>
            <div className="wd-cvs-label-tag">Core Web Vitals</div>
            <h2 className="wd-cvs-headline">
              SEOShouts Helps You Achieve <span>Perfect Core Web Vitals Score</span>
            </h2>
            <p className="wd-cvs-desc">
              These are Google&apos;s official ranking factors. We guarantee every site launches with &quot;Good&quot; scores.
            </p>
            <div className="wd-cvs-badge">
              <div className="wd-cvs-badge-dot" />
              <span className="wd-cvs-badge-text">Lighthouse Score</span>
              <span className="wd-cvs-badge-score">90+</span>
              <span className="wd-cvs-badge-text" style={{ opacity: 0.5 }}>on every delivery</span>
            </div>
          </div>

          {/* Right: animated rings */}
          <div className="wd-cvs-circles">
            {metrics.map(m => (
              <div key={m.id} className="wd-cvs-circle">
                <div
                  className="wd-cvs-ring"
                  style={{ filter: isVisible ? `drop-shadow(0 0 18px ${m.glowColor})` : 'none', transition: `filter 2000ms ease-out ${m.delay}` }}
                >
                  <svg width="144" height="144" viewBox="0 0 144 144" style={{ transform: 'rotate(-90deg)' }}>
                    <defs>
                      <linearGradient id={m.gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={m.from} />
                        <stop offset="100%" stopColor={m.to} />
                      </linearGradient>
                    </defs>
                    {/* Track ring */}
                    <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="rgba(255,255,255,0.03)" />
                    {/* Progress ring */}
                    <circle
                      cx="72" cy="72" r="64"
                      stroke={`url(#${m.gradId})`}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="402.12"
                      strokeDashoffset={m.dashOffset}
                      strokeLinecap="round"
                      style={{ transition: `stroke-dashoffset 2500ms ease-out ${m.delay}` }}
                    />
                  </svg>
                  <div className="wd-cvs-ring-inner">
                    <svg className="wd-cvs-ring-check" viewBox="0 0 20 20" fill={m.color}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="wd-cvs-ring-val" style={{ color: m.color }}>{m.value}</span>
                  </div>
                </div>
                <div className="wd-cvs-metric-label">{m.label}</div>
                <div className="wd-cvs-metric-sub">{m.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
