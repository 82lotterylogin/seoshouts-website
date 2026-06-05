'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { extractExcerpt } from '../lib/content-utils'

interface ArticleAuthor {
  name: string
  slug: string
  bio: string
  avatar_url: string | null
}

interface ArticleCategory {
  name: string
  slug: string
}

interface Article {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: any
  featured_image: string | null
  published_at: string
  created_at: string
  updated_at: string
  author: ArticleAuthor
  category: ArticleCategory
  tags: string[]
}

interface Props {
  articles: Article[]
  initialCount?: number
  batchSize?: number
}

export default function BlogArticleGrid({ articles, initialCount = 13, batchSize = 12 }: Props) {
  const [visibleCount, setVisibleCount] = useState(initialCount)

  const visibleArticles = articles.slice(0, visibleCount)
  const hasMore = visibleCount < articles.length
  const nextBatch = Math.min(batchSize, articles.length - visibleCount)

  function loadMore() {
    setVisibleCount(prev => Math.min(prev + batchSize, articles.length))
  }

  if (articles.length === 0) {
    return (
      <div className="blog-empty">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No articles found. Check back soon!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="articles">
        {visibleArticles.map((article, index) => {
          const dateStr = new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          })
          const dateIso = article.published_at || article.created_at
          const excerpt = article.excerpt || extractExcerpt(article.content)

          /* ── FEATURED CARD (index 0) ── */
          if (index === 0) {
            return (
              <article key={article.id} className="feat-card">
                <div className="feat-img">
                  <span className="feat-ribbon">★ Latest</span>
                  {article.featured_image && (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      width={800}
                      height={600}
                      priority
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="feat-body">
                  <div className="feat-meta">
                    {article.category && (
                      <a href={`/categories/${article.category.slug}/`} className="cat-pill">
                        {article.category.name}
                      </a>
                    )}
                    <time className="feat-date" dateTime={dateIso}>{dateStr}</time>
                  </div>
                  <h2>
                    <Link href={`/blog/${article.slug}/`}>{article.title}</Link>
                  </h2>
                  <p className="feat-excerpt">{excerpt}</p>
                  <div className="author-row">
                    {article.author?.avatar_url && (
                      <Image
                        src={article.author.avatar_url}
                        alt={article.author.name || ''}
                        width={32}
                        height={32}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    {article.author?.slug ? (
                      <a href={`/authors/${article.author.slug}/`} className="author-name">
                        {article.author.name}
                      </a>
                    ) : (
                      <span className="author-name">{article.author?.name || 'SEOShouts'}</span>
                    )}
                  </div>
                </div>
              </article>
            )
          }

          /* ── STANDARD ARTICLE CARD ── */
          return (
            <article key={article.id} className="art-card">
              {/* Category strip above image */}
              {article.category && (
                <div className="art-cat-strip">
                  <a href={`/categories/${article.category.slug}/`} className="cat-pill">
                    {article.category.name}
                  </a>
                </div>
              )}

              {/* Image */}
              <div className="art-img">
                {article.featured_image && (
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    width={560}
                    height={315}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Body */}
              <div className="art-body">
                {/* Author avatar — overlaps image via negative top margin */}
                {article.author?.avatar_url && (
                  <div className="art-avatar">
                    <Image
                      src={article.author.avatar_url}
                      alt={article.author.name || ''}
                      width={48}
                      height={48}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <h2>
                  <Link href={`/blog/${article.slug}/`}>{article.title}</Link>
                </h2>

                <div className="art-byline">
                  By{' '}
                  {article.author?.slug ? (
                    <a href={`/authors/${article.author.slug}/`}>{article.author.name}</a>
                  ) : (
                    <span>{article.author?.name || 'SEOShouts'}</span>
                  )}
                </div>

                <p className="art-excerpt">{excerpt}</p>

                <div className="art-foot">
                  <time className="art-foot-item" dateTime={dateIso}>{dateStr}</time>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* ── LOAD MORE ── */}
      {hasMore && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={loadMore}>
            Load More Articles
            <span className="load-more-count">+{nextBatch} more</span>
          </button>
          <p className="load-more-info">
            Showing {visibleCount} of {articles.length} articles
          </p>
        </div>
      )}
    </div>
  )
}
