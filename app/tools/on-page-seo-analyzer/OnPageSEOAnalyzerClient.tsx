'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '@/app/components/ToolBreadcrumb'
import CoreWebVitalsCard from '@/app/components/seo-report/CoreWebVitalsCard'
import SEOMetricCard from '@/app/components/seo-report/SEOMetricCard'

interface AnalysisResult {
  url: string
  overallScore: number
  pageSpeed?: {
    desktop: PageSpeedData
    mobile: PageSpeedData
  }
  factors: {
    contentQuality: AnalysisSection
    technicalSEO: AnalysisSection
    onPageElements: AnalysisSection
    userExperience: AnalysisSection
    contentStructure: AnalysisSection
    socialOptimization: AnalysisSection
    localSEO: AnalysisSection
    advancedAnalytics: AnalysisSection
    securityAndTrust: AnalysisSection
    advancedPerformance: AnalysisSection
    advancedTechnical: AnalysisSection
    modernSEO: AnalysisSection
  }
}

interface CoreWebVitalMetric {
  value: number
  status: 'good' | 'needs-improvement' | 'poor'
}

interface CoreWebVitalsData {
  LCP: CoreWebVitalMetric
  INP: CoreWebVitalMetric
  CLS: CoreWebVitalMetric
}

interface PageSpeedData {
  score: number
  coreWebVitals: CoreWebVitalsData
}

interface AnalysisSection {
  score: number
  maxScore: number
  checks: AnalysisCheck[]
}

interface AnalysisCheck {
  factor: string
  status: 'excellent' | 'good' | 'fair' | 'warning' | 'critical' | 'neutral' | 'poor' | 'error'
  description: string
  recommendation?: string
  technicalDetails?: string
  howToFix?: string[]
  impact?: string
  keywordData?: {
    topKeywords: Array<{
      rank: number
      keyword: string
      frequency: number
      density: string
      type: string
      visibility: number
      positions: string[]
    }>
    singleWords: number
    bigrams: number
    trigrams: number
    totalUniqueWords: number
    keywordDiversityScore: number
    overOptimizedKeywords: Array<{word: string, count: number, density: string}>
    underOptimizedKeywords: Array<{word: string, count: number, density: string}>
  }
  headingData?: {
    h1: string[]
    h2: string[]
    h3: string[]
    h4: string[]
    h5: string[]
    h6: string[]
    totalCount: number
    hierarchyScore: number
    issues: string[]
  }
}

