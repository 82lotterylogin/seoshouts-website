'use client'
import { useEffect, useRef } from 'react'

interface ShapeGridProps {
  direction?: 'diagonal' | 'right' | 'left' | 'up' | 'down'
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  hoverTrailAmount?: number
}

export default function ShapeGrid({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(37,99,235,0.2)',
  squareSize = 48,
  hoverFillColor = 'rgba(37,99,235,0.15)',
  hoverTrailAmount = 5,
}: ShapeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let numX = 0
    let numY = 0
    const gridOffset = { x: 0, y: 0 }
    let hoveredSquare: { x: number; y: number } | null = null
    const trailCells: { x: number; y: number }[] = []
    const cellOpacities = new Map<string, number>()
    let rafId: number

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent ? parent.offsetWidth : window.innerWidth
      canvas.height = parent ? parent.offsetHeight : window.innerHeight
      numX = Math.ceil(canvas.width / squareSize) + 3
      numY = Math.ceil(canvas.height / squareSize) + 3
    }
    window.addEventListener('resize', resize)
    resize()

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const offX = ((gridOffset.x % squareSize) + squareSize) % squareSize
      const offY = ((gridOffset.y % squareSize) + squareSize) % squareSize
      for (let col = -2; col < numX; col++) {
        for (let row = -2; row < numY; row++) {
          const sx = col * squareSize + offX
          const sy = row * squareSize + offY
          const key = `${col},${row}`
          const alpha = cellOpacities.get(key)
          if (alpha) {
            ctx.globalAlpha = alpha
            ctx.fillStyle = hoverFillColor
            ctx.fillRect(sx, sy, squareSize, squareSize)
            ctx.globalAlpha = 1
          }
          ctx.strokeStyle = borderColor
          ctx.strokeRect(sx, sy, squareSize, squareSize)
        }
      }
    }

    const updateOpacities = () => {
      const targets = new Map<string, number>()
      if (hoveredSquare) targets.set(`${hoveredSquare.x},${hoveredSquare.y}`, 1)
      if (hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.length; i++) {
          const t = trailCells[i]
          const k = `${t.x},${t.y}`
          if (!targets.has(k)) targets.set(k, (trailCells.length - i) / (trailCells.length + 1))
        }
      }
      for (const [k] of targets) { if (!cellOpacities.has(k)) cellOpacities.set(k, 0) }
      for (const [k, op] of cellOpacities) {
        const target = targets.get(k) ?? 0
        const next = op + (target - op) * 0.15
        if (next < 0.005) cellOpacities.delete(k)
        else cellOpacities.set(k, next)
      }
    }

    const sp = Math.max(speed, 0.1)
    const wrap = squareSize

    const animate = () => {
      if (direction === 'right') gridOffset.x = (gridOffset.x - sp + wrap) % wrap
      else if (direction === 'left') gridOffset.x = (gridOffset.x + sp + wrap) % wrap
      else if (direction === 'up') gridOffset.y = (gridOffset.y + sp + wrap) % wrap
      else if (direction === 'down') gridOffset.y = (gridOffset.y - sp + wrap) % wrap
      else if (direction === 'diagonal') {
        gridOffset.x = (gridOffset.x - sp + wrap) % wrap
        gridOffset.y = (gridOffset.y - sp + wrap) % wrap
      }
      updateOpacities()
      drawGrid()
      rafId = requestAnimationFrame(animate)
    }

    const eventTarget = canvas.parentElement || canvas

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const offX = ((gridOffset.x % squareSize) + squareSize) % squareSize
      const offY = ((gridOffset.y % squareSize) + squareSize) % squareSize
      const col = Math.floor((mx - offX) / squareSize)
      const row = Math.floor((my - offY) / squareSize)
      if (!hoveredSquare || hoveredSquare.x !== col || hoveredSquare.y !== row) {
        if (hoveredSquare && hoverTrailAmount > 0) {
          trailCells.unshift({ ...hoveredSquare })
          if (trailCells.length > hoverTrailAmount) trailCells.length = hoverTrailAmount
        }
        hoveredSquare = { x: col, y: row }
      }
    }

    const onLeave = () => {
      if (hoveredSquare && hoverTrailAmount > 0) {
        trailCells.unshift({ ...hoveredSquare })
        if (trailCells.length > hoverTrailAmount) trailCells.length = hoverTrailAmount
      }
      hoveredSquare = null
    }

    eventTarget.addEventListener('mousemove', onMove)
    eventTarget.addEventListener('mouseleave', onLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
      eventTarget.removeEventListener('mousemove', onMove)
      eventTarget.removeEventListener('mouseleave', onLeave)
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize, hoverTrailAmount])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
    />
  )
}
