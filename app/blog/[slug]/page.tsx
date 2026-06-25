// app/blog/[slug]/page.tsx
import { calculateReadTime, extractExcerpt } from "../../lib/content-utils";
import { getMultipleViewCounts } from "../../lib/firebase";
import { getDatabase } from "../../lib/database";
import { sanitizeHTML } from "../../lib/security";
import { extractFAQs, generateFAQSchema } from "../../lib/faq-utils";
import ViewTracker from "../../components/ViewTracker";
import ReadingProgress from "../../components/ReadingProgress";
import TableOfContents from "../../components/TableOfContents";
import SocialShare from "../../components/SocialShare";
import AuthorBio from "../../components/AuthorBio";
import BlogNewsletterForm from "../../components/BlogNewsletterForm";
import BlogSidebarSubscription from "../../components/BlogSidebarSubscription";
import RelatedPosts from "../../components/RelatedPosts";
import Link from 'next/link';
import type { Metadata } from 'next';

// Allow all dynamic params - no static generation for now
export const dynamicParams = true;

// Fetch single article by slug
async function fetchArticle(slug: string) {
  try {
    const db = getDatabase();

    const article = db.prepare(`
      SELECT
        a.*,
        auth.name as author_name,
        auth.email as author_email,
        auth.bio as author_bio,
        auth.avatar_url as author_avatar_url,
        auth.job_title as author_job_title,
        auth.location as author_location,
        auth.linkedin_url as author_linkedin_url,
        auth.company as author_company,
        c.name as category_name,
        c.slug as category_slug,
        c.description as category_description
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ? AND a.status = 'published'
    `).get(slug) as any;

    if (!article) {
      return null;
    }

    // Get tags for the article
    const tags = db.prepare('SELECT tag FROM article_tags WHERE article_id = ?').all(article.id) as { tag: string }[];

    return {
      ...article,
      author: {
        id: article.author_id,
        name: article.author_name,
        email: article.author_email,
        bio: article.author_bio,
        avatar_url: article.author_avatar_url,
        job_title: article.author_job_title,
        location: article.author_location,
        linkedin_url: article.author_linkedin_url,
        company: article.author_company,
        created_at: '',
        updated_at: ''
      },
      category: {
        id: article.category_id,
        name: article.category_name,
        slug: article.category_slug,
        description: article.category_description,
        created_at: '',
        updated_at: ''
      },
      tags: tags.map(t => t.tag)
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch related articles
async function fetchRelatedArticles(categoryId: number, currentSlug: string, limit = 3) {
  try {
    const db = getDatabase();

    const relatedArticles = db.prepare(`
      SELECT
        a.id, a.title, a.slug, a.excerpt, a.featured_image, a.featured_image_alt,
        a.published_at, a.created_at,
        auth.name as author_name,
        c.name as category_name
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.category_id = ? AND a.slug != ? AND a.status = 'published'
      ORDER BY a.published_at DESC, a.created_at DESC
      LIMIT ?
    `).all(categoryId, currentSlug, limit) as any[];

    return relatedArticles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

const BA_CSS = `
/* ── Blog Article (ba-) ─────────────────────────────────── */
@keyframes ba-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* Art Hero */
.ba-art-hero { background: var(--ink); padding: 4rem 2rem 3rem; position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.07); }
.ba-art-hero-grid { position: absolute; inset: 0; pointer-events: none; opacity: 0.4; background-image: linear-gradient(rgba(37,99,235,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.18) 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 70% 80% at 50% 40%, #000 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 40%, #000 30%, transparent 80%); }
.ba-art-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 2; }
.ba-cat-pill { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue-light); border: 1px solid rgba(37,99,235,0.4); padding: 5px 12px; margin-bottom: 1.5rem; }
.ba-cat-pill .ba-dot { width: 5px; height: 5px; background: var(--blue-light); border-radius: 50%; animation: ba-blink 1.8s infinite; }
.ba-art-hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 700; color: #fff; line-height: 1.08; letter-spacing: -0.03em; margin-bottom: 2rem; max-width: 980px; }
.ba-meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); }
.ba-meta-cell { padding: 14px 20px; border-right: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px; min-width: 0; }
.ba-meta-cell:last-child { border-right: none; }
.ba-meta-cell.ba-author-cell { background: rgba(37,99,235,0.06); }
.ba-meta-cell img { width: 40px; height: 40px; border-radius: 50%; background: var(--gray-2); object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.15); }
.ba-meta-ico { width: 34px; height: 34px; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: var(--blue-light); flex-shrink: 0; background: rgba(37,99,235,0.07); }
.ba-meta-k { display: block; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--gray-4); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
.ba-meta-v { font-size: 0.9rem; font-weight: 600; color: #fff; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ba-meta-v.ba-mono { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; font-weight: 500; }

/* Hero image bleed */
.ba-hero-img-wrap { max-width: 1100px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 3; transform: translateY(-2rem); }
.ba-hero-img { position: relative; border: 1px solid var(--line); background: var(--gray-1); aspect-ratio: 16/9; max-height: 520px; overflow: hidden; }
.ba-hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ba-hero-img-caption { position: absolute; bottom: 0; left: 0; background: var(--ink); color: var(--gray-3); font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 6px 12px; letter-spacing: 0.06em; text-transform: uppercase; }
.ba-hero-img-caption span { color: var(--blue-light); }

/* Article shell */
.ba-article-shell { max-width: 1280px; margin: 0 auto; padding: 1.5rem 2rem 4rem; display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 4rem; }
.ba-toc-sidebar { min-width: 0; }
.ba-toc-stack { position: sticky; top: 120px; display: flex; flex-direction: column; gap: 1.25rem; }

/* Article content typography — Source Serif 4 */
.ba-article-content { font-family: 'Source Serif 4', Georgia, serif; font-size: 1.125rem; line-height: 1.78; color: var(--ink-3); max-width: 760px; min-width: 0; width: 100%; overflow-x: hidden; }
.ba-article-content > * + * { margin-top: 1.4rem; }
.ba-article-content p { letter-spacing: -0.005em; }
.ba-article-content p strong { color: var(--ink); font-weight: 700; }
.ba-article-content a { color: var(--blue); text-decoration: underline; text-decoration-color: rgba(37,99,235,0.35); text-underline-offset: 3px; text-decoration-thickness: 1px; transition: text-decoration-color 0.15s; }
.ba-article-content a:hover { text-decoration-color: var(--blue); }
.ba-lede { font-family: 'Source Serif 4', Georgia, serif; font-size: 1.32rem; line-height: 1.55; color: var(--ink); font-weight: 500; letter-spacing: -0.015em; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--line); }
.ba-article-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: var(--ink); line-height: 1.18; letter-spacing: -0.025em; margin-top: 3.5rem; margin-bottom: 1.25rem; scroll-margin-top: 130px; border-top: none !important; padding-top: 0 !important; }
.ba-article-content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.32rem; font-weight: 700; color: var(--ink); line-height: 1.3; letter-spacing: -0.02em; margin-top: 2.4rem; margin-bottom: 1rem; scroll-margin-top: 130px; }
.ba-article-content ul, .ba-article-content ol { display: flex; flex-direction: column; gap: 12px; margin-left: 0; list-style: none; padding: 0; }
.ba-article-content ul li, .ba-article-content ol li { font-size: 1.08rem; line-height: 1.7; color: var(--ink-3); padding-left: 1.5rem; position: relative; margin-top: 0 !important; margin-bottom: 0 !important; }
.ba-article-content ul > li::before { content: ''; position: absolute; left: 0; top: 0.72em; width: 6px; height: 6px; background: var(--blue); border-radius: 50%; }
.ba-article-content ol { counter-reset: ba-olc; }
.ba-article-content ol > li { counter-increment: ba-olc; }
.ba-article-content ol > li::before { content: counter(ba-olc) "."; position: absolute; left: 0; top: 0; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: var(--blue); font-size: 0.95rem; }
.ba-article-content p code, .ba-article-content li code { background: var(--gray-1); padding: 1px 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.88em; color: var(--ink); border: 1px solid var(--line); }
.ba-article-content blockquote { background: var(--ink); color: #fff; padding: 1.5rem 1.75rem; border-left: 4px solid var(--blue); font-family: 'Inter', sans-serif; font-size: 1.02rem; line-height: 1.65; margin: 2rem 0; }
.ba-article-content blockquote strong { color: #fff; font-weight: 700; }
.ba-article-content blockquote p { color: rgba(255,255,255,0.9); letter-spacing: 0; }
.ba-article-content pre { background: var(--ink); border: 1px solid rgba(255,255,255,0.1); padding: 1.1rem 1.25rem; overflow-x: auto; margin: 1.5rem 0; max-width: 100%; -webkit-overflow-scrolling: touch; }
.ba-article-content pre code { font-family: 'JetBrains Mono', monospace; font-size: 0.88rem; color: #e2e5ee; line-height: 1.7; white-space: pre; background: none; border: none; padding: 0; }
/* display:block on <table> preserves border-collapse in modern browsers; overflow-x:auto enables scroll */
.ba-article-content table { width: 100%; border-collapse: collapse !important; font-family: 'Inter', sans-serif; font-size: 0.88rem; margin: 1.75rem 0; display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--line); }
.ba-article-content thead { background: var(--ink) !important; color: #fff !important; }
.ba-article-content th { padding: 12px 14px !important; text-align: left !important; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem !important; font-weight: 600 !important; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.85) !important; border-right: 1px solid rgba(255,255,255,0.08) !important; border-bottom: none !important; white-space: nowrap; vertical-align: middle; }
.ba-article-content td { padding: 11px 14px !important; border-bottom: 1px solid var(--line) !important; border-right: 1px solid var(--line) !important; color: var(--ink-3); vertical-align: top; line-height: 1.5; }
.ba-article-content td:last-child, .ba-article-content th:last-child { border-right: none !important; }
.ba-article-content tr:last-child td { border-bottom: none !important; }
.ba-article-content img { max-width: 100%; display: block; border: 1px solid var(--line); }

/* Continue CTA */
.ba-continue-cta { background: var(--ink); padding: 4rem 2rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.07); position: relative; overflow: hidden; }
.ba-continue-cta::before { content: ''; position: absolute; inset: 0; opacity: 0.3; pointer-events: none; background-image: linear-gradient(rgba(37,99,235,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.22) 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 70% 90% at 50% 50%, #000 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse 70% 90% at 50% 50%, #000 30%, transparent 80%); }
.ba-continue-inner { position: relative; max-width: 720px; margin: 0 auto; }
.ba-continue-inner h2 { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: #fff; letter-spacing: -0.025em; margin-bottom: 0.75rem; }
.ba-continue-inner p { font-size: 1rem; color: rgba(255,255,255,0.65); margin-bottom: 1.75rem; line-height: 1.65; }
.ba-continue-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

@media (max-width: 1100px) {
  .ba-article-shell { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
  .ba-toc-sidebar { display: none; }
  .ba-toc-stack { display: none; }
  .ba-article-content { max-width: 100%; }
}
@media (max-width: 900px) {
  .ba-art-hero { padding: 3rem 1.25rem 2.5rem; }
  .ba-art-hero h1 { font-size: clamp(1.6rem, 5vw, 2.4rem); margin-bottom: 1.5rem; }
  .ba-meta-grid { grid-template-columns: 1fr 1fr; }
  .ba-meta-cell { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .ba-meta-cell:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.08) !important; }
  .ba-meta-cell:nth-child(3), .ba-meta-cell:nth-child(4) { border-bottom: none; }
  .ba-hero-img-wrap { padding: 0 1.25rem; }
  .ba-continue-inner h2 { font-size: 1.6rem; }
}
@media (max-width: 640px) {
  .ba-art-hero { padding: 2.5rem 1rem 2rem; }
  .ba-art-hero h1 { font-size: clamp(1.35rem, 5.5vw, 1.9rem); }
  .ba-cat-pill { font-size: 0.62rem; padding: 4px 10px; }
  /* Meta grid stays 2-col on all mobile sizes — matches design */
  .ba-meta-grid { grid-template-columns: 1fr 1fr; }
  .ba-meta-cell { padding: 11px 14px; }
  .ba-meta-cell:nth-child(3) { border-bottom: none; }
  .ba-meta-cell:nth-child(4) { border-bottom: none; }
  .ba-meta-v { font-size: 0.82rem; }
  .ba-meta-v.ba-mono { font-size: 0.75rem; }
  .ba-hero-img-wrap { padding: 0 1rem; transform: translateY(-1.25rem); }
  .ba-article-shell { padding: 0.75rem 1rem 2.5rem; }
  .ba-article-content { font-size: 1rem; }
  .ba-lede { font-size: 1.08rem; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
  .ba-article-content h2 { font-size: 1.5rem; margin-top: 2.5rem; }
  .ba-article-content h3 { font-size: 1.12rem; margin-top: 1.75rem; }
  .ba-article-content ul li, .ba-article-content ol li { font-size: 1rem; }
  .ba-article-content blockquote { padding: 1.1rem 1.25rem; font-size: 0.95rem; }
  .ba-article-content pre { padding: 0.875rem 1rem; font-size: 0.82rem; margin: 1.25rem 0; }
  .ba-continue-cta { padding: 3rem 1rem; }
  .ba-continue-inner h2 { font-size: 1.45rem; }
  .ba-continue-inner p { font-size: 0.92rem; }
  .ba-continue-btns { flex-direction: column; align-items: center; }
}
`

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return (
      <div style={{ background: 'var(--ink)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--blue-light)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>404 &mdash; Not Found</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', marginBottom: '1rem' }}>Article Not Found</h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: '2rem' }}>
            The article you are looking for could not be found. It may have been moved or deleted.
          </p>
          <Link href="/blog/" className="btn-primary">
            Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = await fetchRelatedArticles(article.category_id, slug);
  const readTime = calculateReadTime(article.content);

  // Get view counts
  const viewCounts = await getMultipleViewCounts([slug]);
  const viewCount = viewCounts[slug] || 0;

  // Extract FAQs from content for dynamic FAQ schema generation
  const faqs = extractFAQs(article.content);
  const faqSchema = generateFAQSchema(faqs);

  const publishedDate = new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      {/* Source Serif 4 font for article body */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: BA_CSS }} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.meta_description || article.excerpt || extractExcerpt(article.content, 160),
            "image": article.featured_image ? [article.featured_image] : [],
            "datePublished": article.published_at || article.created_at,
            "dateModified": article.updated_at || article.published_at || article.created_at,
            "author": {
              "@type": "Person",
              "name": article.author.name,
              "url": `https://seoshouts.com/authors/${article.author.name.toLowerCase().replace(/\s+/g, '-')}/`,
              "jobTitle": article.author.job_title,
              "email": article.author.email
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://seoshouts.com/logo.png",
                "width": 600,
                "height": 60
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://seoshouts.com/blog/${slug}/`
            },
            "keywords": article.tags?.join(', '),
            "articleSection": article.category.name,
            "wordCount": article.content.split(/\s+/).length
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seoshouts.com/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://seoshouts.com/blog/" },
              { "@type": "ListItem", "position": 3, "name": article.category.name, "item": `https://seoshouts.com/categories/${article.category.slug}/` },
              { "@type": "ListItem", "position": 4, "name": article.title, "item": `https://seoshouts.com/blog/${slug}/` }
            ]
          })
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Fixed Elements */}
      <ReadingProgress />
      <ViewTracker articleSlug={slug} />

      {/* Breadcrumbs */}
      <div className="crumbs">
        <div className="crumbs-inner">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <a href="/blog/">Blog</a>
          <span className="sep">/</span>
          <span className="current">{article.category.name}</span>
        </div>
      </div>

      {/* Article Hero */}
      <section className="ba-art-hero">
        <div className="ba-art-hero-grid" />
        <div className="ba-art-hero-inner">
          <div className="ba-cat-pill">
            <span className="ba-dot" />
            {article.category.name}
          </div>
          <h1>{article.title}</h1>
          <div className="ba-meta-grid">
            <div className="ba-meta-cell ba-author-cell">
              {article.author.avatar_url ? (
                <img src={article.author.avatar_url} alt={article.author.name} width={40} height={40} />
              ) : (
                <div style={{ width: 40, height: 40, background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>
                  {article.author.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
              )}
              <div>
                <span className="ba-meta-k">Written by</span>
                <span className="ba-meta-v">{article.author.name}</span>
              </div>
            </div>
            <div className="ba-meta-cell">
              <div className="ba-meta-ico">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <span className="ba-meta-k">Published</span>
                <span className="ba-meta-v ba-mono">{publishedDate}</span>
              </div>
            </div>
            <div className="ba-meta-cell">
              <div className="ba-meta-ico">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <span className="ba-meta-k">Reading Time</span>
                <span className="ba-meta-v ba-mono">{readTime} min read</span>
              </div>
            </div>
            <div className="ba-meta-cell">
              <div className="ba-meta-ico">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div>
                <span className="ba-meta-k">Category</span>
                <span className="ba-meta-v">{article.category.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image — bleeds below hero */}
      {article.featured_image && (
        <div className="ba-hero-img-wrap">
          <div className="ba-hero-img">
            <img
              src={article.featured_image}
              alt={article.featured_image_alt || article.title}
              width={1280}
              height={720}
            />
          </div>
        </div>
      )}

      {/* Article Shell: content + sidebar */}
      <div className="ba-article-shell">

        <article className="prose prose-lg max-w-none ba-article-content" id="article">
          {article.excerpt && (
            <p className="ba-lede">{article.excerpt}</p>
          )}
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }} />

          {/* Inline Newsletter */}
          <div style={{ marginTop: '2.5rem' }}>
            <BlogNewsletterForm />
          </div>

          {/* Author Bio */}
          <div style={{ marginTop: '1.5rem' }}>
            <AuthorBio author={{
              content: {
                name: article.author.name,
                slug: article.author.name.toLowerCase().replace(/\s+/g, '-'),
                picture: { filename: article.author.avatar_url },
                email: article.author.email,
                linkedin_url: article.author.linkedin_url,
                twitter_url: article.author.twitter_url,
                website_url: article.author.website_url,
                bio: article.author.bio,
                job_title: article.author.job_title
              }
            }} />
          </div>
        </article>

        {/* Sidebar — aside stretches to full article height, inner div is sticky */}
        <aside className="ba-toc-sidebar">
          <div className="ba-toc-stack">
            <TableOfContents content={article.content} />
            <SocialShare title={article.title} slug={slug} />
            <BlogSidebarSubscription />
          </div>
        </aside>

      </div>

      {/* Mobile TOC */}
      <div className="lg:hidden">
        <TableOfContents content={article.content} />
      </div>

      {/* Related Posts */}
      <RelatedPosts
        currentSlug={article.slug}
        category={article.category.name}
        categorySlug={article.category.slug}
        categoryId={article.category.id}
      />

      {/* Continue CTA */}
      <section className="ba-continue-cta">
        <div className="ba-continue-inner">
          <h2>Continue Your SEO Journey</h2>
          <p>Discover more expert insights, proven strategies, and actionable tips to dominate search rankings.</p>
          <div className="ba-continue-btns">
            <Link href="/blog/" className="btn-primary">
              Explore All Articles
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link href="/newsletter/" className="btn-outline">
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found | SEO Shouts',
      description: 'The article you are looking for could not be found.',
    };
  }

  return {
    title: article.meta_title || `${article.title} | SEO Shouts`,
    description: article.meta_description || article.excerpt || extractExcerpt(article.content, 160),
    keywords: article.tags?.join(', '),
    authors: [{ name: article.author.name }],
    metadataBase: new URL('https://seoshouts.com'),
    alternates: {
      canonical: `https://seoshouts.com/blog/${slug}/`,
    },
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || extractExcerpt(article.content, 160),
      images: article.featured_image ? [{
        url: article.featured_image,
        alt: article.featured_image_alt || article.title,
        width: 1200,
        height: 630
      }] : [],
      type: 'article',
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at || article.published_at || article.created_at,
      authors: [article.author.name],
      tags: article.tags,
      section: article.category.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || extractExcerpt(article.content, 160),
      images: article.featured_image ? [article.featured_image] : [],
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
    other: {
      'robots': 'max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
  };
}
