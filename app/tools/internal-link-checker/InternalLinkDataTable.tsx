'use client'

import { useState, useMemo } from 'react'

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

interface Props {
  anchors: AnchorData[];
  insights: AnalysisInsights;
}

type SortField = 'text' | 'count' | 'href' | 'pages'
type SortDirection = 'asc' | 'desc'

export default function InternalLinkDataTable({ anchors, insights }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('count')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selectedAnchor, setSelectedAnchor] = useState<AnchorData | null>(null)
  const [filterByCount, setFilterByCount] = useState<'all' | '1' | '2-5' | '6+'>('all')

  // Filter and sort anchors
  const filteredAndSortedAnchors = useMemo(() => {
    let filtered = anchors.filter(anchor =>
      anchor.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anchor.href.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply count filter
    if (filterByCount !== 'all') {
      filtered = filtered.filter(anchor => {
        switch (filterByCount) {
          case '1': return anchor.count === 1
          case '2-5': return anchor.count >= 2 && anchor.count <= 5
          case '6+': return anchor.count >= 6
          default: return true
        }
      })
    }

    // Sort
    return filtered.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'text':
          comparison = a.text.localeCompare(b.text)
          break
        case 'count':
          comparison = a.count - b.count
          break
        case 'href':
          comparison = a.href.localeCompare(b.href)
          break
        case 'pages':
          comparison = a.pages.length - b.pages.length
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [anchors, searchTerm, sortField, sortDirection, filterByCount])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAnchors.length / pageSize)
  const paginatedAnchors = filteredAndSortedAnchors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const getFrequencyBadge = (count: number) => {
    if (count === 1) return 'gray'
    if (count <= 3) return 'amber'
    if (count <= 10) return 'blue'
    return 'green'
  }

  return (
    <div className="dt-wrap">
      <div className="dt-header-row">
        <div>
          <h3 className="dt-title">Anchor Text Data Table</h3>
          <p className="dt-subtitle">Showing {filteredAndSortedAnchors.length} of {anchors.length} anchor text variations</p>
        </div>
        <div className="dt-controls">
          <input
            type="text"
            placeholder="Search anchor text or URL..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="viz-input"
            style={{ minWidth: '220px' }}
          />
          <select
            value={filterByCount}
            onChange={(e) => { setFilterByCount(e.target.value as 'all' | '1' | '2-5' | '6+'); setCurrentPage(1) }}
            className="viz-input"
          >
            <option value="all">All frequencies</option>
            <option value="1">Used once (1)</option>
            <option value="2-5">Used 2-5 times</option>
            <option value="6+">Used 6+ times</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
            className="viz-input"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      <div className="dt-stats">
        <div className="dt-stat highlight">
          <div className="dt-stat-label">Single Use</div>
          <div className="dt-stat-val">{insights.singleUsageAnchors}</div>
          <div className="dt-stat-sub">{((insights.singleUsageAnchors / insights.totalUniqueAnchors) * 100).toFixed(1)}% of total</div>
        </div>
        <div className="dt-stat highlight">
          <div className="dt-stat-label">Multiple Use</div>
          <div className="dt-stat-val">{insights.totalUniqueAnchors - insights.singleUsageAnchors}</div>
          <div className="dt-stat-sub">{(((insights.totalUniqueAnchors - insights.singleUsageAnchors) / insights.totalUniqueAnchors) * 100).toFixed(1)}% of total</div>
        </div>
        <div className="dt-stat">
          <div className="dt-stat-label">Top Anchor</div>
          <div className="dt-stat-val" style={{ fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{insights.mostFrequentAnchor?.text || 'N/A'}</div>
          <div className="dt-stat-sub">{insights.mostFrequentAnchor?.count || 0} uses</div>
        </div>
        <div className="dt-stat">
          <div className="dt-stat-label">Avg per Page</div>
          <div className="dt-stat-val">{insights.averageLinksPerPage}</div>
          <div className="dt-stat-sub">Internal links</div>
        </div>
      </div>

      <div className="dt-table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="anchor-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('text')}>
                  Anchor Text <span style={{ color: 'var(--gray-4)', fontWeight: 400 }}>{getSortIcon('text')}</span>
                </th>
                <th onClick={() => handleSort('count')}>
                  Frequency <span style={{ color: 'var(--gray-4)', fontWeight: 400 }}>{getSortIcon('count')}</span>
                </th>
                <th onClick={() => handleSort('href')} className="tbl-sm-hide">
                  Target URL <span style={{ color: 'var(--gray-4)', fontWeight: 400 }}>{getSortIcon('href')}</span>
                </th>
                <th onClick={() => handleSort('pages')}>
                  Pages <span style={{ color: 'var(--gray-4)', fontWeight: 400 }}>{getSortIcon('pages')}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAnchors.map((anchor, index) => (
                <tr key={`${anchor.text}-${anchor.href}-${index}`}>
                  <td>
                    <div style={{ maxWidth: '260px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--ink)', wordBreak: 'break-word' }}>{truncateText(anchor.text, 40)}</div>
                      {anchor.text.length > 40 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: '2px' }}>Full: {anchor.text}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`dt-badge ${getFrequencyBadge(anchor.count)}`}>
                      {anchor.count} {anchor.count === 1 ? 'use' : 'uses'}
                    </span>
                  </td>
                  <td className="tbl-sm-hide">
                    <a
                      href={anchor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--blue)', wordBreak: 'break-all' }}
                    >
                      {truncateText(anchor.href, 50)}
                    </a>
                  </td>
                  <td>
                    <span className="dt-badge gray">{anchor.pages.length} {anchor.pages.length === 1 ? 'page' : 'pages'}</span>
                  </td>
                  <td>
                    <button onClick={() => setSelectedAnchor(anchor)} className="il-btn-ghost">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedAnchors.length === 0 && (
          <div className="dt-empty">
            <div className="dt-empty-icon">🔍</div>
            <div className="dt-empty-text">No anchor text found</div>
            <div className="dt-empty-hint">{searchTerm ? 'Try adjusting your search terms' : 'No data available'}</div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="dt-pagination">
          <div className="dt-page-info">
            Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredAndSortedAnchors.length)} of {filteredAndSortedAnchors.length} results
          </div>
          <div className="dt-page-btns">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="dt-page-btn"
            >Previous</button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 3) { pageNum = i + 1 }
              else if (currentPage <= 2) { pageNum = i + 1 }
              else if (currentPage >= totalPages - 1) { pageNum = totalPages - 2 + i }
              else { pageNum = currentPage - 1 + i }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`dt-page-btn${currentPage === pageNum ? ' active' : ''}`}
                >{pageNum}</button>
              )
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="dt-page-btn"
            >Next</button>
          </div>
        </div>
      )}

      {selectedAnchor && (
        <div className="il-modal">
          <div className="il-modal-inner" style={{ maxWidth: '800px' }}>
            <div className="il-modal-header">
              <div>
                <div className="il-modal-title">Anchor Text Details</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'var(--gray-5)', marginTop: '4px', wordBreak: 'break-word' }}>{selectedAnchor.text}</div>
              </div>
              <button onClick={() => setSelectedAnchor(null)} className="il-modal-close">×</button>
            </div>
            <div className="il-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="il-modal-cell">
                  <div className="il-modal-cell-label">Usage Frequency</div>
                  <div className="il-modal-cell-val accent">{selectedAnchor.count}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'var(--gray-5)', marginTop: '2px' }}>
                    {((selectedAnchor.count / insights.totalInternalLinks) * 100).toFixed(2)}% of all links
                  </div>
                </div>
                <div className="il-modal-cell">
                  <div className="il-modal-cell-label">Found on Pages</div>
                  <div className="il-modal-cell-val accent">{selectedAnchor.pages.length}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'var(--gray-5)', marginTop: '2px' }}>
                    {((selectedAnchor.pages.length / insights.successfulPages) * 100).toFixed(1)}% of crawled pages
                  </div>
                </div>
                <div className="il-modal-cell">
                  <div className="il-modal-cell-label">Destination URLs ({selectedAnchor.destinations?.length || 1})</div>
                  <div style={{ maxHeight: '100px', overflowY: 'auto', marginTop: '4px' }}>
                    {selectedAnchor.destinations && selectedAnchor.destinations.length > 0 ? (
                      selectedAnchor.destinations.map((dest, index) => (
                        <div key={index} style={{ marginBottom: '6px' }}>
                          <div className="il-modal-mono">{dest.href}</div>
                          <div className="il-modal-sub">{dest.count} times ({((dest.count / selectedAnchor.count) * 100).toFixed(1)}%)</div>
                        </div>
                      ))
                    ) : (
                      <div>
                        <div className="il-modal-mono">{selectedAnchor.href}</div>
                        <div className="il-modal-sub">{selectedAnchor.count} times</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="il-modal-section">
                <div className="il-modal-section-label">Pages Using This Anchor Text</div>
                <div style={{ maxHeight: '220px', overflowY: 'auto', marginTop: '8px' }}>
                  {selectedAnchor.pages.map((page, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--white)', border: '1px solid var(--line)', marginBottom: '4px' }}>
                      <div className="il-modal-mono" style={{ flex: 1, paddingRight: '1rem' }}>{page}</div>
                      <a href={page} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'var(--blue)', flexShrink: 0 }}>Visit →</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}