# Tool Page Master Reference Template (Based on `/tools/internal-link-checker/`)

This document is the source-backed reference for building future SEOShouts tools using the same layout, design language, SEO structure, and implementation conventions as the existing Internal Link Checker.

Primary reference files:
- `app/tools/internal-link-checker/page.tsx`
- `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx`
- `app/tools/internal-link-checker/InternalLinkVisualization.tsx`
- `app/tools/internal-link-checker/InternalLinkDataTable.tsx`
- `app/tools/internal-link-checker/ExportOptions.tsx`
- `app/api/internal-link-analyzer/route.ts`
- `app/components/ToolBreadcrumb.tsx`

Related route registrations:
- `app/layout.tsx:507` (header tools menu link)
- `app/tools/page.tsx:555` (tools index card)
- `app/sitemap.ts:53` (tool sitemap inclusion)

## 1. Page Structure

### 1.1 Route/Page split (server + client)
- The public route is defined by App Router at `app/tools/internal-link-checker/page.tsx`, which maps to `/tools/internal-link-checker/`.
- `page.tsx` is a server component wrapper that handles:
  - Static metadata (`export const metadata`)
  - JSON-LD schema script tags
  - Mounting the interactive client component (`<InternalLinkCheckerClient />`) (`app/tools/internal-link-checker/page.tsx:269`)
- The full UI and tool logic live in `InternalLinkCheckerClient.tsx`.

### 1.2 High-level page hierarchy (top to bottom)
There is no sidebar on this tool page. It is a single-column content flow inside the global site shell (global header/footer come from `app/layout.tsx`).

Order in `InternalLinkCheckerClient.tsx`:
1. Page wrapper (`min-h-screen` + gradient background) (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:324`)
2. Main interactive section (`<section>`):
   - H1 + answer-style intro paragraph
   - Tool box (input form state OR results state)
3. `ToolBreadcrumb` section (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:878`)
4. Author expertise block
5. Long-form educational content sections (multiple H2 sections)
6. FAQ section (native `details/summary`)
7. Related tools grid + "Browse All Tools" CTA
8. Final CTA section (gradient background, scroll-to-top button)

