import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getSecurityHeaders, rateLimit, logSecurityEvent } from './app/lib/security';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is required for security');
  })()
);

// Simple redirections map - will be manually updated for now
// In production, this could be environment variables or fetched during build
const REDIRECTIONS: { [key: string]: { to: string; statusCode: number } } = {
  "/rank-new-products-in-googles-searches/": { to: "/blog/rank-new-products-in-googles-searches/", statusCode: 301 },
  "/link-building-email-outreach-templates/": { to: "/blog/link-building-email-outreach-templates-from-experts-that-actually-works/", statusCode: 301 },
  "/terms-and-conditions/": { to: "/terms/", statusCode: 301 },
  "/about-us/": { to: "/meet-the-experts/", statusCode: 301 },
  "/blog/best-free-internal-link-checkers/": { to: "https://seoshouts.com/blog/best-internal-link-checker-tools/", statusCode: 301 },
  "/blog/orphan-pages-seo-guide/": { to: "https://seoshouts.com/blog/orphan-pages-seo/", statusCode: 301 },
  "/blog/dofollow-vs-nofollow-internal-links/": { to: "/blog/nofollow-vs-dofollow-internal-links/", statusCode: 301 },
  "/blog/semantic-anchor-text-guide/": { to: "https://seoshouts.com/blog/semantic-anchor-text-guide-2026/", statusCode: 301 },
  "/blog/internal-linking-for-ai-answer-engines-the-ultimate-guide-2026-strategy/": { to: "https://seoshouts.com/blog/internal-linking-ai-search/", statusCode: 301 },
};

// Function to check for redirections
function checkRedirections(pathname: string): { redirect: boolean; to?: string; statusCode?: number } {
  const redirection = REDIRECTIONS[pathname];
  if (redirection) {
    return { redirect: true, to: redirection.to, statusCode: redirection.statusCode };
  }
  return { redirect: false };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Add security headers to all responses
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await rateLimit(request, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: pathname.startsWith('/api/admin/') ? 50 : 100, // Lower limit for admin APIs
      message: 'Too many API requests. Please try again later.'
    });
    
    if (!rateLimitResult.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        path: pathname,
        ip: request.ip || request.headers.get('x-forwarded-for')
      }, request);
      
      return NextResponse.json(
        { error: rateLimitResult.error },
        { 
          status: 429,
          headers: Object.fromEntries(Object.entries(securityHeaders))
        }
      );
    }
  }
  
  // First, check for redirections (but skip admin routes, API routes, and static files)
  if (!pathname.startsWith('/admin') && 
      !pathname.startsWith('/api') && 
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/favicon') &&
      !pathname.includes('.')) {
    
    const redirectionResult = checkRedirections(pathname);

    if (redirectionResult.redirect) {
      const redirectUrl = redirectionResult.to!.startsWith('http')
        ? redirectionResult.to!
        : new URL(redirectionResult.to!, request.url).toString();
      return NextResponse.redirect(redirectUrl, redirectionResult.statusCode || 301);
    }

    // Legacy /blog/?category=<Name> filter URLs duplicate /blog/ (same title/H1/meta).
    // Redirect at the HTTP layer so crawlers get a real 301 — the in-page redirect()
    // only produces a streamed 200 + client redirect, which doesn't consolidate signals.
    if (pathname === '/blog' || pathname === '/blog/') {
      const categoryName = request.nextUrl.searchParams.get('category');
      if (categoryName) {
        const knownCategories: Record<string, string> = {
          'seo basics': 'seo-basics',
          'link building': 'link-building',
          'on page': 'on-page',
          'ai seo': 'ai-seo',
          'seo news': 'seo-news',
          'best seo tools': 'best-seo-tools',
          'internal linking': 'internal-linking',
        };
        const slug = knownCategories[categoryName.trim().toLowerCase()];
        if (slug) {
          return NextResponse.redirect(new URL(`/categories/${slug}/`, request.url), 301);
        }
      }
    }
  }
  
  // Check if this is an admin route (excluding login page and auth API)
  if (pathname.startsWith('/admin') && 
      pathname !== '/admin/login' && 
      pathname !== '/admin/login/' && 
      !pathname.startsWith('/api/admin/auth/login') &&
      !pathname.startsWith('/api/admin/auth/logout')) {
    
    const token = request.cookies.get('admin-auth')?.value;
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // Verify JWT token without database access
      await jwtVerify(token, JWT_SECRET);
      
      // Token is valid, continue with security headers
      return response;
    } catch (error) {
      // Log security event
      logSecurityEvent('INVALID_JWT_TOKEN', {
        path: pathname,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, request);
      
      // Token verification failed, redirect to login
      const loginResponse = NextResponse.redirect(new URL('/admin/login', request.url));
      loginResponse.cookies.delete('admin-auth');
      
      // Add security headers to login redirect
      Object.entries(securityHeaders).forEach(([key, value]) => {
        loginResponse.headers.set(key, value);
      });
      
      return loginResponse;
    }
  }
  
  // For all other routes, continue with security headers
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};