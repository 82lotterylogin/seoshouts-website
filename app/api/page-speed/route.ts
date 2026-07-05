import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY
const API_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

interface CoreWebVitals {
  LCP: number
  INP: number
  CLS: number
}

interface PageSpeedData {
  desktop: {
    score: number
    coreWebVitals: CoreWebVitals
    loadingExperience?: any
  }
  mobile: {
    score: number
    coreWebVitals: CoreWebVitals
    loadingExperience?: any
  }
}

async function fetchPageSpeedData(url: string, strategy: 'desktop' | 'mobile') {
  const apiUrl = `${API_ENDPOINT}?url=${encodeURIComponent(url)}&key=${GOOGLE_PAGESPEED_API_KEY}&strategy=${strategy}&category=performance`
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
    
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SEOShouts-PageSpeed-Analyzer/1.0'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Extract Core Web Vitals from the response
    const lighthouseResult = data.lighthouseResult
    const audits = lighthouseResult?.audits || {}
    const loadingExperience = data.loadingExperience
    
    const score = Math.round((lighthouseResult?.categories?.performance?.score || 0) * 100)
    
    // Extract Core Web Vitals metrics
    const coreWebVitals: CoreWebVitals = {
      LCP: audits['largest-contentful-paint']?.numericValue || 0,
      INP: audits['interaction-to-next-paint']?.numericValue || audits['max-potential-fid']?.numericValue || 0,
      CLS: audits['cumulative-layout-shift']?.numericValue || 0
    }
    
    return {
      score,
      coreWebVitals,
      loadingExperience
    }
  } catch (error) {
    console.error(`Error fetching ${strategy} data:`, error)
    // No mock data: fail honestly so the client hides the Core Web Vitals
    // section instead of rendering made-up scores.
    throw error
  }
}

function getCoreWebVitalStatus(metric: string, value: number) {
  const thresholds = {
    LCP: { good: 2.5, needsImprovement: 4.0 },
    INP: { good: 200, needsImprovement: 500 },
    CLS: { good: 0.1, needsImprovement: 0.25 }
  }
  
  const threshold = thresholds[metric as keyof typeof thresholds]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

export async function POST(request: NextRequest) {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 25 seconds')), 25000)
    })
    
    const mainPromise = async () => {
      const { url } = await request.json()
      
      if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
      }
      
      // Validate URL format
      try {
        new URL(url)
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
      
      if (!GOOGLE_PAGESPEED_API_KEY) {
        return NextResponse.json(
          { error: 'PageSpeed data unavailable: API key not configured' },
          { status: 503 }
        )
      }
      
      // Fetch both desktop and mobile data in parallel with timeout
      const [desktopData, mobileData] = await Promise.race([
        Promise.all([
          fetchPageSpeedData(url, 'desktop'),
          fetchPageSpeedData(url, 'mobile')
        ]),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('PageSpeed API timeout')), 20000)
        })
      ])
      
      // Add status indicators for Core Web Vitals
      const enhanceWithStatus = (data: any) => ({
        ...data,
        coreWebVitals: {
          LCP: {
            value: data.coreWebVitals.LCP,
            status: getCoreWebVitalStatus('LCP', data.coreWebVitals.LCP / 1000) // Convert to seconds
          },
          INP: {
            value: data.coreWebVitals.INP,
            status: getCoreWebVitalStatus('INP', data.coreWebVitals.INP)
          },
          CLS: {
            value: data.coreWebVitals.CLS,
            status: getCoreWebVitalStatus('CLS', data.coreWebVitals.CLS)
          }
        }
      })
      
      const pageSpeedData: PageSpeedData = {
        desktop: enhanceWithStatus(desktopData),
        mobile: enhanceWithStatus(mobileData)
      }
      
      return NextResponse.json(pageSpeedData)
    }
    
    return await Promise.race([mainPromise(), timeoutPromise])
  } catch (error) {
    console.error('PageSpeed API Error:', error)
    // No mock data on failure — the analyzer client already handles a missing
    // pageSpeed section gracefully ("continuing without Core Web Vitals data").
    return NextResponse.json(
      { error: 'PageSpeed data unavailable. The analysis will continue without Core Web Vitals.' },
      { status: 503 }
    )
  }
}