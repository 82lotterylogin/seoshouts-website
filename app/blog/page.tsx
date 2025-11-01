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
  
  // Get unique categories from articles
  const articleCategories = articles.map((article: any) => article.category?.name).filter(Boolean);
  const uniqueCategories = Array.from(new Set(articleCategories));


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
              logo: {
                "@type": "ImageObject",
                url: "https://seoshouts.com/logo.png"
              }
            },
            blogPost: articles.map((article: any) => ({
              "@type": "BlogPosting",
              headline: article.title,
              description: article.excerpt || extractExcerpt(article.content),
              url: `https://seoshouts.com/blog/${article.slug}/`,
              datePublished: article.published_at || article.created_at,
              dateModified: article.updated_at,
              author: {
                "@type": "Person",
                name: article.author?.name || "SEO Shouts Team"
              },
              publisher: {
                "@type": "Organization",
                name: "SEO Shouts"
              },
              wordCount: safeWordCount(article.content),
              timeRequired: `PT${calculateReadTime(article.content)}M`,
              ...(article.featured_image && {
                image: {
                  "@type": "ImageObject",
                  url: `https://seoshouts.com${article.featured_image}`
                }
              })
            }))
          })
        }}
      />

      {/* Main Content */}
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                <span className="block">SEO Blog</span>
                <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Latest Insights & Tips
                </span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100 leading-relaxed">
                Stay ahead with cutting-edge SEO strategies, algorithm updates, and digital marketing insights from industry experts.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="#articles"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
                  >
                    Explore Articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            
            {/* Main Content - Articles */}
            <div className="lg:col-span-2" id="articles">
              {/* Categories Filter */}
              {uniqueCategories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/blog/"
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      All Posts ({articles.length})
                    </Link>
                    {uniqueCategories.map((category) => (
                      <Link
                        key={category}
                        href={`/blog?category=${encodeURIComponent(category)}`}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles List */}
              {articles.length > 0 ? (
                <div className="space-y-12">
                  {articles.map((article: any) => (
                    <article key={article.id} className="group">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-blue-200">
                        {article.featured_image && (
                          <div className="aspect-w-16 aspect-h-9">
                            <Image
                              src={article.featured_image}
                              alt={article.title}
                              width={800}
                              height={450}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-3">
                            {article.category && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {article.category.name}
                              </span>
                            )}
                            <time className="text-sm text-gray-500" dateTime={article.published_at || article.created_at}>
                              {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </time>
                          </div>
                          
                          <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            <Link href={`/blog/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h2>
                          
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {article.excerpt || extractExcerpt(article.content)}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {article.author?.avatar_url && (
                                  <Image
                                    src={article.author.avatar_url}
                                    alt={article.author.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full"
                                  />
                                )}
                                <span className="text-sm font-medium text-gray-900">
                                  {article.author?.name || 'SEO Shouts Team'}
                                </span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">
                                {calculateReadTime(article.content)} min read
                              </span>
                            </div>
                            <Link
                              href={`/blog/${article.slug}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                            >
                              Read More
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
                    <p className="mt-1 text-gray-500">Check back soon for new content!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="mt-12 lg:mt-0 space-y-8">
              <BlogSidebarSubscription />
              
              {/* Categories Section */}
              {categories.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category: any) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                          {category.name}
                        </span>
                        <span className="bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600 text-xs px-2 py-1 rounded-full">
                          {category.article_count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}