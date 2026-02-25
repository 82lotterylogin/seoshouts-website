# SEOShouts Project Design & Architecture Reference

This file documents the current source-level design of the SEOShouts codebase and is intended to preserve context across future chats.

Related docs:
- `AGENTS.md`
- `docs/decisions.md`
- `docs/tool-template.md`

## 1. Project Architecture Overview

### 1.1 High-Level System

SEOShouts is a single Next.js App Router monolith that combines:
- A marketing website for SEO services
- A free SEO tools suite
- A blog/CMS
- An admin panel for content/media/redirect management
- Lead generation workflows (contact, inquiry, newsletter)
- Redirect management
- Programmatic SEO state landing pages (`/usa/<state>/seo-website-development/`)

### 1.2 Architectural Shape

Everything runs inside one Next.js app:
- UI pages in `app/**/page.tsx`
- API endpoints in `app/api/**/route.ts`
- Shared components in `app/components/*`
- Domain libraries in `app/lib/*`
- Cross-cutting middleware in `middleware.ts`

Tradeoffs of this approach:
- Fast iteration and simple deployment
- Tight coupling between content/tools/admin
- Duplication across some tool UIs and state landing pages
- Legacy/parallel paths remain (e.g., Storyblok + SQLite, Anchor Cloud + Internal Link Checker)

### 1.3 Runtime Characteristics

- Next.js App Router with server and client components
- SQLite via `better-sqlite3` (Node runtime dependency)
- Middleware for security headers, rate limiting, redirects, admin auth gating
- External integrations for AI, PageSpeed, SMTP, Brevo, reCAPTCHA, social APIs

### 1.4 Global Layout / Shell

Global public shell is `app/layout.tsx` and includes:
- Header + navigation + tools menu
- Cookie consent UI
- Floating contact popup
- Footer
- Analytics/script/schema injections
- `ScrollToTop`

Admin pages use a separate shell in `app/admin/layout.tsx`.

## 2. Pages & Routes (Layout + Purpose)

### 2.1 Global / Utility Routes

- `/` -> `app/page.tsx`
  - Home page (services, tools, lead forms, blog highlights)
  - Uses global public shell
- `/robots.txt` -> `app/robots.txt/route.ts`
- `/sitemap.xml` -> `app/sitemap.ts`

Error/loading boundaries:
- `app/loading.tsx`
- `app/error.tsx`
- `app/global-error.tsx`
- `app/not-found.tsx`

### 2.2 Marketing / Trust / Legal Pages

All use the global public shell (`app/layout.tsx`).

- `/contact/` -> `app/contact/page.tsx` (contact + lead form)
- `/newsletter/` -> `app/newsletter/page.tsx` (newsletter landing + signup)
- `/meet-the-experts/` -> `app/meet-the-experts/page.tsx` (team trust page)
- `/founder/` -> `app/founder/page.tsx` (founder profile/authority page)
- `/privacy-policy/` -> `app/privacy-policy/page.tsx`
- `/terms/` -> `app/terms/page.tsx`
- `/cookie-policy/` -> `app/cookie-policy/page.tsx`

### 2.3 Blog / Content Routes

Public blog pages:
- `/blog/` -> `app/blog/page.tsx` (blog index/archive)
- `/blog/[slug]/` -> `app/blog/[slug]/page.tsx` (article page)
- `/categories/[slug]/` -> `app/categories/[slug]/page.tsx` (category archive)
- `/authors/[slug]/` -> `app/authors/[slug]/page.tsx` (author page)

Backup/static author pages:
- `/authors/ajay-porwal-static-backup/` -> `app/authors/ajay-porwal-static-backup/page.tsx`
- `/authors/rohit-sharma-static-backup/` -> `app/authors/rohit-sharma-static-backup/page.tsx`

### 2.4 Services Routes

- `/services/` -> `app/services/page.tsx` (services hub)
- `/services/local-seo/` -> `app/services/local-seo/page.tsx`
- `/services/ecommerce-seo/` -> `app/services/ecommerce-seo/page.tsx`
- `/services/technical-seo-audit/` -> `app/services/technical-seo-audit/page.tsx`
- `/services/link-building/` -> `app/services/link-building/page.tsx`
- `/services/seo-consulting/` -> `app/services/seo-consulting/page.tsx`
- `/services/seo-website-development/` -> `app/services/seo-website-development/page.tsx`
- `/services/seo-website-development-usa/` -> `app/services/seo-website-development-usa/page.tsx`

Purpose:
- SEO service landing pages with long-form content, FAQs, and conversion CTAs/forms.

### 2.5 Tools Routes

