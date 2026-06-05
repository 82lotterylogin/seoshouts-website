'use client'

import { useState, useEffect, useRef } from 'react'
import ShapeGrid from '../../components/ShapeGrid'
import HeroQuoteForm from '../../components/HeroQuoteForm'

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

function ArrowSm() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  )
}

// ─── SVG icon set ────────────────────────────────────────────────────────────

const SvcIcon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  // ── existing icons ──
  if (name === 'compass') return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></svg>
  if (name === 'gear') return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  if (name === 'file') return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
  if (name === 'pin') return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
  if (name === 'users') return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  if (name === 'chart') return <svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  if (name === 'target') return <svg {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
  if (name === 'layers') return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  // ── challenge section icons ──
  if (name === 'refresh') return <svg {...p}><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
  if (name === 'cpu') return <svg {...p}><rect x="4" y="4" width="16" height="16" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
  if (name === 'crosshair') return <svg {...p}><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></svg>
  if (name === 'smartphone') return <svg {...p}><rect x="5" y="2" width="14" height="20" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
  if (name === 'tag') return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  if (name === 'zap') return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  // ── why-cards section icons ──
  if (name === 'award') return <svg {...p}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
  if (name === 'trending-up') return <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
  if (name === 'sliders') return <svg {...p}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
  if (name === 'code') return <svg {...p}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  if (name === 'heart') return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  if (name === 'bar-chart') return <svg {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  return null
}

// ─── Hero card data ─────────────────────────────────────────────────────────


// ─── Section data ────────────────────────────────────────────────────────────

const CHALLENGES = [
  { icon: 'refresh',     title: 'Algorithm complexity', desc: 'has increased exponentially with 4,000+ annual updates' },
  { icon: 'cpu',         title: 'AI-powered search features', desc: 'now influence 60% of query results' },
  { icon: 'crosshair',   title: 'User intent sophistication', desc: 'requires nuanced content and technical strategies' },
  { icon: 'smartphone',  title: 'Mobile-first indexing', desc: 'demands comprehensive responsive optimization' },
  { icon: 'tag',         title: 'Entity-based search', desc: 'prioritizes topical authority over keyword density' },
  { icon: 'zap',         title: 'Core Web Vitals', desc: 'significantly impact both rankings and user experience' },
]

const SERVICES = [
  {
    icon: 'compass', num: '01',
    title: 'Strategic SEO Assessment and Planning',
    intro: 'Develop comprehensive SEO strategies aligned with business objectives and market realities:',
    sections: [
      {
        heading: 'Business and Market Analysis',
        items: [
          'Comprehensive business goal alignment and KPI framework development',
          'Market opportunity assessment and competitive landscape analysis',
          'Customer journey mapping and search behavior analysis',
          'Technical infrastructure evaluation and optimization planning',
          'Resource allocation strategy and implementation timeline development',
        ],
      },
      {
        heading: 'SEO Strategy Development',
        items: [
          'Custom SEO roadmap creation with priority-based implementation phases',
          'Content strategy development aligned with search intent and business goals',
          'Technical SEO architecture planning for scalability and performance',
          'Link acquisition strategy and authority building framework',
          'Performance measurement and optimization methodology establishment',
        ],
      },
    ],
    out: 'Ensuring your SEO strategy directly supports revenue growth and competitive positioning.',
  },
  {
    icon: 'gear', num: '02',
    title: 'Technical SEO Strategy and Implementation Support',
    intro: 'Navigate complex technical challenges with expert guidance and industry best practices:',
    sections: [
      {
        heading: 'Advanced Technical Optimization',
        items: [
          'Site architecture planning for optimal crawlability and user experience',
          'Core Web Vitals optimization strategy for performance and rankings',
          'Schema markup implementation for enhanced search visibility',
          'International SEO planning for multi-market expansion',
          'Mobile-first optimization strategy for diverse device and connection scenarios',
        ],
      },
      {
        heading: 'Platform-Specific Consulting',
        items: [
          'eCommerce SEO strategy for product and category optimization',
          'WordPress optimization and performance enhancement',
          'Enterprise CMS integration and optimization planning',
          'Migration strategy development and execution guidance',
          'Security and HTTPS implementation best practices',
        ],
      },
    ],
    out: 'Providing technical expertise to ensure optimal search engine accessibility and user experience.',
  },
  {
    icon: 'file', num: '03',
    title: 'Content Strategy and Optimization Consulting',
    intro: 'Create content frameworks that establish authority and drive qualified traffic:',
    sections: [
      {
        heading: 'Strategic Content Development',
        items: [
          'Comprehensive keyword research and semantic mapping',
          'Content gap analysis and competitive opportunity identification',
          'Editorial calendar development with search-optimized content planning',
          'Content cluster strategy for topical authority establishment',
          'E-E-A-T optimization for expertise demonstration and trust building',
        ],
      },
      {
        heading: 'Content Performance Optimization',
        items: [
          'Existing content audit and optimization recommendations',
          'Content refreshing strategy for sustained performance',
          'Featured snippet and AI Overview optimization',
          'Voice search and conversational query optimization',
          'Content ROI measurement and performance enhancement',
        ],
      },
    ],
    out: 'Developing content strategies that attract qualified traffic and support conversion objectives.',
  },
  {
    icon: 'pin', num: '04',
    title: 'Local SEO Strategy and Implementation',
    intro: 'Maximize local search visibility across single and multi-location scenarios:',
    sections: [
      {
        heading: 'Local Search Optimization',
        items: [
          'Google Business Profile optimization and management strategy',
          'Local citation development and consistency management',
          'Local content strategy for geographic market targeting',
          'Review management and reputation optimization',
          'Local link building and community engagement strategies',
        ],
      },
      {
        heading: 'Multi-Location SEO Coordination',
        items: [
          'Scalable local SEO framework for multiple locations',
          'Location-specific content strategy and implementation',
          'Centralized management system development',
          'Performance tracking across geographic markets',
          'Regional optimization for diverse market conditions',
        ],
      },
    ],
    out: 'Ensuring comprehensive local search dominance and qualified lead generation.',
  },
  {
    icon: 'users', num: '05',
    title: 'SEO Team Development and Training',
    intro: 'Build internal SEO capabilities through structured training and knowledge transfer:',
    sections: [
      {
        heading: 'Team Capability Building',
        items: [
          'SEO fundamentals training for marketing teams',
          'Advanced technical SEO education for developers',
          'Content optimization training and best practices implementation',
          'SEO tools training and workflow optimization',
          'Performance analysis and reporting skill development',
        ],
      },
      {
        heading: 'Ongoing Education and Support',
        items: [
          'Industry update briefings and algorithm change guidance',
          'Advanced skill development workshops',
          'Best practices documentation and process optimization',
          'Quality assurance and performance review sessions',
          'Strategic planning and goal setting facilitation',
        ],
      },
    ],
    out: 'Developing sustainable internal expertise for long-term SEO success.',
  },
  {
    icon: 'chart', num: '06',
    title: 'Performance Analysis and Optimization',
    intro: 'Maximize ROI through comprehensive analysis and continuous improvement:',
    sections: [
      {
        heading: 'Performance Measurement and Analysis',
        items: [
          'Advanced analytics implementation and tracking setup',
          'SEO performance auditing and optimization identification',
          'Competitive analysis and benchmarking',
          'ROI analysis and budget optimization recommendations',
          'User experience analysis and conversion optimization',
        ],
      },
      {
        heading: 'Strategic Optimization and Growth Planning',
        items: [
          'Algorithm update impact assessment and response planning',
          'Seasonal optimization and campaign planning',
          'Scalability planning for business growth',
          'Advanced SEO technique implementation',
          'Long-term strategic planning and goal adjustment',
        ],
      },
    ],
    out: 'Providing data-driven insights for sustained growth and competitive advantage.',
  },
]

const PROCESS_PHASES = [
  {
    num: '01', phase: 'Phase 1', timing: 'Weeks 1-3',
    title: 'Comprehensive Assessment and Strategy Development',
    sections: [
      {
        heading: 'Initial Business and SEO Analysis',
        items: [
          'Detailed business objective assessment and KPI establishment',
          'Comprehensive SEO performance audit and gap identification',
          'Competitive landscape analysis and opportunity mapping',
          'Technical infrastructure evaluation and optimization planning',
          'Market research and customer search behavior analysis',
        ],
      },
      {
        heading: 'Strategic Framework Development',
        items: [
          'Custom SEO strategy creation aligned with business goals',
          'Implementation roadmap with priority-based action items',
          'Resource requirements and timeline development',
          'Success metrics and measurement framework establishment',
          'Risk assessment and mitigation strategy development',
        ],
      },
    ],
  },
  {
    num: '02', phase: 'Phase 2', timing: 'Weeks 4-6',
    title: 'Implementation Planning and Team Enablement',
    sections: [
      {
        heading: 'Detailed Implementation Planning',
        items: [
          'Comprehensive action plan development with specific deliverables',
          'Technical implementation guidance and best practices documentation',
          'Content strategy implementation and editorial calendar creation',
          'Team training and skill development sessions',
          'Quality assurance framework and monitoring system setup',
        ],
      },
      {
        heading: 'Capability Building and Training',
        items: [
          'Customized training programs for internal teams',
          'Tool implementation and workflow optimization',
          'Process documentation and standard operating procedures',
          'Performance tracking and reporting system establishment',
          'Ongoing support structure and communication framework',
        ],
      },
    ],
  },
  {
    num: '03', phase: 'Phase 3', timing: 'Monthly/Quarterly',
    title: 'Ongoing Strategic Support and Optimization',
    sections: [
      {
        heading: 'Performance Review and Strategic Adjustment',
        items: [
          'Comprehensive performance analysis and optimization recommendations',
          'Strategic planning adjustments based on market changes and results',
          'Advanced training and skill development continuation',
          'Competitive monitoring and strategic response planning',
          'Growth planning and scalability assessment',
        ],
      },
      {
        heading: 'Continuous Improvement and Innovation',
        items: [
          'Industry trend analysis and strategic integration',
          'New opportunity identification and implementation planning',
          'Performance optimization and efficiency improvement',
          'Strategic partnership and collaboration opportunities',
          'Long-term growth planning and market expansion strategy',
        ],
      },
    ],
  },
]

const PACKAGES = [
  {
    icon: 'target',
    title: 'Strategic SEO Consulting',
    desc: 'Comprehensive strategy development and implementation guidance',
    items: [
      'Initial comprehensive SEO audit and strategic assessment',
      'Custom SEO roadmap and implementation planning',
      'Quarterly strategy reviews and optimization recommendations',
      'Ongoing consultation and strategic guidance',
      'Team training and capability development',
    ],
    footnote: 'Ideal for businesses seeking comprehensive SEO strategy development and implementation support.',
    ariaLabel: 'Get Strategic SEO Consulting',
  },
  {
    icon: 'gear',
    title: 'Technical SEO Consulting',
    desc: 'Specialized technical optimization and implementation expertise',
    items: [
      'Advanced technical SEO auditing and optimization planning',
      'Implementation guidance for complex technical challenges',
      'Performance optimization and Core Web Vitals enhancement',
      'Migration planning and execution support',
      'Technical team training and capability building',
    ],
    footnote: 'Perfect for businesses with complex technical requirements and implementation challenges.',
    ariaLabel: 'Get Technical SEO Consulting',
  },
  {
    icon: 'layers',
    title: 'Enterprise SEO Consulting',
    desc: 'Large-scale SEO strategy and coordination for complex organizations',
    items: [
      'Multi-site and international SEO strategy development',
      'Comprehensive team training and capability development',
      'Advanced analytics and performance optimization',
      'Executive reporting and strategic business alignment',
      'Large-scale implementation project management',
    ],
    footnote: 'Designed for enterprise organizations with multiple sites, complex requirements, and substantial resources.',
    ariaLabel: 'Get Enterprise SEO Consulting',
  },
]

const WHY_CARDS = [
  {
    icon: 'award',
    title: 'Proven Strategic Expertise and Industry Leadership',
    body: <p>Over <strong>13 years of SEO experience</strong> across diverse industries, market conditions, and algorithm changes, providing deep strategic knowledge and practical implementation expertise that drives sustainable results.</p>,
  },
  {
    icon: 'trending-up',
    title: 'Comprehensive Data-Driven Methodology',
    body: <p>All strategic recommendations are supported by <strong>comprehensive data analysis</strong>, competitive research, and performance measurement frameworks that ensure informed decision-making and measurable outcomes.</p>,
  },
  {
    icon: 'sliders',
    title: 'Industry-Specific Knowledge and Customization',
    body: <p>Deep understanding of unique challenges and opportunities across various sectors, enabling <strong>tailored strategies</strong> that address specific business needs, market conditions, and competitive landscapes.</p>,
  },
  {
    icon: 'code',
    title: 'Technical Excellence and Strategic Integration',
    body: <p>Combining <strong>advanced technical SEO knowledge</strong> with strategic business acumen to deliver holistic solutions that support broader organizational goals and sustainable growth.</p>,
  },
  {
    icon: 'heart',
    title: 'Transparent Communication and Collaborative Approach',
    body: <p>Professional communication standards with <strong>regular updates, detailed reporting</strong>, and collaborative approach to strategy development that ensures alignment with business objectives.</p>,
  },
  {
    icon: 'bar-chart',
    title: 'Scalable Solutions and Long-Term Value',
    body: <p>Consulting approaches that adapt to <strong>organizational size, resources, and growth objectives</strong>, providing sustainable value and capability building for long-term success.</p>,
  },
]

const FAQS = [
  {
    q: 'What distinguishes your SEO consulting from traditional SEO services?',
    a: 'Our consulting focuses on strategic guidance, capability building, and long-term value creation rather than task execution. We develop internal expertise while providing strategic direction, ensuring sustainable success and reduced dependency on external resources.',
  },
  {
    q: 'How do you customize consulting services for different business sizes and industries?',
    a: 'We conduct comprehensive assessments of business goals, current capabilities, competitive landscape, and available resources to develop customized strategies and consulting approaches that align with specific requirements and market conditions.',
  },
  {
    q: 'What level of implementation support do you provide?',
    a: 'Our consulting services range from high-level strategy development to detailed technical implementation guidance and hands-on support, depending on client needs and internal capabilities. We adapt our approach to complement existing resources and fill capability gaps.',
  },
  {
    q: 'How do you measure the success and ROI of consulting engagements?',
    a: 'Success is measured through predefined KPIs aligned with business objectives, including organic traffic growth, ranking improvements, conversion increases, team capability development, and overall ROI from SEO investments.',
  },
  {
    q: 'Can you work effectively with existing marketing teams and agency relationships?',
    a: 'Absolutely. We excel at collaborative environments, providing strategic oversight, coordination, and training that enhances existing capabilities while ensuring all SEO efforts align with broader marketing and business objectives.',
  },
  {
    q: 'What industries and business types do you have consulting experience with?',
    a: 'We have extensive consulting experience across multiple industries including eCommerce, healthcare, education, professional services, technology, manufacturing, and local businesses throughout India and international markets.',
  },
  {
    q: 'Do you offer both project-based and ongoing consulting arrangements?',
    a: 'Yes, we provide both project-based consulting for specific challenges and strategic initiatives, as well as ongoing strategic support through monthly or quarterly consulting arrangements based on client needs and objectives.',
  },
  {
    q: 'How do you ensure knowledge transfer and sustainable capability building?',
    a: 'Our consulting methodology emphasizes documentation, training, and process development that builds internal expertise. We provide comprehensive training materials, standard operating procedures, and ongoing support to ensure sustainable capability development.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChallengeCard({ c, i }: { c: typeof CHALLENGES[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`feature-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="feature-icon"><SvcIcon name={c.icon} /></div>
      <strong>{c.title}</strong>
      <p>{c.desc}</p>
    </div>
  )
}



function PackageCard({ p, i }: { p: typeof PACKAGES[0]; i: number }) {
  const { ref, vis } = useReveal()
  const featured = i === 1
  return (
    <div ref={ref} className={`pkg-card reveal d${i + 1}${vis ? ' visible' : ''}${featured ? ' pkg-featured' : ''}`}>
      {/* Top accent stripe */}
      <div className="pkg-stripe" />

      {/* "Most Popular" badge — featured card only */}
      {featured && <div className="pkg-badge">★ Most Popular</div>}

      {/* Ghost watermark numeral */}
      <div className="pkg-ghost" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>

      {/* Icon */}
      <div className="pkg-icon-box">
        <SvcIcon name={p.icon} size={24} />
      </div>

      {/* Tier label + title */}
      <div className="pkg-tier">TIER / {String(i + 1).padStart(2, '0')}</div>
      <h3 className="pkg-title">{p.title}</h3>
      <p className="pkg-desc">{p.desc}</p>

      {/* Included features header */}
      <div className="pkg-includes-row">
        <span className="pkg-includes-label">What&apos;s Included</span>
        <div className="pkg-includes-line" />
      </div>

      {/* Feature checklist */}
      <ul className="pkg-list">
        {p.items.map(item => (
          <li key={item} className="pkg-li">
            <svg className="pkg-check" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      {/* Footnote */}
      <p className="pkg-footnote">{p.footnote}</p>

      {/* CTA — filled for featured, outlined for others */}
      <a
        href="/contact/"
        className={`${featured ? 'btn-primary' : 'btn-outline'} pkg-cta`}
        aria-label={p.ariaLabel}
      >
        Get Started
      </a>
    </div>
  )
}

function WhyCard({ c, i }: { c: typeof WHY_CARDS[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`choose-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="choose-icon"><SvcIcon name={c.icon} size={22} /></div>
      <h3>{c.title}</h3>
      {c.body}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Crumbs() {
  return (
    <div className="crumbs">
      <div className="crumbs-inner">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/services/">Services</a>
        <span className="sep">/</span>
        <span className="current">SEO Consulting</span>
      </div>
    </div>
  )
}

function PageHero() {
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
            🎯 Strategic SEO Leadership
          </div>
          <h1>SEO Consulting Services<br /><span className="blue">Strategic SEO Leadership for Competitive Advantage</span></h1>
          <p className="wd-hero-body">Most SEO agencies give you activity reports. We give you a <strong>strategy built around your specific competitive landscape</strong> — and the expertise to execute it.</p>
          <p className="wd-hero-body">Whether you&apos;re a founder who needs SEO clarity, a marketing team that needs strategic direction, or a scaling brand that needs sustainable search growth — our consulting cuts through the noise.</p>
          <p className="wd-hero-body">SEOShouts&apos; <strong>SEO Consulting services</strong> combine 13+ years of hands-on ranking expertise with a deep understanding of how Google actually works in 2025 — not how it worked 5 years ago.</p>
          <p className="wd-hero-body">You&apos;ll walk away with a <strong>clear, prioritised action plan</strong> your team can implement immediately — no vague recommendations, no endless audits that go nowhere.</p>
          <div className="phero-ctas">
            <a href="/contact/" aria-label="Schedule Strategic SEO Consultation" className="btn-primary">
              🚀 Schedule Your Strategic SEO Consultation <Arrow />
            </a>
            <a href="tel:+918094888157" aria-label="Call SEO Shouts for SEO consulting" className="btn-outline">
              📞 Call +91 8094888157
            </a>
          </div>
          <div className="wd-hero-trust">
            <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Strategy session includes a full site review — not just a 30-minute call
          </div>
        </div>

        <HeroQuoteForm />
      </div>
    </section>
  )
}

function LandscapeSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section features-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">The SEO Challenge</div>
          <h2 className="s-title">The Strategic Imperative of Professional SEO Consulting</h2>
        </div>
        <p className="why-lede">
          The search landscape has fundamentally transformed. With Google&apos;s AI Overviews reaching two billion users, the integration of helpful content signals into core algorithms, and the evolution of E-E-A-T as a critical ranking factor, effective SEO requires strategic expertise that goes far beyond traditional optimization tactics.
        </p>
        <div className="why-substat-label">Current SEO Landscape Challenges:</div>
        <div className="features-grid">
          {CHALLENGES.map((c, i) => <ChallengeCard key={c.title} c={c} i={i} />)}
        </div>
        <div style={{ marginTop: '2.5rem', borderLeft: '3px solid var(--blue)', paddingLeft: '1.75rem', position: 'relative' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '0.75rem' }}>The Bottom Line</span>
          <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.7 }}>
            Professional SEO consulting provides the strategic framework necessary to navigate these complexities and achieve sustainable organic growth.
          </p>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const { ref, vis } = useReveal()
  const [active, setActive] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  function select(i: number) {
    if (i === active) return
    setActive(i)
    setPanelKey(k => k + 1)
  }

  const svc = SERVICES[active]

  return (
    <section className="section svc-section">
      <style>{`
        @keyframes svcSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .svc-explorer {
          display: flex; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09); min-height: 520px;
        }
        .svc-tabs {
          width: 310px; flex-shrink: 0;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.09);
          display: flex; flex-direction: column;
        }
        .svc-tab {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 15px 18px; cursor: pointer; border: none;
          background: transparent; text-align: left;
          color: rgba(255,255,255,0.5);
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          border-left: 3px solid transparent;
        }
        .svc-tab:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.82); }
        .svc-tab.stactive {
          background: rgba(37,99,235,0.14);
          color: #fff;
          border-left-color: var(--blue);
        }
        .svc-tab-icon {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07); flex-shrink: 0; margin-top: 1px;
          transition: background 0.18s, color 0.18s;
        }
        .svc-tab.stactive .svc-tab-icon { background: rgba(37,99,235,0.28); color: var(--blue); }
        .svc-tab-body { flex: 1; min-width: 0; }
        .svc-tab-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); opacity: 0.85; margin-bottom: 3px; }
        .svc-tab.stactive .svc-tab-num { opacity: 1; }
        .svc-tab-label { font-size: 0.9rem; font-weight: 600; line-height: 1.35; }
        .svc-tab-arr { flex-shrink: 0; align-self: center; opacity: 0; transition: opacity 0.18s; color: var(--blue); }
        .svc-tab.stactive .svc-tab-arr { opacity: 1; }
        .svc-panel { flex: 1; padding: 34px 38px; overflow-y: auto; }
        .svc-panel-anim { animation: svcSlideIn 0.3s cubic-bezier(0.2,0.6,0.4,1) both; }
        .svc-panel-head { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .svc-panel-bigicon {
          width: 50px; height: 50px; border-radius: 12px;
          background: rgba(37,99,235,0.18); border: 1px solid rgba(37,99,235,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--blue); flex-shrink: 0;
        }
        .svc-panel-meta { flex: 1; }
        .svc-panel-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); margin-bottom: 4px; }
        .svc-panel-h3 { font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.3; margin: 0; }
        .svc-panel-intro { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 22px; line-height: 1.65; }
        .svc-panel-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .svc-panel-col { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px 18px; }
        .svc-panel-col-head { font-size: 0.875rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--blue); margin-bottom: 10px; }
        .svc-panel-col-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .svc-panel-col-list li { font-size: 0.875rem; color: rgba(255,255,255,0.68); line-height: 1.45; display: flex; align-items: flex-start; gap: 8px; }
        .svc-panel-col-list li::before { content: ''; width: 5px; height: 5px; min-width: 5px; border-radius: 50%; background: var(--blue); margin-top: 6px; }
        .svc-panel-outcome { margin-top: 18px; background: rgba(37,99,235,0.1); border-left: 3px solid var(--blue); padding: 11px 16px; border-radius: 0 8px 8px 0; }
        .svc-panel-outcome p { font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.78); margin: 0; font-style: italic; }
        @media (max-width: 900px) {
          /* Collapse to icon-only tab strip — names shown in panel header */
          .svc-explorer { flex-direction: column; min-height: unset; }
          .svc-tabs {
            width: 100%; flex-direction: row;
            border-right: none; border-bottom: 1px solid rgba(255,255,255,0.09);
            overflow-x: auto; scrollbar-width: none;
          }
          .svc-tabs::-webkit-scrollbar { display: none; }
          .svc-tab {
            flex: 1; flex-direction: column; align-items: center;
            justify-content: center; gap: 0;
            padding: 14px 6px; min-width: 50px;
            border-left: none; border-bottom: 3px solid transparent;
          }
          .svc-tab.stactive { border-bottom-color: var(--blue); border-left-color: transparent; }
          /* Hide text labels — icon is enough, name shows in panel */
          .svc-tab-body { display: none; }
          .svc-tab-arr { display: none; }
          .svc-tab-icon { width: 28px; height: 28px; margin-top: 0; }
          /* Panel adjustments */
          .svc-panel { padding: 20px 16px; }
          .svc-panel-cols { grid-template-columns: 1fr; }
          .svc-panel-bigicon { width: 38px; height: 38px; }
          .svc-panel-h3 { font-size: 1rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">What We Do</div>
          <h2 className="s-title light">Comprehensive SEO Consulting Services</h2>
          <p className="s-sub light">Strategic guidance and expertise across all aspects of modern search engine optimization</p>
        </div>

        <div className="svc-explorer">
          {/* ─── Left: Service Tabs ─── */}
          <div className="svc-tabs" role="tablist" aria-label="SEO Consulting Services">
            {SERVICES.map((s, i) => (
              <button
                key={s.num}
                role="tab"
                aria-selected={active === i}
                aria-controls={`svc-panel-tab`}
                className={`svc-tab${active === i ? ' stactive' : ''}`}
                onClick={() => select(i)}
              >
                <div className="svc-tab-icon">
                  <SvcIcon name={s.icon} />
                </div>
                <div className="svc-tab-body">
                  <div className="svc-tab-num">SERVICE / {s.num}</div>
                  <div className="svc-tab-label">{s.title}</div>
                </div>
                <span className="svc-tab-arr"><Arrow /></span>
              </button>
            ))}
          </div>

          {/* ─── Right: Content Panel ─── */}
          <div className="svc-panel" id="svc-panel-tab" role="tabpanel">
            <div key={panelKey} className="svc-panel-anim">
              <div className="svc-panel-head">
                <div className="svc-panel-bigicon">
                  <SvcIcon name={svc.icon} size={24} />
                </div>
                <div className="svc-panel-meta">
                  <div className="svc-panel-num">SERVICE / {svc.num}</div>
                  <h3 className="svc-panel-h3">{svc.title}</h3>
                </div>
              </div>

              <p className="svc-panel-intro">{svc.intro}</p>

              <div className="svc-panel-cols">
                {svc.sections.map((sec) => (
                  <div key={sec.heading} className="svc-panel-col">
                    <div className="svc-panel-col-head">{sec.heading}</div>
                    <ul className="svc-panel-col-list">
                      {sec.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="svc-panel-outcome">
                <p>{svc.out}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="svc-cta">
          <a href="/contact/" aria-label="Get started with SEO consulting" className="btn-primary">
            Get Started with SEO Consulting Today <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const { ref, vis } = useReveal()
  const [active, setActive] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  function selectPhase(i: number) {
    if (i === active) return
    setActive(i)
    setPanelKey(k => k + 1)
  }

  const gridCols = PROCESS_PHASES.map((_, i) => (i === active ? '1fr' : '72px')).join(' ')

  return (
    <section className="section process-section">
      <style>{`
        @keyframes pslabIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .pslab-track {
          display: grid;
          height: 360px;
          border: 1px solid rgba(0,0,0,0.13);
          transition: grid-template-columns 0.48s cubic-bezier(0.4,0,0.2,1);
        }
        .pslab-slab {
          position: relative; overflow: hidden; cursor: pointer;
          border-right: 1px solid rgba(0,0,0,0.1);
          background: var(--ink);
          display: flex; flex-direction: column;
          transition: background 0.25s;
        }
        .pslab-slab:last-child { border-right: none; }
        .pslab-slab:hover:not(.pslab-on) { background: rgba(14,18,24,0.82); }
        .pslab-slab.pslab-on { cursor: default; background: #fff; }
        /* Blue accent stripe — only on active */
        .pslab-stripe {
          height: 3px; flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          transition: background 0.3s;
        }
        .pslab-slab.pslab-on .pslab-stripe { background: var(--blue); }
        /* ─── Collapsed (inactive) content ─── */
        .pslab-fold {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; padding: 22px 0 20px; gap: 10px;
        }
        .pslab-slab.pslab-on .pslab-fold { display: none; }
        .pslab-fold-num {
          font-size: 1.5rem; font-weight: 900; line-height: 1;
          letter-spacing: -0.04em; color: rgba(255,255,255,0.65);
          transition: color 0.2s;
        }
        .pslab-slab:hover:not(.pslab-on) .pslab-fold-num { color: rgba(255,255,255,0.9); }
        .pslab-fold-line { width: 1px; flex: 1; background: rgba(255,255,255,0.12); }
        .pslab-fold-tag {
          writing-mode: vertical-rl; transform: rotate(180deg);
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(255,255,255,0.58);
          white-space: nowrap; transition: color 0.2s; line-height: 1;
        }
        .pslab-slab:hover:not(.pslab-on) .pslab-fold-tag { color: rgba(255,255,255,0.85); }
        .pslab-fold-time {
          font-size: 0.75rem; font-family: 'JetBrains Mono', monospace;
          color: rgba(255,255,255,0.42); letter-spacing: 0.04em;
          writing-mode: vertical-rl; transform: rotate(180deg);
          transition: color 0.2s;
        }
        .pslab-slab:hover:not(.pslab-on) .pslab-fold-time { color: rgba(255,255,255,0.66); }
        /* ─── Expanded (active) content ─── */
        .pslab-open {
          display: none; padding: 18px 26px 16px;
          flex: 1; overflow: hidden; flex-direction: column;
        }
        .pslab-slab.pslab-on .pslab-open { display: flex; }
        .pslab-open-anim {
          animation: pslabIn 0.36s 0.22s cubic-bezier(0.2,0.6,0.4,1) both;
          display: flex; flex-direction: column; height: 100%;
        }
        .pslab-hd {
          display: flex; align-items: flex-start; gap: 12px;
          margin-bottom: 14px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.07); flex-shrink: 0;
        }
        .pslab-hd-ghost {
          font-size: 2.8rem; font-weight: 900; line-height: 0.8;
          color: rgba(37,99,235,0.07); letter-spacing: -0.06em;
          flex-shrink: 0; user-select: none; pointer-events: none;
        }
        .pslab-hd-chips { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
        .pslab-hd-chip {
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--blue);
          background: rgba(37,99,235,0.08); padding: 3px 8px;
          border: 1px solid rgba(37,99,235,0.18);
        }
        .pslab-hd-time {
          font-size: 0.875rem; color: rgba(0,0,0,0.28);
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
        }
        .pslab-hd-title {
          font-size: 1.04rem; font-weight: 700; color: var(--ink);
          line-height: 1.28; margin: 0;
        }
        .pslab-sections {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; align-content: start;
        }
        .pslab-sec-hd {
          font-size: 0.875rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--blue);
          margin-bottom: 11px; padding-bottom: 7px;
          border-bottom: 1px solid rgba(37,99,235,0.12);
        }
        .pslab-sec-ul {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 7px;
        }
        .pslab-sec-ul li {
          font-size: 0.875rem; color: #3a4a5c;
          line-height: 1.44; display: flex; align-items: flex-start; gap: 9px;
        }
        .pslab-sec-ul li::before {
          content: ''; width: 3px; height: 3px; min-width: 3px;
          background: var(--blue); margin-top: 7px; flex-shrink: 0;
        }
        /* Phase nav strip */
        .pslab-nav { display: flex; justify-content: center; gap: 7px; margin-top: 14px; }
        .pslab-nav-dot {
          width: 24px; height: 3px; padding: 0; border: none; cursor: pointer;
          background: rgba(0,0,0,0.1);
          transition: background 0.2s, width 0.25s;
        }
        .pslab-nav-dot.pslab-nav-on { background: var(--blue); width: 42px; }
        /* Mobile */
        @media (max-width: 720px) {
          .pslab-track { grid-template-columns: 1fr !important; height: auto; }
          .pslab-slab { flex-direction: row; min-height: 52px; }
          .pslab-slab.pslab-on { flex-direction: column; }
          .pslab-stripe { width: 4px; height: auto; flex-shrink: 0; }
          .pslab-slab.pslab-on .pslab-stripe { width: 100%; height: 3px; }
          .pslab-fold { flex-direction: row; padding: 0 14px; gap: 10px; }
          .pslab-fold-tag, .pslab-fold-time { writing-mode: horizontal-tb; transform: none; }
          .pslab-fold-line { width: auto; height: 1px; flex: 1; }
          .pslab-open { padding: 18px 16px; }
          .pslab-sections { grid-template-columns: 1fr; gap: 14px; }
          .pslab-hd-ghost { font-size: 2.2rem; }
          .pslab-hd-title { font-size: 0.92rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Our Process</div>
          <h2 className="s-title">Our Strategic SEO Consulting Process</h2>
          <p className="s-sub">A comprehensive 3-phase approach designed to deliver sustainable SEO success</p>
        </div>

        <div className="pslab-track" style={{ gridTemplateColumns: gridCols }}>
          {PROCESS_PHASES.map((p, i) => (
            <div
              key={p.num}
              className={`pslab-slab${active === i ? ' pslab-on' : ''}`}
              onClick={() => selectPhase(i)}
              role="button"
              tabIndex={active === i ? -1 : 0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPhase(i) } }}
              aria-expanded={active === i}
              aria-label={active === i ? undefined : `Open ${p.phase}: ${p.title}`}
            >
              <div className="pslab-stripe" />

              {/* Inactive: vertical label strip */}
              <div className="pslab-fold">
                <span className="pslab-fold-num">{p.num}</span>
                <div className="pslab-fold-line" aria-hidden="true" />
                <span className="pslab-fold-tag">{p.phase}</span>
                <span className="pslab-fold-time">{p.timing}</span>
              </div>

              {/* Active: full content panel */}
              <div className="pslab-open">
                <div key={panelKey} className="pslab-open-anim">
                  <div className="pslab-hd">
                    <div className="pslab-hd-ghost" aria-hidden="true">{p.num}</div>
                    <div>
                      <div className="pslab-hd-chips">
                        <span className="pslab-hd-chip">{p.phase}</span>
                        <span className="pslab-hd-time">{p.timing}</span>
                      </div>
                      <h3 className="pslab-hd-title">{p.title}</h3>
                    </div>
                  </div>
                  <div className="pslab-sections">
                    {p.sections.map((sec) => (
                      <div key={sec.heading}>
                        <div className="pslab-sec-hd">{sec.heading}</div>
                        <ul className="pslab-sec-ul">
                          {sec.items.map(item => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pslab-nav" aria-label="Phase navigation">
          {PROCESS_PHASES.map((_, i) => (
            <button
              key={i}
              className={`pslab-nav-dot${active === i ? ' pslab-nav-on' : ''}`}
              onClick={() => selectPhase(i)}
              aria-label={`Phase ${i + 1}`}
              aria-current={active === i ? true : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PackagesSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section svc-section">
      <style>{`
        /* ─── Package Cards ─────────────────────────────── */
        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid rgba(255,255,255,0.09);
        }
        .pkg-card {
          position: relative; overflow: hidden;
          padding: 32px 26px 28px;
          display: flex; flex-direction: column;
          background: var(--ink);
          border-right: 1px solid rgba(255,255,255,0.09);
          transition: background 0.2s;
        }
        .pkg-card:last-child { border-right: none; }
        .pkg-card.pkg-featured {
          background: rgba(37,99,235,0.07);
          border-right: 1px solid rgba(37,99,235,0.22);
          border-left: 1px solid rgba(37,99,235,0.22);
        }
        /* Top stripe */
        .pkg-stripe {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: rgba(255,255,255,0.06);
        }
        .pkg-card.pkg-featured .pkg-stripe { background: var(--blue); }
        /* Most Popular badge */
        .pkg-badge {
          display: inline-flex; align-items: center; align-self: flex-start;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #fff;
          background: var(--blue);
          padding: 4px 10px;
          margin-bottom: 18px;
        }
        /* Ghost numeral */
        .pkg-ghost {
          position: absolute; bottom: -12px; right: 14px;
          font-size: 6.5rem; font-weight: 900; line-height: 1;
          letter-spacing: -0.06em;
          color: rgba(255,255,255,0.022);
          pointer-events: none; user-select: none;
        }
        .pkg-card.pkg-featured .pkg-ghost { color: rgba(37,99,235,0.08); }
        /* Icon box */
        .pkg-icon-box {
          width: 46px; height: 46px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
        }
        .pkg-card.pkg-featured .pkg-icon-box {
          background: rgba(37,99,235,0.2);
          border-color: rgba(37,99,235,0.38);
          color: var(--blue);
        }
        /* Tier + title + desc */
        .pkg-tier {
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
        }
        .pkg-card.pkg-featured .pkg-tier { color: var(--blue); }
        .pkg-title {
          font-size: 1.1rem; font-weight: 700;
          color: #fff; line-height: 1.25;
          margin: 0 0 8px;
        }
        .pkg-desc {
          font-size: 0.875rem; color: rgba(255,255,255,0.48);
          line-height: 1.6; margin: 0 0 20px;
        }
        /* "What's Included" row */
        .pkg-includes-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
        }
        .pkg-includes-label {
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); white-space: nowrap;
          flex-shrink: 0;
        }
        .pkg-card.pkg-featured .pkg-includes-label { color: rgba(37,99,235,0.8); }
        .pkg-includes-line {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .pkg-card.pkg-featured .pkg-includes-line { background: rgba(37,99,235,0.2); }
        /* Checklist */
        .pkg-list {
          list-style: none; margin: 0 0 20px; padding: 0;
          display: flex; flex-direction: column; gap: 9px;
          flex: 1;
        }
        .pkg-li {
          display: flex; align-items: flex-start; gap: 9px;
          font-size: 0.875rem; color: rgba(255,255,255,0.64);
          line-height: 1.5;
        }
        .pkg-check {
          flex-shrink: 0; margin-top: 2px;
          color: rgba(255,255,255,0.25);
        }
        .pkg-card.pkg-featured .pkg-check { color: var(--blue); }
        /* Footnote */
        .pkg-footnote {
          font-size: 0.8rem; color: rgba(255,255,255,0.3);
          font-style: italic; line-height: 1.55;
          margin: 0 0 20px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .pkg-card.pkg-featured .pkg-footnote {
          border-top-color: rgba(37,99,235,0.15);
        }
        /* CTA button */
        .pkg-cta {
          display: block; text-align: center; margin-top: auto;
        }
        /* Mobile stacking */
        @media (max-width: 900px) {
          .pkg-grid { grid-template-columns: 1fr; }
          .pkg-card {
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.09);
          }
          .pkg-card:last-child { border-bottom: none; }
          .pkg-card.pkg-featured {
            border-left: none; border-right: none;
            border-top: 3px solid var(--blue);
            border-bottom: 1px solid rgba(37,99,235,0.2);
          }
          .pkg-card.pkg-featured .pkg-stripe { display: none; }
        }
      `}</style>
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">Consulting Tiers</div>
          <h2 className="s-title light">SEO Consulting Service Packages</h2>
          <p className="s-sub light">Flexible consulting solutions tailored to your business needs and objectives</p>
        </div>
        <div className="pkg-grid">
          {PACKAGES.map((p, i) => <PackageCard key={p.title} p={p} i={i} />)}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
          All consulting services are customized based on specific requirements, organizational structure, and business objectives.
        </p>
      </div>
    </section>
  )
}

function WhySection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section choose-section" style={{ background: 'var(--gray-1)' }}>
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Why SEOShouts</div>
          <h2 className="s-title">Why Choose<br />SEOShouts for <span className="blue">SEO Consulting</span></h2>
          <p className="s-sub">Strategic expertise and proven methodology that drives sustainable SEO success</p>
        </div>
        <div className="choose-grid">
          {WHY_CARDS.map((c, i) => <WhyCard key={c.title} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section faq-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">FAQ</div>
          <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          <p className="s-sub">Common questions about our SEO consulting services</p>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.q}</summary>
              <div className="faq-answer">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { ref, vis } = useReveal()
  return (
    <section className="cta-section-svc">
      <div className="cta-svc-inner">
        <div ref={ref} className={`reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">Get Started</div>
          <h2 className="s-title light" style={{ maxWidth: 880, marginBottom: '1.25rem' }}>
            Ready to Transform Your SEO Strategy and <span style={{ color: 'var(--blue)' }}>Results?</span>
          </h2>
          <p className="s-sub light" style={{ marginBottom: '3rem' }}>
            Accelerate your search engine optimization success with strategic guidance from SEO experts who understand both the technical complexities and business impact of effective SEO strategy in today&apos;s competitive digital landscape.{' '}
            <strong style={{ color: '#fff' }}>SEOShouts&apos; SEO consulting team</strong> combines deep technical expertise with strategic business acumen to help you develop and implement SEO strategies that drive sustainable organic growth and competitive advantage.
          </p>
        </div>
        <div className="cta-start-label">→ Begin Your Strategic SEO Transformation</div>
        <div className="cta-channels">
          <div className="cta-channel">
            <div className="cta-channel-icon">🎯</div>
            <div>
              <h4>Schedule Your Strategic SEO Consultation</h4>
              <p>Discuss your SEO challenges and business objectives with our strategic consulting experts</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📞</div>
            <div>
              <h4>Call: +91 8094888157</h4>
              <p>Speak directly with our SEO consulting team</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">📧</div>
            <div>
              <h4>Email: seoshouts@gmail.com</h4>
              <p>Outline your consulting needs, current challenges, and strategic objectives</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon">💬</div>
            <div>
              <h4>Request a Custom Consulting Proposal</h4>
              <p>Receive a tailored consulting plan designed for your specific requirements and objectives</p>
            </div>
          </div>
        </div>
        <div className="cta-actions">
          <a href="/contact/" aria-label="Schedule Strategic SEO Consultation with SEOShouts" className="btn-primary">
            🎯 Schedule Your Strategic SEO Consultation <Arrow />
          </a>
          <a href="tel:+918094888157" aria-label="Call SEOShouts for SEO consulting" className="btn-outline">
            📞 Call +91 8094888157
          </a>
        </div>
        <div className="cta-foot">
          <p className="cta-served"><strong>Professional SEO consulting services delivered to businesses across India and international markets</strong></p>
          <p><strong>Ready to achieve sustainable SEO success?</strong> Our experienced SEO consultants at SEOShouts combine strategic thinking with practical implementation expertise to help you achieve measurable search engine success. With 13+ years of SEO experience and deep understanding of Indian and international markets, we provide the strategic guidance necessary to maximize your SEO investments and achieve long-term competitive advantage.</p>
        </div>
      </div>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SeoConsultingPageContent() {
  return (
    <>
      <Crumbs />
      <PageHero />
      <LandscapeSection />
      <ServicesSection />
      <ProcessSection />
      <PackagesSection />
      <WhySection />
      <FAQSection />
      <CTASection />
    </>
  )
}
