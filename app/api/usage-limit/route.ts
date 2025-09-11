import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
// In production, you'd use Redis, database, or other persistent storage
const usageTracker: Map<string, { count: number; lastReset: Date }> = new Map()

const DAILY_LIMIT = 5
const RESET_INTERVAL_HOURS = 24

function getClientIP(request: NextRequest): string {
  // Try multiple headers to get the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfIP) {
    return cfIP
  }
  
  // Fallback to a combination of headers for better uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  
  return `fallback-${Buffer.from(userAgent + acceptLanguage).toString('base64').slice(0, 16)}`
}

function shouldResetCounter(lastReset: Date): boolean {
  const now = new Date()
  const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)
  return hoursSinceReset >= RESET_INTERVAL_HOURS
}

function cleanupOldEntries() {
  const now = new Date()
  for (const [key, value] of usageTracker.entries()) {
    const hoursSinceReset = (now.getTime() - value.lastReset.getTime()) / (1000 * 60 * 60)
    if (hoursSinceReset >= RESET_INTERVAL_HOURS * 2) {
      usageTracker.delete(key)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Clean up old entries periodically
    if (Math.random() < 0.1) { // 10% chance to cleanup
      cleanupOldEntries()
    }
    
    const userData = usageTracker.get(clientIP)
    
    if (!userData) {
      return NextResponse.json({
        remaining: DAILY_LIMIT,
        totalLimit: DAILY_LIMIT,
        resetTime: new Date(Date.now() + RESET_INTERVAL_HOURS * 60 * 60 * 1000).toISOString(),
        canUse: true
      })
    }
    
    // Check if we should reset the counter
    if (shouldResetCounter(userData.lastReset)) {
      userData.count = 0
      userData.lastReset = new Date()
    }
    
    const remaining = Math.max(0, DAILY_LIMIT - userData.count)
    const resetTime = new Date(userData.lastReset.getTime() + RESET_INTERVAL_HOURS * 60 * 60 * 1000)
    
    return NextResponse.json({
      remaining,
      totalLimit: DAILY_LIMIT,
      resetTime: resetTime.toISOString(),
      canUse: remaining > 0
    })
  } catch (error) {
    console.error('Usage limit check error:', error)
    return NextResponse.json({
      remaining: DAILY_LIMIT,
      totalLimit: DAILY_LIMIT,
      resetTime: new Date(Date.now() + RESET_INTERVAL_HOURS * 60 * 60 * 1000).toISOString(),
      canUse: true
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Clean up old entries periodically
    if (Math.random() < 0.1) { // 10% chance to cleanup
      cleanupOldEntries()
    }
    
    let userData = usageTracker.get(clientIP)
    
    if (!userData) {
      userData = {
        count: 0,
        lastReset: new Date()
      }
      usageTracker.set(clientIP, userData)
    }
    
    // Check if we should reset the counter
    if (shouldResetCounter(userData.lastReset)) {
      userData.count = 0
      userData.lastReset = new Date()
    }
    
    // Check if limit is exceeded
    if (userData.count >= DAILY_LIMIT) {
      const resetTime = new Date(userData.lastReset.getTime() + RESET_INTERVAL_HOURS * 60 * 60 * 1000)
      return NextResponse.json({
        success: false,
        error: 'Daily limit exceeded',
        remaining: 0,
        totalLimit: DAILY_LIMIT,
        resetTime: resetTime.toISOString(),
        canUse: false
      }, { status: 429 })
    }
    
    // Increment usage
    userData.count += 1
    
    const remaining = Math.max(0, DAILY_LIMIT - userData.count)
    const resetTime = new Date(userData.lastReset.getTime() + RESET_INTERVAL_HOURS * 60 * 60 * 1000)
    
    return NextResponse.json({
      success: true,
      remaining,
      totalLimit: DAILY_LIMIT,
      resetTime: resetTime.toISOString(),
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