### 1.3 Interactive area structure (the "hero + tool" region)
Inside the first section (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:328`):
- H1 headline (SEO-first, benefit-heavy)
- Short "answer capsule" intro paragraph (highlighted callout)
- Main tool container card:
  - Pre-analysis state:
    - Form title and description
    - Usage counter badge
    - URL input
    - reCAPTCHA
    - Error area
    - Loading state
    - Multi-step user input prompts (sitemap/manual URLs)
    - Primary submit button
    - Inline feature bullets ("Key Features")
  - Post-analysis state:
    - Results header + export + reset
    - Summary stat cards
    - Tabbed results container
      - Word Cloud
      - Data Table
      - All Pages
      - No Links

### 1.4 Results sub-layout hierarchy
- Results wrapper (`space-y-8`)
- Results header card (success status + export/reset)
- Stats grid (5 cards)
- Tab nav + tab panel container
- Tab panels delegate heavy UI to child components:
  - `InternalLinkVisualization`
  - `InternalLinkDataTable`
  - inline "All Crawled Pages"
  - inline "Pages with No Internal Links"

### 1.5 Long-form content structure pattern (after tool)
The tool page intentionally continues after the utility and acts as a full SEO landing page.

The current page uses this pattern:
- Author trust block
- Definition/explainer section ("What is...")
- Features section
- How-to section
- Why-it-matters section
- Benchmark/ratio section
- Common mistakes section
- Best-practice guidance section
- AI search adaptation section
- Comparison table section
- Checklist section
- FAQ
- Related tools
- Final CTA

Use this same sequencing for future tools unless the user explicitly requests fewer sections.

## 2. Design & Styling

### 2.1 Core visual language
The tool follows the SEOShouts design system conventions:
- Light gradient page backgrounds
- White content cards with soft borders and medium/large shadows
- Blue (`primary`) as brand color, with supporting green/orange/purple for semantic highlights
- Large bold headings with gradient text spans
- Rounded cards (`rounded-xl`, `rounded-2xl`, `rounded-3xl`)
- Tailwind utility-first styling throughout (no local CSS module for this tool)

Key wrapper classes:
- Page background: `min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:324`)
- Standard section spacing: `py-16` (content sections), lighter `py-8` for tool/breadcrumb
- Container pattern: `container mx-auto px-4 sm:px-6`
- Content width pattern:
  - `max-w-6xl mx-auto` for most sections
  - `max-w-4xl mx-auto` for narrower blocks

### 2.2 Typography conventions
- H1:
  - `text-3xl sm:text-4xl lg:text-5xl font-bold`
  - Often wrapped with gradient text span: `bg-gradient-to-r ... bg-clip-text text-transparent`
- Section H2:
  - `text-3xl sm:text-4xl font-bold mb-8 text-center`
  - Usually gradient text span inside
- H3:
  - Varies by context:
    - Cards/feature tiles: `font-bold text-gray-900`
    - Content subsections: `text-2xl font-bold`
    - Step cards: `text-lg font-bold`
- Body copy:
  - Usually `text-gray-700 leading-relaxed`
  - Intro paragraphs often `text-lg`
  - Utility/explanations often `text-sm`

### 2.3 Card patterns (repeatable)
Most reusable card styles on this page:
- Main tool form card:
  - `bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8`
- Results major card:
  - `bg-white rounded-3xl shadow-2xl border border-gray-100`
- Standard content card:
  - `bg-white rounded-2xl shadow-lg border border-gray-100 p-6`
- Highlight/info callout:
  - Gradient background + colored border
  - Example: `bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6`

### 2.4 Buttons and interaction styling
- Primary action buttons are gradient or solid `primary`, large, rounded, animated:
  - Example submit button: `bg-gradient-to-r from-primary to-blue-600 ... rounded-xl ... hover:shadow-xl hover:scale-105`
- Secondary buttons use gray or outlined variants.
- Tab buttons use active state:
  - Active: `bg-primary text-white`
  - Inactive: `text-gray-600 hover:text-primary hover:bg-gray-50`

### 2.5 Tables and data containers
- Wrap tables in `overflow-x-auto`.
- Use bordered white table cards:
  - `bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden`
- Headers often use brand gradient row:
  - `bg-gradient-to-r from-primary to-blue-600 text-white`

### 2.6 Responsive behavior conventions
Patterns used consistently:
- Mobile-first typography scaling (`text-3xl sm:text-4xl lg:text-5xl`)
- Grid escalation:
  - `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Mobile table adaptations:
  - Hide some columns on small screens (`hidden sm:table-cell`)
  - Duplicate important info into visible mobile rows
- Tabs are horizontally scrollable on mobile:
  - `overflow-x-auto scrollbar-hide`
- Cards reduce radius/padding on smaller screens in some places:
  - `rounded-xl sm:rounded-2xl`, `p-3 sm:p-4 lg:p-6`

### 2.7 Color usage conventions
- Brand color token: `primary` (custom Tailwind theme color)
- Supporting palette for semantic states:
  - Blue = neutral/info/brand
  - Green = success/healthy
  - Yellow/Orange = warning/manual step UI
  - Red = errors/risks
  - Purple/Indigo/Pink = feature differentiation

## 3. Components Used

### 3.1 Page-level components (used directly by route)
1. `InternalLinkCheckerClient`
- File: `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx`
- Role: Main interactive UI + long-form page content + client-side workflow state.

### 3.2 Components used inside `InternalLinkCheckerClient`
1. `ReCAPTCHA` (third-party)
- Import: `react-google-recaptcha` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:4`)
- Role: Bot protection before API requests.

2. `ToolBreadcrumb`
- File: `app/components/ToolBreadcrumb.tsx`
- Used at: `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:878`
- Role:
  - Renders visual breadcrumb UI
  - Injects BreadcrumbList JSON-LD (important note: this duplicates breadcrumb schema already injected in `page.tsx`)

3. `InternalLinkVisualization`
- File: `app/tools/internal-link-checker/InternalLinkVisualization.tsx`
- Used at: `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:758`
- Role:
  - Interactive canvas-based anchor word cloud
  - Filters by text/min frequency
  - Hover/click interaction
  - Modal details for selected anchor
  - "Quick Insights" summary block

4. `InternalLinkDataTable`
- File: `app/tools/internal-link-checker/InternalLinkDataTable.tsx`
- Used at: `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:764`
- Role:
  - Searchable, sortable, paginated anchor table
  - Frequency filtering
  - Detail modal for selected anchor

5. `ExportOptions`
- File: `app/tools/internal-link-checker/ExportOptions.tsx`
- Used at: `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:658`
- Role:
  - Dropdown export menu
  - CSV / JSON / TXT report export (client-side blob downloads)

### 3.3 Native elements used as UX components
- `details` / `summary` for FAQs (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:1834`)
- `<table>` for ratio/comparison/result tables
- `<canvas>` for custom visualization
- Inline `<script type="application/ld+json">` for schema

