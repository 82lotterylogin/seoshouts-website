import { Metadata } from 'next'
import { getDatabase } from '../lib/database'
import ShapeGrid from '../components/ShapeGrid'

export const metadata: Metadata = {
  title: 'Rohit Sharma — Founder & CEO | The Story Behind SEOShouts',
  description: 'Meet Rohit Sharma, the visionary founder and CEO behind SEOShouts. Discover his 13+ year journey from SEO trainee to industry leader, building scalable SEO solutions for businesses worldwide.',
  keywords: 'Rohit Sharma founder, SEOShouts CEO, SEO industry leader, entrepreneur story, digital marketing founder, SEO agency founder, India SEO expert',
  authors: [{ name: 'Rohit Sharma' }],
  creator: 'Rohit Sharma',
  publisher: 'SEO Shouts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: '/founder/',
  },
  openGraph: {
    title: 'Rohit Sharma — Founder & CEO | The Story Behind SEOShouts',
    description: 'Meet Rohit Sharma, the visionary founder and CEO behind SEOShouts. Discover his 13+ year journey from SEO trainee to industry leader.',
    url: '/founder/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: '/images/team/rohit-sharma.jpg',
        width: 1200,
        height: 630,
        alt: 'Rohit Sharma — Founder & CEO of SEOShouts',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohit Sharma — Founder & CEO | The Story Behind SEOShouts',
    description: 'Meet Rohit Sharma, the visionary founder and CEO behind SEOShouts. Discover his 13+ year journey from SEO trainee to industry leader.',
    images: ['/images/team/rohit-sharma.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const FD_CSS = `
/* ── Founder (fd-) ───────────────────────────────────────── */
@keyframes fd-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
@keyframes fd-rise { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform: translateY(0); } }
@keyframes fd-fade { from { opacity:0; } to { opacity:1; } }

.fd-page { background: var(--white); overflow-x: clip; }

/* Shared section scaffold */
.fd-section { padding: 5.5rem 2rem; position: relative; }
.fd-section.fd-dark { background: var(--ink); }
.fd-section.fd-gray { background: var(--gray-1); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.fd-section.fd-white { background: var(--white); }
.fd-container { max-width: 1180px; margin: 0 auto; position: relative; z-index: 2; }

/* Grid overlay for dark sections */
.fd-grid-bg { position: absolute; inset: 0; pointer-events: none; opacity: 0.4; background-image: linear-gradient(rgba(37,99,235,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.18) 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 75% 80% at 50% 35%, #000 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse 75% 80% at 50% 35%, #000 30%, transparent 80%); }

/* Section header */
.fd-s-head { max-width: 760px; margin-bottom: 3rem; }
.fd-s-head.fd-center { margin-left: auto; margin-right: auto; text-align: center; }
.fd-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--blue); margin-bottom: 1.1rem; }
.fd-eyebrow::before { content: ''; width: 24px; height: 2px; background: var(--blue); }
.fd-dark .fd-eyebrow { color: var(--blue-light); }
.fd-dark .fd-eyebrow::before { background: var(--blue-light); }
.fd-center .fd-eyebrow { justify-content: center; }
.fd-s-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.9rem, 3.6vw, 2.9rem); font-weight: 700; color: var(--ink); line-height: 1.1; letter-spacing: -0.03em; }
.fd-dark .fd-s-title { color: #fff; }
.fd-s-title .fd-blue { color: var(--blue); }
.fd-dark .fd-s-title .fd-blue { color: var(--blue-light); }
.fd-s-sub { font-size: 1.1rem; line-height: 1.7; color: var(--gray-5); margin-top: 1.1rem; }
.fd-dark .fd-s-sub { color: rgba(255,255,255,0.62); }

/* ── HERO ── */
.fd-hero { background: var(--ink); position: relative; overflow: hidden; padding: 6rem 2rem 5rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
.fd-hero-canvas { position: absolute; inset: 0; z-index: 0; pointer-events: all; overflow: hidden; }
.fd-hero-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(ellipse 68% 78% at 58% 42%, transparent 22%, rgba(8,9,10,0.78) 100%); }
.fd-hero-inner { max-width: 1180px; margin: 0 auto; position: relative; z-index: 2; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 4rem; align-items: center; pointer-events: none; }
.fd-hero-inner a, .fd-hero-inner input, .fd-hero-inner button { pointer-events: auto; }
.fd-badge { display: inline-flex; align-items: center; gap: 9px; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue-light); border: 1px solid rgba(37,99,235,0.4); background: rgba(37,99,235,0.08); padding: 7px 14px; margin-bottom: 1.75rem; animation: fd-rise 0.6s ease both; }
.fd-badge .fd-pulse { width: 6px; height: 6px; background: var(--blue-light); border-radius: 50%; animation: fd-blink 1.8s infinite; }
.fd-hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.6rem, 6vw, 4.6rem); font-weight: 700; color: #fff; line-height: 1.02; letter-spacing: -0.04em; margin-bottom: 1.25rem; animation: fd-rise 0.6s ease 0.08s both; }
.fd-hero h1 .fd-name { display: block; color: var(--blue-light); }
.fd-hero-sub { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.2rem, 2.2vw, 1.7rem); font-weight: 500; color: rgba(255,255,255,0.82); letter-spacing: -0.02em; margin-bottom: 1.5rem; animation: fd-rise 0.6s ease 0.16s both; }
.fd-hero-lead { font-size: 1.08rem; line-height: 1.72; color: rgba(255,255,255,0.6); max-width: 620px; margin-bottom: 2.25rem; animation: fd-rise 0.6s ease 0.24s both; }

