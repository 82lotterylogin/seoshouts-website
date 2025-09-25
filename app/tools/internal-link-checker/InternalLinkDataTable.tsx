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
    if (count === 1) return 'bg-gray-100 text-gray-600'
    if (count <= 3) return 'bg-yellow-100 text-yellow-800'
    if (count <= 10) return 'bg-blue-100 text-blue-800'
    return 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="text-center lg:text-left w-full lg:w-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Anchor Text Data Table</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Showing {filteredAndSortedAnchors.length} of {anchors.length} anchor text variations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search anchor text or URL..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-full sm:min-w-64"
          />

          <select
            value={filterByCount}
            onChange={(e) => {
              setFilterByCount(e.target.value as 'all' | '1' | '2-5' | '6+')
              setCurrentPage(1)
            }}
            className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-full sm:w-auto"
          >
            <option value="all">All frequencies</option>
            <option value="1">Used once (1)</option>
            <option value="2-5">Used 2-5 times</option>
            <option value="6+">Used 6+ times</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-full sm:w-auto"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 text-center">
          <div className="text-xs sm:text-sm text-blue-700 font-medium">Single Use</div>
          <div className="text-lg sm:text-2xl font-bold text-blue-900">{insights.singleUsageAnchors}</div>
          <div className="text-xs text-blue-600">
            {((insights.singleUsageAnchors / insights.totalUniqueAnchors) * 100).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3 sm:p-4 text-center">
          <div className="text-xs sm:text-sm text-green-700 font-medium">Multiple Use</div>
          <div className="text-lg sm:text-2xl font-bold text-green-900">
            {insights.totalUniqueAnchors - insights.singleUsageAnchors}
          </div>
          <div className="text-xs text-green-600">
            {(((insights.totalUniqueAnchors - insights.singleUsageAnchors) / insights.totalUniqueAnchors) * 100).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 sm:p-4 text-center">
          <div className="text-xs sm:text-sm text-purple-700 font-medium">Top Anchor</div>
          <div className="text-sm sm:text-lg font-bold text-purple-900 truncate">
            {insights.mostFrequentAnchor?.text || 'N/A'}
          </div>
          <div className="text-xs text-purple-600">
            {insights.mostFrequentAnchor?.count || 0} uses
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 text-center">
          <div className="text-xs sm:text-sm text-orange-700 font-medium">Avg per Page</div>
          <div className="text-lg sm:text-2xl font-bold text-orange-900">{insights.averageLinksPerPage}</div>
          <div className="text-xs text-orange-600">Internal links</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('text')}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span>Anchor Text</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{getSortIcon('text')}</span>
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('count')}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span>Frequency</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{getSortIcon('count')}</span>
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors hidden sm:table-cell"
                  onClick={() => handleSort('href')}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span>Target URL</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{getSortIcon('href')}</span>
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('pages')}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span>Pages</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{getSortIcon('pages')}</span>
                  </div>
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 hidden sm:table-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedAnchors.map((anchor, index) => (
                <tr
                  key={`${anchor.text}-${anchor.href}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="max-w-xs sm:max-w-sm">
                      <div className="font-medium text-gray-900 break-words text-sm sm:text-base">
                        {truncateText(anchor.text, 40)}
                      </div>
                      {anchor.text.length > 40 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Full: {anchor.text}
                        </div>
                      )}
                      {/* Show URL on mobile when hidden column */}
                      <div className="sm:hidden mt-2">
                        <a
                          href={anchor.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-xs font-mono break-all"
                        >
                          {truncateText(anchor.href, 30)}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyBadge(anchor.count)}`}>
                      {anchor.count} {anchor.count === 1 ? 'use' : 'uses'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="max-w-xs">
                      <a
                        href={anchor.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm font-mono break-all"
                      >
                        {truncateText(anchor.href, 50)}
                      </a>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col space-y-1 sm:space-y-0">
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {anchor.pages.length} {anchor.pages.length === 1 ? 'page' : 'pages'}
                      </span>
                      {/* Move View Details button to mobile */}
                      <button
                        onClick={() => setSelectedAnchor(anchor)}
                        className="sm:hidden text-primary hover:text-primary/80 text-xs font-medium mt-1 text-left"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <button
                      onClick={() => setSelectedAnchor(anchor)}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedAnchors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-gray-500 mb-2">No anchor text found</div>
            <div className="text-sm text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No data available'}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedAnchors.length)} of {filteredAndSortedAnchors.length} results
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">←</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 3) {
                  pageNum = i + 1
                } else if (currentPage <= 2) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i
                } else {
                  pageNum = currentPage - 1 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Selected Anchor Modal */}
      {selectedAnchor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Anchor Text Details</h3>
                  <div className="text-gray-600 font-medium break-words">{selectedAnchor.text}</div>
                </div>
                <button
                  onClick={() => setSelectedAnchor(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600">Usage Frequency</div>
                  <div className="text-2xl font-bold text-primary">{selectedAnchor.count}</div>
                  <div className="text-sm text-gray-500">
                    {((selectedAnchor.count / insights.totalInternalLinks) * 100).toFixed(2)}% of all links
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600">Found on Pages</div>
                  <div className="text-2xl font-bold text-primary">{selectedAnchor.pages.length}</div>
                  <div className="text-sm text-gray-500">
                    {((selectedAnchor.pages.length / insights.successfulPages) * 100).toFixed(1)}% of crawled pages
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Destination URLs ({selectedAnchor.destinations?.length || 1})
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedAnchor.destinations && selectedAnchor.destinations.length > 0 ? (
                      selectedAnchor.destinations.map((dest, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-mono text-gray-800 break-all">{dest.href}</div>
                          <div className="text-xs text-gray-500">
                            {dest.count} times ({((dest.count / selectedAnchor.count) * 100).toFixed(1)}%)
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm">
                        <div className="font-mono text-gray-800 break-all">{selectedAnchor.href}</div>
                        <div className="text-xs text-gray-500">{selectedAnchor.count} times</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Pages Using This Anchor Text</h4>
                <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {selectedAnchor.pages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <div className="font-mono text-sm text-gray-700 break-all flex-1 pr-4">
                          {page}
                        </div>
                        <a
                          href={page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm flex-shrink-0"
                        >
                          Visit →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}