Tools hub:
- `/tools/` -> `app/tools/page.tsx`

Tool pages:
- `/tools/internal-link-checker/`
- `/tools/on-page-seo-analyzer/`
- `/tools/schema-generator/`
- `/tools/robots-txt-generator/`
- `/tools/htaccess-generator/`
- `/tools/keyword-density-analyzer/`
- `/tools/xml-sitemap-generator/`
- `/tools/meta-tag-optimizer/`
- `/tools/keyword-difficulty-checker/`
- `/tools/long-tail-keyword-generator/`
- `/tools/word-counter/`
- `/tools/html-editor/`
- `/tools/ai-copywriter/`
- `/tools/seo-meta-writer/`
- `/tools/blog-ideas-generator/`
- `/tools/trending-hashtag-finder/`
- `/tools/anchor-cloud/` (legacy/parallel anchor analysis tool)

Common layout pattern:
- `page.tsx` for metadata/schema
- `*Client.tsx` for UI logic
- Many include long-form SEO content + FAQs + related tools

### 2.6 Admin Routes (Private UI)

Admin pages use `app/admin/layout.tsx`. Middleware redirects unauthenticated users to `/admin/login`.

- `/admin/` -> dashboard (`app/admin/page.tsx`)
- `/admin/login/` -> login (`app/admin/login/page.tsx`)
- `/admin/articles/` -> article list/manage
- `/admin/articles/new/` -> create article
- `/admin/articles/[id]/edit/` -> edit article
- `/admin/authors/` -> authors CRUD
- `/admin/categories/` -> categories CRUD
- `/admin/images/` -> media library
- `/admin/redirections/` -> redirects CRUD
- `/admin/settings/` -> admin settings/password

### 2.7 Programmatic SEO State Routes (USA)

Pattern:
- `/usa/<state>/seo-website-development/`

All 50 states are present under `app/usa/*/seo-website-development/page.tsx`.
Purpose:
- Programmatic SEO landing pages for state-specific SEO website development services.

## 3. API Routes (Complete Inventory + Purpose)

### 3.1 Admin APIs (`/api/admin/*`)

Auth/session:
- `/api/admin/auth/login/`
- `/api/admin/auth/logout/`
- `/api/admin/auth/me/`

Dashboard:
- `/api/admin/stats/`

CMS CRUD:
- `/api/admin/articles/`
- `/api/admin/articles/[id]/`
- `/api/admin/authors/`
- `/api/admin/authors/[id]/`
- `/api/admin/categories/`
- `/api/admin/categories/[id]/`
- `/api/admin/images/`
- `/api/admin/images/[id]/`
- `/api/admin/redirections/`
- `/api/admin/redirections/[id]/`
- `/api/admin/settings/`

### 3.2 Public/Blog APIs
- `/api/blog/`
- `/api/blog/[slug]/`

### 3.3 Lead / Newsletter APIs
- `/api/contact-submit/`
- `/api/inquiry-submit/`
- `/api/newsletter-subscribe/`

### 3.4 Tool / Analyzer / Crawl APIs
- `/api/analyze-seo/`
- `/api/page-speed/`
- `/api/usage-limit/`
- `/api/internal-link-analyzer/`
- `/api/anchor-cloud-analyzer/`
- `/api/fetch-url-content/`
- `/api/crawl-website/`

### 3.5 AI / Generator APIs
- `/api/generate-copy/`
- `/api/generate-blog-ideas/`
- `/api/generate-meta-tags/`
- `/api/generate-hashtags/`

### 3.6 Hashtag / Social APIs
- `/api/trending-hashtags/`
- `/api/instagram-hashtags/`
- `/api/linkedin-hashtags/`
- `/api/pinterest-hashtags/`
- `/api/twitter-hashtags/`
- `/api/youtube-hashtags/`
- `/api/competitor-hashtags/`
- `/api/bulk-hashtags/`

### 3.7 Redirect / Ops APIs
- `/api/redirections/check/`
- `/api/redirections/middleware/`

### 3.8 Test / Debug APIs
- `/api/test-author/`
- `/api/test-email/`
- `/api/test-redirections/`

## 4. Components (Name, Location, Purpose, Usage)

This section covers all component groups in the repo. Generated state-page component copies are documented as a family/pattern to avoid duplicating 250+ nearly identical entries.

### 4.1 Shared Components (`app/components/*`)

#### Admin / CMS
- `AdminNav` (`app/components/AdminNav.tsx`)
  - Purpose: Admin navigation
  - Used in: admin dashboard, articles, authors, categories, images, redirections, settings pages
- `BasicHtmlEditor` (`app/components/BasicHtmlEditor.tsx`)
  - Purpose: Lightweight HTML content editor
  - Used in: admin article create/edit
