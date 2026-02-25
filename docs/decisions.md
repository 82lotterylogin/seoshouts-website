# Architecture & Product Decisions (SEOShouts)

This file records major project decisions already visible in the codebase, including inferred decisions from implementation patterns and comments.

Use this alongside `docs/design.md` before making structural changes.

## 1. Decision Format

Each decision includes:
- `Decision`
- `Why`
- `Tradeoffs`
- `Status` (`Active`, `Partial`, `Legacy`, `Needs Revisit`)

## 2. Core Architecture Decisions

### 2.1 Single Next.js Monolith for Site + Tools + Blog + Admin

- Decision: Keep marketing pages, tools, blog, admin, and APIs in one Next.js App Router app.
- Why:
  - Shared branding/layout/SEO patterns across all surfaces
  - Faster iteration and deployment
  - Minimal infra complexity for a small team
  - Easy internal linking between tools, services, and blog
- Tradeoffs:
  - Larger codebase blast radius for changes
  - Mixed concerns (marketing + CMS + crawlers + AI tools) in one repo/runtime
  - Harder to independently scale heavy tool APIs
- Status: `Active`

### 2.2 App Router + Co-located Route Handlers

- Decision: Use Next.js App Router (`app/`) and colocate APIs in `app/api/**/route.ts`.
- Why:
  - Unified routing model
  - Built-in metadata support
  - Easy colocated server/client component composition
  - No separate backend framework required
- Tradeoffs:
  - Some APIs become large and hard to maintain inside route files
  - Runtime constraints vary between page/API concerns
- Status: `Active`

### 2.3 SQLite (`better-sqlite3`) as Primary CMS Database

- Decision: Use local SQLite (`blog.db`) with direct SQL access for CMS/blog/admin.
- Why:
  - Simple deployment and local development
  - No external DB dependency
  - Strong performance for low/medium content volumes
  - Easy schema bootstrap in code (`app/lib/database.ts`)
- Tradeoffs:
  - Limited horizontal scaling/multi-writer robustness
  - Schema migrations are manual/ad-hoc (`ALTER TABLE` try/catch pattern)
  - Tight coupling to Node runtime
- Status: `Active`

### 2.4 No ORM (Direct SQL)

- Decision: Use direct `better-sqlite3` queries instead of an ORM (Prisma/Drizzle/etc.).
- Why:
  - Simpler dependency footprint
  - Full SQL control
  - Fast to prototype CRUD APIs
- Tradeoffs:
  - Repeated query logic
  - Weaker type safety for DB rows
  - Manual relationship mapping and migrations
- Status: `Active`

### 2.5 JWT Cookie Auth for Admin (No External Auth Provider)

- Decision: Implement admin auth with JWT cookie + `jose` + `bcryptjs`, backed by `admin_users` in SQLite.
- Why:
  - Self-contained, no vendor dependency
  - Lightweight for a single-admin/small-admin use case
  - Fits existing monolith architecture
- Tradeoffs:
  - Custom auth maintenance burden
  - Must enforce auth consistently on each admin API route
  - No RBAC/roles/permissions model beyond “authenticated admin”
- Status: `Active`

### 2.6 Middleware as Central Cross-Cutting Enforcement Layer

- Decision: Use `middleware.ts` for security headers, API rate limiting, redirects, and admin-page auth gating.
- Why:
  - Centralized protection logic
  - Consistent headers across routes
  - Early redirect handling
- Tradeoffs:
  - Middleware can become overloaded with concerns
  - API auth still needs route-level checks (middleware is not enough)
- Status: `Active`

## 3. SEO / Content Strategy Decisions

### 3.1 Tool Pages Are Also SEO Landing Pages

- Decision: Tool pages combine functional UI with long-form content, FAQs, comparisons, and CTAs.
- Why:
  - Rank for tool-related SEO queries
  - Educate users and build trust
  - Cross-link into services and blog for conversion
- Tradeoffs:
  - Very large page components (`*Client.tsx`)
  - Harder to separate product UI from marketing content
- Status: `Active`

### 3.2 Heavy Use of Metadata + JSON-LD

- Decision: Add rich metadata and structured data on high-value pages (especially tools/blog).
- Why:
  - Improve SERP presentation and indexing clarity
  - Align with SEO-first product strategy
- Tradeoffs:
  - Repetition across pages
  - Schema duplication risks if not centralized (observed with breadcrumbs)
- Status: `Active`

### 3.3 Programmatic SEO via Generated USA State Pages

- Decision: Create 50 state-specific service landing pages under `/usa/<state>/seo-website-development/`.
- Why:
  - Capture location-specific search demand at scale
  - Reuse a proven template (California as base)
  - Expand organic footprint without hand-authoring each page from scratch
