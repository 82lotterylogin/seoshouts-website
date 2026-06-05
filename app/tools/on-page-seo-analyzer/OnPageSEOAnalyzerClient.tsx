'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '@/app/components/ShapeGrid'
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
  const [showModal, setShowModal] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Track report visibility for PDF button — modal is always visible when open
  useEffect(() => {
    setIsReportVisible(showModal)
  }, [showModal])

  // Scroll lock + Escape key when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) setShowModal(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showModal])

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
    setShowModal(false)
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
      setShowModal(true)

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
    type IconEntry = { path: string; color: string }
    const iconMap: Record<string, IconEntry> = {
      excellent: { path: 'M5 13l4 4L19 7', color: '#059669' },
      good:      { path: 'M5 13l4 4L19 7', color: '#2563eb' },
      fair:      { path: 'M5 12h14', color: '#64748b' },
      warning:   { path: 'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', color: '#d97706' },
      critical:  { path: 'M6 18L18 6M6 6l12 12', color: '#dc2626' },
      poor:      { path: 'M6 18L18 6M6 6l12 12', color: '#dc2626' },
      error:     { path: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#dc2626' },
      neutral:   { path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#64748b' },
    }
    const d = iconMap[status] || iconMap.neutral
    return (
      <div style={{ width: 22, height: 22, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg style={{ width: 11, height: 11 }} fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={d.path} />
        </svg>
      </div>
    )
  }

  const renderAnalysisSection = (title: string, section: AnalysisSection) => {
    const percentage = Math.round((section.score / section.maxScore) * 100)
    const excellentChecks = section.checks.filter(c => c.status === 'excellent').length
    const goodChecks = section.checks.filter(c => c.status === 'good').length
    const warningChecks = section.checks.filter(c => c.status === 'warning').length
    const criticalChecks = section.checks.filter(c => c.status === 'critical' || c.status === 'error').length
    const scoreColor = percentage >= 80 ? '#059669' : percentage >= 60 ? '#2563eb' : percentage >= 40 ? '#d97706' : '#dc2626'

    return (
      <div style={{ border: '1px solid var(--line)', background: 'var(--white)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {/* Header */}
        <div style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--line)', padding: '1rem 1.25rem', borderLeft: `4px solid ${scoreColor}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-0.02em', margin: 0, marginBottom: '0.5rem' }}>{title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669' }}>
                  <span style={{ width: 6, height: 6, background: '#059669', display: 'inline-block', flexShrink: 0 }} />
                  {excellentChecks + goodChecks} Passed
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706' }}>
                  <span style={{ width: 6, height: 6, background: '#d97706', display: 'inline-block', flexShrink: 0 }} />
                  {warningChecks} Warnings
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}>
                  <span style={{ width: 6, height: 6, background: '#dc2626', display: 'inline-block', flexShrink: 0 }} />
                  {criticalChecks} Critical
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: scoreColor, letterSpacing: '-0.04em', lineHeight: 1 }}>{percentage}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray-5)', marginTop: 2 }}>{section.score}/{section.maxScore} pts</div>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', height: 3, background: 'var(--line)', width: '100%' }}>
            <div style={{ height: '100%', background: scoreColor, width: `${Math.min(percentage, 100)}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ padding: '0.75rem 1.25rem', background: 'var(--white)', borderBottom: '1px solid var(--line)', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {([
            { id: 'all' as const, label: `All Factors (${section.checks.length})`, activeColor: 'var(--ink)' },
            { id: 'passed' as const, label: `Passed (${excellentChecks + goodChecks})`, activeColor: '#059669' },
            { id: 'warnings' as const, label: `Warnings (${warningChecks})`, activeColor: '#d97706' },
            { id: 'critical' as const, label: `Critical (${criticalChecks})`, activeColor: '#dc2626' },
          ]).map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              style={{
                padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${activeFilter === btn.id ? btn.activeColor : 'var(--line)'}`,
                background: activeFilter === btn.id ? btn.activeColor : 'var(--white)',
                color: activeFilter === btn.id ? 'white' : 'var(--gray-5)',
                transition: 'all 0.15s ease',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Checks List */}
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {(() => {
              let filteredChecks = section.checks
              if (activeFilter === 'passed') filteredChecks = section.checks.filter(c => c.status === 'excellent' || c.status === 'good')
              else if (activeFilter === 'warnings') filteredChecks = section.checks.filter(c => c.status === 'warning')
              else if (activeFilter === 'critical') filteredChecks = section.checks.filter(c => c.status === 'critical' || c.status === 'error')

              if (filteredChecks.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-5)' }}>
                    <svg style={{ width: 32, height: 32, margin: '0 auto 0.75rem', opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>No factors found</p>
                    <p style={{ fontSize: '0.75rem' }}>
                      {activeFilter === 'passed' ? 'No passed factors in this category.' :
                       activeFilter === 'warnings' ? 'No warning factors in this category.' :
                       'No critical factors in this category.'}
                    </p>
                  </div>
                )
              }

              return filteredChecks.map((check, index) => {
                const statusColor =
                  check.status === 'excellent' ? '#059669' :
                  check.status === 'good' ? '#2563eb' :
                  check.status === 'warning' ? '#d97706' :
                  (check.status === 'critical' || check.status === 'error') ? '#dc2626' :
                  '#64748b'
                const statusLabel =
                  check.status === 'excellent' ? 'Excellent' :
                  check.status === 'good' ? 'Good' :
                  check.status === 'warning' ? 'Needs Attention' :
                  check.status === 'critical' ? 'Critical' :
                  check.status === 'error' ? 'Error' : 'Info'

                return (
                  <div key={index} style={{ borderTop: `1px solid ${statusColor}22`, borderRight: `1px solid ${statusColor}22`, borderBottom: `1px solid ${statusColor}22`, borderLeft: `3px solid ${statusColor}`, background: `${statusColor}08`, padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                          {getStatusIcon(check.status)}
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>{check.factor}</span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', background: statusColor, color: 'white', flexShrink: 0 }}>
                            {statusLabel}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: statusColor === '#64748b' ? 'var(--gray-5)' : statusColor, lineHeight: 1.55, marginBottom: '0.375rem' }}>
                          {check.description}
                        </p>

                        {check.recommendation && (
                          <div style={{ marginTop: '0.625rem', padding: '0.625rem 0.75rem', background: 'rgba(37,99,235,0.05)', borderLeft: '2px solid var(--blue)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <div style={{ width: 16, height: 16, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <svg style={{ width: 8, height: 8 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <div>
                                <h5 style={{ margin: 0, marginBottom: 3, fontSize: '0.68rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommendation</h5>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--ink)', lineHeight: 1.5 }}>{check.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {check.technicalDetails && (
                          <div style={{ marginTop: '0.5rem', padding: '0.625rem 0.75rem', background: 'var(--gray-1)', borderLeft: '2px solid var(--line)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <div style={{ width: 16, height: 16, background: 'var(--gray-5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <svg style={{ width: 8, height: 8 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              </div>
                              <div>
                                <h5 style={{ margin: 0, marginBottom: 3, fontSize: '0.68rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technical Details</h5>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>{check.technicalDetails}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {check.howToFix && check.howToFix.length > 0 && (
                          <div style={{ marginTop: '0.5rem', padding: '0.625rem 0.75rem', background: 'rgba(5,150,105,0.05)', borderLeft: '2px solid #059669' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <div style={{ width: 16, height: 16, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <svg style={{ width: 8, height: 8 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h5 style={{ margin: 0, marginBottom: 4, fontSize: '0.68rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How to Fix</h5>
                                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  {check.howToFix.map((step, stepIndex) => (
                                    <li key={stepIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                                      <span style={{ width: 4, height: 4, background: '#059669', flexShrink: 0, marginTop: '0.45rem', display: 'inline-block' }} />
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
                          <div style={{ marginTop: '0.75rem', border: '1px solid var(--line)', overflow: 'hidden' }}>
                            <div style={{ padding: '0.625rem 0.875rem', background: 'var(--ink)', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <h5 style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <svg style={{ width: 12, height: 12, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Keyword Analysis Report
                              </h5>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.375rem', marginTop: '0.375rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)' }}>
                                <span><strong style={{ color: 'rgba(255,255,255,0.9)' }}>1-Word:</strong> {check.keywordData.singleWords || 0}</span>
                                <span><strong style={{ color: 'rgba(255,255,255,0.9)' }}>2-Word:</strong> {check.keywordData.bigrams || 0}</span>
                                <span><strong style={{ color: 'rgba(255,255,255,0.9)' }}>3-Word:</strong> {check.keywordData.trigrams || 0}</span>
                                <span><strong style={{ color: 'rgba(255,255,255,0.9)' }}>Diversity:</strong> {check.keywordData.keywordDiversityScore.toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="hidden lg:block" style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', fontSize: '0.72rem', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--line)' }}>
                                    {['#','Keyword/Phrase','Type','Count','Density','Visibility','Found In'].map(h => (
                                      <th key={h} style={{ padding: '0.375rem 0.625rem', textAlign: ['Count','Density','Visibility','#'].includes(h)?'center':'left', fontWeight: 700, color: 'var(--ink)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {check.keywordData.topKeywords.map((keyword, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? 'var(--white)' : 'var(--gray-1)' }}>
                                      <td style={{ padding: '0.375rem 0.625rem', textAlign: 'center', fontWeight: 700, color: 'var(--blue)' }}>{keyword.rank}</td>
                                      <td style={{ padding: '0.375rem 0.625rem', fontWeight: 600, color: 'var(--ink)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{keyword.keyword}</td>
                                      <td style={{ padding: '0.375rem 0.625rem', textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', background: keyword.type==='1-word'?'rgba(37,99,235,0.1)':keyword.type==='2-word'?'rgba(5,150,105,0.1)':'rgba(124,58,237,0.1)', color: keyword.type==='1-word'?'#2563eb':keyword.type==='2-word'?'#059669':'#7c3aed' }}>{keyword.type}</span>
                                      </td>
                                      <td style={{ padding: '0.375rem 0.625rem', textAlign: 'center', color: 'var(--gray-5)' }}>{keyword.frequency}</td>
                                      <td style={{ padding: '0.375rem 0.625rem', textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', background: parseFloat(keyword.density)>5?'rgba(220,38,38,0.1)':parseFloat(keyword.density)>=0.5?'rgba(5,150,105,0.1)':'rgba(217,119,6,0.1)', color: parseFloat(keyword.density)>5?'#dc2626':parseFloat(keyword.density)>=0.5?'#059669':'#d97706' }}>{keyword.density}%</span>
                                      </td>
                                      <td style={{ padding: '0.375rem 0.625rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                                          <div style={{ width: 40, height: 3, background: 'var(--line)' }}><div style={{ height: '100%', background: 'var(--blue)', width: `${keyword.visibility}%` }} /></div>
                                          <span style={{ color: 'var(--gray-5)', fontSize: '0.65rem' }}>{keyword.visibility}%</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: '0.375rem 0.625rem' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                                          {keyword.positions.map((position, posIdx) => (
                                            <span key={posIdx} style={{ fontSize: '0.6rem', fontWeight: 600, padding: '1px 4px', background: 'rgba(37,99,235,0.08)', color: 'var(--blue)' }}>{position}</span>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="lg:hidden">
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem' }}>
                                {check.keywordData.topKeywords.map((keyword, idx) => (
                                  <div key={idx} style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '0.625rem 0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--blue)' }}>#{keyword.rank}</span>
                                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '1px 4px', background: keyword.type==='1-word'?'rgba(37,99,235,0.1)':keyword.type==='2-word'?'rgba(5,150,105,0.1)':'rgba(124,58,237,0.1)', color: keyword.type==='1-word'?'#2563eb':keyword.type==='2-word'?'#059669':'#7c3aed' }}>{keyword.type}</span>
                                    </div>
                                    <p style={{ margin: 0, marginBottom: '0.375rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{keyword.keyword}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', fontSize: '0.72rem' }}>
                                      <div><span style={{ color: 'var(--gray-5)' }}>Count:</span> <strong style={{ color: 'var(--ink)' }}>{keyword.frequency}</strong></div>
                                      <div><span style={{ color: 'var(--gray-5)' }}>Density: </span><span style={{ fontWeight: 700, padding: '1px 4px', background: parseFloat(keyword.density)>5?'rgba(220,38,38,0.1)':parseFloat(keyword.density)>=0.5?'rgba(5,150,105,0.1)':'rgba(217,119,6,0.1)', color: parseFloat(keyword.density)>5?'#dc2626':parseFloat(keyword.density)>=0.5?'#059669':'#d97706' }}>{keyword.density}%</span></div>
                                    </div>
                                    <div style={{ marginTop: '0.375rem' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--gray-5)', marginBottom: '0.2rem' }}>
                                        <span>Visibility</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{keyword.visibility}%</span>
                                      </div>
                                      <div style={{ height: 3, background: 'var(--line)' }}><div style={{ height: '100%', background: 'var(--blue)', width: `${keyword.visibility}%`, transition: 'width 0.5s ease' }} /></div>
                                    </div>
                                    {keyword.positions && keyword.positions.length > 0 && (
                                      <div style={{ marginTop: '0.375rem' }}>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--gray-5)', marginBottom: '0.2rem' }}>Found in:</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                                          {keyword.positions.map((position, posIdx) => (
                                            <span key={posIdx} style={{ fontSize: '0.6rem', fontWeight: 600, padding: '1px 4px', background: 'rgba(37,99,235,0.08)', color: 'var(--blue)' }}>{position}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {(check.keywordData.overOptimizedKeywords.length > 0 || check.keywordData.underOptimizedKeywords.length > 0) && (
                              <div style={{ padding: '0.625rem 0.875rem', borderTop: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                                {check.keywordData.overOptimizedKeywords.length > 0 && (
                                  <div style={{ marginBottom: '0.375rem' }}>
                                    <h6 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <span style={{ width: 6, height: 6, background: '#dc2626', display: 'inline-block' }} />
                                      Over-optimized (&gt;5% density)
                                    </h6>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                                      {check.keywordData.overOptimizedKeywords.map((kw, idx) => (
                                        <span key={idx} style={{ fontSize: '0.65rem', fontWeight: 600, padding: '1px 5px', background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>{kw.word} ({kw.density}%)</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {check.keywordData.underOptimizedKeywords.length > 0 && (
                                  <div>
                                    <h6 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <span style={{ width: 6, height: 6, background: '#d97706', display: 'inline-block' }} />
                                      Under-optimized (&lt;0.5% density)
                                    </h6>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                                      {check.keywordData.underOptimizedKeywords.map((kw, idx) => (
                                        <span key={idx} style={{ fontSize: '0.65rem', fontWeight: 600, padding: '1px 5px', background: 'rgba(217,119,6,0.08)', color: '#d97706' }}>{kw.word} ({kw.density}%)</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Heading Hierarchy */}
                        {check.headingData && check.headingData.totalCount > 0 && (
                          <div style={{ marginTop: '0.75rem', border: '1px solid var(--line)', overflow: 'hidden' }}>
                            <div style={{ padding: '0.625rem 0.875rem', background: 'var(--ink)', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <h5 style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <svg style={{ width: 12, height: 12, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                Heading Structure Analysis
                              </h5>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', marginTop: '0.375rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)' }}>
                                <span><strong style={{ color: 'rgba(255,255,255,0.9)' }}>Total:</strong> {check.headingData.totalCount}</span>
                                <span><strong style={{ color: 'rgba(255,255,255,0.9)' }}>Score:</strong> {check.headingData.hierarchyScore}/10</span>
                              </div>
                            </div>
                            <div style={{ padding: '0.75rem 0.875rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['h1','h2','h3','h4','h5','h6'].map((level) => {
                                  const headings = check.headingData?.[level as keyof typeof check.headingData] as string[]
                                  if (!headings || headings.length === 0) return null
                                  const lvlColors: {[k:string]:string} = { h1:'#dc2626',h2:'#2563eb',h3:'#059669',h4:'#d97706',h5:'#7c3aed',h6:'#64748b' }
                                  const lvlColor = lvlColors[level] || '#64748b'
                                  return (
                                    <div key={level} style={{ borderLeft: `3px solid ${lvlColor}`, paddingLeft: '0.75rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', background: lvlColor, color: 'white' }}>{level.toUpperCase()}</span>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink)' }}>{headings.length} heading{headings.length !== 1 ? 's' : ''}</span>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        {headings.map((heading, idx) => {
                                          const isOptimal = level === 'h1' ? heading.length >= 30 && heading.length <= 60 : heading.length >= 20 && heading.length <= 70
                                          const isTooLong = heading.length > (level === 'h1' ? 60 : 70)
                                          const lengthColor = isOptimal ? '#059669' : isTooLong ? '#dc2626' : '#d97706'
                                          const lengthLabel = isOptimal ? 'Optimal' : isTooLong ? 'Too Long' : 'Too Short'
                                          return (
                                            <div key={idx} style={{ background: 'var(--gray-1)', border: '1px solid var(--line)', padding: '0.375rem 0.5rem' }}>
                                              <p style={{ margin: 0, marginBottom: '0.2rem', fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.45, wordBreak: 'break-word' }}>
                                                {heading.length > 80 ? `${heading.substring(0, 80)}...` : heading}
                                              </p>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: 'var(--gray-5)' }}>
                                                <span>{heading.length} chars</span>
                                                <span style={{ fontWeight: 700, padding: '1px 4px', background: `${lengthColor}15`, color: lengthColor }}>{lengthLabel}</span>
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              {check.headingData.issues && check.headingData.issues.length > 0 && (
                                <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(217,119,6,0.06)', borderLeft: '2px solid #d97706' }}>
                                  <h6 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <svg style={{ width: 10, height: 10 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                    Structure Issues
                                  </h6>
                                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                    {check.headingData.issues.map((issue, idx) => (
                                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.72rem', color: '#d97706', lineHeight: 1.45 }}>
                                        <span style={{ width: 4, height: 4, background: '#d97706', flexShrink: 0, marginTop: '0.35rem', display: 'inline-block' }} />
                                        {issue}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {check.impact && (
                          <div style={{ marginTop: '0.5rem', padding: '0.375rem 0.625rem', background: 'rgba(37,99,235,0.05)', borderLeft: '2px solid var(--blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>SEO Impact:</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--ink)', lineHeight: 1.4 }}>{check.impact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            })()}
          </div>

          {/* Priority Actions */}
          {(criticalChecks > 0 || warningChecks > 0) && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
              <h4 style={{ margin: 0, marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 18, height: 18, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: 9, height: 9 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                Priority Actions
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.5rem' }}>
                {section.checks.filter(c => c.status === 'critical' || c.status === 'error').slice(0, 4).map((check, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem 0.75rem', background: 'rgba(220,38,38,0.05)', borderLeft: '2px solid #dc2626' }}>
                    <div style={{ width: 18, height: 18, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 800 }}>{index + 1}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.78rem' }}>Fix {check.factor}</span>
                      <p style={{ margin: 0, marginTop: 2, fontSize: '0.68rem', color: 'var(--gray-5)' }}>High impact on SEO performance</p>
                    </div>
                  </div>
                ))}
                {section.checks.filter(c => c.status === 'warning').slice(0, Math.max(0, 4 - criticalChecks)).map((check, index) => (
                  <div key={index + criticalChecks} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem 0.75rem', background: 'rgba(217,119,6,0.05)', borderLeft: '2px solid #d97706' }}>
                    <div style={{ width: 18, height: 18, background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 800 }}>{index + criticalChecks + 1}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.78rem' }}>Improve {check.factor}</span>
                      <p style={{ margin: 0, marginTop: 2, fontSize: '0.68rem', color: 'var(--gray-5)' }}>Moderate impact on SEO performance</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>

      {/* ── HERO ── */}
      <section className="tool-hero">
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.35)', zIndex: 0 }} />
        <ShapeGrid borderColor="rgba(37,99,235,0.18)" squareSize={48} speed={0.4} hoverFillColor="rgba(37,99,235,0.12)" />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>On-Page SEO Analyzer</span>
          </nav>
          <div className="tool-hero-badge">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Professional SEO Analysis Tool
          </div>
          <h1 className="tool-hero-h1">
            Advanced On-Page SEO Analyzer<br />
            <span>Complete Website Analysis with 150+ Factors</span>
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.75rem' }}>
            {['150+ SEO Factors', 'Core Web Vitals', 'Real PageSpeed Data', '100% Free'].map(pill => (
              <div key={pill} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(37,99,235,0.35)', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue)', flexShrink: 0, display: 'inline-block' }} />
                {pill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOL INPUT ── */}
      <section className="tool-input-section">
        <div className="tool-input-inner">
          <div className="tool-box" style={{ maxWidth: '860px' }}>
            <h2 className="tool-box-heading">Free Website Page SEO Checker</h2>
            <p className="tool-box-sub">Enter an URL address and get a Free Website Analysis!</p>

            {/* URL and Keyword Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="tool-box-label">Website URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Example.com"
                  className="tool-url-input"
                />
              </div>
              <div>
                <label className="tool-box-label">Target Keyword (Optional)</label>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="Target Keyword (Optional)"
                  className="tool-url-input"
                />
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="tool-captcha">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                onChange={handleCaptchaChange}
                theme="light"
              />
            </div>

            {/* Usage Limit Info */}
            {!loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0.75rem 0', fontSize: '0.82rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: usageLimit.remaining > 2 ? 'var(--green)' : usageLimit.remaining > 0 ? 'var(--amber)' : 'var(--red)', flexShrink: 0 }} />
                <span style={{ color: 'var(--gray-4)' }}>
                  {usageLimit.remaining} of {usageLimit.totalLimit} free analyses remaining today
                </span>
              </div>
            )}

            {/* Audit Button */}
            <button
              onClick={analyzeWebsite}
              disabled={!url || !isVerified || loading || !usageLimit.canUse}
              className="tool-analyze-btn"
            >
              {loading ? (
                <>
                  <div className="tool-analyze-btn-dot" style={{ animation: 'pulse 1s infinite' }} />
                  Analyzing...
                </>
              ) : !usageLimit.canUse ? (
                'Daily Limit Reached'
              ) : (
                'Audit'
              )}
            </button>

            {!usageLimit.canUse && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--red)', marginBottom: '4px' }}>
                  You&apos;ve reached your daily limit of {usageLimit.totalLimit} free analyses.
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-4)' }}>
                  Resets at: {new Date(usageLimit.resetTime).toLocaleString()}
                </p>
              </div>
            )}

            {/* Usage Warning */}
            {showUsageWarning && usageLimit.remaining <= 1 && usageLimit.remaining > 0 && (
              <div style={{ background: 'var(--blue-pale)', borderTop: '1px solid var(--blue-mid)', borderRight: '1px solid var(--blue-mid)', borderBottom: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--amber)', padding: '1rem 1.25rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--amber)', flexShrink: 0 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--blue-dark)' }}>Almost at your daily limit!</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', lineHeight: 1.6 }}>
                  You have {usageLimit.remaining} analysis remaining. Your limit will reset at {new Date(usageLimit.resetTime).toLocaleString()}.
                </p>
                <button
                  onClick={() => setShowUsageWarning(false)}
                  style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div style={{ background: '#fef2f2', borderTop: '1px solid #fecaca', borderRight: '1px solid #fecaca', borderBottom: '1px solid #fecaca', borderLeft: '4px solid var(--red)', padding: '0.875rem 1.25rem', marginTop: '1rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width={16} height={16} viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--red)', flexShrink: 0, marginTop: '2px' }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>{error}</span>
              </div>
            )}

            {/* New Analysis Button - shown after results */}
            {analysisResult && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={resetAnalysis}
                  style={{ background: 'var(--gray-2)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: '0.875rem', fontWeight: 600, padding: '10px 20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
                  </svg>
                  New Analysis
                </button>
              </div>
            )}

            {/* Enhanced Analysis Progress */}
            {loading && (
              <div style={{ marginTop: '1.5rem', background: 'var(--gray-1)', border: '1px solid var(--line)', padding: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
                    {currentStep || 'Preparing analysis...'}
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--gray-2)', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ height: '100%', background: 'var(--blue)', width: `${analysisProgress}%`, transition: 'width 0.3s ease-out' }} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-4)' }}>{analysisProgress}% Complete</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { label: 'Fetching Content', threshold: 10 },
                    { label: 'Technical SEO Check', threshold: 40 },
                    { label: `PageSpeed Analysis${pageSpeedLoading ? ' (Desktop & Mobile)' : ''}`, threshold: 70 },
                    { label: 'Generating Report', threshold: 100 },
                  ].map(({ label, threshold }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1px solid var(--line)', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: analysisProgress >= threshold ? 'var(--green)' : 'var(--gray-3)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink)' }}>{label}</span>
                      </div>
                      {analysisProgress >= threshold && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--green)', fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {showModal && analysisResult && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.85)' }}>
          <style>{`.seo-modal-inner * { border-radius: 0 !important; }`}</style>

          {/* Modal top bar */}
          <div style={{ background: 'var(--ink)', color: 'var(--white)', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: 19, height: 19 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>SEO Analysis Report</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: 2, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{analysisResult.url}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.84rem', color: 'rgba(255,255,255,0.5)' }} className="hidden sm:flex">
                <span>Analyzed {new Date().toLocaleDateString()}</span>
                <span>·</span>
                <span>{Object.values(analysisResult.factors).reduce((acc, s) => acc + s.checks.length, 0)} factors checked</span>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0 0.875rem', height: 34, background: '#dc2626', color: 'white', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none', cursor: downloadingPDF ? 'not-allowed' : 'pointer', flexShrink: 0, fontSize: '0.78rem', fontWeight: 700, opacity: downloadingPDF ? 0.7 : 1 }}
                title="Download PDF Report"
              >
                {downloadingPDF ? (
                  <svg style={{ width: 14, height: 14 }} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                ) : (
                  <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>
                )}
                <span>{downloadingPDF ? 'Generating...' : 'PDF'}</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, background: 'rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.18)', borderRight: '1px solid rgba(255,255,255,0.18)', borderBottom: '1px solid rgba(255,255,255,0.18)', borderLeft: '1px solid rgba(255,255,255,0.18)', color: 'white', cursor: 'pointer', flexShrink: 0 }}
                title="Close report"
              >
                <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Two-panel body */}
          <div className="seo-modal-inner" id="seo-report-section" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* ── LEFT PANEL ── */}
            <div style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--line)', background: 'var(--white)' }}>

              {/* Score block */}
              <div style={{ background: 'var(--ink)', color: 'white', padding: '1rem', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.18)" strokeWidth="10" fill="none" />
                      <circle cx="60" cy="60" r="45"
                        stroke={analysisResult.overallScore >= 80 ? '#22c55e' : analysisResult.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="10" fill="none" strokeLinecap="round"
                        strokeDasharray={`${(analysisResult.overallScore / 100) * 283} 283`}
                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.04em' }}>{analysisResult.overallScore}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overall Score</div>
                    <div style={{ display: 'inline-block', fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', background: analysisResult.overallScore >= 80 ? '#22c55e' : analysisResult.overallScore >= 60 ? '#f59e0b' : '#ef4444', color: (analysisResult.overallScore >= 60 && analysisResult.overallScore < 80) ? '#000' : '#fff' }}>
                      {analysisResult.overallScore >= 80 ? 'Excellent' : analysisResult.overallScore >= 60 ? 'Good' : 'Needs Work'}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.375rem' }}>
                  {[
                    { label: 'Passed', count: Object.values(analysisResult.factors).reduce((a,s)=>a+s.checks.filter(c=>c.status==='excellent'||c.status==='good').length,0), bg:'rgba(34,197,94,0.18)', border:'rgba(34,197,94,0.3)', color:'#86efac' },
                    { label: 'Warnings', count: Object.values(analysisResult.factors).reduce((a,s)=>a+s.checks.filter(c=>c.status==='warning').length,0), bg:'rgba(245,158,11,0.18)', border:'rgba(245,158,11,0.3)', color:'#fcd34d' },
                    { label: 'Critical', count: Object.values(analysisResult.factors).reduce((a,s)=>a+s.checks.filter(c=>c.status==='critical'||c.status==='error').length,0), bg:'rgba(239,68,68,0.18)', border:'rgba(239,68,68,0.3)', color:'#fca5a5' }
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, padding: '0.375rem 0.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.count}</div>
                      <div style={{ fontSize: '0.58rem', color: s.color, marginTop: 2, opacity: 0.85 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {Object.values(analysisResult.factors).some(s=>s.checks.some(c=>c.status==='critical'||c.status==='error')) && (
                  <div style={{ marginTop: '0.625rem', background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.375rem 0.625rem', display: 'flex', gap: '0.375rem', alignItems: 'flex-start' }}>
                    <svg style={{ width: 11, height: 11, color: '#fca5a5', flexShrink: 0, marginTop: 1 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    <span style={{ fontSize: '0.62rem', color: '#fca5a5', lineHeight: 1.4 }}>Critical issues found — address these first</span>
                  </div>
                )}
              </div>

              {/* Category list */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ padding: '0.5rem 0.75rem', background: 'var(--gray-1)', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '0.375rem', position: 'sticky', top: 0, zIndex: 1 }}>
                  <div style={{ width: 20, height: 20, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 11, height: 11 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Categories</span>
                </div>

                {/* Overview row */}
                <button onClick={() => { setActiveTab('overview'); setActiveFilter('all'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', width: '100%', textAlign: 'left', background: activeTab==='overview' ? 'rgba(37,99,235,0.07)' : 'transparent', borderLeft: activeTab==='overview' ? '2px solid var(--blue)' : '2px solid transparent', borderBottom: '1px solid var(--line)', cursor: 'pointer', borderTop: 'none', borderRight: 'none' }}>
                  <svg style={{ width:15, height:15, flexShrink:0, color: activeTab==='overview'?'var(--blue)':'var(--gray-5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18 M7 16v2 M12 8v10 M17 4v14" /></svg>
                  <span style={{ fontSize: '0.84rem', fontWeight: activeTab==='overview'?700:500, color: activeTab==='overview'?'var(--blue)':'var(--ink)' }}>Overview</span>
                </button>

                {/* 12 category rows */}
                {(() => {
                  const catTitles: {[k:string]:string} = { contentQuality:'Content Quality', technicalSEO:'Technical SEO', onPageElements:'On-Page Elements', userExperience:'User Experience', contentStructure:'Content Structure', socialOptimization:'Social', localSEO:'Local SEO', advancedAnalytics:'Analytics', securityAndTrust:'Security & Trust', advancedPerformance:'Performance', advancedTechnical:'Adv. Technical', modernSEO:'AI & Modern' }
                  const f2tab: {[k:string]:string} = { contentQuality:'content', technicalSEO:'technical', onPageElements:'onpage', userExperience:'ux', contentStructure:'structure', socialOptimization:'social', localSEO:'local', advancedAnalytics:'analytics', securityAndTrust:'security', advancedPerformance:'performance', advancedTechnical:'advtech', modernSEO:'modern' }
                  return Object.entries(analysisResult.factors).map(([key, section]) => {
                    const pct = Math.round((section.score / section.maxScore) * 100)
                    const tabId = f2tab[key] || 'overview'
                    const isActive = activeTab === tabId
                    const sc = pct >= 80 ? '#22c55e' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#ef4444'
                    return (
                      <button key={key} onClick={() => { setActiveTab(tabId); setActiveFilter('all'); }} style={{ display: 'flex', flexDirection: 'column', padding: '0.45rem 0.75rem', width: '100%', textAlign: 'left', background: isActive ? 'rgba(37,99,235,0.06)' : 'transparent', borderLeft: `2px solid ${isActive ? sc : 'transparent'}`, borderBottom: '1px solid var(--line)', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: isActive?700:500, color: isActive?'var(--ink)':'var(--gray-5)' }}>{catTitles[key]}</span>
                          <span style={{ fontSize: '0.79rem', fontWeight: 700, color: sc }}>{pct}%</span>
                        </div>
                        <div style={{ height: 2, background: 'var(--line)', width: '100%' }}>
                          <div style={{ height: '100%', background: sc, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.18rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>✓ {section.checks.filter(c=>c.status==='excellent'||c.status==='good').length}</span>
                          <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>✗ {section.checks.filter(c=>c.status==='critical'||c.status==='error').length}</span>
                        </div>
                      </button>
                    )
                  })
                })()}
              </div>

            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--gray-1)', minWidth: 0 }}>

              {/* Tab bar — unified grid, fills 100% width, no empty space */}
              <div style={{ flexShrink: 0, borderBottom: '1px solid var(--line)' }}>
                {(() => {
                  const tabs = [
                    { id:'overview',     label:'Overview',   short:'Overview',  path:'M3 3v18h18 M7 16v2 M12 8v10 M17 4v14',                                                                                                   count:'' },
                    { id:'content',      label:'Content',    short:'Content',   path:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',                count:`${analysisResult.factors.contentQuality.score}` },
                    { id:'technical',    label:'Technical',  short:'Tech',      path:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', count:`${analysisResult.factors.technicalSEO.score}` },
                    { id:'onpage',       label:'On-Page',    short:'On-Page',   path:'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',         count:`${analysisResult.factors.onPageElements.score}` },
                    { id:'ux',           label:'UX',         short:'UX',        path:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', count:`${analysisResult.factors.userExperience.score}` },
                    { id:'structure',    label:'Structure',  short:'Struct',    path:'M4 6h16M4 10h16M4 14h16M4 18h16',                                                                                                         count:`${analysisResult.factors.contentStructure.score}` },
                    { id:'social',       label:'Social',     short:'Social',    path:'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z', count:`${analysisResult.factors.socialOptimization.score}` },
                    { id:'local',        label:'Local',      short:'Local',     path:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',                   count:`${analysisResult.factors.localSEO.score}` },
                    { id:'analytics',    label:'Analytics',  short:'Analytics', path:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', count:`${analysisResult.factors.advancedAnalytics.score}` },
                    { id:'security',     label:'Security',   short:'Security',  path:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', count:`${analysisResult.factors.securityAndTrust.score}` },
                    { id:'performance',  label:'Perf.',      short:'Perf',      path:'M13 10V3L4 14h7v7l9-11h-7z',                                                                                                               count:`${analysisResult.factors.advancedPerformance.score}` },
                    { id:'advtech',      label:'Adv. Tech',  short:'Adv',       path:'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',                                                                                                   count:`${analysisResult.factors.advancedTechnical.score}` },
                    { id:'modern',       label:'AI & Modern',short:'AI',        path:'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',                              count:`${analysisResult.factors.modernSEO.score}` },
                  ]
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', width: '100%' }}>
                      {tabs.map((tab, i) => {
                        const isActive = activeTab === tab.id
                        return (
                          <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setActiveFilter('all') }}
                            style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              gap: '0.3rem', padding: '0.75rem 0.375rem',
                              background: isActive ? 'var(--ink)' : 'var(--white)',
                              color: isActive ? 'white' : 'var(--gray-5)',
                              cursor: 'pointer',
                              borderTop: isActive ? '2px solid var(--blue)' : '2px solid transparent',
                              borderRight: i < 12 ? '1px solid var(--line)' : '0',
                              borderBottom: '0',
                              borderLeft: '0',
                              outline: 'none',
                              position: 'relative',
                            }}
                          >
                            <svg style={{ width: 18, height: 18, flexShrink: 0, opacity: isActive ? 1 : 0.7 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={tab.path} />
                            </svg>
                            <span style={{ fontSize: '0.62rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center', lineHeight: 1.2 }}>
                              {tab.short}
                            </span>
                            {tab.count && (
                              <span style={{
                                fontSize: '0.58rem', fontWeight: 700, padding: '0 4px', lineHeight: '16px',
                                background: isActive ? 'var(--blue)' : 'var(--gray-1)',
                                color: isActive ? 'white' : 'var(--gray-5)',
                              }}>
                                {tab.count}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>

              {/* Scrollable tab content */}
              <div id="detailed-results" style={{ flex:1, overflowY:'auto', padding:'1.25rem' }}>
                <div className="space-y-8">

                {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {/* Core Web Vitals Section */}
                      {analysisResult.pageSpeed && (
                        <div>
                          <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 22, height: 22, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg style={{ width: 12, height: 12 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            Page Speed &amp; Core Web Vitals
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
                        <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 22, height: 22, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg style={{ width: 12, height: 12 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                          </div>
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
                      {(() => {
                        const factorTitles: { [key: string]: string } = {
                          contentQuality: 'Content Quality',
                          technicalSEO: 'Technical SEO',
                          onPageElements: 'On-Page Elements',
                          userExperience: 'User Experience',
                          contentStructure: 'Content Structure',
                          socialOptimization: 'Social Optimization',
                          localSEO: 'Local SEO',
                          advancedAnalytics: 'Advanced Analytics',
                          securityAndTrust: 'Security & Trust',
                          advancedPerformance: 'Performance',
                          advancedTechnical: 'Adv. Technical',
                          modernSEO: 'Modern SEO & AI',
                        }
                        const sorted = Object.entries(analysisResult.factors).map(([key, s]) => ({
                          key, section: s, pct: Math.round((s.score / s.maxScore) * 100)
                        }))
                        const top3 = [...sorted].sort((a, b) => b.pct - a.pct).slice(0, 3)
                        const low3 = [...sorted].sort((a, b) => a.pct - b.pct).slice(0, 3)
                        return (
                          <div style={{ border: '1px solid var(--line)', background: 'var(--white)', overflow: 'hidden' }}>
                            <div style={{ padding: '0.75rem 1rem', background: 'var(--gray-1)', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: 22, height: 22, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg style={{ width: 12, height: 12 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                              </div>
                              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>Analysis Summary</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                              <div style={{ padding: '0.875rem 1rem', borderRight: '1px solid var(--line)' }}>
                                <h4 style={{ margin: 0, marginBottom: '0.625rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Performing Areas</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                  {top3.map(({ key, section, pct }) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0.625rem', background: 'rgba(5,150,105,0.05)', borderLeft: '2px solid #059669' }}>
                                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)' }}>{factorTitles[key] || key}</span>
                                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', flexShrink: 0 }}>{pct}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div style={{ padding: '0.875rem 1rem' }}>
                                <h4 style={{ margin: 0, marginBottom: '0.625rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Areas for Improvement</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                  {low3.map(({ key, section, pct }) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0.625rem', background: 'rgba(217,119,6,0.05)', borderLeft: '2px solid #d97706' }}>
                                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)' }}>{factorTitles[key] || key}</span>
                                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d97706', flexShrink: 0 }}>{pct}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
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

                {/* Export — moved to left panel */}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ── READY TO ANALYZE ── */}
      <section className="prose-section section">
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '4rem', alignItems: 'start' }}>
            {/* Left — heading */}
            <div>
              <div className="eyebrow">About This Tool</div>
              <h2 className="s-title" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                What is an <span className="blue">On-Page SEO Analyzer?</span>
              </h2>
            </div>
            {/* Right — prose */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '0.25rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--gray-5)', lineHeight: 1.8, margin: 0 }}>
                An <strong style={{ color: 'var(--ink)' }}>on-page SEO analyzer</strong> is a comprehensive tool that evaluates all optimization elements directly on your web pages that influence search engine rankings. Unlike off-page factors like backlinks, on-page SEO focuses on what you can control: your content, HTML structure, meta tags, images, internal links, and technical elements.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--gray-5)', lineHeight: 1.8, margin: 0 }}>
                Our advanced analyzer examines <strong style={{ color: 'var(--ink)' }}>150+ critical ranking factors</strong> including content quality, keyword optimization, Core Web Vitals, mobile responsiveness, structured data, accessibility, and security. Get instant, actionable insights to improve your search visibility, user experience, and organic traffic with data-driven recommendations tailored to your website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS ON-PAGE SEO ── */}
      <section className="features-section section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Industry Knowledge</div>
            <h2 className="s-title">What is On-Page SEO Analysis <span className="blue">and Why It Matters</span></h2>
            <p className="s-sub">On-page SEO analysis is the comprehensive evaluation of all elements on your website that impact search engine rankings — from content quality and meta tags to Core Web Vitals, E-A-T signals, and AI-driven content analysis.</p>
          </div>
          <div className="features-grid">
            {[
              { title: 'Content Quality & E-A-T', desc: 'Expertise, authoritativeness, and trustworthiness signals that establish credibility with Google.', paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'] },
              { title: 'Core Web Vitals', desc: 'LCP, INP, and CLS performance metrics that directly influence your search rankings.', paths: ['M13 10V3L4 14h7v7l9-11h-7z'] },
              { title: 'Technical SEO Audit', desc: 'HTTPS security, mobile-friendliness, structured data, and crawlability checks.', paths: ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'] },
              { title: 'On-Page Optimization', desc: 'Title tags, meta descriptions, heading hierarchy, URL structure, and keyword placement.', paths: ['M4 6h16', 'M4 12h16', 'M4 18h7'] },
              { title: 'User Experience', desc: 'Navigation clarity, accessibility compliance, and design quality signals.', paths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75', 'M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'] },
              { title: 'Social Optimization', desc: 'Open Graph tags, Twitter Cards, and social sharing metadata for better CTR.', paths: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'] },
              { title: 'Advanced Analytics', desc: 'Search intent alignment, SERP feature eligibility, and voice search readiness.', paths: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3'] },
              { title: 'Local SEO Factors', desc: 'NAP consistency, local schema markup, and geo-targeting optimization.', paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'] },
            ].map(card => (
              <div key={card.title} className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {card.paths.map((d, i) => <path key={i} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{card.title}</div>
                <p className="feature-desc">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="prose-callout" style={{ marginTop: '2.5rem' }}>
            <p className="prose-callout-title">Why It Matters</p>
            <p>Proper on-page SEO can improve your search rankings by 25–50% and significantly boost organic traffic, user engagement, and conversion rates.</p>
          </div>
        </div>
      </section>

      {/* ── ADVANCED FEATURES ── */}
      <section className="howto-section section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Capabilities</div>
            <h2 className="s-title">Advanced Features That <span className="blue">Make Our Tool Stand Out</span></h2>
          </div>
          <div className="features-grid">
            {[
              {
                title: '150+ SEO Factors',
                desc: 'Most comprehensive analysis available covering every aspect of on-page SEO optimization',
                iconPaths: ['M11 11m-8 0a8 8 0 1016 0 8 8 0 00-16 0', 'M21 21l-4.35-4.35'],
              },
              {
                title: 'Core Web Vitals Analysis',
                desc: "Real-time analysis of Google's Core Web Vitals with specific optimization recommendations",
                iconPaths: ['M13 10V3L4 14h7v7l9-11h-7z'],
              },
              {
                title: 'AI-Powered Insights',
                desc: 'Advanced AI analysis for content quality, E-A-T signals, and search intent matching',
                iconPaths: ['M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'],
              },
              {
                title: 'Visual Score Dashboard',
                desc: 'Clear, color-coded scoring system with detailed breakdowns for each SEO category',
                iconPaths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
              },
              {
                title: 'Actionable Recommendations',
                desc: 'Specific, prioritized recommendations with step-by-step implementation guidance',
                iconPaths: ['M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
              },
              {
                title: 'Algorithm Ready',
                desc: 'Analysis based on the latest Google algorithm updates and current ranking factors',
                iconPaths: ['M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'],
              },
            ].map(card => (
              <div key={card.title} className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {card.iconPaths.map((p: string, pi: number) => <path key={pi} d={p} />)}
                  </svg>
                </div>
                <div className="feature-title">{card.title}</div>
                <p className="feature-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 150+ FACTORS GUIDE ── */}
      <section className="why-section section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Comprehensive Coverage</div>
            <h2 className="s-title">Complete Guide: <span className="blue">150+ SEO Factors We Analyze</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              {
                title: 'Meta Tags & Title Optimization',
                svgPaths: ['M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'],
                items: [
                  ['Title Tag Length', 'Optimal 30-65 characters'],
                  ['Title Power Words', 'CTR-improving words'],
                  ['Meta Description', '120-170 characters optimal'],
                  ['Meta Description CTA', 'Call-to-action presence'],
                  ['Meta Keywords', 'Legacy tag analysis'],
                  ['Meta Robots', 'Index/follow directives'],
                  ['Theme Color Meta', 'Mobile browser theming'],
                ],
              },
              {
                title: 'Content Quality & Structure',
                svgPaths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'],
                items: [
                  ['Content Length', 'Word count analysis (300+ min)'],
                  ['Content Depth', 'Comprehensiveness scoring'],
                  ['Content Uniqueness', 'Duplicate content detection'],
                  ['Content Freshness', 'Date indicators analysis'],
                  ['Sentence Length', 'Readability optimization'],
                  ['Paragraph Structure', 'Content organization'],
                  ['Reading Difficulty', 'Readability scoring'],
                  ['List Usage', 'Structured content detection'],
                ],
              },
              {
                title: 'Technical SEO',
                svgPaths: ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
                items: [
                  ['HTTPS Protocol', 'SSL/TLS security'],
                  ['URL Structure', 'Clean URL analysis'],
                  ['DOCTYPE Declaration', 'HTML5 validation'],
                  ['Character Encoding', 'UTF-8 validation'],
                  ['Canonical URL', 'Duplicate content prevention'],
                  ['HTML5 Semantics', 'Semantic markup usage'],
                  ['Structured Data', 'JSON-LD schema markup'],
                  ['Robots.txt', 'Crawling directives'],
                ],
              },
              {
                title: 'Performance Optimization',
                svgPaths: ['M13 10V3L4 14h7v7l9-11h-7z'],
                items: [
                  ['CSS Minification', 'Code optimization'],
                  ['JS Minification', 'JavaScript optimization'],
                  ['Image Lazy Loading', 'Performance enhancement'],
                  ['Modern Image Formats', 'WebP/AVIF usage'],
                  ['Content Compression', 'GZIP/Brotli detection'],
                  ['Browser Caching', 'Cache headers analysis'],
                  ['Core Web Vitals', 'Google performance metrics'],
                ],
              },
              {
                title: 'Social Media & Open Graph',
                svgPaths: ['M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'],
                items: [
                  ['OG Title', 'Social media title optimization'],
                  ['OG Description', 'Social sharing descriptions'],
                  ['OG Image', 'Social media preview images'],
                  ['Twitter Cards', 'Twitter-specific optimization'],
                  ['Twitter Title', 'Platform-specific titles'],
                  ['Twitter Description', 'Tweet preview text'],
                  ['Twitter Image', 'Twitter card images'],
                ],
              },
              {
                title: 'Images & Media',
                svgPaths: ['M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'],
                items: [
                  ['Image Usage', 'Visual content analysis'],
                  ['Image Alt Text', 'Accessibility compliance'],
                  ['Image Title Attributes', 'Additional image context'],
                  ['Image Accessibility', 'Overall image SEO'],
                  ['Image Size Optimization', 'File size analysis'],
                  ['Image Format Analysis', 'Format optimization'],
                ],
              },
              {
                title: 'Security & Headers',
                svgPaths: ['M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
                items: [
                  ['SSL/TLS Security', 'Certificate validation'],
                  ['Security Headers', 'HTTP security headers'],
                  ['Content Security Policy', 'CSP implementation'],
                  ['Mixed Content', 'HTTPS compliance'],
                  ['Security Features', 'Overall security assessment'],
                ],
              },
              {
                title: 'Mobile & User Experience',
                svgPaths: ['M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'],
                items: [
                  ['Mobile Viewport', 'Responsive design validation'],
                  ['Responsive Design', 'Mobile-friendly assessment'],
                  ['Touch Elements', 'Mobile interaction optimization'],
                  ['Apple Mobile Web App', 'iOS optimization'],
                  ['Theme Color', 'Mobile browser theming'],
                ],
              },
              {
                title: 'Structured Data & Schema',
                svgPaths: ['M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
                items: [
                  ['Local Schema Markup', 'Business schema validation'],
                  ['Semantic SEO', 'Topic authority analysis'],
                  ['Featured Snippet Optimization', 'SERP feature targeting'],
                  ['Structured Data Detection', 'JSON-LD analysis'],
                ],
              },
              {
                title: 'Internal & External Links',
                svgPaths: ['M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'],
                items: [
                  ['Internal Links', 'Site architecture analysis'],
                  ['Internal Navigation', 'Link structure assessment'],
                  ['External Links', 'Outbound link analysis'],
                  ['External Link Security', 'Link safety validation'],
                  ['NoFollow Links', 'Link attribute analysis'],
                  ['Link Equity Management', 'Link juice distribution'],
                ],
              },
              {
                title: 'Accessibility',
                svgPaths: ['M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'],
                items: [
                  ['ARIA Labels', 'Accessibility markup'],
                  ['Form Accessibility', 'Form label compliance'],
                  ['Language Declaration', 'International accessibility'],
                ],
              },
              {
                title: 'Local SEO',
                svgPaths: ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'],
                items: [
                  ['Address Information', 'Local business data'],
                  ['Contact Phone', 'Phone number validation'],
                  ['Click-to-Call', 'Mobile functionality'],
                  ['Business Hours', 'Operating hours display'],
                  ['Service Area', 'Geographic coverage'],
                  ['Local Keywords', 'Location-based optimization'],
                  ['Map Integration', 'Google Maps embedding'],
                ],
              },
            ].map(cat => (
              <div key={cat.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {cat.svgPaths.map((p: string, pi: number) => <path key={pi} d={p} />)}
                    </svg>
                  </div>
                  {cat.title}
                </div>
                <div className="why-card-body">
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {cat.items.map(([bold, desc]) => (
                      <li key={bold} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--blue)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span>
                        <span><strong style={{ color: 'var(--ink)' }}>{bold}</strong> — {desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <div className="prose-callout">
              <p className="prose-callout-title">Why These Factors Matter</p>
              <p>Google uses over 200 ranking factors to determine search positions. Our tool analyzes the most critical on-page elements that directly impact your rankings. From technical fundamentals like HTTPS and Core Web Vitals to content quality signals and user experience indicators, each factor contributes to your overall SEO success. By addressing these elements systematically, you can achieve <strong>25-50% improvement in search rankings</strong> and significantly boost organic traffic, user engagement, and conversion rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Comparison</div>
            <h2 className="s-title">SEO Shouts vs. Other <span className="blue">On-Page SEO Analyzers</span></h2>
            <p className="s-sub">Compare our advanced analyzer with other popular tools. See why SEO Shouts provides the most comprehensive and actionable SEO analysis.</p>
          </div>

          <div className="overflow-x-auto" style={{ marginTop: '2.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--line)' }}>
                <thead>
                  <tr style={{ background: 'var(--gray-1)', borderBottom: '2px solid var(--line)' }}>
                    <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)' }}>Feature</th>
                    <th style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'var(--blue)' }}>SEO Shouts</th>
                    <th style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-5)' }}>SEOptimer</th>
                    <th style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-5)' }}>Seobility</th>
                    <th style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-5)' }}>Sitechecker</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Number of SEO Factors Analyzed</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', background: '#dcfce7', color: '#166534', fontWeight: 600 }}>150+</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-5)' }}>50+</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-5)' }}>70+</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-5)' }}>80+</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Core Web Vitals Analysis</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Real PageSpeed Insights Data</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>✗</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Keyword Density Analysis</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Structured Data Validation</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Mobile UX Analysis</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Local SEO Factors</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>✗</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Accessibility Audit</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Security Analysis</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>Detailed How-to-Fix Guides</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>~</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--line)', background: 'rgba(37,99,235,0.04)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 600 }}>100% Free (No Limits)</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', background: '#dcfce7', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>Yes</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-5)' }}>Limited</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-5)' }}>Limited</td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-5)' }}>Limited</td>
                  </tr>
                </tbody>
              </table>
            </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem 1.5rem', background: 'var(--gray-1)', border: '1px solid var(--line)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-5)', margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Legend:</strong>
              <span style={{ color: '#16a34a', margin: '0 0.75rem', fontWeight: 600 }}>✓ = Full support</span>
              <span style={{ color: '#ca8a04', margin: '0 0.75rem', fontWeight: 600 }}>~ = Partial support</span>
              <span style={{ color: '#dc2626', margin: '0 0.75rem', fontWeight: 600 }}>✗ = Not available</span>
            </p>
          </div>
        </div>
      </section>

      {/* How to Use Target Keyword Feature Section */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Advanced Feature</div>
            <h2 className="s-title">How to Use the <span className="blue">Target Keyword Feature</span> for Better Analysis</h2>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--gray-5)', lineHeight: 1.75, margin: '2.5rem 0 0' }}>
            The <strong style={{ color: 'var(--ink)' }}>Target Keyword</strong> feature is one of the most powerful aspects of our on-page SEO analyzer. By specifying your target keyword, our tool provides keyword-specific analysis that helps you optimize your content for better rankings on that exact search term.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', margin: '2rem 0 1.25rem' }}>What the Target Keyword Feature Analyzes:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                title: 'Keyword Placement',
                desc: 'Checks if your target keyword appears in critical SEO locations including the title tag, meta description, H1 heading, first paragraph, URL, and image alt text.',
                paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11']
              },
              {
                title: 'Keyword Density Analysis',
                desc: "Calculates the keyword density to ensure it's within the optimal 1–3% range. Detects both keyword stuffing (over-optimization) and under-optimization issues.",
                paths: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3']
              },
              {
                title: 'Keyword Variations & LSI Keywords',
                desc: 'Identifies related keywords and semantic variations that support your target keyword, helping you create more comprehensive, topically-relevant content.',
                paths: ['M21 21l-4.35-4.35', 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z']
              },
              {
                title: 'Competitive Keyword Insights',
                desc: "Compares your keyword optimization against typical patterns for well-ranking pages, showing where you're ahead or behind competitors.",
                paths: ['M18 20V10', 'M12 20V4', 'M6 20v-6']
              },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '1.5rem' }}>
                <div style={{ width: 40, height: 40, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                    {item.paths.map((d, i) => <path key={i} d={d} />)}
                  </svg>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-5)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', background: 'var(--white)', border: '1px solid var(--line)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1.25rem' }}>How to Get the Best Results:</h3>
            <ol style={{ paddingLeft: '1.5rem', margin: 0, listStyleType: 'decimal' }}>
              {[
                { strong: 'Use Specific Keywords:', text: 'Instead of "shoes", use "men\'s running shoes size 12" for more targeted analysis.' },
                { strong: 'Match Search Intent:', text: 'Make sure your keyword matches what users are actually searching for when they visit your page.' },
                { strong: 'Optimize Iteratively:', text: 'Run the analysis, make improvements, then analyze again to see your progress.' },
                { strong: 'Focus on Natural Integration:', text: "Don't force keywords. The tool will show you opportunities to naturally include your target keyword." },
                { strong: 'Check Related Keywords:', text: 'Review the keyword suggestions to expand your content with semantic variations.' },
              ].map(item => (
                <li key={item.strong} style={{ fontSize: '0.9rem', color: 'var(--gray-5)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <strong style={{ color: 'var(--ink)' }}>{item.strong}</strong> {item.text}
                </li>
              ))}
            </ol>
          </div>

          <div style={{ marginTop: '1.5rem', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink)', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--blue)' }}>Pro Tip:</strong> Always enter your target keyword for the most accurate and actionable SEO analysis. Pages optimized for specific keywords rank 67% higher than generic pages according to industry studies.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: 'What is on-page SEO and why does it matter?',
                a: 'On-page SEO refers to all optimization techniques applied directly on your website pages to improve search engine rankings. This includes optimizing content, HTML tags, images, internal links, URL structure, and technical elements. Unlike off-page SEO (backlinks, social signals), on-page factors are completely within your control. Studies show that proper on-page optimization can improve rankings by 25–50% and significantly increase organic traffic, making it one of the most cost-effective SEO strategies available.'
              },
              {
                q: 'Is this on-page SEO analyzer completely free?',
                a: 'Yes, our advanced on-page SEO analyzer is 100% free with no hidden costs, subscriptions, or premium upsells. You get full access to analyze 150+ SEO factors including Core Web Vitals, keyword density, technical SEO, mobile optimization, and detailed recommendations. Unlike other tools that limit features or require paid upgrades, we provide comprehensive analysis without any restrictions. No credit card required, no registration needed, and no analysis limits.'
              },
              {
                q: 'How accurate is the SEO analysis provided by this tool?',
                a: "Our analyzer uses real-time data from Google PageSpeed Insights API for Core Web Vitals and performance metrics, ensuring you get the same data Google uses for ranking decisions. We fetch and analyze your actual HTML, CSS, and page structure in real-time. The tool evaluates 150+ ranking factors based on Google's documented best practices and proven SEO principles. Each recommendation is backed by SEO research and aligned with current algorithm updates, making our analysis highly accurate and actionable."
              },
              {
                q: 'What makes SEO Shouts analyzer better than other tools?',
                a: 'Unlike generic SEO tools that provide surface-level analysis, we examine 150+ specific factors—more than most premium tools. We integrate real Google PageSpeed Insights data, provide detailed how-to-fix guides for each issue, and offer keyword-specific optimization when you enter a target keyword. Our tool analyzes local SEO factors, accessibility compliance, structured data validation, security headers, and modern performance metrics that many competitors ignore. Plus, every recommendation includes implementation guidance, not just "what\'s wrong" but "exactly how to fix it."'
              },
              {
                q: 'Can I analyze competitor websites with this tool?',
                a: "Absolutely! You can analyze any publicly accessible website URL, including your competitors' sites. This is an excellent way to conduct competitive SEO analysis, understand what they're doing right, identify their weaknesses, and discover optimization opportunities for your own site. Many SEO professionals use our tool to benchmark their sites against top-ranking competitors, reverse-engineer successful SEO strategies, and identify content gaps or technical advantages that contribute to higher rankings."
              },
              {
                q: 'How often should I run on-page SEO analysis?',
                a: 'We recommend analyzing your pages at least monthly to monitor SEO health and catch issues early. Additionally, run analysis whenever you make significant changes like redesigns, content updates, template modifications, or after Google algorithm updates. For competitive industries or active content sites, weekly analysis of key pages helps maintain optimal performance. Regular monitoring ensures you catch and fix issues before they impact rankings, and helps you track improvement progress over time.'
              },
              {
                q: 'Do you store or share my website data?',
                a: "No, we take privacy seriously. We don't store, save, or share any data from your website analysis. Each analysis is performed in real-time, and results are only displayed to you during your active session. Once you close or refresh the page, all data is cleared. We don't create accounts, track users across sessions, or collect personal information. The only data transmitted is your URL to our analysis engine and to Google's PageSpeed API."
              },
              {
                q: 'What should I do after getting my SEO analysis report?',
                a: 'Start by addressing critical issues first (shown in red), as these have the most significant impact on rankings. Then tackle warnings (yellow), and finally optimize the good items that can be made excellent. Prioritize technical issues like HTTPS, Core Web Vitals, and mobile-friendliness, then move to content optimization (title tags, headings, keyword placement), and finally enhance user experience elements. Make changes incrementally, re-analyze after each major fix, and monitor your ranking improvements over 2–4 weeks.'
              },
            ].map(item => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Other Tools Section */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Free Tools</div>
            <h2 className="s-title">Explore Our Other <span className="blue">SEO Tools</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              { name: 'On-Page SEO Analyzer', desc: 'Audit 150+ on-page SEO factors with real Google PageSpeed data and Core Web Vitals.', current: true, href: '/tools/on-page-seo-analyzer/', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
              { name: 'Internal Link Checker', desc: 'Visualize anchor text distribution and audit internal link structure across your site.', href: '/tools/internal-link-checker/', paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'] },
              { name: 'Schema Generator', desc: 'Generate JSON-LD structured data for 39+ schema types instantly.', href: '/tools/schema-generator/', paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
              { name: 'Robots.txt Generator', desc: 'Create robots.txt rules that control crawler access, including AI crawlers like GPTBot.', href: '/tools/robots-txt-generator/', paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 8v4l3 3'] },
              { name: 'Disavow File Generator', desc: 'Generate Google-compliant disavow files from any backlink export format with dedupe and whitelist.', href: '/tools/disavow-file-generator/', paths: ['M18 6 6 18', 'M6 6l12 12'] },
            ].map(t => (
              <div key={t.name} className={`related-card${t.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {t.paths.map((d, i) => <path key={i} d={d} />)}
                  </svg>
                </div>
                <div className="related-card-name"><a href={t.href}>{t.name}</a></div>
                <div className="related-card-desc">{t.desc}</div>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {t.current ? 'Current tool' : 'Free — no login'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section - Final Section */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Start Your Complete <span>SEO Analysis Today</span></h2>
          <p className="final-cta-sub">
            Stop guessing what&apos;s wrong with your website&apos;s SEO. Get a comprehensive analysis of 150+ factors that directly impact your search rankings, user experience, and organic traffic.
          </p>
          <div className="final-cta-row">
            <button
              onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
              className="btn-primary"
            >
              Analyze Your Website Now →
            </button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {[
              'Complete analysis in under 60 seconds — no registration required',
              '150+ SEO factors analyzed with actionable recommendations',
              'Get personalized SEO strategy guidance from our experts',
            ].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 600, margin: '1.5rem auto 0', textAlign: 'center' }}>
            <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Get professional SEO insights with SEO Shouts&apos; Advanced On-Page Analyzer!</strong>
            <br />
            <em>Trusted by thousands of SEO professionals, marketers, and website owners worldwide for accurate website analysis.</em>
          </p>
        </div>
      </div>

    </div>
  )
}
