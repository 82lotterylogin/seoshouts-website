'use client'
import { useEffect } from 'react'

export default function RevealInit() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')

    const check = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight + 80 && r.bottom > 0) {
        el.classList.add('visible')
        return true
      }
      return false
    }

    const unobserved: HTMLElement[] = []
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0, rootMargin: '80px' }
    )

    els.forEach(el => {
      if (!check(el)) obs.observe(el)
    })

    return () => obs.disconnect()
  }, [])

  return null
}
