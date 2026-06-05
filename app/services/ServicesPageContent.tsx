'use client'

import { useRef, useState, useEffect } from 'react'
import ShapeGrid from '../components/ShapeGrid'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight + 80 && r.bottom > 0) { setVis(true); return }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold: 0, rootMargin: '80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, vis }
}

function Arrow() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  )
}

function SiIcon({ name, size = 22 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'map-pin') return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  if (name === 'cart') return <svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  if (name === 'monitor') return <svg {...p}><rect x="2" y="3" width="20" height="14"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  if (name === 'wrench') return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  if (name === 'link') return <svg {...p}><path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1"/><path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1"/></svg>
  if (name === 'lightbulb') return <svg {...p}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
  if (name === 'target') return <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  if (name === 'users') return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  if (name === 'trending') return <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  if (name === 'shield') return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  if (name === 'bar-chart') return <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  if (name === 'phone') return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  if (name === 'mail') return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  if (name === 'search') return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>
}

const SERVICES = [
  {
    id: 1,
    title: 'Local SEO',
    shortDescription: 'Dominate local search results in your city',
    description: 'Get found by customers in your area when they search for your services. Perfect for restaurants, clinics, salons, and local service businesses.',
    features: [
      'Google Business Profile optimization',
      'Local keyword research & targeting',
      'NAP consistency across directories',
      'Local citation building',
      'Review management strategy',
      'Local link building',
      'Google Maps ranking optimization',
      'Multi-location SEO (if applicable)',
    ],
    href: '/services/local-seo/',
    iconName: 'map-pin',
    popular: false,
  },
  {
    id: 2,
    title: 'eCommerce SEO',
    shortDescription: 'Boost online sales & product visibility',
    description: 'Optimize your online store to rank higher for product searches and drive more qualified traffic that converts into sales.',
    features: [
      'Product page optimization',
      'Category page SEO strategy',
      'Technical eCommerce SEO',
      'Product schema markup',
      'Internal linking optimization',
      'Site architecture planning',
      'Conversion rate optimization',
      'Shopping feed optimization',
    ],
    href: '/services/ecommerce-seo/',
    iconName: 'cart',
    popular: true,
  },
  {
    id: 3,
    title: 'SEO Website Development',
    shortDescription: 'Build websites that rank & convert',
    description: 'Get a website designed from the ground up with SEO best practices, fast loading speeds, and conversion optimization built-in.',
    features: [
      'SEO-first website architecture',
      'Mobile-first responsive design',
      'Page speed optimization',
      'Technical SEO implementation',
      'Content management systems',
      'Schema markup integration',
      'Analytics & tracking setup',
      'Conversion optimization',
    ],
    href: '/services/seo-website-development/',
    iconName: 'monitor',
    popular: false,
  },
  {
    id: 4,
    title: 'SEO Website Development — USA',
    shortDescription: 'American market SEO builds that rank & convert',
    description: 'SEO-first website development tailored for US businesses. Every site is built for Core Web Vitals, local search, and American market intent — from day one.',
    features: [
      'US market keyword strategy',
      'Core Web Vitals optimized builds',
      'Local SEO & Google Maps integration',
      'Mobile-first responsive design',
      'eCommerce & custom CMS builds',
      'Schema markup & structured data',
      'Post-launch support included',
      'Analytics & Search Console setup',
    ],
    href: '/services/seo-website-development-usa/',
    iconName: 'target',
    popular: false,
  },
  {
    id: 5,
    title: 'Technical SEO Audit',
    shortDescription: 'Uncover hidden issues killing your rankings',
    description: 'Comprehensive technical analysis to identify and fix the issues preventing your website from ranking higher in search results.',
    features: [
      'Complete site crawl & analysis',
      'Core Web Vitals assessment',
      'Mobile usability testing',
      'Site speed optimization report',
      'Schema markup audit',
      'URL structure analysis',
      'Internal linking review',
      'Actionable recommendations',
    ],
    href: '/services/technical-seo-audit/',
    iconName: 'wrench',
    popular: false,
  },
  {
    id: 6,
    title: 'Link Building',
    shortDescription: 'High-quality backlink acquisition',
    description: 'Earn authoritative backlinks that boost your domain authority and search rankings through ethical, white-hat link building strategies.',
    features: [
      'Competitor backlink analysis',
      'High-quality link prospecting',
      'Guest posting opportunities',
      'Resource page link building',
      'Broken link building',
      'Digital PR & outreach',
      'Link quality assessment',
      'Monthly reporting & analysis',
    ],
    href: '/services/link-building/',
    iconName: 'link',
    popular: false,
  },
  {
    id: 7,
    title: 'SEO Consulting',
    shortDescription: 'Strategic SEO guidance & team training',
    description: 'Get expert SEO advice, strategy development, and team training to build your internal SEO capabilities and avoid costly mistakes.',
    features: [
      'SEO strategy development',
      'Competitive analysis',
      'Keyword research & planning',
      'Content strategy guidance',
      'Team training & workshops',
      'SEO process documentation',
      'Monthly strategy calls',
      'Ongoing support & guidance',
    ],
    href: '/services/seo-consulting/',
    iconName: 'lightbulb',
    popular: false,
  },
]

