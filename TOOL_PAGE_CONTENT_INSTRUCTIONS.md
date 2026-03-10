# SEOShouts Tool Page — Content Writing Instructions
**Source of truth:** `D:\Projects\seoshouts\app\tools\internal-link-checker\InternalLinkCheckerClient.tsx`  
**Companion file (design/architecture/schema):** `INTERNAL_LINK_CHECKER_TOOL_STYLE_INSTRUCTIONS.md`  
**Purpose:** How to write the content for every new tool page. This file covers copy, not code.

> **Note:** The design system, component structure, Tailwind classes, and schema requirements are already documented in `INTERNAL_LINK_CHECKER_TOOL_STYLE_INSTRUCTIONS.md`. This file only covers what to write — the words, structure, and SEO rules.

---

## Page Metadata (`page.tsx`)

Every tool page needs these 5 metadata fields written before building content:

### Title Tag
```
Free [Tool Name] — [Primary Outcome] | SEOShouts
```
- Must start with "Free"
- State the main outcome (what the user gets), not the feature (what the tool does)
- Include "SEOShouts" at end after pipe
- Max 60 characters
- ILC example: `Free Internal Link Checker — Analyze Anchor Text & Site Structure | SEOShouts`

### Meta Description
```
Free [tool type] that [does X], [does Y], and [does Z]. No login required.
```
- Start with "Free"
- List 2-3 concrete capabilities in one sentence
- End with "No login required." if true
- 150-160 characters
- ILC example: `Free internal link checker that crawls up to 500 pages, analyzes anchor text distribution with a visual word cloud, and identifies over-optimization. No login required.`

### Keywords
Comma-separated. Include: tool name, tool category, action variants, "free SEO tool", brand term.  
ILC example: `internal link checker, anchor text analyzer, internal link analysis, internal linking tool, SEO analysis, anchor text distribution, internal link audit, link checker, anchor cloud, free SEO tool, anchor text cloud`

### OG/Twitter Description (different from meta)
More punchy. Lead with the unique feature.  
ILC example: `Crawl up to 500 pages, visualize anchor text with word clouds, detect keyword stuffing & generic links. The only free internal link checker with visual anchor analysis.`

### `featureList` in SoftwareApplication schema
List real features only, 6-8 items. Match what the tool actually does.  
ILC example:
```
"Visual Anchor Text Word Cloud"
"Keyword Stuffing Detection"
"Generic Link Identification"
"Deep Crawl Up to 500 URLs"
"Anchor Text Distribution Analysis"
"Destination URL Mapping"
"No Login Required"
"Real-time Browser-based Analysis"
```

---

## Content Sections (in order)

The page body is one big client component. Content sections appear in this exact order every time.

---

### SECTION 1 — H1

**Location in source:** First thing inside the page wrapper, before the tool form.

**Format:**
```
Free [Tool Name]: [Action Verb] [Metric 1], [Metric 2] & [Metric 3]
```

**Rules:**
- Must start with "Free"
- Use colon after tool name
- List 2-3 concrete things the tool audits/generates/checks
- No punctuation at end
- Rendered as gradient text (gray-900 to gray-700) — the copy must be confident to match

**ILC example:** `Free Internal Link Checker: Audit Anchor Text, Link Distribution & Site Architecture`

---

### SECTION 2 — Answer Capsule

**Location in source:** `<p>` tag inside a blue gradient box (`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6`) directly below the H1.

**Format:** 2-3 sentences. Sentence 1 is the pure definition. Sentence 2 is the unique differentiator.

**Rules:**
- Sentence 1: `[Tool name] [verb]s [what it does] — [what it identifies/outputs].`
- Must be 120-150 characters for sentence 1 (AI-extractable snippet)
- Sentence 2: `SEOShouts' free tool [unique feature], a feature no other free tool offers.`
- **Bold** the unique feature in sentence 2 using `<strong>`
- Never start with "In today's..." or "Are you..."

**ILC example:**
> "An internal link checker crawls your website to analyze anchor text patterns, link distribution, and site structure — identifying over-optimization, wasted generic anchors, and keyword stuffing across your internal linking profile. SEOShouts' free tool scans up to 500 URLs and generates a **visual word cloud** showing which anchor phrases dominate your link structure, a feature no other free tool offers."