- `ImageUpload` (`app/components/ImageUpload.tsx`)
  - Purpose: Upload/select image field
  - Used in: admin article create/edit, authors page
- `MediaLibraryModal` (`app/components/MediaLibraryModal.tsx`)
  - Purpose: Browse/select uploaded images
  - Used in: `ImageUpload`, `TipTapEditor`

#### Blog Experience
- `ReadingProgress` (`app/components/ReadingProgress.tsx`) -> article page
- `ViewTracker` (`app/components/ViewTracker.tsx`) -> article page
- `TableOfContents` (`app/components/TableOfContents.tsx`) -> article page
- `SocialShare` (`app/components/SocialShare.tsx`) -> article page
- `AuthorBio` (`app/components/AuthorBio.tsx`) -> article page
- `RelatedPosts` (`app/components/RelatedPosts.tsx`) -> article page
- `BlogSidebarSubscription` (`app/components/BlogSidebarSubscription.tsx`) -> blog index, article, category pages
- `BlogNewsletterForm` (`app/components/BlogNewsletterForm.tsx`) -> article page
- `ArticleNewsletter` (`app/components/ArticleNewsletter.tsx`) -> reusable article newsletter CTA (available component)
- `ArticleActions` (`app/components/ArticleActions.tsx`) -> reusable article actions (available component)
- `CommentsSection` (`app/components/CommentsSection.tsx`) -> comments UI (available component)

#### Lead / Conversion
- `ContactForm` (`app/components/ContactForm.tsx`) -> contact page
- `InquiryForm` (`app/components/InquiryForm.tsx`) -> home page
- `FloatingContactPopup` (`app/components/FloatingContactPopup.tsx`) -> global layout
- `NewsletterFormSection` (`app/components/NewsletterFormSection.tsx`) -> home page
- `NewsletterPageForm` (`app/components/NewsletterPageForm.tsx`) -> newsletter page
- `NewsletterSubscription` (`app/components/NewsletterSubscription.tsx`) -> reusable newsletter signup component

#### Tools / SEO Shared
- `ToolBreadcrumb` (`app/components/ToolBreadcrumb.tsx`)
  - Purpose: Tool breadcrumb UI + breadcrumb schema injection
  - Used in: most tool client components
- `RelatedTools` (`app/components/RelatedTools.tsx`)
  - Purpose: Related tools block for tool pages
  - Used in: many tool `page.tsx` routes
- `SEOMetricCard` (`app/components/seo-report/SEOMetricCard.tsx`) -> On-Page SEO Analyzer
- `CoreWebVitalsCard` (`app/components/seo-report/CoreWebVitalsCard.tsx`) -> On-Page SEO Analyzer

#### Global Utility
- `ScrollToTop` (`app/components/ScrollToTop.tsx`) -> global layout

#### Editors / Alternate Rich Text Implementations
- `TipTapEditor` (`app/components/TipTapEditor.tsx`) -> available/editor path
- `RichTextEditor` (`app/components/RichTextEditor.tsx`) -> available
- `RichWysiwygEditor` (`app/components/RichWysiwygEditor.tsx`) -> TinyMCE wrapper (available)
- `SimpleWysiwygEditor` (`app/components/SimpleWysiwygEditor.tsx`) -> available
- `CustomWysiwygEditor` (`app/components/CustomWysiwygEditor.tsx`) -> available
- `SimpleWysiwygInner` (`app/components/internal/SimpleWysiwygInner.tsx`) -> internal helper for `SimpleWysiwygEditor`

#### Storyblok
- `StoryblokBlogPost` (`app/components/StoryblokBlogPost.tsx`)
  - Purpose: Storyblok `blog_post` renderer
  - Used by: Storyblok integration mapping in `app/lib/storyblok.ts`

### 4.2 Tool-Local Components (`app/tools/*`)

Each tool folder usually contains `page.tsx` + one or more local client/result components.

#### Internal Link Checker (`app/tools/internal-link-checker/*`)
- `InternalLinkCheckerClient.tsx` -> main UI + long-form content
- `InternalLinkVisualization.tsx` -> canvas word cloud + modal details
- `InternalLinkDataTable.tsx` -> searchable/sortable/paginated table
- `ExportOptions.tsx` -> CSV/JSON/TXT export dropdown
- `InternalLinkCheckerClient_BACKUP.tsx` -> inactive backup file

#### Anchor Cloud (legacy parallel internal link tool)
- `AnchorCloudClient.tsx`
- `AnchorCloudVisualization.tsx`
- `AnchorDataTable.tsx`
- `ExportOptions.tsx`

