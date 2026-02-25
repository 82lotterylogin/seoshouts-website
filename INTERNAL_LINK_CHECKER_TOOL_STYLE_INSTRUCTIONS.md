# SEOShouts Tool Page Template (Based on `/tools/internal-link-checker/`)

Use this file as the default build brief for new SEOShouts tool pages when the goal is:
- match the look/feel of `/tools/internal-link-checker/`
- preserve SEOShouts page structure and long-form SEO content style
- allow tool-specific logic/content differences

This is a design + structure + content + schema standard, not a strict copy-paste spec.

## Goal

Build new tools so they feel like part of the same product family as `internal-link-checker`:
- same visual system
- same page flow (tool first, education/content after)
- same SEO metadata/schema rigor
- same conversion and internal-linking patterns

## File Structure (Recommended)

For a new tool at `app/tools/<tool-slug>/` use:

- `page.tsx`
  - exports `metadata`
  - injects JSON-LD schemas
  - renders `<ToolClient />`
- `<ToolName>Client.tsx`
  - main UI + results + all long-form content sections
- Optional subcomponents (split by responsibility)
  - `Visualization.tsx`
  - `DataTable.tsx`
  - `ExportOptions.tsx`
  - `ResultsTabs.tsx`
  - `Charts.tsx`
- Optional `CLAUDE.md` / content spec file
  - only if content is very large and likely to be revised separately

## Page Architecture (Match This Order)

Keep this high-level order unless the user explicitly asks otherwise:

1. `page.tsx` metadata + JSON-LD
2. Interactive tool section (top of page)
3. `ToolBreadcrumb`
4. Author/credibility block (E-E-A-T)
5. Long-form educational sections (alternating white/gray)
6. FAQ UI section
7. Related tools / cross-link section
8. Final CTA section

This is the core SEOShouts tool-page pattern.

## `page.tsx` Requirements

### Metadata pattern

Include:
- `title`
- `description`
- `keywords`
- `metadataBase`
- `alternates.canonical`
- `openGraph`
- `twitter`
- `robots`
- `other.language`

### Title/description style

Use the same style as `internal-link-checker`:
- lead with "Free" when true
- state main outcome + differentiator
- include brand (`SEOShouts`) in title
- mention no login/no signup only if true

### JSON-LD schemas (default set)

Replicate this schema stack unless tool type requires changes:

1. `SoftwareApplication` (mandatory)
2. `FAQPage` (mandatory if FAQ section exists)
3. `HowTo` (recommended for most tools)
4. `BreadcrumbList` (mandatory)

Optional additions by tool:
- `WebApplication`
- `ItemList` (for template lists / output examples)
- `Dataset` (if tool exposes downloadable structured data)

Important:
- FAQ schema and visible FAQ content should match semantically
- `dateModified` should be updated when content changes
- `featureList` should reflect real features only

## Client Page Layout Pattern (`<ToolName>Client.tsx`)

### 1) Top Wrapper

Use a soft gradient page background like:
- `min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50`

### 2) Primary Tool Section (Top)

This section must appear before long-form content.

Recommended contents:
- H1 (large, gradient text)
- answer capsule paragraph (plain-language definition + value prop)
- tool interface card
- inline usage/rate-limit status (if applicable)
- reCAPTCHA block (if API-backed)
- error/loading states
- tool-specific inputs
- submit CTA button
- small "Key Features" row/grid inside the tool card (pre-results)

Design cues to match:
- white cards
- rounded corners (`rounded-2xl` / `rounded-3xl`)
- subtle borders (`border-gray-100/200`)
- shadow (`shadow-lg` / `shadow-2xl`)
- blue gradient CTAs

### 3) Results Experience (If Tool Produces Results)

Follow the `internal-link-checker` pattern:
- results header card (success state + domain/output target)
- export menu
- reset/new analysis button
- summary stats cards
- tabbed results area (if multiple output views exist)
- subcomponents for complex views

Preferred tabs pattern:
- visual view
- data table
- raw/source/pages
- issues/exceptions

### 4) Breadcrumb Placement

Render `ToolBreadcrumb` immediately after the tool/results section.

## Long-Form SEO Content Pattern (Below Tool)

Match the `internal-link-checker` style: long, useful, structured educational content that supports ranking and user trust.

### Recommended section stack (adapt topic-specific copy)

1. Author expertise / creator credibility block
2. "What is <tool/topic>?" explainer
3. Key features (detailed cards)
4. "How to use / audit / generate" step-by-step section
5. "Why this matters" strategic explanation section
6. Benchmarks / ideal ratios / best practices table
7. Common mistakes + fixes
8. Advanced/AI-search angle (when relevant)
9. Comparison vs alternatives (optional but strong)
10. Checklist / SOP section
11. FAQ
12. Related tools grid
13. Final CTA banner

You can remove or merge sections, but keep the overall rhythm:
- tool -> proof/authority -> education -> FAQ -> cross-link -> CTA