**Template:**
> "[Tool name] [verb]s your [input type] to [primary action] — [what it identifies/outputs/produces]. SEOShouts' free tool [specific limit or scale] and [unique differentiator], a feature no other free tool offers."

---

### SECTION 3 — Tool Input Widget Copy

**Location in source:** Inside the white form card.

**3a. Widget H2:**
Action-oriented subheading inside the form. 6-10 words.  
Pattern: `[Verb] Your [Noun]'s [Focus Area]`  
ILC: `Analyze Your Website's Internal Link Structure`

**3b. Widget subtext:**
1 sentence below the H2. Tells user what to do.  
ILC: `Enter your website URL below to start crawling and analyzing internal anchor text patterns.`

**3c. Input label:**
1-3 words above the input field.  
ILC: `Website URL`

**3d. CTA button text:**
Emoji + verb + object.  
ILC: `🔍 Analyze Internal Links`  
When loading: `Analyzing Website...`  
When limit reached: `Daily Limit Reached`

**3e. Key Features (4 items inside form card):**
Appears at the bottom of the form card below the button, under `Key Features:` heading.  
Each: bold feature name + 1 sentence description focused on user outcome.

Format:
```
[Feature Name]
[What the user immediately gains — written as outcome, not mechanic]
```

ILC examples:
```
Visual Anchor Cloud
Instantly see which words dominate your internal linking profile

Keyword Stuffing Detection
Identify if you are aggressively over-using specific keywords

Generic Link Finder
Spot wasted opportunities like "read more" or "this post"

Deep Crawl Analysis
Scan up to 500 URLs to get a complete picture of your site's semantic structure
```

**Rules for features:**
- Feature 1 is always the unique differentiator
- No verb "to" — start with action or description
- Keep under 15 words per description

---

### SECTION 4 — Author Block

**Location in source:** First `<section>` after the tool form. `bg-white`. Blue gradient card inside.

**This is fixed structure — write fresh content for each tool but keep the same format.**

**Format:**
```
Built by Rohit Sharma — 13+ Years in Technical SEO

"[First-person quote specific to this tool's origin story — why Rohit built it, 
what problem he kept seeing, and what makes this tool different from basic versions.]"

— Rohit Sharma, Founder of SEOShouts | Meet Our Experts
```

**Rules:**
- Quote must be 2-3 sentences max
- Must include: (a) a trigger from real client work ("after auditing X clients", "while analyzing 500+ websites"), (b) the pattern Rohit kept seeing, (c) what this tool does differently
- Never generic ("I wanted to help people with SEO")
- Link "Meet Our Experts" to `/meet-the-experts/`

**ILC example:**
> "I built this internal link checker after auditing 500+ websites and finding the same pattern: site owners obsess over broken links but completely ignore what their anchor text tells Google. This tool doesn't just find links — it visualizes the words you're using and shows whether they're helping or hurting your rankings."

---

### SECTION 5 — "What Is" Section

**Location in source:** `bg-white`, full-width text column (`max-w-6xl`).

**H2 format:** `What Is a [Tool Name] and Why Do You Need One?`

**Structure (5 paragraphs):**

**P1 — Mechanical definition:**  
Expand the answer capsule. What the tool does technically. What it outputs. 3-4 sentences.

**P2 — What basic tools miss:**  
Contrast this tool vs others. Open with: "Most [tool type] tools stop at [basic thing]. That misses the point entirely. The real value lies in **[deeper insight]**."

**P3 — Authority quote:**  
Real, verifiable quote from Google documentation, John Mueller, or a named SEO expert. Bold the key phrase.  
Format: `[Source] [verb]: **"[bolded key phrase]."**`  
ILC: `Google's John Mueller confirmed this in a Search Central session: **"Internal linking is super critical for SEO. It's one of the biggest things that you can do on a website..."**`

**P4 — Data points (optional):**  
Include supporting data if tool-specific research has been done. Bold the key numbers. Skip or use directional language ("most sites," "the majority") if verified data isn't available for this tool's niche.

