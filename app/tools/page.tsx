import type { Metadata } from 'next'

// dummy comment to force deploy

export const metadata: Metadata = {
  title: 'Free SEO Tools - 18 Professional Tools | SEO Shouts',
  description: 'Access 18 professional free SEO tools for keyword research, technical optimization, content creation, AI-powered assistance, and schema generation. No registration required.',
  keywords: 'free SEO tools, keyword density analyzer, meta tag optimizer, long tail keywords, robots txt generator, xml sitemap generator, word counter, AI copywriter, blog ideas generator, HTML editor',
  authors: [{ name: 'SEO Shouts' }],
  creator: 'SEO Shouts',
  publisher: 'SEO Shouts',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/',
  },
  openGraph: {
    title: 'Free SEO Tools - 18 Professional Tools | SEO Shouts',
    description: 'Access 18 professional SEO tools for free. Keyword research, technical SEO, content optimization, AI-powered tools, and schema generation.',
    url: 'https://seoshouts.com/tools/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/tools-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Free SEO Tools by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SEO Tools - 18 Professional Tools | SEO Shouts',
    description: 'Access 18 professional SEO tools for free. All tools available without registration.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/tools-twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

// ─── Tool data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Keyword Research',
    desc: 'Discover, analyze, and optimize keywords for better search rankings.',
    count: 3,
    href: '#keyword-research',
    iconPaths: ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.35-4.35'],
  },
  {
    name: 'Technical SEO',
    desc: 'Optimize technical aspects of your website for search engines.',
    count: 9,
    href: '#technical-seo',
    iconPaths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  },
  {
    name: 'Content & AI Tools',
    desc: 'Create and optimize content with AI-powered assistance.',
    count: 5,
    href: '#content-ai',
    iconPaths: ['M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7', 'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z'],
  },
  {
    name: 'Developer Tools',
    desc: 'Code and test HTML, CSS, and JavaScript online.',
    count: 1,
    href: '#developer-tools',
    iconPaths: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  },
]

const KEYWORD_TOOLS = [
  {
    name: 'Keyword Density Analyzer',
    href: '/tools/keyword-density-analyzer/',
    desc: 'Analyze keyword density, distribution, and optimization opportunities in your content. Get insights on how to improve keyword balance.',
    feats: ['Real-time density analysis', 'Keyword distribution mapping', 'Optimization recommendations'],
    iconPaths: ['M18 20V10', 'M12 20V4', 'M6 20V14'],
  },
  {
    name: 'Keyword Difficulty Checker',
    href: '/tools/keyword-difficulty-checker/',
    desc: 'Evaluate keyword competition and difficulty scores. Make informed decisions about which keywords to target in your SEO strategy.',
    feats: ['Competition analysis', 'Difficulty scoring', 'Alternative suggestions'],
    iconPaths: ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M12 6v6l4 2'],
  },
  {
    name: 'Long Tail Keyword Generator',
    href: '/tools/long-tail-keyword-generator/',
    desc: 'Generate hundreds of long-tail keyword variations from your seed keywords. Find less competitive, high-converting keyword opportunities.',
    feats: ['Bulk keyword generation', 'Search volume data', 'Export functionality'],
    iconPaths: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'],
  },
]

