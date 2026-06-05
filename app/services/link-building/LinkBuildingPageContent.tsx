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

// ─── SVG icon set ─────────────────────────────────────────────────────────────

const SvcIcon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'search')    return <svg {...p}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
  if (name === 'zap')       return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  if (name === 'code')      return <svg {...p}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  if (name === 'tag')       return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  if (name === 'shield')    return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  if (name === 'clipboard') return <svg {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" /></svg>
  if (name === 'bar-chart') return <svg {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  if (name === 'calendar')  return <svg {...p}><rect x="3" y="4" width="18" height="18" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  if (name === 'tool')      return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
  if (name === 'layers')    return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  if (name === 'cpu')       return <svg {...p}><rect x="4" y="4" width="16" height="16" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
  if (name === 'award')     return <svg {...p}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
  if (name === 'pin')       return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
  if (name === 'file')      return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
  if (name === 'users')     return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  if (name === 'link')      return <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
  return null
}

// ─── Hero data ────────────────────────────────────────────────────────────────


// ─── Section data ─────────────────────────────────────────────────────────────

const BAD_PRACTICES = [
  { icon: 'zap',    title: 'Buying links from "high DA" sites Google has already devalued', desc: 'These sites look impressive on paper but Google has long since identified and devalued them. You get impressive-looking reports and zero actual ranking impact.' },
  { icon: 'tag',    title: 'Guest posting on irrelevant blogs just to get a backlink',       desc: 'A fitness blog linking to your accounting firm sends zero topical authority signals to Google. Relevance is everything — these links are worse than useless.' },
  { icon: 'layers', title: 'Directory submissions to sites nobody visits',                   desc: 'Most web directories are worthless in 2025. They exist solely to sell links, Google knows it, and your profile looks spammy for including them.' },
  { icon: 'code',   title: 'Comment spam disguised as "engagement"',                        desc: "This isn't 2010, and it doesn't work. Comment links are almost universally no-follow and flag your site as associated with spam tactics." },
  { icon: 'shield', title: "Private blog networks that'll get you penalised",               desc: "PBNs are link schemes that violate Google's guidelines. They produce short-term results and long-term penalties when — not if — they're detected." },
]

const HOW_WE_BUILD = [
  {
    icon: 'file', num: '01',
    title: 'We Start with Content Worth Linking To',
    intro: "You can't build a house without a foundation, and you can't build quality links without quality content. Before we reach out to anyone, we make sure you have:",
    items: [
      'Original research or data that other sites want to reference',
      'Comprehensive guides that solve real problems',
      'Unique insights or case studies from your industry experience',
      'Visual content like infographics or tools that provide genuine value',
    ],
    out: "Nobody wants to link to mediocre content. We create (or help you create) content that naturally attracts links.",
  },
  {
    icon: 'search', num: '02',
    title: 'We Research Like Detectives, Not Robots',
    intro: "Most agencies blast the same email template to thousands of sites. We dig deep to find the exact right prospects for your industry.",
    items: [
      "We identify sites your competitors are getting links from (and find better ones they missed)",
      'We look for broken links on relevant sites that you could replace',
      'We find journalists and bloggers who regularly cover your industry',
      'We identify resource pages and link roundups where you actually belong',
      'We map out the real influencers in your space (not just people with high follower counts)',
    ],
    out: "We pitch to people who actually care about your industry and audience.",
  },
  {
    icon: 'users', num: '03',
    title: 'We Build Relationships, Not Just Links',
    intro: "Here's what most people get wrong: they think link building is about the links. It's not. It's about the relationships.",
    items: [
      'We research each prospect personally and customise our approach',
      'We lead with value, not requests',
      'We build genuine connections that lead to ongoing opportunities',
      'We follow up professionally without being annoying',
      'We maintain relationships even after getting initial coverage',
    ],
    out: "Which means you don't just get one-time links — you build a network of industry contacts who know and trust your brand.",
  },
  {
    icon: 'bar-chart', num: '04',
    title: 'We Focus on Relevance Over Vanity Metrics',
    intro: "Domain Authority is a nice number, but it doesn't pay your bills. We target links that actually drive business results.",
    items: [
      'Industry relevance and audience alignment',
      'Sites that actually send referral traffic',
      'Publications your customers and prospects actually read',
      'Links from sites that rank well for keywords you care about',
      'Editorial mentions that build brand awareness',
    ],
    out: "So you get links that improve rankings AND bring qualified visitors to your site.",
  },
  {
    icon: 'layers', num: '05',
    title: 'We Track What Actually Matters',
    intro: "We don't just report on how many links we built. We track whether those links are actually helping your business grow.",
    items: [
      'Ranking improvements for target keywords',
      'Referral traffic from new link sources',
      'Brand mention increases and sentiment',
      'Domain authority improvements over time',
      'Impact on overall organic visibility',
    ],
    out: "Because the goal isn't just more links — it's better business results.",
  },
]

const PROCESS_PHASES = [
  {
    num: '01', week: 'Month 1', timing: 'Days 1–30',
    title: 'Foundation and Strategy',
    sections: [
      {
        heading: 'Discovery',
        items: [
          'Deep dive into your industry, competitors, and link opportunities',
          'Content audit to identify what\'s worth promoting and what needs improvement',
          'Link profile analysis to understand your current authority and gaps',
        ],
      },
      {
        heading: 'Strategy',
        items: [
          'Target list development of high-value prospects',
          'Outreach strategy creation tailored to your industry',
          'Content gaps and linkable asset opportunities identified',
        ],
      },
    ],
  },
  {
    num: '02', week: 'Month 2–3', timing: 'Days 31–90',
    title: 'Strategic Outreach and Relationship Building',
    sections: [
      {
        heading: 'Outreach',
        items: [
          'Personalised outreach to carefully researched prospects',
          'Value-first pitches that focus on their audience\'s needs',
          'Follow-up sequences that maintain relationships',
        ],
      },
      {
        heading: 'Content & Relations',
        items: [
          'Content collaboration and co-creation opportunities',
          'Guest posting on truly relevant, high-quality sites',
          'Relationship building for ongoing coverage and placements',
        ],
      },
    ],
  },
  {
    num: '03', week: 'Month 4+', timing: 'Day 91+',
    title: 'Scaling and Optimisation',
    sections: [
      {
        heading: 'Scaling',
        items: [
          'Expanding outreach to new prospect categories',
          'Leveraging existing relationships for additional opportunities',
          'Creating new link-worthy content based on what\'s working',
        ],
      },
      {
        heading: 'Reporting',
        items: [
          'Monitoring and protecting your link profile',
          'Reporting on results and optimising strategy',
          'Ranking impact tracking for target keywords',
        ],
      },
    ],
  },
]

const LINK_TYPES = [
  { icon: 'file',      title: 'Editorial Links from Industry Publications', desc: 'Real mentions in legitimate industry publications where your audience actually spends time.' },
  { icon: 'clipboard', title: 'Resource Page Inclusions',                   desc: 'Getting featured on curated lists of industry tools, services, or resources.' },
  { icon: 'tool',      title: 'Broken Link Replacement',                    desc: 'Finding broken links on relevant sites and suggesting your content as a replacement.' },
  { icon: 'bar-chart', title: 'Data-Driven PR Links',                       desc: 'Using your business data or research to earn coverage in relevant publications.' },
  { icon: 'users',     title: 'Expert Roundup Participation',               desc: 'Contributing insights to industry roundups and collaborative content.' },
  { icon: 'tag',       title: 'Strategic Guest Content',                    desc: 'High-quality guest posts on sites that your target audience actually reads.' },
  { icon: 'pin',       title: 'Business Partnership Links',                 desc: 'Leveraging existing business relationships for natural link opportunities.' },
]

const DONT_DO = [
  { icon: 'shield',   title: "We won't buy links from link farms or PBNs",    body: 'These will hurt you more than help' },
  { icon: 'layers',   title: "We don't do mass directory submissions",          body: 'Most directories are worthless in 2025' },
  { icon: 'code',     title: "We won't spam comment sections",                  body: "This isn't 2010, and it doesn't work" },
  { icon: 'cpu',      title: "We don't use automated outreach tools",           body: 'Real relationships require real conversations' },
  { icon: 'calendar', title: "We won't promise overnight results",              body: 'Quality link building takes time and patience' },
  { icon: 'tag',      title: "We don't work with irrelevant sites",             body: "A casino link won't help your dental practice" },
]

const WHY_IT_WORKS = [
  { icon: 'pin',       title: 'We Understand the Indian Market',                    body: 'Working with Indian businesses for years, we know which international publications cover Indian companies and which local sites actually matter for SEO.' },
  { icon: 'users',     title: "We're Relationship-Focused, Not Transaction-Focused", body: 'Many of our best links come from relationships we built months or even years ago. We play the long game.' },
  { icon: 'link',      title: 'We Create Links That Last',                          body: "Our links don't disappear after a few months because they're based on genuine value, not paid placements." },
  { icon: 'search',    title: 'We Know What Google Actually Values',               body: "With 13+ years of experience, we understand the difference between links that help and links that hurt." },
  { icon: 'file',      title: "We're Transparent About Everything",                body: "You'll know exactly which sites we're targeting, what we're pitching, and how each outreach campaign is performing." },
]

const FAQS = [
  { q: 'How long does it take to see results from link building?',                  a: 'Quality link building typically takes 3-6 months to show significant ranking improvements. We focus on sustainable growth, not quick fixes that backfire.' },
  { q: 'How many links do you build per month?',                                    a: "We don't set arbitrary numbers. Some months we might earn 5 high-quality links, other months it might be 15. Quality always trumps quantity." },
  { q: 'Do you guarantee specific links or publications?',                          a: "We can't guarantee specific placements, but we do guarantee professional outreach and relationship building. The best publications can't be bought — they have to be earned." },
  { q: 'What if my industry is really competitive or boring?',                      a: "Every industry has stories to tell and value to provide. We've built links for everything from accounting firms to wedding planners. It's about finding the right angle." },
  { q: 'Can you help if my site has been penalised for bad links?',                 a: 'Yes, we include link cleanup and disavowal as part of our process when needed. Sometimes you need to clean up before you can build up.' },
  { q: 'Do you work with new websites or just established ones?',                   a: "We work with businesses at all stages. New sites need a different approach than established ones, but both can benefit from strategic link building." },
  { q: 'How do you avoid Google penalties?',                                        a: "By following Google's guidelines, focusing on genuine value creation, and never trying to manipulate rankings through artificial means." },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function BadPracticeCard({ p, i }: { p: typeof BAD_PRACTICES[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`feature-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="feature-icon"><SvcIcon name={p.icon} /></div>
      <strong>{p.title}</strong>
      <p>{p.desc}</p>
    </div>
  )
}

function LinkTypeCard({ lt, i }: { lt: typeof LINK_TYPES[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`feature-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="feature-icon"><SvcIcon name={lt.icon} /></div>
      <strong>{lt.title}</strong>
      <p>{lt.desc}</p>
    </div>
  )
}

function DontDoCard({ item, i }: { item: typeof DONT_DO[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`choose-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="choose-icon"><SvcIcon name={item.icon} size={22} /></div>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </div>
  )
}

function WhyCard({ c, i }: { c: typeof WHY_IT_WORKS[0]; i: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`choose-card reveal d${(i % 3) + 1}${vis ? ' visible' : ''}`}>
      <div className="choose-icon"><SvcIcon name={c.icon} size={22} /></div>
      <h3>{c.title}</h3>
      <p>{c.body}</p>
    </div>
  )
}

// ─── Sections ──────────────────────────────────────────────────────────────────

function Crumbs() {
  return (
    <div className="crumbs">
      <div className="crumbs-inner">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/services/">Services</a>
        <span className="sep">/</span>
        <span className="current">Link Building</span>
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
            <SvcIcon name="link" size={13} /> Link Building Specialists
          </div>
          <h1>Link Building Services by SEOShouts</h1>
          <p className="wd-hero-body">A startup founder once showed us his agency&apos;s link building report — <strong>500 backlinks in one month</strong>. Impressive? Until we found links from casino spam sites, Russian directories, and a cupcake recipe blog linking to their B2B software.</p>
          <p className="wd-hero-body">His rankings had <strong>actually dropped</strong>. That&apos;s not link building — that&apos;s link destruction. And it&apos;s more common than you think.</p>
          <p className="wd-hero-body">At <strong>SEOShouts</strong>, we&apos;ve learned that <strong>one high-quality, relevant backlink</strong> is worth more than 100 garbage links that&apos;ll eventually get your site penalised by Google.</p>
          <p className="wd-hero-body">We earn links the right way — through real relationships, compelling content, and <strong>13+ years of outreach expertise</strong> that gets placements on sites your competitors can&apos;t get into.</p>
          <div className="phero-ctas">
            <a href="/contact/" aria-label="Discuss your Link Building strategy" className="btn-primary">
              Let&apos;s Discuss Your Link Building Strategy <Arrow />
            </a>
            <a href="tel:+918094888157" aria-label="Call SEOShouts for Link Building consultation" className="btn-outline">
              📞 Call +91 8094888157
            </a>
          </div>
          <div className="wd-hero-trust">
            <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Every link we build is manually vetted — no PBNs, no spam, no shortcuts
          </div>
        </div>

        <HeroQuoteForm />
      </div>
    </section>
  )
}

function BrutalRealitySection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section features-section">
      <style>{`
        .lb-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 1.75rem; }
        .lb-compare-col { background: #fff; border: 1px solid var(--line); padding: 1.75rem 2rem; }
        .lb-compare-col-bad  { border-top: 3px solid var(--red); }
        .lb-compare-col-good { border-top: 3px solid var(--blue); }
        .lb-compare-head { display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--line); }
        .lb-compare-head-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--gray-1); }
        .lb-compare-head-icon.bad  { color: var(--red); }
        .lb-compare-head-icon.good { color: var(--blue); }
        .lb-compare-head-title { font-size: 0.9rem; font-weight: 700; color: var(--ink); }
        .lb-compare-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; }
        .lb-compare-list li { font-size: 0.875rem; line-height: 1.55; color: var(--ink-2); display: flex; align-items: flex-start; gap: 9px; }
        .lb-compare-list li::before { content: ''; width: 3px; height: 3px; min-width: 3px; margin-top: 7px; flex-shrink: 0; }
        .lb-compare-col-bad  .lb-compare-list li::before { background: var(--red); }
        .lb-compare-col-good .lb-compare-list li::before { background: var(--blue); }
        @media (max-width: 640px) {
          .lb-compare { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">The Industry Problem</div>
          <h2 className="s-title">The Brutal Reality About Most Link Building Services</h2>
        </div>
        <p className="why-lede">
          I&apos;ve been doing this for 13+ years, and I&apos;ll tell you something most agencies won&apos;t:{' '}
          <strong style={{ color: 'var(--red)' }}>95% of &ldquo;link building&rdquo; services are just sophisticated spam operations.</strong>
        </p>
        <div className="why-substat-label">Here&apos;s what passes for &ldquo;link building&rdquo; these days:</div>

        <div className="lb-compare">
          {/* What Others Do */}
          <div className="lb-compare-col lb-compare-col-bad">
            <div className="lb-compare-head">
              <div className="lb-compare-head-icon bad"><SvcIcon name="shield" size={16} /></div>
              <span className="lb-compare-head-title bad">What Others Do</span>
            </div>
            <ul className="lb-compare-list">
              <li>Buying links from &ldquo;high DA&rdquo; sites that Google has already devalued</li>
              <li>Guest posting on irrelevant blogs just to get a backlink</li>
              <li>Directory submissions to sites nobody visits</li>
              <li>Comment spam disguised as &ldquo;engagement&rdquo;</li>
              <li>Private blog networks that&apos;ll get you penalised</li>
            </ul>
          </div>
          {/* What We Do */}
          <div className="lb-compare-col lb-compare-col-good">
            <div className="lb-compare-head">
              <div className="lb-compare-head-icon good"><SvcIcon name="award" size={16} /></div>
              <span className="lb-compare-head-title good">What We Do</span>
            </div>
            <ul className="lb-compare-list">
              <li>Build relationships with real industry publications</li>
              <li>Create content worth linking to naturally</li>
              <li>Target sites your customers actually read</li>
              <li>Focus on relevance over vanity metrics</li>
              <li>Earn links through genuine value creation</li>
            </ul>
          </div>
        </div>

        {/* Result callout — bottom-line quote style */}
        <div style={{ marginTop: '2rem', borderLeft: '3px solid var(--blue)', paddingLeft: '1.75rem' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '0.75rem' }}>The Bottom Line</span>
          <p style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>The result?</strong> Temporary ranking boosts followed by devastating penalties when Google&apos;s algorithms catch up.
          </p>
          <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>We do the opposite.</strong> We build relationships, create value, and earn links that search engines actually respect.
          </p>
        </div>
      </div>
    </section>
  )
}

function HowWeBuildSection() {
  const { ref, vis } = useReveal()
  const [active, setActive] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  function select(i: number) {
    if (i === active) return
    setActive(i)
    setPanelKey(k => k + 1)
  }

  const svc = HOW_WE_BUILD[active]

  return (
    <section className="section svc-section">
      <style>{`
        @keyframes lbSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .lb-explorer {
          display: flex; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09); min-height: 480px;
        }
        .lb-tabs {
          width: 300px; flex-shrink: 0;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.09);
          display: flex; flex-direction: column;
        }
        .lb-tab {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 15px 18px; cursor: pointer; border: none;
          background: transparent; text-align: left;
          color: rgba(255,255,255,0.5);
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          border-left: 3px solid transparent;
        }
        .lb-tab:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.82); }
        .lb-tab.lb-active { background: rgba(37,99,235,0.14); color: #fff; border-left-color: var(--blue); }
        .lb-tab-icon {
          width: 34px; height: 34px; flex-shrink: 0; margin-top: 1px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07);
          transition: background 0.18s, color 0.18s;
        }
        .lb-tab.lb-active .lb-tab-icon { background: rgba(37,99,235,0.28); color: var(--blue); }
        .lb-tab-body { flex: 1; min-width: 0; }
        .lb-tab-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); opacity: 0.85; margin-bottom: 3px; }
        .lb-tab.lb-active .lb-tab-num { opacity: 1; }
        .lb-tab-label { font-size: 0.9rem; font-weight: 600; line-height: 1.35; }
        .lb-tab-arr { flex-shrink: 0; align-self: center; opacity: 0; transition: opacity 0.18s; color: var(--blue); }
        .lb-tab.lb-active .lb-tab-arr { opacity: 1; }
        .lb-panel { flex: 1; padding: 34px 38px; overflow-y: auto; }
        .lb-panel-anim { animation: lbSlideIn 0.3s cubic-bezier(0.2,0.6,0.4,1) both; }
        .lb-panel-head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .lb-panel-bigicon {
          width: 50px; height: 50px; flex-shrink: 0;
          background: rgba(37,99,235,0.18); border: 1px solid rgba(37,99,235,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--blue);
        }
        .lb-panel-meta { flex: 1; }
        .lb-panel-num { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); margin-bottom: 4px; }
        .lb-panel-h3 { font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.3; margin: 0; }
        .lb-panel-intro { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 20px; line-height: 1.65; }
        .lb-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
        .lb-panel-list li {
          font-size: 0.875rem; color: rgba(255,255,255,0.68);
          line-height: 1.45; display: flex; align-items: flex-start; gap: 8px;
        }
        .lb-panel-list li::before {
          content: ''; width: 4px; height: 4px; min-width: 4px;
          background: var(--blue); margin-top: 7px;
        }
        .lb-panel-outcome { margin-top: 20px; background: rgba(37,99,235,0.1); border-left: 3px solid var(--blue); padding: 11px 16px; }
        .lb-panel-outcome p { font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.78); margin: 0; font-style: italic; }
        @media (max-width: 900px) {
          .lb-explorer { flex-direction: column; min-height: unset; }
          .lb-tabs { width: 100%; flex-direction: row; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.09); overflow-x: auto; scrollbar-width: none; }
          .lb-tabs::-webkit-scrollbar { display: none; }
          .lb-tab { flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 0; padding: 14px 6px; min-width: 50px; border-left: none; border-bottom: 3px solid transparent; }
          .lb-tab.lb-active { border-bottom-color: var(--blue); border-left-color: transparent; }
          .lb-tab-body { display: none; }
          .lb-tab-arr { display: none; }
          .lb-tab-icon { width: 28px; height: 28px; margin-top: 0; }
          .lb-panel { padding: 20px 16px; }
          .lb-panel-bigicon { width: 38px; height: 38px; }
          .lb-panel-h3 { font-size: 1rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow light">Our Methodology</div>
          <h2 className="s-title light">How We Actually Build Links That Matter</h2>
          <p className="s-sub light">Five disciplines that separate genuine authority building from sophisticated spam</p>
        </div>

        <div className="lb-explorer">
          <div className="lb-tabs" role="tablist" aria-label="Link Building Methodology">
            {HOW_WE_BUILD.map((s, i) => (
              <button
                key={s.num}
                role="tab"
                aria-selected={active === i}
                aria-controls="lb-panel"
                className={`lb-tab${active === i ? ' lb-active' : ''}`}
                onClick={() => select(i)}
              >
                <div className="lb-tab-icon"><SvcIcon name={s.icon} /></div>
                <div className="lb-tab-body">
                  <div className="lb-tab-num">STEP / {s.num}</div>
                  <div className="lb-tab-label">{s.title}</div>
                </div>
                <span className="lb-tab-arr"><Arrow /></span>
              </button>
            ))}
          </div>

          <div className="lb-panel" id="lb-panel" role="tabpanel">
            <div key={panelKey} className="lb-panel-anim">
              <div className="lb-panel-head">
                <div className="lb-panel-bigicon"><SvcIcon name={svc.icon} size={24} /></div>
                <div className="lb-panel-meta">
                  <div className="lb-panel-num">STEP / {svc.num}</div>
                  <h3 className="lb-panel-h3">{svc.title}</h3>
                </div>
              </div>
              <p className="lb-panel-intro">{svc.intro}</p>
              <ul className="lb-panel-list">
                {svc.items.map(item => <li key={item}>{item}</li>)}
              </ul>
              <div className="lb-panel-outcome"><p>{svc.out}</p></div>
            </div>
          </div>
        </div>

        <div className="svc-cta">
          <a href="/contact/" aria-label="Get started with link building" className="btn-primary">
            Let&apos;s Discuss Your Link Building Strategy <Arrow />
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
        @keyframes lb-pslabIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .lb-pslab-track { display: grid; height: 360px; border: 1px solid rgba(0,0,0,0.13); transition: grid-template-columns 0.48s cubic-bezier(0.4,0,0.2,1); }
        .lb-pslab-slab { position: relative; overflow: hidden; cursor: pointer; border-right: 1px solid rgba(0,0,0,0.1); background: var(--ink); display: flex; flex-direction: column; transition: background 0.25s; }
        .lb-pslab-slab:last-child { border-right: none; }
        .lb-pslab-slab:hover:not(.lb-pslab-on) { background: rgba(14,18,24,0.82); }
        .lb-pslab-slab.lb-pslab-on { cursor: default; background: #fff; }
        .lb-pslab-stripe { height: 3px; flex-shrink: 0; background: rgba(255,255,255,0.06); transition: background 0.3s; }
        .lb-pslab-slab.lb-pslab-on .lb-pslab-stripe { background: var(--blue); }
        .lb-pslab-fold { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 22px 0 20px; gap: 10px; }
        .lb-pslab-slab.lb-pslab-on .lb-pslab-fold { display: none; }
        .lb-pslab-fold-num { font-size: 1.5rem; font-weight: 900; line-height: 1; letter-spacing: -0.04em; color: rgba(255,255,255,0.65); transition: color 0.2s; }
        .lb-pslab-slab:hover:not(.lb-pslab-on) .lb-pslab-fold-num { color: rgba(255,255,255,0.9); }
        .lb-pslab-fold-line { width: 1px; flex: 1; background: rgba(255,255,255,0.12); }
        .lb-pslab-fold-tag { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.58); white-space: nowrap; transition: color 0.2s; line-height: 1; }
        .lb-pslab-slab:hover:not(.lb-pslab-on) .lb-pslab-fold-tag { color: rgba(255,255,255,0.85); }
        .lb-pslab-fold-time { font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.42); letter-spacing: 0.04em; writing-mode: vertical-rl; transform: rotate(180deg); transition: color 0.2s; }
        .lb-pslab-slab:hover:not(.lb-pslab-on) .lb-pslab-fold-time { color: rgba(255,255,255,0.66); }
        .lb-pslab-open { display: none; padding: 18px 26px 16px; flex: 1; overflow: hidden; flex-direction: column; }
        .lb-pslab-slab.lb-pslab-on .lb-pslab-open { display: flex; }
        .lb-pslab-open-anim { animation: lb-pslabIn 0.36s 0.22s cubic-bezier(0.2,0.6,0.4,1) both; display: flex; flex-direction: column; height: 100%; }
        .lb-pslab-hd { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.07); flex-shrink: 0; }
        .lb-pslab-hd-ghost { font-size: 2.8rem; font-weight: 900; line-height: 0.8; color: rgba(37,99,235,0.07); letter-spacing: -0.06em; flex-shrink: 0; user-select: none; pointer-events: none; }
        .lb-pslab-hd-chips { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
        .lb-pslab-hd-chip { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); background: rgba(37,99,235,0.08); padding: 3px 8px; border: 1px solid rgba(37,99,235,0.18); }
        .lb-pslab-hd-time { font-size: 0.875rem; color: rgba(0,0,0,0.28); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em; }
        .lb-pslab-hd-title { font-size: 1.04rem; font-weight: 700; color: var(--ink); line-height: 1.28; margin: 0; }
        .lb-pslab-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; align-content: start; }
        .lb-pslab-sec-hd { font-size: 0.875rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--blue); margin-bottom: 11px; padding-bottom: 7px; border-bottom: 1px solid rgba(37,99,235,0.12); }
        .lb-pslab-sec-ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .lb-pslab-sec-ul li { font-size: 0.875rem; color: #3a4a5c; line-height: 1.44; display: flex; align-items: flex-start; gap: 9px; }
        .lb-pslab-sec-ul li::before { content: ''; width: 3px; height: 3px; min-width: 3px; background: var(--blue); margin-top: 7px; flex-shrink: 0; }
        .lb-pslab-nav { display: flex; justify-content: center; gap: 7px; margin-top: 14px; }
        .lb-pslab-nav-dot { width: 24px; height: 3px; padding: 0; border: none; cursor: pointer; background: rgba(0,0,0,0.1); transition: background 0.2s, width 0.25s; }
        .lb-pslab-nav-dot.lb-pslab-nav-on { background: var(--blue); width: 42px; }
        @media (max-width: 720px) {
          .lb-pslab-track { grid-template-columns: 1fr !important; height: auto; }
          .lb-pslab-slab { flex-direction: row; min-height: 52px; }
          .lb-pslab-slab.lb-pslab-on { flex-direction: column; }
          .lb-pslab-stripe { width: 4px; height: auto; flex-shrink: 0; }
          .lb-pslab-slab.lb-pslab-on .lb-pslab-stripe { width: 100%; height: 3px; }
          .lb-pslab-fold { flex-direction: row; padding: 0 14px; gap: 10px; }
          .lb-pslab-fold-tag, .lb-pslab-fold-time { writing-mode: horizontal-tb; transform: none; }
          .lb-pslab-fold-line { width: auto; height: 1px; flex: 1; }
          .lb-pslab-open { padding: 18px 16px; }
          .lb-pslab-sections { grid-template-columns: 1fr; gap: 14px; }
          .lb-pslab-hd-ghost { font-size: 2.2rem; }
          .lb-pslab-hd-title { font-size: 0.92rem; }
        }
      `}</style>

      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Our Process</div>
          <h2 className="s-title">Our Link Building Process <span className="blue">(How We Actually Do It)</span></h2>
          <p className="s-sub">A proven three-phase approach that builds compounding authority over time</p>
        </div>

        <div className="lb-pslab-track" style={{ gridTemplateColumns: gridCols }}>
          {PROCESS_PHASES.map((p, i) => (
            <div
              key={p.num}
              className={`lb-pslab-slab${active === i ? ' lb-pslab-on' : ''}`}
              onClick={() => selectPhase(i)}
              role="button"
              tabIndex={active === i ? -1 : 0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPhase(i) } }}
              aria-expanded={active === i}
              aria-label={active === i ? undefined : `Open ${p.week}: ${p.title}`}
            >
              <div className="lb-pslab-stripe" />
              <div className="lb-pslab-fold">
                <span className="lb-pslab-fold-num">{p.num}</span>
                <div className="lb-pslab-fold-line" aria-hidden="true" />
                <span className="lb-pslab-fold-tag">{p.week}</span>
                <span className="lb-pslab-fold-time">{p.timing}</span>
              </div>
              <div className="lb-pslab-open">
                <div key={panelKey} className="lb-pslab-open-anim">
                  <div className="lb-pslab-hd">
                    <div className="lb-pslab-hd-ghost" aria-hidden="true">{p.num}</div>
                    <div>
                      <div className="lb-pslab-hd-chips">
                        <span className="lb-pslab-hd-chip">{p.week}</span>
                        <span className="lb-pslab-hd-time">{p.timing}</span>
                      </div>
                      <h3 className="lb-pslab-hd-title">{p.title}</h3>
                    </div>
                  </div>
                  <div className="lb-pslab-sections">
                    {p.sections.map((sec) => (
                      <div key={sec.heading}>
                        <div className="lb-pslab-sec-hd">{sec.heading}</div>
                        <ul className="lb-pslab-sec-ul">
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

        <div className="lb-pslab-nav" role="tablist" aria-label="Process phases navigation">
          {PROCESS_PHASES.map((p, i) => (
            <button
              key={p.num}
              role="tab"
              aria-selected={active === i}
              className={`lb-pslab-nav-dot${active === i ? ' lb-pslab-nav-on' : ''}`}
              onClick={() => selectPhase(i)}
              aria-label={p.week}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function LinkTypesSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section cases-section" style={{ background: '#fff' }}>
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">What We Build</div>
          <h2 className="s-title">Types of Links We Actually Build</h2>
        </div>
        <div className="features-grid">
          {LINK_TYPES.map((lt, i) => <LinkTypeCard key={lt.title} lt={lt} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function DontDoSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section choose-section">
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Our Standards</div>
          <h2 className="s-title">What We DON&apos;T Do <span className="blue">(The Link Building Red Flags)</span></h2>
        </div>
        <div className="choose-grid">
          {DONT_DO.map((item, i) => <DontDoCard key={item.title} item={item} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function WhyItWorksSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="section-container">
        <div ref={ref} className={`s-header reveal${vis ? ' visible' : ''}`}>
          <div className="eyebrow">Why It Works</div>
          <h2 className="s-title">Why Our Link Building Actually Works</h2>
        </div>
        <div className="choose-grid">
          {WHY_IT_WORKS.map((c, i) => <WhyCard key={c.title} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function WhyChooseSection() {
  const { ref, vis } = useReveal()
  return (
    <section className="section guarantee-section">
      <div className="section-container">
        <div ref={ref} className={`guarantee-card reveal${vis ? ' visible' : ''}`}>
          <div className="guarantee-stamp">The SEOShouts Standard</div>
          <h2>Why Choose SEOShouts for Link Building?</h2>
          <h3>We&apos;re Not Just Another Link Building Agency</h3>
          <p className="gtext">
            We&apos;re your partners in building sustainable authority. Here&apos;s what makes us different from every other agency promising high-quality backlinks:
          </p>
          <div className="guarantee-sub-label">What We Promise</div>
          <div className="guarantee-promise">
            <ul>
              <li><strong>Quality Over Quantity</strong> — We earn 5–15 high-quality links per month rather than hundreds of worthless ones</li>
              <li><strong>Relationship-First</strong> — We build genuine relationships that lead to ongoing opportunities, not one-time transactions</li>
            </ul>
            <ul>
              <li><strong>Penalty-Proof</strong> — 13+ years of white-hat techniques that strengthen your authority, never risk it</li>
              <li><strong>Results-Driven</strong> — We track rankings, traffic, and business impact — not just link counts</li>
            </ul>
          </div>
          <a href="/contact/" aria-label="Get free Link Building audit from SEOShouts" className="btn-primary">
            Get Your Free Link Building Audit <Arrow />
          </a>
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
          <div className="eyebrow light">Take the Next Step</div>
          <h2 className="s-title light" style={{ maxWidth: 880, marginBottom: '1.25rem' }}>
            Ready to Build Links That Actually <span style={{ color: 'var(--blue)' }}>Strengthen Your Authority?</span>
          </h2>
          <p className="s-sub light" style={{ marginBottom: '3rem' }}>
            Don&apos;t let another day pass while competitors build better backlink profiles.{' '}
            <strong style={{ color: '#fff' }}>SEOShouts&apos; link building experts</strong> are ready to develop a custom strategy that earns high-quality backlinks and boosts your search rankings across India.
          </p>
        </div>
        <div className="cta-start-label">→ Get Started Today</div>
        <div className="cta-channels">
          <div className="cta-channel">
            <div className="cta-channel-icon"><SvcIcon name="award" size={20} /></div>
            <div>
              <h4>Get Your Free Link Building Audit</h4>
              <p>Discover exactly what&apos;s holding back your backlink profile</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon"><SvcIcon name="pin" size={20} /></div>
            <div>
              <h4>Call: +91 8094888157</h4>
              <p>Speak directly with our link building team in Udaipur, Rajasthan</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon"><SvcIcon name="file" size={20} /></div>
            <div>
              <h4>Email: seoshouts@gmail.com</h4>
              <p>Discuss your link building goals with our specialists</p>
            </div>
          </div>
          <div className="cta-channel">
            <div className="cta-channel-icon"><SvcIcon name="users" size={20} /></div>
            <div>
              <h4>Schedule a Strategy Consultation</h4>
              <p>Get a custom link building roadmap for your business</p>
            </div>
          </div>
        </div>
        <div className="cta-actions">
          <a href="/contact/" aria-label="Get free Link Building audit from SEOShouts" className="btn-primary">
            Get Your Free Link Building Audit
          </a>
          <a href="tel:+918094888157" aria-label="Call SEOShouts for Link Building consultation" className="btn-outline">
            Call +91 8094888157
          </a>
        </div>
        <div className="cta-foot">
          <p className="cta-served"><strong>Serving businesses across India</strong></p>
          <p><strong>Still have questions?</strong> Our link building specialists at SEOShouts are standing by to discuss your specific situation and goals. With 13+ years of SEO experience and deep understanding of Indian markets, we&apos;re ready to help your business build the authority it deserves.</p>
        </div>
      </div>
    </section>
  )
}

export default function LinkBuildingPageContent() {
  return (
    <>
      <Crumbs />
      <PageHero />
      <BrutalRealitySection />
      <HowWeBuildSection />
      <ProcessSection />
      <LinkTypesSection />
      <DontDoSection />
      <WhyItWorksSection />
      <WhyChooseSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