**P5 — Tool summary:**  
Tie it together. How this tool addresses both problems mentioned above.  
ILC: `The SEOShouts Internal Link Checker addresses both problems: it finds underlinked pages AND shows you exactly what anchor text you're using through a visual word cloud that no other free tool provides.`

**Rules:**
- Max 4 sentences per paragraph
- Quote in P3 must be real and verifiable
- Do NOT fabricate statistics — use directional language if you don't have verified data

---

### SECTION 6 — Key Features Section

**Location in source:** `bg-gray-50`. 3-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

**H2:** `Key Features of Our [Tool Name]`

**6 feature cards.** Each card has: emoji icon, H3 title, 2-4 sentence description.

**Card color pattern (match exactly):**
1. Blue (`from-blue-50 to-blue-100/50 border-blue-200`) — bg-primary icon
2. Green (`from-green-50 to-green-100/50 border-green-200`) — bg-green-600 icon
3. Orange (`from-orange-50 to-orange-100/50 border-orange-200`) — bg-orange-600 icon
4. Purple (`from-purple-50 to-purple-100/50 border-purple-200`) — bg-purple-600 icon
5. Pink (`from-pink-50 to-pink-100/50 border-pink-200`) — bg-pink-600 icon
6. Indigo (`from-indigo-50 to-indigo-100/50 border-indigo-200`) — bg-indigo-600 icon

**Content rules per card:**
- Card 1 (Blue) = The Unique Feature. Must include: `**This feature is unique to SEOShouts — no other free tool offers it.**`
- Card 2 (Green) = Primary detection/analysis. Include a data point if research has been done for this tool.
- Card 3 (Orange) = Secondary detection. Examples of what it catches.
- Card 4 (Purple) = Depth/scale of analysis. Technical detail of what the crawler/analyzer reads.
- Card 5 (Pink) = Data organization/output format. What users see and can do with results.
- Card 6 (Indigo) = Zero barriers. "No login, no credit card, no account creation." Always free.

---

### SECTION 7 — How-To Section

**Location in source:** `bg-white`. 2-column grid (`grid-cols-1 md:grid-cols-2`).

**H2:** `How to [Primary Action] (Step-by-Step)`  
ILC: `How to Audit Your Internal Link Anchors (Step-by-Step)`

**Opening paragraph (centered, before grid):**  
1-2 sentences. Why this action matters. Include a data point here if tool-specific research supports it.

**4 step cards** (numbered 1-4, each in a white card with colored number badge):

**Step 1 — Enter Your [Input]** (blue badge)
- Explain what to enter and what the tool reads technically (HTML tags, API, etc.)
- Include a **Tip:** for best results

**Step 2 — Analyze [Primary Output / Visual]** (green badge)
- How to read the main output
- Include ✓ (what you want to see) and ✗ (what signals a problem) format
- Add a data point here if tool-specific research supports it

**Step 3 — Review [Secondary Output / Data]** (purple badge)
- How to use the data table or secondary view
- 3 bullet points with **bold labels** for each data point
- Reference the benchmark section: "Check your distribution against these benchmarks (covered in detail in the [section name] section below)."

**Step 4 — Fix and Optimize** (orange badge)
- 4 specific action bullets with **bold action labels**
- End with: "After making changes, re-run the analysis to confirm your improvements."

---

### SECTION 8 — "Why [Topic] Matters" Section

**Location in source:** `bg-gray-50`. Stack of full-width white cards.

**H2:** `Why [Core Topic] Is the Most [Superlative] [Factor]`  
ILC: `Why Anchor Text Is the Most Underrated Ranking Factor`

**Opening paragraph (centered):** 1-2 sentences framing the core claim.

**3-4 subsections (H3s), each inside its own white card (`bg-white rounded-2xl shadow-lg`):**

**Standard 3 H3 topics (adapt to tool):**
1. `It Directly Tells Google [What]` — the algorithmic reason
2. `It Builds [Outcome] Across Your Site` — topical authority angle
3. `It Protects You from [Risk]` — penalty/negative consequence of ignoring it

**Card 3 (risk/protection) must include the 2-column callout box:**
```
⚠️ The Risk:
[2-3 sentences of what goes wrong]

✓ The Solution:
[2-3 sentences of how our tool solves it]
```

