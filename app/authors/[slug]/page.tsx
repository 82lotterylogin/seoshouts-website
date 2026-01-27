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

      {/* Default Schema */}
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

      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                
                {/* Author Image & Basic Info */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {author.avatar_url ? (
                      <Image
                        src={author.avatar_url}
                        alt={author.avatar_alt_text || `${author.name} profile picture`}
                        width={160}
                        height={160}
                        className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white/20 shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-white/20 shadow-xl flex items-center justify-center">
                        <span className="text-3xl lg:text-4xl font-bold text-white">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2">
                      <div className="w-8 h-8 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author Details */}
                <div className="flex-1">
                  {author.job_title && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white">
                        {author.job_title}
                      </span>
                    </div>
                  )}
                  
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                    {author.name}
                  </h1>
                  
                  {author.bio && (
                    <p className="text-xl text-purple-100 mb-6 leading-relaxed max-w-3xl">
                      {author.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap gap-8 mb-8">
                    <div>
                      <div className="text-2xl font-bold text-white">{articles.length}</div>
                      <div className="text-sm text-purple-200">Articles Published</div>
                    </div>
                    {hasContent(author.expertise) && (
                      <div>
                        <div className="text-2xl font-bold text-white">{author.expertise!.length}</div>
                        <div className="text-sm text-purple-200">Skills & Expertise</div>
                      </div>
                    )}
                    {author.company && (
                      <div>
                        <div className="text-2xl font-bold text-white">{author.company}</div>
                        <div className="text-sm text-purple-200">Company</div>
                      </div>
                    )}
                  </div>

                  {/* Contact Links */}
                  <div className="flex flex-wrap gap-4">
                    {author.email && (
                      <a 
                        href={`mailto:${author.email}`}
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        Email
                      </a>
                    )}
                    {author.linkedin_url && (
                      <a 
                        href={author.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {author.twitter_url && (
                      <a 
                        href={author.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </a>
                    )}
                    {author.website_url && (
                      <a 
                        href={author.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                        </svg>
                        Website
                      </a>
                    )}
                    {author.phone && (
                      <a 
                        href={`tel:${author.phone}`}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Content - Articles */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
                <p className="text-gray-600">Expert insights and strategies from {author.name}.</p>
              </div>

              {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article, index) => (
                    <article key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                      <Link href={`/blog/${article.slug}`} className="block">
                        {/* Featured Image */}
                        {article.featured_image && (
                          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                            <Image
                              src={article.featured_image}
                              alt={article.featured_image_alt || article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {index === 0 && (
                              <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white shadow-lg">
                                  Latest
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {!article.featured_image && index === 0 && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                Latest
                              </span>
                            )}
                            {(article as any).category_name && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                {(article as any).category_name}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <time dateTime={article.published_at || article.created_at}>
                              {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </time>
                            <span className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                              Read more
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Articles Coming Soon</h3>
                  <p className="text-gray-600">{author.name} is working on publishing expert insights and strategies. Check back soon!</p>
                </div>
              )}
            </div>

            {/* Sidebar - Author Info */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                
                {/* Author Bio */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About {author.name.split(' ')[0]}</h3>
                  {author.bio && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {author.bio}
                    </p>
                  )}
                  <div className="space-y-3 text-sm">
                    {author.location && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="text-gray-600">{author.location}</span>
                      </div>
                    )}
                    {author.job_title && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6"></path>
                        </svg>
                        <span className="text-gray-600">{author.job_title}</span>
                      </div>
                    )}
                    {author.company && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span className="text-gray-600">{author.company}</span>
                      </div>
                    )}
                    {author.education && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        </svg>
                        <span className="text-gray-600">{author.education}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Areas of Expertise */}
                {hasContent(author.expertise) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {author.expertise!.map((skill) => (
                        <span key={skill} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Highlights */}
                {hasContent(author.career_highlights) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Career Highlights</h3>
                    <div className="space-y-3">
                      {author.career_highlights!.map((position: CareerHighlight, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-gray-900">{position.title}</div>
                          <div className="text-gray-600">{position.company}</div>
                          <div className="text-gray-500">{position.duration}</div>
                          {position.description && (
                            <div className="text-gray-600 mt-1">{position.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact CTA - only show if email exists */}
                {author.email && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Need expert advice or consultation? Let's discuss your project.
                    </p>
                    <div className="space-y-3">
                      <a 
                        href={`mailto:${author.email}`}
                        className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        Email Me
                      </a>
                      {author.phone && (
                        <a 
                          href={`tel:${author.phone}`}
                          className="flex items-center justify-center gap-2 w-full bg-white border border-purple-200 text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          Call Me
                        </a>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}