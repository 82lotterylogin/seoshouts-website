# AGENTS.md

## Read This First

Before making changes, always read:
- `docs/design.md`
- `docs/decisions.md`

Those files contain the project architecture, conventions, and historical decisions that should guide all future changes.

## Project Overview

### Purpose
SEOShouts is a Next.js-based SEO platform that combines:
- A marketing website for SEO services
- A free SEO tools suite
- A blog/CMS
- An admin panel for content/media/redirect management
- Lead generation workflows (contact, inquiry, newsletter)

### Primary Goals
- Acquire organic traffic via SEO-first pages, tools, and programmatic state landing pages
- Convert visitors into leads for SEO services
- Provide free tools that demonstrate expertise and drive recurring visits
- Manage blog and site content in-house via a lightweight admin/CMS

### Target Audience
- Small and mid-size businesses needing SEO services
- SEO practitioners / marketers using free SEO tools
- Content teams needing meta/schema/technical helpers
- Users researching SEO topics via blog content

## Tech Stack

### Core Framework
- `Next.js` (App Router)
- `React 19`
- `TypeScript`

### Styling / UI
- `Tailwind CSS`
- `@tailwindcss/typography`
- Utility-first CSS in `app/globals.css`

### Backend / Data
- Next.js Route Handlers (`app/api/**/route.ts`)
- `better-sqlite3` (SQLite DB: `blog.db`)
- Local DB bootstrap/schema creation in `app/lib/database.ts`

### Auth / Security
- `jose` (JWT auth for admin)
- `bcryptjs` (password hashing)
- Custom middleware security headers + rate limiting (`middleware.ts`, `app/lib/security.ts`)
- `react-google-recaptcha` + server-side reCAPTCHA verification on high-abuse endpoints

### Content / CMS
- SQLite-backed blog/admin (primary)
- Storyblok integration present (`@storyblok/react`, `storyblok-js-client`) for legacy/parallel content workflows

### Editors / Rich Text
- `@tinymce/tinymce-react`
- `@tiptap/*`
- `react-simple-wysiwyg`
- `@uiw/react-md-editor`

### AI / External APIs
- `@google/generative-ai` (Gemini SDK)
- Gemini REST usage in some endpoints
- Google PageSpeed API
- Brevo API (newsletter)
- SMTP/Nodemailer (contact/inquiry emails)
- Social/platform hashtag endpoints (Twitter/X, YouTube, etc. where configured)

### Utilities / Other Libraries
- `dompurify` / `isomorphic-dompurify`
- `uuid`
- `multer` (types present; file upload handling is custom in current code)
- `@mirawision/usa-map-react` (USA services page map)

### Build / Deployment
- Vercel config (`vercel.json`)
- Next config custom webpack tuning (`next.config.ts`)
- Scripts for redirect sync + state page generation (`scripts/`)

## Top-Level Folder Structure

- `app/` — Next.js App Router pages, route handlers, shared components, and app libraries
- `public/` — Static assets (images, uploads)
- `docs/` — Internal project documentation and reusable build templates
- `scripts/` — Maintenance/codegen scripts (state pages, redirects sync)
- `utils/` — Misc utility modules (currently email helper)
- `compiled/` — Build/runtime artifacts used by local workflows (non-source)
- `out/` — Export/build output artifacts (non-source)
- `.next/` — Next.js build cache/output (generated)
- `node_modules/` — Dependencies (generated)
- `.claude/` — Local agent/tooling metadata (non-app runtime)

### Important Root Files
- `package.json` — Scripts + dependency graph
- `next.config.ts` — Next.js build/runtime config
- `tailwind.config.ts` — Tailwind theme/tokens/plugins
- `middleware.ts` — Security headers, API rate limiting, redirects, admin route gate
- `blog.db` — SQLite database for blog/admin/CMS data
- `redirections-cache.json` — Redirect cache artifact
- `.env.local` — Local environment variables (secrets; do not commit values)
- `vercel.json` — Deployment headers/rewrites config

## Key Coding Rules & Conventions (Project-Specific)

### App Structure Patterns
- Tool pages follow `app/tools/<slug>/page.tsx` + `*Client.tsx` pattern.
- `page.tsx` usually handles metadata + JSON-LD; client logic lives in sibling client component.
- Heavy result UIs are split into local subcomponents in the same tool folder.
- Admin pages are client-heavy and call authenticated `/api/admin/*` endpoints.

### Routing Conventions
- Public URLs use trailing slashes (enabled in `next.config.ts`).
- Tool URLs live under `/tools/<slug>/`.
- Service pages live under `/services/<slug>/`.
- Programmatic state pages live under `/usa/<state>/seo-website-development/`.

### Styling Conventions
- Tailwind utility classes only (no large component CSS modules in main app patterns).
- Brand colors rely on Tailwind theme tokens (`primary`, `secondary`, `accent`).
- Consistent card-based layouts with rounded corners, borders, and shadows.
- Mobile-first responsive classes (`sm:`, `md:`, `lg:`) used throughout.

### Data / API Conventions
- Route handlers are colocated under `app/api/.../route.ts`.
- Many tool APIs return `{ success, data, error }` style payloads (not universally strict).
- Heavy/bot-prone endpoints often require reCAPTCHA and/or rate limiting.
- SQLite access is direct via `better-sqlite3` (no ORM).

### Content / SEO Conventions
- Pages generally include strong metadata (`title`, `description`, OG, Twitter, canonical).
- Tool pages often include JSON-LD (`SoftwareApplication`, `FAQPage`, `HowTo`, breadcrumbs).
- Long-form SEO content is embedded directly on tool pages for organic ranking + internal linking.

### Admin / Auth Conventions
- Admin UI routes are under `/admin/*`.
- Authentication uses JWT cookie `admin-auth`.
- Middleware protects `/admin/*` pages (API routes should still enforce `requireAuth()` explicitly).

### Practical Constraints to Respect
- `next.config.ts` currently ignores TS build errors and ESLint during build; do not assume build safety catches issues.
- This repo may contain backup/old files (`*.backup`, `page_old.tsx`, `*_BACKUP.tsx`) that are not active routes.
- There are generated/templated state pages; avoid manual one-off edits across all states unless intended.

## Working Rule for Future Changes

When implementing new features or fixes:
1. Check `docs/design.md` for architecture and feature placement.
2. Check `docs/decisions.md` for prior tradeoffs and constraints.
3. Follow existing route/component patterns unless a new decision is explicitly documented.

