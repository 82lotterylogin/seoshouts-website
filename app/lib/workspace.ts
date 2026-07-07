// Cross-tool workspace: per-URL score history in localStorage.
// Lets every scoring tool show "last run: 68 → now 74" with zero backend.
// ponytail: localStorage only — per-browser, capped at 20 runs per tool+URL

export interface ScoreRun {
  score: number
  date: string // ISO
}

const KEY = 'seoshouts-workspace'

interface Workspace {
  // history["<tool>|<normalized url>"] = runs, oldest first
  history: Record<string, ScoreRun[]>
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url.includes('://') ? url : `https://${url}`)
    return `${u.hostname}${u.pathname}`.replace(/\/$/, '').toLowerCase()
  } catch {
    return url.trim().toLowerCase()
  }
}

function load(): Workspace {
  if (typeof window === 'undefined') return { history: {} }
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed.history === 'object' ? parsed : { history: {} }
  } catch {
    return { history: {} }
  }
}

function save(ws: Workspace) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ws))
  } catch {
    // storage full or blocked — history is a nicety, never break the tool
  }
}

/** Record a run and return the previous run (if any) for a "vs last time" delta. */
export function recordScore(tool: string, url: string, score: number): ScoreRun | null {
  const ws = load()
  const key = `${tool}|${normalizeUrl(url)}`
  const runs = ws.history[key] || []
  const previous = runs.length > 0 ? runs[runs.length - 1] : null
  runs.push({ score, date: new Date().toISOString() })
  ws.history[key] = runs.slice(-20)
  save(ws)
  return previous
}

export function getHistory(tool: string, url: string): ScoreRun[] {
  return load().history[`${tool}|${normalizeUrl(url)}`] || []
}