### 3.4 Non-runtime file in folder
- `app/tools/internal-link-checker/InternalLinkCheckerClient_BACKUP.tsx`
- Backup file, not imported by route.
- Do not treat as active implementation when cloning patterns.

## 4. Content Structure

### 4.1 Content strategy pattern
This tool page is both:
- A functional SEO tool
- A long-form SEO landing page targeting tool-related queries

The writing style is:
- Answer-first
- Benefit-driven
- Data-backed (industry stats, studies, named sources)
- Comparison-oriented (positioning vs competitors)
- Action-oriented (how-to steps, checklist, CTA)

### 4.2 Content blocks and their purpose (current page)
1. H1 + answer capsule
- Immediate answer to "what is this tool" and why it matters
- Includes unique positioning ("visual word cloud")

2. Tool form area
- Instructional microcopy
- Usage limit transparency
- Error/help states
- Feature bullets

3. Author expertise block
- Trust and credibility
- Founder quote
- Link to expert page

4. Educational sections (multiple H2s)
- Definition and why it matters
- Feature breakdown
- Step-by-step how-to
- Strategic SEO explanation
- Benchmarks and ratio tables
- Mistakes and fixes
- AI search adaptation
- Comparison table
- Checklist

5. FAQ section
- 10 FAQs rendered on page
- Matches FAQPage schema questions

6. Internal cross-sell / related tools grid
- 6 featured tools + tools index CTA

7. Final CTA
- Restates urgency/value and scrolls user back to top tool area

