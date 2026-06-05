# Tool Page Redesign Contract

The single checklist every tool-page conversion must pass. The canonical reference
is `/tools/internal-link-checker/` — read both files before converting:

- `app/tools/internal-link-checker/InternalLinkCheckerClient.tsx` (the shell + section order)
- `app/tools/internal-link-checker/page.tsx` (metadata + JSON-LD only)
- Design-system CSS lives in `app/globals.css` (`.tool-*`, `.section`, `.s-*`, grids, `.final-cta`)

This doc exists because conversions kept "having issues." Every rule below maps to a
specific failure that actually happened. If a conversion looks broken, it is almost
always violating one of these.

---

## 0. THE GOVERNING RULE — design only, never functionality

You are **re-shelling**, not rebuilding. This is the strictest rule of the whole job:

> **Touch nothing that runs. Change only how it looks.**

Keep, byte-for-byte, ALL: `useState`/`useRef`/`useEffect`, event handlers, `fetch`
calls + endpoints, request/response shapes, reCAPTCHA, rate-limit logic, error handling,
`page.tsx` metadata + JSON-LD schemas, canonical URLs, and **all visible copy**. The ONLY
things you may change are **class names and wrapper HTML structure**. If an edit changes
what a function does, what an API receives, or what words the user reads — it is out of
scope. `page.tsx` stays a server component (no `'use client'`), exports `metadata`,
renders the JSON-LD `<script>` tags, then mounts `<ToolNameClient />`.

---

## 1. No Tailwind. At all. (Failure: "almost right but off")

The system is hand-rolled CSS classes + CSS variables. The OLD tool pages were 100%
Tailwind. **Every leftover Tailwind class is a bug.**

- [ ] No `className` contains `bg-`, `rounded`, `shadow`, `from-`, `via-`, `to-`, `text-`, `px-`, `py-`, `grid-cols-`, `flex`, `gap-`, etc.
- [ ] The old page wrapper (`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50`) is **deleted**. The client returns a bare fragment `<>…</>` — no wrapper div, no background. Section backgrounds come from the section classes.
- [ ] No `rounded` / `shadow` / `gradient` anywhere on structural containers. The flat aesthetic forbids them. (The only shadow in the system is the built-in one on `.tool-box`.)

## 1b. LOCKED visual specs — icon + breadcrumb (match the reference exactly)

These two are not open to interpretation. Every tool page uses them verbatim.

### Icons — blue square, white stroke SVG, no radius (ONLY this style)

All section/card icons are a solid blue square containing a white stroke-SVG. **No other
icon style is allowed** — no outlined squares, no rounded icons, no colored/gradient
chips, no raw inline SVG without the square, no icon fonts.

```tsx
<div className="feature-icon">
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
       stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {/* path(s) — split multi-path strings on ' M' as the reference does */}
  </svg>
</div>
```

- Square classes by context: `.feature-icon` (44px), `.why-card-icon` (28px), `.related-card-icon` (40px, blue-tinted on dark). All are square, flat, `background: var(--blue)`, white icon. Reuse these classes — do not invent new icon wrappers.
- SVG props are fixed: `viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8}` (1.8 stroke, round caps/joins). Get paths from lucide.dev.
- Keep whatever icon a slot already had if it still fits; only re-wrap it in the blue square. Do not change what the icon *represents*.

### Breadcrumb — inline `/`-separated nav + badge pill (ONLY this style)

The breadcrumb lives **inside the dark hero**, rendered inline. It is NOT the old
`ToolBreadcrumb` component and NOT a Tailwind breadcrumb. Markup is exactly:

```tsx
<nav className="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Home</a>
  <span className="breadcrumb-sep">/</span>
  <a href="/tools/">SEO Tools</a>
  <span className="breadcrumb-sep">/</span>
  <span style={{ color: 'rgba(255,255,255,0.5)' }}>This Tool Name</span>
</nav>
<div className="tool-hero-badge">🔗 CATEGORY LABEL — FREE FOREVER</div>
```

- Text `/` separators via `.breadcrumb-sep` (not chevrons, not `>`).
- Current page is a non-link `<span>` at 50% white.
- The badge pill below it (`.tool-hero-badge`) is the thin blue-bordered, uppercase, blue-light label — keep one, swap only the emoji + category words.
- `page.tsx` keeps its `BreadcrumbList` JSON-LD; the visual breadcrumb does not add its own schema (avoid duplicate breadcrumb schema).

## 2. Section = TWO classes, always (Failure: no padding, or sections merge)

Every content section needs **both** `section` (provides `6rem 2rem` padding) **and** its
variant (provides background + border). Miss one and it breaks.

```
<section className="section prose-section">      ✅
<section className="section features-section">   ✅
<section className="prose-section">               ❌ no padding
<section className="section">                      ❌ no background → merges with neighbor
```

Variants and their backgrounds:

| Class | Background |
|---|---|
| `prose-section` | white |
| `prose-section alt` | gray-1 |
| `features-section` | gray-1 |
| `howto-section` | white |
| `why-section` | gray-1 |
| `ratio-section` | white |
| `mistakes-section` | gray-1 |
| `comparison-section` | white |
| `checklist-section` | gray-1 |
| `faq-section` | white |
| `related-section` | ink (dark) |

`founder-section` uses `ink-2` and takes inline `style={{ padding: '3rem 2rem' }}`.
`tool-hero` and `final-cta` are dark and are **not** `.section` (own padding).

## 3. Backgrounds must alternate (Failure: white-on-white / gray-on-gray)

Never place two consecutive sections with the same background. The reference order is
tuned for this — keep it. If you drop or reorder sections, re-check the alternation, or
adjacent sections collapse into one block separated only by a hairline.

