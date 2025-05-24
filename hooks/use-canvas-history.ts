"use client"

import { useState, useCallback, useRef } from "react"
import type { CanvasElement, HistoryEntry } from "@/types/canvas"
import { generateId } from "@/utils/canvas-utils"

export function useCanvasHistory(elements: CanvasElement[]) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentVersion, setCurrentVersion] = useState(-1)
  const [undoStack, setUndoStack] = useState<CanvasElement[][]>([])
  const [redoStack, setRedoStack] = useState<CanvasElement[][]>([])
  const lastElementsRef = useRef<CanvasElement[]>([])

  const pushToHistory = useCallback(() => {
    // Only push if elements have actually changed
    if (JSON.stringify(elements) !== JSON.stringify(lastElementsRef.current)) {
      setUndoStack((prev) => [...prev.slice(-19), [...lastElementsRef.current]]) // Keep last 20 states
      setRedoStack([]) // Clear redo stack when new action is performed
      lastElementsRef.current = [...elements]
    }
  }, [elements])

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1]
      setRedoStack((prev) => [lastElementsRef.current, ...prev])
      setUndoStack((prev) => prev.slice(0, -1))
      lastElementsRef.current = previousState
      return previousState
    }
    return null
  }, [undoStack])

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0]
      setUndoStack((prev) => [...prev, lastElementsRef.current])
      setRedoStack((prev) => prev.slice(1))
      lastElementsRef.current = nextState
      return nextState
    }
    return null
  }, [redoStack])

  const saveVersion = useCallback(
    (name: string) => {
      const newEntry: HistoryEntry = {
        id: generateId(),
        name,
        timestamp: new Date(),
        elements: [...elements],
      }

      setHistory((prev) => [newEntry, ...prev])
      setCurrentVersion(0)
    },
    [elements],
  )

  const restoreVersion = useCallback(
    (version: number) => {
      if (version >= 0 && version < history.length) {
        setCurrentVersion(version)
        return history[version].elements
      }
      return null
    },
    [history],
  )

  return {
    history,
    currentVersion,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undo,
    redo,
    saveVersion,
    restoreVersion,
    pushToHistory,
  }
}