const WHY_CARDS = [
  {
    title: 'Results-Focused',
    desc: 'We measure success by your business growth, not just rankings.',
    paths: ['<circle cx="12" cy="12" r="10"/>', '<circle cx="12" cy="12" r="6"/>', '<circle cx="12" cy="12" r="2"/>'],
  },
  {
    title: 'India-Focused',
    desc: "We understand the Indian market, search behavior, and local competition.",
    paths: ['<rect x="1" y="4" width="22" height="16"/>', '<line x1="1" y1="10" x2="23" y2="10"/>'],
  },
  {
    title: 'Fast Results',
    desc: 'See improvements in 30-90 days, not 6-12 months like others promise.',
    paths: ['<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'],
  },
  {
    title: 'Transparent',
    desc: 'Monthly reports, regular calls, and honest communication always.',
    paths: ['<line x1="18" y1="20" x2="18" y2="10"/>', '<line x1="12" y1="20" x2="12" y2="4"/>', '<line x1="6" y1="20" x2="6" y2="14"/>'],
  },
]

function Crumbs() {
  return (
    <div className="crumbs">
      <div className="crumbs-inner">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <span className="current">Services</span>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="phero">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
        <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 40%, transparent 20%, rgba(8,9,10,0.85) 100%)', pointerEvents: 'none' }} />
      <div className="phero-inner">
        <div>
          <div className="phero-tag">
            <span className="dot" />
            India&apos;s SEO Growth Partner
          </div>
          <h1>SEO Services That<br /><span className="blue">Actually Work</span></h1>
          <h2 className="sub">No fluff. No empty promises. Just proven SEO strategies.</h2>
          <p className="lead">
            No fluff. No empty promises. Just{' '}
            <strong>proven SEO strategies that help Indian businesses rank higher</strong>,
            get more traffic, and increase revenue.
          </p>
          <div className="phero-ctas">
            <a href="/contact/" className="btn-primary">
              Get Your Free SEO Analysis <Arrow />
            </a>
            <a href="/meet-the-experts/" className="btn-outline">
              Meet Our Experts
            </a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1.75rem' }}>
            {['Free analysis', 'No commitments', 'Actionable insights'].map(item => (
              <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.72)', fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>&#10003;</span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="phero-card">
          <div className="phero-card-head">
            <span className="phero-card-title">services-portfolio.live</span>
            <span className="phero-card-live"><span className="live-dot" />LIVE</span>
          </div>
          <div className="phero-card-body">
            {SERVICES.map(svc => (
              <div key={svc.href} className="phero-card-row">
                <span className="pck">{svc.title}</span>
                <span className="pcv" style={{ fontSize: '0.82rem', color: 'var(--blue-light)', fontWeight: 600 }}>
                  {svc.popular ? 'POPULAR' : 'Active'}
                </span>
              </div>
            ))}
          </div>
          <div className="phero-card-foot">
            <span>Udaipur, Rajasthan HQ</span>
            <span>Serving India-wide</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function SvcCard({ svc }: { svc: typeof SERVICES[0] }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`si-service-card reveal${vis ? ' visible' : ''}${svc.popular ? ' si-popular' : ''}`}>
      {svc.popular && (
        <div className="si-popular-badge">POPULAR</div>
      )}
      <div className="si-service-icon">
        <SiIcon name={svc.iconName} size={24} />
      </div>
      <h3 className="si-service-title">{svc.title}</h3>
      <p className="si-service-short">{svc.shortDescription}</p>
      <p className="si-service-desc">{svc.description}</p>
      <div className="si-service-included">
        <h4>What&apos;s included:</h4>
        <ul>
          {svc.features.slice(0, 4).map((f, i) => (
            <li key={i}>
              <span className="si-dot" />
              <span>{f}</span>
            </li>
          ))}
          {svc.features.length > 4 && (
            <li className="si-more">+ {svc.features.length - 4} more features</li>
          )}
        </ul>
      </div>
      <div className="si-service-actions">
        <a href={svc.href} className="si-btn-primary">Learn More</a>
        <a href="/contact/" className="si-btn-outline">Get Quote</a>
      </div>
    </div>
  )
}

function ServicesGrid() {
  const { ref, vis } = useReveal()
  return (
    <section className="features-section" style={{ padding: '5rem 0' }}>
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">What We Offer</div>
          <h2 className="s-title">Six SEO Services, <span className="blue">One Goal: Your Growth</span></h2>
          <p className="s-sub">Each service is built around measurable outcomes. We work as an extension of your team, not just another vendor.</p>
        </div>
        <div className="features-grid" style={{ marginTop: '3rem' }}>
          {SERVICES.map(svc => (
            <SvcCard key={svc.id} svc={svc} />
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyCard({ card }: { card: typeof WHY_CARDS[0] }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`si-why-card reveal${vis ? ' visible' : ''}`}>
      <div className="si-why-icon">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: card.paths.join('') }} />
      </div>
      <h3 className="si-why-title">{card.title}</h3>
      <p className="si-why-desc">{card.desc}</p>
    </div>
  )
}

function WhySection() {
  const { ref, vis } = useReveal()
  return (
    <section style={{ background: 'var(--white)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '5rem 0' }}>
      <div className="section-container">
        <div ref={ref} className={`s-header center reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Why Choose SEOShouts</div>
          <h2 className="s-title">Why Choose SEOShouts <span className="blue">for Your SEO?</span></h2>
          <p className="s-sub">We&apos;re not just another SEO agency. We&apos;re your partners in growth.</p>
        </div>
        <div className="si-why-grid">
          {WHY_CARDS.map(card => (
            <WhyCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Cta() {
  const { ref, vis } = useReveal()
  return (
    <section className="cta-section-svc">
      <div className="cta-svc-inner">
        <div ref={ref} className={`reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">Take the Next Step</div>
          <h2 className="s-title light" style={{ maxWidth: 880, marginBottom: '1.25rem' }}>
            Ready to Dominate <span style={{ color: 'var(--blue)' }}>Search Results?</span>
          </h2>
          <p className="s-sub light" style={{ marginBottom: '3rem' }}>
            Get a free SEO analysis and see exactly how we can help your business grow online.{' '}
            <strong style={{ color: '#fff' }}>SEOShouts&apos; SEO experts</strong> are ready.
          </p>
        </div>
        <div className="cta-start-label">&rarr; Get Started Today</div>
        <div className="cta-channels">
          <div className="cta-channel">
            <div className="cta-channel-icon">
              <SiIcon name="search" size={18} />
            </div>
            <div>
              <h4>Get Your Free SEO Analysis</h4>
              <p>We audit your site and share a prioritised action plan at no cost.</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">
              <SiIcon name="phone" size={18} />
            </div>
            <div>
              <h4>Call: +91 8094888157</h4>
              <p>Speak directly with our SEO team in Udaipur, Rajasthan.</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">
              <SiIcon name="mail" size={18} />
            </div>
            <div>
              <h4>Email: seoshouts@gmail.com</h4>
              <p>Send us your goals and we will reply within 24 hours.</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">
              <SiIcon name="users" size={18} />
            </div>
            <div>
              <h4>Schedule a Strategy Call</h4>
              <p>Book a 30-minute session with our senior SEO consultant.</p>
            </div>
          </div>
        </div>
        <div className="cta-actions">
          <a href="/contact/" className="btn-primary">
            Get Free Analysis <Arrow />
          </a>
          <a href="tel:+918094888157" className="btn-outline">
            Call +91 8094888157
          </a>
        </div>
        <div className="cta-foot">
          <p className="cta-served"><strong>Serving businesses across India from our Udaipur, Rajasthan headquarters</strong></p>
          <p>Still have questions? Browse our individual service pages to see detailed deliverables, case studies, and pricing for each specialisation.</p>
        </div>
      </div>
    </section>
  )
}

export default function ServicesPageContent() {
  return (
    <>
      <style>{`
        /* services index (si-) */
        .si-service-card { background: var(--white); padding: 2.25rem 2rem; display: flex; flex-direction: column; position: relative; }
        .si-popular { border-top: 3px solid var(--blue); }
        .si-popular-badge { position: absolute; top: 1.25rem; right: 1.25rem; background: var(--blue); color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; padding: 3px 10px; text-transform: uppercase; }
        .si-service-icon { width: 52px; height: 52px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; margin: 0 auto 1.25rem; }
        .si-service-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--ink); text-align: center; margin: 0 0 0.5rem; }
        .si-service-short { font-size: 0.88rem; color: var(--gray-5); text-align: center; margin: 0 0 1rem; }
        .si-service-desc { font-size: 0.88rem; color: var(--ink-2); line-height: 1.7; margin: 0 0 1.25rem; }
        .si-service-included h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem; font-weight: 700; color: var(--ink); margin: 0 0 0.625rem; }
        .si-service-included ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .si-service-included li { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.82rem; color: var(--ink-2); line-height: 1.5; }
        .si-dot { width: 7px; height: 7px; background: var(--blue); flex-shrink: 0; margin-top: 4px; }
        .si-more { color: var(--blue); font-weight: 600; font-size: 0.82rem; }
        .si-service-actions { display: flex; flex-direction: column; gap: 0.625rem; margin-top: 1.5rem; }
        .si-btn-primary { display: block; text-align: center; padding: 0.75rem 1rem; background: var(--blue); color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: background 0.2s; }
        .si-btn-primary:hover { background: var(--blue-dark); color: #fff; }
        .si-btn-outline { display: block; text-align: center; padding: 0.75rem 1rem; background: transparent; color: var(--blue); font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-decoration: none; border: 2px solid var(--blue); transition: all 0.2s; }
        .si-btn-outline:hover { background: var(--blue); color: #fff; }
        .si-why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); margin-top: 3rem; }
        .si-why-card { background: var(--white); padding: 2.25rem 2rem; border-top: 3px solid transparent; transition: border-color 0.25s; }
        .si-why-card:hover { border-top-color: var(--blue); }
        .si-why-icon { width: 40px; height: 40px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 1.25rem; }
        .si-why-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--ink); margin: 0 0 0.625rem; }
        .si-why-desc { font-size: 0.88rem; color: var(--gray-5); line-height: 1.65; margin: 0; }
        @media (max-width: 900px) { .si-why-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 540px) { .si-why-grid { grid-template-columns: 1fr; } .si-service-card { padding: 1.5rem; } }
      `}</style>

      <Crumbs />
      <Hero />
      <ServicesGrid />
      <WhySection />
      <Cta />
    </>
  )
}
