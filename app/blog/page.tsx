// app/blog/page.tsx
import { calculateReadTime, extractExcerpt } from "../lib/content-utils";
import BlogSidebarSubscription from "../components/BlogSidebarSubscription";
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

// COMPREHENSIVE SEO METADATA
export const metadata: Metadata = {
  title: 'SEO Blog - Latest Insights, Tips & Strategies | SEO Shouts',
  description: 'Get the latest SEO insights, expert articles, and actionable tips from SEO professionals. Stay updated with cutting-edge SEO strategies, algorithm updates, and digital marketing trends.',
  keywords: 'SEO blog, SEO insights, SEO articles, SEO tips, SEO strategies, digital marketing blog, search engine optimization, SEO news, SEO techniques, SEO best practices',
  authors: [{ name: 'SEO Shouts Team' }],
  creator: 'SEO Shouts',
  publisher: 'SEO Shouts',
  category: 'SEO & Digital Marketing',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/blog/',
  },
  openGraph: {
    title: 'SEO Blog - Latest Insights, Tips & Strategies | SEO Shouts',
    description: 'Get the latest SEO insights, expert articles, and actionable tips from SEO professionals. Stay updated with cutting-edge SEO strategies and digital marketing trends.',
    url: 'https://seoshouts.com/blog/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Blog - Latest Insights, Tips & Strategies',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Blog - Latest Insights, Tips & Strategies | SEO Shouts',
    description: 'Get the latest SEO insights, expert articles, and actionable tips from SEO professionals. Stay updated with cutting-edge SEO strategies and digital marketing trends.',
    images: ['https://seoshouts.com/blog-og-image.jpg'],
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
};

// Fetch blog articles from our database
async function fetchBlogArticles(searchParams?: { [key: string]: string | string[] | undefined }) {
  try {
    const { getDatabase } = await import('../lib/database');
    const db = getDatabase();
    
    const page = 1;
    const limit = 12;
    const category = searchParams?.category as string;
    const search = searchParams?.search as string;
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clause - only published articles
    let whereClause = 'WHERE a.status = ?';
    const params: any[] = ['published'];
    
    if (category) {
      whereClause += ' AND c.name = ?';
      params.push(category);
    }
    
    if (search) {
      whereClause += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }
    
    // Get published articles with relations
    const articlesQuery = `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.content,
        a.featured_image,
        a.meta_title,
        a.meta_description,
        a.published_at,
        a.created_at,
        a.updated_at,
        auth.name as author_name,
        auth.slug as author_slug,
        auth.bio as author_bio,
        auth.avatar_url as author_avatar_url,
        c.name as category_name,
        c.slug as category_slug
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      ${whereClause}
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const articles = db.prepare(articlesQuery).all([...params, limit, offset]) as any[];
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      ${whereClause}
    `;
    
    const { total } = db.prepare(countQuery).get(params) as { total: number };
    
    // Get tags for each article
    const articlesWithTags = articles.map(article => {
      const tags = db.prepare('SELECT tag FROM article_tags WHERE article_id = ?').all(article.id) as { tag: string }[];
      
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featured_image: article.featured_image,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        published_at: article.published_at,
        created_at: article.created_at,
        updated_at: article.updated_at,
        author: {
          name: article.author_name,
          slug: article.author_slug,
          bio: article.author_bio,
          avatar_url: article.author_avatar_url,
        },
        category: {
          name: article.category_name,
          slug: article.category_slug,
        },
        tags: tags.map(t => t.tag)
      };
    });
    
    return {
      articles: articlesWithTags,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return { articles: [], total: 0 };
  }
}

