// app/blog/page.tsx
import { getAllStories } from "../lib/storyblok";
import { calculateReadTime, extractExcerpt } from "../lib/content-utils";
import { getMultipleViewCounts } from "../lib/firebase";
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
    canonical: 'https://seoshouts.com/blog',
  },
  openGraph: {
    title: 'SEO Blog - Latest Insights, Tips & Strategies | SEO Shouts',
    description: 'Get the latest SEO insights, expert articles, and actionable tips from SEO professionals. Stay updated with cutting-edge SEO strategies and digital marketing trends.',
    url: 'https://seoshouts.com/blog',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Blog - Latest SEO Insights and Strategies',
      },
    ],
    locale: 'en_US',
    type: 'website',
    section: 'Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Blog - Latest Insights, Tips & Strategies | SEO Shouts',
    description: 'Get the latest SEO insights, expert articles, and actionable tips from SEO professionals.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/blog-twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
  },
  other: {
    'article:publisher': 'https://www.facebook.com/seoshouts',
    'article:author': 'https://seoshouts.com/authors',
    'fb:app_id': 'your-facebook-app-id',
  }
}

// SAFE WORD COUNT FUNCTION - ADDED TO FIX THE ERROR
function getSafeWordCount(content: any): number {
  if (!content) return 1000; // Default fallback
  
  // If content is a string, count words normally
  if (typeof content === 'string') {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  
  // If content is an object (rich text), try to extract text
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

export default async function BlogPage() {
  const blogPosts = await getAllStories("blog_post");
  const articleSlugs = blogPosts.map((post: any) => post.slug);
  const viewCounts = await getMultipleViewCounts(articleSlugs);
  const allCategories = blogPosts.map((post: any) => post.content.category).filter(Boolean);
  const uniqueCategories = Array.from(new Set(allCategories));

  // Debug logging for slug structure
  console.log('🔍 First blog post structure:', {
    slug: blogPosts[0]?.slug,
    fullSlug: blogPosts[0]?.full_slug,
    uuid: blogPosts[0]?.uuid,
    contentTitle: blogPosts[0]?.content?.title,
    contentType: typeof blogPosts[0]?.content?.content
  });

  return (
    <>
      {/* COMPREHENSIVE STRUCTURED DATA WITH SAFE WORD COUNT */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "SEO Shouts Blog",
            "description": "Expert SEO insights, tips, and strategies for digital marketers and business owners",
            "url": "https://seoshouts.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://seoshouts.com/logo.png",
                "width": 300,
                "height": 100
              },
              "sameAs": [
                "https://twitter.com/seo_shouts",
                "https://facebook.com/seoshouts",
                "https://linkedin.com/company/seoshouts"
              ]
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://seoshouts.com/blog"
            },
            "blogPost": blogPosts.slice(0, 5).map((post: any) => ({
              "@type": "BlogPosting",
              "@id": `https://seoshouts.com/blog/${post.slug}`,
              "headline": post.content.title,
              "description": post.content.excerpt || extractExcerpt(post.content.content, 160),
              "url": `https://seoshouts.com/blog/${post.slug}`,
              "datePublished": post.first_published_at || post.created_at,
              "dateModified": post.published_at || post.first_published_at || post.created_at,
              "author": {
                "@type": "Person",
                "name": post.content.author?.content?.name || "Rohit Sharma",
                "url": `https://seoshouts.com/authors/${post.content.author?.content?.slug || 'rohit-sharma'}`
              },
              "publisher": {
                "@type": "Organization",
                "name": "SEO Shouts",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://seoshouts.com/logo.png"
                }
              },
              "image": post.content.image?.filename || "https://seoshouts.com/default-blog-image.jpg",
              "articleSection": post.content.category || "SEO",
              "wordCount": getSafeWordCount(post.content.content) // ✅ FIXED: Safe word count
            }))
          })
        }}
      />

      {/* BREADCRUMB SCHEMA */}
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
              }
            ]
          })
        }}
      />

      {/* WEBSITE SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SEO Shouts",
            "alternateName": "SEOShouts",
            "url": "https://seoshouts.com",
            "description": "Professional SEO tools, services, and insights for businesses worldwide",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://seoshouts.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          
          {/* ENHANCED HEADER SECTION WITH BETTER SEO */}
          <header className="text-center my-16">
            <nav className="text-sm text-gray-600 mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center gap-2">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium" aria-current="page">
                  Blog
                </li>
              </ol>
            </nav>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              From the Blog
            </h1>
            <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto leading-relaxed">
              The latest industry insights, expert interviews, cutting-edge technologies, and actionable resources to accelerate your SEO success.
            </p>
            
            {/* ENHANCED SEARCH WITH PROPER LABELS */}
            <div className="mt-8">
              <div className="relative max-w-md mx-auto">
                <label htmlFor="blog-search" className="sr-only">
                  Search blog articles
                </label>
                <input
                  id="blog-search"
                  name="search"
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-6 py-3 pl-12 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  aria-label="Search blog articles"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* MAIN CONTENT WITH PROPER SEMANTIC HTML */}
            <main className="lg:w-2/3" role="main" aria-label="Blog posts">
              <section aria-label="Latest blog posts">
                <div className="space-y-10">
                  {blogPosts.map((post: any, index) => {
                    const readTime = calculateReadTime(post.content.content);
                    const dynamicExcerpt = extractExcerpt(post.content.content, 180);
                    const viewCount = viewCounts[post.slug] || 0;
                    
                    return (
                      <article 
                        key={post.uuid} 
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                        itemScope 
                        itemType="https://schema.org/BlogPosting"
                      >
                        <div className="flex flex-col md:flex-row">
                          
                          {/* ENHANCED IMAGE SECTION WITH PROPER ALT TAGS */}
                          <div className="md:w-2/5 relative h-72 md:h-auto overflow-hidden">
                            <Link href={`/blog/${post.slug}`} className="block relative h-full">
                              <Image
                                src={post.content.image?.filename || '/placeholder-blog.jpg'}
                                alt={post.content.image?.alt || `Featured image for ${post.content.title}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                itemProp="image"
                                sizes="(max-width: 768px) 100vw, 40vw"
                                priority={index === 0}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                          </div>
                          
                          {/* ENHANCED CONTENT SECTION WITH PROPER SEMANTIC MARKUP */}
                          <div className="md:w-3/5 p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-5">
                              <span 
                                className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full uppercase tracking-wider"
                                itemProp="articleSection"
                              >
                                {post.content.category || 'LOCAL SEO'}
                              </span>
                              <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                              <time 
                                className="text-sm text-gray-500 font-medium"
                                dateTime={post.first_published_at || post.created_at}
                                itemProp="datePublished"
                              >
                                {new Date(post.first_published_at || post.created_at).toLocaleDateString("en-US", { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </time>
                            </div>
                            
                            <Link href={`/blog/${post.slug}`} className="group-link">
                              <h2 
                                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors duration-200"
                                itemProp="headline"
                              >
                                {post.content.title}
                              </h2>
                            </Link>
                            
                            <p 
                              className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed line-clamp-3"
                              itemProp="description"
                            >
                              {post.content.excerpt || dynamicExcerpt}
                            </p>
                            
                            {/* ENHANCED AUTHOR SECTION WITH PROPER SCHEMA */}
                            <div 
                              className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100/50"
                              itemProp="author"
                              itemScope 
                              itemType="https://schema.org/Person"
                            >
                              <span className="text-sm text-gray-500 font-medium">By</span>
                              
                              {post.content.author?.content ? (
                                <>
                                  <div className="relative group/avatar">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-100 group-hover/avatar:ring-blue-300 transition-all duration-200">
                                      <Image
                                        src={post.content.author.content.picture?.filename || '/default-avatar.jpg'}
                                        alt={`${post.content.author.content.name || 'Author'} profile picture`}
                                        fill
                                        className="object-cover"
                                        itemProp="image"
                                      />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" aria-hidden="true"></div>
                                  </div>
                                  
                                  <div className="flex flex-col">
                                    <Link 
                                      href={`/authors/${post.content.author.content.slug || 'rohit-sharma'}`}
                                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200 no-underline hover:no-underline"
                                      itemProp="name"
                                    >
                                      {post.content.author.content.name || 'Rohit Sharma'}
                                    </Link>
                                    <span className="text-xs text-gray-500 font-medium" itemProp="jobTitle">
                                      SEO Expert & Digital Strategist
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="relative group/avatar">
                                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-100 group-hover/avatar:ring-blue-300 transition-all duration-200">
                                      <span className="text-white font-bold text-sm">RS</span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" aria-hidden="true"></div>
                                  </div>
                                  
                                  <div className="flex flex-col">
                                    <Link 
                                      href="/authors/rohit-sharma"
                                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200 no-underline hover:no-underline"
                                      itemProp="name"
                                    >
                                      Rohit Sharma
                                    </Link>
                                    <span className="text-xs text-gray-500 font-medium" itemProp="jobTitle">
                                      SEO Expert & Digital Strategist
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* ENHANCED METADATA WITH PROPER LABELS */}
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-6 border-t border-gray-200">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1" title={`${readTime} minute read`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                  <span itemProp="timeRequired">{readTime} min read</span>
                                </div>
                                <div className="h-1 w-1 bg-gray-300 rounded-full" aria-hidden="true"></div>
                                <div className="flex items-center gap-1" title={`${viewCount.toLocaleString()} views`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                  </svg>
                                  <span itemProp="interactionCount">{viewCount.toLocaleString()} views</span>
                                </div>
                              </div>
                              
                              <Link 
                                href={`/blog/${post.slug}`}
                                className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 flex items-center gap-1 no-underline hover:no-underline"
                                aria-label={`Read more about ${post.content.title}`}
                                itemProp="url"
                              >
                                Read More
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </main>

            {/* SIDEBAR WITH PROPER SEMANTIC HTML */}
            <aside className="lg:w-1/3 relative" role="complementary" aria-label="Blog sidebar">
              
              <div className="sticky top-8 z-20 mb-8">
                <BlogSidebarSubscription />
              </div>

              {/* SCROLLABLE SIDEBAR CONTENT */}
              <div className="space-y-8">
                
                {/* CATEGORIES SECTION */}
                <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100" aria-labelledby="categories-heading">
                  <h3 id="categories-heading" className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                      </svg>
                    </span>
                    Categories
                  </h3>
                  <nav className="space-y-3" aria-label="Blog categories">
                    {uniqueCategories.map((category, index) => (
                      <Link
                        key={category}
                        href={`/blog?category=${encodeURIComponent(category)}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group no-underline hover:no-underline"
                        aria-label={`View ${category} articles (${blogPosts.filter((post: any) => post.content.category === category).length} posts)`}
                      >
                        <span className="text-gray-700 group-hover:text-blue-700 font-medium">{category}</span>
                        <span className="bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-700 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200">
                          {blogPosts.filter((post: any) => post.content.category === category).length}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </section>

                {/* RECENT POSTS SECTION */}
                <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100" aria-labelledby="recent-posts-heading">
                  <h3 id="recent-posts-heading" className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                    Recent Posts
                  </h3>
                  <nav className="space-y-4" aria-label="Recent blog posts">
                    {blogPosts.slice(0, 4).map((post: any, index) => {
                      const postViewCount = viewCounts[post.slug] || 0;
                      
                      return (
                        <article key={post.uuid} className="group">
                          <div className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={post.content.image?.filename || '/placeholder-blog.jpg'}
                                alt={`Thumbnail for ${post.content.title}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <Link 
                                href={`/blog/${post.slug}`} 
                                className="no-underline hover:no-underline"
                                aria-label={`Read ${post.content.title}`}
                              >
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2 mb-2">
                                  {post.content.title}
                                </h4>
                              </Link>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-500">By</span>
                                <Link 
                                  href={`/authors/${post.content.author?.content?.slug || 'rohit-sharma'}`}
                                  className="text-blue-600 hover:text-blue-800 font-medium no-underline hover:no-underline"
                                >
                                  {post.content.author?.content?.name || 'Rohit Sharma'}
                                </Link>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500">{postViewCount} views</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </nav>
                </section>

              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