#### Other tool client components (used by sibling `page.tsx`)
- `AICopywriterClient.tsx`
- `BlogIdeasGeneratorClient.tsx`
- `HtaccessGeneratorClient.tsx`
- `HTMLEditorClient.tsx`
- `KeywordDensityAnalyzerClient.tsx`
- `KeywordDifficultyCheckerClient.tsx`
- `LongTailKeywordGeneratorClient.tsx`
- `MetaTagOptimizerClient.tsx`
- `OnPageSEOAnalyzerClient.tsx`
- `RobotsTxtGeneratorClient.tsx`
- `SchemaGeneratorClient.tsx`
- `SeoMetaWriterClient.tsx`
- `TrendingHashtagFinderClient.tsx`
- `WordCounterClient.tsx`
- `XmlSitemapGeneratorClient.tsx`

### 4.3 Service-Local Components (`app/services/*`)

#### `app/services/seo-website-development/*`
- `AdvancedFeaturesSection.tsx`
- `CoreWebVitalsQuickCheck.tsx`
- `CoreWebVitalsScore.tsx`
- `FaqAccordion.tsx`
- `FaqSection.tsx`
- `PricingPackages.tsx`
- `PricingPackagesIndia.tsx`
- `SeoChecklist.tsx`

Purpose:
- Modular sections used by the SEO website development service landing page and variants.

#### `app/services/seo-website-development-usa/*`
- `AdvancedFeaturesSection.tsx`
- `CoreWebVitalsQuickCheck.tsx`
- `CoreWebVitalsScore.tsx`
- `FaqSection.tsx`
- `FaqSectionUSA.tsx`
- `PricingPackagesUSA.tsx`
- `SeoChecklist.tsx`
- `USAStatesSection.tsx`
- `USAMapData.ts` (data module)

Purpose:
- USA-specific service landing page sections and state map/list UX.

### 4.4 Programmatic USA State Page Component Family (`app/usa/<state>/seo-website-development/*`)

Every state folder contains the same local component set (used by that state's local `page.tsx`):
- `CoreWebVitalsQuickCheck.tsx`
- `CoreWebVitalsScore.tsx`
- `FaqSection.tsx`
- `PricingPackages.tsx`
- `SeoChecklist.tsx`

California adds:
- `CaliforniaCitiesSection.tsx`
- `StateInfoSection.tsx`

Reason this is documented as a pattern:
- The repo contains generated copies for all 50 states; the files are repeated variants of the same page system.

## 5. Blog System (Create, Store, Fetch, Display)

### 5.1 Storage Model

Primary storage is SQLite (`blog.db`) accessed via `better-sqlite3`.
Schema bootstrap is in `app/lib/database.ts`.

Core tables:
- `authors`
- `categories`
- `articles`
- `images`
- `redirections`
- `article_tags`
- `admin_users` (initialized via auth bootstrap)

### 5.2 Authoring Workflow

Primary authoring path is the admin UI:
- `/admin/articles/new/`
- `/admin/articles/[id]/edit/`

Editors used in current active article pages:
- `BasicHtmlEditor`
- `ImageUpload`

Supporting APIs:
- `/api/admin/articles/*`
- `/api/admin/authors/*`
- `/api/admin/categories/*`
- `/api/admin/images/*`

### 5.3 Public Read Flow

Public blog pages query SQLite directly in server components using `getDatabase()`:
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/categories/[slug]/page.tsx`
- `app/authors/[slug]/page.tsx`

Related utilities:
- `app/lib/content-utils.ts` (`calculateReadTime`, `extractExcerpt`)
- `app/lib/security.ts` (`sanitizeHTML`)
- `app/lib/faq-utils.ts` (FAQ extraction + schema generation)
- `app/lib/firebase.ts` (simulated view counts)

### 5.4 Article Display Features

`app/blog/[slug]/page.tsx` includes:
- Reading progress
- View tracker
- Table of contents
- Social share
- Author bio
- Newsletter CTA/forms
- Related posts
- HTML sanitization before render
- FAQ schema extraction from content
- Rich SEO metadata and structured data

### 5.5 Storyblok (Parallel / Legacy Support)

`app/lib/storyblok.ts` provides Storyblok client helpers and `storyblokInit()` mapping to `StoryblokBlogPost`, but the primary public blog path is SQLite-backed.

## 6. Admin Panel (Routes, Features, Permissions)

### 6.1 Authentication & Permissions

Auth implementation (`app/lib/auth.ts`):
- JWT cookies (`admin-auth`) via `jose`
- `bcryptjs` password hashing
- Bootstrapped admin user from env vars (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`)