**Card 4 (optional):** `It Distributes [Resource] to [Pages]` — authority/equity sharing angle.

**Rules per card:**
- 2-3 paragraphs of body text
- Data points welcome if tool-specific research has been done — not mandatory
- At least 1 industry quote across the whole section (Google docs, Mueller, or known experts)
- End with a tool tie-back: "Our [tool] helps you..."

---

### SECTION 9 — Benchmark / Ratio Table Section

**Location in source:** `bg-white`. Centered table with surrounding context paragraphs.

**H2:** `The Ideal [Metric] [Ratio/Distribution/Benchmarks]`

**Opening paragraph:** "There's no single 'perfect' formula, but analyzing top-ranking sites reveals a consistent healthy pattern."

**Table: 5 rows, 4 columns** `[Category] | [Example] | [Target %/Value] | [Risk Level]`

Row pattern:
- Row 1: Best/safest (green badge)
- Row 2: Good (blue badge)
- Row 3: Use sparingly (yellow badge)
- Row 4: Avoid (red badge)
- Row 5: Avoid (red badge)

**After table — blue gradient info box with 3 paragraphs:**
1. `**Critical rule:** [The one rule that prevents the most common mistake]`
2. A supporting point explaining why these benchmarks matter — data point optional, only if research done for this tool
3. `**Pro Tip:** [How to use the tool output to check this]`

---

### SECTION 10 — Common Mistakes Section

**Location in source:** `bg-gray-50`. Stack of white cards.

**H2:** `[X] Common [Mistakes/Problems] (And How to Fix Them)` — always exactly 5.

**Opening (centered):** "Run the SEOShouts [Tool Name] to find these specific problems in your site structure."

**Each card:**
```
H3: [Number]. The "[Name]" Problem
What it looks like: [symptom]
Why it hurts: [SEO damage]
How to fix it: [action]
[✗ Bad / ✓ Good example block]
```

**5 standard mistake types:**
1. The "Generic/Lazy" Problem
2. The "Over-Optimization" Problem
3. The "Mismatch" Problem
4. The "Wasted Opportunity" Problem
5. The "Orphan/Ignored" Problem

**Rules:**
- Bad/Good examples must be realistic
- Good examples include an internal link where possible
- Each mistake references how the tool detects it

---

### SECTION 11 — Numeric Data Section

**Location in source:** `bg-white`. Prose section.

**H2:** `How Many [Things] Should a [Page/Site] Have?`

**Structure:**
- P1: "This is one of the most debated questions in SEO — [and here's the answer]."
- P2: 4 bullet points with bold numbers — use research done specifically for this tool's topic
- P3: A second dimension (e.g., click depth, crawl frequency). Bold any key number.
- P4: Tool recommendation. End with: "Our tool handles [X]; pair it with a [related tool link] to evaluate [Y]."

> **Note:** Data points in this section come from per-tool research. Only include numbers you can verify for the specific tool's niche. If no research exists yet, write this section with directional guidance rather than specific numbers.

---

### SECTION 12 — AI/2026 Optimization Section (Mandatory)

**Location in source:** `bg-gray-50`. Stack of white cards.

**H2:** `How to Optimize [Tool Topic] for AI Search Engines (2026)`

**3 cards (H3s):**

**Card 1: How AI Models Interpret [Topic]**
- Contrast traditional search vs AI model behavior
- 1 verifiable quote or reference (seoClarity, Google, SparkToro, etc.)

**Card 2: [Old Approach] vs [AI-Optimized Approach]** (mandatory table)
```
| ❌ Old SEO [Approach] | ✅ AI-Optimized [Approach] |
```
4 rows minimum. Short/robotic vs long/natural language.  
Closing sentence: "write [things] as if explaining [destination] to a human."

**Card 3: Testing Your AI Visibility** (near-identical across all tools, adapt the middle sentence only)
> Weekly testing across ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, Copilot.  
> The sites getting cited share 3 characteristics: [tool-relevant char 1], [char 2], and expertise signals.  
> Our [tool] addresses the first — use it alongside [schema markup link] and [robots.txt link] for all three.

---

### SECTION 13 — Competitor Comparison Table