- Tradeoffs:
  - Large amount of duplicated files/components
  - Consistency changes require scripted/template updates
- Status: `Active`

### 3.4 Internal Linking as Product/SEO Growth Lever

- Decision: Aggressively cross-link tools, blog, services, and authority pages.
- Why:
  - Supports SEO strategy directly
  - Increases session depth and conversion opportunities
  - Reinforces topical clustering
- Tradeoffs:
  - Manual maintenance can drift
  - Cross-link maps are not centrally managed
- Status: `Active`

## 4. UI / Design Decisions

### 4.1 Tailwind Utility-First Styling (No Component Library)

- Decision: Build the UI with Tailwind classes and local JSX composition instead of a full UI component framework.
- Why:
  - Fast page-level iteration
  - Fine-grained visual control for SEO landing pages/tools
  - Lower dependency overhead
- Tradeoffs:
  - Repeated class strings
  - Inconsistent styling drift between similar pages unless manually aligned
- Status: `Active`

### 4.2 Blue-First Brand Theme with Card-Based Layouts

- Decision: Use a consistent blue/white gradient-heavy visual style with rounded cards and shadows.
- Why:
  - Establish recognizable brand identity
  - Works well for SEO/SaaS-like tool pages
  - Easy to reuse across marketing and tools
- Tradeoffs:
  - Requires manual consistency checks (e.g., shadow/radius mismatches between tools)
- Status: `Active`

### 4.3 Tool UI Pattern: `page.tsx` + `*Client.tsx`

- Decision: Keep route metadata/schema in `page.tsx`, and put interactive logic in sibling `*Client.tsx`.
- Why:
  - Clear separation between SEO/static concerns and client interactivity
  - Repeatable pattern across all tools
- Tradeoffs:
  - Some `*Client.tsx` files become very large because they also contain long-form content
- Status: `Active`

### 4.4 Separate Admin Layout from Public Layout

- Decision: Admin uses its own `app/admin/layout.tsx` rather than inheriting the public marketing shell.
- Why:
  - Cleaner admin UX
  - Avoids public nav/footer/cookie UI in admin screens
- Tradeoffs:
  - Two layout surfaces to maintain
- Status: `Active`

## 5. Feature Implementation Decisions

### 5.1 reCAPTCHA on Abuse-Prone Features

- Decision: Add reCAPTCHA to many tools and lead forms, and verify server-side.
- Why:
  - Protect expensive crawl/API/AI endpoints and form inboxes
  - Reduce bot abuse
- Tradeoffs:
  - UX friction
  - Client/server token handling complexity
  - Requires environment config to be correct
- Status: `Active`

### 5.2 In-Memory Rate Limiting (Short-Term + Daily)

- Decision: Implement custom in-memory rate limiting in `app/lib/security.ts`.
- Why:
  - No Redis dependency
  - Fast and simple for current deployment profile
- Tradeoffs:
  - Not shared across instances
  - Resets on restart/deploy
  - Can be inconsistent under scaling
- Status: `Active` (with scaling limitations)

### 5.3 Client-Side Heavy Tools Where Possible

- Decision: Keep many tools client-side (word counter, schema generator, `.htaccess`, HTML editor, etc.).
- Why:
  - Lower server cost
  - Faster perceived performance
  - Fewer backend dependencies
- Tradeoffs:
  - Larger client bundles on some tool pages
  - Browser-only limitations for advanced analysis
- Status: `Active`

### 5.4 Dedicated Backend Routes for Heavy Crawling/AI Tools

- Decision: Use API routes for crawling and AI generation tools.
- Why:
  - Requires server-side networking, secret keys, and protected processing
  - Centralized validation/rate limiting/reCAPTCHA
- Tradeoffs:
  - Endpoint complexity
  - More operational risk (timeouts, third-party failures)
- Status: `Active`

### 5.5 Exporting Tool Results Client-Side via Blob Downloads

- Decision: Export CSV/JSON/TXT directly in browser for tools like internal-link/anchor-cloud.
- Why:
  - Avoid server-side file generation/storage complexity
  - Immediate user download without backend queueing
- Tradeoffs:
  - Export logic duplicated across similar tools
  - Legacy labels can persist when cloning components (observed)
- Status: `Active`

### 5.6 Redirect Management via DB + Cache + Middleware Map

- Decision: Store redirects in DB, keep cache/script tooling, and serve runtime redirects from middleware map.
- Why:
  - Admin-editable redirects
  - Fast middleware lookup at runtime
- Tradeoffs:
  - Sync complexity (DB state vs cache vs middleware code)
  - Easy to drift if sync steps are skipped
