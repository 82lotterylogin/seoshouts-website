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
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px',
          background: 'var(--blue)', color: '#fff', border: 'none',
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.85rem',
          cursor: 'pointer', transition: 'background 0.15s', letterSpacing: '-0.01em',
        }}
        onMouseEnter={() => setIsOpen(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export Data
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute', right: 0, top: 'calc(100% + 4px)',
            width: '240px', background: 'var(--white)',
            border: '1px solid var(--line)', zIndex: 9999,
            boxShadow: '0 8px 24px rgba(8,9,10,0.1)',
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          {[
            { label: 'Export CSV', sub: 'Spreadsheet format', icon: '📊', fn: exportToCSV },
            { label: 'Export JSON', sub: 'Developer format', icon: '📋', fn: exportToJSON },
            { label: 'Export Report', sub: 'Complete analysis', icon: '📄', fn: exportReport },
          ].map(({ label, sub, icon, fn }) => (
            <button
              key={label}
              onClick={fn}
              style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', background: 'none', border: 'none',
                borderBottom: '1px solid var(--line)', cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>{label}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: '1px' }}>{sub}</div>
              </div>
            </button>
          ))}
          <div style={{ padding: '10px 16px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--gray-4)', lineHeight: 1.6 }}>
            {results.anchors.length} anchor texts<br />{results.insights.totalInternalLinks} total links
          </div>
        </div>
      )}
    </div>
  )
}