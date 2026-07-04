# Tool Page SEO Standard (applies to ALL /tools/ pages)

The single SEO template every tool page must follow. Layout/design rules live in `tool-template.md` and `tool-redesign-contract.md`; this file governs the SEO layer. Built from SERP research (July 2026): pages that outrank us are tool-first and lean — rankings for tool queries are driven by query-title alignment, engagement, internal link equity, and clean schema, NOT word count. Do not add content bulk to fix rankings.

## 1. Metadata

- **Title (50–62 chars):** `Free [Primary Keyword] — [Concrete Differentiator] | SEOShouts`
  - Primary keyword = the highest-impression query form from GSC (e.g. "checker" vs "analyzer" — use what searchers type; include both if natural).
  - Differentiator is a number or capability ("150+ Ranking Factors", "39 Types", "Crawls 500 Pages") — never a stack of "No Login - No Signup" fragments.
- **Description (150–165 chars):** what it audits/generates + the differentiator + "No signup." One mention of "free."
- Canonical with trailing slash. OG + Twitter mirror the title. `robots: index, follow`. `siteName: 'SEOShouts'` (one word, always).

## 2. On-page structure (order is fixed)

1. **H1** — must contain the same primary keyword as the title (title says "Checker" → H1 says "Checker").
2. **Answer capsule** — 40–60 word quotable definition of the tool ("A [tool] does X across Y, returning Z"). This is what AI engines cite.
3. **Tool input above the fold.** Nothing may push the input below the first viewport.
4. Trust strip (author, checks count, free/no-login).
5. Content sections: What is → How to use (3–4 steps) → What it checks/features → benchmarks or unique data → comparison vs competitors → FAQ (6–10) → related tools → final CTA. Keep total body content in the 1,500–2,500 word range; cut before adding.
6. One H1 only; H2s phrased as questions where a real query exists.

## 3. Schema stack (exactly one of each, no duplicates)

| Type | Required | Rules |
|------|----------|-------|
| SoftwareApplication | yes | Full block: `applicationCategory: "BrowserApplication"`, `applicationSubCategory: "SEO Tool"`, author = Person (Rohit Sharma) + worksFor, publisher, `featureList`, `softwareVersion`, `datePublished`, `dateModified` |
| FAQPage | yes if FAQ section exists | Must mirror the visible FAQs — never schema-only questions |
| BreadcrumbList | yes | Injected in `page.tsx` only. `ToolBreadcrumb` component renders UI only (no JSON-LD) — do not assume it adds schema |
| HowTo | optional | ONE block max, mirroring the visible how-to section |
| Speakable | optional | h1 + `.tool-hero-sub` |

Never invent `aggregateRating`/review schema — that's a manual-action risk.

## 4. Internal linking (the actual ranking lever)

- **Inbound:** every tool needs ≥4 contextual links from blog articles. Anchor mix per site rules: ~40% partial match, ~60% descriptive; no exact-match-only anchors, no generic CTAs. Check with: `SELECT COUNT(*) FROM articles WHERE content LIKE '%/tools/<slug>%'`.
- **Outbound:** tool body links to ≥1 related blog article, ≥1 service page (where relevant), 2–6 complementary tools, plus the related-tools grid and `/tools/` hub.
- When publishing any new article, add a link to the most relevant tool while writing it — not retroactively.

## 5. Freshness

- Bump `dateModified` in SoftwareApplication whenever the tool or content changes (quarterly minimum).
- Year-stamped H2s ("...in 2026") must be updated each January or de-dated.

## 6. Pre-publish checklist

- [ ] Title/H1 share the primary keyword; ≤62 chars
- [ ] Tool input above the fold
- [ ] Answer capsule present
- [ ] One of each schema type; FAQPage matches visible FAQs; validate with Rich Results Test
- [ ] ≥4 inbound article links exist in blog.db
- [ ] `dateModified` current
- [ ] Registered in `app/tools/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`
