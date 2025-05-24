"use client"

import type React from "react"
import { useRef, useCallback, useState } from "react"
import type { CanvasElement, Tool, CanvasSize, Point } from "@/types/canvas"
import { ShapeRenderer } from "./shape-renderer"
import { generateId } from "@/utils/canvas-utils"

interface CanvasProps {
  elements: CanvasElement[]
  selectedElements: string[]
  canvasSize: CanvasSize
  zoom: number
  pan: Point
  activeTool: Tool
  onElementAdd: (element: CanvasElement) => void
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void
  onElementSelect: (id: string, multiSelect?: boolean) => void
  onClearSelection: () => void
  onZoomChange: (zoom: number) => void
  onPanChange: (pan: Point) => void
}

export function Canvas({
  elements,
  selectedElements,
  canvasSize,
  zoom,
  pan,
  activeTool,
  onElementAdd,
  onElementUpdate,
  onElementSelect,
  onClearSelection,
  onZoomChange,
  onPanChange,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<Point>({ x: 0, y: 0 })

  const getCanvasSize = () => {
    switch (canvasSize) {
      case "a4-portrait":
        return { width: 794, height: 1123 }
      case "a4-landscape":
        return { width: 1123, height: 794 }
      case "infinite":
        return { width: 5000, height: 5000 }
      default:
        return { width: 1200, height: 800 }
    }
  }

  const canvasDimensions = getCanvasSize()

  const screenToCanvas = useCallback(
    (screenPoint: Point): Point => {
      if (!canvasRef.current) return screenPoint

      const rect = canvasRef.current.getBoundingClientRect()
      return {
        x: (screenPoint.x - rect.left - pan.x) / zoom,
        y: (screenPoint.y - rect.top - pan.y) / zoom,
      }
    },
    [zoom, pan],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const canvasPoint = screenToCanvas({ x: e.clientX, y: e.clientY })

      if (activeTool === "pan" || e.button === 1 || (e.ctrlKey && activeTool === "select")) {
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })
        return
      }

      if (activeTool === "select") {
        const clickedElement = elements.find(
          (el) =>
            canvasPoint.x >= el.x &&
            canvasPoint.x <= el.x + el.width &&
            canvasPoint.y >= el.y &&
            canvasPoint.y <= el.y + el.height,
        )

        if (clickedElement) {
          onElementSelect(clickedElement.id, e.shiftKey)
        } else {
          onClearSelection()
        }
      } else if (activeTool !== "select" && activeTool !== "pan") {
        setIsDrawing(true)
        setDrawStart(canvasPoint)
      }
    },
    [activeTool, elements, screenToCanvas, onElementSelect, onClearSelection],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        onPanChange({
          x: pan.x + deltaX,
          y: pan.y + deltaY,
        })
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    },
    [isDragging, dragStart, pan, onPanChange],
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setIsDragging(false)
        return
      }

      if (isDrawing && activeTool !== "select" && activeTool !== "pan") {
        const canvasPoint = screenToCanvas({ x: e.clientX, y: e.clientY })

        const width = Math.abs(canvasPoint.x - drawStart.x) || 100
        const height = Math.abs(canvasPoint.y - drawStart.y) || 60
        const x = Math.min(drawStart.x, canvasPoint.x)
        const y = Math.min(drawStart.y, canvasPoint.y)

        const newElement: CanvasElement = {
          id: generateId(),
          type: activeTool as any,
          x,
          y,
          width,
          height,
          text: activeTool === "text" ? "Double click to edit" : "",
          style: {
            fill: activeTool === "mindmap-node" ? "#e3f2fd" : "#f5f5f5",
            stroke: "#333",
            strokeWidth: 2,
            fontSize: 14,
            fontFamily: "Arial",
            textAlign: "center",
          },
        }

        onElementAdd(newElement)
        setIsDrawing(false)
      }
    },
    [isDrawing, activeTool, drawStart, screenToCanvas, onElementAdd],
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(3, zoom * delta))
      onZoomChange(newZoom)
    },
    [zoom, onZoomChange],
  )

  return (
    <div
      ref={canvasRef}
      className="w-full h-full overflow-hidden cursor-crosshair relative bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: activeTool === "pan" ? "grab" : activeTool === "select" ? "default" : "crosshair",
      }}
    >
      <div
        className="absolute bg-white border border-gray-300 shadow-lg"
        style={{
          width: canvasDimensions.width * zoom,
          height: canvasDimensions.height * zoom,
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: "0 0",
        }}
      >
        <svg width={canvasDimensions.width * zoom} height={canvasDimensions.height * zoom} className="absolute inset-0">
          <defs>
            <pattern id="grid" width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse">
              <path d={`M ${20 * zoom} 0 L 0 0 0 ${20 * zoom}`} fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {elements.map((element) => (
          <ShapeRenderer
            key={element.id}
            element={element}
            isSelected={selectedElements.includes(element.id)}
            zoom={zoom}
            onUpdate={(updates) => onElementUpdate(element.id, updates)}
            onSelect={() => onElementSelect(element.id)}
          />
        ))}
      </div>
    </div>
  )
}