### 4.3 Heading hierarchy conventions
- Exactly one H1 in tool area (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:333`)
- Many H2s for long-form sections (major topic blocks)
- H3s for cards/subsections/features/FAQ blocks
- FAQ uses `summary` text rather than H3

Current major H2 sections (order):
1. Tool form heading (inside card, not page H2 for content)
2. Results heading (conditional)
3. What Is an Internal Link Checker...
4. Key Features...
5. How to Audit...
6. Why Anchor Text Is...
7. The Ideal Internal Anchor Text Ratio
8. 5 Common Anchor Text Mistakes...
9. How Many Internal Links Should a Page Have?
10. How to Optimize Internal Links for AI Search Engines (2026)
11. SEOShouts vs Other Internal Link Checkers
12. Complete Internal Link Audit Checklist (2026)
13. Frequently Asked Questions
14. Explore Our Other Free SEO Tools
15. Start Your Internal Link Audit Now

### 4.4 Reusable content composition rules for future tools
When building a new tool page, preserve this content skeleton:
- H1 + short answer summary
- Interactive tool block
- Trust/author section
- "What is [tool]" explainer
- "Key features" grid
- "How to use [tool]" steps
- Topic-specific best practices / benchmarks / mistakes / comparisons
- FAQ (8-12 questions)
- Related tools links
- Final CTA

Only shorten/remove sections if the user explicitly asks.

## 5. Schema Markup

### 5.1 Where schema is implemented
Schema is injected inline in `app/tools/internal-link-checker/page.tsx` using JSON-LD scripts (`dangerouslySetInnerHTML`) (`app/tools/internal-link-checker/page.tsx:45`, `:102`, `:195`, `:239`).

Additional breadcrumb schema is also injected by `ToolBreadcrumb` (`app/components/ToolBreadcrumb.tsx:11`).

### 5.2 Schema types used on this page
1. `SoftwareApplication`
- Purpose: Tool/product schema for the web app
- Location: `app/tools/internal-link-checker/page.tsx:45`
- Key fields used:
  - `@type`, `name`, `description`, `url`
  - `applicationCategory`, `applicationSubCategory`
  - `operatingSystem`
  - `offers` (free tool)
  - `author` (Person)
  - `publisher` (Organization + logo)
  - `featureList`
  - `screenshot`
  - `softwareVersion`
  - `datePublished`, `dateModified`

2. `FAQPage`
- Purpose: Rich results eligibility for FAQs
- Location: `app/tools/internal-link-checker/page.tsx:101`
- Key fields:
  - `mainEntity` array of `Question` + `acceptedAnswer`
- Pattern:
  - The schema content mirrors the rendered FAQ section.

3. `HowTo`
- Purpose: Structured how-to instructions
- Location: `app/tools/internal-link-checker/page.tsx:194`
- Key fields:
  - `name`, `description`, `totalTime`
  - `tool` (`HowToTool`)
  - `step` array (`HowToStep`, `position`, `name`, `text`)
- Pattern:
  - Mirrors the "How to Audit..." section.

4. `BreadcrumbList` (page-level)
- Purpose: Breadcrumb rich result
- Location: `app/tools/internal-link-checker/page.tsx:238`
- Items:
  - Home
  - SEO Tools
  - Internal Link Checker

5. `BreadcrumbList` (component-level duplicate)
- Purpose: Also provided by `ToolBreadcrumb`
- Location: `app/components/ToolBreadcrumb.tsx:11`
- Note:
  - Current page outputs breadcrumb schema twice (duplicate type/data).
  - Future tools should use a single breadcrumb schema source to avoid duplication.

### 5.3 Reusable schema pattern for future tools
For future tools, adapt this same schema stack:
- `SoftwareApplication` (required for tool pages)
- `FAQPage` (if FAQ section exists)
- `HowTo` (if you include step-by-step usage content)
- `BreadcrumbList` (one source only)

Update all tool-specific values:
- Tool name
- Description
- URL/canonical
- Feature list
- Screenshot
- FAQ questions/answers
- HowTo steps
- Date fields

## 6. SEO Elements

### 6.1 Metadata implementation pattern
The page uses static Next.js metadata (`export const metadata`) in `app/tools/internal-link-checker/page.tsx:4`.

Elements present:
- `title`
- `description`
- `keywords`
- `metadataBase`
- `alternates.canonical`
- `openGraph` (title, description, url, siteName, type, image)
- `twitter` (card, title, description, image)
- `robots` (`index`, `follow`)
- `other.language`

### 6.2 Canonical and URL consistency
- Canonical is explicit and uses trailing slash:
  - `https://seoshouts.com/tools/internal-link-checker/` (`app/tools/internal-link-checker/page.tsx:10`)
- Internal links in the site also use trailing slashes.
- Tool route registrations (nav/tools index/sitemap) follow the same trailing slash convention.

### 6.3 OG/Twitter pattern
- Dedicated OG image path:
  - `/images/internal-link-checker-og.png`
- Same title/description theme repeated across metadata layers.
- Messaging emphasizes:
  - Free
  - Crawl limit
  - Visual word cloud uniqueness
  - No login

### 6.4 On-page SEO structure pattern
- One strong H1
- Many H2s targeting adjacent long-tail queries
- Internal contextual links to:
  - Related tools
  - Related blogs
  - Services
  - Expert page
- FAQ + schema parity
- Comparison table + benchmarks + checklist (rich informational depth)

### 6.5 Heading hierarchy guidance for future tools
Follow this pattern:
- `H1`: Tool primary keyword + core outcome
- `H2`: Feature blocks / how-to / comparisons / FAQs / related tools / final CTA
- `H3`: Sub-features, step cards, mistake cards, table/card subheadings

Do not use multiple H1s.

## 7. Functionality

### 7.1 Client-side workflow summary
Main logic is in `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx`.

Core states (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:69`):
- `url`
- `isAnalyzing`
- `results`
- `error`
- `progress`
- `activeTab` (`cloud | table | pages | no-links`)
- Multi-step workflow state:
  - `userInputRequest`
  - `manualSitemapUrl`
  - `manualUrls`
- `usageInfo` (remaining daily usage / reset)
- `recaptchaRef`

### 7.2 API request flow (client)
Primary function: `performAnalysis(...)` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:131`)

Behavior:
1. Reads reCAPTCHA token (`recaptchaRef.current?.getValue()`)
2. Blocks if reCAPTCHA is missing/fails
3. Resets UI state for a new attempt
4. Sends `POST` to `/api/internal-link-analyzer` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:177`)
5. Uses `AbortController` with 30-minute timeout for entire analysis
6. Handles:
   - success (`data.success`)
   - multi-step continuation (`data.needsUserInput`)
   - rate limit (`429`)
   - timeout / generic errors

Request payload pattern:
- Base:
  - `url`
  - `recaptchaToken`
  - `step` (default `discover`)
- Optional:
  - `sitemapUrl`
  - `manualUrls` (array)

### 7.3 Multi-step UI workflow (client)
Handlers:
- `handleAnalyze` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:249`)
- `handleUserChoice` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:260`)
- `handleSitemapSubmit` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:283`)
- `handleManualUrlsSubmit` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:291`)
- `resetAnalysis` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:310`)

