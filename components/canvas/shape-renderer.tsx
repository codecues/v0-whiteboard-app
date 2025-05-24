"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import type { CanvasElement } from "@/types/canvas"

interface ShapeRendererProps {
  element: CanvasElement
  isSelected: boolean
  zoom: number
  onUpdate: (updates: Partial<CanvasElement>) => void
  onSelect: () => void
}

export function ShapeRenderer({ element, isSelected, zoom, onUpdate, onSelect }: ShapeRendererProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect()

      if (e.detail === 2) {
        // Double click
        setIsEditing(true)
        return
      }

      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    },
    [onSelect],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        onUpdate({
          x: element.x + deltaX,
          y: element.y + deltaY,
        })

        setDragStart({ x: e.clientX, y: e.clientY })
      }
    },
    [isDragging, dragStart, zoom, element.x, element.y, onUpdate],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  const handleTextChange = useCallback(
    (newText: string) => {
      onUpdate({ text: newText })
      setIsEditing(false)
    },
    [onUpdate],
  )

  const renderShape = () => {
    const style = element.style || {}

    switch (element.type) {
      case "rectangle":
      case "process":
        return (
          <div
            className="absolute border-2 flex items-center justify-center"
            style={{
              left: element.x * zoom,
              top: element.y * zoom,
              width: element.width * zoom,
              height: element.height * zoom,
              backgroundColor: style.fill || "#f5f5f5",
              borderColor: style.stroke || "#333",
              borderWidth: (style.strokeWidth || 2) * zoom,
              fontSize: (style.fontSize || 14) * zoom,
              fontFamily: style.fontFamily || "Arial",
            }}
          >
            {isEditing ? (
              <input
                type="text"
                value={element.text || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                className="w-full h-full text-center bg-transparent border-none outline-none"
                autoFocus
              />
            ) : (
              <span className="text-center px-2">{element.text}</span>
            )}
          </div>
        )

      case "circle":
      case "mindmap-node":
        return (
          <div
            className="absolute border-2 rounded-full flex items-center justify-center"
            style={{
              left: element.x * zoom,
              top: element.y * zoom,
              width: element.width * zoom,
              height: element.height * zoom,
              backgroundColor: style.fill || "#e3f2fd",
              borderColor: style.stroke || "#333",
              borderWidth: (style.strokeWidth || 2) * zoom,
              fontSize: (style.fontSize || 14) * zoom,
              fontFamily: style.fontFamily || "Arial",
            }}
          >
            {isEditing ? (
              <input
                type="text"
                value={element.text || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                className="w-full h-full text-center bg-transparent border-none outline-none rounded-full"
                autoFocus
              />
            ) : (
              <span className="text-center px-2">{element.text}</span>
            )}
          </div>
        )

      case "diamond":
      case "decision":
        return (
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: element.x * zoom,
              top: element.y * zoom,
              width: element.width * zoom,
              height: element.height * zoom,
              transform: "rotate(45deg)",
              backgroundColor: style.fill || "#fff3cd",
              border: `${(style.strokeWidth || 2) * zoom}px solid ${style.stroke || "#333"}`,
              fontSize: (style.fontSize || 14) * zoom,
              fontFamily: style.fontFamily || "Arial",
            }}
          >
            <div style={{ transform: "rotate(-45deg)" }}>
              {isEditing ? (
                <input
                  type="text"
                  value={element.text || ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                  className="w-full text-center bg-transparent border-none outline-none"
                  autoFocus
                />
              ) : (
                <span className="text-center px-2">{element.text}</span>
              )}
            </div>
          </div>
        )

      case "text":
        return (
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: element.x * zoom,
              top: element.y * zoom,
              width: element.width * zoom,
              height: element.height * zoom,
              fontSize: (style.fontSize || 14) * zoom,
              fontFamily: style.fontFamily || "Arial",
              color: style.stroke || "#333",
            }}
          >
            {isEditing ? (
              <textarea
                value={element.text || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                className="w-full h-full bg-transparent border-none outline-none resize-none"
                autoFocus
              />
            ) : (
              <span className="text-center">{element.text}</span>
            )}
          </div>
        )

      default:
        return (
          <div
            className="absolute border-2 flex items-center justify-center"
            style={{
              left: element.x * zoom,
              top: element.y * zoom,
              width: element.width * zoom,
              height: element.height * zoom,
              backgroundColor: style.fill || "#f5f5f5",
              borderColor: style.stroke || "#333",
              borderWidth: (style.strokeWidth || 2) * zoom,
            }}
          >
            <span>{element.text}</span>
          </div>
        )
    }
  }

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative ${isDragging ? "cursor-move" : "cursor-pointer"}`}
    >
      {renderShape()}

      {isSelected && (
        <>
          {/* Selection border */}
          <div
            className="absolute border-2 border-blue-500 border-dashed pointer-events-none"
            style={{
              left: (element.x - 2) * zoom,
              top: (element.y - 2) * zoom,
              width: (element.width + 4) * zoom,
              height: (element.height + 4) * zoom,
            }}
          />

          {/* Resize handles */}
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white cursor-nw-resize"
            style={{
              left: (element.x - 4) * zoom,
              top: (element.y - 4) * zoom,
            }}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white cursor-ne-resize"
            style={{
              left: (element.x + element.width - 4) * zoom,
              top: (element.y - 4) * zoom,
            }}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white cursor-sw-resize"
            style={{
              left: (element.x - 4) * zoom,
              top: (element.y + element.height - 4) * zoom,
            }}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white cursor-se-resize"
            style={{
              left: (element.x + element.width - 4) * zoom,
              top: (element.y + element.height - 4) * zoom,
            }}
          />
        </>
      )}
    </div>
  )
}
