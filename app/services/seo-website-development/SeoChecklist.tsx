'use client'
import { useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

function ScIcon({ name, size = 18 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'tool': return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
    case 'file-text': return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    case 'image': return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    case 'zap': return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    case 'shield': return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    case 'file': return <svg {...p}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
    case 'link': return <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    case 'globe': return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    case 'hash': return <svg {...p}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
    case 'list': return <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    case 'code': return <svg {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    case 'settings': return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    case 'edit': return <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    case 'bar-chart-2': return <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    case 'tag': return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
    case 'award': return <svg {...p}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
    case 'smartphone': return <svg {...p}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    case 'compass': return <svg {...p}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
    case 'layers': return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
    case 'copy': return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    case 'lock': return <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    case 'map': return <svg {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
    case 'share': return <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
    case 'at-sign': return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
    case 'bell': return <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    case 'target': return <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    default: return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>
  }
}

type SeoFactor = {
  num: number
  icon: string
  title: string
  desc: string
  tooltip: string
}

type Category = {
  id: string
  icon: string
  title: string
  description: string
  color: string
  borderColor: string
  factors: SeoFactor[]
}

const categories: Category[] = [
  {
    id: 'technical',
    icon: 'tool',
    title: 'Technical SEO Foundation',
    description: 'Core technical elements that help Google crawl, understand, and index your website effectively.',
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    factors: [
      {
        num: 1,
        icon: 'tool',
        title: 'Title Tag',
        desc: 'Main headline for Google with keywords',
        tooltip: 'The title tag is the most important on-page SEO element. It appears as the clickable headline in search results and tells both users and search engines what your page is about.'
      },
      {
        num: 2,
        icon: 'file',
        title: 'Meta Description',
        desc: 'Crafted to make users click',
        tooltip: 'The meta description is the snippet of text that appears below your title in search results. While not a direct ranking factor, it significantly impacts click-through rates.'
      },
      {
        num: 3,
        icon: 'link',
        title: 'Canonical Tag',
        desc: 'Avoids duplicate content across pages',
        tooltip: 'Canonical tags tell search engines which version of a page is the "master" copy when you have similar or duplicate content, preventing SEO dilution.'
      },
      {
        num: 4,
        icon: 'globe',
        title: 'Hreflang Tag',
        desc: 'Shows right page by region/language',
        tooltip: 'Hreflang tags help Google serve the correct language or regional version of your page to users in different locations, essential for multi-regional sites.'
      },
      {
        num: 5,
        icon: 'hash',
        title: 'URL Structure',
        desc: 'Clean, readable URLs with keywords',
        tooltip: 'SEO-friendly URLs are short, descriptive, and include relevant keywords. They help both users and search engines understand page content before clicking.'
      },
      {
        num: 6,
        icon: 'list',
        title: 'Heading Tags (H1-H6)',
        desc: 'Logical keyword hierarchy',
        tooltip: 'Heading tags create a content hierarchy that helps search engines understand the structure and main topics of your page. H1 is the main heading, H2-H6 are subheadings.'
      },
      {
        num: 7,
        icon: 'code',
        title: 'HTML5 Semantic Tags',
        desc: 'Modern code Google understands',
        tooltip: 'Semantic HTML5 tags like <header>, <nav>, <article>, and <footer> give meaning to your page structure, making it easier for search engines to parse your content.'
      },
      {
        num: 8,
        icon: 'settings',
        title: 'Robots Meta Tags',
        desc: 'Instructions for Google indexing',
        tooltip: 'Robots meta tags control how search engines crawl and index individual pages. You can use them to prevent indexing of duplicate content or control snippet display.'
      },
    ]
  },
  {
    id: 'content',
    icon: 'file-text',
    title: 'Content & Keywords',
    description: 'Strategic content optimization targeting search intent with natural keyword integration.',
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    factors: [
      {
        num: 9,
        icon: 'edit',
        title: 'Content Quality',
        desc: 'Original, comprehensive content',
        tooltip: 'High-quality content is original, comprehensive, well-researched, and provides real value to users. It directly impacts rankings and user engagement.'
      },
      {
        num: 10,
        icon: 'search',
        title: 'Keyword Optimization',
        desc: 'Strategic keywords targeting search intent',
        tooltip: 'Strategic placement of primary and related keywords throughout your content in a natural way. Includes semantic keywords and long-tail variations.'
      },
      {
        num: 11,
        icon: 'link',
        title: 'Internal Linking',
        desc: 'Strategic links between pages',
        tooltip: 'Internal links connect your pages together, helping distribute ranking authority, improve navigation, and help search engines discover and understand your site structure.'
      },
      {
        num: 12,
        icon: 'bar-chart-2',
        title: 'Schema Markup',
        desc: 'Structured data for rich results',
        tooltip: 'Schema markup is code that helps search engines understand your content better and can enable rich results like star ratings, FAQs, and local business information in search results.'
      },
    ]
  },
  {
    id: 'media',
    icon: 'image',
    title: 'Images & Media',
    description: 'Image optimization for fast loading while maintaining SEO value.',
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    factors: [
      {
        num: 13,
        icon: 'image',
        title: 'Image Optimization',
        desc: 'Compressed with SEO filenames',
        tooltip: 'Optimized images load faster (improving Core Web Vitals) while maintaining quality. Includes compression, proper formats (WebP), and descriptive file names.'
      },
      {
        num: 14,
        icon: 'tag',
        title: 'Alt Text for Images',
        desc: 'Every image described for search & accessibility',
        tooltip: 'Alt text describes images for search engines and visually impaired users. It helps images rank in Google Image Search and provides context when images fail to load.'
      },
      {
        num: 15,
        icon: 'award',
        title: 'Favicon',
        desc: 'Your mini brand logo in browser tabs',
        tooltip: 'A favicon is the small icon that appears in browser tabs and bookmarks. While minor for SEO, it enhances brand recognition and user experience.'
      },
    ]
  },
  {
    id: 'performance',
    icon: 'zap',
    title: 'Performance & UX',
    description: 'Lightning-fast loading with perfect mobile experience.',
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    factors: [
      {
        num: 16,
        icon: 'zap',
        title: 'Core Web Vitals',
        desc: 'Lightning-fast loading',
        tooltip: 'Core Web Vitals measure loading speed (LCP), interactivity (FID), and visual stability (CLS). These are official Google ranking factors affecting user experience.'
      },
      {
        num: 17,
        icon: 'smartphone',
        title: 'Mobile Responsiveness',
        desc: 'Perfect on all devices',
        tooltip: 'Mobile-first responsive design ensures your site looks and works perfectly on all devices. Critical since Google uses mobile-first indexing for all websites.'
      },
      {
        num: 18,
        icon: 'compass',
        title: 'Structured Navigation',
        desc: 'Simple, intuitive menus',
        tooltip: 'Clear, intuitive navigation helps users find what they need quickly and helps search engines understand your site structure and page relationships.'
      },
      {
        num: 19,
        icon: 'layers',
        title: 'Breadcrumbs Markup',
        desc: 'Shows navigation path',
        tooltip: 'Breadcrumbs show users their location within your site hierarchy. When marked up properly, they can appear in search results, improving click-through rates.'
      },
      {
        num: 20,
        icon: 'copy',
        title: 'Pagination Tags',
        desc: 'Makes long lists easy to navigate',
        tooltip: 'Pagination tags (rel=next/prev) help search engines understand the relationship between paginated content, preventing duplicate content issues.'
      },
    ]
  },
  {
    id: 'security',
    icon: 'shield',
    title: 'Security & Social',
    description: 'HTTPS security and optimized social media integration.',
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    factors: [
      {
        num: 21,
        icon: 'lock',
        title: 'HTTPS Security',
        desc: 'SSL-enabled for security',
        tooltip: 'HTTPS encryption (SSL certificate) is a Google ranking factor and essential for user trust. It encrypts data between your site and visitors, protecting sensitive information.'
      },
      {
        num: 22,
        icon: 'map',
        title: 'Sitemap & Robots.txt',
        desc: 'Ensures Google discovers all pages',
        tooltip: 'XML sitemaps list all your important pages for search engines. Robots.txt controls which pages search engines can crawl. Both are essential for proper indexing.'
      },
      {
        num: 23,
        icon: 'share',
        title: 'Open Graph Tags',
        desc: 'Optimizes previews on social media',
        tooltip: 'Open Graph tags control how your content appears when shared on Facebook, LinkedIn, and other social platforms, improving social engagement and traffic.'
      },
      {
        num: 24,
        icon: 'at-sign',
        title: 'Twitter Card Tags',
        desc: 'Custom display for links shared on Twitter',
        tooltip: 'Twitter Card tags customize how your links appear when shared on Twitter/X, with options for images, titles, and descriptions to maximize engagement.'
      },
      {
        num: 25,
        icon: 'bell',
        title: 'Social Sharing Buttons',
        desc: 'Easy sharing to social platforms',
        tooltip: 'Social sharing buttons make it easy for visitors to share your content, increasing reach and potentially generating backlinks and social signals.'
      },
      {
        num: 26,
        icon: 'target',
        title: 'Engagement CTAs',
        desc: 'Strategic call-to-action buttons',
        tooltip: 'Call-to-action buttons strategically placed throughout your site to guide users toward desired actions (contact, purchase, sign-up), improving conversion rates.'
      },
    ]
  },
]

export default function SeoChecklist() {
  const [activeCategory, setActiveCategory] = useState<string>('technical')
  const currentCategory = categories.find(cat => cat.id === activeCategory) || categories[0]

  return (
    <Tooltip.Provider delayDuration={200}>
      <section className="section features-section">
        <style>{`
          /* ── Tab bar ─────────────────────────────────────────── */
          .wd-scl-tabs { display: flex; margin-top: 2.5rem; background: var(--ink); overflow-x: auto; scrollbar-width: none; }
          .wd-scl-tabs::-webkit-scrollbar { display: none; }
          .wd-scl-tab { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; padding: 16px 20px; background: transparent; border: none; border-right: 1px solid rgba(255,255,255,0.07); border-bottom: 3px solid transparent; cursor: pointer; text-align: left; transition: background 0.15s; white-space: nowrap; }
          .wd-scl-tab:last-child { border-right: none; }
          .wd-scl-tab:hover { background: rgba(255,255,255,0.05); }
          .wd-scl-tab.wd-scl-on { background: var(--blue); border-bottom-color: transparent; }
          .wd-scl-tab-ico { width: 30px; height: 30px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.6); flex-shrink: 0; }
          .wd-scl-tab.wd-scl-on .wd-scl-tab-ico { background: rgba(255,255,255,0.2); color: #fff; }
          .wd-scl-tab-label { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.5); line-height: 1.3; }
          .wd-scl-tab.wd-scl-on .wd-scl-tab-label { color: #fff; font-weight: 700; }
          .wd-scl-tab-n { font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.25); margin-left: auto; flex-shrink: 0; }
          .wd-scl-tab.wd-scl-on .wd-scl-tab-n { color: rgba(255,255,255,0.75); }

          /* ── Description strip ───────────────────────────────── */
          .wd-scl-strip { display: flex; align-items: center; gap: 12px; padding: 10px 18px; background: rgba(37,99,235,0.05); border-left: 3px solid var(--blue); border-bottom: 1px solid var(--line); }
          .wd-scl-strip-txt { font-size: 0.78rem; color: var(--gray-5); line-height: 1.5; }

          /* ── Factor grid ─────────────────────────────────────── */
          .wd-scl-factors { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-top: none; }
          .wd-scl-factor-card { display: block; width: 100%; background: #fff; border: none; padding: 1.25rem 1.25rem; cursor: pointer; text-align: left; transition: background 0.15s; outline: none; }
          .wd-scl-factor-card:hover { background: rgba(37,99,235,0.04); }
          .wd-scl-factor-card:focus-visible { outline: 2px solid var(--blue); outline-offset: -2px; }
          .wd-scl-factor-head { display: flex; align-items: flex-start; gap: 10px; }
          .wd-scl-factor-ico { width: 36px; height: 36px; background: var(--blue); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
          .wd-scl-factor-meta { flex: 1; min-width: 0; }
          .wd-scl-factor-num { font-size: 0.65rem; font-weight: 700; color: var(--gray-5); letter-spacing: 0.06em; display: block; margin-bottom: 2px; }
          .wd-scl-factor-title { font-size: 0.875rem; font-weight: 700; color: var(--ink); line-height: 1.35; display: block; margin-bottom: 4px; }
          .wd-scl-factor-desc { font-size: 0.75rem; color: var(--gray-5); line-height: 1.5; display: block; }

          /* ── CTA ─────────────────────────────────────────────── */
          .wd-scl-cta { margin-top: 3rem; background: var(--ink); border: 1px solid rgba(255,255,255,0.07); padding: 3rem; text-align: center; }
          .wd-scl-cta-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue-light); margin-bottom: 1rem; display: block; }
          .wd-scl-cta-title { font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 1rem; }
          .wd-scl-cta-body { font-size: 0.95rem; color: rgba(255,255,255,0.58); line-height: 1.75; max-width: 640px; margin: 0 auto; }
          .wd-scl-cta-body strong { color: rgba(255,255,255,0.88); font-weight: 600; }

          /* ── Responsive ──────────────────────────────────────── */
          @media (max-width: 1100px) { .wd-scl-factors { grid-template-columns: repeat(3, 1fr); } }
          @media (max-width: 768px) {
            .wd-scl-factors { grid-template-columns: repeat(2, 1fr); }
            .wd-scl-tab { padding: 12px 12px; gap: 8px; }
            .wd-scl-tab-label { font-size: 0.73rem; }
          }
          @media (max-width: 480px) {
            .wd-scl-factors { grid-template-columns: 1fr; }
            .wd-scl-cta { padding: 2rem 1.5rem; }
          }
        `}</style>

        <div className="section-container">
          <div className="s-header center">
            <div className="eyebrow">SEO Checklist</div>
            <h2 className="s-title">Our Web Dev On-Page <span className="blue">SEO Perfection Checklist</span></h2>
            <p className="s-sub">
              Every website we build includes the complete suite of <strong>26 technical and SEO on-page factors</strong> as standard.
              <br />These aren&apos;t add-ons—this is what genuine SEO website development service means for your business.
            </p>
          </div>

          {/* ── Category tabs ── */}
          <div className="wd-scl-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`wd-scl-tab${activeCategory === cat.id ? ' wd-scl-on' : ''}`}
              >
                <div className="wd-scl-tab-ico"><ScIcon name={cat.icon} size={14} /></div>
                <span className="wd-scl-tab-label">{cat.title}</span>
                <span className="wd-scl-tab-n">{cat.factors.length}</span>
              </button>
            ))}
          </div>

          {/* ── Description strip ── */}
          <div className="wd-scl-strip">
            <span className="wd-scl-strip-txt">{currentCategory.description}</span>
          </div>

          {/* ── Factor grid ── */}
          <div key={currentCategory.id} className="wd-scl-factors animate-fadeIn">
            {currentCategory.factors.map((factor, index) => (
              <Tooltip.Root key={factor.num} delayDuration={200}>
                <Tooltip.Trigger asChild>
                  <button
                    className="wd-scl-factor-card"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="wd-scl-factor-head">
                      <div className="wd-scl-factor-ico"><ScIcon name={factor.icon} size={18} /></div>
                      <div className="wd-scl-factor-meta">
                        <span className="wd-scl-factor-num">#{factor.num}</span>
                        <span className="wd-scl-factor-title">{factor.title}</span>
                        <span className="wd-scl-factor-desc">{factor.desc}</span>
                      </div>
                    </div>
                  </button>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                  <Tooltip.Content
                    className="tooltip-content bg-slate-900 text-white text-xs sm:text-sm rounded-lg p-3 sm:p-4 shadow-2xl border border-slate-700 max-w-[280px] sm:max-w-xs z-[100]"
                    sideOffset={8}
                    side="bottom"
                  >
                    <p className="leading-relaxed">{factor.tooltip}</p>
                    <Tooltip.Arrow className="fill-slate-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="wd-scl-cta">
            <span className="wd-scl-cta-eyebrow">Complete Package</span>
            <h3 className="wd-scl-cta-title">All 26 Factors Included, No Exceptions</h3>
            <p className="wd-scl-cta-body">
              <strong>Every single item above is handled for you</strong>, explained in plain language, and documented in your project report. That&apos;s why <strong>startups, enterprises, and market leaders</strong> trust our developer-led SEO approach.
            </p>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }

          @keyframes tooltipSlideDownAndFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes tooltipSlideUpAndFade   { from { opacity: 0; transform: translateY(4px);  } to { opacity: 1; transform: translateY(0); } }
          @keyframes tooltipSlideRightAndFade { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes tooltipSlideLeftAndFade  { from { opacity: 0; transform: translateX(4px);  } to { opacity: 1; transform: translateX(0); } }

          .tooltip-content[data-state='delayed-open'][data-side='top']    { animation: tooltipSlideDownAndFade  0.2s cubic-bezier(0.16, 1, 0.3, 1); }
          .tooltip-content[data-state='delayed-open'][data-side='bottom'] { animation: tooltipSlideUpAndFade    0.2s cubic-bezier(0.16, 1, 0.3, 1); }
          .tooltip-content[data-state='delayed-open'][data-side='right']  { animation: tooltipSlideLeftAndFade  0.2s cubic-bezier(0.16, 1, 0.3, 1); }
          .tooltip-content[data-state='delayed-open'][data-side='left']   { animation: tooltipSlideRightAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        `}</style>
      </section>
    </Tooltip.Provider>
  )
}