- Status: `Active` but `Needs Revisit`

### 5.7 Storyblok Retained Alongside SQLite Blog

- Decision: Keep Storyblok integration in code while SQLite powers the active blog.
- Why (inferred):
  - Preserve migration path / legacy support
  - Avoid breaking previous editor workflows immediately
- Tradeoffs:
  - Cognitive overhead
  - Dual content models in codebase
- Status: `Legacy/Partial`

## 6. Build / Deployment Decisions

### 6.1 Trailing Slash URLs Enabled

- Decision: Enable `trailingSlash: true` in Next config.
- Why:
  - URL consistency across SEO pages/tools
  - Canonicalization preference
- Tradeoffs:
  - Must keep links/canonicals consistent with slash behavior
- Status: `Active`

### 6.2 Disable Next Image Optimization (`images.unoptimized`)

- Decision: Use unoptimized images.
- Why (inferred):
  - Simpler hosting compatibility
  - Fewer runtime/image optimization constraints
- Tradeoffs:
  - Misses built-in optimization pipeline benefits
- Status: `Active`

### 6.3 Ignore ESLint and TypeScript Build Errors in Production Builds

- Decision: `ignoreDuringBuilds: true` and `ignoreBuildErrors: true`.
- Why (comments/inferred):
  - Ensure deployment proceeds despite lint/type issues
  - Reduce deployment friction under time constraints
- Tradeoffs:
  - Major reliability risk
  - Runtime bugs can ship unnoticed
- Status: `Active` but `Needs Revisit` (high priority)

### 6.4 Webpack Fallback/Define Patches for Browser/SSR Compatibility

- Decision: Add custom webpack fallbacks and `typeof window` defines in `next.config.ts`.
- Why:
  - Work around SSR/client library issues (TinyMCE, reCAPTCHA, etc.)
  - Reduce build/runtime incompatibilities
- Tradeoffs:
  - More custom config complexity
  - Can mask root-cause import boundary issues
- Status: `Active`

## 7. Things Deliberately NOT Done (or Not Introduced)

### 7.1 No Redux / Global State Library

- Decision: Do not use Redux/Zustand/etc. for app-wide state management.
- Why (inferred):
  - Most state is page-local (forms, tool inputs/results, admin page state)
  - Simpler mental model with React state/hooks
- Tradeoffs:
  - Repeated patterns in large client components
  - Cross-page state is mostly absent by design
- Status: `Intentional / Active`

### 7.2 No ORM / Migration Framework

- Decision: No Prisma/Drizzle/TypeORM migration stack.
- Why:
  - Keep DB layer lightweight
  - Direct SQL is sufficient for current CMS scope
- Tradeoffs:
  - Manual schema drift handling
  - Harder schema evolution at scale
- Status: `Intentional / Active`

### 7.3 No External Auth Provider (Auth0/Clerk/etc.)

- Decision: No third-party auth SaaS for admin.
- Why:
  - Admin-only use case is small and self-contained
  - Lower recurring cost and integration complexity
- Tradeoffs:
  - Security/auth maintenance is in-house
- Status: `Intentional / Active`

### 7.4 No Separate Backend Service

- Decision: No standalone API server/microservices architecture.
- Why:
  - Keep deployment simple
  - Reuse Next route handlers and shared code
- Tradeoffs:
  - Heavy API workloads share app runtime
  - Scaling concerns are less isolated
- Status: `Intentional / Active`

### 7.5 No Centralized Design System Component Library

- Decision: No internal UI package/design-system abstraction layer.
- Why (inferred):
  - Rapid page-specific iteration prioritized
  - Tailwind + copy-heavy pages fit direct composition
- Tradeoffs:
  - Visual consistency drift across similar pages/tools
  - Repeated markup and styling logic
- Status: `Intentional / Active`

## 8. Revisit Queue (Decision-Level)

These are not tasks, but decisions that likely need reevaluation as the project grows:

1. Build safety disabled (ESLint/TS ignored on build)
2. In-memory rate limiting for production usage
3. Redirect sync architecture (DB/cache/middleware map drift risk)
4. Duplicate tool implementations (`anchor-cloud` vs `internal-link-checker`)
5. Storyblok + SQLite dual-content path
6. Large client components that mix tool logic + SEO long-form content

## 9. Working Principle for Future Decisions

When introducing a new architecture/library/pattern:
- Prefer consistency with existing route/component conventions unless there is a clear pain point.
- If deviating, document the reason in this file and update `docs/design.md`.
- For repeatable patterns (tools, state pages, admin CRUD), optimize the template/generator, not only one instance.