Step paths supported in UI:
- Initial discovery (`discover`)
- User chooses:
  - provide sitemap -> `sitemap_input_needed` -> `manual_sitemap`
  - no sitemap -> `manual_urls_needed` -> `manual_urls`
- URL count too high -> ask for narrower/manual URL list

### 7.4 Results processing on client
Backend returns anchors grouped by exact `anchor text + href`.
Client adds `groupAnchors()` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:88`) to merge rows by anchor text across multiple destinations for visualization/table presentation.

Important nuance:
- Visualization/Data Table use `groupAnchors(results.anchors)`
- Export uses raw `results.anchors` (ungrouped by text-only)

### 7.5 Results tabs and outputs
1. Word Cloud tab (`InternalLinkVisualization`)
- Canvas-based word cloud with:
  - text filter
  - minimum frequency filter
  - hover highlight
  - click-to-open anchor details modal
  - quick insights summary
- File: `app/tools/internal-link-checker/InternalLinkVisualization.tsx`

2. Data Table tab (`InternalLinkDataTable`)
- Search, sort, filter, pagination
- Modal for row details
- Mobile-optimized column collapse
- File: `app/tools/internal-link-checker/InternalLinkDataTable.tsx`

3. All Pages tab (inline UI)
- Lists each crawled page with:
  - title
  - URL
  - link count
  - error status
- Color-coded rows by state

4. No Links tab (inline UI)
- Lists pages with no internal links found in content or crawl failures
- Shows "Excellent" empty state when none exist

5. Export dropdown (`ExportOptions`)
- CSV export
- JSON export
- Plain text report export
- Client-side blob download only (no backend export endpoint)

### 7.6 Backend API behavior (`/api/internal-link-analyzer`)
Route file: `app/api/internal-link-analyzer/route.ts`

#### Request validation and protection
- Parses request body manually (`app/api/internal-link-analyzer/route.ts:463`)
- Requires:
  - `url` string
  - `recaptchaToken` string
- Verifies reCAPTCHA before daily usage is consumed (`app/api/internal-link-analyzer/route.ts:492`)
- Applies rate limits:
  - Daily tool limit: 5/day (`dailyRateLimit`) on new analyses only (`app/api/internal-link-analyzer/route.ts:520`)
  - Short-term rate limit: 5 requests / 5 min (`app/api/internal-link-analyzer/route.ts:600`)

#### URL discovery workflow (sitemap-first)
Helpers:
- `checkRobotsTxt()` (`app/api/internal-link-analyzer/route.ts:166`)
- `extractUrlsFromSitemap()` (`app/api/internal-link-analyzer/route.ts:257`)
- `discoverUrlsFromSitemap()` (`app/api/internal-link-analyzer/route.ts:341`)

Discovery strategy:
1. If user provides sitemap URL, try it first
2. Try common sitemap locations:
   - `/sitemap.xml`
   - `/sitemap_index.xml`
   - `/sitemap.xml.gz`
3. If not found, parse `robots.txt` for `Sitemap:` entries
4. If still not found, return `needsUserInput`

Filtering during sitemap parsing:
- Same-domain only
- HTML-like URLs only (exclude assets/docs/etc.)
- Attempts to avoid alternate language variants unless matching base path language

#### Step-based backend contract
Handled steps:
- `discover` (default)
- `manual_sitemap`
- `manual_urls`

Possible `needsUserInput` responses:
- `no_sitemap_found`
- `invalid_sitemap`
- `url_limit_exceeded`

#### Crawl and analysis behavior
- Safety cap: 500 URLs (`app/api/internal-link-analyzer/route.ts:782`)
- Batch concurrency: 10 URLs at a time (`app/api/internal-link-analyzer/route.ts:789`)
- Per-page timeout: 15 seconds in `fetchUrl()` (`app/api/internal-link-analyzer/route.ts:118`)
- HTML parsing uses regex-based extraction (`extractInternalLinks()`) and attempts to remove header/footer/nav/aside areas first (`app/api/internal-link-analyzer/route.ts:62`)
- Aggregates anchor stats:
  - Count by exact text + destination URL
  - Tracks source pages
  - Builds insights summary
  - Tracks pages with no internal links / errors

#### Response payload (success)
- `success: true`
- `data`:
  - `baseUrl`
  - `anchors`
  - `insights`
  - `crawledPages`
  - `pagesWithNoLinks`
- `progressSteps`
- `remainingRequests`
- `resetTime`

### 7.7 Error handling patterns
Client-side:
- Input required validation
- reCAPTCHA missing/failed
- timeout (30-minute top-level timeout)
- rate limit UI with friendly explanation
- empty manual URL validation

Server-side:
- Invalid JSON / empty body
- invalid URL
- recaptcha failure
- rate limits (429)
- no URLs discovered
- unexpected errors with generic fallback

### 7.8 Current implementation quirks (important for future tools)
These are real behaviors in the current tool; do not copy blindly.

1. Backend step mismatch
- API can return `step: "invalid_sitemap"` with options (`app/api/internal-link-analyzer/route.ts:697`)
- Client UI only renders options for `no_sitemap_found` (`app/tools/internal-link-checker/InternalLinkCheckerClient.tsx:483`)
- Result: invalid sitemap follow-up options may not render correctly.

2. Duplicate breadcrumb schema
- Both `page.tsx` and `ToolBreadcrumb` inject `BreadcrumbList` JSON-LD.

3. Export naming is leftover from anchor-cloud
- `ExportOptions` filenames/report text still use `anchor-cloud` labels and legacy URL (`app/tools/internal-link-checker/ExportOptions.tsx:69`, `:101`, `:175`)

4. `progressSteps` are returned by API but not meaningfully rendered in the UI
- UI stores `progress` string only and `userInputRequest.progressSteps`, but does not display step timeline.

## 8. Internal Linking

### 8.1 Internal links within the tool page content
The page includes deliberate contextual links inside educational copy, not only in nav/footer. Examples in `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx`:
- Expert page: `/meet-the-experts/` (`:899`)
- Blog pages:
  - `/blog/internal-linking-strategy/` (`:1174`)
  - `/blog/anchor-text-optimization/` (`:1365`)
- Service page:
  - `/services/technical-seo-audit/` (`:1357`)
- Related tools:
  - `/tools/on-page-seo-analyzer/` (`:1412`, `:1476`, `:1930`, plus related tools cards)
  - `/tools/schema-generator/` (`:1557`, related tools cards)
  - `/tools/robots-txt-generator/` (`:1557`, related tools cards)
  - `/tools/keyword-density-analyzer/` (`:1983`)
  - `/tools/meta-tag-optimizer/` (`:1992`)
  - `/tools/xml-sitemap-generator/` (`:2001`)
- Tools hub:
  - `/tools/` (`:2010`)

### 8.2 Breadcrumb internal links
`ToolBreadcrumb` adds clickable links to:
- Home (`https://seoshouts.com/`)
- SEO Tools (`https://seoshouts.com/tools/`)
- Current tool label (not linked in visual breadcrumb; current page text)

