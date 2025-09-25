'use client'

import { useEffect, useRef, useState } from 'react'

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

interface WordCloudItem {
  text: string;
  size: number;
  count: number;
  color: string;
  href: string;
  pages: string[];
  destinations?: Array<{ href: string; count: number }>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export default function InternalLinkVisualization({ anchors, insights }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedAnchor, setSelectedAnchor] = useState<AnchorData | null>(null)
  const [cloudItems, setCloudItems] = useState<WordCloudItem[]>([])
  const [hoveredItem, setHoveredItem] = useState<WordCloudItem | null>(null)
  const [filter, setFilter] = useState('')
  const [minCount, setMinCount] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [canvasHeight, setCanvasHeight] = useState(900)

  // Color scheme for different frequency ranges
  const getColor = (count: number, maxCount: number) => {
    const ratio = count / maxCount
    if (ratio >= 0.8) return '#2563EB'      // Primary blue - highest frequency
    if (ratio >= 0.6) return '#059669'      // Secondary green - high frequency
    if (ratio >= 0.4) return '#DC2626'      // Accent red - medium-high frequency
    if (ratio >= 0.2) return '#9333EA'      // Purple - medium frequency
    return '#6B7280'                        // Gray - low frequency
  }

  // Calculate font size based on frequency
  const getFontSize = (count: number, maxCount: number, minSize: number = 12, maxSize: number = 48) => {
    const ratio = Math.log(count) / Math.log(maxCount)
    return Math.max(minSize, Math.min(maxSize, minSize + (maxSize - minSize) * ratio))
  }