// Fetch categories from our database
async function fetchCategories() {
  try {
    // Use direct database access to avoid authentication issues
    const { getDatabase } = await import('../lib/database');
    const db = getDatabase();
    
    const categories = db.prepare(`
      SELECT 
        c.*,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

function safeWordCount(content: any): number {
  if (typeof content === 'string') {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }
  
  if (typeof content === 'object') {
    // Handle rich text format from Storyblok
    if (content.content && Array.isArray(content.content)) {
      let textContent = '';
      const extractText = (nodes: any[]): string => {
        return nodes.map(node => {
          if (node.type === 'text') {
            return node.text || '';
          }
          if (node.content && Array.isArray(node.content)) {
            return extractText(node.content);
          }
          return '';
        }).join(' ');
      };
      textContent = extractText(content.content);
      return textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
    
    // Try to stringify and count if it's a different object format
    try {
      const stringified = JSON.stringify(content);
      return stringified.split(/\s+/).length;
    } catch {
      return 1000; // Fallback
    }
  }
  
  return 1000; // Default fallback
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const { articles } = await fetchBlogArticles(resolvedSearchParams);
  const categories = await fetchCategories();
  const activeCategory = resolvedSearchParams.category as string | undefined;

  return (
    <>
      {/* COMPREHENSIVE STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "SEO Shouts Blog",
            description: "Latest SEO insights, tips, and strategies from industry experts",
            url: "https://seoshouts.com/blog/",
            publisher: {
              "@type": "Organization",
              name: "SEO Shouts",
              url: "https://seoshouts.com/",
              logo: { "@type": "ImageObject", url: "https://seoshouts.com/logo.png" }
            },
            blogPost: articles.map((article: any) => ({
              "@type": "BlogPosting",
              headline: article.title,
              description: article.excerpt || extractExcerpt(article.content),
              url: `https://seoshouts.com/blog/${article.slug}/`,
              datePublished: article.published_at || article.created_at,
              dateModified: article.updated_at,
              author: { "@type": "Person", name: article.author?.name || "SEO Shouts Team" },
              publisher: { "@type": "Organization", name: "SEO Shouts" },
              wordCount: safeWordCount(article.content),
              timeRequired: `PT${calculateReadTime(article.content)}M`,
              ...(article.featured_image && { image: { "@type": "ImageObject", url: `https://seoshouts.com${article.featured_image}` } })
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://seoshouts.com/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://seoshouts.com/blog/" }
            ]
          })
        }}
      />

      {/* ─── BREADCRUMBS ─── */}
      <div className="crumbs">
        <div className="crumbs-inner">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <span className="current">Blog</span>
        </div>
      </div>

      {/* ─── PAGE HERO ─── */}
      <section className="phero">
        <div className="phero-bg-grid" />
        <div className="phero-inner">
          <div>
            <div className="phero-tag">
              <span className="dot" />
              The SEOShouts Editorial
            </div>
            <h1>
              SEO Blog
              <span className="blue">Latest Insights &amp; Tips</span>
            </h1>
            <p className="lead">
              Stay ahead with <strong>cutting-edge SEO strategies</strong>, algorithm updates, and digital marketing insights from industry experts.
            </p>
            <div className="phero-ctas">
              <a href="#articles" className="btn-blue">
                Explore Articles
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a href="/newsletter/" className="btn-ghost-light">Subscribe Free</a>
            </div>
          </div>

          <div className="phero-card">
            <div className="phero-card-head">
              <span className="phero-card-title">editorial.feed</span>
              <span className="phero-card-live"><span className="live-dot" />LIVE</span>
            </div>
            <div className="phero-card-body">
              <div className="phero-card-row">
                <span className="pck">Published</span>
                <span className="pcv">{articles.length}<span className="blu">.</span></span>
              </div>
              <div className="phero-card-row">
                <span className="pck">Categories</span>
                <span className="pcv">{(categories as any[]).length}<span className="blu">.</span></span>
              </div>
              <div className="phero-card-row">
                <span className="pck">Avg. Read</span>
                <span className="pcv">11<span className="blu">min</span></span>
              </div>
              {articles[0] && (
                <div className="phero-card-row">
                  <span className="pck">Latest</span>
                  <span className="pcv" style={{ fontSize: '0.82rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                    {new Date(articles[0].published_at || articles[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="phero-card-foot">
              <span>// updated weekly</span>
              <span>RSS ↗</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTER RAIL ─── */}
      <div className="filter-rail">
        <div className="filter-inner">
          <span className="filter-label">Browse by Category</span>
          <div className="filter-chips">
            <a href="/blog/" className={`fchip${!activeCategory ? ' active' : ''}`}>
              All Posts <span className="count">{articles.length}</span>
            </a>
            {(categories as any[]).map((cat) => (
              <a
                key={cat.id}
                href={`/blog/?category=${encodeURIComponent(cat.name)}`}
                className={`fchip${activeCategory === cat.name ? ' active' : ''}`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BLOG SHELL ─── */}
      <div className="blog-shell" id="articles">

        {/* Articles */}
        <div className="articles">
          {articles.length > 0 ? articles.map((article: any, index: number) => {
            const dateStr = new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const dateIso = article.published_at || article.created_at;
            const excerpt = article.excerpt || extractExcerpt(article.content);
            const readTime = calculateReadTime(article.content);

            if (index === 0) {
              return (
                <article key={article.id} className="feat-card">
                  <div className="feat-img">
                    <span className="feat-ribbon">★ Latest</span>
                    {article.featured_image && (
                      <Image src={article.featured_image} alt={article.title} width={800} height={600} priority style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div className="feat-body">
                    <div className="feat-meta">
                      {article.category && (
                        <a href={`/categories/${article.category.slug}/`} className="cat-pill">{article.category.name}</a>
                      )}
                      <time className="feat-date" dateTime={dateIso}>{dateStr}</time>
                    </div>
                    <h2>
                      <Link href={`/blog/${article.slug}/`}>{article.title}</Link>
                    </h2>
                    <p className="feat-excerpt">{excerpt}</p>
                    <div className="author-row">
                      {article.author?.avatar_url && (
                        <Image src={article.author.avatar_url} alt={article.author.name || ''} width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      {article.author?.slug ? (
                        <a href={`/authors/${article.author.slug}/`} className="author-name">{article.author.name}</a>
                      ) : (
                        <span className="author-name">{article.author?.name || 'SEOShouts'}</span>
                      )}
                      <span className="author-dot">•</span>
                      <span className="author-read">{readTime}&nbsp;min read</span>
                    </div>
                  </div>
                </article>
              )
            }

            return (
              <article key={article.id} className="art-card">
                <div className="art-img">
                  {article.featured_image && (
                    <Image src={article.featured_image} alt={article.title} width={560} height={350} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div className="art-body">
                  <div className="art-meta">
                    {article.category && (
                      <a href={`/categories/${article.category.slug}/`} className="cat-pill">{article.category.name}</a>
                    )}
                    <time className="feat-date" dateTime={dateIso}>{dateStr}</time>
                  </div>
                  <h2>
                    <Link href={`/blog/${article.slug}/`}>{article.title}</Link>
                  </h2>
                  <p className="art-excerpt">{excerpt}</p>
                  <div className="author-row">
                    {article.author?.avatar_url && (
                      <Image src={article.author.avatar_url} alt={article.author.name || ''} width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    {article.author?.slug ? (
                      <a href={`/authors/${article.author.slug}/`} className="author-name">{article.author.name}</a>
                    ) : (
                      <span className="author-name">{article.author?.name || 'SEOShouts'}</span>
                    )}
                    <span className="author-dot">•</span>
                    <span className="author-read">{readTime}&nbsp;min read</span>
                  </div>
                </div>
              </article>
            )
          }) : (
            <div className="blog-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No articles found. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          <BlogSidebarSubscription />

          {(categories as any[]).length > 0 && (
            <div className="cats-card">
              <div className="cats-head">
                <svg className="tag-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <h3>Categories</h3>
              </div>
              <div className="cats-list">
                {(categories as any[]).map((cat) => (
                  <a key={cat.id} href={`/categories/${cat.slug}/`} className="cat-row">
                    <span>{cat.name}</span>
                    <span className="cat-count">{cat.article_count}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </>
  )
}