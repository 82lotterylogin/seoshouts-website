import type { Metadata } from 'next'
import HeroSection from './components/HeroSection'
import MetricsSection from './components/MetricsSection'
import NewsletterDark from './components/NewsletterDark'
import RevealInit from './components/RevealInit'

export const metadata: Metadata = {
  title: 'SEOShouts — Professional SEO Services & 18 Free Tools',
  description: "India's premier SEO agency. Professional SEO services and 18 free tools — helping businesses rank higher, generate more leads, and grow organic revenue. Founded 2014.",
  keywords: 'SEO tools, SEO services, free SEO analysis, keyword research, technical SEO, link building, local SEO, SEO consulting, India SEO',
  authors: [{ name: 'Rohit Sharma' }],
  creator: 'SEOShouts',
  publisher: 'SEOShouts',
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL('https://seoshouts.com'),
  alternates: { canonical: 'https://seoshouts.com/' },
  openGraph: {
    title: 'SEOShouts — Professional SEO Services & Free Tools',
    description: "India's premier SEO agency. Professional SEO services and 18 free tools.",
    url: 'https://seoshouts.com/',
    siteName: 'SEOShouts',
    images: [{ url: 'https://seoshouts.com/og-image.jpg', width: 1200, height: 630, alt: 'SEOShouts' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEOShouts — Professional SEO Services & Free Tools',
    description: "India's premier SEO agency. 18 free SEO tools.",
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

async function fetchLatestBlogPosts() {
  try {
    const { getDatabase } = await import('./lib/database')
    const db = getDatabase()
    const articles = db.prepare(`
      SELECT
        a.id, a.title, a.slug, a.excerpt, a.featured_image,
        a.published_at, a.created_at,
        auth.name as author_name,
        c.name as category_name, c.slug as category_slug
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT 3
    `).all() as any[]
    return articles.map(a => ({
      id: a.id, title: a.title, slug: a.slug, excerpt: a.excerpt,
      featured_image: a.featured_image, published_at: a.published_at, created_at: a.created_at,
      author: { name: a.author_name },
      category: a.category_name ? { name: a.category_name, slug: a.category_slug } : null,
    }))
  } catch {
    return []
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14 M12 5l7 7-7 7" />
    </svg>
  )
}

const SERVICES = [
  { title: 'Local SEO', desc: 'Dominate local search results and Google My Business. Perfect for restaurants, law firms, medical practices, and local businesses.', href: '/services/local-seo/' },
  { title: 'eCommerce SEO', desc: 'Increase online sales with specialized eCommerce SEO. Product optimization, category pages, and conversion-focused strategies.', href: '/services/ecommerce-seo/' },
  { title: 'SEO Web Development', desc: 'Build websites engineered for search from the ground up — performance-first architecture, clean code, and conversion-optimized layouts.', href: '/services/seo-website-development/' },
  { title: 'Link Building', desc: 'High-quality backlink acquisition from authoritative websites. White-hat strategies that improve domain authority and rankings.', href: '/services/link-building/' },
  { title: 'Technical SEO Audit', desc: 'Comprehensive technical analysis of your website. Identify and fix crawling issues, site speed problems, and technical barriers to ranking.', href: '/services/technical-seo-audit/' },
  { title: 'SEO Consulting', desc: 'Strategic SEO guidance for businesses and agencies. Custom strategies, team training, and ongoing consultation to maximize your SEO success.', href: '/services/seo-consulting/' },
]

const TOOLS_CATS = [
  { name: 'Keyword Research', count: 3, items: ['Keyword Density Analyzer', 'Keyword Difficulty Checker', 'Long Tail Keyword Generator'] },
  { name: 'Technical SEO', count: 8, items: ['Meta Tag Optimizer', 'On-Page SEO Analyzer', 'Internal Link Checker', 'Robots.txt Generator', 'XML Sitemap Generator', 'Schema Generator', '.htaccess Generator', 'Disavow File Generator'] },
  { name: 'Content & AI', count: 5, items: ['Word Counter', 'AI Copywriter', 'AI Blog Ideas Generator', 'SEO Meta Writer', 'GEO & AEO Checker'] },
  { name: 'Developer Tools', count: 2, items: ['HTML Editor', 'AI SEO Tools'] },
]

const TOOLS_DATA = [
  {
    badge: 'Technical SEO', name: 'Internal Link Checker',
    desc: 'Unique anchor text word cloud visualization. Analyze internal link patterns across 500 pages. The only free tool of its kind — helping SEO professionals optimize their internal linking strategy with data-driven insights.',
    feats: ['Interactive anchor text word cloud', 'Crawl up to 500 pages free', 'Link distribution analysis', 'Full CSV export'],
    href: '/tools/internal-link-checker/', reverse: false,
    preview: 'internal-link',
  },
  {
    badge: 'Technical SEO', name: 'On-Page SEO Analyzer',
    desc: 'Analyze 100+ ranking factors with real Google PageSpeed API. Check Core Web Vitals, technical SEO, and content optimization instantly — with actionable fix recommendations.',
    feats: ['100+ SEO factor analysis', 'Real Google PageSpeed integration', 'Core Web Vitals scoring', 'Actionable fix recommendations'],
    href: '/tools/on-page-seo-analyzer/', reverse: true,
    preview: 'on-page',
  },
  {
    badge: 'Schema Markup', name: 'Schema Generator',
    desc: 'Generate 39+ schema types for rich snippets. The most comprehensive free schema markup generator with JSON-LD validation — covering Article, FAQ, Product, LocalBusiness, and more.',
    feats: ['39+ schema types supported', 'JSON-LD output with validation', 'Rich snippet preview', 'Copy-paste ready code'],
    href: '/tools/schema-generator/', reverse: false,
    preview: 'schema',
  },
]

function ToolPreviewInternalLink() {
  return (
    <div className="tool-preview-pane">
      <div className="preview-bar">
        <div className="preview-dot" style={{ background: '#ff5f57' }} />
        <div className="preview-dot" style={{ background: '#febc2e' }} />
        <div className="preview-dot" style={{ background: '#28c840' }} />
        <span className="preview-bar-title">seoshouts.com/tools/internal-link-checker/</span>
      </div>
      <div className="preview-content">
        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>example.com</div>
          <div style={{ background: '#2563eb', padding: '10px 16px', fontSize: '0.8rem', color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Analyze</div>
        </div>
        <div className="word-cloud">
          {[['services', 1.5, '#3b82f6'], ['blog', 1.0, '#fff'], ['tools', 1.3, '#60a5fa'], ['contact', 0.85, '#8891aa'], ['local seo', 1.45, '#93c5fd'], ['pricing', 0.8, '#8891aa'], ['about', 1.1, '#fff']].map(([w, s, c]) => (
            <span key={w as string} style={{ fontSize: `${(s as number) * 0.68}rem`, color: c as string, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>{w}</span>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[['Homepage', 90], ['Services', 74], ['Blog', 56], ['Contact', 32]].map(([l, p]) => (
            <div key={l} className="p-mini-row">
              <span className="p-mini-label">{l}</span>
              <div className="p-track"><div className="p-fill" style={{ width: `${p}%` }} /></div>
              <span className="p-mini-val">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolPreviewOnPage() {
  return (
    <div className="tool-preview-pane">
      <div className="preview-bar">
        <div className="preview-dot" style={{ background: '#ff5f57' }} />
        <div className="preview-dot" style={{ background: '#febc2e' }} />
        <div className="preview-dot" style={{ background: '#28c840' }} />
        <span className="preview-bar-title">seoshouts.com/tools/on-page-seo-analyzer/</span>
      </div>
      <div className="preview-content">
        <div className="p-row">
          {[['SEO Score', '87', 'accent'], ['LCP', '1.9s', ''], ['CLS', '0.04', '']].map(([l, v, c]) => (
            <div key={l} className="p-card">
              <div className="p-card-label">{l}</div>
              <div className={`p-card-val${c ? ` ${c}` : ''}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="p-check-list">
          {[['Title Tag', 'Optimized', true], ['H1 Tag', 'Present', true], ['Image Alt', '2 Missing', false], ['Schema', 'FAQ Found', true], ['Core Web Vitals', 'Good', true], ['Mobile-Friendly', 'Pass', true]].map(([c, s, ok]) => (
            <div key={c as string} className="p-check">
              <span className="p-check-label">{c}</span>
              <span className="p-check-status" style={{ color: ok ? '#4ade80' : '#f87171' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolPreviewSchema() {
  const types = [['Article','article'],['FAQ Page','faq'],['Product','product'],['LocalBusiness','local'],['BreadcrumbList','breadcrumb'],['HowTo','howto'],['Review','review'],['Event','event']]
  return (
    <div className="tool-preview-pane">
      <div className="preview-bar">
        <div className="preview-dot" style={{ background: '#ff5f57' }} />
        <div className="preview-dot" style={{ background: '#febc2e' }} />
        <div className="preview-dot" style={{ background: '#28c840' }} />
        <span className="preview-bar-title">seoshouts.com/tools/schema-generator/</span>
      </div>
      <div className="preview-content">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {types.map(([label]) => (
            <span key={label} style={{ fontSize: '0.6rem', padding: '3px 8px', background: label === 'FAQ Page' ? 'rgba(37,99,235,0.25)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: label === 'FAQ Page' ? '#93c5fd' : 'var(--gray-4)', fontWeight: label === 'FAQ Page' ? 700 : 400 }}>{label}</span>
          ))}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: 10 }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--gray-4)', letterSpacing: '0.08em', marginBottom: 6 }}>JSON-LD OUTPUT</div>
          <div style={{ fontSize: '0.6rem', color: '#93c5fd', fontFamily: 'monospace', lineHeight: 1.5 }}>
            <div style={{ color: 'rgba(255,255,255,0.3)' }}>{`{`}</div>
            <div style={{ paddingLeft: 10 }}><span style={{ color: '#fbbf24' }}>&quot;@context&quot;</span>: <span style={{ color: '#86efac' }}>&quot;https://schema.org&quot;</span>,</div>
            <div style={{ paddingLeft: 10 }}><span style={{ color: '#fbbf24' }}>&quot;@type&quot;</span>: <span style={{ color: '#86efac' }}>&quot;FAQPage&quot;</span>,</div>
            <div style={{ paddingLeft: 10 }}><span style={{ color: '#fbbf24' }}>&quot;mainEntity&quot;</span>: [...]</div>
            <div style={{ color: 'rgba(255,255,255,0.3)' }}>{`}`}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <div style={{ flex: 1, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', padding: '6px 10px', fontSize: '0.58rem', color: '#93c5fd', fontWeight: 600, textAlign: 'center' }}>✓ Valid JSON-LD</div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 10px', fontSize: '0.58rem', color: 'var(--gray-4)', textAlign: 'center' }}>Copy Code</div>
        </div>
      </div>
    </div>
  )
}

function ToolPreviewGeoAeo() {
  return (
    <div className="tool-preview-pane">
      <div className="preview-bar">
        <div className="preview-dot" style={{ background: '#ff5f57' }} />
        <div className="preview-dot" style={{ background: '#febc2e' }} />
        <div className="preview-dot" style={{ background: '#28c840' }} />
        <span className="preview-bar-title">seoshouts.com/tools/geo-aeo-checker/</span>
      </div>
      <div className="preview-content">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#3b82f6', lineHeight: 1 }}>74</div>
          <div style={{ fontSize: '0.6rem', color: '#8891aa', letterSpacing: '0.1em', marginTop: 2 }}>AI READINESS SCORE</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[['Schema Markup', 82], ['E-E-A-T Signals', 71], ['Crawler Access', 100], ['FAQ Readiness', 55], ['Citation Signals', 68], ['AI Formatting', 60]].map(([cat, score]) => (
            <div key={cat} className="p-mini-row">
              <span className="p-mini-label">{cat}</span>
              <div className="p-track">
                <div className="p-fill" style={{ width: `${score}%`, background: (score as number) > 80 ? '#4ade80' : (score as number) > 60 ? '#3b82f6' : '#f59e0b' }} />
              </div>
              <span className="p-mini-val">{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const blogPosts = await fetchLatestBlogPosts()

  return (
    <>
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SEOShouts",
        "url": "https://seoshouts.com",
        "logo": "https://seoshouts.com/logo.png",
        "description": "Professional SEO tools and services. Founded by Rohit Sharma with 10+ years of SEO experience.",
        "foundingDate": "2014",
        "founder": { "@type": "Person", "name": "Rohit Sharma", "jobTitle": "SEO Expert" },
        "contactPoint": { "@type": "ContactPoint", "telephone": "+91-8094888157", "contactType": "customer service", "email": "seoshouts@gmail.com" },
        "address": { "@type": "PostalAddress", "addressLocality": "Udaipur", "addressRegion": "Rajasthan", "addressCountry": "IN" },
        "sameAs": ["https://www.facebook.com/seoshouts/", "https://www.linkedin.com/company/seoshouts/", "https://x.com/seo_shouts"]
      })}} />

      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seoshouts.com/" }]
      })}} />

      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "SEO Services",
        "description": "Professional SEO services including local SEO, eCommerce SEO, link building, technical audits, and SEO consulting.",
        "provider": { "@type": "Organization", "name": "SEOShouts", "url": "https://seoshouts.com/" },
        "serviceType": "SEO Services",
        "offers": [
          { "@type": "Offer", "name": "Local SEO", "url": "https://seoshouts.com/services/local-seo/" },
          { "@type": "Offer", "name": "eCommerce SEO", "url": "https://seoshouts.com/services/ecommerce-seo/" },
          { "@type": "Offer", "name": "Link Building", "url": "https://seoshouts.com/services/link-building/" },
          { "@type": "Offer", "name": "Technical SEO Audit", "url": "https://seoshouts.com/services/technical-seo-audit/" },
          { "@type": "Offer", "name": "SEO Consulting", "url": "https://seoshouts.com/services/seo-consulting/" },
        ]
      })}} />

      {/* Setup reveal animations */}
      <RevealInit />

      {/* ─── HERO ─── */}
      <HeroSection />

      {/* ─── TRUST BAR ─── */}
      <div className="trust-bar">
        <div className="trust-inner">
          <span className="trust-label">Trusted by</span>
          <div className="trust-divider" />
          <div className="trust-items">
            {['Local Businesses', 'eCommerce Brands', 'Digital Agencies', 'Healthcare Clinics', 'Educational Institutions', 'Real Estate Firms'].map(t => (
              <span key={t} className="trust-item">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SERVICES ─── */}
      <section className="section" style={{ background: 'var(--ink)' }}>
        <div className="section-container">
          <div className="s-header reveal">
            <div className="eyebrow light">Professional SEO Services</div>
            <h2 className="s-title light">Expert SEO Services That <span className="blue">Drive Results</span></h2>
            <p className="s-sub light">Professional SEO services tailored to your business needs. From local visibility to enterprise-level optimization.</p>
          </div>
          <div className="svc-grid">
            {SERVICES.map((s, i) => (
              <div key={s.href} className={`svc-card reveal d${(i % 3) + 1}`}>
                <a href={s.href} className="svc-title">{s.title}</a>
                <div className="svc-desc">{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="/services/" className="btn-blue">View All Services <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      {/* ─── METRICS ─── */}
      <MetricsSection />

      {/* ─── ABOUT ─── */}
      <section className="section" style={{ background: 'var(--gray-1)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="section-container">
          <div className="about-grid reveal">
            {/* Founder Photo */}
            <div className="about-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/team/rohit-sharma.jpg"
                alt="Rohit Sharma — Founder, SEOShouts"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div className="about-founder-tag">
                <div>
                  <div className="founder-name">Rohit Sharma</div>
                  <div className="founder-role">Founder &amp; SEO Expert</div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>10+ YRS</div>
              </div>
            </div>
            {/* Content */}
            <div>
              <div className="eyebrow">About SEOShouts</div>
              <h2 className="s-title">Founded by SEO Expert <span className="blue">Rohit Sharma</span></h2>
              <p className="s-sub">SEOShouts is founded by <strong>Rohit Sharma</strong>, an SEO expert with <strong>10+ years of experience</strong> in technical SEO, content strategy, and search optimization.</p>
              <div className="about-stats">
                {[{ n: '10+', l: 'Years Experience' }, { n: '15+', l: 'Free SEO Tools' }, { n: '#1', l: 'Internal Link Checker' }].map(({ n, l }) => (
                  <div key={l} className="about-stat">
                    <div className="about-stat-num">{n}</div>
                    <div className="about-stat-label">{l}</div>
                  </div>
                ))}
              </div>
              <div className="about-quote">
                <p>SEOShouts provides the only free internal link checker with visual anchor text word cloud analysis — helping SEO professionals optimize their internal linking strategy with data-driven insights.</p>
                <cite>— Rohit Sharma, Founder</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOOLS SHOWCASE ─── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="section-container">
          <div className="s-header reveal">
            <div className="eyebrow">Free SEO Tools</div>
            <h2 className="s-title">Powerful Free Tools <span className="blue">For Everyone</span></h2>
            <p className="s-sub">Access professional-grade SEO tools absolutely free. Perfect for businesses, agencies, and SEO professionals.</p>
          </div>
          <div className="tools-showcase">
            {TOOLS_DATA.map(tool => (
              <div key={tool.name} className={`tool-row${tool.reverse ? ' alt' : ''} reveal`}>
                <div className="tool-info">
                  <div className="tool-badge">{tool.badge}</div>
                  <a href={tool.href} className="tool-name-link"><h3 className="tool-name">{tool.name}</h3></a>
                  <p className="tool-desc-p">{tool.desc}</p>
                  <div className="tool-feats">
                    {tool.feats.map(f => (
                      <div key={f} className="tool-feat">
                        <div className="tool-feat-check">
                          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                {tool.preview === 'internal-link' && <ToolPreviewInternalLink />}
                {tool.preview === 'on-page' && <ToolPreviewOnPage />}
                {tool.preview === 'schema' && <ToolPreviewSchema />}
                {tool.preview === 'geo-aeo' && <ToolPreviewGeoAeo />}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--gray-5)', marginRight: '1.5rem' }}>+12 more tools available</span>
            <a href="/tools/" className="btn-blue">View All 15+ Free Tools <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      {/* ─── ALL TOOLS LIST ─── */}
      <section className="section" style={{ background: 'var(--ink-2)' }}>
        <div className="section-container">
          <div className="s-header reveal">
            <div className="eyebrow light">Free SEO Tools</div>
            <h2 className="s-title light">All 15+ tools, organized by <span className="blue">category</span></h2>
            <p className="s-sub light">Professional-grade SEO tools, completely free. No registration required.</p>
          </div>
          <div className="tools-cats">
            {TOOLS_CATS.map(cat => (
              <div key={cat.name} className="tool-cat">
                <div className="tool-cat-head">
                  <div className="tool-cat-name">{cat.name}</div>
                  <div className="tool-cat-count">{cat.count} tools</div>
                </div>
                <div className="tool-cat-items">
                  {cat.items.map(item => (
                    <div key={item} className="tool-cat-item">
                      {item}
                      <span className="tool-cat-item-badge">FREE</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="/tools/" className="btn-blue">Launch Any Tool Free <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      {/* ─── BLOG ─── */}
      <section className="section" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="section-container">
          <div className="blog-header">
            <div className="reveal">
              <div className="eyebrow">Expert SEO Insights</div>
              <h2 className="s-title">Latest SEO Strategies <span className="blue">&amp; Tips</span></h2>
            </div>
            <a href="/blog/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue)', fontFamily: 'Space Grotesk, sans-serif', textDecoration: 'none' }}>
              View all posts <ArrowRight size={13} />
            </a>
          </div>
          <div className="blog-grid">
            {blogPosts.length > 0 ? blogPosts.map((post, i) => (
              <div key={post.id} className={`blog-card reveal d${i + 1}`}>
                <div className="blog-img-wrap">
                  {post.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.featured_image} alt={post.title} className="blog-img-real" />
                  ) : null}
                  {post.category && <span className="blog-tag-pill">{post.category.name}</span>}
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    {post.author.name}
                    <span className="blog-sep">·</span>
                    {formatDate(post.published_at || post.created_at)}
                  </div>
                  <a href={`/blog/${post.slug}/`} className="blog-title">{post.title}</a>
                </div>
              </div>
            )) : (
              /* Fallback when no posts in DB */
              [
                { tag: 'Technical SEO', title: 'How to Build a Winning Internal Link Strategy in 2026', date: 'Mar 2026' },
                { tag: 'AI SEO', title: 'How AI Crawlers Parse Internal Links (GPTBot, ClaudeBot)', date: 'Feb 2026' },
                { tag: 'On-Page SEO', title: 'Core Web Vitals 2026: What Actually Impacts Rankings', date: 'Jan 2026' },
              ].map((post, i) => (
                <div key={i} className={`blog-card reveal d${i + 1}`}>
                  <div className="blog-img-wrap">
                    <span className="blog-tag-pill">{post.tag}</span>
                  </div>
                  <div className="blog-body">
                    <div className="blog-meta">Rohit Sharma <span className="blog-sep">·</span> {post.date}</div>
                    <a href="/blog/" className="blog-title">{post.title}</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <NewsletterDark />
    </>
  )
}
