'use client'
import { useState, useEffect, useRef } from 'react'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 80) { setVisible(true); return }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0, rootMargin: '80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function useCounter(target: number, duration: number, go: boolean) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!go) return
    let start: number | null = null
    const frame = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setV(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(frame)
      else setV(target)
    }
    requestAnimationFrame(frame)
  }, [go, target, duration])
  return v
}

export default function MetricsSection() {
  const { ref, visible } = useReveal()
  const c1 = useCounter(10, 1400, visible)
  const c2 = useCounter(18, 1200, visible)
  const c3 = useCounter(10000, 1800, visible)
  const c4 = useCounter(90, 1500, visible)

  const metrics = [
    { n: `${c1}+`, label: 'Years SEO Experience' },
    { n: `${c2}+`, label: 'Free SEO Tools' },
    { n: `${c3.toLocaleString()}+`, label: 'Professionals Served' },
    { n: `${c4}-Day`, label: 'Results Guarantee' },
  ]

  return (
    <div ref={ref} style={{ background: 'var(--blue)' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid rgba(255,255,255,0.2)' }}>
          {metrics.map((m, i) => (
            <div
              key={i}
              style={{
                padding: '2.5rem 2rem',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '3rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {m.n}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: 6, letterSpacing: '0.03em', fontWeight: 500 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
