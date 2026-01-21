import { MetadataRoute } from 'next'
import { getDatabase } from './lib/database'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://seoshouts.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/founder/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/meet-the-experts/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = [
    'internal-link-checker',
    'on-page-seo-analyzer',
    'schema-generator',
    'robots-txt-generator',
    'keyword-density-analyzer',
    'xml-sitemap-generator',
    'meta-tag-optimizer',
    'keyword-difficulty-checker',
    'long-tail-keyword-generator',
    'word-counter',
    'html-editor',
    'ai-copywriter',
    'seo-meta-writer',
    'blog-ideas-generator',
    'trending-hashtag-finder',
    'anchor-cloud',
  ].map(tool => ({
    url: `${baseUrl}/tools/${tool}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Tools index page
  const toolsIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tools/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Service pages
  const servicePages: MetadataRoute.Sitemap = [
    'local-seo',
    'ecommerce-seo',
    'link-building',
    'seo-consulting',
    'seo-website-development',
    'seo-website-development-usa',
  ].map(service => ({
    url: `${baseUrl}/services/${service}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Services index page
  const servicesIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // USA state pages
  const states = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
    'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
    'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
    'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
    'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
    'new-hampshire', 'new-jersey', 'new-mexico', 'new-york',
    'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon',
    'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
    'west-virginia', 'wisconsin', 'wyoming',
  ]

  const statePages: MetadataRoute.Sitemap = states.map(state => ({
    url: `${baseUrl}/usa/${state}/seo-website-development/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic pages from database
  let blogPosts: MetadataRoute.Sitemap = []
  let categories: MetadataRoute.Sitemap = []
  let authors: MetadataRoute.Sitemap = []

  try {
    const db = getDatabase()

    // Blog posts
    const articles = db.prepare(`
      SELECT slug, updated_at, created_at
      FROM articles
      WHERE status = 'published'
      ORDER BY published_at DESC, created_at DESC
    `).all() as Array<{ slug: string; updated_at: string | null; created_at: string }>

    blogPosts = articles.map(article => ({
      url: `${baseUrl}/blog/${article.slug}/`,
      lastModified: new Date(article.updated_at || article.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Blog index page
    const blogIndex: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/blog/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ]
    blogPosts = [...blogIndex, ...blogPosts]

    // Categories
    const categoryData = db.prepare(`
      SELECT slug, updated_at, created_at
      FROM categories
    `).all() as Array<{ slug: string; updated_at: string | null; created_at: string }>

    categories = categoryData.map(category => ({
      url: `${baseUrl}/categories/${category.slug}/`,
      lastModified: new Date(category.updated_at || category.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Authors
    const authorData = db.prepare(`
      SELECT name, updated_at, created_at
      FROM authors
    `).all() as Array<{ name: string; updated_at: string | null; created_at: string }>

    authors = authorData.map(author => ({
      url: `${baseUrl}/authors/${author.name.toLowerCase().replace(/\s+/g, '-')}/`,
      lastModified: new Date(author.updated_at || author.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return [
    ...staticPages,
    ...toolsIndex,
    ...toolPages,
    ...servicesIndex,
    ...servicePages,
    ...statePages,
    ...blogPosts,
    ...categories,
    ...authors,
  ]
}
