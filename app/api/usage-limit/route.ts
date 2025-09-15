import { NextRequest, NextResponse } from 'next/server'

// Enhanced in-memory storage with better persistence across restarts
interface UsageData {
  [fingerprint: string]: {
    count: number
    lastReset: string // ISO string for JSON serialization
    dailyDate: string // Date string in YYYY-MM-DD format for daily reset
    ip: string // Store IP for reference
    userAgent: string // Store user agent for additional validation
  }
}

// Global in-memory storage that persists better than simple Map
const globalUsageTracker = (() => {
  if (typeof globalThis !== 'undefined') {
    if (!globalThis.usageTracker) {
      globalThis.usageTracker = new Map<string, UsageData[string]>()
    }
    return globalThis.usageTracker
  }
  return new Map<string, UsageData[string]>()
})()

const DAILY_LIMIT = 5
const RESET_INTERVAL_HOURS = 24

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0] // Returns YYYY-MM-DD
}

function createClientFingerprint(request: NextRequest): { fingerprint: string; ip: string; userAgent: string } {
  // Try multiple headers to get the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfIP = request.headers.get('cf-connecting-ip')

  let ip = 'unknown'
  if (forwarded) {
    ip = forwarded.split(',')[0].trim()
  } else if (realIP) {
    ip = realIP
  } else if (cfIP) {
    ip = cfIP
  }

  // Get additional fingerprinting data
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  const acceptEncoding = request.headers.get('accept-encoding') || 'unknown'

  // Create a more robust fingerprint combining multiple factors
  const fingerprintData = `${ip}-${userAgent}-${acceptLanguage}-${acceptEncoding}`
  const fingerprint = Buffer.from(fingerprintData).toString('base64').slice(0, 32)

  return {
    fingerprint,
    ip,
    userAgent
  }
}

function shouldResetCounter(lastReset: string, dailyDate: string): boolean {
  const today = getTodayDateString()
  // Reset if it's a new day (more reliable than hour-based reset)
  return dailyDate !== today
}

function cleanupOldEntries(): void {
  const today = getTodayDateString()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]

  // Remove entries older than yesterday from the global tracker
  for (const [fingerprint, userData] of globalUsageTracker.entries()) {
    if (userData.dailyDate !== today && userData.dailyDate !== yesterdayString) {
      globalUsageTracker.delete(fingerprint)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { fingerprint } = createClientFingerprint(request)
    const today = getTodayDateString()

    // Clean up old entries periodically (10% chance)
    if (Math.random() < 0.1) {
      cleanupOldEntries()
    }

    const userData = globalUsageTracker.get(fingerprint)

    if (!userData) {
      // New user - return full limit available
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      return NextResponse.json({
        remaining: DAILY_LIMIT,
        totalLimit: DAILY_LIMIT,
        resetTime: tomorrow.toISOString(),
        canUse: true
      })
    }

    // Check if we should reset the counter (new day)
    if (shouldResetCounter(userData.lastReset, userData.dailyDate)) {
      userData.count = 0
      userData.lastReset = new Date().toISOString()
      userData.dailyDate = today
    }

    const remaining = Math.max(0, DAILY_LIMIT - userData.count)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    return NextResponse.json({
      remaining,
      totalLimit: DAILY_LIMIT,
      resetTime: tomorrow.toISOString(),
      canUse: remaining > 0
    })
  } catch (error) {
    console.error('Usage limit check error:', error)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    return NextResponse.json({
      remaining: DAILY_LIMIT,
      totalLimit: DAILY_LIMIT,
      resetTime: tomorrow.toISOString(),
      canUse: true
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fingerprint, ip, userAgent } = createClientFingerprint(request)
    const today = getTodayDateString()

    // Clean up old entries periodically (10% chance)
    if (Math.random() < 0.1) {
      cleanupOldEntries()
    }

    let userData = globalUsageTracker.get(fingerprint)

    if (!userData) {
      userData = {
        count: 0,
        lastReset: new Date().toISOString(),
        dailyDate: today,
        ip,
        userAgent
      }
      globalUsageTracker.set(fingerprint, userData)
    }

    // Check if we should reset the counter (new day)
    if (shouldResetCounter(userData.lastReset, userData.dailyDate)) {
      userData.count = 0
      userData.lastReset = new Date().toISOString()
      userData.dailyDate = today
    }

    // Check if limit is exceeded
    if (userData.count >= DAILY_LIMIT) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      return NextResponse.json({
        success: false,
        error: 'Daily limit exceeded',
        remaining: 0,
        totalLimit: DAILY_LIMIT,
        resetTime: tomorrow.toISOString(),
        canUse: false
      }, { status: 429 })
    }

    // Increment usage
    userData.count += 1

    const remaining = Math.max(0, DAILY_LIMIT - userData.count)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    return NextResponse.json({
      success: true,
      remaining,
      totalLimit: DAILY_LIMIT,
      resetTime: tomorrow.toISOString(),
      canUse: remaining > 0
    })
  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track usage'
    }, { status: 500 })
  }
}