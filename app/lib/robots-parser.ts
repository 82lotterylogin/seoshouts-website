// Shared client-side robots.txt parser implementing Google's Robots Exclusion
// Protocol: most-specific user-agent group selection, longest-path-match
// precedence, Allow wins ties, * and $ wildcard support.
// Used by the Robots.txt Generator tester and the GEO/AEO checker.

export interface RobotsGroup {
  agents: string[]
  rules: { type: 'allow' | 'disallow'; path: string }[]
}

export function parseRobotsTxt(content: string): RobotsGroup[] {
  const groups: RobotsGroup[] = []
  let current: RobotsGroup | null = null
  let lastWasAgent = false
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim()
    if (!line) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const field = line.slice(0, idx).trim().toLowerCase()
    const value = line.slice(idx + 1).trim()
    if (field === 'user-agent') {
      if (!lastWasAgent || !current) {
        current = { agents: [], rules: [] }
        groups.push(current)
      }
      current.agents.push(value.toLowerCase())
      lastWasAgent = true
    } else if (field === 'allow' || field === 'disallow') {
      if (current) {
        current.rules.push({ type: field, path: value })
        lastWasAgent = false
      }
    } else {
      lastWasAgent = false
    }
  }
  return groups
}

function robotsPatternMatches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith('$')
  const pat = anchored ? pattern.slice(0, -1) : pattern
  const escaped = pat
    .split('*')
    .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*')
  try {
    return new RegExp('^' + escaped + (anchored ? '$' : '')).test(path)
  } catch {
    return false
  }
}

export function checkBotAccess(groups: RobotsGroup[], bot: string, path: string): { allowed: boolean; matchedRule: string } {
  const botLower = bot.toLowerCase()

  // Group selection: most specific matching user-agent token; '*' as fallback
  let bestAgent = ''
  let bestLen = -1
  for (const g of groups) {
    for (const a of g.agents) {
      if (a === '*') {
        if (bestLen < 0) { bestAgent = '*'; bestLen = 0 }
      } else if (botLower.includes(a) || a.includes(botLower)) {
        if (a.length > bestLen) { bestAgent = a; bestLen = a.length }
      }
    }
  }
  if (bestLen < 0) return { allowed: true, matchedRule: 'No matching group — allowed by default' }

  // Merge rules from every group carrying the winning agent token
  const rules = groups
    .filter(g => g.agents.includes(bestAgent))
    .flatMap(g => g.rules)

  // Longest match wins; allow wins ties
  let best: { type: 'allow' | 'disallow'; path: string } | null = null
  for (const r of rules) {
    if (r.path === '') continue // empty disallow = no restriction
    if (robotsPatternMatches(r.path, path)) {
      if (!best || r.path.length > best.path.length ||
          (r.path.length === best.path.length && r.type === 'allow' && best.type === 'disallow')) {
        best = r
      }
    }
  }
  if (!best) return { allowed: true, matchedRule: `Group "${bestAgent}" — no rule matches, allowed by default` }
  return {
    allowed: best.type === 'allow',
    matchedRule: `${best.type === 'allow' ? 'Allow' : 'Disallow'}: ${best.path} (group "${bestAgent}")`,
  }
}

// The AI crawlers that matter for GEO/AEO visibility
export const AI_CRAWLER_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'Applebot-Extended',
] as const

export const SEARCH_CRAWLER_BOTS = ['Googlebot', 'Bingbot', 'DuckDuckBot'] as const