Protection layers:
- Middleware protects `/admin/*` UI routes (except login)
- API handlers should explicitly call `requireAuth()` (many do)

Current caveat:
- Do not assume middleware alone secures admin APIs; verify per-route auth enforcement.

### 6.2 Admin Route Features

- `/admin/` dashboard
  - Stats summary and nav (calls `/api/admin/stats`)
- `/admin/login/`
  - Session check + login (`/api/admin/auth/me`, `/api/admin/auth/login`)
- `/admin/articles/`
  - List/search/filter/delete articles
- `/admin/articles/new/`
  - Create article, fetch authors/categories, image upload, save article
- `/admin/articles/[id]/edit/`
  - Load article, edit, update, delete
- `/admin/authors/`
  - Authors CRUD (rich profile/SEO fields)
- `/admin/categories/`
  - Categories CRUD
- `/admin/images/`
  - Media upload/list/delete/alt text updates
- `/admin/redirections/`
  - Redirect CRUD and sync-related operations
- `/admin/settings/`
  - Admin settings/password actions

### 6.3 Content Managed by Admin

- Articles
- Authors
- Categories
- Images/media
- Redirects
- Admin credentials/settings

### 6.4 Known Admin Issues (Current Codebase)

- Some admin detail API routes may not consistently enforce `requireAuth()` (verify before extending)
- `app/api/admin/settings/route.ts` contains a broken GET path reference (`getAdminUser()` undefined)

## 7. Tools & Features (What They Do + How They Work)

### 7.1 Common Tool Pattern

Most tools follow:
- `page.tsx` for metadata/schema
- `*Client.tsx` for UI and state
- Optional `/api/...` route for crawling/AI processing
- Long-form SEO content + FAQ + related tools links
- `ToolBreadcrumb` usage

### 7.2 Tool Catalog (Complete)

1. `internal-link-checker`
- UI: multi-step crawl flow, word cloud, data table, exports
- API: `/api/internal-link-analyzer`
- Features: sitemap discovery, manual URL fallback, anchor analysis, page/no-link views

2. `on-page-seo-analyzer`
- UI: comprehensive page audit report UI
- APIs: `/api/usage-limit`, `/api/page-speed`, `/api/analyze-seo`
- Note: client references `/api/email-report` (missing route)

3. `schema-generator`
- Large client-side JSON-LD schema builder

4. `robots-txt-generator`
- Client-side robots.txt builder/generator (includes AI-crawler messaging)

5. `htaccess-generator`
- Client-side Apache `.htaccess` rule generator (redirect/security/cache/gzip presets)

6. `keyword-density-analyzer`
- API-backed content fetch (`/api/fetch-url-content`) + density analysis

7. `xml-sitemap-generator`
- API-backed crawl (`/api/crawl-website`) + XML sitemap generation

8. `meta-tag-optimizer`
- Client-side meta title/description optimization helper

9. `keyword-difficulty-checker`
- Client-side keyword difficulty heuristics

10. `long-tail-keyword-generator`
- Client-side long-tail keyword generation

11. `word-counter`
- Client-side word/character/sentence/paragraph counts + reading time

12. `html-editor`
- Browser-based HTML/CSS/JS editor with live preview and local save/copy/download

13. `ai-copywriter`
- Intended AI copy generator
- Current issue: client calls missing `/api/ai-copywriter`; backend route present is `/api/generate-copy`

14. `seo-meta-writer`
- AI meta generator via `/api/generate-meta-tags`

15. `blog-ideas-generator`
- AI blog idea generator via `/api/generate-blog-ideas`

16. `trending-hashtag-finder`
- Multi-endpoint hashtag workflows (`generate`, trending, competitor, bulk, platform-specific)

17. `anchor-cloud` (legacy/parallel)
- Older anchor analysis/word cloud tool via `/api/anchor-cloud-analyzer`

## 8. Data Flow (User -> Frontend -> API -> DB/Service -> Frontend)

### 8.1 General Flow Pattern
- User interacts with page/client component
- Client validates input and often collects reCAPTCHA token
- Client `fetch()`es `/api/...`
- API validates/auth-checks/rate-limits
- API uses SQLite and/or external services and/or internal analysis logic
- API returns JSON
- Client updates loading/error/result UI

### 8.2 Blog Flow
- Admin UI -> `/api/admin/articles/*` -> SQLite (`articles`, `article_tags`) -> admin UI refresh
- Public blog pages -> `getDatabase()` -> SQLite query -> server-render article/index

### 8.3 Media Upload Flow
- Admin UI / `ImageUpload` -> `/api/admin/images` -> `app/lib/upload.ts`
- `upload.ts` validates/scans file, stores to filesystem or data URL mode, saves DB record

