import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDatabase } from '../../lib/database'
import type { Author, Article, CareerHighlight } from '../../lib/types'

// Force dynamic rendering to ensure changes reflect immediately
export const dynamic = 'force-dynamic'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

// Function to fetch author by slug
async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const db = getDatabase()
    const author = db.prepare(`
      SELECT * FROM authors 
      WHERE slug = ? OR LOWER(REPLACE(name, ' ', '-')) = LOWER(?)
    `).get(slug, slug) as Author | undefined

    if (!author) return null

    // Parse JSON fields
    if (author.expertise && typeof author.expertise === 'string') {
      try {
        author.expertise = JSON.parse(author.expertise)
      } catch {
        author.expertise = []
      }
    }

    if (author.career_highlights && typeof author.career_highlights === 'string') {
      try {
        author.career_highlights = JSON.parse(author.career_highlights)
      } catch {
        author.career_highlights = []
      }
    }

    return author
  } catch (error) {
    console.error('Error fetching author:', error)
    return null
  }
}

// Function to fetch articles by author
async function getArticlesByAuthor(authorId: number): Promise<Article[]> {
  try {
    const db = getDatabase()
    const articles = db.prepare(`
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.author_id = ? AND a.status = 'published'
      ORDER BY a.published_at DESC, a.created_at DESC
      LIMIT 10
    `).all(authorId) as Article[]

    return articles
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

// Generate metadata dynamically
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    return {
      title: 'Author Not Found | SEO Shouts',
      description: 'The requested author page could not be found.'
    }
  }

  const title = author.meta_title || `${author.name} — ${author.job_title || 'SEO Expert'} | SEO Shouts`
  const description = author.meta_description || `${author.name} is ${author.job_title ? `a ${author.job_title.toLowerCase()}` : 'an SEO expert'} at SEO Shouts. ${author.bio || 'Expert in SEO and digital marketing strategies.'}`

  const metadata: Metadata = {
    title,
    description,
    authors: [{ name: author.name }],
    creator: author.name,
    publisher: 'SEO Shouts',
    metadataBase: new URL('https://seoshouts.com'),
    alternates: {
      canonical: `https://seoshouts.com/authors/${slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://seoshouts.com/authors/${slug}/`,
      siteName: 'SEO Shouts',
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    }
  }

  // Add image to metadata if available
  if (author.avatar_url) {
    metadata.openGraph!.images = [{
      url: author.avatar_url,
      width: 400,
      height: 400,
      alt: author.avatar_alt_text || `${author.name} profile picture`,
    }]
    metadata.twitter!.images = [author.avatar_url]
  }

  // Always set robots meta based on SEO settings (stored as integers in SQLite)
  metadata.robots = {
    index: !Boolean(author.seo_noindex),
    follow: !Boolean(author.seo_nofollow),
    nocache: true,
    googleBot: {
      index: !Boolean(author.seo_noindex),
      follow: !Boolean(author.seo_nofollow),
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }

  return metadata
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  const articles = await getArticlesByAuthor(author.id)

  // Helper function to check if a field has content
  const hasContent = (value: any): boolean => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim().length > 0
    return Boolean(value)
  }

  return (
    <>
      {/* Custom Schema if provided */}
      {hasContent(author.custom_schema) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: author.custom_schema!
          }}
        />
      )}

      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": author.name,
            ...(author.job_title && { "jobTitle": author.job_title }),
            "worksFor": {
              "@type": "Organization",
              "name": author.company || "SEO Shouts"
            },
            "url": `https://seoshouts.com/authors/${slug}/`,
            ...(author.avatar_url && {
              "image": {
                "@type": "ImageObject",
                "url": author.avatar_url,
                ...(author.avatar_alt_text && { "description": author.avatar_alt_text })
              }
            }),
            ...(author.bio && { "description": author.bio }),
            ...(hasContent(author.expertise) && { "knowsAbout": author.expertise }),
            ...(author.email && { "email": author.email }),
            ...(author.phone && { "telephone": author.phone }),
            ...(author.location && {
              "address": {
                "@type": "PostalAddress",
                "addressLocality": author.location
              }
            }),
            "sameAs": [
              ...(author.linkedin_url ? [author.linkedin_url] : []),
              ...(author.twitter_url ? [author.twitter_url] : []),
              ...(author.website_url ? [author.website_url] : [])
            ].filter(Boolean)
          })
        }}
      />

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
                "item": "https://seoshouts.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Meet Our Experts",
                "item": "https://seoshouts.com/meet-the-experts/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": author.name,
                "item": `https://seoshouts.com/authors/${slug}/`
              }
            ]
          })
        }}
      />

      {/* Breadcrumb */}
      <div className="ap-crumbs">
        <div className="ap-crumbs-inner">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <a href="/meet-the-experts/">Experts</a>
          <span className="sep">/</span>
          <span className="current">{author.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="ap-hero">
        <div className="ap-hero-grid" />
        <div className="ap-hero-inner">

          {/* Portrait card */}
          <div className="ap-author-card">
            <div className="ap-verify">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Verified Author
            </div>
            <div className="ap-frame">
              <div className="ap-frame-top">
                <span className="ap-ftag">AUTH <span className="blu">/</span> {String(author.id).padStart(3, '0')}</span>
                <div className="ap-dots"><span /><span /><span /></div>
              </div>
              <div className="ap-photo">
                {author.avatar_url ? (
                  <Image src={author.avatar_url} alt={author.avatar_alt_text || `${author.name} profile photo`} fill style={{ objectFit: 'cover', objectPosition: '50% 25%' }} unoptimized />
                ) : (
                  <div style={{ width: '100%', height: '100%', minHeight: 320, background: 'var(--ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '4rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>{author.name.charAt(0)}</span>
                  </div>
                )}
                <div className="ap-photo-meta">
                  <span className="ap-live"><span className="ap-pdot" />ACTIVE</span>
                  {author.location && (
                    <span className="ap-loc">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {author.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="ap-frame-foot">
                <span className="ap-sig">SEO <span className="blu">/</span> FOUNDER <span className="blu">/</span> 2026</span>
                <div className="ap-socials">
                  {author.linkedin_url && (
                    <a href={author.linkedin_url} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                    </a>
                  )}
                  {author.website_url && (
                    <a href={author.website_url} aria-label="Website" target="_blank" rel="noopener noreferrer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                    </a>
                  )}
                  {author.email && (
                    <a href={`mailto:${author.email}`} aria-label="Email">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </a>
                  )}
                  {author.phone && (
                    <a href={`tel:${author.phone}`} aria-label="Phone">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="ap-id">
            <div className="ap-role-tag">
              <span className="ap-role-dot" />
              {author.job_title || 'SEO Strategist'}
            </div>
            <h1>{author.name}</h1>
            <div className="ap-h1-sub">SEO that outlives Google updates.</div>
            {author.bio && <p className="ap-lead" dangerouslySetInnerHTML={{ __html: author.bio }} />}

            <div className="ap-stats">
              <div className="ap-stat">
                <div className="num">10<span className="blu">+</span></div>
                <div className="lbl">Years Experience</div>
              </div>
              <div className="ap-stat">
                <div className="num">{articles.length}</div>
                <div className="lbl">Articles Published</div>
              </div>
              <div className="ap-stat">
                <div className="num">{hasContent(author.expertise) ? author.expertise!.length : 8}</div>
                <div className="lbl">Areas of Expertise</div>
              </div>
            </div>

            <div className="ap-contact-row">
              {author.email && (
                <a href={`mailto:${author.email}`} className="ap-pill solid">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email {author.name.split(' ')[0]}
                </a>
              )}
              {author.linkedin_url && (
                <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="ap-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                  LinkedIn
                </a>
              )}
              {author.website_url && (
                <a href={author.website_url} target="_blank" rel="noopener noreferrer" className="ap-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  Website
                </a>
              )}
              {author.phone && (
                <a href={`tel:${author.phone}`} className="ap-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {author.phone}
                </a>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Articles + Sidebar */}
      <section className="ap-main">
        <div className="ap-grid">

          {/* Articles column */}
          <div>
            <div className="ap-articles-header">
              <div className="left">
                <div className="eyebrow">// Published Work</div>
                <h2>Latest Articles <span className="blue">by {author.name.split(' ')[0]}</span></h2>
                <p className="sub">Expert insights, research-backed playbooks, and case notes on SEO, internal linking, and the AI search shift.</p>
              </div>
              <div className="ap-meta">
                <span className="ap-chip">{articles.length} <span className="blue">/</span> POSTS</span>
              </div>
            </div>

            {articles.length > 0 ? (
              <div className="ap-list">
                {articles.map((article, index) => (
                  <article key={article.id} className="ap-article-card">
                    <div className="ap-article-img">
                      {index === 0 && <span className="ap-latest-flag">Latest</span>}
                      <span className="ap-article-idx">{String(index + 1).padStart(2, '0')}</span>
                      {article.featured_image && (
                        <Image src={article.featured_image} alt={article.featured_image_alt || article.title} fill style={{ objectFit: 'cover' }} unoptimized />
                      )}
                    </div>
                    <div className="ap-article-body">
                      {(article as any).category_name && (
                        <Link href={`/categories/${(article as any).category_slug}/`} className="ap-article-cat">
                          <span className="pdot" />
                          {(article as any).category_name}
                        </Link>
                      )}
                      <h3><Link href={`/blog/${article.slug}/`}>{article.title}</Link></h3>
                      {article.excerpt && <p>{article.excerpt}</p>}
                      <div className="ap-article-foot">
                        <time dateTime={article.published_at || article.created_at}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </time>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="ap-empty">
                <div className="ap-empty-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </div>
                <h3>Articles Coming Soon</h3>
                <p>{author.name} is working on publishing expert insights. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="ap-sidebar">

            {/* About */}
            <div className="ap-side-card">
              <div className="ap-side-inner">
                <div className="ap-side-head">
                  <h3>About {author.name.split(' ')[0]}</h3>
                  <span className="tag">// PROFILE</span>
                </div>
                {author.bio && <p>{author.bio.replace(/<[^>]*>/g, '')}</p>}
                <div className="ap-about-chips">
                  {author.location && (
                    <div className="ap-about-row">
                      <div className="ap-about-ico">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div><span className="k">Based in</span><span className="v">{author.location}</span></div>
                    </div>
                  )}
                  {author.job_title && (
                    <div className="ap-about-row">
                      <div className="ap-about-ico">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                      </div>
                      <div><span className="k">Title</span><span className="v">{author.job_title}</span></div>
                    </div>
                  )}
                  {author.company && (
                    <div className="ap-about-row">
                      <div className="ap-about-ico">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </div>
                      <div><span className="k">Company</span><span className="v">{author.company}</span></div>
                    </div>
                  )}
                  {author.education && (
                    <div className="ap-about-row">
                      <div className="ap-about-ico">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      </div>
                      <div><span className="k">Education</span><span className="v">{author.education}</span></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expertise */}
            {hasContent(author.expertise) && (
              <div className="ap-side-card">
                <div className="ap-side-inner">
                  <div className="ap-side-head">
                    <h3>Areas of Expertise</h3>
                    <span className="tag">// {author.expertise!.length} SKILLS</span>
                  </div>
                  <div className="ap-exp-grid">
                    {author.expertise!.map((skill) => (
                      <span key={skill} className="ap-exp-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Career */}
            {hasContent(author.career_highlights) && (
              <div className="ap-side-card">
                <div className="ap-side-inner">
                  <div className="ap-side-head">
                    <h3>Career Highlights</h3>
                    <span className="tag">// TIMELINE</span>
                  </div>
                  <div className="ap-career">
                    {author.career_highlights!.map((position: CareerHighlight, idx) => (
                      <div key={idx} className="ap-career-item">
                        {position.duration && <div className="when">{position.duration}</div>}
                        <div className="role">{position.title}</div>
                        {position.company && <div className="org">{position.company}</div>}
                        {position.description && <div className="desc">{position.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Get in touch */}
            {author.email && (
              <div className="ap-side-card dark">
                <div className="ap-side-inner">
                  <div className="ap-side-head">
                    <h3>Get in Touch</h3>
                    <span className="tag">// LET&apos;S TALK</span>
                  </div>
                  <p>Need expert advice or consultation? Let&apos;s discuss your project.</p>
                  <div className="ap-gt-actions">
                    <a href={`mailto:${author.email}`} className="ap-gt-btn primary">
                      <div className="lt">
                        <div className="ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                        <div><span className="meta">EMAIL {author.name.toUpperCase().split(' ')[0]}</span><span className="lbl">{author.email}</span></div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                    {author.phone && (
                      <a href={`tel:${author.phone}`} className="ap-gt-btn">
                        <div className="lt">
                          <div className="ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                          <div><span className="meta">CALL DIRECT</span><span className="lbl">{author.phone}</span></div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </a>
                    )}
                    {author.linkedin_url && (
                      <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="ap-gt-btn">
                        <div className="lt">
                          <div className="ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg></div>
                          <div><span className="meta">CONNECT</span><span className="lbl">LinkedIn Profile</span></div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

          </aside>
        </div>
      </section>
    </>
  )
}