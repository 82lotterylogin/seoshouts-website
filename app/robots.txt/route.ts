export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and API endpoints
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /images/
Disallow: /assets/

# Allow important crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

# Sitemap location
Sitemap: https://seoshouts.com/sitemap.xml

# Crawl delay for other bots
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200', // Cache for 24 hours
    },
  });
}

export const revalidate = 86400; // Revalidate every 24 hours