### 8.4 Lead / Newsletter Flow
- Contact/inquiry/newsletter components -> respective APIs
- APIs perform reCAPTCHA checks
- Contact/inquiry send email via SMTP/Nodemailer
- Newsletter calls Brevo API

### 8.5 Tool Analysis Flow (Typical)
- Tool client -> API route (`/api/...`) -> crawl/analyze/generate -> JSON response -> tabs/charts/tables

### 8.6 Redirect Flow
- Admin redirects UI -> `/api/admin/redirections/*` -> SQLite `redirections`
- Cache/script helpers (`app/lib/redirect-cache.ts`, `scripts/sync-redirects.js`)
- Middleware serves redirects from in-code map in `middleware.ts`

## 9. Styling & Design System

### 9.1 Styling Approach
- Tailwind CSS utility-first styling
- Global CSS in `app/globals.css`
- Most UI styling is inline Tailwind classes (few extracted style primitives)
- Repeated design motifs: gradient backgrounds, white cards, rounded corners, shadows, blue primary CTAs

### 9.2 Theme Tokens (`tailwind.config.ts`)
- `primary` = blue (`#2563EB`)
- `secondary` = green (`#059669`)
- `accent` = red (`#DC2626`)
- `brand.*` helper colors
- Typography plugin customizations for headings, links, code blocks, blockquotes