export default function OnPageSEOAnalyzerClient() {
  const [url, setUrl] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [pageSpeedLoading, setPageSpeedLoading] = useState(false)
  const [usageLimit, setUsageLimit] = useState({ remaining: 5, totalLimit: 5, resetTime: '', canUse: true })
  const [showUsageWarning, setShowUsageWarning] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed' | 'warnings' | 'critical'>('all')
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [downloadingCSV, setDownloadingCSV] = useState(false)
  const [emailingReport, setEmailingReport] = useState(false)
  const [isReportVisible, setIsReportVisible] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Track report visibility for PDF button
  useEffect(() => {
    if (!analysisResult) return

    const reportElement = document.getElementById('seo-report-section')
    if (!reportElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsReportVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '-100px 0px',
        threshold: 0.1
      }
    )

    observer.observe(reportElement)

    return () => {
      observer.unobserve(reportElement)
    }
  }, [analysisResult])



  // Check usage limits on component mount
  useEffect(() => {
    const checkUsageLimit = async () => {
      try {
        const response = await fetch('/api/usage-limit')
        if (response.ok) {
          const data = await response.json()
          setUsageLimit(data)
          if (data.remaining <= 1) {
            setShowUsageWarning(true)
          }
        }
      } catch (error) {
        console.error('Failed to check usage limit:', error)
      }
    }

    checkUsageLimit()
  }, [])



  const handleCaptchaChange = (value: string | null) => {
    setIsVerified(!!value)
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setError('')
    setAnalysisProgress(0)
    setCurrentStep('')
    setActiveTab('overview')
  }

  const analyzeWebsite = useCallback(async () => {
    if (!url || !isVerified) return

    // Check usage limit before starting analysis
    if (!usageLimit.canUse) {
      setError(`Daily limit exceeded. You have used all ${usageLimit.totalLimit} analyses for today. Please try again after ${new Date(usageLimit.resetTime).toLocaleString()}.`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const recaptchaToken = recaptchaRef.current?.getValue()
      if (!recaptchaToken) {
        throw new Error('Please complete the reCAPTCHA verification')
      }

      // Track usage
      const usageResponse = await fetch('/api/usage-limit', { method: 'POST' })
      if (!usageResponse.ok) {
        const usageData = await usageResponse.json()
        if (usageResponse.status === 429) {
          throw new Error(usageData.error || 'Daily limit exceeded')
        }
      } else {
        const usageData = await usageResponse.json()
        setUsageLimit(usageData)
      }

      console.log('Analyzing URL:', url)
      
      // Simulate progress steps
      setCurrentStep('Fetching webpage content...')
      setAnalysisProgress(10)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setCurrentStep('Analyzing HTML structure...')
      setAnalysisProgress(25)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep('Checking technical SEO factors...')
      setAnalysisProgress(40)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep('Evaluating content quality...')
      setAnalysisProgress(55)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep('Running PageSpeed analysis...')
      setAnalysisProgress(70)
      
      // Fetch PageSpeed data in parallel with timeout
      setPageSpeedLoading(true)
      const pageSpeedPromise = Promise.race([
        fetch('/api/page-speed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url }),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        }),
        new Promise<Response>((_, reject) => {
          setTimeout(() => reject(new Error('PageSpeed request timeout')), 30000)
        })
      ])

      const [seoResponse, pageSpeedResponse] = await Promise.allSettled([
        fetch('/api/analyze-seo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            targetKeyword: targetKeyword || undefined,
            recaptchaToken: recaptchaToken
          }),
          signal: AbortSignal.timeout(45000) // 45 second timeout for main SEO analysis
        }),
        pageSpeedPromise
      ])
      
      setCurrentStep('Processing analysis results...')
      setAnalysisProgress(90)

      // Handle SEO response
      let seoData
      if (seoResponse.status === 'fulfilled' && seoResponse.value.ok) {
        seoData = await seoResponse.value.json()
      } else {
        console.error('SEO analysis failed:', seoResponse.status === 'rejected' ? seoResponse.reason : 'API error')
        throw new Error('SEO analysis failed. Please try again.')
      }

      // Handle PageSpeed response
      let pageSpeedData = null
      if (pageSpeedResponse.status === 'fulfilled') {
        try {
          pageSpeedData = await pageSpeedResponse.value.json()
        } catch (error) {
          console.warn('PageSpeed analysis failed, continuing without Core Web Vitals data:', error)
        }
      } else {
        console.warn('PageSpeed analysis timed out, continuing without Core Web Vitals data:', pageSpeedResponse.reason)
      }
      
      setPageSpeedLoading(false)

      const data = seoData

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }
      
      setCurrentStep('Analysis complete!')
      setAnalysisProgress(100)
      
      await new Promise(resolve => setTimeout(resolve, 500))

      console.log('Analysis completed successfully')
      const analysisWithPageSpeed = {
        ...data.analysis,
        pageSpeed: pageSpeedData
      }
      setAnalysisResult(analysisWithPageSpeed)
      
      // Show usage warning if remaining uses are low
      if (usageLimit.remaining <= 2 && usageLimit.remaining > 0) {
        setShowUsageWarning(true)
      }
      
      // Reset reCAPTCHA
      recaptchaRef.current?.reset()
      setIsVerified(false)
      
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze the website. Please check the URL and try again.')
      
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset()
      setIsVerified(false)
      setAnalysisProgress(0)
      setCurrentStep('')
      setPageSpeedLoading(false)
    } finally {
      setLoading(false)
    }
  }, [url, targetKeyword, isVerified, usageLimit])


  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 75) return 'text-blue-600 bg-blue-100'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }
  
  // Function to handle card click and scroll to detailed results
  const handleCardClick = (tabId: string) => {
    setActiveTab(tabId)
    setActiveFilter('all') // Reset filter when switching tabs
    // Smooth scroll to detailed results section
    setTimeout(() => {
      const resultsSection = document.getElementById('detailed-results')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Share functionality

  const handleDownloadPDF = async () => {
    if (!analysisResult) return
    
    setDownloadingPDF(true)
    try {
      console.log('Starting comprehensive PDF generation...')
      
      // Generate professional HTML-based PDF
      const htmlContent = generateProfessionalPDFHTML(analysisResult)
      
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Pop-up blocked - unable to generate PDF')
      }
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Set filename and print
      const cleanUrl = analysisResult.url.replace(/[^a-z0-9]/gi, '-').substring(0, 30)
      printWindow.document.title = `SEO-Audit-Report-${cleanUrl}-${new Date().toISOString().split('T')[0]}`
      printWindow.print()
      
      console.log('Professional PDF generation initiated successfully')
      
    } catch (error: any) {
      console.error('PDF generation failed:', error)
      
      // Fallback to text download
      try {
        console.log('Attempting text fallback...')
        const textContent = generateFallbackReport(analysisResult)
        const blob = new Blob([textContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `seo-analysis-report-${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        alert('PDF generation failed. A text report has been downloaded instead.')
      } catch (fallbackError) {
        console.error('All generation methods failed:', fallbackError)
        alert('Error generating report. Please try again later.')
      }
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handleDownloadCSV = async () => {
    if (!analysisResult) return
    
    setDownloadingCSV(true)
    try {
      // Generate CSV content from analysis result
      const csvContent = generateCSVContent(analysisResult)
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `seo-analysis-data-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating CSV:', error)
      alert('Error generating CSV file. Please try again.')
    } finally {
      setDownloadingCSV(false)
    }
  }

  const handleEmailReport = async () => {
    if (!analysisResult) return
    
    const email = prompt('Enter your email address to receive the report:')
    if (!email) return
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.')
      return
    }
    
    setEmailingReport(true)
    try {
      const response = await fetch('/api/email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          analysisResult,
          reportType: 'seo-analysis'
        }),
      })
      
      if (response.ok) {
        alert('Report sent successfully! Check your email.')
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending report. Please try again.')
    } finally {
      setEmailingReport(false)
    }
  }

  // Fallback text report generator
  // Professional PDF HTML generation with comprehensive layout
  const generateProfessionalPDFHTML = (result: AnalysisResult) => {
    const currentDate = new Date().toLocaleDateString()
    
    // Calculate comprehensive statistics
    const totalChecks = Object.values(result.factors).reduce((acc, section) => acc + section.checks.length, 0)
    const passedChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)
    const warningChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'warning').length, 0)
    const criticalChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)
    const fairChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'fair' || c.status === 'neutral').length, 0)

    // Get grade based on score
    const getGrade = (score: number) => {
      if (score >= 90) return { grade: 'A+', color: '#10B981', bgColor: '#ECFDF5' }
      if (score >= 80) return { grade: 'A', color: '#059669', bgColor: '#F0FDF4' }
      if (score >= 70) return { grade: 'B+', color: '#65A30D', bgColor: '#F7FEE7' }
      if (score >= 60) return { grade: 'B', color: '#CA8A04', bgColor: '#FEFCE8' }
      if (score >= 50) return { grade: 'C', color: '#D97706', bgColor: '#FFF7ED' }
      if (score >= 40) return { grade: 'D', color: '#EA580C', bgColor: '#FFF7ED' }
      return { grade: 'F', color: '#DC2626', bgColor: '#FEF2F2' }
    }

    const overallGrade = getGrade(result.overallScore)

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>SEO Audit Report - ${result.url}</title>
      <style>
        @page {
          size: A4;
          margin: 0.5in;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
          .no-print { display: none !important; }
        }
        * { box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.4; 
          color: #1f2937; 
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        
        /* Header Styles */
        .report-header {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: white;
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 8px;
          text-align: center;
        }
        .report-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }
        .report-header .url {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }
        .report-header .date {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Executive Summary */
        .executive-summary {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .summary-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1e40af;
          text-align: center;
        }
        
        /* Score Display */
        .score-display {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
        }
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: ${overallGrade.bgColor};
          border: 4px solid ${overallGrade.color};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 2rem;
        }
        .score-number {
          font-size: 2rem;
          font-weight: 700;
          color: ${overallGrade.color};
        }
        .score-grade {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${overallGrade.color};
          margin-top: -0.2rem;
        }
        .score-details {
          flex: 1;
        }
        .score-details h3 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        /* Statistics Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
        }
        .stat-passed .stat-number { color: #10b981; }
        .stat-warning .stat-number { color: #f59e0b; }
        .stat-critical .stat-number { color: #ef4444; }
        .stat-total .stat-number { color: #3b82f6; }

        /* Category Sections */
        .category-section {
          margin-bottom: 2rem;
          avoid-break: always;
        }
        .category-header {
          background: linear-gradient(90deg, #f8fafc, #e2e8f0);
          border-left: 4px solid #2563eb;
          padding: 1rem 1.5rem;
          margin-bottom: 0;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .category-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
          color: #1f2937;
        }
        .category-score {
          background: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        /* Factors Table */
        .factors-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 0 0 8px 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .factors-table th {
          background: #374151;
          color: white;
          padding: 0.8rem;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .factors-table td {
          padding: 0.8rem;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.85rem;
        }
        .factors-table tr:last-child td {
          border-bottom: none;
        }
        .factors-table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        /* Status Badges */
        .status-badge {
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-excellent { background: #dcfce7; color: #166534; }
        .status-good { background: #d1fae5; color: #065f46; }
        .status-fair { background: #fef3c7; color: #92400e; }
        .status-warning { background: #fed7aa; color: #9a3412; }
        .status-critical { background: #fecaca; color: #991b1b; }
        .status-error { background: #fecaca; color: #991b1b; }
        .status-neutral { background: #f3f4f6; color: #374151; }

        /* Recommendations Section */
        .recommendations {
          background: #fef3c7;
          border: 2px solid #fbbf24;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .recommendations h3 {
          color: #92400e;
          margin-top: 0;
          margin-bottom: 1rem;
        }
        .recommendation-list {
          list-style: none;
          padding: 0;
        }
        .recommendation-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #fbbf24;
          position: relative;
          padding-left: 1.5rem;
        }
        .recommendation-list li:before {
          content: "→";
          color: #92400e;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        .recommendation-list li:last-child {
          border-bottom: none;
        }

        /* Footer */
        .report-footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 1rem;
          border-top: 2px solid #e5e7eb;
          color: #6b7280;
          font-size: 0.9rem;
        }
        .branding {
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        /* Utility Classes */
        .text-center { text-align: center; }
        .mb-2 { margin-bottom: 1rem; }
        .font-bold { font-weight: 700; }
      </style>
    </head>
    <body>
      <!-- Report Header -->
      <div class="report-header">
        <h1>SEO Audit Report</h1>
        <div class="url">${result.url}</div>
        <div class="date">Generated on ${currentDate}</div>
      </div>

      <!-- Executive Summary -->
      <div class="executive-summary avoid-break">
        <div class="summary-title">Executive Summary</div>
        <div class="score-display">
          <div class="score-circle">
            <div class="score-number">${result.overallScore}</div>
            <div class="score-grade">${overallGrade.grade}</div>
          </div>
          <div class="score-details">
            <h3>Overall Website Performance</h3>
            <p>Your website scored <strong>${result.overallScore} out of 100</strong>, earning a grade of <strong>${overallGrade.grade}</strong>. 
            This comprehensive analysis examined ${totalChecks} different SEO factors across ${Object.keys(result.factors).length} key categories.</p>
          </div>
        </div>

        <!-- Statistics Grid -->
        <div class="stats-grid">
          <div class="stat-card stat-total">
            <div class="stat-number">${totalChecks}</div>
            <div class="stat-label">Total Factors</div>
          </div>
          <div class="stat-card stat-passed">
            <div class="stat-number">${passedChecks}</div>
            <div class="stat-label">Passed</div>
          </div>
          <div class="stat-card stat-warning">
            <div class="stat-number">${warningChecks}</div>
            <div class="stat-label">Warnings</div>
          </div>
          <div class="stat-card stat-critical">
            <div class="stat-number">${criticalChecks}</div>
            <div class="stat-label">Critical Issues</div>
          </div>
        </div>
      </div>

      <!-- Detailed Category Analysis -->
      ${Object.entries(result.factors).map(([categoryKey, categoryData]) => {
        const categoryName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        const categoryGrade = getGrade(categoryData.score)
        
        return `
        <div class="category-section avoid-break">
          <div class="category-header">
            <div class="category-title">${categoryName}</div>
            <div class="category-score">${categoryData.score}/100 (${categoryGrade.grade})</div>
          </div>
          <table class="factors-table">
            <thead>
              <tr>
                <th style="width: 25%">Factor</th>
                <th style="width: 15%">Status</th>
                <th style="width: 60%">Description & Recommendation</th>
              </tr>
            </thead>
            <tbody>
              ${categoryData.checks.slice(0, 12).map(check => `
                <tr>
                  <td><strong>${check.factor}</strong></td>
                  <td><span class="status-badge status-${check.status}">${check.status}</span></td>
                  <td>
                    <div style="margin-bottom: 0.5rem;">${check.description}</div>
                    ${check.recommendation ? `<div style="font-style: italic; color: #374151;"><strong>Recommendation:</strong> ${check.recommendation}</div>` : ''}
                  </td>
                </tr>
              `).join('')}
              ${categoryData.checks.length > 12 ? `
                <tr>
                  <td colspan="3" style="text-align: center; font-style: italic; color: #6b7280; padding: 1rem;">
                    ... and ${categoryData.checks.length - 12} additional factors analyzed
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>`
      }).join('')}

      <!-- Key Recommendations -->
      <div class="recommendations avoid-break">
        <h3>🎯 Priority Recommendations</h3>
        <ul class="recommendation-list">
          ${(() => {
            const criticalIssues = []
            Object.values(result.factors).forEach(category => {
              category.checks.filter(c => c.status === 'critical' || c.status === 'error').slice(0, 2).forEach(issue => {
                criticalIssues.push(issue.recommendation || `Fix: ${issue.factor}`)
              })
            })
            return criticalIssues.slice(0, 8).map(rec => `<li>${rec}</li>`).join('')
          })()}
        </ul>
      </div>

      <!-- Report Footer -->
      <div class="report-footer">
        <div class="branding">SEOShouts On-Page SEO Analyzer</div>
        <div>Comprehensive SEO Analysis • ${totalChecks} Factors Examined • Generated ${currentDate}</div>
        <div style="margin-top: 0.5rem;">
          🚀 Generated with <a href="https://seoshouts.com/tools/on-page-seo-analyzer" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 600;">SEOShouts - On Page SEO Analyzer</a>
        </div>
      </div>
    </body>
    </html>`
  }

  const generateFallbackReport = (result: AnalysisResult) => {
    const currentDate = new Date().toLocaleDateString()
    const totalChecks = Object.values(result.factors).reduce((acc, section) => acc + section.checks.length, 0)
    const passedChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)
    const warningChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'warning').length, 0)
    const criticalChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)

    let report = `
SEO ANALYSIS REPORT
===================
URL: ${result.url}
Generated: ${currentDate}
Overall Score: ${result.overallScore}/100

SUMMARY STATISTICS:
- Total Factors Analyzed: ${totalChecks}
- Passed Factors: ${passedChecks}
- Warning Factors: ${warningChecks}
- Critical Issues: ${criticalChecks}

DETAILED ANALYSIS:
==================

`

    Object.entries(result.factors).forEach(([categoryKey, categoryData]) => {
      const categoryName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
      report += `\n${categoryName.toUpperCase()} (Score: ${categoryData.score}/100)\n`
      report += '='.repeat(categoryName.length + 20) + '\n\n'
      
      categoryData.checks.forEach((check) => {
        const status = check.status.toUpperCase()
        report += `[${status}] ${check.factor}\n`
        report += `Description: ${check.description}\n`
        
        if (check.recommendation) {
          report += `Recommendation: ${check.recommendation}\n`
        }
        
        if (check.technicalDetails) {
          report += `Technical Details: ${check.technicalDetails}\n`
        }
        
        if (check.howToFix && check.howToFix.length > 0) {
          report += `How to Fix:\n`
          check.howToFix.slice(0, 3).forEach((fix, index) => {
            report += `  ${index + 1}. ${fix}\n`
          })
        }
        
        report += '\n'
      })
    })

    report += `\n\nReport generated by SEOShouts On-Page SEO Analyzer\n`
    report += `Generated with Claude Code (claude.ai/code)\n`

    return report
  }

  // Simplified PDF generation function with error handling
  const generateComprehensivePDF = async (doc: any, result: AnalysisResult) => {
    try {
      console.log('Starting PDF content generation...')
      
      const currentDate = new Date().toLocaleDateString()
      let yPosition = 30
      const leftMargin = 20
      const rightMargin = 190
      const pageHeight = 280
      
      // Calculate summary statistics
      const totalChecks = Object.values(result.factors).reduce((acc, section) => acc + section.checks.length, 0)
      const passedChecks = Object.values(result.factors).reduce((acc, section) => 
        acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)
      const warningChecks = Object.values(result.factors).reduce((acc, section) => 
        acc + section.checks.filter(c => c.status === 'warning').length, 0)
      const criticalChecks = Object.values(result.factors).reduce((acc, section) => 
        acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)

      // Header Section - Simplified
      console.log('Adding header...')
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('SEO Analysis Report', leftMargin, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`URL: ${result.url}`, leftMargin, yPosition)
      yPosition += 6
      doc.text(`Generated: ${currentDate}`, leftMargin, yPosition)
      yPosition += 15
      
      // Overall Score Section
      console.log('Adding score section...')
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(`Overall SEO Score: ${result.overallScore}/100`, leftMargin, yPosition)
      yPosition += 15
      
      // Summary Statistics
      console.log('Adding summary...')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Summary Statistics', leftMargin, yPosition)
      yPosition += 10
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total Factors Analyzed: ${totalChecks}`, leftMargin, yPosition)
      yPosition += 6
      doc.text(`Passed Factors: ${passedChecks}`, leftMargin, yPosition)
      yPosition += 6
      doc.text(`Warning Factors: ${warningChecks}`, leftMargin, yPosition)
      yPosition += 6
      doc.text(`Critical Issues: ${criticalChecks}`, leftMargin, yPosition)
      yPosition += 15
      
      // Detailed Analysis
      console.log('Adding detailed analysis...')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Detailed Analysis', leftMargin, yPosition)
      yPosition += 10
      
      // Iterate through categories with simplified approach
      let factorCount = 0
      Object.entries(result.factors).forEach(([categoryKey, categoryData]) => {
        const categoryName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        
        // Category Header
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${categoryName} (Score: ${categoryData.score}/100)`, leftMargin, yPosition)
        yPosition += 8
        
        // Add only first few checks to avoid overwhelming the PDF
        const checksToShow = categoryData.checks.slice(0, 5) // Show max 5 checks per category
        checksToShow.forEach((check) => {
          factorCount++
          
          // Check if we need a new page
          if (yPosition > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
          
          // Factor name with status
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          const statusText = check.status.toUpperCase()
          doc.text(`[${statusText}] ${check.factor}`, leftMargin + 5, yPosition)
          yPosition += 5
          
          // Description (truncated to avoid overflow)
          doc.setFontSize(8)
          doc.setFont('helvetica', 'normal')
          const maxDescLength = 80
          const shortDesc = check.description.length > maxDescLength 
            ? check.description.substring(0, maxDescLength) + '...'
            : check.description
          
          try {
            const descLines = doc.splitTextToSize(shortDesc, rightMargin - leftMargin - 10)
            doc.text(descLines, leftMargin + 8, yPosition)
            yPosition += Math.min(descLines.length * 3, 9) // Limit line spacing
          } catch (err) {
            console.warn('Error adding description, skipping...')
            yPosition += 3
          }
          
          yPosition += 3 // Space between checks
        })
        
        if (categoryData.checks.length > 5) {
          doc.setFontSize(8)
          doc.setFont('helvetica', 'italic')
          doc.text(`... and ${categoryData.checks.length - 5} more factors`, leftMargin + 5, yPosition)
          yPosition += 5
        }
        
        yPosition += 5 // Space between categories
      })
      
      // Footer
      console.log('Adding footer...')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Generated by SEOShouts On-Page SEO Analyzer', leftMargin, pageHeight + 10)
      
      console.log(`PDF content generation completed. Added ${factorCount} factors.`)
      
    } catch (error) {
      console.error('Error in generateComprehensivePDF:', error)
      throw new Error('Failed to generate PDF content: ' + error.message)
    }
  }

  // Helper function to generate HTML content for PDF with proper styling (kept for compatibility)
  const generatePDFHTML = (result: AnalysisResult) => {
    const currentDate = new Date().toLocaleDateString()
    
    // Calculate summary statistics
    const totalChecks = Object.values(result.factors).reduce((acc, section) => acc + section.checks.length, 0)
    const passedChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)
    const warningChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'warning').length, 0)
    const criticalChecks = Object.values(result.factors).reduce((acc, section) => 
      acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'excellent': return '🌟'
        case 'good': return '✅' 
        case 'fair': return '👌'
        case 'warning': return '⚠️'
        case 'critical': case 'error': return '❌'
        default: return '⭕'
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'excellent': return '#10B981'
        case 'good': return '#22C55E'
        case 'fair': return '#84CC16'
        case 'warning': return '#F59E0B'
        case 'critical': case 'error': return '#EF4444'
        default: return '#6B7280'
      }
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>SEO Analysis Report - ${result.url}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        @media print {
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; font-size: 12px; line-height: 1.4; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
        }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
          line-height: 1.4; 
          color: #333; 
          font-size: 12px;
          margin: 0;
          padding: 0;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #2563EB; 
          padding-bottom: 20px; 
          margin-bottom: 25px; 
          background: linear-gradient(135deg, #2563EB, #1E40AF);
          color: white;
          padding: 20px;
          border-radius: 8px;
        }
        .header h1 { 
          color: white; 
          font-size: 24px; 
          margin: 0 0 10px 0; 
          font-weight: bold;
        }
        .header .url { 
          font-size: 14px; 
          margin: 5px 0; 
          opacity: 0.9;
        }
        .header .date { 
          font-size: 12px; 
          opacity: 0.8;
        }
        .score-section { 
          background: #F8FAFC; 
          border: 2px solid #2563EB;
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          text-align: center; 
        }
        .score-large { 
          font-size: 36px; 
          font-weight: bold; 
          margin: 0;
          color: #2563EB;
        }
        .score-label { 
          font-size: 14px; 
          color: #6B7280;
          margin-top: 5px;
        }
        .summary-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 15px; 
          margin: 20px 0; 
        }
        .summary-card { 
          background: #F9FAFB; 
          border: 1px solid #E5E7EB;
          border-left: 4px solid #E5E7EB; 
          padding: 15px; 
          border-radius: 6px;
          text-align: center;
        }
        .summary-card.passed { border-left-color: #10B981; }
        .summary-card.warning { border-left-color: #F59E0B; }
        .summary-card.critical { border-left-color: #EF4444; }
        .summary-number { 
          font-size: 20px; 
          font-weight: bold; 
          margin: 0 0 5px 0; 
        }
        .summary-label { 
          font-size: 12px; 
          color: #6B7280; 
        }
        .category-section { 
          margin: 20px 0; 
          page-break-inside: avoid;
        }
        .category-header { 
          background: #F3F4F6; 
          padding: 12px; 
          border-radius: 6px 6px 0 0; 
          border-left: 4px solid #2563EB;
          border: 1px solid #E5E7EB;
          border-bottom: none;
        }
        .category-title { 
          font-size: 16px; 
          font-weight: bold; 
          color: #1F2937; 
          margin: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .category-score { 
          background: #2563EB; 
          color: white; 
          padding: 4px 10px; 
          border-radius: 12px; 
          font-size: 12px; 
          font-weight: normal;
        }
        .checks-list { 
          background: white; 
          border: 1px solid #E5E7EB; 
          border-top: none; 
          border-radius: 0 0 6px 6px;
        }
        .check-item { 
          padding: 10px 12px; 
          border-bottom: 1px solid #F3F4F6; 
          display: flex; 
          align-items: flex-start;
          font-size: 11px;
        }
        .check-item:last-child { border-bottom: none; }
        .check-icon { 
          margin-right: 8px; 
          font-size: 14px; 
          margin-top: 1px;
          min-width: 20px;
        }
        .check-content { flex: 1; }
        .check-factor { 
          font-weight: bold; 
          color: #1F2937; 
          margin-bottom: 3px; 
        }
        .check-description { 
          color: #6B7280; 
          font-size: 11px; 
          line-height: 1.3;
        }
        .check-recommendation { 
          margin-top: 6px; 
          padding: 6px 8px; 
          background: #F9FAFB; 
          border-radius: 4px; 
          font-size: 10px;
          border-left: 2px solid #2563EB;
        }
        .check-recommendation strong { color: #2563EB; }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 15px; 
          border-top: 1px solid #E5E7EB; 
          color: #9CA3AF; 
          font-size: 10px; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SEO Analysis Report</h1>
        <div class="url">${result.url}</div>
        <div class="date">Generated on ${currentDate}</div>
      </div>

      <div class="score-section">
        <div class="score-large">${result.overallScore}</div>
        <div class="score-label">Overall SEO Score out of 100</div>
      </div>

      <div class="summary-grid">
        <div class="summary-card passed">
          <div class="summary-number" style="color: #10B981;">${passedChecks}</div>
          <div class="summary-label">Passed Factors</div>
        </div>
        <div class="summary-card warning">
          <div class="summary-number" style="color: #F59E0B;">${warningChecks}</div>
          <div class="summary-label">Warning Factors</div>
        </div>
        <div class="summary-card critical">
          <div class="summary-number" style="color: #EF4444;">${criticalChecks}</div>
          <div class="summary-label">Critical Issues</div>
        </div>
      </div>

      ${Object.entries(result.factors).map(([category, data]) => `
        <div class="category-section avoid-break">
          <div class="category-header">
            <div class="category-title">
              ${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              <span class="category-score">${data.score}/100</span>
            </div>
          </div>
          <div class="checks-list">
            ${data.checks.map(check => `
              <div class="check-item">
                <div class="check-icon" style="color: ${getStatusColor(check.status)};">
                  ${getStatusIcon(check.status)}
                </div>
                <div class="check-content">
                  <div class="check-factor">${check.factor}</div>
                  <div class="check-description">${check.description}</div>
                  ${check.recommendation ? `<div class="check-recommendation"><strong>Recommendation:</strong> ${check.recommendation}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div class="footer">
        <div><strong>SEOShouts On-Page SEO Analyzer</strong></div>
        <div>Total factors analyzed: ${totalChecks} | Generated: ${currentDate}</div>
        <div style="margin-top: 8px;">🤖 Generated with Claude Code (claude.ai/code)</div>
      </div>
    </body>
    </html>
    `
  }

  // Helper function to generate CSV content
  const generateCSVContent = (result: AnalysisResult) => {
    const headers = ['Category', 'Factor', 'Status', 'Description', 'Recommendation']
    const rows = [headers.join(',')]
    
    Object.entries(result.factors).forEach(([category, data]) => {
      data.checks.forEach(check => {
        const row = [
          category,
          `"${check.factor}"`,
          check.status,
          `"${check.description.replace(/"/g, '""')}"`,
          `"${check.recommendation?.replace(/"/g, '""') || ''}"`,
        ]
        rows.push(row.join(','))
      })
    })
    
    return rows.join('\n')
  }

  const getStatusIcon = (status: 'excellent' | 'good' | 'fair' | 'warning' | 'critical' | 'neutral' | 'poor' | 'error') => {
    switch (status) {
      case 'excellent': return '🌟'
      case 'good': return '✅'
      case 'fair': return '👍'
      case 'warning': return '⚠️'
      case 'critical': return '❌'
      case 'poor': return '😞'
      case 'error': return '💥'
      case 'neutral': return 'ℹ️'
      default: return '❓'
    }
  }

  const renderAnalysisSection = (title: string, section: AnalysisSection) => {
    const percentage = Math.round((section.score / section.maxScore) * 100)
    const excellentChecks = section.checks.filter(c => c.status === 'excellent').length
    const goodChecks = section.checks.filter(c => c.status === 'good').length
    const warningChecks = section.checks.filter(c => c.status === 'warning').length
    const criticalChecks = section.checks.filter(c => c.status === 'critical' || c.status === 'error').length
    
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        {/* Header with Score */}
        <div className={`px-6 py-4 ${
          percentage >= 90 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
          percentage >= 75 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
          percentage >= 50 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
          'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
        } border-b`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {excellentChecks + goodChecks} Passed
                </span>
                <span className="flex items-center text-yellow-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  {warningChecks} Warnings
                </span>
                <span className="flex items-center text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {criticalChecks} Critical
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                percentage >= 90 ? 'text-green-600' :
                percentage >= 75 ? 'text-blue-600' :
                percentage >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {percentage}%
              </div>
              <div className="text-sm text-gray-600">{section.score}/{section.maxScore} points</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  percentage >= 90 ? 'bg-green-500' :
                  percentage >= 75 ? 'bg-blue-500' :
                  percentage >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="px-4 md:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">All Factors </span>
              <span className="sm:hidden">All </span>
              ({section.checks.length})
            </button>
            <button
              onClick={() => setActiveFilter('passed')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                activeFilter === 'passed'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1 md:mr-2"></span>
              <span className="hidden sm:inline">Passed </span>
              <span className="sm:hidden">✓ </span>
              ({excellentChecks + goodChecks})
            </button>
            <button
              onClick={() => setActiveFilter('warnings')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                activeFilter === 'warnings'
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block mr-1 md:mr-2"></span>
              <span className="hidden sm:inline">Warnings </span>
              <span className="sm:hidden">⚠ </span>
              ({warningChecks})
            </button>
            <button
              onClick={() => setActiveFilter('critical')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                activeFilter === 'critical'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-1 md:mr-2"></span>
              <span className="hidden sm:inline">Critical </span>
              <span className="sm:hidden">✗ </span>
              ({criticalChecks})
            </button>
          </div>
        </div>

        {/* Checks List */}
        <div className="p-6">
          <div className="space-y-4">
            {(() => {
              // Filter checks based on active filter
              let filteredChecks = section.checks
              if (activeFilter === 'passed') {
                filteredChecks = section.checks.filter(c => c.status === 'excellent' || c.status === 'good')
              } else if (activeFilter === 'warnings') {
                filteredChecks = section.checks.filter(c => c.status === 'warning')
              } else if (activeFilter === 'critical') {
                filteredChecks = section.checks.filter(c => c.status === 'critical' || c.status === 'error')
              }
              
              if (filteredChecks.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-600 mb-2">No factors found</p>
                    <p className="text-sm text-gray-500">
                      {activeFilter === 'passed' && 'No passed factors in this category.'}
                      {activeFilter === 'warnings' && 'No warning factors in this category.'}
                      {activeFilter === 'critical' && 'No critical factors in this category.'}
                    </p>
                  </div>
                )
              }
              
              return filteredChecks.map((check, index) => {
              const getBorderColor = (status: string) => {
                switch (status) {
                  case 'excellent': return 'border-green-200 bg-green-50'
                  case 'good': return 'border-blue-200 bg-blue-50'
                  case 'warning': return 'border-yellow-200 bg-yellow-50'
                  case 'critical':
                  case 'error': return 'border-red-200 bg-red-50'
                  default: return 'border-gray-200 bg-gray-50'
                }
              }
              
              const getTextColor = (status: string) => {
                switch (status) {
                  case 'excellent': return 'text-green-700'
                  case 'good': return 'text-blue-700'
                  case 'warning': return 'text-yellow-700'
                  case 'critical':
                  case 'error': return 'text-red-700'
                  default: return 'text-gray-700'
                }
              }
              
              return (
                <div key={index} className={`border-l-4 ${getBorderColor(check.status)} border rounded-lg p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getStatusIcon(check.status)}</span>
                        <div>
                          <span className="font-semibold text-gray-900">{check.factor}</span>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-3 ${
                            check.status === 'excellent' ? 'bg-green-100 text-green-800' :
                            check.status === 'good' ? 'bg-blue-100 text-blue-800' :
                            check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            check.status === 'critical' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {check.status === 'excellent' ? 'Excellent' :
                             check.status === 'good' ? 'Good' :
                             check.status === 'warning' ? 'Needs Attention' :
                             check.status === 'critical' ? 'Critical' :
                             check.status === 'error' ? 'Error' : 'Unknown'}
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm ${getTextColor(check.status)} leading-relaxed mb-2`}>
                        {check.description}
                      </p>
                      
                      {/* Enhanced Information Display */}
                      {check.recommendation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                              <h5 className="text-sm font-semibold text-blue-900 mb-1">Recommendation</h5>
                              <p className="text-sm text-blue-800">{check.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {check.technicalDetails && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">i</span>
                            </div>
                            <div>
                              <h5 className="text-sm font-semibold text-gray-900 mb-1">Technical Details</h5>
                              <p className="text-sm text-gray-700">{check.technicalDetails}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {check.howToFix && check.howToFix.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">→</span>
                            </div>
                            <div>
                              <h5 className="text-sm font-semibold text-green-900 mb-2">How to Fix</h5>
                              <ul className="space-y-1">
                                {check.howToFix.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start text-sm text-green-800">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Keyword Optimization Table */}
                      {check.keywordData && check.keywordData.topKeywords && check.keywordData.topKeywords.length > 0 && (
                        <div className="mt-4">
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-200">
                              <h5 className="text-sm font-semibold text-indigo-900 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Keyword Analysis Report
                              </h5>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-2 text-xs">
                                <div className="text-indigo-700">
                                  <span className="font-medium">1-Word:</span> {check.keywordData.singleWords || 0}
                                </div>
                                <div className="text-indigo-700">
                                  <span className="font-medium">2-Word:</span> {check.keywordData.bigrams || 0}
                                </div>
                                <div className="text-indigo-700">
                                  <span className="font-medium">3-Word:</span> {check.keywordData.trigrams || 0}
                                </div>
                                <div className="text-indigo-700">
                                  <span className="font-medium">Diversity:</span> {check.keywordData.keywordDiversityScore.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead className="bg-indigo-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-medium text-indigo-900">#</th>
                                    <th className="px-3 py-2 text-left font-medium text-indigo-900">Keyword/Phrase</th>
                                    <th className="px-3 py-2 text-center font-medium text-indigo-900">Type</th>
                                    <th className="px-3 py-2 text-center font-medium text-indigo-900">Count</th>
                                    <th className="px-3 py-2 text-center font-medium text-indigo-900">Density</th>
                                    <th className="px-3 py-2 text-center font-medium text-indigo-900">Visibility</th>
                                    <th className="px-3 py-2 text-left font-medium text-indigo-900">Found In</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {check.keywordData.topKeywords.map((keyword, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-indigo-25'}>
                                      <td className="px-3 py-2 font-medium text-indigo-600">{keyword.rank}</td>
                                      <td className="px-3 py-2 font-medium text-gray-900 max-w-48 truncate">{keyword.keyword}</td>
                                      <td className="px-3 py-2 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          keyword.type === '1-word' ? 'bg-blue-100 text-blue-800' :
                                          keyword.type === '2-word' ? 'bg-green-100 text-green-800' :
                                          'bg-purple-100 text-purple-800'
                                        }`}>
                                          {keyword.type}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-center text-gray-700">{keyword.frequency}</td>
                                      <td className="px-3 py-2 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          parseFloat(keyword.density) > 5 
                                            ? 'bg-red-100 text-red-800' 
                                            : parseFloat(keyword.density) >= 0.5 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {keyword.density}%
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        <div className="flex items-center justify-center">
                                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                            <div 
                                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                                              style={{width: `${keyword.visibility}%`}}
                                            ></div>
                                          </div>
                                          <span className="text-gray-600">{keyword.visibility}%</span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2">
                                        <div className="flex flex-wrap gap-1">
                                          {keyword.positions.map((position, posIdx) => (
                                            <span key={posIdx} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                              {position}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Mobile Card View */}
                            <div className="lg:hidden">
                              <div className="space-y-3 p-4">
                                {check.keywordData.topKeywords.map((keyword, idx) => (
                                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm font-medium text-indigo-600">#{keyword.rank}</span>
                                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                            keyword.type === '1-word' ? 'bg-blue-100 text-blue-800' :
                                            keyword.type === '2-word' ? 'bg-green-100 text-green-800' :
                                            'bg-purple-100 text-purple-800'
                                          }`}>
                                            {keyword.type}
                                          </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 break-words">{keyword.keyword}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <span className="text-gray-500">Count:</span>
                                        <span className="ml-1 font-medium text-gray-800">{keyword.frequency}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Density:</span>
                                        <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                                          parseFloat(keyword.density) > 5 
                                            ? 'bg-red-100 text-red-800' 
                                            : parseFloat(keyword.density) >= 0.5 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {keyword.density}%
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>Visibility</span>
                                        <span className="font-medium text-gray-700">{keyword.visibility}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div 
                                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                                          style={{ width: `${keyword.visibility}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    
                                    {keyword.positions && keyword.positions.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Found in:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {keyword.positions.map((position, posIdx) => (
                                            <span key={posIdx} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                              {position}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Over/Under Optimized Keywords */}
                            {(check.keywordData.overOptimizedKeywords.length > 0 || check.keywordData.underOptimizedKeywords.length > 0) && (
                              <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
                                {check.keywordData.overOptimizedKeywords.length > 0 && (
                                  <div className="mb-2">
                                    <h6 className="text-xs font-semibold text-red-800 mb-1 flex items-center">
                                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                      Over-optimized ({'>'}5% density)
                                    </h6>
                                    <div className="flex flex-wrap gap-1">
                                      {check.keywordData.overOptimizedKeywords.map((kw, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                          {kw.word} ({kw.density}%)
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {check.keywordData.underOptimizedKeywords.length > 0 && (
                                  <div>
                                    <h6 className="text-xs font-semibold text-yellow-800 mb-1 flex items-center">
                                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                      Under-optimized ({'<'}0.5% density)
                                    </h6>
                                    <div className="flex flex-wrap gap-1">
                                      {check.keywordData.underOptimizedKeywords.map((kw, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                          {kw.word} ({kw.density}%)
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Heading Hierarchy Display */}
                      {check.headingData && check.headingData.totalCount > 0 && (
                        <div className="mt-4">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 overflow-hidden">
                            <div className="px-3 sm:px-4 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200">
                              <h5 className="text-sm font-semibold text-green-900 flex items-center">
                                <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                <span className="truncate">Heading Structure Analysis</span>
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-2 text-xs">
                                <div className="text-green-700">
                                  <span className="font-medium">Total Headings:</span> {check.headingData.totalCount}
                                </div>
                                <div className="text-green-700">
                                  <span className="font-medium">Hierarchy Score:</span> {check.headingData.hierarchyScore}/10
                                </div>
                              </div>
                            </div>
                            <div className="p-3 sm:p-4">
                              <div className="space-y-3 sm:space-y-4">
                                {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => {
                                  const headings = check.headingData?.[level as keyof typeof check.headingData] as string[];
                                  if (!headings || headings.length === 0) return null;

                                  return (
                                    <div key={level} className="border-l-4 border-gray-200 pl-3 sm:pl-4">
                                      <div className="flex items-center mb-2 flex-wrap gap-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                                          level === 'h1' ? 'bg-red-100 text-red-800' :
                                          level === 'h2' ? 'bg-blue-100 text-blue-800' :
                                          level === 'h3' ? 'bg-green-100 text-green-800' :
                                          level === 'h4' ? 'bg-yellow-100 text-yellow-800' :
                                          level === 'h5' ? 'bg-purple-100 text-purple-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {level.toUpperCase()}
                                        </span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                                          {headings.length} heading{headings.length !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                      <div className="space-y-2">
                                        {headings.map((heading, idx) => (
                                          <div key={idx} className="bg-white rounded-lg border border-gray-100 p-2 sm:p-3 shadow-sm">
                                            <div className="flex flex-col space-y-2">
                                              <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900 break-words leading-tight">
                                                  {heading.length > 80 ? `${heading.substring(0, 80)}...` : heading}
                                                </p>
                                              </div>
                                              <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                                                <span className="shrink-0">{heading.length} chars</span>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                                                  level === 'h1' && heading.length < 30 ? 'bg-red-100 text-red-700' :
                                                  level === 'h1' && heading.length > 60 ? 'bg-red-100 text-red-700' :
                                                  level !== 'h1' && heading.length < 20 ? 'bg-yellow-100 text-yellow-700' :
                                                  level !== 'h1' && heading.length > 70 ? 'bg-yellow-100 text-yellow-700' :
                                                  'bg-green-100 text-green-700'
                                                }`}>
                                                  {
                                                    level === 'h1' && heading.length >= 30 && heading.length <= 60 ? 'Optimal' :
                                                    level !== 'h1' && heading.length >= 20 && heading.length <= 70 ? 'Good' :
                                                    heading.length < (level === 'h1' ? 30 : 20) ? 'Too Short' :
                                                    'Too Long'
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Hierarchy Issues */}
                              {check.headingData.issues && check.headingData.issues.length > 0 && (
                                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                  <h6 className="text-xs font-semibold text-amber-800 mb-2 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Structure Issues
                                  </h6>
                                  <ul className="text-xs text-amber-700 space-y-1">
                                    {check.headingData.issues.map((issue, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                        {issue}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {check.impact && (
                        <div className="mt-3 p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-600 text-xs font-semibold">SEO Impact:</span>
                            <span className="text-purple-800 text-xs">{check.impact}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          })()}
          </div>
          
          {/* Summary and Recommendations */}
          {(criticalChecks > 0 || warningChecks > 0) && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Priority Actions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.checks
                  .filter(c => c.status === 'critical' || c.status === 'error')
                  .slice(0, 4)
                  .map((check, index) => (
                    <div key={index} className="flex items-start p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium text-red-800 text-sm">Fix {check.factor}</span>
                        <p className="text-xs text-red-600 mt-1">High impact on SEO performance</p>
                      </div>
                    </div>
                  ))
                }
                {section.checks
                  .filter(c => c.status === 'warning')
                  .slice(0, Math.max(0, 4 - criticalChecks))
                  .map((check, index) => (
                    <div key={index + criticalChecks} className="flex items-start p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-white text-xs font-bold">{index + criticalChecks + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium text-yellow-800 text-sm">Improve {check.factor}</span>
                        <p className="text-xs text-yellow-600 mt-1">Moderate impact on SEO performance</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Software Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "On-Page SEO Analyzer Tool",
            "description": "Complete on-page SEO analysis with 100+ factors. Analyze content quality, technical SEO, Core Web Vitals, user experience, and get actionable recommendations.",
            "url": "https://seoshouts.com/tools/on-page-seo-analyzer",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "browserRequirements": "Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "featureList": [
              "100+ SEO factors analysis",
              "Core Web Vitals analysis",
              "Content quality evaluation",
              "Technical SEO audit",
              "PageSpeed Insights integration",
              "Real-time analysis",
              "Actionable recommendations"
            ],
            "keywords": "on-page SEO analyzer, website SEO audit, SEO analysis tool, Core Web Vitals, technical SEO, content optimization",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "ratingCount": "2847"
            },
            "softwareVersion": "2.0",
            "datePublished": "2024-12-01",
            "dateModified": "2025-01-15",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />

      {/* Hero Tool Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            
            {/* Tool Title */}
            <div className="text-center mb-8">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Free Website Page SEO Checker
              </p>
            </div>

            {/* Tool Interface */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
              <div className="space-y-8">
                
                {/* URL and Keyword Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* URL Input */}
                  <div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Example.com"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg placeholder-gray-400"
                    />
                  </div>

                  {/* Keyword Input */}
                  <div>
                    <input
                      type="text"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      placeholder="Target Keyword (Optional)"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={handleCaptchaChange}
                    theme="light"
                  />
                </div>

                {/* Usage Limit Info */}
                {!loading && (
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${usageLimit.remaining > 2 ? 'bg-green-500' : usageLimit.remaining > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-600">
                        {usageLimit.remaining} of {usageLimit.totalLimit} free analyses remaining today
                      </span>
                    </div>
                  </div>
                )}

                {/* Audit Button */}
                <div className="text-center">
                  <button
                    onClick={analyzeWebsite}
                    disabled={!url || !isVerified || loading || !usageLimit.canUse}
                    className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-xl rounded-xl hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Analyzing...
                      </div>
                    ) : !usageLimit.canUse ? (
                      'Daily Limit Reached'
                    ) : (
                      'Audit'
                    )}
                  </button>
                  
                  {!usageLimit.canUse && (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-red-600 mb-2">
                        You've reached your daily limit of {usageLimit.totalLimit} free analyses.
                      </p>
                      <p className="text-xs text-gray-500">
                        Resets at: {new Date(usageLimit.resetTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Subtitle */}
                <p className="text-center text-gray-600">
                  Enter an URL address and get a Free Website Analysis!
                </p>

                {/* Usage Warning */}
                {showUsageWarning && usageLimit.remaining <= 1 && usageLimit.remaining > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-yellow-800 font-medium">Almost at your daily limit!</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      You have {usageLimit.remaining} analysis remaining. Your limit will reset at {new Date(usageLimit.resetTime).toLocaleString()}.
                    </p>
                    <button
                      onClick={() => setShowUsageWarning(false)}
                      className="mt-2 text-xs text-yellow-600 hover:text-yellow-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* New Analysis Button - shown after results */}
                {analysisResult && (
                  <div className="text-center">
                    <button
                      onClick={resetAnalysis}
                      className="inline-flex items-center px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                    >
                      🔄 New Analysis
                    </button>
                  </div>
                )}

                {/* Enhanced Analysis Progress */}
                {loading && (
                  <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                    <div className="text-center mb-6">
                      <div className="text-lg font-medium text-gray-700 mb-3">
                        {currentStep || 'Preparing analysis...'}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div 
                          className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${analysisProgress}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {analysisProgress}% Complete
                      </div>
                    </div>
                    
                    {/* Animated Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 10 ? 'bg-green-500' : 'bg-gray-300 animate-pulse'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">Fetching Content</span>
                        </div>
                        {analysisProgress >= 10 && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 40 ? 'bg-green-500' : 
                            analysisProgress >= 10 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">Technical SEO Check</span>
                        </div>
                        {analysisProgress >= 40 && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 70 && !pageSpeedLoading ? 'bg-green-500' : 
                            analysisProgress >= 40 || pageSpeedLoading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">
                            PageSpeed Analysis {pageSpeedLoading ? '(Both Desktop & Mobile)' : ''}
                          </span>
                        </div>
                        {analysisProgress >= 70 && !pageSpeedLoading && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 100 ? 'bg-green-500' : 
                            analysisProgress >= 70 ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">Generating Report</span>
                        </div>
                        {analysisProgress >= 100 && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Results Section */}
      {/* Floating PDF Button - Desktop (Right side) */}
      {analysisResult && isReportVisible && (
        <div className="hidden sm:block fixed right-4 sm:right-6 lg:right-8 xl:right-12 top-1/2 transform -translate-y-1/2 z-50">
          <button
            onClick={handleDownloadPDF}
            className="bg-red-600 text-white px-4 py-3 rounded-xl shadow-2xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-red-500/25 border border-red-500 animate-fade-in"
            disabled={downloadingPDF}
            title="Download PDF Report"
          >
            {downloadingPDF ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-medium">PDF</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <span className="text-xs font-medium">PDF</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Floating PDF Button - Mobile (Parallel to Scroll to Top but on Right) */}
      {analysisResult && (
        <div className="sm:hidden fixed bottom-8 right-4 z-[100]">
          <button
            onClick={handleDownloadPDF}
            className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full shadow-lg border border-red-700 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={downloadingPDF}
            title="Download PDF Report"
            aria-label="Download PDF Report"
            type="button"
          >
            {downloadingPDF ? (
              <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {analysisResult && (
        <section id="seo-report-section" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="space-y-8">

                {/* Complete Report Display - Works for both regular and shared reports */}
                {/* Overall Score Dashboard */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden p-4">
                      {/* Top Row: Title and Score */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-lg font-bold">SEO Analysis Report</h2>
                          </div>
                        </div>
                        
                        {/* Compact Score Display */}
                        <div className="relative">
                          <div className="w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                              <circle
                                cx="60" cy="60" r="45"
                                stroke={analysisResult.overallScore >= 80 ? '#22c55e' : 
                                       analysisResult.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="8" fill="none" strokeLinecap="round"
                                strokeDasharray={`${(analysisResult.overallScore / 100) * 283} 283`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{analysisResult.overallScore}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* URL Row */}
                      <div className="mb-4 bg-white/10 rounded-lg p-3">
                        <div className="flex items-center text-slate-200 text-xs mb-2">
                          <svg className="w-3 h-3 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="truncate" title={analysisResult.url}>{analysisResult.url}</span>
                        </div>
                        
                        {/* Analysis Summary - Mobile */}
                        <div className="grid grid-cols-2 gap-2 text-slate-300 text-xs">
                          <div className="flex items-center">
                            <svg className="w-2 h-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date().toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-2 h-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {Object.values(analysisResult.factors).reduce((acc, section) => acc + section.checks.length, 0)} factors
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-green-500/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-300">
                            {Object.values(analysisResult.factors).reduce((acc, section) => 
                              acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)}
                          </div>
                          <div className="text-xs text-green-200">Passed</div>
                        </div>
                        <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-yellow-300">
                            {Object.values(analysisResult.factors).reduce((acc, section) => 
                              acc + section.checks.filter(c => c.status === 'warning').length, 0)}
                          </div>
                          <div className="text-xs text-yellow-200">Warnings</div>
                        </div>
                        <div className="bg-red-500/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-red-300">
                            {Object.values(analysisResult.factors).reduce((acc, section) => 
                              acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)}
                          </div>
                          <div className="text-xs text-red-200">Critical</div>
                        </div>
                      </div>
                      
                      {/* Priority Actions - Mobile */}
                      {Object.values(analysisResult.factors).some(section => 
                        section.checks.some(c => c.status === 'critical' || c.status === 'error')
                      ) && (
                        <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                          <div className="flex items-start">
                            <svg className="w-3 h-3 text-red-300 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                              <h4 className="text-red-200 font-medium text-xs">Critical Issues Found</h4>
                              <p className="text-red-300 text-xs mt-1">
                                Address critical issues first to improve your SEO score
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="mt-4 text-center">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                          analysisResult.overallScore >= 80 ? 'bg-green-500 text-white' :
                          analysisResult.overallScore >= 60 ? 'bg-yellow-500 text-black' :
                          'bg-red-500 text-white'
                        }`}>
                          {analysisResult.overallScore >= 80 ? '🌟 Excellent Performance' :
                           analysisResult.overallScore >= 60 ? '👍 Good Performance' : '⚠️ Needs Improvement'}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:block p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start mb-6">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-3xl font-bold mb-2">SEO Analysis Report</h2>
                              <div className="flex items-center text-slate-200 text-sm mb-3">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span className="truncate" title={analysisResult.url}>{analysisResult.url}</span>
                              </div>
                              
                              {/* Analysis Summary */}
                              <div className="flex items-center text-slate-300 text-xs space-x-4 mb-4">
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Analyzed {new Date().toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {Object.values(analysisResult.factors).reduce((acc, section) => acc + section.checks.length, 0)} factors checked
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                  {Object.keys(analysisResult.factors).length} categories
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Status Grid */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center text-green-300 text-sm font-medium mb-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    Passed
                                  </div>
                                  <div className="text-2xl font-bold text-white">
                                    {Object.values(analysisResult.factors).reduce((acc, section) => 
                                      acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)}
                                  </div>
                                </div>
                                <svg className="w-8 h-8 text-green-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center text-yellow-300 text-sm font-medium mb-1">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                    Warnings
                                  </div>
                                  <div className="text-2xl font-bold text-white">
                                    {Object.values(analysisResult.factors).reduce((acc, section) => 
                                      acc + section.checks.filter(c => c.status === 'warning').length, 0)}
                                  </div>
                                </div>
                                <svg className="w-8 h-8 text-yellow-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center text-red-300 text-sm font-medium mb-1">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                    Critical
                                  </div>
                                  <div className="text-2xl font-bold text-white">
                                    {Object.values(analysisResult.factors).reduce((acc, section) => 
                                      acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)}
                                  </div>
                                </div>
                                <svg className="w-8 h-8 text-red-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          {/* Priority Actions */}
                          {Object.values(analysisResult.factors).some(section => 
                            section.checks.some(c => c.status === 'critical' || c.status === 'error')
                          ) && (
                            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
                              <div className="flex items-start">
                                <svg className="w-4 h-4 text-red-300 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                  <h4 className="text-red-200 font-medium text-sm">Critical Issues Found</h4>
                                  <p className="text-red-300 text-xs mt-1">
                                    Address critical issues first to improve your SEO score significantly
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Overall Score Circle - Desktop */}
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                              <circle
                                cx="60" cy="60" r="45"
                                stroke={analysisResult.overallScore >= 80 ? '#22c55e' : 
                                       analysisResult.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="8" fill="none" strokeLinecap="round"
                                strokeDasharray={`${(analysisResult.overallScore / 100) * 283} 283`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">{analysisResult.overallScore}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center space-y-2">
                            <div className="text-sm text-slate-200">Overall Score</div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              analysisResult.overallScore >= 80 ? 'bg-green-500 text-white' :
                              analysisResult.overallScore >= 60 ? 'bg-yellow-500 text-black' :
                              'bg-red-500 text-white'
                            }`}>
                              {analysisResult.overallScore >= 80 ? 'Excellent' :
                               analysisResult.overallScore >= 60 ? 'Good' : 'Needs Work'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Scores Grid */}
                  <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Performance Breakdown by Category
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(analysisResult.factors).map(([key, section]) => {
                        const titles: { [key: string]: string } = {
                          contentQuality: 'Content Quality',
                          technicalSEO: 'Technical SEO',
                          onPageElements: 'On-Page Elements',
                          userExperience: 'User Experience',
                          contentStructure: 'Content Structure',
                          socialOptimization: 'Social Optimization',
                          localSEO: 'Local SEO',
                          advancedAnalytics: 'Advanced Analytics',
                          securityAndTrust: 'Security & Trust',
                          advancedPerformance: 'Advanced Performance',
                          advancedTechnical: 'Advanced Technical',
                          modernSEO: 'Modern SEO & AI'
                        }
                        
                        const icons: { [key: string]: React.ReactNode } = {
                          contentQuality: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                          technicalSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                          onPageElements: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
                          userExperience: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                          contentStructure: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" /></svg>,
                          socialOptimization: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
                          localSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                          advancedAnalytics: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        }
                        
                        const percentage = Math.round((section.score / section.maxScore) * 100)
                        const getColorClass = (score: number) => {
                          if (score >= 80) return 'from-green-500 to-emerald-600 text-green-600 bg-green-50 border-green-200'
                          if (score >= 60) return 'from-blue-500 to-indigo-600 text-blue-600 bg-blue-50 border-blue-200'
                          if (score >= 40) return 'from-yellow-500 to-orange-600 text-yellow-600 bg-yellow-50 border-yellow-200'
                          return 'from-red-500 to-pink-600 text-red-600 bg-red-50 border-red-200'
                        }
                        
                        // Map factor keys to tab IDs
                        const factorToTabMap: { [key: string]: string } = {
                          contentQuality: 'content',
                          technicalSEO: 'technical',
                          onPageElements: 'onpage',
                          userExperience: 'ux',
                          contentStructure: 'structure',
                          socialOptimization: 'social',
                          localSEO: 'local',
                          advancedAnalytics: 'analytics',
                          securityAndTrust: 'security',
                          advancedPerformance: 'performance',
                          advancedTechnical: 'advtech',
                          modernSEO: 'modern'
                        }
                        
                        return (
                          <button 
                            key={key} 
                            onClick={() => handleCardClick(factorToTabMap[key] || 'overview')}
                            className={`group w-full text-left bg-white rounded-xl shadow-md border-2 ${getColorClass(percentage).split(' ').slice(-2).join(' ')} p-6 transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-opacity-80 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 cursor-pointer active:scale-100 active:translate-y-0`}
                            aria-label={`View detailed ${titles[key]} report`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(percentage).split(' ').slice(-4, -2).join(' ')}`}>
                                {icons[key]}
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${getColorClass(percentage).split(' ')[2]}`}>
                                  {percentage}%
                                </div>
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-2">{titles[key]}</h4>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{section.score}/{section.maxScore}</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(percentage).split(' ').slice(0, 2).join(' ')} transition-all duration-700 ease-out`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                {section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length} passed
                              </span>
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                                {section.checks.filter(c => c.status === 'critical' || c.status === 'error').length} issues
                              </span>
                            </div>
                            
                            {/* Click indicator */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center text-xs text-gray-400 group-hover:text-blue-600 transition-colors">
                              <span className="mr-1">Click for detailed report</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    
                    {/* Quick Insights */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Top Priority</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          {(() => {
                            const lowestSection = Object.entries(analysisResult.factors)
                              .sort((a, b) => (a[1].score / a[1].maxScore) - (b[1].score / b[1].maxScore))[0]
                            const titles: { [key: string]: string } = {
                              contentQuality: 'Content Quality',
                              technicalSEO: 'Technical SEO',
                              onPageElements: 'On-Page Elements',
                              userExperience: 'User Experience',
                              contentStructure: 'Content Structure',
                              socialOptimization: 'Social Optimization',
                              localSEO: 'Local SEO',
                              advancedAnalytics: 'Advanced Analytics',
                              securityAndTrust: 'Security & Trust',
                              advancedPerformance: 'Advanced Performance',
                              advancedTechnical: 'Advanced Technical',
                              modernSEO: 'Modern SEO & AI',
                              securityAndTrust: 'Security & Trust',
                              advancedPerformance: 'Advanced Performance',
                              advancedTechnical: 'Advanced Technical',
                              modernSEO: 'Modern SEO & AI'
                            }
                            return `Focus on improving ${titles[lowestSection[0]]} for maximum SEO impact.`
                          })()}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Strengths</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          {(() => {
                            const highestSection = Object.entries(analysisResult.factors)
                              .sort((a, b) => (b[1].score / b[1].maxScore) - (a[1].score / a[1].maxScore))[0]
                            const titles: { [key: string]: string } = {
                              contentQuality: 'Content Quality',
                              technicalSEO: 'Technical SEO',
                              onPageElements: 'On-Page Elements',
                              userExperience: 'User Experience',
                              contentStructure: 'Content Structure',
                              socialOptimization: 'Social Optimization',
                              localSEO: 'Local SEO',
                              advancedAnalytics: 'Advanced Analytics',
                              securityAndTrust: 'Security & Trust',
                              advancedPerformance: 'Advanced Performance',
                              advancedTechnical: 'Advanced Technical',
                              modernSEO: 'Modern SEO & AI'
                            }
                            return `${titles[highestSection[0]]} is performing well and supports your SEO strategy.`
                          })()}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Potential</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          With focused improvements, your SEO score could reach {Math.min(100, analysisResult.overallScore + 25)}/100, significantly boosting organic visibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div id="detailed-results" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Desktop Tabs */}
                  <div className="hidden lg:block">
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {/* Tabs arranged in balanced grid */}
                      <div className="grid grid-cols-7 gap-0.5 bg-gray-200">
                        {/* First 7 tabs */}
                        {[
                          { id: 'overview', label: 'Overview', icon: '📊', count: '' },
                          { id: 'content', label: 'Content', icon: '📝', count: `${analysisResult.factors.contentQuality.score}` },
                          { id: 'technical', label: 'Technical', icon: '⚙️', count: `${analysisResult.factors.technicalSEO.score}` },
                          { id: 'onpage', label: 'On-Page', icon: '🎯', count: `${analysisResult.factors.onPageElements.score}` },
                          { id: 'ux', label: 'Experience', icon: '👥', count: `${analysisResult.factors.userExperience.score}` },
                          { id: 'structure', label: 'Structure', icon: '🏗️', count: `${analysisResult.factors.contentStructure.score}` },
                          { id: 'social', label: 'Social', icon: '📱', count: `${analysisResult.factors.socialOptimization.score}` }
                        ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => { setActiveTab(tab.id); setActiveFilter('all'); }}
                          className={`relative px-2 py-3 text-center transition-all duration-200 bg-white hover:bg-gray-50 ${
                            activeTab === tab.id
                              ? 'bg-primary/5 border-2 border-primary text-primary shadow-sm'
                              : 'text-gray-600 border-2 border-transparent hover:text-gray-900'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-base">{tab.icon}</span>
                            <span className="text-xs font-semibold leading-tight">{tab.label}</span>
                            {tab.count && (
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                activeTab === tab.id 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {tab.count}
                              </span>
                            )}
                          </div>
                        </button>
                        ))}
                      </div>
                      
                      {/* Second row with 6 tabs */}
                      <div className="grid grid-cols-6 gap-0.5 bg-gray-200 border-t border-gray-300">
                        {[
                          { id: 'local', label: 'Local SEO', icon: '📍', count: `${analysisResult.factors.localSEO.score}` },
                          { id: 'analytics', label: 'Analytics', icon: '📈', count: `${analysisResult.factors.advancedAnalytics.score}` },
                          { id: 'security', label: 'Security', icon: '🔒', count: `${analysisResult.factors.securityAndTrust.score}` },
                          { id: 'performance', label: 'Performance', icon: '⚡', count: `${analysisResult.factors.advancedPerformance.score}` },
                          { id: 'advtech', label: 'Advanced', icon: '🔧', count: `${analysisResult.factors.advancedTechnical.score}` },
                          { id: 'modern', label: 'AI & Modern', icon: '🤖', count: `${analysisResult.factors.modernSEO.score}` }
                        ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => { setActiveTab(tab.id); setActiveFilter('all'); }}
                          className={`relative px-2 py-3 text-center transition-all duration-200 bg-white hover:bg-gray-50 ${
                            activeTab === tab.id
                              ? 'bg-primary/5 border-2 border-primary text-primary shadow-sm'
                              : 'text-gray-600 border-2 border-transparent hover:text-gray-900'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-base">{tab.icon}</span>
                            <span className="text-xs font-semibold leading-tight">{tab.label}</span>
                            {tab.count && (
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                activeTab === tab.id 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {tab.count}
                              </span>
                            )}
                          </div>
                        </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Tablet Tabs */}
                  <div className="lg:hidden">
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'overview', label: 'Overview', icon: '📊', count: '' },
                          { id: 'content', label: 'Content', icon: '📝', count: `${analysisResult.factors.contentQuality.score}` },
                          { id: 'technical', label: 'Technical', icon: '⚙️', count: `${analysisResult.factors.technicalSEO.score}` },
                          { id: 'onpage', label: 'On-Page', icon: '🎯', count: `${analysisResult.factors.onPageElements.score}` },
                          { id: 'ux', label: 'Experience', icon: '👥', count: `${analysisResult.factors.userExperience.score}` },
                          { id: 'structure', label: 'Structure', icon: '🏗️', count: `${analysisResult.factors.contentStructure.score}` },
                          { id: 'social', label: 'Social', icon: '📱', count: `${analysisResult.factors.socialOptimization.score}` },
                          { id: 'local', label: 'Local', icon: '📍', count: `${analysisResult.factors.localSEO.score}` },
                          { id: 'analytics', label: 'Analytics', icon: '📈', count: `${analysisResult.factors.advancedAnalytics.score}` },
                          { id: 'security', label: 'Security', icon: '🔒', count: `${analysisResult.factors.securityAndTrust.score}` },
                          { id: 'performance', label: 'Performance', icon: '⚡', count: `${analysisResult.factors.advancedPerformance.score}` },
                          { id: 'advtech', label: 'Advanced', icon: '🔧', count: `${analysisResult.factors.advancedTechnical.score}` },
                          { id: 'modern', label: 'AI & Modern', icon: '🤖', count: `${analysisResult.factors.modernSEO.score}` }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setActiveFilter('all'); }}
                            className={`px-3 py-3 rounded-lg text-center transition-all duration-200 ${
                              activeTab === tab.id
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <span className="text-sm">{tab.icon}</span>
                              <span className="text-xs font-medium">{tab.label}</span>
                              {tab.count && (
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                  activeTab === tab.id 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {tab.count}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Tab Indicator */}
                  <div className="hidden lg:block bg-white px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm">
                            {(() => {
                              const currentTab = [
                                { id: 'overview', icon: '📊' },
                                { id: 'content', icon: '📝' },
                                { id: 'technical', icon: '⚙️' },
                                { id: 'onpage', icon: '🎯' },
                                { id: 'ux', icon: '👥' },
                                { id: 'structure', icon: '🏗️' },
                                { id: 'social', icon: '📱' },
                                { id: 'local', icon: '📍' },
                                { id: 'analytics', icon: '📈' }
                              ].find(tab => tab.id === activeTab)
                              return currentTab?.icon || '📊'
                            })()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {(() => {
                              const titles: { [key: string]: string } = {
                                overview: 'Analysis Overview',
                                content: 'Content Quality Analysis',
                                technical: 'Technical SEO Analysis',
                                onpage: 'On-Page Elements Analysis',
                                ux: 'User Experience Analysis',
                                structure: 'Content Structure Analysis',
                                social: 'Social Optimization Analysis',
                                local: 'Local SEO Analysis',
                                analytics: 'Advanced Analytics',
                                security: 'Security & Trust Analysis',
                                performance: 'Performance Optimization Analysis',
                                advtech: 'Advanced Technical Analysis',
                                modern: 'Modern SEO & AI Analysis'
                              }
                              return titles[activeTab] || 'Analysis Overview'
                            })()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {activeTab === 'overview' 
                              ? 'Complete overview of your SEO performance across all categories'
                              : `Detailed analysis and recommendations for ${activeTab} optimization`}
                          </p>
                        </div>
                      </div>
                      
                      {activeTab !== 'overview' && (
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            (() => {
                              const factorKey = {
                                content: 'contentQuality',
                                technical: 'technicalSEO',
                                onpage: 'onPageElements',
                                ux: 'userExperience',
                                structure: 'contentStructure',
                                social: 'socialOptimization',
                                local: 'localSEO',
                                analytics: 'advancedAnalytics'
                              }[activeTab as keyof typeof factorKey]
                              
                              if (!factorKey) return 'bg-gray-100 text-gray-700'
                              
                              const section = analysisResult.factors[factorKey as keyof typeof analysisResult.factors]
                              if (!section) return 'bg-gray-100 text-gray-700'
                              
                              const percentage = Math.round((section.score / section.maxScore) * 100)
                              if (percentage >= 80) return 'bg-green-100 text-green-700'
                              if (percentage >= 60) return 'bg-blue-100 text-blue-700'
                              if (percentage >= 40) return 'bg-yellow-100 text-yellow-700'
                              return 'bg-red-100 text-red-700'
                            })()
                          }`}>
                            {(() => {
                              const factorKey = {
                                content: 'contentQuality',
                                technical: 'technicalSEO',
                                onpage: 'onPageElements',
                                ux: 'userExperience',
                                structure: 'contentStructure',
                                social: 'socialOptimization',
                                local: 'localSEO',
                                analytics: 'advancedAnalytics'
                              }[activeTab as keyof typeof factorKey]
                              
                              if (!factorKey) return '0'
                              
                              const section = analysisResult.factors[factorKey as keyof typeof analysisResult.factors]
                              if (!section) return '0'
                              
                              return Math.round((section.score / section.maxScore) * 100)
                            })()}% Score
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {/* Core Web Vitals Section */}
                      {analysisResult.pageSpeed && (
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="w-7 h-7 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Page Speed & Core Web Vitals
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <CoreWebVitalsCard
                              title="Desktop Performance"
                              score={analysisResult.pageSpeed.desktop.score}
                              coreWebVitals={analysisResult.pageSpeed.desktop.coreWebVitals}
                              device="desktop"
                            />
                            <CoreWebVitalsCard
                              title="Mobile Performance"
                              score={analysisResult.pageSpeed.mobile.score}
                              coreWebVitals={analysisResult.pageSpeed.mobile.coreWebVitals}
                              device="mobile"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* SEO Metrics Overview */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <svg className="w-7 h-7 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          SEO Factors Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(analysisResult.factors).map(([key, section]) => {
                            const titles: { [key: string]: string } = {
                              contentQuality: 'Content Quality',
                              technicalSEO: 'Technical SEO',
                              onPageElements: 'On-Page Elements',
                              userExperience: 'User Experience',
                              contentStructure: 'Content Structure',
                              socialOptimization: 'Social Optimization',
                              localSEO: 'Local SEO',
                              advancedAnalytics: 'Advanced Analytics',
                              securityAndTrust: 'Security & Trust',
                              advancedPerformance: 'Advanced Performance',
                              advancedTechnical: 'Advanced Technical',
                              modernSEO: 'Modern SEO & AI',
                              securityAndTrust: 'Security & Trust',
                              advancedPerformance: 'Advanced Performance',
                              advancedTechnical: 'Advanced Technical',
                              modernSEO: 'Modern SEO & AI'
                            }
                            
                            const icons: { [key: string]: React.ReactNode } = {
                              contentQuality: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                              technicalSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                              onPageElements: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
                              userExperience: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                              contentStructure: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" /></svg>,
                              socialOptimization: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
                              localSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                              advancedAnalytics: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                              securityAndTrust: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                              advancedPerformance: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                              advancedTechnical: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" /></svg>,
                              modernSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            }
                            
                            const getStatus = (score: number, maxScore: number) => {
                              const percentage = (score / maxScore) * 100
                              if (percentage >= 90) return 'excellent'
                              if (percentage >= 75) return 'good'
                              if (percentage >= 50) return 'warning'
                              return 'error'
                            }
                            
                            const getStatusDetails = (section: AnalysisSection) => {
                              const goodChecks = section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length
                              const totalChecks = section.checks.length
                              return [`${goodChecks}/${totalChecks} checks passed`, `${section.checks.filter(c => c.status === 'critical' || c.status === 'error').length} issues found`]
                            }
                            
                            const getRecommendations = (section: AnalysisSection) => {
                              return section.checks
                                .filter(c => c.status === 'critical' || c.status === 'error' || c.status === 'warning')
                                .slice(0, 3)
                                .map(c => `Fix ${c.factor.toLowerCase()}`)
                            }
                            
                            return (
                              <SEOMetricCard
                                key={key}
                                title={titles[key]}
                                score={section.score}
                                maxScore={section.maxScore}
                                status={getStatus(section.score, section.maxScore)}
                                icon={icons[key]}
                                description={`Analysis of ${titles[key].toLowerCase()} factors and optimization opportunities.`}
                                details={getStatusDetails(section)}
                                recommendations={getRecommendations(section)}
                              />
                            )
                          })}
                        </div>
                      </div>
                      
                      {/* Overall Summary */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          📊 Analysis Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Top Performing Areas</h4>
                            <div className="space-y-2">
                              {Object.entries(analysisResult.factors)
                                .sort((a, b) => b[1].score - a[1].score)
                                .slice(0, 3)
                                .map(([key, section]) => {
                                  const titles: { [key: string]: string } = {
                                    contentQuality: 'Content Quality',
                                    technicalSEO: 'Technical SEO',
                                    onPageElements: 'On-Page Elements',
                                    userExperience: 'User Experience',
                                    contentStructure: 'Content Structure',
                                    socialOptimization: 'Social Optimization',
                                    localSEO: 'Local SEO',
                                    advancedAnalytics: 'Advanced Analytics'
                                  }
                                  return (
                                    <div key={key} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                      <span className="text-sm font-medium text-gray-900">{titles[key]}</span>
                                      <span className="text-sm font-bold text-green-600">{section.score}/{section.maxScore}</span>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                            <div className="space-y-2">
                              {Object.entries(analysisResult.factors)
                                .sort((a, b) => a[1].score - b[1].score)
                                .slice(0, 3)
                                .map(([key, section]) => {
                                  const titles: { [key: string]: string } = {
                                    contentQuality: 'Content Quality',
                                    technicalSEO: 'Technical SEO',
                                    onPageElements: 'On-Page Elements',
                                    userExperience: 'User Experience',
                                    contentStructure: 'Content Structure',
                                    socialOptimization: 'Social Optimization',
                                    localSEO: 'Local SEO',
                                    advancedAnalytics: 'Advanced Analytics'
                                  }
                                  return (
                                    <div key={key} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                                      <span className="text-sm font-medium text-gray-900">{titles[key]}</span>
                                      <span className="text-sm font-bold text-yellow-600">{section.score}/{section.maxScore}</span>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'content' && renderAnalysisSection('Content Quality Analysis', analysisResult.factors.contentQuality)}
                  {activeTab === 'technical' && renderAnalysisSection('Technical SEO Analysis', analysisResult.factors.technicalSEO)}
                  {activeTab === 'onpage' && renderAnalysisSection('On-Page Elements Analysis', analysisResult.factors.onPageElements)}
                  {activeTab === 'ux' && renderAnalysisSection('User Experience Analysis', analysisResult.factors.userExperience)}
                  {activeTab === 'structure' && renderAnalysisSection('Content Structure Analysis', analysisResult.factors.contentStructure)}
                  {activeTab === 'social' && renderAnalysisSection('Social Optimization Analysis', analysisResult.factors.socialOptimization)}
                  {activeTab === 'local' && renderAnalysisSection('Local SEO Analysis', analysisResult.factors.localSEO)}
                  {activeTab === 'analytics' && renderAnalysisSection('Advanced Analytics', analysisResult.factors.advancedAnalytics)}
                  {activeTab === 'security' && renderAnalysisSection('Security & Trust Analysis', analysisResult.factors.securityAndTrust)}
                  {activeTab === 'performance' && renderAnalysisSection('Performance Optimization Analysis', analysisResult.factors.advancedPerformance)}
                  {activeTab === 'advtech' && renderAnalysisSection('Advanced Technical Analysis', analysisResult.factors.advancedTechnical)}
                  {activeTab === 'modern' && renderAnalysisSection('Modern SEO & AI Analysis', analysisResult.factors.modernSEO)}
                </div>

                {/* Export Options */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Analysis Complete</h3>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={handleDownloadPDF}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={downloadingPDF}
                    >
                      {downloadingPDF ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📊</span>
                          Download PDF Report
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleDownloadCSV}
                      className="hidden"
                      disabled={true}
                    >
                      {downloadingCSV ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Exporting...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📈</span>
                          Export to CSV - DISABLED
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleEmailReport}
                      className="hidden"
                      disabled={true}
                    >
                      {emailingReport ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📧</span>
                          Email Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Tool Breadcrumb */}
      <ToolBreadcrumb toolName="On-Page SEO Analyzer" toolSlug="on-page-seo-analyzer" />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Professional SEO Analysis Tool
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Advanced On-Page SEO Analyzer
              </span>
              <br />
              <span className="text-primary">Complete Website Analysis with 150+ Factors</span>
            </h1>
            
            <div className="max-w-6xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What is an On-Page SEO Analyzer?</h2>
              <p>
                An <strong>on-page SEO analyzer</strong> is a comprehensive tool that evaluates all optimization elements directly on your web pages that influence search engine rankings. Unlike off-page factors like backlinks, on-page SEO focuses on what you can control: your content, HTML structure, meta tags, images, internal links, and technical elements.
              </p>
              <p>
                Our advanced analyzer examines <strong>150+ critical ranking factors</strong> including content quality, keyword optimization, Core Web Vitals, mobile responsiveness, structured data, accessibility, and security. Get instant, actionable insights to improve your search visibility, user experience, and organic traffic with data-driven recommendations tailored to your website.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                150+ SEO Factors
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Core Web Vitals
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Real PageSpeed Data
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Analyze Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Analyze Your Website?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Enter your website URL above to get a comprehensive SEO analysis with actionable insights and detailed recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">150+ SEO Factors</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive analysis covering content, technical SEO, Core Web Vitals, and more
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">Actionable Insights</h3>
                <p className="text-sm text-gray-600">
                  Get specific recommendations and step-by-step optimization guidance
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Latest 2025 Standards</h3>
                <p className="text-sm text-gray-600">
                  Analysis based on current Google algorithm and ranking factors
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Scoring</h3>
                <p className="text-sm text-gray-600">
                  Clear scoring system with priorities and impact assessment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is On-Page SEO Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              What is On-Page SEO Analysis and Why It Matters in 2025
            </h2>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  On-page SEO analysis is the comprehensive evaluation of all elements on your website that impact search engine rankings. 
                  In 2025, this includes traditional factors like content quality and meta tags, as well as modern considerations like 
                  Core Web Vitals, E-A-T signals, and AI-driven content analysis.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Our 2025 On-Page SEO Analysis Covers:</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Content Quality & E-A-T</span>
                        <p className="text-sm text-gray-600">Expertise, authoritativeness, trustworthiness analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Core Web Vitals</span>
                        <p className="text-sm text-gray-600">LCP, INP, CLS performance metrics</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Technical SEO Audit</span>
                        <p className="text-sm text-gray-600">HTTPS, mobile-friendliness, structured data</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">On-Page Optimization</span>
                        <p className="text-sm text-gray-600">Title tags, meta descriptions, headers, URLs</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">User Experience Analysis</span>
                        <p className="text-sm text-gray-600">Navigation, accessibility, design quality</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Social Media Optimization</span>
                        <p className="text-sm text-gray-600">Open Graph, Twitter Cards, social sharing</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Advanced Analytics</span>
                        <p className="text-sm text-gray-600">Search intent, SERP features, voice search readiness</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Local SEO Factors</span>
                        <p className="text-sm text-gray-600">NAP consistency, local schema, geo-targeting</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <p className="text-gray-700 text-center">
                    <span className="font-semibold">Why it matters:</span> Proper on-page SEO can improve your search rankings by 25-50% 
                    and significantly boost organic traffic, user engagement, and conversion rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Advanced Features That Make Our Tool Stand Out
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                  <div className="text-3xl mb-4">🔬</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">150+ SEO Factors</h3>
                  <p className="text-gray-600">
                    Most comprehensive analysis available covering every aspect of on-page SEO optimization
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                  <div className="text-3xl mb-4">⚡</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Core Web Vitals Analysis</h3>
                  <p className="text-gray-600">
                    Real-time analysis of Google's Core Web Vitals with specific optimization recommendations
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                  <div className="text-3xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">AI-Powered Insights</h3>
                  <p className="text-gray-600">
                    Advanced AI analysis for content quality, E-A-T signals, and search intent matching
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 text-center">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Visual Score Dashboard</h3>
                  <p className="text-gray-600">
                    Clear, color-coded scoring system with detailed breakdowns for each SEO category
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 text-center">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Actionable Recommendations</h3>
                  <p className="text-gray-600">
                    Specific, prioritized recommendations with step-by-step implementation guidance
                  </p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 text-center">
                  <div className="text-3xl mb-4">📈</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">2025 Algorithm Ready</h3>
                  <p className="text-gray-600">
                    Analysis based on the latest Google algorithm updates and ranking factors for 2025
                  </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Factors Analysis Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Complete Guide: 150+ SEO Factors We Analyze
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Meta Tags & Title Optimization */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-blue-800 flex items-center">
                  <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">📝</span>
                  </span>
                  Meta Tags & Title Optimization
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-blue-600 mr-1 mt-0.5">✓</span><span><strong>Title Tag Length</strong> - Optimal 30-65 characters</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-1 mt-0.5">✓</span><span><strong>Title Power Words</strong> - CTR-improving words</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-1 mt-0.5">✓</span><span><strong>Meta Description</strong> - 120-170 characters optimal</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-1 mt-0.5">✓</span><span><strong>Meta Description CTA</strong> - Call-to-action presence</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-1 mt-0.5">✓</span><span><strong>Meta Keywords</strong> - Legacy tag analysis</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-1 mt-0.5">✓</span><span><strong>Meta Robots</strong> - Index/follow directives</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-1 mt-0.5">✓</span><span><strong>Theme Color Meta</strong> - Mobile browser theming</span></li>
                </ul>
              </div>

              {/* Content Quality & Structure */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-green-800 flex items-center">
                  <span className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">📄</span>
                  </span>
                  Content Quality & Structure
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>Content Length</strong> - Word count analysis (300+ min)</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>Content Depth</strong> - Comprehensiveness scoring</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>Content Uniqueness</strong> - Duplicate content detection</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>Content Freshness</strong> - Date indicators analysis</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>Sentence Length</strong> - Readability optimization</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>Paragraph Structure</strong> - Content organization</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>Reading Difficulty</strong> - Readability scoring</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-1 mt-0.5">✓</span><span><strong>List Usage</strong> - Structured content detection</span></li>
                </ul>
              </div>

              {/* Technical SEO */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-purple-800 flex items-center">
                  <span className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">⚙️</span>
                  </span>
                  Technical SEO
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>HTTPS Protocol</strong> - SSL/TLS security</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>URL Structure</strong> - Clean URL analysis</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>DOCTYPE Declaration</strong> - HTML5 validation</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>Character Encoding</strong> - UTF-8 validation</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>Canonical URL</strong> - Duplicate content prevention</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>HTML5 Semantics</strong> - Semantic markup usage</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>Structured Data</strong> - JSON-LD schema markup</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-1 mt-0.5">✓</span><span><strong>Robots.txt</strong> - Crawling directives</span></li>
                </ul>
              </div>

              {/* Performance Optimization */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-orange-800 flex items-center">
                  <span className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">⚡</span>
                  </span>
                  Performance Optimization
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-orange-600 mr-1 mt-0.5">✓</span><span><strong>CSS Minification</strong> - Code optimization</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-1 mt-0.5">✓</span><span><strong>JS Minification</strong> - JavaScript optimization</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-1 mt-0.5">✓</span><span><strong>Image Lazy Loading</strong> - Performance enhancement</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-1 mt-0.5">✓</span><span><strong>Modern Image Formats</strong> - WebP/AVIF usage</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-1 mt-0.5">✓</span><span><strong>Content Compression</strong> - GZIP/Brotli detection</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-1 mt-0.5">✓</span><span><strong>Browser Caching</strong> - Cache headers analysis</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-1 mt-0.5">✓</span><span><strong>Core Web Vitals</strong> - Google performance metrics</span></li>
                </ul>
              </div>

              {/* Social Media & Open Graph */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-teal-800 flex items-center">
                  <span className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">📱</span>
                  </span>
                  Social Media & Open Graph
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-teal-600 mr-1 mt-0.5">✓</span><span><strong>OG Title</strong> - Social media title optimization</span></li>
                  <li className="flex items-start"><span className="text-teal-600 mr-1 mt-0.5">✓</span><span><strong>OG Description</strong> - Social sharing descriptions</span></li>
                  <li className="flex items-start"><span className="text-teal-600 mr-1 mt-0.5">✓</span><span><strong>OG Image</strong> - Social media preview images</span></li>
                  <li className="flex items-start"><span className="text-teal-600 mr-1 mt-0.5">✓</span><span><strong>Twitter Cards</strong> - Twitter-specific optimization</span></li>
                  <li className="flex items-start"><span className="text-teal-600 mr-1 mt-0.5">✓</span><span><strong>Twitter Title</strong> - Platform-specific titles</span></li>
                  <li className="flex items-start"><span className="text-teal-600 mr-1 mt-0.5">✓</span><span><strong>Twitter Description</strong> - Tweet preview text</span></li>
                  <li className="flex items-start"><span className="text-teal-600 mr-1 mt-0.5">✓</span><span><strong>Twitter Image</strong> - Twitter card images</span></li>
                </ul>
              </div>

              {/* Images & Media */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-pink-800 flex items-center">
                  <span className="w-7 h-7 bg-pink-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">🖼️</span>
                  </span>
                  Images & Media
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-pink-600 mr-1 mt-0.5">✓</span><span><strong>Image Usage</strong> - Visual content analysis</span></li>
                  <li className="flex items-start"><span className="text-pink-600 mr-1 mt-0.5">✓</span><span><strong>Image Alt Text</strong> - Accessibility compliance</span></li>
                  <li className="flex items-start"><span className="text-pink-600 mr-1 mt-0.5">✓</span><span><strong>Image Title Attributes</strong> - Additional image context</span></li>
                  <li className="flex items-start"><span className="text-pink-600 mr-1 mt-0.5">✓</span><span><strong>Image Accessibility</strong> - Overall image SEO</span></li>
                  <li className="flex items-start"><span className="text-pink-600 mr-1 mt-0.5">✓</span><span><strong>Image Size Optimization</strong> - File size analysis</span></li>
                  <li className="flex items-start"><span className="text-pink-600 mr-1 mt-0.5">✓</span><span><strong>Image Format Analysis</strong> - Format optimization</span></li>
                </ul>
              </div>

              {/* Security & Headers */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-red-800 flex items-center">
                  <span className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">🔒</span>
                  </span>
                  Security & Headers
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-red-600 mr-1 mt-0.5">✓</span><span><strong>SSL/TLS Security</strong> - Certificate validation</span></li>
                  <li className="flex items-start"><span className="text-red-600 mr-1 mt-0.5">✓</span><span><strong>Security Headers</strong> - HTTP security headers</span></li>
                  <li className="flex items-start"><span className="text-red-600 mr-1 mt-0.5">✓</span><span><strong>Content Security Policy</strong> - CSP implementation</span></li>
                  <li className="flex items-start"><span className="text-red-600 mr-1 mt-0.5">✓</span><span><strong>Mixed Content</strong> - HTTPS compliance</span></li>
                  <li className="flex items-start"><span className="text-red-600 mr-1 mt-0.5">✓</span><span><strong>Security Features</strong> - Overall security assessment</span></li>
                </ul>
              </div>

              {/* Mobile & User Experience */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-indigo-800 flex items-center">
                  <span className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">📱</span>
                  </span>
                  Mobile & User Experience
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-indigo-600 mr-1 mt-0.5">✓</span><span><strong>Mobile Viewport</strong> - Responsive design validation</span></li>
                  <li className="flex items-start"><span className="text-indigo-600 mr-1 mt-0.5">✓</span><span><strong>Responsive Design</strong> - Mobile-friendly assessment</span></li>
                  <li className="flex items-start"><span className="text-indigo-600 mr-1 mt-0.5">✓</span><span><strong>Touch Elements</strong> - Mobile interaction optimization</span></li>
                  <li className="flex items-start"><span className="text-indigo-600 mr-1 mt-0.5">✓</span><span><strong>Apple Mobile Web App</strong> - iOS optimization</span></li>
                  <li className="flex items-start"><span className="text-indigo-600 mr-1 mt-0.5">✓</span><span><strong>Theme Color</strong> - Mobile browser theming</span></li>
                </ul>
              </div>

              {/* Structured Data & Schema */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-yellow-800 flex items-center">
                  <span className="w-7 h-7 bg-yellow-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">🏗️</span>
                  </span>
                  Structured Data & Schema
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-yellow-600 mr-1 mt-0.5">✓</span><span><strong>Local Schema Markup</strong> - Business schema validation</span></li>
                  <li className="flex items-start"><span className="text-yellow-600 mr-1 mt-0.5">✓</span><span><strong>Semantic SEO</strong> - Topic authority analysis</span></li>
                  <li className="flex items-start"><span className="text-yellow-600 mr-1 mt-0.5">✓</span><span><strong>Featured Snippet Optimization</strong> - SERP feature targeting</span></li>
                  <li className="flex items-start"><span className="text-yellow-600 mr-1 mt-0.5">✓</span><span><strong>Structured Data Detection</strong> - JSON-LD analysis</span></li>
                </ul>
              </div>

              {/* Internal & External Links */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <span className="w-7 h-7 bg-gray-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">🔗</span>
                  </span>
                  Internal & External Links
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-gray-600 mr-1 mt-0.5">✓</span><span><strong>Internal Links</strong> - Site architecture analysis</span></li>
                  <li className="flex items-start"><span className="text-gray-600 mr-1 mt-0.5">✓</span><span><strong>Internal Navigation</strong> - Link structure assessment</span></li>
                  <li className="flex items-start"><span className="text-gray-600 mr-1 mt-0.5">✓</span><span><strong>External Links</strong> - Outbound link analysis</span></li>
                  <li className="flex items-start"><span className="text-gray-600 mr-1 mt-0.5">✓</span><span><strong>External Link Security</strong> - Link safety validation</span></li>
                  <li className="flex items-start"><span className="text-gray-600 mr-1 mt-0.5">✓</span><span><strong>NoFollow Links</strong> - Link attribute analysis</span></li>
                  <li className="flex items-start"><span className="text-gray-600 mr-1 mt-0.5">✓</span><span><strong>Link Equity Management</strong> - Link juice distribution</span></li>
                </ul>
              </div>

              {/* Accessibility */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-emerald-800 flex items-center">
                  <span className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">♿</span>
                  </span>
                  Accessibility
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-emerald-600 mr-1 mt-0.5">✓</span><span><strong>ARIA Labels</strong> - Accessibility markup</span></li>
                  <li className="flex items-start"><span className="text-emerald-600 mr-1 mt-0.5">✓</span><span><strong>Form Accessibility</strong> - Form label compliance</span></li>
                  <li className="flex items-start"><span className="text-emerald-600 mr-1 mt-0.5">✓</span><span><strong>Language Declaration</strong> - International accessibility</span></li>
                </ul>
              </div>

              {/* Local SEO */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-amber-800 flex items-center">
                  <span className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs">📍</span>
                  </span>
                  Local SEO
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start"><span className="text-amber-600 mr-1 mt-0.5">✓</span><span><strong>Address Information</strong> - Local business data</span></li>
                  <li className="flex items-start"><span className="text-amber-600 mr-1 mt-0.5">✓</span><span><strong>Contact Phone</strong> - Phone number validation</span></li>
                  <li className="flex items-start"><span className="text-amber-600 mr-1 mt-0.5">✓</span><span><strong>Click-to-Call</strong> - Mobile functionality</span></li>
                  <li className="flex items-start"><span className="text-amber-600 mr-1 mt-0.5">✓</span><span><strong>Business Hours</strong> - Operating hours display</span></li>
                  <li className="flex items-start"><span className="text-amber-600 mr-1 mt-0.5">✓</span><span><strong>Service Area</strong> - Geographic coverage</span></li>
                  <li className="flex items-start"><span className="text-amber-600 mr-1 mt-0.5">✓</span><span><strong>Local Keywords</strong> - Location-based optimization</span></li>
                  <li className="flex items-start"><span className="text-amber-600 mr-1 mt-0.5">✓</span><span><strong>Map Integration</strong> - Google Maps embedding</span></li>
                </ul>
              </div>

            </div>

            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Why These Factors Matter</h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-6xl mx-auto">
                  Google uses over 200 ranking factors to determine search positions. Our tool analyzes the most critical on-page elements 
                  that directly impact your rankings. From technical fundamentals like HTTPS and Core Web Vitals to content quality signals 
                  and user experience indicators, each factor contributes to your overall SEO success. By addressing these elements systematically, 
                  you can achieve <span className="font-semibold text-primary">25-50% improvement in search rankings</span> and significantly boost 
                  organic traffic, user engagement, and conversion rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              SEO Shouts vs. Other On-Page SEO Analyzers
            </h2>
            <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Compare our advanced analyzer with other popular tools. See why SEO Shouts provides the most comprehensive and actionable SEO analysis.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 to-blue-600/10 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-primary">SEO Shouts</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">SEOptimer</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Seobility</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Sitechecker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Number of SEO Factors Analyzed</td>
                    <td className="px-6 py-4 text-center text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">150+</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">50+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">70+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">80+</td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Core Web Vitals Analysis</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Real PageSpeed Insights Data</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-lg">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Keyword Density Analysis</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Structured Data Validation</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Mobile UX Analysis</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Local SEO Factors</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-lg">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Accessibility Audit</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Security Analysis</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Detailed How-to-Fix Guides</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-600 text-lg">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">100% Free (No Limits)</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm">Yes</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Limited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Limited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Limited</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold">Legend:</span> <span className="text-green-600 mx-2">✓ = Full support</span>
                  <span className="text-yellow-600 mx-2">~ = Partial support</span>
                  <span className="text-red-600 mx-2">✗ = Not available</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Target Keyword Feature Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              How to Use the Target Keyword Feature for Better Analysis
            </h2>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The <strong>Target Keyword</strong> feature is one of the most powerful aspects of our on-page SEO analyzer. By specifying your target keyword,
                our tool provides keyword-specific analysis that helps you optimize your content for better rankings on that exact search term.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">What the Target Keyword Feature Analyzes:</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-900">Keyword Placement:</span> Checks if your target keyword appears in critical SEO locations including the title tag, meta description, H1 heading, first paragraph, URL, and image alt text.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-900">Keyword Density Analysis:</span> Calculates the keyword density to ensure it's within the optimal 1-3% range. Detects both keyword stuffing (over-optimization) and under-optimization issues.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-900">Keyword Variations & LSI Keywords:</span> Identifies related keywords and semantic variations that support your target keyword, helping you create more comprehensive, topically-relevant content.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-900">Competitive Keyword Insights:</span> Compares your keyword optimization against typical patterns for well-ranking pages, showing where you're ahead or behind competitors.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">How to Get the Best Results:</h3>

              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li><strong>Use Specific Keywords:</strong> Instead of "shoes", use "men's running shoes size 12" for more targeted analysis.</li>
                  <li><strong>Match Search Intent:</strong> Make sure your keyword matches what users are actually searching for when they visit your page.</li>
                  <li><strong>Optimize Iteratively:</strong> Run the analysis, make improvements, then analyze again to see your progress.</li>
                  <li><strong>Focus on Natural Integration:</strong> Don't force keywords. The tool will show you opportunities to naturally include your target keyword.</li>
                  <li><strong>Check Related Keywords:</strong> Review the keyword suggestions to expand your content with semantic variations.</li>
                </ol>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-xl p-6 text-center">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Pro Tip:</span> Always enter your target keyword for the most accurate and actionable SEO analysis.
                Pages optimized for specific keywords rank 67% higher than generic pages according to industry studies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:grid-flow-row-dense">
              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What is on-page SEO and why does it matter?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  On-page SEO refers to all optimization techniques applied directly on your website pages to improve search engine rankings. This includes optimizing content, HTML tags, images, internal links, URL structure, and technical elements. Unlike off-page SEO (backlinks, social signals), on-page factors are completely within your control. Studies show that proper on-page optimization can improve rankings by 25-50% and significantly increase organic traffic, making it one of the most cost-effective SEO strategies available.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Is this on-page SEO analyzer completely free?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Yes, our advanced on-page SEO analyzer is 100% free with no hidden costs, subscriptions, or premium upsells. You get full access to analyze 150+ SEO factors including Core Web Vitals, keyword density, technical SEO, mobile optimization, and detailed recommendations. Unlike other tools that limit features or require paid upgrades, we provide comprehensive analysis without any restrictions. No credit card required, no registration needed, and no analysis limits.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>How accurate is the SEO analysis provided by this tool?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Our analyzer uses real-time data from Google PageSpeed Insights API for Core Web Vitals and performance metrics, ensuring you get the same data Google uses for ranking decisions. We fetch and analyze your actual HTML, CSS, and page structure in real-time. The tool evaluates 150+ ranking factors based on Google's documented best practices and proven SEO principles. Each recommendation is backed by SEO research and aligned with current algorithm updates, making our analysis highly accurate and actionable.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What makes SEO Shouts analyzer better than other tools?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Unlike generic SEO tools that provide surface-level analysis, we examine 150+ specific factors—more than most premium tools. We integrate real Google PageSpeed Insights data, provide detailed how-to-fix guides for each issue, and offer keyword-specific optimization when you enter a target keyword. Our tool analyzes local SEO factors, accessibility compliance, structured data validation, security headers, and modern performance metrics that many competitors ignore. Plus, every recommendation includes implementation guidance, not just "what's wrong" but "exactly how to fix it."
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Can I analyze competitor websites with this tool?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Absolutely! You can analyze any publicly accessible website URL, including your competitors' sites. This is an excellent way to conduct competitive SEO analysis, understand what they're doing right, identify their weaknesses, and discover optimization opportunities for your own site. Many SEO professionals use our tool to benchmark their sites against top-ranking competitors, reverse-engineer successful SEO strategies, and identify content gaps or technical advantages that contribute to higher rankings.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>How often should I run on-page SEO analysis?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  We recommend analyzing your pages at least monthly to monitor SEO health and catch issues early. Additionally, run analysis whenever you make significant changes like redesigns, content updates, template modifications, or after Google algorithm updates. For competitive industries or active content sites, weekly analysis of key pages helps maintain optimal performance. Regular monitoring ensures you catch and fix issues before they impact rankings, and helps you track improvement progress over time.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Do you store or share my website data?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  No, we take privacy seriously. We don't store, save, or share any data from your website analysis. Each analysis is performed in real-time, and results are only displayed to you during your active session. Once you close or refresh the page, all data is cleared. We don't create accounts, track users across sessions, or collect personal information. The only data transmitted is your URL to our analysis engine and to Google's PageSpeed API (which is also temporary and not stored by Google for user tracking purposes).
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What should I do after getting my SEO analysis report?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Start by addressing critical issues first (shown in red), as these have the most significant impact on rankings. Then tackle warnings (yellow), and finally optimize the good items that can be made excellent. Prioritize technical issues like HTTPS, Core Web Vitals, and mobile-friendliness, then move to content optimization (title tags, headings, keyword placement), and finally enhance user experience elements. Make changes incrementally, re-analyze after each major fix, and monitor your ranking improvements over 2-4 weeks.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Tools Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Explore Our Other SEO Tools</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
              </p>
            </div>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">On-Page SEO Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Complete website analysis with 150+ SEO factors and Core Web Vitals.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Analyze keyword density and optimize content for target keywords.</p>
                <a href="/tools/keyword-density-analyzer/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions for better CTR.</p>
                <a href="/tools/meta-tag-optimizer/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a 
                href="/tools/"
                className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🛠️</span>
                Browse All SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">
                All tools are 100% free • No signup required • Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Final Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Complete SEO Analysis Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop guessing what's wrong with your website's SEO. Get a comprehensive analysis of 150+ factors that directly impact your search rankings, user experience, and organic traffic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🔬 Analyze Your Website Now →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>⚡</span>
                <span>Complete analysis in under 60 seconds</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>150+ SEO factors analyzed</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Actionable recommendations included</span>
              </div>
            </div>
            
            <p className="text-sm mt-6 opacity-80">
              <strong>Get professional SEO insights with SEO Shouts' Advanced On-Page Analyzer!</strong>
              <br />
              <em>Trusted by thousands of SEO professionals, marketers, and website owners worldwide for accurate website analysis.</em>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is on-page SEO and why does it matter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "On-page SEO refers to all optimization techniques applied directly on your website pages to improve search engine rankings. This includes optimizing content, HTML tags, images, internal links, URL structure, and technical elements. Unlike off-page SEO (backlinks, social signals), on-page factors are completely within your control. Studies show that proper on-page optimization can improve rankings by 25-50% and significantly increase organic traffic, making it one of the most cost-effective SEO strategies available."
                }
              },
              {
                "@type": "Question",
                "name": "Is this on-page SEO analyzer completely free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our advanced on-page SEO analyzer is 100% free with no hidden costs, subscriptions, or premium upsells. You get full access to analyze 150+ SEO factors including Core Web Vitals, keyword density, technical SEO, mobile optimization, and detailed recommendations. Unlike other tools that limit features or require paid upgrades, we provide comprehensive analysis without any restrictions. No credit card required, no registration needed, and no analysis limits."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate is the SEO analysis provided by this tool?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our analyzer uses real-time data from Google PageSpeed Insights API for Core Web Vitals and performance metrics, ensuring you get the same data Google uses for ranking decisions. We fetch and analyze your actual HTML, CSS, and page structure in real-time. The tool evaluates 150+ ranking factors based on Google's documented best practices and proven SEO principles. Each recommendation is backed by SEO research and aligned with current algorithm updates, making our analysis highly accurate and actionable."
                }
              },
              {
                "@type": "Question",
                "name": "What makes SEO Shouts analyzer better than other tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unlike generic SEO tools that provide surface-level analysis, we examine 150+ specific factors—more than most premium tools. We integrate real Google PageSpeed Insights data, provide detailed how-to-fix guides for each issue, and offer keyword-specific optimization when you enter a target keyword. Our tool analyzes local SEO factors, accessibility compliance, structured data validation, security headers, and modern performance metrics that many competitors ignore. Plus, every recommendation includes implementation guidance, not just what's wrong but exactly how to fix it."
                }
              },
              {
                "@type": "Question",
                "name": "Can I analyze competitor websites with this tool?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! You can analyze any publicly accessible website URL, including your competitors' sites. This is an excellent way to conduct competitive SEO analysis, understand what they're doing right, identify their weaknesses, and discover optimization opportunities for your own site. Many SEO professionals use our tool to benchmark their sites against top-ranking competitors, reverse-engineer successful SEO strategies, and identify content gaps or technical advantages that contribute to higher rankings."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I run on-page SEO analysis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We recommend analyzing your pages at least monthly to monitor SEO health and catch issues early. Additionally, run analysis whenever you make significant changes like redesigns, content updates, template modifications, or after Google algorithm updates. For competitive industries or active content sites, weekly analysis of key pages helps maintain optimal performance. Regular monitoring ensures you catch and fix issues before they impact rankings, and helps you track improvement progress over time."
                }
              },
              {
                "@type": "Question",
                "name": "Do you store or share my website data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, we take privacy seriously. We don't store, save, or share any data from your website analysis. Each analysis is performed in real-time, and results are only displayed to you during your active session. Once you close or refresh the page, all data is cleared. We don't create accounts, track users across sessions, or collect personal information. The only data transmitted is your URL to our analysis engine and to Google's PageSpeed API (which is also temporary and not stored by Google for user tracking purposes)."
                }
              },
              {
                "@type": "Question",
                "name": "What should I do after getting my SEO analysis report?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Start by addressing critical issues first (shown in red), as these have the most significant impact on rankings. Then tackle warnings (yellow), and finally optimize the good items that can be made excellent. Prioritize technical issues like HTTPS, Core Web Vitals, and mobile-friendliness, then move to content optimization (title tags, headings, keyword placement), and finally enhance user experience elements. Make changes incrementally, re-analyze after each major fix, and monitor your ranking improvements over 2-4 weeks."
                }
              }
            ]
          })
        }}
      />

      {/* Tool Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced On-Page SEO Analyzer",
            "description": "Professional on-page SEO analysis tool that analyzes 150+ ranking factors including content quality, technical SEO, Core Web Vitals, user experience, and provides actionable optimization recommendations.",
            "url": "https://seoshouts.com/tools/on-page-seo-analyzer",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "featureList": [
              "150+ SEO factor analysis",
              "Core Web Vitals analysis",
              "Technical SEO audit",
              "Content quality assessment",
              "User experience evaluation",
              "Social optimization check",
              "Local SEO analysis",
              "Advanced analytics review",
              "Actionable recommendations",
              "PageSpeed Insights integration"
            ],
            "screenshot": "https://seoshouts.com/tools/on-page-seo-analyzer/screenshot.jpg"
          })
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seoshouts.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "SEO Tools",
                "item": "https://seoshouts.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "On-Page SEO Analyzer",
                "item": "https://seoshouts.com/tools/on-page-seo-analyzer"
              }
            ]
          })
        }}
      />
    </div>
  )
}