## Content Writing Rules (To Match This Tool Family)

### Tone and style

Use:
- direct, expert, practical tone
- plain-language explanations first, technical detail second
- outcome-driven phrasing
- confident but not hype-heavy

Avoid:
- vague marketing fluff
- unsupported "best tool ever" claims
- fake precision unless clearly labeled as estimates

### Content format patterns to reuse

- "Answer capsule" near top (quick definition + why it matters)
- short paragraphs with bold takeaways
- tables for ratios/benchmarks/comparisons
- checklists for implementation
- FAQ with `details/summary` UI

### Evidence / claims

If citing stats or studies:
- verify before publishing
- keep dates current
- avoid invented or stale references

If not verified:
- use generalized best-practice language instead of specific percentages/study claims

## Visual Design Rules (SEOShouts Match)

### Core visual language

- Light theme only (default)
- Blue-primary accents
- Gray/white surfaces
- Gradient headers/backgrounds
- Rounded cards and soft shadows

### Common Tailwind patterns to reuse

- Section spacing:
  - `py-16`
  - `container mx-auto px-4 sm:px-6`
  - `max-w-6xl mx-auto`
- Headings:
  - `text-3xl sm:text-4xl font-bold`
  - gradient text via `bg-clip-text text-transparent`
- Cards:
  - `bg-white rounded-2xl shadow-lg border border-gray-100 p-6`
- CTA buttons:
  - gradient fill for primary actions
  - white button on final dark/blue CTA band

### Alternating section backgrounds

Use alternating:
- `bg-white`
- `bg-gray-50`

This is a key part of the internal-link-checker page rhythm.

## UX and Interaction Rules

### Required

- clear empty state
- clear loading state
- clear error state
- reset action
- mobile-friendly layout
- accessible controls and labels

### If API-backed

Include as needed:
- reCAPTCHA UI
- usage limits/daily limits
- timeout messaging
- progressive/multi-step flow (if discovery -> input -> retry)

### If complex outputs

Split into components:
- visualization
- table
- export
- detail modal

Do not put all results logic in one giant component unless the tool is small.

## Schema + Visible Content Consistency Rules

Keep these aligned:
- FAQ questions/answers in JSON-LD vs visible FAQ
- HowTo steps in JSON-LD vs visible "How to use" section
- `SoftwareApplication.featureList` vs actual features in UI
- canonical URL vs actual route slug

## Internal Linking Pattern (Within Tool Page Content)

Replicate the SEOShouts cross-link behavior:
- Link to relevant related tools (2-8 links depending on page length)
- Link to relevant blog posts/services only when contextually useful
- Use descriptive anchor text (not generic "click here")

Include a related tools grid near the bottom:
- 6 cards is a good default
- link to `/tools/` with a "Browse all tools" CTA

## Final CTA Pattern

Use a strong final banner section:
- blue gradient background
- white text
- one primary CTA button (scroll to top, rerun tool, or start analysis)
- 3 short trust/benefit bullets underneath

This section should feel like the closing conversion block.

## Accessibility / Semantic Rules

- one `h1` only
- maintain heading hierarchy (`h2` section titles, `h3` cards/subsections)
- label all inputs
- keyboard-accessible tabs/buttons/modals
- use `details/summary` for FAQs when possible
- ensure color contrast on gradient/text badges

## Performance / Maintainability Rules

- Keep `page.tsx` server-side and lightweight
- Put interaction logic in client components
- Extract reusable result components for large tools
- Avoid duplicating long section blocks across tools without a spec source
- Prefer typed interfaces for result shapes

## Flexible Variations (Allowed)

New tools may differ from `internal-link-checker`. That is expected.

Allowed differences while preserving the style:
- fewer or more content sections
- no tabs (if output is simple)
- no export options
- no comparison table
- no author block (if explicitly omitted)
- different schemas (e.g., no `HowTo`)

What should remain consistent:
- overall page visual style
- top-of-page tool-first layout
- long-form educational content below tool (for SEO pages)
- metadata/schema quality
- FAQ + related tools + final CTA pattern (unless explicitly removed)

## Build Checklist For New Tools (Use Every Time)

- Route slug finalized (`/tools/<slug>/`)
- `page.tsx` metadata complete
- Canonical/OG/Twitter URLs/images updated
- JSON-LD schemas added and valid
- Top tool UI section built
- Results states handled (empty/loading/error/success)
- `ToolBreadcrumb` added
- Long-form content sections added (topic-specific)
- FAQ UI + FAQ schema aligned
- Related tools grid added
- Final CTA added
- Mobile layout checked
- Internal links and tool links checked

## Notes for Future Requests

When the user gives a new tool brief:
- keep this template as the default structure
- adapt only the tool logic, output UI, and content topic
- ask only if the user wants major deviations (e.g., short page, no long-form content, no FAQ, no schema)