### 9.3 Responsive Conventions
- Mobile-first Tailwind classes (`sm`, `md`, `lg`)
- Typical patterns:
  - `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - responsive text sizes (`text-3xl sm:text-4xl lg:text-5xl`)
  - `overflow-x-auto` for tables/tabs
  - `rounded-xl sm:rounded-2xl` / `p-3 sm:p-4 lg:p-6`

### 9.4 Typography / Content Design Conventions
- SEO-first pages use strong H1/H2 structures and long-form content sections
- Tool pages often include educational sections, FAQs, and comparative tables under the interactive tool
- Internal links are embedded contextually, not only in nav/footer

## 10. Config Files & What They Control

### 10.1 Core Build/Framework Config
- `package.json`
  - scripts and dependencies
- `next.config.ts`
  - trailing slashes, image behavior, build/lint TS bypasses, webpack tuning, externals, memory/chunk optimizations
- `middleware.ts`
  - security headers, API rate limiting, redirects, admin page auth gate
- `tailwind.config.ts`
  - theme tokens + typography plugin config
- `app/globals.css`
  - global styles/utilities

### 10.2 TS/Lint/PostCSS Config
- `tsconfig.json`
  - TS compiler options, `@/*` alias
- `eslint.config.mjs`
  - Next/TS lint config with multiple rule relaxations
- `postcss.config.js` and `postcss.config.mjs`
  - PostCSS/Tailwind integration (both formats present)

### 10.3 Deployment Config
- `vercel.json`
  - build command, response headers, CSP/security headers, rewrites, API noindex header

### 10.4 Environment Config (`.env.local`)

Contains secrets and runtime settings. Never expose values in docs/logs/commits.

Observed key groups (keys only):
- Content/CMS: `STORYBLOK_ACCESS_TOKEN`
- Newsletter/Brevo: `BREVO_API_KEY`, `BREVO_LIST_ID`
- reCAPTCHA: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
- AI: `GEMINI_API_KEY`
- Runtime: `NODE_OPTIONS`
- Admin auth: `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- APIs/platforms: `YOUTUBE_API_KEY`, `GOOGLE_PAGESPEED_API_KEY`, `NEXT_PUBLIC_TINYMCE_API_KEY`, LinkedIn and Twitter keys/tokens
- Optional (from code): `UPLOAD_STORAGE_MODE`, `VERCEL`, `NODE_ENV`

## 11. Known Constraints, Edge Cases, and Non-Negotiable Rules

### 11.1 Build Safety Constraints
- `next.config.ts` disables build blocking for ESLint and TypeScript errors
- Manual testing/review is required; do not assume CI/build catches regressions

### 11.2 Security / Auth Constraints
- Middleware protects admin pages but API handlers still need explicit `requireAuth()`
- Rate limiting uses in-memory maps (resets on restart/deploy; per-instance only)
- Security hardening is uneven across fetch/crawl endpoints

### 11.3 Tool/API Mismatch Constraints (Current)
- AI Copywriter client route mismatch (`/api/ai-copywriter` vs existing `/api/generate-copy`)
- On-Page Analyzer references missing `/api/email-report`
- Some multi-step tool backend responses are not fully handled by UI (e.g., invalid sitemap branch)

### 11.4 Content / Route Consistency Constraints
- Tool counts/labels may drift between tools hub, sitemap, and page copy
- Backup/old files exist in active folders; verify imports before editing

### 11.5 Programmatic Page Constraints
- `app/usa/*` pages are generated/templated
- Large-scale changes should be template/script-driven, not manual across all states

### 11.6 Redirect System Constraints
- Redirects are managed through DB + cache/script + middleware map workflow
- Middleware currently serves a hardcoded map (`REDIRECTIONS`) and depends on sync discipline

## 12. Page & Route Inventory (Exhaustive)

### 12.1 Public/Private `page.tsx` Routes Present in `app/`

Current `page.tsx` inventory (source-level):
- `app/admin/articles/[id]/edit/page.tsx`
- `app/admin/articles/new/page.tsx`
- `app/admin/articles/page.tsx`
- `app/admin/authors/page.tsx`
- `app/admin/categories/page.tsx`
- `app/admin/images/page.tsx`
- `app/admin/login/page.tsx`
- `app/admin/page.tsx`
- `app/admin/redirections/page.tsx`
- `app/admin/settings/page.tsx`
- `app/authors/[slug]/page.tsx`
- `app/authors/ajay-porwal-static-backup/page.tsx`
- `app/authors/rohit-sharma-static-backup/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/blog/page.tsx`
- `app/categories/[slug]/page.tsx`
- `app/contact/page.tsx`
- `app/cookie-policy/page.tsx`
- `app/founder/page.tsx`
- `app/meet-the-experts/page.tsx`
- `app/newsletter/page.tsx`
- `app/page.tsx`
- `app/privacy-policy/page.tsx`
- `app/services/ecommerce-seo/page.tsx`
- `app/services/link-building/page.tsx`
- `app/services/local-seo/page.tsx`
- `app/services/page.tsx`
- `app/services/seo-consulting/page.tsx`
- `app/services/seo-website-development/page.tsx`
- `app/services/seo-website-development-usa/page.tsx`
- `app/services/technical-seo-audit/page.tsx`
- `app/terms/page.tsx`
- `app/tools/ai-copywriter/page.tsx`
- `app/tools/anchor-cloud/page.tsx`
- `app/tools/blog-ideas-generator/page.tsx`
- `app/tools/htaccess-generator/page.tsx`
- `app/tools/html-editor/page.tsx`
- `app/tools/internal-link-checker/page.tsx`
- `app/tools/keyword-density-analyzer/page.tsx`
- `app/tools/keyword-difficulty-checker/page.tsx`
- `app/tools/long-tail-keyword-generator/page.tsx`
- `app/tools/meta-tag-optimizer/page.tsx`
- `app/tools/on-page-seo-analyzer/page.tsx`
- `app/tools/page.tsx`
- `app/tools/robots-txt-generator/page.tsx`
- `app/tools/schema-generator/page.tsx`
- `app/tools/seo-meta-writer/page.tsx`
- `app/tools/trending-hashtag-finder/page.tsx`
- `app/tools/word-counter/page.tsx`
- `app/tools/xml-sitemap-generator/page.tsx`
- `app/usa/<all 50 states>/seo-website-development/page.tsx` (see Section 2.7 for state list)

### 12.2 API Route Handler Inventory (`app/api/**/route.ts`)

Current API route files present:
- `app/api/admin/articles/[id]/route.ts`
- `app/api/admin/articles/route.ts`
- `app/api/admin/auth/login/route.ts`
- `app/api/admin/auth/logout/route.ts`
- `app/api/admin/auth/me/route.ts`
- `app/api/admin/authors/[id]/route.ts`
- `app/api/admin/authors/route.ts`
- `app/api/admin/categories/[id]/route.ts`
- `app/api/admin/categories/route.ts`
- `app/api/admin/images/[id]/route.ts`
- `app/api/admin/images/route.ts`
- `app/api/admin/redirections/[id]/route.ts`
- `app/api/admin/redirections/route.ts`
- `app/api/admin/settings/route.ts`
- `app/api/admin/stats/route.ts`
- `app/api/analyze-seo/route.ts`
- `app/api/anchor-cloud-analyzer/route.ts`
- `app/api/blog/[slug]/route.ts`
- `app/api/blog/route.ts`
- `app/api/bulk-hashtags/route.ts`
- `app/api/competitor-hashtags/route.ts`
- `app/api/contact-submit/route.ts`
- `app/api/crawl-website/route.ts`
- `app/api/fetch-url-content/route.ts`
- `app/api/generate-blog-ideas/route.ts`
- `app/api/generate-copy/route.ts`
- `app/api/generate-hashtags/route.ts`
- `app/api/generate-meta-tags/route.ts`
- `app/api/inquiry-submit/route.ts`
- `app/api/instagram-hashtags/route.ts`
- `app/api/internal-link-analyzer/route.ts`
- `app/api/linkedin-hashtags/route.ts`
- `app/api/newsletter-subscribe/route.ts`
- `app/api/page-speed/route.ts`
- `app/api/pinterest-hashtags/route.ts`
- `app/api/redirections/check/route.ts`
- `app/api/redirections/middleware/route.ts`
- `app/api/test-author/route.ts`
- `app/api/test-email/route.ts`
- `app/api/test-redirections/route.ts`
- `app/api/trending-hashtags/route.ts`
- `app/api/twitter-hashtags/route.ts`
- `app/api/usage-limit/route.ts`
- `app/api/youtube-hashtags/route.ts`

## 13. Frontend -> API Integration Map (Key Clients)

### 13.1 Tool Clients

- `AICopywriterClient` -> `/api/ai-copywriter` (current mismatch; route missing)
- `BlogIdeasGeneratorClient` -> `/api/generate-blog-ideas`
- `AnchorCloudClient` -> `/api/anchor-cloud-analyzer`
- `XmlSitemapGeneratorClient` -> `/api/crawl-website`
- `OnPageSEOAnalyzerClient` -> `/api/usage-limit`, `/api/page-speed`, `/api/analyze-seo`, `/api/email-report` (missing)
- `InternalLinkCheckerClient` -> `/api/internal-link-analyzer`
- `TrendingHashtagFinderClient` -> `/api/generate-hashtags`, `/api/competitor-hashtags`, `/api/bulk-hashtags` (+ others depending on flow)
- `KeywordDensityAnalyzerClient` -> `/api/fetch-url-content`
- `SeoMetaWriterClient` -> `/api/generate-meta-tags`

### 13.2 Shared Conversion Components

- `ContactForm` -> `/api/contact-submit`
- `InquiryForm` -> `/api/inquiry-submit`
- `FloatingContactPopup` -> `/api/contact-submit`
- `NewsletterFormSection` -> `/api/newsletter-subscribe`
- `NewsletterPageForm` -> `/api/newsletter-subscribe`
- `NewsletterSubscription` -> `/api/newsletter-subscribe`
- `BlogNewsletterForm` -> `/api/newsletter-subscribe`
- `BlogSidebarSubscription` -> `/api/newsletter-subscribe`
- `ArticleNewsletter` -> `/api/newsletter-subscribe`

### 13.3 Admin UI Pages / Components

- `AdminNav` -> `/api/admin/auth/logout`
- `admin/login` -> `/api/admin/auth/me`, `/api/admin/auth/login`
- `admin/page` -> `/api/admin/stats`
- `admin/articles` -> `/api/admin/articles`, `/api/admin/articles/[id]`
- `admin/articles/new` -> `/api/admin/authors`, `/api/admin/categories`, `/api/admin/articles`
- `admin/articles/[id]/edit` -> `/api/admin/articles/[id]`, `/api/admin/authors`, `/api/admin/categories`
- `admin/authors` -> `/api/admin/authors`, `/api/admin/authors/[id]`
- `admin/categories` -> `/api/admin/categories`, `/api/admin/categories/[id]`
- `admin/images` -> `/api/admin/images`, `/api/admin/images/[id]`
- `ImageUpload` / `MediaLibraryModal` -> `/api/admin/images`
- `admin/redirections` -> `/api/admin/redirections`, `/api/admin/redirections/[id]`
- `admin/settings` -> `/api/admin/settings`

## 14. Full Component Coverage Notes (How to Interpret This Doc)

To avoid an unreadable 1:1 dump of every generated state component file, this doc uses:
- Explicit listings for all shared and unique local components
- Pattern-based coverage for generated USA state page components (`app/usa/<state>/seo-website-development/*`)

This still covers every component family/file type present in the repository while staying maintainable.

## 15. Practical Rules for Future Changes

- Always verify whether a file is active or backup before editing (`*_BACKUP`, `*.old`, `*.backup`, `page_old.tsx`, etc.)
- For new tools, follow `docs/tool-template.md` unless explicitly instructed to deviate
- When adding a new tool/page, update route registration points:
  - `app/layout.tsx` (navigation/menu)
  - `app/tools/page.tsx` (tools index, if tool)
  - `app/sitemap.ts`
- Do not expose `.env.local` values in code, docs, commit messages, or logs
- Use scripts/templates for repeated structures (especially USA state pages and redirect sync workflows)

