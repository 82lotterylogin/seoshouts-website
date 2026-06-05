import { notFound } from 'next/navigation';
import { calculateReadTime, extractExcerpt } from "../../lib/content-utils";
import BlogSidebarSubscription from "../../components/BlogSidebarSubscription";
import BlogArticleGrid from "../../blog/BlogArticleGrid";
import Link from 'next/link';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Fetch category by slug
async function fetchCategoryBySlug(slug: string) {
  try {
    const { getDatabase } = await import('../../lib/database');
    const db = getDatabase();
    
    const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as any;
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Fetch all categories for sidebar
async function fetchAllCategories() {
  try {
    const { getDatabase } = await import('../../lib/database');
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

// Fetch articles for a category
async function fetchCategoryArticles(categoryId: number, searchParams?: { [key: string]: string | string[] | undefined }) {
  try {
    const { getDatabase } = await import('../../lib/database');
    const db = getDatabase();
    
    const page = 1;
    const limit = 12;
    const search = searchParams?.search as string;
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clause - only published articles for this category
    let whereClause = 'WHERE a.status = ? AND a.category_id = ?';
    const params: any[] = ['published', categoryId];
    
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
    console.error('Error fetching category articles:', error);
    return { articles: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }
}

// Generate metadata for category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await fetchCategoryBySlug(resolvedParams.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found | SEO Shouts',
      description: 'The requested category could not be found.',
    };
  }

  const title = category.meta_title || `${category.name} Articles | SEO Shouts`;
  const description = category.meta_description || `Explore our latest articles about ${category.name}. ${category.description || ''}`.trim();

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: `https://seoshouts.com/categories/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://seoshouts.com/categories/${category.slug}`,
      siteName: 'SEO Shouts',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    // Always set robots meta to avoid duplicate tags
    robots: {
      index: !category.noindex,
      follow: !category.nofollow,
      nocache: true,
      googleBot: {
        index: !category.noindex,
        follow: !category.nofollow,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const category = await fetchCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const { articles } = await fetchCategoryArticles(category.id, resolvedSearchParams);

  // Fetch all categories for sidebar + filter rail
  const allCategories = await fetchAllCategories();

  // Average read time across articles
  const avgRead = articles.length > 0
    ? Math.round(articles.reduce((sum: number, a: any) => sum + calculateReadTime(a.content), 0) / articles.length)
    : 0;

  return (
    <>
      {/* ─── STRUCTURED DATA ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.name} Articles`,
            description: category.description || `Articles about ${category.name}`,
            url: `https://seoshouts.com/categories/${category.slug}`,
            publisher: {
              "@type": "Organization",
              name: "SEO Shouts",
              url: "https://seoshouts.com",
              logo: { "@type": "ImageObject", url: "https://seoshouts.com/logo.png" }
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: articles.length,
              itemListElement: articles.map((article: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Article",
                  headline: article.title,
                  description: article.excerpt || extractExcerpt(article.content),
                  url: `https://seoshouts.com/blog/${article.slug}`,
                  datePublished: article.published_at || article.created_at,
                  dateModified: article.updated_at,
                  author: { "@type": "Person", name: article.author?.name || "SEO Shouts Team" },
                  publisher: { "@type": "Organization", name: "SEO Shouts" }
                }
              }))
            }
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
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://seoshouts.com/blog/" },
              { "@type": "ListItem", position: 3, name: category.name, item: `https://seoshouts.com/categories/${category.slug}/` }
            ]
          })
        }}
      />

      {/* ─── BREADCRUMBS ─── */}
      <div className="crumbs">
        <div className="crumbs-inner">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/blog/">Blog</Link>
          <span className="sep">/</span>
          <span className="current">{category.name}</span>
        </div>
      </div>

      {/* ─── PAGE HERO ─── */}
      <section className="phero">
        <div className="phero-bg-grid" />
        <div className="phero-inner">

          {/* Left: category info */}
          <div>
            <div className="phero-tag">
              <span className="dot" />
              SEOShouts Editorial — Category
            </div>
            <h1>
              {category.name}
              <span className="blue">Articles &amp; Guides</span>
            </h1>
            {category.description ? (
              <p className="lead">{category.description}</p>
            ) : (
              <p className="lead">
                In-depth articles, practical guides, and expert analysis on{' '}
                <strong>{category.name}</strong> — curated by the SEOShouts team.
              </p>
            )}
            <div className="phero-ctas">
              <Link href="/blog/" className="btn-outline">
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                All Articles
              </Link>
              <Link href="/newsletter/" className="btn-primary">
                Subscribe Free
              </Link>
            </div>
          </div>

          {/* Right: stats card */}
          <div className="phero-card">
            <div className="phero-card-head">
              <span className="phero-card-title">category.index</span>
              <span className="phero-card-live"><span className="live-dot" />LIVE</span>
            </div>
            <div className="phero-card-body">
              <div className="phero-card-row">
                <span className="pck">Category</span>
                <span className="pcv" style={{ fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, letterSpacing: '0.04em' }}>
                  {category.name.toUpperCase()}
                </span>
              </div>
              <div className="phero-card-row">
                <span className="pck">Articles</span>
                <span className="pcv">{articles.length}<span className="blu">.</span></span>
              </div>
              {avgRead > 0 && (
                <div className="phero-card-row">
                  <span className="pck">Avg. Read</span>
                  <span className="pcv">{avgRead}<span className="blu">min</span></span>
                </div>
              )}
              {articles[0] && (
                <div className="phero-card-row">
                  <span className="pck">Latest</span>
                  <span className="pcv" style={{ fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                    {new Date(articles[0].published_at || articles[0].created_at)
                      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="map-card-foot">
              <div className="pcf-cell">
                <div className="pcf-num">{articles.length}</div>
                <div className="pcf-label">Articles</div>
              </div>
              <div className="pcf-cell">
                <div className="pcf-num">Free</div>
                <div className="pcf-label">Always</div>
              </div>
              <div className="pcf-cell">
                <div className="pcf-num">{avgRead > 0 ? `${avgRead}m` : '—'}</div>
                <div className="pcf-label">Avg. Read</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── CATEGORY FILTER RAIL ─── */}
      <div className="filter-rail">
        <div className="filter-inner">
          <span className="filter-label">Browse by Category</span>
          <div className="filter-chips">
            <Link href="/blog/" className="fchip">
              All Posts
            </Link>
            {(allCategories as any[]).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}/`}
                className={`fchip${cat.id === category.id ? ' active' : ''}`}
              >
                {cat.name}
                <span className="count">{cat.article_count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN SHELL ─── */}
      <div className="blog-shell" id="articles">

        {/* Articles — identical rendering to /blog/ page */}
        <div>
          <BlogArticleGrid
            articles={articles}
            initialCount={articles.length}
            batchSize={12}
          />
        </div>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          <BlogSidebarSubscription />

          {(allCategories as any[]).length > 0 && (
            <div className="cats-card">
              <div className="cats-head">
                <svg className="tag-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <h3>All Categories</h3>
              </div>
              <div className="cats-list">
                {(allCategories as any[]).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}/`}
                    className="cat-row"
                    style={cat.id === category.id
                      ? { background: 'var(--blue-pale)', color: 'var(--blue-dark)' }
                      : {}
                    }
                  >
                    <span>{cat.name}</span>
                    <span
                      className="cat-count"
                      style={cat.id === category.id
                        ? { background: 'var(--blue)', color: '#fff', borderColor: 'transparent' }
                        : {}
                      }
                    >
                      {cat.article_count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </>
  );
}