  // Simple word cloud positioning algorithm
  const generateWordCloud = () => {
    if (!anchors.length || !containerRef.current) return

    const container = containerRef.current
    const width = container.offsetWidth || 1400

    // Anchors are already grouped, just filter them
    const filteredAnchors = anchors.filter(anchor =>
      anchor.count >= minCount &&
      (filter === '' || anchor.text.toLowerCase().includes(filter.toLowerCase()))
    ).slice(0, 100) // Limit to top 100 for performance

    // Dynamic height based on number of anchors
    const baseHeight = 600
    const minHeight = 600
    const maxHeight = 1400
    const wordsPerRow = Math.floor(width / 150) // Estimate words per row
    const estimatedRows = Math.ceil(filteredAnchors.length / wordsPerRow)
    const dynamicHeight = Math.min(maxHeight, Math.max(minHeight, baseHeight + (estimatedRows * 60)))
    const height = dynamicHeight

    // Update canvas height state for rendering
    setCanvasHeight(height)

    if (filteredAnchors.length === 0) {
      setCloudItems([])
      return
    }

    const maxCount = Math.max(...filteredAnchors.map(a => a.count))
    const items: WordCloudItem[] = []

    // Sort anchors by count (largest first) for better placement
    const sortedAnchors = [...filteredAnchors].sort((a, b) => b.count - a.count)

    // Function to check if two rectangles overlap
    const checkCollision = (item1: { x: number, y: number, width: number, height: number },
                           item2: { x: number, y: number, width: number, height: number }): boolean => {
      return !(item1.x + item1.width < item2.x ||
               item2.x + item2.width < item1.x ||
               item1.y + item1.height < item2.y ||
               item2.y + item2.height < item1.y)
    }

    sortedAnchors.forEach((anchor, index) => {
      let fontSize = getFontSize(anchor.count, maxCount, 12, 36) // Reduced max size
      const color = getColor(anchor.count, maxCount)

      // Better text dimension estimation with canvas measurement
      let textWidth: number
      let textHeight: number

      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
          const metrics = ctx.measureText(anchor.text)
          textWidth = metrics.width + 8 // More conservative buffer
          textHeight = fontSize * 1.4 // More conservative height
        } else {
          throw new Error('Canvas context not available')
        }
      } catch (error) {
        // Conservative fallback calculation
        textWidth = anchor.text.length * fontSize * 0.7 + 12
        textHeight = fontSize * 1.4
      }

      let x = width / 2 - textWidth / 2
      let y = height / 2
      let placed = false

      // Try to place without collision using aggressive spiral algorithm
      for (let radius = 0; radius < Math.min(width, height) / 2 && !placed; radius += 6) {
        for (let angle = 0; angle < Math.PI * 2 && !placed; angle += 0.15) {
          const testX = width / 2 + radius * Math.cos(angle) - textWidth / 2
          const testY = height / 2 + radius * Math.sin(angle) - textHeight / 2

          // Check bounds
          if (testX < 10 || testX + textWidth > width - 10 ||
              testY < 10 || testY + textHeight > height - 10) continue

          // Dynamic padding based on font size and item importance
          const padding = Math.max(6, Math.min(12, fontSize * 0.25))
          const testItem = {
            x: testX - padding,
            y: testY - padding,
            width: textWidth + padding * 2,
            height: textHeight + padding * 2
          }

          // Check collision with existing items using rectangle overlap
          let hasCollision = false
          for (const existingItem of items) {
            if (existingItem.x === undefined || existingItem.y === undefined) continue

            const existingWithPadding = {
              x: existingItem.x! - padding,
              y: existingItem.y! - padding,
              width: existingItem.width! + padding * 2,
              height: existingItem.height! + padding * 2
            }

            if (checkCollision(testItem, existingWithPadding)) {
              hasCollision = true
              break
            }
          }

          if (!hasCollision) {
            x = testX
            y = testY
            placed = true
          }
        }
      }

      // If couldn't place the item, try with smaller font size
      if (!placed) {
        // Try with 75% of original font size
        const smallerFontSize = fontSize * 0.75
        if (smallerFontSize >= 10) { // Minimum readable size
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.font = `bold ${smallerFontSize}px system-ui, -apple-system, sans-serif`
              const metrics = ctx.measureText(anchor.text)
              const smallerTextWidth = metrics.width + 6
              const smallerTextHeight = smallerFontSize * 1.4

              // Try placement with smaller size
              for (let radius = 0; radius < Math.min(width, height) / 2 && !placed; radius += 8) {
                for (let angle = 0; angle < Math.PI * 2 && !placed; angle += 0.2) {
                  const testX = width / 2 + radius * Math.cos(angle) - smallerTextWidth / 2
                  const testY = height / 2 + radius * Math.sin(angle) - smallerTextHeight / 2

                  if (testX < 10 || testX + smallerTextWidth > width - 10 ||
                      testY < 10 || testY + smallerTextHeight > height - 10) continue

                  const smallPadding = 4
                  const testItem = {
                    x: testX - smallPadding,
                    y: testY - smallPadding,
                    width: smallerTextWidth + smallPadding * 2,
                    height: smallerTextHeight + smallPadding * 2
                  }

                  let hasCollision = false
                  for (const existingItem of items) {
                    if (existingItem.x === undefined || existingItem.y === undefined) continue
                    const existingWithPadding = {
                      x: existingItem.x! - smallPadding,
                      y: existingItem.y! - smallPadding,
                      width: existingItem.width! + smallPadding * 2,
                      height: existingItem.height! + smallPadding * 2
                    }
                    if (checkCollision(testItem, existingWithPadding)) {
                      hasCollision = true
                      break
                    }
                  }

                  if (!hasCollision) {
                    x = testX
                    y = testY
                    textWidth = smallerTextWidth
                    textHeight = smallerTextHeight
                    fontSize = smallerFontSize
                    placed = true
                  }
                }
              }
            }
          } catch (error) {
            // If smaller size fails, skip the item
          }
        }

