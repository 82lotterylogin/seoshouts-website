import { getDatabase } from '../lib/database';
import fs from 'fs';
import path from 'path';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://seoshouts.com'; // Replace with your actual domain
  const currentDate = new Date().toISOString();

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' }, // Homepage
    { url: '/blog/', priority: '0.9', changefreq: 'daily' },
    { url: '/tools/', priority: '0.9', changefreq: 'weekly' },
    { url: '/services/', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.7', changefreq: 'monthly' },
    { url: '/newsletter/', priority: '0.6', changefreq: 'monthly' },
    { url: '/meet-the-experts/', priority: '0.7', changefreq: 'monthly' },
    { url: '/founder/', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy/', priority: '0.3', changefreq: 'yearly' },
    { url: '/cookie-policy/', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms/', priority: '0.3', changefreq: 'yearly' },
  ];

  // Service pages
  const servicePages = [
    { url: '/services/local-seo/', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/ecommerce-seo/', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/technical-seo-audit/', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/seo-consulting/', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/seo-website-development/', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/seo-website-development-usa/', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/link-building/', priority: '0.8', changefreq: 'monthly' },
  ];

  // All US State pages for SEO Website Development
  const statePages = [
    { url: '/usa/alabama/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/alaska/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/arizona/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/arkansas/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/california/seo-website-development/', priority: '0.8', changefreq: 'monthly' },
    { url: '/usa/colorado/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/connecticut/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/delaware/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/florida/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/georgia/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/hawaii/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/idaho/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/illinois/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/indiana/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/iowa/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/kansas/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/kentucky/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/louisiana/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/maine/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/maryland/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/massachusetts/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/michigan/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/minnesota/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/mississippi/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/missouri/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/montana/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/nebraska/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/nevada/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/new-hampshire/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/new-jersey/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/new-mexico/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/new-york/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/north-carolina/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/north-dakota/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/ohio/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/oklahoma/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/oregon/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/pennsylvania/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/rhode-island/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/south-carolina/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/south-dakota/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/tennessee/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/texas/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/utah/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/vermont/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/virginia/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/washington/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/west-virginia/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/wisconsin/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
    { url: '/usa/wyoming/seo-website-development/', priority: '0.7', changefreq: 'monthly' },
  ];

  // Dynamically get all tool pages from filesystem
  let toolPages: any[] = [];
  try {
    const toolsDir = path.join(process.cwd(), 'app', 'tools');
    const toolDirs = fs.readdirSync(toolsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    toolPages = toolDirs.map(toolName => {
      // Special priority for important tools
      const priority = toolName === 'on-page-seo-analyzer' ? '0.8' : '0.7';
      return {
        url: `/tools/${toolName}/`,
        priority,
        changefreq: 'monthly'
      };
    });
  } catch (error) {
    console.error('Error reading tools directory:', error);
    // Fallback to static list if filesystem read fails
    toolPages = [
      { url: '/tools/keyword-density-analyzer/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/meta-tag-optimizer/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/html-editor/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/long-tail-keyword-generator/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/keyword-difficulty-checker/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/robots-txt-generator/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/xml-sitemap-generator/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/word-counter/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/ai-copywriter/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/blog-ideas-generator/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/seo-meta-writer/', priority: '0.7', changefreq: 'monthly' },
      { url: '/tools/on-page-seo-analyzer/', priority: '0.8', changefreq: 'monthly' },
      { url: '/tools/schema-generator/', priority: '0.7', changefreq: 'monthly' },
    ];
  }

  // Author pages
  const authorPages = [
    { url: '/authors/rohit-sharma/', priority: '0.6', changefreq: 'monthly' },
    { url: '/authors/ajay-porwal/', priority: '0.6', changefreq: 'monthly' },
  ];

  // Get blog posts from admin panel database only
  let blogPostUrls: any[] = [];

  try {
    // Get published articles from admin database
    const db = getDatabase();
    const adminArticles = db.prepare('SELECT slug, updated_at, published_at FROM articles WHERE status = ? ORDER BY created_at DESC').all('published');

    blogPostUrls = adminArticles.map((article: any) => ({
      url: `/blog/${article.slug}/`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: article.published_at || article.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching admin blog posts for sitemap:', error);
  }

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...servicePages,
    ...statePages,
    ...toolPages,
    ...authorPages,
    ...blogPostUrls,
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200', // Cache for 24 hours
    },
  });
}