**Location in source:** `bg-white`. Table + 2-card grid below.

**H2:** `SEOShouts vs Other [Tool Type] Tools`

**Table columns:** SEOShouts | Screaming Frog | Ahrefs | SEOptimer | Sitechecker  
(adjust competitors per tool — always 4 competitors minimum)

**Standard rows:**
1. The unique feature (SEOShouts ✅ Unique badge, all ❌)
2. Free usage limit (specific numbers)
3. Core capability 1
4. No Login Required
5. Browser-Based
6. Detection feature 2
7. Detection feature 3
8. Data output format
9. Cost (SEOShouts: "Free forever" green badge)

**Below table — 2 cards:**
- **"When to Choose SEOShouts"** (green gradient): specific use case + bold the unique feature
- **"When You Might Need More"** (blue gradient): honest about enterprise limits + end with "zero cost"

---

### SECTION 14 — Audit Checklist Section

**Location in source:** `bg-gray-50`. 2-column grid.

**H2:** `Complete [Topic] Checklist (2026)`  
**Sub-line:** `Use this checklist after running your SEOShouts analysis. Bookmark it and revisit monthly.`

**4 cards (2x2 grid):**

| Card | Emoji | Category | Focus |
|------|-------|----------|-------|
| 1 | 📊 | Quantity & Distribution | Numbers, limits, thresholds |
| 2 | 🎯 | Quality | Ratios, what good looks like |
| 3 | 🔧 | Technical Health | Status codes, tags, attributes |
| 4 | 🏗️ | Architecture / Strategy | Clusters, hierarchy, depth |

4-6 bullets per card. Each bullet is specific, testable, includes numbers where applicable.

---

### SECTION 15 — FAQ Section

**Location in source:** `bg-white`. 2-column grid of `<details>/<summary>` elements.

**H2:** `Frequently Asked Questions`  
**Sub-text:** `Everything you need to know about [tool topic]`

**10 questions minimum.** 5 are mandatory on every tool page:

| # | Type | Answer rule |
|---|------|-------------|
| 1 | What is a [tool name]? | Expand the answer capsule. 2-3 sentences. |
| 2 | How many [things] should a [page] have? | Specific numbers from tool-specific research. If no data yet, give directional guidance. |
| 3 | What is the ideal [metric/ratio]? | Reference benchmark table with values. |
| 4 | Can [bad thing] hurt [SEO outcome]? | Yes + algorithm name + explanation. |
| 5 | Is the SEOShouts [tool] free? | "Yes, completely free. [X] with no registration, no credit card, and no usage limits." |

5 additional required questions:

| # | Type | Answer rule |
|---|------|-------------|
| 6 | What makes SEOShouts different? | Name the unique feature. Compare to named competitors. |
| 7 | How does [topic] affect AI search? | AI engines + data signals + what cited sites have in common. |
| 8 | How often should I [use/audit]? | Frequency + 3-4 specific things to check each time. |
| 9 | What are [key term] and why do they matter? | Define the term clearly + explain the SEO impact. Add a data point if research supports it. |
| 10 | Does this tool also [related capability]? | No (or partial) + internal link to the tool that does. |

**Rules:**
- Max 5 sentences per answer
- Q5 always: "Yes, completely free."
- Q10 always ends with an internal link
- FAQ schema in `page.tsx` must match visible FAQ content

---

### SECTION 16 — Related Tools Grid

**Location in source:** `bg-gray-50`. 3-column grid.

**H2:** `Explore Our Other Free SEO Tools`

**6 cards.** Card 1 = current tool marked `✓ Current Tool`.

**Default cards 2-6:**
- On-Page SEO Analyzer `🔬` → "Audit 150+ on-page SEO factors with real Google PageSpeed data and competitive benchmarks."
- Schema Generator `🏗️` → "Generate JSON-LD structured data for 39+ schema types instantly."
- Robots.txt Generator `🤖` → "Create robots.txt rules including directives for AI crawlers like GPTBot and ClaudeBot."
- Disavow File Generator `🚫` → "Generate Google-compliant disavow files from any backlink export format with dedupe and whitelist."
- Meta Tag Optimizer `📝` → "Generate perfect title tags and meta descriptions for better click-through rates."