.fd-metrics { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); margin-bottom: 2.25rem; animation: fd-rise 0.6s ease 0.32s both; }
.fd-metric { padding: 1.1rem 1rem; border-right: 1px solid rgba(255,255,255,0.08); }
.fd-metric:last-child { border-right: none; }
.fd-metric-num { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--blue-light); letter-spacing: -0.03em; line-height: 1; }
.fd-metric-label { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-4); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 7px; line-height: 1.4; }

.fd-hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; animation: fd-rise 0.6s ease 0.4s both; }
.fd-btn-blue { display: inline-flex; align-items: center; gap: 9px; background: var(--blue); color: #fff; font-size: 0.92rem; font-weight: 600; padding: 14px 26px; border: 1px solid var(--blue); transition: background 0.2s, transform 0.2s; }
.fd-btn-blue:hover { background: var(--blue-dark); transform: translateY(-2px); }
.fd-btn-ghost { display: inline-flex; align-items: center; gap: 9px; background: transparent; color: #fff; font-size: 0.92rem; font-weight: 600; padding: 14px 26px; border: 1px solid rgba(255,255,255,0.25); transition: border-color 0.2s, background 0.2s; }
.fd-btn-ghost:hover { border-color: var(--blue-light); background: rgba(37,99,235,0.1); }

/* Portrait */
.fd-portrait-wrap { position: relative; justify-self: end; animation: fd-fade 0.8s ease 0.3s both; }
.fd-portrait { position: relative; width: 380px; max-width: 100%; aspect-ratio: 1/1; border: 1px solid rgba(255,255,255,0.14); overflow: hidden; background: var(--ink-3); }
.fd-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; }
.fd-portrait::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 -80px 80px -40px rgba(8,9,10,0.85); pointer-events: none; }
.fd-float { position: absolute; background: var(--ink-2); border: 1px solid rgba(255,255,255,0.12); padding: 13px 18px; z-index: 3; }
.fd-float.fd-float-tr { top: 26px; right: -22px; border-left: 3px solid var(--blue); }
.fd-float.fd-float-bl { left: -22px; bottom: 26px; display: flex; align-items: center; gap: 10px; }
.fd-float-num { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--blue-light); line-height: 1; }
.fd-float-k { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray-4); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 5px; }
.fd-float-dot { width: 9px; height: 9px; background: var(--blue-light); border-radius: 50%; animation: fd-blink 1.8s infinite; flex-shrink: 0; }
.fd-float-live { font-size: 0.78rem; font-weight: 600; color: #fff; }

/* ── STORY ── */
.fd-story-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3.5rem; align-items: start; }
.fd-story-h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.55rem; font-weight: 700; color: var(--ink); letter-spacing: -0.025em; margin-bottom: 1.25rem; }
.fd-story-p { font-size: 1.04rem; line-height: 1.78; color: var(--gray-5); margin-bottom: 1.25rem; }
.fd-story-p:last-child { margin-bottom: 0; }
.fd-snapshot { background: var(--ink); padding: 2rem; border-left: 3px solid var(--blue); }
.fd-snapshot h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--blue-light); margin-bottom: 1.5rem; }
.fd-snap-item { display: flex; gap: 12px; padding: 0.95rem 0; border-top: 1px solid rgba(255,255,255,0.08); }
.fd-snap-item:first-of-type { border-top: none; padding-top: 0; }
.fd-snap-item:last-of-type { padding-bottom: 0; }
.fd-snap-mk { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; color: var(--blue-light); letter-spacing: 0.06em; text-transform: uppercase; flex-shrink: 0; width: 92px; padding-top: 2px; }
.fd-snap-v { font-size: 0.92rem; line-height: 1.6; color: rgba(255,255,255,0.78); }