### 8.3 Sitewide route registration links for this tool
- Header tools mega menu link in `app/layout.tsx:507`
- Tools index card CTA in `app/tools/page.tsx:574`
- Sitemap entry generation in `app/sitemap.ts:55`

### 8.4 Internal linking pattern to replicate in future tools
Every tool page should include:
- Breadcrumb path to Home > Tools > Current Tool
- Contextual links to:
  - at least 1 related blog
  - at least 1 related service (where relevant)
  - 2-6 complementary tools
- Related tools section near bottom
- Tools hub CTA (`/tools/`)

Do not rely only on header/footer links.

## 9. URL & Routing Structure

### 9.1 Public route definition
- File-system route: `app/tools/internal-link-checker/page.tsx`
- Public URL: `/tools/internal-link-checker/`

### 9.2 Internal file organization pattern (tool directory)
Current tool directory structure:
- `page.tsx` (server wrapper, metadata, schema)
- `InternalLinkCheckerClient.tsx` (main client page UI + logic + long-form content)
- `InternalLinkVisualization.tsx` (results visualization tab)
- `InternalLinkDataTable.tsx` (results table tab)
- `ExportOptions.tsx` (export dropdown)
- `InternalLinkCheckerClient_BACKUP.tsx` (inactive backup)

Recommended pattern for future tools:
- Keep `page.tsx` minimal and SEO-focused
- Put interactive logic in `*Client.tsx`
- Split heavy subviews into dedicated local components in the same tool folder