Swap 1-2 cards if a different tool is more relevant to the topic.

**Below grid:**
```
🛠️ Browse All [X] Free SEO Tools → /tools/
All tools are 100% free · No signup required · Instant results
```

---

### SECTION 17 — Final CTA Section

**Location in source:** `bg-gradient-to-br from-primary to-blue-600 text-white`. Blue gradient band.

**H2:** `Start Your [Tool Action] Now`

**Structure:**
```
[1-2 sentence value statement — name the specific problem + time to solve]

[White button with primary text — same text as Section 3d]

⚡ [Speed/time claim]
🎯 [Scale/depth claim]
☁️ [Unique feature] — only at SEOShouts
```

**Rules:**
- Third bullet always ends with "— only at SEOShouts"
- CTA button uses `window.scrollTo({ top: 0, behavior: 'smooth' })`

**ILC example:**
> "Poor anchor text hides your best content from Google and AI search engines. Run your analysis in under 5 minutes, identify the problems, and fix them today."

---

## Internal Linking Rules

- **3-5 contextual links per 1,000 words** of body content
- **Max 45-50 total links per page** (count nav + footer too)
- **Anchor text ratio:** 50-60% partial match | 10-20% exact | 20-30% generic/branded
- **Never repeat the same anchor text** for the same target URL on the same page

**Mandatory links on every tool page:**
- `/tools/on-page-seo-analyzer/` — in Section 11 and FAQ Q10
- `/tools/schema-generator/` — in Section 12 Card 3
- `/tools/robots-txt-generator/` — in Section 12 Card 3
- `/meet-the-experts/` — in Section 4 Author Block

---

## Writing Style Rules

**Banned phrases (never write these):**
```
"In today's digital world..."     "Are you struggling with..."
"Whether you're a beginner..."    "In this comprehensive guide..."
"We hope this was helpful."       "Feel free to reach out."
"Powerful," "robust," "user-friendly" (describe the specific benefit instead)
```

**Statistics rules:**
- Statistics are optional, not mandatory — only include them if research has been done specifically for this tool's topic
- When a stat IS included, bold the number: `**25%**`, `**23 million**`, `**42%**`
- If a source is known and verified, attribute it inline naturally — but do not force citations onto every claim
- Do NOT fabricate data under any circumstances — if you don't have a verified number, write directional guidance instead ("most sites," "the majority," "common patterns show") rather than inventing a percentage
- Source citations are added only during per-tool research, not as a template requirement

**Quote rules:**
- Only real, verifiable quotes
- Attribute every quote: `[Name], [Source] ([Year if known]):`
- Bold the key phrase within the quote

---

## Pre-Submission Checklist

- [ ] All 17 sections present and in correct order
- [ ] H1 starts with "Free" + includes primary keyword
- [ ] Answer capsule sentence 1 is 120-150 characters
- [ ] Author block quote is tool-specific, not generic
- [ ] Section 6 Card 1 includes "unique to SEOShouts" label
- [ ] Section 8 Card 3 includes ⚠️ Risk + ✓ Solution split boxes
- [ ] Section 12 (AI) is present with the comparison table
- [ ] Section 13 has "When to Choose" + "When You Might Need More" cards
- [ ] FAQ has 10+ questions including all 5 mandatory ones
- [ ] FAQ Q5 starts "Yes, completely free."
- [ ] FAQ Q10 ends with an internal link
- [ ] Related tools grid: 6 cards, Card 1 = "✓ Current Tool"
- [ ] Bottom CTA 3rd bullet ends "— only at SEOShouts"
- [ ] No fabricated statistics — directional language used where hard data isn't available
- [ ] Any statistics included have verified sources (per-tool research)
- [ ] Internal links to On-Page Analyzer, Schema Generator, Robots.txt Generator included
- [ ] Metadata written: title, meta description, keywords, OG description, featureList
- [ ] FAQ content matches FAQ schema in `page.tsx`

---

*Last updated: March 2026 | Based on: `InternalLinkCheckerClient.tsx` + `INTERNAL_LINK_CHECKER_TOOL_STYLE_INSTRUCTIONS.md`*
