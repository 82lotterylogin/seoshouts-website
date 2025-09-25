'use client'

import { useState } from 'react'

interface AnchorData {
  text: string;
  href: string;
  count: number;
  pages: string[];
  destinations?: Array<{ href: string; count: number }>;
}

interface AnalysisInsights {
  totalUniqueAnchors: number;
  totalInternalLinks: number;
  averageLinksPerPage: number;
  pagesCrawled: number;
  successfulPages: number;
  failedPages: number;
  mostFrequentAnchor: AnchorData | null;
  singleUsageAnchors: number;
  topAnchors: AnchorData[];
}

interface CrawledPage {
  url: string;
  title: string;
  linkCount: number;
  error: string | null;
}

interface AnalysisResult {
  baseUrl: string;
  anchors: AnchorData[];
  insights: AnalysisInsights;
  crawledPages: CrawledPage[];
}

interface Props {
  results: AnalysisResult;
}

export default function ExportOptions({ results }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const exportToCSV = () => {
    setIsOpen(false)
    const csvData = [
      ['Anchor Text', 'Target URL', 'Usage Count', 'Pages Found On', 'Page Count', 'Percentage of Total Links'],
      ...results.anchors.map(anchor => [
        anchor.text,
        anchor.href,
        anchor.count.toString(),
        anchor.pages.join('; '),
        anchor.pages.length.toString(),
        ((anchor.count / results.insights.totalInternalLinks) * 100).toFixed(2) + '%'
      ])
    ]

    const csvContent = csvData
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `anchor-cloud-analysis-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const exportToJSON = () => {
    setIsOpen(false)
    const jsonData = {
      exportDate: new Date().toISOString(),
      baseUrl: results.baseUrl,
      summary: results.insights,
      anchorData: results.anchors.map(anchor => ({
        anchorText: anchor.text,
        targetUrl: anchor.href,
        usageCount: anchor.count,
        foundOnPages: anchor.pages,
        pageCount: anchor.pages.length,
        percentageOfTotalLinks: ((anchor.count / results.insights.totalInternalLinks) * 100).toFixed(2)
      })),
      crawledPages: results.crawledPages
    }

    const jsonContent = JSON.stringify(jsonData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `anchor-cloud-analysis-${new Date().toISOString().split('T')[0]}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const exportReport = () => {
    setIsOpen(false)
    const reportContent = `
ANCHOR CLOUD ANALYSIS REPORT
Generated on: ${new Date().toLocaleDateString()}
Website: ${results.baseUrl}

==================================================
SUMMARY STATISTICS
==================================================
Total Unique Anchors: ${results.insights.totalUniqueAnchors.toLocaleString()}
Total Internal Links: ${results.insights.totalInternalLinks.toLocaleString()}
Pages Successfully Crawled: ${results.insights.successfulPages.toLocaleString()}
Average Links per Page: ${results.insights.averageLinksPerPage}
Single-Use Anchors: ${results.insights.singleUsageAnchors.toLocaleString()} (${((results.insights.singleUsageAnchors / results.insights.totalUniqueAnchors) * 100).toFixed(1)}%)

==================================================
TOP 20 MOST FREQUENT ANCHOR TEXTS
==================================================
${results.insights.topAnchors.map((anchor, index) =>
  `${(index + 1).toString().padStart(2, ' ')}. "${anchor.text}" - ${anchor.count} uses (${((anchor.count / results.insights.totalInternalLinks) * 100).toFixed(2)}%)`
).join('\n')}

==================================================
OPTIMIZATION RECOMMENDATIONS
==================================================
${results.insights.singleUsageAnchors > results.insights.totalUniqueAnchors * 0.5 ?
  '• High number of single-use anchors detected. Consider consolidating similar anchor text variations.' :
  '• Good anchor text diversity detected. Consider adding more specific descriptive anchors.'
}

${results.insights.averageLinksPerPage < 5 ?
  '• Low internal linking detected. Consider adding more contextual internal links within your content.' :
  results.insights.averageLinksPerPage > 20 ?
  '• High internal linking detected. Ensure all links are relevant and avoid over-optimization.' :
  '• Healthy internal linking distribution detected.'
}

${results.insights.mostFrequentAnchor ?
  `• Most popular anchor text: "${results.insights.mostFrequentAnchor.text}" (${results.insights.mostFrequentAnchor.count} uses)` :
  '• No dominant anchor text pattern detected'
}

==================================================
DETAILED ANCHOR TEXT DATA
==================================================
${results.anchors.map(anchor => {
  let targetSection = '';
  if (anchor.destinations && anchor.destinations.length > 1) {
    targetSection = `Destinations:\n${anchor.destinations.map(dest =>
      `  • ${dest.href} (${dest.count} uses, ${((dest.count / anchor.count) * 100).toFixed(1)}%)`
    ).join('\n')}`;
  } else {
    targetSection = `Target: ${anchor.href}`;
  }

  return `Anchor: "${anchor.text}"\n${targetSection}\nTotal Usage: ${anchor.count} times on ${anchor.pages.length} pages\nPages: ${anchor.pages.join(', ')}\n---`;
}).join('\n')}

==================================================
CRAWLED PAGES SUMMARY
==================================================
${results.crawledPages.map(page =>
  `${page.title || 'Untitled'}\n${page.url}\nInternal Links: ${page.linkCount}${page.error ? `\nError: ${page.error}` : ''}\n---`
).join('\n')}

Report generated by SEO Shouts Anchor Cloud Tool
Visit: https://seoshouts.com/tools/anchor-cloud
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `anchor-cloud-report-${new Date().toISOString().split('T')[0]}.txt`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="relative inline-block">
      <div className="group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center"
        >
          📥 Export Data
          <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-200 ${
            isOpen ? 'opacity-100 visible transform scale-100' : 'opacity-0 invisible transform scale-95'
          }`}
          style={{ zIndex: 9999 }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-2">
            <button
              onClick={exportToCSV}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                📊
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium whitespace-nowrap">Export CSV</div>
                <div className="text-xs text-gray-500 whitespace-nowrap">Spreadsheet format</div>
              </div>
            </button>

            <button
              onClick={exportToJSON}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                📋
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium whitespace-nowrap">Export JSON</div>
                <div className="text-xs text-gray-500 whitespace-nowrap">Developer format</div>
              </div>
            </button>

            <button
              onClick={exportReport}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                📄
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium whitespace-nowrap">Export Report</div>
                <div className="text-xs text-gray-500 whitespace-nowrap">Complete analysis</div>
              </div>
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            <div className="px-4 py-2">
              <div className="text-xs text-gray-500 text-center">
                {results.anchors.length} anchor texts
                <br />
                {results.insights.totalInternalLinks} total links
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}