/* ── CARD GRID (expertise / values) ── */
.fd-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid var(--line); background: var(--line); }
.fd-cards.fd-cards-2 { grid-template-columns: repeat(2, 1fr); }
.fd-card { background: var(--white); padding: 2.25rem; position: relative; transition: background 0.25s; }
.fd-card::after { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 0; background: var(--blue); transition: height 0.3s ease; }
.fd-card:hover { background: var(--gray-1); }
.fd-card:hover::after { height: 100%; }
.fd-card-ico { width: 46px; height: 46px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 1.25rem; }
.fd-card-ico svg { width: 22px; height: 22px; }
.fd-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.18rem; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; margin-bottom: 0.75rem; }
.fd-card p { font-size: 0.95rem; line-height: 1.65; color: var(--gray-5); }

/* ── AI WORKFLOW ── */
.fd-ai-meta { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 2.5rem; padding-bottom: 2.5rem; margin-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.fd-ai-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--blue-light); margin-bottom: 1rem; }
.fd-tags { display: flex; flex-wrap: wrap; gap: 9px; }
.fd-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; font-weight: 500; color: #fff; background: rgba(37,99,235,0.18); border: 1px solid rgba(37,99,235,0.4); padding: 6px 13px; }
.fd-ai-apps { font-size: 1rem; line-height: 1.72; color: rgba(255,255,255,0.7); }
.fd-workflow-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; letter-spacing: -0.025em; text-align: center; margin-bottom: 2.25rem; }
.fd-steps { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid rgba(255,255,255,0.1); }
.fd-step { padding: 2rem 1.5rem; border-right: 1px solid rgba(255,255,255,0.08); position: relative; }
.fd-step:last-child { border-right: none; }
.fd-step-num { width: 44px; height: 44px; background: var(--blue); color: #fff; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.1rem; }
.fd-step h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.fd-step p { font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.6); }

/* ── TIMELINE ── */
.fd-timeline { position: relative; padding-left: 2.25rem; }
.fd-timeline::before { content: ''; position: absolute; left: 6px; top: 6px; bottom: 6px; width: 2px; background: var(--line); }
.fd-tl-item { position: relative; padding-bottom: 2.25rem; }
.fd-tl-item:last-child { padding-bottom: 0; }
.fd-tl-item::before { content: ''; position: absolute; left: -2.25rem; top: 4px; width: 14px; height: 14px; background: var(--white); border: 3px solid var(--blue); transform: translateX(-1px); }
.fd-tl-card { background: var(--white); border: 1px solid var(--line); padding: 1.5rem 1.75rem; transition: border-color 0.2s, transform 0.2s; }
.fd-tl-card:hover { border-color: var(--blue); transform: translateX(4px); }
.fd-tl-year { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 600; color: var(--blue); letter-spacing: 0.06em; margin-bottom: 0.6rem; }
.fd-tl-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.12rem; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; margin-bottom: 0.6rem; }
.fd-tl-card p { font-size: 0.95rem; line-height: 1.65; color: var(--gray-5); }

/* ── SKILLS ── */
.fd-skills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid var(--line); background: var(--line); }
.fd-skill-group { background: var(--white); padding: 1.75rem; }
.fd-skill-group h3 { font-family: 'Space Grotesk', sans-serif; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--line); }
.fd-skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.fd-skill-tag { font-size: 0.8rem; font-weight: 500; color: var(--ink-3); background: var(--gray-1); border: 1px solid var(--line); padding: 5px 11px; transition: background 0.18s, color 0.18s, border-color 0.18s; }
.fd-skill-group:hover .fd-skill-tag { border-color: var(--blue-mid); }
.fd-skill-tag:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

