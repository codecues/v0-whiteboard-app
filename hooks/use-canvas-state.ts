"use client"

import { useState, useCallback } from "react"
import type { CanvasElement, CanvasSize, Point } from "@/types/canvas"
import { generateId } from "@/utils/canvas-utils"

export function useCanvasState() {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [canvasSize, setCanvasSize] = useState<CanvasSize>("infinite")
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })

  const addElement = useCallback((element: CanvasElement) => {
    setElements((prev) => [...prev, element])
  }, [])

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }, [])

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
    setSelectedElements((prev) => prev.filter((selectedId) => selectedId !== id))
  }, [])

  const selectElement = useCallback((id: string, multiSelect = false) => {
    setSelectedElements((prev) => {
      if (multiSelect) {
        return prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
      } else {
        return [id]
      }
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedElements([])
  }, [])

  const duplicateElement = useCallback(
    (element: CanvasElement) => {
      const newElement: CanvasElement = {
        ...element,
        id: generateId(),
        x: element.x + 20,
        y: element.y + 20,
      }
      addElement(newElement)
    },
    [addElement],
  )

  const setElementsFromHistory = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements)
    setSelectedElements([])
  }, [])

  return {
    elements,
    selectedElements,
    canvasSize,
    zoom,
    pan,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    clearSelection,
    setCanvasSize,
    setZoom,
    setPan,
    duplicateElement,
    setElementsFromHistory,
  }
}