        if (!placed) {
          console.log(`Could not place anchor: ${anchor.text}`)
          return // Skip this item
        }
      }

      items.push({
        text: anchor.text,
        size: fontSize,
        count: anchor.count,
        color: color,
        href: anchor.href,
        pages: anchor.pages,
        destinations: anchor.destinations,
        x: x,
        y: y,
        width: textWidth,
        height: textHeight
      })
    })

    setCloudItems(items)

    // Calculate actual content bounds and update canvas height
    if (items.length > 0) {
      const itemsWithPositions = items.filter(item => item.y !== undefined && item.height !== undefined)
      if (itemsWithPositions.length > 0) {
        const maxY = Math.max(...itemsWithPositions.map(item => item.y! + item.height!))
        const minY = Math.min(...itemsWithPositions.map(item => item.y!))
        const actualContentHeight = maxY - minY + 100 // Add 50px padding top and bottom
        const optimizedHeight = Math.max(400, Math.min(1200, actualContentHeight))
        setCanvasHeight(optimizedHeight)
      }
    }
  }

  // Draw the word cloud on canvas
  const drawWordCloud = () => {
    const canvas = canvasRef.current
    if (!canvas || cloudItems.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = containerRef.current
    if (!container) return

    const width = container.offsetWidth || 1400

    // Calculate dynamic height (same logic as generateWordCloud)
    const filteredAnchors = anchors.filter(anchor =>
      anchor.count >= minCount &&
      (filter === '' || anchor.text.toLowerCase().includes(filter.toLowerCase()))
    ).slice(0, 100)
    const baseHeight = 600
    const minHeight = 600
    const maxHeight = 1400
    const wordsPerRow = Math.floor(width / 150)
    const estimatedRows = Math.ceil(filteredAnchors.length / wordsPerRow)
    const dynamicHeight = Math.min(maxHeight, Math.max(minHeight, baseHeight + (estimatedRows * 60)))
    const height = dynamicHeight

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.02)')
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.08)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw word cloud items
    cloudItems.forEach(item => {
      if (item.x === undefined || item.y === undefined) return

      const isHovered = hoveredItem === item
      const isSelected = selectedAnchor && selectedAnchor.text === item.text && selectedAnchor.href === item.href

      ctx.font = `bold ${item.size}px system-ui, -apple-system, sans-serif`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      // Highlight hovered or selected items
      if (isSelected || isHovered) {
        // Draw background highlight
        const padding = 4
        ctx.fillStyle = isSelected ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.1)'
        ctx.fillRect(item.x - padding, item.y - padding, item.width! + padding * 2, item.height! + padding * 2)

        // Enhanced shadow for selected/hovered items
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.shadowBlur = 4

        // Brighter color for selected/hovered
        ctx.fillStyle = isSelected ? '#1d4ed8' : '#2563EB'
      } else {
        // Normal state
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.shadowBlur = 2

        ctx.fillStyle = item.color
      }

      ctx.fillText(item.text, item.x, item.y)

      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.shadowBlur = 0
    })
  }

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    // Account for canvas scaling - convert screen coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY

    // Find clicked item with improved hit detection
    const clickedItem = cloudItems.find(item => {
      if (item.x === undefined || item.y === undefined || !item.width || !item.height) return false

      // Text baseline is set to 'top', so item.y is the TOP of the text
      const textTop = item.y
      const textBottom = item.y + item.height
      const textLeft = item.x - 2 // Add small margin for easier clicking
      const textRight = item.x + item.width + 2

      return x >= textLeft && x <= textRight && y >= textTop && y <= textBottom
    })

    if (clickedItem) {
      // Find the anchor from our stored cloud items - they contain the grouped data
      setSelectedAnchor({
        text: clickedItem.text,
        href: clickedItem.href,
        count: clickedItem.count,
        pages: clickedItem.pages,
        destinations: clickedItem.destinations
      })
      setIsModalOpen(true)
    } else {
      setSelectedAnchor(null)
      setIsModalOpen(false)
    }
  }

  // Handle canvas mouse move for hover effects
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    // Account for canvas scaling - convert screen coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY

    // Find hovered item with improved hit detection
    const hoveredItem = cloudItems.find(item => {
      if (item.x === undefined || item.y === undefined || !item.width || !item.height) return false

      // Text baseline is set to 'top', so item.y is the TOP of the text
      const textTop = item.y
      const textBottom = item.y + item.height
      const textLeft = item.x - 2 // Add small margin for easier hovering
      const textRight = item.x + item.width + 2

      return x >= textLeft && x <= textRight && y >= textTop && y <= textBottom
    })

    setHoveredItem(hoveredItem || null)

    // Change cursor style based on whether we're hovering over text
    if (canvas) {
      canvas.style.cursor = hoveredItem ? 'pointer' : 'default'
    }
  }

  useEffect(() => {
    generateWordCloud()
  }, [anchors, filter, minCount])

  useEffect(() => {
    drawWordCloud()
  }, [cloudItems, hoveredItem])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [isModalOpen])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        generateWordCloud()
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left w-full sm:w-auto">Interactive Anchor Text Cloud</h3>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter anchor text..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-full sm:w-auto"
          />
          <select
            value={minCount}
            onChange={(e) => setMinCount(parseInt(e.target.value))}
            className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-full sm:w-auto"
          >
            <option value="1">Min 1 use</option>
            <option value="2">Min 2 uses</option>
            <option value="3">Min 3 uses</option>
            <option value="5">Min 5 uses</option>
            <option value="10">Min 10 uses</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">Frequency Legend:</div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#2563EB] rounded mr-1 sm:mr-2"></div>
            <span>Highest</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#059669] rounded mr-1 sm:mr-2"></div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#DC2626] rounded mr-1 sm:mr-2"></div>
            <span>Medium-High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#9333EA] rounded mr-1 sm:mr-2"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#6B7280] rounded mr-1 sm:mr-2"></div>
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Word Cloud Canvas */}
      <div ref={containerRef} className="relative w-full">
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-2 sm:p-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
          {cloudItems.length > 0 ? (
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoveredItem(null)}
              className="cursor-pointer max-w-full touch-manipulation"
              style={{ width: '100%', height: `${Math.max(300, canvasHeight)}px` }}
            />
          ) : (
            <div className="text-center py-8 sm:py-16">
              <div className="text-3xl sm:text-4xl mb-4">☁️</div>
              <div className="text-gray-500 text-sm sm:text-base">
                {anchors.length === 0
                  ? 'No anchor text data to display'
                  : 'No anchors match your current filters'
                }
              </div>
              {filter && (
                <button
                  onClick={() => {setFilter(''); setMinCount(1);}}
                  className="mt-2 text-primary hover:text-primary/80 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup for Selected Anchor Details */}
      {isModalOpen && selectedAnchor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false)
            }
          }}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-200">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">Anchor Text Details</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl leading-none ml-2"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Anchor Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Anchor Text</div>
                  <div className="font-semibold text-gray-900 break-words text-base sm:text-lg">{selectedAnchor.text}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Usage Count</div>
                  <div className="font-semibold text-primary text-lg sm:text-xl">{selectedAnchor.count} times</div>
                </div>
              </div>

              {/* Destination URLs */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="text-xs sm:text-sm font-medium text-gray-600 mb-3">
                  Destination URLs ({selectedAnchor.destinations?.length || 1})
                </div>
                <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 overflow-y-auto">
                  {selectedAnchor.destinations && selectedAnchor.destinations.length > 0 ? (
                    selectedAnchor.destinations.map((dest, index) => (
                      <div key={index} className="bg-white p-2 sm:p-3 rounded-lg border">
                        <div className="font-mono text-xs sm:text-sm text-gray-900 break-all mb-1 sm:mb-2">
                          {dest.href}
                        </div>
                        <div className="text-xs text-gray-600">
                          Used {dest.count} time{dest.count !== 1 ? 's' : ''}
                          ({((dest.count / selectedAnchor.count) * 100).toFixed(1)}% of total)
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-2 sm:p-3 rounded-lg border">
                      <div className="font-mono text-xs sm:text-sm text-gray-900 break-all">
                        {selectedAnchor.href}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Used {selectedAnchor.count} time{selectedAnchor.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Found on Pages */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="text-xs sm:text-sm font-medium text-gray-600 mb-3">
                  Found on Pages ({selectedAnchor.pages.length})
                </div>
                <div className="max-h-32 sm:max-h-48 overflow-y-auto space-y-1 sm:space-y-2">
                  {selectedAnchor.pages.map((page, index) => (
                    <div key={index} className="text-xs sm:text-sm font-mono text-gray-700 break-all bg-white p-2 rounded border">
                      {page}
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-3 sm:p-4">
                <div className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Usage Statistics</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-600">Pages count: </span>
                    <span className="font-semibold">{selectedAnchor.pages.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Frequency: </span>
                    <span className="font-semibold">{((selectedAnchor.count / insights.totalInternalLinks) * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Most Popular Anchor</div>
              <div className="text-gray-600">
                {insights.mostFrequentAnchor
                  ? `"${insights.mostFrequentAnchor.text}" (${insights.mostFrequentAnchor.count} uses)`
                  : 'No anchor text found'
                }
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs">i</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Single-Use Anchors</div>
              <div className="text-gray-600">
                {insights.singleUsageAnchors} anchors used only once ({((insights.singleUsageAnchors / insights.totalUniqueAnchors) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs">!</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Optimization Opportunity</div>
              <div className="text-gray-600">
                {insights.singleUsageAnchors > insights.totalUniqueAnchors * 0.5
                  ? 'Consider consolidating similar anchor text variations'
                  : 'Good anchor text diversity - consider adding more specific anchors'
                }
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs">📊</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Distribution Health</div>
              <div className="text-gray-600">
                {insights.averageLinksPerPage < 5
                  ? 'Low internal linking - consider adding more content links'
                  : insights.averageLinksPerPage > 20
                  ? 'High internal linking - ensure relevance and avoid over-optimization'
                  : 'Healthy internal linking distribution'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}