/* ── EDUCATION / HIGHLIGHTS ── */
.fd-edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
.fd-edu-h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.7rem; font-weight: 700; color: var(--ink); letter-spacing: -0.025em; margin-bottom: 1.5rem; }
.fd-edu-card { background: var(--white); border: 1px solid var(--line); padding: 2rem; height: calc(100% - 3.2rem); }
.fd-edu-inner { display: flex; gap: 1.25rem; align-items: flex-start; }
.fd-edu-ico { width: 52px; height: 52px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.fd-edu-ico svg { width: 26px; height: 26px; }
.fd-edu-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.18rem; font-weight: 700; color: var(--ink); margin-bottom: 0.4rem; }
.fd-edu-card .fd-edu-org { font-size: 0.95rem; color: var(--gray-5); margin-bottom: 0.2rem; }
.fd-edu-card .fd-edu-yr { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--blue); }
.fd-hl-item { display: flex; gap: 13px; padding: 1rem 0; border-top: 1px solid var(--line); }
.fd-hl-item:first-child { border-top: none; padding-top: 0; }
.fd-hl-item:last-child { padding-bottom: 0; }
.fd-hl-bullet { width: 7px; height: 7px; background: var(--blue); margin-top: 8px; flex-shrink: 0; }
.fd-hl-item p { font-size: 0.97rem; line-height: 1.6; color: var(--gray-5); }

