import { getAllStories } from '../lib/storyblok';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://seoshouts.com'; // Replace with your actual domain
  const currentDate = new Date().toISOString();

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' }, // Homepage
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/tools', priority: '0.9', changefreq: 'weekly' },
    { url: '/services', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/newsletter', priority: '0.6', changefreq: 'monthly' },
    { url: '/meet-the-experts', priority: '0.7', changefreq: 'monthly' },
    { url: '/founder', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  ];

  // Service pages
  const servicePages = [
    { url: '/services/local-seo', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/ecommerce-seo', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/technical-seo-audit', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/seo-consulting', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/seo-website-development', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/link-building', priority: '0.8', changefreq: 'monthly' },
  ];

  // Tool pages
  const toolPages = [
    { url: '/tools/keyword-density-analyzer', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/meta-tag-optimizer', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/html-editor', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/long-tail-keyword-generator', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/keyword-difficulty-checker', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/robots-txt-generator', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/xml-sitemap-generator', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/word-counter', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/ai-copywriter', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/blog-ideas-generator', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/seo-meta-writer', priority: '0.7', changefreq: 'monthly' },
  ];

  // Author pages
  const authorPages = [
    { url: '/authors/rohit-sharma', priority: '0.6', changefreq: 'monthly' },
    { url: '/authors/ajay-porwal', priority: '0.6', changefreq: 'monthly' },
  ];

  let blogPosts: any[] = [];
  try {
    // Fetch blog posts from Storyblok
    blogPosts = await getAllStories('blog_post');
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    // Continue without blog posts if there's an error
  }

  // Generate blog post URLs
  const blogPostUrls = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: post.published_at || post.created_at,
  }));

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...servicePages,
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