### 9.3 Backend route pairing pattern
- Tool frontend route: `/tools/internal-link-checker/`
- API route: `/api/internal-link-analyzer` from `app/api/internal-link-analyzer/route.ts`

For future tools:
- Use a dedicated API route if server-side crawling/AI/processing is needed
- Name API route after function, not necessarily exact page slug, but keep it obvious

### 9.4 Registration points to update for new tools
When creating a new tool, register it in all relevant places:
1. `app/tools/page.tsx` (tools listing card)
2. `app/layout.tsx` (header tools menu and/or footer if present)
3. `app/sitemap.ts` (tool slug in `toolPages` array)
4. Tool page metadata canonical + OG/Twitter URLs
5. Any related-tools sections on other tool pages (optional but recommended)

## 10. Reusable Patterns (Rules for All Future Tools)

Use these as default requirements unless the user explicitly requests deviations.

### 10.1 Page architecture rules
- Use App Router folder route under `app/tools/<tool-slug>/`.
- Keep `page.tsx` for metadata + JSON-LD + mounting client component.
- Put interactive UI in `*Client.tsx`.
- Split heavy results widgets into local subcomponents.

### 10.2 UX/layout rules
- Start with a tool-first hero section (H1 + short answer + interactive card).
- Keep the tool usable before long-form content (no forcing scroll first).
- Follow with breadcrumb, trust block, educational content, FAQ, related tools, final CTA.
- Use single-column content flow (no sidebar) unless explicitly requested.

### 10.3 Design/styling rules
- Reuse SEOShouts Tailwind conventions:
  - light gradients
  - white cards
  - `primary` brand accents
  - rounded-xl/2xl/3xl
  - border + shadow layering
- Use mobile-first responsive classes.
- Wrap tables in `overflow-x-auto`.
- Keep typography and spacing consistent with this tool.

### 10.4 SEO/content rules
- Add strong metadata:
  - title
  - description
  - canonical
  - OG
  - Twitter
  - robots
- Use one H1 and a deep H2/H3 content hierarchy.
- Include FAQ section and mirror it in FAQ schema.
- Include contextual internal links to related tools/blog/services.
- Add bottom related-tools section and tools hub CTA.

### 10.5 Schema rules
- Default stack for tools:
  - `SoftwareApplication`
  - `FAQPage`
  - `HowTo` (when applicable)
  - `BreadcrumbList`
- Keep schema content aligned with visible on-page content.
- Do not duplicate the same schema type from multiple sources.

### 10.6 Functionality rules
- If backend processing is needed:
  - reCAPTCHA for abuse-prone endpoints
  - rate limiting
  - clear error messages
  - explicit request/response contracts
- Show user-facing loading, error, and empty states.
- Make limits transparent (daily usage, max URLs, etc.).
- Provide export/share options when output is data-heavy.

### 10.7 Data/result presentation rules
- Prefer at least two output modes when useful:
  - visual summary
  - detailed table/list
- Add summary stats cards above detailed results.
- Use tabs for multi-view results.
- Support filtering/searching for large result sets.

### 10.8 QA rules (do not repeat current tool mistakes)
- Ensure all backend response step types are handled by UI.
- Remove legacy naming when cloning components (filenames, report labels, URLs).
- Avoid duplicate schema injection.
- Keep copied components visually aligned with the reference tool (radius, shadow, icon style).

## Build-New-Tool Checklist (Practical Use)

When building a new tool from user-provided instructions/content:
1. Create `app/tools/<slug>/page.tsx` with metadata + schemas + client mount.
2. Create `app/tools/<slug>/<ToolName>Client.tsx` with:
   - H1 + answer capsule
   - tool card (input -> result state)
   - breadcrumb
   - long-form sections
   - FAQ
   - related tools
   - final CTA
3. Add any subcomponents for results visualization/table/export.
4. Add API route if needed under `app/api/.../route.ts`.
5. Register tool in `app/tools/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`.
6. Add internal links to related pages/tools in body content.
7. Verify schema matches rendered content.
8. Verify responsive behavior and tab/table mobile states.