/* ── CTA ── */
.fd-cta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid rgba(255,255,255,0.1); margin: 2.75rem 0; }
.fd-contact-card { padding: 2.25rem 1.75rem; border-right: 1px solid rgba(255,255,255,0.08); text-align: center; transition: background 0.2s; }
.fd-contact-card:last-child { border-right: none; }
.fd-contact-card:hover { background: rgba(37,99,235,0.1); }
.fd-contact-ico { width: 52px; height: 52px; background: rgba(37,99,235,0.18); border: 1px solid rgba(37,99,235,0.4); display: flex; align-items: center; justify-content: center; color: var(--blue-light); margin: 0 auto 1.1rem; }
.fd-contact-ico svg { width: 24px; height: 24px; }
.fd-contact-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem; }
.fd-contact-card p { font-size: 0.9rem; color: rgba(255,255,255,0.62); }
.fd-cta-foot { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; }
.fd-cta-foot p { display: inline-flex; align-items: center; gap: 9px; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; color: rgba(255,255,255,0.7); }
.fd-cta-foot svg { width: 15px; height: 15px; color: var(--blue-light); flex-shrink: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 1000px) {
  .fd-hero-inner { grid-template-columns: 1fr; gap: 3rem; }
  .fd-portrait-wrap { justify-self: center; }
  .fd-story-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .fd-ai-meta { grid-template-columns: 1fr; gap: 1.75rem; }
  .fd-cards { grid-template-columns: 1fr 1fr; }
  .fd-steps { grid-template-columns: 1fr 1fr; }
  .fd-step:nth-child(2) { border-right: none; }
  .fd-step:nth-child(1), .fd-step:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.08); }
  .fd-skills { grid-template-columns: 1fr 1fr; }
  .fd-edu-grid { grid-template-columns: 1fr; }
  .fd-edu-card { height: auto; }
}
@media (max-width: 680px) {
  .fd-section { padding: 4rem 1.25rem; }
  .fd-hero { padding: 4.5rem 1.25rem 3.5rem; }
  .fd-metrics { grid-template-columns: 1fr 1fr; }
  .fd-metric:nth-child(2) { border-right: none; }
  .fd-metric:nth-child(1), .fd-metric:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.08); }
  .fd-portrait { width: 100%; }
  .fd-float.fd-float-tr { right: 12px; }
  .fd-float.fd-float-bl { left: 12px; }
  .fd-cards, .fd-cards.fd-cards-2 { grid-template-columns: 1fr; }
  .fd-steps { grid-template-columns: 1fr; }
  .fd-step { display: flex; align-items: flex-start; gap: 1rem; padding: 1.35rem 1.25rem; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .fd-step:last-child { border-bottom: none; }
  .fd-step-num { width: 40px; height: 40px; font-size: 1rem; margin-bottom: 0; flex-shrink: 0; }
  .fd-step-text h4 { margin-top: 0; }
  .fd-skills { grid-template-columns: 1fr; }
  .fd-cta-grid { grid-template-columns: 1fr; }
  .fd-contact-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .fd-contact-card:last-child { border-bottom: none; }
  .fd-snap-item { flex-direction: column; gap: 4px; }
  .fd-snap-mk { width: auto; }
}
`

function fdIcon(name: string) {
  switch (name) {
    case "technical":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "local":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "content":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case "authority":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case "analytics":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "ai":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="12" rx="1"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><line x1="9" y1="13" x2="9" y2="15"/><line x1="15" y1="13" x2="15" y2="15"/><path d="M4 14H2"/><path d="M22 14h-2"/></svg>;
    case "strategy":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "balance":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M5 7h14"/><path d="M5 7l-2.5 6a3 3 0 0 0 5 0z"/><path d="M19 7l-2.5 6a3 3 0 0 0 5 0z"/></svg>;
    case "transparent":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "ethical":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    default:
      return null;
  }
}

export default async function FounderPage() {
  // Dynamic count of Rohit's published articles from the SQLite CMS (blog.db)
  let rohitArticleCount = 0;
  try {
    const db = getDatabase();
    const row = db.prepare(`
      SELECT COUNT(*) as count
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      WHERE a.status = 'published' AND auth.slug = 'rohit-sharma'
    `).get() as { count: number };
    rohitArticleCount = row?.count ?? 0;
  } catch (error) {
    console.error('Error counting founder articles:', error);
  }
  const rohitArticles = { length: rohitArticleCount };

  const expertise = [
    { title: "Technical SEO", description: "crawl/indexation fixes, site architecture, internal linking systems, structured data, migrations, Core Web Vitals guidance.", icon: "technical" },
    { title: "Local SEO", description: "GBP optimization, location pages, reviews strategy, local SERP growth for single and multi-location brands.", icon: "local" },
    { title: "Content Strategy", description: "topical mapping, SERP-aligned briefs, NLP-friendly formatting, editorial QA.", icon: "content" },
    { title: "Authority & Links", description: "white-hat acquisition, competitor gap analysis, digital PR angles.", icon: "authority" },
    { title: "Analytics & Reporting", description: "GA4/GSC diagnostics, KPI frameworks, action-focused reports.", icon: "analytics" },
    { title: "AI-Powered SEO", description: "SERP synthesis, topical clustering, content briefs, schema automation using ChatGPT, Claude, and Perplexity.", icon: "ai" }
  ];

  const values = [
    { title: "Strategy First", description: "clear goals, measurable KPIs, prioritized roadmaps.", icon: "strategy" },
    { title: "Technical + Editorial Balance", description: "clean architecture with SERP-aligned content.", icon: "balance" },
    { title: "Transparent Communication", description: "actionable reports and consistent updates.", icon: "transparent" },
    { title: "Ethical SEO", description: "sustainable, standards-compliant, long-term growth.", icon: "ethical" }
  ];

  const timeline = [
    {
      year: "2022-2024",
      title: "SEO Manager — The Poised Media",
      description: "Leads technical, on-page, and off-page programs for B2B portfolios; aligns roadmaps with business outcomes; mentors teams; maintains rigorous reporting.",
    },
    {
      year: "2019-2022",
      title: "Senior SEO Account Manager — Aditadv Tech Pvt. Ltd.",
      description: "Managed 65+ local clients (US/Canada) and delivered ranking and conversion lifts through local and content strategies.",
    },
    {
      year: "2017-2019",
      title: "SEO Executive & Team Leader — AIS Technolabs Pvt. Ltd.",
      description: "Drove four in-house projects with link-building, social integration, and comprehensive on-page optimization.",
    },
    {
      year: "2014-2016",
      title: "SEO Executive — MindGrove eSolutions Pvt. Ltd.",
      description: "Achieved first-page rankings in competitive niches via structured research and disciplined optimization.",
    },
    {
      year: "2013-2014",
      title: "SEO Trainee — Internet Marketing Wizard",
      description: "Marketplace SEO (Etsy, Amazon, eBay), blogging, and product reviews.",
    }
  ];

  return (
    <div className="fd-page">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: FD_CSS }} />

      {/* ── HERO ── */}
      <section className="fd-hero">
        <div className="fd-hero-canvas">
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div className="fd-hero-vignette" />
        <div className="fd-hero-inner">
          {/* Content Side */}
          <div>
            <div className="fd-badge">
              <span className="fd-pulse" />
              Founder &amp; CEO
            </div>

            <h1>
              Meet
              <span className="fd-name">Rohit Sharma</span>
            </h1>

            <div className="fd-hero-sub">The visionary behind SEOShouts</div>

            <p className="fd-hero-lead">
              From a curious SEO trainee in 2013 to building one of India's most trusted SEO platforms,
              Rohit's journey is a testament to persistence, innovation, and genuine passion for helping
              businesses succeed online.
            </p>

            {/* Key Metrics */}
            <div className="fd-metrics">
              <div className="fd-metric">
                <div className="fd-metric-num">13+</div>
                <div className="fd-metric-label">Years Experience</div>
              </div>
              <div className="fd-metric">
                <div className="fd-metric-num">65+</div>
                <div className="fd-metric-label">Happy Clients</div>
              </div>
              <div className="fd-metric">
                <div className="fd-metric-num">150+</div>
                <div className="fd-metric-label">Projects Completed</div>
              </div>
              <div className="fd-metric">
                <div className="fd-metric-num">{rohitArticles.length}</div>
                <div className="fd-metric-label">Articles Published</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="fd-hero-ctas">
              <a href="#story" className="fd-btn-blue">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                Read My Story
              </a>
              <a href="mailto:seoshouts@gmail.com" className="fd-btn-ghost">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Get in Touch
              </a>
            </div>
          </div>

          {/* Image Side */}
          <div className="fd-portrait-wrap">
            <div className="fd-portrait">
              <img
                src="/images/team/rohit-sharma.jpg"
                alt="Rohit Sharma - Founder & CEO of SEOShouts"
              />
            </div>
            <div className="fd-float fd-float-tr">
              <div className="fd-float-num">95%</div>
              <div className="fd-float-k">Success Rate</div>
            </div>
            <div className="fd-float fd-float-bl">
              <span className="fd-float-dot" />
              <span className="fd-float-live">Available for Consulting</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section id="story" className="fd-section fd-white">
        <div className="fd-container">
          <div className="fd-s-head fd-center">
            <div className="fd-eyebrow">The Origin</div>
            <h2 className="fd-s-title">The Journey That Started It All</h2>
            <p className="fd-s-sub">
              Every great company has an origin story. Here's how a curious mind and relentless
              pursuit of SEO excellence led to the creation of SEOShouts.
            </p>
          </div>

          <div className="fd-story-grid">
            <div>
              <h3 className="fd-story-h3">The Spark of Innovation</h3>
              <p className="fd-story-p">
                Rohit Sharma is the founder of SEOShouts and the primary author behind its research, playbooks,
                and case notes. A results-driven SEO strategist with 13+ years of experience, he helps local,
                eCommerce, and B2B brands turn search visibility into qualified leads and revenue. His work
                blends technical SEO, content strategy, and data-led execution.
              </p>
              <p className="fd-story-p">
                As the lead author at SEOShouts, Rohit writes evidence-based guides on technical SEO,
                local search, and content-driven growth. His articles focus on practical frameworks,
                transparent reporting, and scalable processes that teams can implement quickly.
                He is known for bridging development, content, and business goals to ship changes that move KPIs.
              </p>
            </div>
            <div className="fd-snapshot">
              <h4>Founder Snapshot</h4>
              <div className="fd-snap-item">
                <span className="fd-snap-mk">Location</span>
                <span className="fd-snap-v">Rajasthan, India</span>
              </div>
              <div className="fd-snap-item">
                <span className="fd-snap-mk">Experience</span>
                <span className="fd-snap-v">2013–2024 (agency and in-house)</span>
              </div>
              <div className="fd-snap-item">
                <span className="fd-snap-mk">Specialties</span>
                <span className="fd-snap-v">Technical SEO, Local SEO (GBP), eCommerce SEO, SEO Development, Content Strategy, Authority Building</span>
              </div>
              <div className="fd-snap-item">
                <span className="fd-snap-mk">Focus</span>
                <span className="fd-snap-v">Consulting, technical audits, growth retainers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AREAS OF EXPERTISE ── */}
      <section className="fd-section fd-gray">
        <div className="fd-container">
          <div className="fd-s-head fd-center">
            <div className="fd-eyebrow">Capabilities</div>
            <h2 className="fd-s-title">Areas of Expertise</h2>
            <p className="fd-s-sub">
              Specialized skills and services developed through 13+ years of hands-on SEO experience
            </p>
          </div>
          <div className="fd-cards">
            {expertise.map((service, index) => (
              <div key={index} className="fd-card">
                <div className="fd-card-ico">{fdIcon(service.icon)}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI WORKFLOW ── */}
      <section className="fd-section fd-dark">
        <div className="fd-grid-bg" />
        <div className="fd-container">
          <div className="fd-s-head fd-center">
            <div className="fd-eyebrow">Modern Stack</div>
            <h2 className="fd-s-title">AI-Powered SEO Workflow</h2>
            <p className="fd-s-sub">
              How I leverage cutting-edge AI tools to deliver superior SEO results
            </p>
          </div>

          <div className="fd-ai-meta">
            <div>
              <div className="fd-ai-label">AI Tools</div>
              <div className="fd-tags">
                {['ChatGPT', 'Perplexity', 'Claude'].map((tool) => (
                  <span key={tool} className="fd-tag">{tool}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="fd-ai-label">Applications</div>
              <p className="fd-ai-apps">
                SERP synthesis, topical clustering, content briefs, headings/meta variants, FAQs,
                internal linking ideas, schema stubs, tone refinement, analytics summarization.
              </p>
            </div>
          </div>

          <div className="fd-workflow-title">My AI-SEO Workflow</div>
          <div className="fd-steps">
            <div className="fd-step">
              <div className="fd-step-num">1</div>
              <div className="fd-step-text">
                <h4>Research</h4>
                <p>Perplexity for rapid research and entity discovery</p>
              </div>
            </div>
            <div className="fd-step">
              <div className="fd-step-num">2</div>
              <div className="fd-step-text">
                <h4>Structure</h4>
                <p>Claude for outline and long-form content structure</p>
              </div>
            </div>
            <div className="fd-step">
              <div className="fd-step-num">3</div>
              <div className="fd-step-text">
                <h4>Optimize</h4>
                <p>ChatGPT for on-page iteration and schema generation</p>
              </div>
            </div>
            <div className="fd-step">
              <div className="fd-step-num">4</div>
              <div className="fd-step-text">
                <h4>Verify</h4>
                <p>Human QA for verification, originality, and E-E-A-T</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROFESSIONAL JOURNEY ── */}
      <section className="fd-section fd-white">
        <div className="fd-container">
          <div className="fd-s-head fd-center">
            <div className="fd-eyebrow">Track Record</div>
            <h2 className="fd-s-title">Professional Journey</h2>
            <p className="fd-s-sub">
              From SEO trainee to industry leader - 13 years of continuous learning and growth
            </p>
          </div>

          <div className="fd-timeline">
            {timeline.map((item, index) => (
              <div key={index} className="fd-tl-item">
                <div className="fd-tl-card">
                  <div className="fd-tl-year">{item.year}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS & TECHNOLOGY STACK ── */}
      <section className="fd-section fd-gray">
        <div className="fd-container">
          <div className="fd-s-head fd-center">
            <div className="fd-eyebrow">Toolkit</div>
            <h2 className="fd-s-title">Skills &amp; Technology Stack</h2>
            <p className="fd-s-sub">
              The tools and technologies that power world-class SEO strategies
            </p>
          </div>

          <div className="fd-skills">
            <div className="fd-skill-group">
              <h3>Core SEO Skills</h3>
              <div className="fd-skill-tags">
                {['Technical SEO', 'On-Page', 'Off-Page', 'Local SEO (GBP)', 'Content Strategy', 'Analytics & Reporting', 'Project Management', 'Team Leadership'].map((skill) => (
                  <span key={skill} className="fd-skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="fd-skill-group">
              <h3>SEO Tools</h3>
              <div className="fd-skill-tags">
                {['GA4', 'Search Console', 'Google Tag Manager', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Keyword Planner'].map((tool) => (
                  <span key={tool} className="fd-skill-tag">{tool}</span>
                ))}
              </div>
            </div>
            <div className="fd-skill-group">
              <h3>Development</h3>
              <div className="fd-skill-tags">
                {['WordPress', 'Shopify', 'Wix', 'HTML/CSS', 'Custom Development'].map((tech) => (
                  <span key={tech} className="fd-skill-tag">{tech}</span>
                ))}
              </div>
            </div>
            <div className="fd-skill-group">
              <h3>Other Skills</h3>
              <div className="fd-skill-tags">
                {['Photoshop', 'Canva', 'Asana', 'Claude', 'Gemini', 'ChatGPT'].map((tool) => (
                  <span key={tool} className="fd-skill-tag">{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES & APPROACH ── */}
      <section className="fd-section fd-white">
        <div className="fd-container">
          <div className="fd-s-head fd-center">
            <div className="fd-eyebrow">Principles</div>
            <h2 className="fd-s-title">My Approach &amp; Values</h2>
            <p className="fd-s-sub">
              The principles that guide every project and client relationship
            </p>
          </div>

          <div className="fd-cards fd-cards-2">
            {values.map((value, index) => (
              <div key={index} className="fd-card">
                <div className="fd-card-ico">{fdIcon(value.icon)}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION & HIGHLIGHTS ── */}
      <section className="fd-section fd-gray">
        <div className="fd-container">
          <div className="fd-edu-grid">
            {/* Education */}
            <div>
              <h2 className="fd-edu-h2">Education</h2>
              <div className="fd-edu-card">
                <div className="fd-edu-inner">
                  <div className="fd-edu-ico">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                  </div>
                  <div>
                    <h3>Bachelor of Technology</h3>
                    <p className="fd-edu-org">Techno India NJR Institute of Technology, Udaipur</p>
                    <p className="fd-edu-yr">(2009–2013)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Highlights */}
            <div>
              <h2 className="fd-edu-h2">Career Highlights</h2>
              <div className="fd-edu-card">
                <div className="fd-hl-item">
                  <span className="fd-hl-bullet" />
                  <p>Led multi-client local SEO portfolios with consistent ranking and conversion gains.</p>
                </div>
                <div className="fd-hl-item">
                  <span className="fd-hl-bullet" />
                  <p>Built scalable processes for audits, briefs, internal linking, and reporting to reduce time-to-impact.</p>
                </div>
                <div className="fd-hl-item">
                  <span className="fd-hl-bullet" />
                  <p>Mentored teams to improve execution quality and delivery predictability.</p>
                </div>
                <div className="fd-hl-item">
                  <span className="fd-hl-bullet" />
                  <p>Founded SEOShouts in 2016 to democratize access to professional SEO tools and insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="fd-section fd-dark">
        <div className="fd-grid-bg" />
        <div className="fd-container">
          <div className="fd-s-head fd-center">
            <div className="fd-eyebrow">Let's Talk</div>
            <h2 className="fd-s-title">Ready to Transform Your SEO?</h2>
            <p className="fd-s-sub">
              Whether you need a comprehensive SEO audit, strategic consulting, or ongoing growth optimization,
              I'm here to help you achieve sustainable organic growth with data-driven strategies.
            </p>
          </div>

          <div className="fd-cta-grid">
            <a href="mailto:seoshouts@gmail.com" className="fd-contact-card">
              <div className="fd-contact-ico">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3>Email Me</h3>
              <p>seoshouts@gmail.com</p>
            </a>

            <a href="tel:+918094888157" className="fd-contact-card">
              <div className="fd-contact-ico">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <h3>Call Direct</h3>
              <p>+91 809 488 8157</p>
            </a>

            <a href="https://linkedin.com/in/seowithrohitsharma/" target="_blank" rel="noopener noreferrer" className="fd-contact-card">
              <div className="fd-contact-ico">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path></svg>
              </div>
              <h3>Connect</h3>
              <p>LinkedIn Profile</p>
            </a>
          </div>

          <div className="fd-cta-foot">
            <p>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Based in Rajasthan, India
            </p>
            <p>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>
              Available for projects worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Person", "Founder"],
            "name": "Rohit Sharma",
            "jobTitle": "Founder & CEO",
            "worksFor": {
              "@type": "Organization",
              "name": "SEOShouts",
              "foundingDate": "2016"
            },
            "foundingDate": "2016",
            "url": "https://seoshouts.com/founder/",
            "image": "https://seoshouts.com/images/team/rohit-sharma.jpg",
            "description": "Visionary founder and CEO behind SEOShouts. 13+ year journey from SEO trainee to industry leader, building scalable SEO solutions for businesses worldwide.",
            "knowsAbout": [
              "Search Engine Optimization",
              "Local SEO",
              "Technical SEO",
              "Content Strategy",
              "Google Business Profile",
              "Authority Building",
              "AI-powered SEO",
              "Business Strategy"
            ],
            "hasOccupation": {
              "@type": "Occupation",
              "name": "SEO Strategist & Entrepreneur",
              "occupationLocation": {
                "@type": "Country",
                "name": "India"
              }
            },
            "alumniOf": "Techno India NJR Institute of Technology, Udaipur",
            "email": "seoshouts@gmail.com",
            "telephone": "+918094888157",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://linkedin.com/in/seowithrohitsharma/",
              "https://seoshouts.com/authors/rohit-sharma/"
            ],
            "award": [
              "13+ Years SEO Excellence",
              "65+ Happy Clients Served",
              "150+ Projects Completed",
              "95% Client Success Rate"
            ]
          })
        }}
      />
    </div>
  )
}