const TECHNICAL_TOOLS = [
  {
    name: 'Meta Tag Optimizer',
    href: '/tools/meta-tag-optimizer/',
    desc: 'Create and optimize meta titles and descriptions with real-time SERP preview, character count, and CTR improvement suggestions.',
    feats: ['SERP preview simulation', 'Character count optimization', 'CTR improvement tips'],
    iconPaths: ['M21 6H3', 'M17 12H7', 'M21 18H3'],
  },
  {
    name: 'Robots.txt Generator',
    href: '/tools/robots-txt-generator/',
    desc: 'Generate and validate robots.txt files to control how search engines crawl your website. Includes syntax validation and testing.',
    feats: ['Automated generation', 'Syntax validation', 'Testing functionality'],
    iconPaths: ['M12 2a2 2 0 012 2v2a2 2 0 01-4 0V4a2 2 0 012-2z', 'M5 10h14v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z', 'M9 14h2', 'M13 14h2'],
  },
  {
    name: 'XML Sitemap Generator',
    href: '/tools/xml-sitemap-generator/',
    desc: 'Create comprehensive XML sitemaps for search engines. Supports various content types and includes priority and frequency settings.',
    feats: ['Automated sitemap creation', 'Priority & frequency settings', 'Multi-format support'],
    iconPaths: ['M1 6l7-4 8 4 7-4v16l-7 4-8-4-7 4V6z', 'M8 2v16', 'M16 6v16'],
  },
  {
    name: '.htaccess Generator',
    href: '/tools/htaccess-generator/',
    desc: 'Generate Apache .htaccess files for redirects, security headers, GZIP compression, browser caching, error pages, and CMS presets.',
    feats: ['301/302/307/308 redirect builder', 'Security, GZIP & caching rules', 'WordPress, Shopify, Laravel & Joomla presets'],
    iconPaths: ['M8 9l3 3-3 3', 'M13 15h3'],
  },
  {
    name: 'Schema Generator',
    href: '/tools/schema-generator/',
    desc: 'Generate JSON-LD schema markup for 39+ schema types. Perfect structured data for rich snippets and better SEO performance.',
    feats: ['39 schema types', 'JSON-LD format', 'Rich snippets optimization'],
    iconPaths: ['M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
  },
  {
    name: 'On-Page SEO Analyzer',
    href: '/tools/on-page-seo-analyzer/',
    desc: 'Complete website analysis with 150+ SEO factors including technical SEO, content quality, Core Web Vitals, and actionable optimization recommendations.',
    feats: ['150+ SEO factor analysis', 'Core Web Vitals data', 'Actionable recommendations'],
    iconPaths: ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.35-4.35'],
  },
  {
    name: 'Internal Link Checker',
    href: '/tools/internal-link-checker/',
    desc: 'Comprehensive internal link analysis with interactive visualization. Analyze anchor text distribution, link patterns, and discover optimization opportunities across your site.',
    feats: ['Interactive link visualization', 'Anchor text analysis', 'Detailed reporting & export'],
    iconPaths: ['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71'],
  },
  {
    name: 'Disavow File Generator',
    href: '/tools/disavow-file-generator/',
    desc: 'Generate Google-compliant disavow files from backlink exports. Auto-extract domains, remove duplicates, whitelist trusted domains, and download ready-to-upload output.',
    feats: ['Domain and URL disavow modes', 'Smart deduplication and whitelist filtering', 'Download ready disavow.txt file'],
    iconPaths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M15 9l-6 6', 'M9 9l6 6'],
  },
  {
    name: 'GEO & AEO Score Checker',
    href: '/tools/geo-aeo-checker/',
    desc: 'Audit your page\'s AI search readiness across 7 categories — schema markup, AI crawler access, E-E-A-T signals, FAQ readiness & more. Get a 0–100 score with specific fixes.',
    feats: ['7-category AI readiness audit', '0–100 weighted composite score', 'Per-check fix recommendations'],
    iconPaths: ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'],
  },
]

const CONTENT_TOOLS = [
  {
    name: 'Word Counter',
    href: '/tools/word-counter/',
    desc: 'Count words, characters, paragraphs, and sentences in your content. Track reading time and optimize for target word counts.',
    feats: ['Real-time counting', 'Reading time estimation', 'Multiple metrics tracking'],
    iconPaths: ['M17 10H3', 'M21 6H3', 'M21 14H3', 'M17 18H3'],
  },
  {
    name: 'AI Copywriter',
    href: '/tools/ai-copywriter/',
    desc: 'Generate compelling copy and marketing content with AI assistance. Create headlines, descriptions, and engaging content in seconds.',
    feats: ['AI-powered content generation', 'Multiple content types', 'Instant results'],
    iconPaths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 9.5-9.5z'],
  },
  {
    name: 'AI Blog Ideas Generator',
    href: '/tools/blog-ideas-generator/',
    desc: 'Generate compelling blog topics and content ideas with AI assistance. Get inspired with hundreds of topic suggestions tailored to your niche.',
    feats: ['AI topic generation', 'Niche-specific ideas', 'SEO-friendly suggestions'],
    iconPaths: ['M9 21h6', 'M9 9a3 3 0 116 0c0 2-3 3-3 5', 'M12 17v.01'],
  },
  {
    name: 'SEO Meta Writer',
    href: '/tools/seo-meta-writer/',
    desc: 'AI-powered meta content writer that creates optimized titles, descriptions, and meta tags for better search engine visibility.',
    feats: ['AI meta generation', 'SEO optimization', 'Character count compliance'],
    iconPaths: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8'],
  },
]

const DEVELOPER_TOOLS = [
  {
    name: 'HTML Editor',
    href: '/tools/html-editor/',
    desc: 'Online HTML, CSS, and JavaScript editor with live preview. Code, test, and debug web pages instantly in your browser.',
    feats: ['Live preview', 'Syntax highlighting', 'Export functionality'],
    iconPaths: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  },
]

// ─── Reusable icon helper ─────────────────────────────────────────────────────

function ToolIcon({ paths }: { paths: string[] }) {
  return (
    <div className="feature-icon">
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        {paths.map((p, i) => <path key={i} d={p} />)}
      </svg>
    </div>
  )
}

// ─── Tool card ────────────────────────────────────────────────────────────────

function ToolCard({ name, href, desc, feats, iconPaths }: typeof KEYWORD_TOOLS[0]) {
  return (
    <div className="feature-card">
      <ToolIcon paths={iconPaths} />
      <div className="feature-title">
        <a href={href}>{name}</a>
      </div>
      <p className="feature-desc">{desc}</p>
      <div className="tool-feats">
        {feats.map(f => (
          <div key={f} className="tool-feat">
            <div className="tool-feat-check">
              <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <span>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Category group header ────────────────────────────────────────────────────

function CategoryHeader({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <div className="s-header">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="s-title">{title} <span className="blue">{accent}</span></h2>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seoshouts.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": "https://seoshouts.com/tools"
              }
            ]
          })
        }}
      />

      {/* ItemList Schema — lets AI enumerate the full toolkit */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Free SEO Tools by SEOShouts",
            "description": "18 free professional SEO tools for keyword research, technical SEO, content optimization, schema markup, and AI-powered assistance. No registration required.",
            "url": "https://seoshouts.com/tools/",
            "numberOfItems": 18,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Keyword Density Analyzer", "url": "https://seoshouts.com/tools/keyword-density-analyzer/", "description": "Analyze keyword density, distribution, and optimization opportunities in your content." },
              { "@type": "ListItem", "position": 2, "name": "Keyword Difficulty Checker", "url": "https://seoshouts.com/tools/keyword-difficulty-checker/", "description": "Evaluate keyword competition and difficulty scores to make informed targeting decisions." },
              { "@type": "ListItem", "position": 3, "name": "Long Tail Keyword Generator", "url": "https://seoshouts.com/tools/long-tail-keyword-generator/", "description": "Generate hundreds of long-tail keyword variations from your seed keywords." },
              { "@type": "ListItem", "position": 4, "name": "Meta Tag Optimizer", "url": "https://seoshouts.com/tools/meta-tag-optimizer/", "description": "Create and optimize meta titles and descriptions with real-time SERP preview and CTR improvement suggestions." },
              { "@type": "ListItem", "position": 5, "name": "Robots.txt Generator", "url": "https://seoshouts.com/tools/robots-txt-generator/", "description": "Generate and validate robots.txt files to control how search engines crawl your website." },
              { "@type": "ListItem", "position": 6, "name": "XML Sitemap Generator", "url": "https://seoshouts.com/tools/xml-sitemap-generator/", "description": "Create comprehensive XML sitemaps for search engines with priority and frequency settings." },
              { "@type": "ListItem", "position": 7, "name": ".htaccess Generator", "url": "https://seoshouts.com/tools/htaccess-generator/", "description": "Generate Apache .htaccess files for redirects, security headers, GZIP compression, and browser caching." },
              { "@type": "ListItem", "position": 8, "name": "Schema Generator", "url": "https://seoshouts.com/tools/schema-generator/", "description": "Generate JSON-LD schema markup for 39+ schema types for rich snippets and better SEO." },
              { "@type": "ListItem", "position": 9, "name": "On-Page SEO Analyzer", "url": "https://seoshouts.com/tools/on-page-seo-analyzer/", "description": "Complete website analysis with 150+ SEO factors including technical SEO, content quality, and Core Web Vitals." },
              { "@type": "ListItem", "position": 10, "name": "Internal Link Checker", "url": "https://seoshouts.com/tools/internal-link-checker/", "description": "Comprehensive internal link analysis with interactive visualization and anchor text distribution insights." },
              { "@type": "ListItem", "position": 11, "name": "Disavow File Generator", "url": "https://seoshouts.com/tools/disavow-file-generator/", "description": "Generate Google-compliant disavow files from backlink exports with smart deduplication." },
              { "@type": "ListItem", "position": 12, "name": "GEO & AEO Score Checker", "url": "https://seoshouts.com/tools/geo-aeo-checker/", "description": "Audit your page's AI search readiness across 7 categories and get a 0–100 GEO/AEO composite score." },
              { "@type": "ListItem", "position": 13, "name": "Word Counter", "url": "https://seoshouts.com/tools/word-counter/", "description": "Count words, characters, paragraphs, and sentences. Track reading time and optimize content length." },
              { "@type": "ListItem", "position": 14, "name": "AI Copywriter", "url": "https://seoshouts.com/tools/ai-copywriter/", "description": "Generate compelling marketing copy and content with AI assistance in seconds." },
              { "@type": "ListItem", "position": 15, "name": "AI Blog Ideas Generator", "url": "https://seoshouts.com/tools/blog-ideas-generator/", "description": "Generate SEO-friendly blog topic ideas with AI assistance tailored to your niche." },
              { "@type": "ListItem", "position": 16, "name": "SEO Meta Writer", "url": "https://seoshouts.com/tools/seo-meta-writer/", "description": "AI-powered meta content writer for optimized titles, descriptions, and meta tags." },
              { "@type": "ListItem", "position": 17, "name": "HTML Editor", "url": "https://seoshouts.com/tools/html-editor/", "description": "Online HTML, CSS, and JavaScript editor with live preview for web development." },
              { "@type": "ListItem", "position": 18, "name": "Trending Hashtag Finder", "url": "https://seoshouts.com/tools/trending-hashtag-finder/", "description": "Find trending hashtags for your content to boost social media reach and visibility." }
            ]
          })
        }}
      />

      {/* ── HERO ── */}
      <div className="tool-hero">
        <div className="tool-hero-bg" />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>SEO Tools</span>
          </nav>
          <div className="tool-hero-badge">🛠️ Free SEO Toolkit — 18 Tools</div>
          <h1 className="tool-hero-h1">18 Free Professional <span>SEO Tools</span><br />Used by 10,000+ Marketers</h1>
          <p className="tool-hero-sub">Professional-grade free SEO tools for keyword research, technical audits, content creation, schema markup, and AI-powered optimization. No registration required.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['18 Tools Free', '100% Free Forever', 'Zero Signup', '10k+ Monthly Users', 'Instant Results'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES OVERVIEW ── */}
      <section className="section features-section" id="categories">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Categories</div>
            <h2 className="s-title">Tools Organized <span className="blue">by Category</span></h2>
            <p className="s-sub">Choose from our organized collection of free SEO tools designed for every aspect of search optimization.</p>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {CATEGORIES.map(cat => (
              <a key={cat.name} href={cat.href} className="feature-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {cat.iconPaths.map((p, i) => <path key={i} d={p} />)}
                  </svg>
                </div>
                <div className="feature-title" style={{ marginBottom: '0.5rem' }}>{cat.name}</div>
                <p className="feature-desc" style={{ flex: 1 }}>{cat.desc}</p>
                <div style={{ marginTop: '1.25rem', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {cat.count} Tool{cat.count !== 1 ? 's' : ''} &rarr;
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEYWORD RESEARCH TOOLS ── */}
      <section className="section howto-section" id="keyword-research">
        <div className="section-container">
          <CategoryHeader eyebrow="Keyword Research" title="Find the Right Keywords" accent="to Target" />
          <div className="features-grid">
            {KEYWORD_TOOLS.map(tool => <ToolCard key={tool.href} {...tool} />)}
          </div>
        </div>
      </section>

      {/* ── TECHNICAL SEO TOOLS ── */}
      <section className="section features-section" id="technical-seo">
        <div className="section-container">
          <CategoryHeader eyebrow="Technical SEO" title="Optimize Every Technical" accent="SEO Factor" />
          <div className="features-grid">
            {TECHNICAL_TOOLS.map(tool => <ToolCard key={tool.href + tool.name} {...tool} />)}
          </div>
        </div>
      </section>

      {/* ── CONTENT & AI TOOLS ── */}
      <section className="section ratio-section" id="content-ai">
        <div className="section-container">
          <CategoryHeader eyebrow="Content & AI Tools" title="Create Content That" accent="Ranks & Converts" />
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {CONTENT_TOOLS.map((tool, i) => <ToolCard key={tool.href + i} {...tool} />)}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER TOOLS ── */}
      <section className="section why-section" id="developer-tools">
        <div className="section-container">
          <CategoryHeader eyebrow="Developer Tools" title="Code and Test" accent="in Your Browser" />
          <div className="features-grid" style={{ gridTemplateColumns: '1fr' }}>
            {DEVELOPER_TOOLS.map(tool => <ToolCard key={tool.href} {...tool} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Start Using Our <span>Free SEO Tools</span> Today</h2>
          <p className="final-cta-sub">Stay ahead of the competition with exclusive SEO strategies, tool updates, and marketing tips. All tools are 100% free — no registration, no limits.</p>
          <div className="final-cta-row">
            <a href="#tools" className="btn-primary">🚀 Start Using Tools</a>
            <a href="/services/" className="btn-outline">💼 View SEO Services</a>
          </div>
          <div className="final-cta-pills">
            <span className="final-pill">18 Tools Free</span>
            <span className="final-pill">No Signup Required</span>
            <span className="final-pill">Instant Results</span>
          </div>
        </div>
      </div>
    </>
  )
}
