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

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            The article you're looking for couldn't be found. It might have been moved or deleted.
          </p>
          <Link 
            href="/blog/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 no-underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
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

  return (
    <div className="bg-white min-h-screen">
      {/* Google Discover Optimization: Article Structured Data */}
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

      {/* Google Discover Optimization: Breadcrumb Structured Data */}
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
                "name": "Blog",
                "item": "https://seoshouts.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": article.category.name,
                "item": `https://seoshouts.com/categories/${article.category.slug}/`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": article.title,
                "item": `https://seoshouts.com/blog/${slug}/`
              }
            ]
          })
        }}
      />

      {/* Dynamic FAQ Schema - Only renders if FAQs are detected in content */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}

      {/* Fixed Elements */}
      <ReadingProgress />
      <ViewTracker articleSlug={slug} />
      
      {/* Enhanced Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-12 lg:py-16">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-300 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            {/* Breadcrumb Navigation */}
            <nav className="mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <Link href="/blog/" className="hover:text-white transition-colors">Blog</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span className="text-white/60 capitalize">{article.category.name}</span>
              </div>
            </nav>
            
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm font-bold uppercase tracking-wider">{article.category.name}</span>
            </div>
            
            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-12 drop-shadow-lg">
              {article.title}
            </h1>
            
            {/* Author & Meta Information */}
            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-0 md:flex-row md:gap-8">
              
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-3 ring-white/30">
                  {article.author.avatar_url ? (
                    <img
                      src={article.author.avatar_url}
                      alt={article.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {article.author.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm text-white/70">Written by</div>
                  <div className="text-white font-semibold">
                    {article.author.name}
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-white/30"></div>
              
              {/* Publication Date */}
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">Published</div>
                <div className="font-semibold text-white">
                  {new Date(article.published_at || article.created_at).toLocaleDateString("en-US", { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-white/30"></div>
              
              {/* Reading Time */}
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">Reading Time</div>
                <div className="font-semibold text-white">{readTime} min read</div>
              </div>
              
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image Section */}
      <div className="container mx-auto px-4 lg:px-8 -mt-12 pt-8 md:pt-0 relative z-20 mb-8">
        {article.featured_image && (
          <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
            <img
              src={article.featured_image}
              alt={article.featured_image_alt || article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="bg-white">
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 lg:items-start">

            {/* Main Article Content */}
            <main className="lg:col-span-8 min-w-0">
              
              {/* NEWSLETTER FORM - Moved from bottom */}
              <div className="mb-2">
                <BlogNewsletterForm />
              </div>
              
              {/* Enhanced Article Content with Better Typography */}
              <article className="prose prose-lg max-w-none">
                <div className="prose-headings:text-gray-900 prose-h1:text-4xl prose-h1:font-bold prose-h1:leading-tight prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-3xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:leading-tight prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-2xl prose-h3:font-semibold prose-h3:text-gray-800 prose-h3:leading-tight prose-h3:mb-3 prose-h3:mt-6 prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 prose-p:mb-4 prose-ul:my-4 prose-ol:my-4 prose-li:mb-2 prose-li:text-lg prose-li:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-6 prose-blockquote:italic prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:font-medium prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:max-w-full prose-img:h-auto prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-red-600 prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6 prose-table:border-collapse prose-table:my-6 prose-table:overflow-x-auto prose-table:block prose-table:max-w-full prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-strong:font-semibold prose-strong:text-gray-900 overflow-hidden break-words">
                  
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }} />
                </div>
              </article>

              {/* Author Box */}
              <div className="mt-8 mb-2">
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

            </main>

            {/* Right Sidebar - Only TOC */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Table of Contents */}
                <TableOfContents content={article.content} />
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      {/* Mobile Floating Table of Contents */}
      <div className="lg:hidden">
        <TableOfContents content={article.content} />
      </div>

      {/* Full-width sections */}
      <RelatedPosts currentSlug={article.slug} category={article.category.name} categorySlug={article.category.slug} categoryId={article.category.id} />

      {/* Enhanced Back to Blog Section - Blue Theme */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Continue Your SEO Journey</h3>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Discover more expert insights, proven strategies, and actionable tips to dominate search rankings.
            </p>
            <Link 
              href="/blog/" 
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Explore All Articles</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Social Share - positioned on left side */}
      <SocialShare title={article.title} slug={slug} />
    </div>
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
      // Explicit robots meta tag for Google Discover optimization
      'robots': 'max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
  };
}