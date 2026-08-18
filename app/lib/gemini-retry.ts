// Gemini's free tier intermittently returns transient 503 "high demand" (and
// occasional 429/500) errors. Retrying with a short backoff clears them — the
// heaviest requests (e.g. AI Copywriter) hit this every time otherwise.
// ponytail: fixed 4-attempt backoff (~0.8s/1.6s/2.4s); widen only if 503s persist.
export async function retryOn503<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn()
    } catch (e: any) {
      const s = e?.status ?? e?.error?.code ?? e?.code
      if ((s === 503 || s === 429 || s === 500) && i < tries - 1) {
        await new Promise(r => setTimeout(r, 800 * (i + 1)))
        continue
      }
      throw e
    }
  }
  throw new Error('unreachable')
}