Reference order (ink → gray → … ):
`tool-hero (ink)` → `tool-input (gray)` → `[loading/results (gray)]` →
`founder (ink-2)` → `prose (white)` → `features (gray)` → `howto (white)` →
`why (gray)` → `ratio (white)` → `mistakes (gray)` → `prose (white)` →
`prose alt (gray)` → `comparison (white)` → `checklist (gray)` → `faq (white)` →
`related (ink)` → `final-cta (ink)`.
(related→final-cta are both dark on purpose — both carry the blue grid.)

## 4. The blue accent: `<span className="blue">` (Failure: heading won't turn blue)

- Section headings (`.s-title`): the accent word needs `<span className="blue">word</span>`. A bare `<span>` will NOT turn blue.
- Hero `.tool-hero-h1` and `.final-cta-title`: a bare `<span>` IS styled blue (these have their own `span` rule). Either works, but prefer `className="blue"` everywhere for consistency.

## 5. Grids are now count-agnostic — but respect the conventions

The features/steps/stats grids were hardened (gap-as-divider + flex) so any card count
renders clean borders. You no longer have to supply an exact count. Still:

- [ ] **Stats strip**: 3–6 cells. Use `cls: 'blue'` / `'green'` / `''` per cell. Flex shares the row evenly.
- [ ] **Features**: any count; 3-col grid wraps cleanly. Only add `.feature-unique` ("Unique to SEOShouts") badge for genuinely exclusive features.
- [ ] **Steps**: 3–5 steps. Connector arrow auto-hides on the last card via `{i < arr.length - 1 && …}` — **copy this exact guard; never hardcode `i < 3`.**
- [ ] **Related tools**: keep **exactly 5** cards (current tool + 4). `.related-tools-grid` is `repeat(5,1fr)`; other counts leave empty cells. Mark the current tool with `current: true`.

## 6. Inline vs extracted (Failure: state errors, no scroll-to-results)

- **Inline in the parent return** (need parent state): Tool Input, Loading State, Results Panel. They use `url`, `isAnalyzing`, `results`, `error`, `recaptchaRef`, `resultsPanelRef`. Do NOT extract these into child components.
- **Extracted named functions** (no state): Hero, Founder, Prose, Features, How-To, Why, specialized data sections, FAQ, Related, Final CTA.
- Keep `ref={resultsPanelRef}` on the results `.results-panel` and the `scrollIntoView` call, or results won't scroll into view after analysis.

## 7. Emoji policy — TOOLS DIFFER FROM SERVICE PAGES (Failure: stripping/adding the wrong icons)

⚠️ The service-page rule "no emojis, ever" does **NOT** apply to tool pages. The tool
reference deliberately uses BOTH:

- **SVG (stroke, 24×24 viewBox, `stroke="white"` in blue squares)**: `.feature-icon`, `.step-connector`, `.tool-feat-check`, `.related-card-icon`.
- **Emoji (kept as-is)**: hero badge (`🔗`), analyze button (`🔍`), `💡 Tip:` in steps, `⚠️` alert-box title, `.why-card-icon` (`📡 🏗️ 🛡️ ⚡`), `.checklist-head` (`📊 🎯 🔧 🏗️`), `✅`/`✗` in comparison cells, and the `⚡` final-pill (via CSS `::before` — do not add it in markup).

Match the reference per-slot. Do not globally strip emojis from tool pages.

## 8. CSS variables (verified defined in `:root`)

Use only these. `--blue-mid`, `--gray-2`, `--gray-3` exist even though earlier notes
omitted them.

```
--blue #2563eb   --blue-dark #1d4ed8   --blue-light #3b82f6   --blue-pale #eff6ff   --blue-mid #dbeafe
--ink #08090a    --ink-2 #111318       --ink-3 #1c2030
--gray-1 #f3f4f7 --gray-2 #e4e6ec       --gray-3 #c8ccd8       --gray-4 #8891aa      --gray-5 #545d78
--white #ffffff  --line #e2e5ee
--green #16a34a  --green-bg #dcfce7     --red #dc2626 --red-bg #fee2e2   --amber #d97706 --amber-bg #fef3c7
```

A typo'd or undefined var renders transparent/black silently — double-check names.

## 9. Fonts

Headings/numbers/buttons/labels: `'Space Grotesk', sans-serif`. Body: `'Inter', sans-serif`.
Code: `'JetBrains Mono', monospace`. Nothing else.

## 10. page.tsx schema stack (keep/adapt, don't drop)

`SoftwareApplication` + `FAQPage` (mirror the rendered FAQ exactly) + `HowTo` (if steps
exist) + `BreadcrumbList`. Update name/description/url/featureList/dates per tool. Keep a
single breadcrumb schema source.

---

## Final pre-ship pass

- [ ] Functionality untouched — no handler, fetch, endpoint, state, schema, or copy changed (only classes + wrapper HTML).
- [ ] Grep the converted file for Tailwind tokens — zero hits.
- [ ] Every icon is a blue square + white stroke-SVG (`.feature-icon`/`.why-card-icon`/`.related-card-icon`) — no other icon style.
- [ ] Breadcrumb is the inline `.breadcrumb` nav with `/` separators inside the hero (not `ToolBreadcrumb`, not Tailwind) + `.tool-hero-badge` pill.
- [ ] Every `<section>` has `section` + a variant class.
- [ ] Backgrounds alternate top to bottom.
- [ ] Stats/features/steps counts set; related = 5; connector guard uses `arr.length`.
- [ ] Input/Loading/Results inline; everything else extracted.
- [ ] Emojis match the reference per slot (not stripped).
- [ ] FAQ markup matches FAQPage schema.
- [ ] All CSS vars resolve.
