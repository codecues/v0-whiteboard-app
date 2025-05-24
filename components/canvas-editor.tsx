"use client"

import { useState, useCallback, useEffect } from "react"
import { Canvas } from "./canvas/canvas"
import { Toolbar } from "./toolbar/toolbar"
import { ElementLibrary } from "./element-library/element-library"
import { CanvasControls } from "./canvas-controls/canvas-controls"
import { HistoryPanel } from "./history/history-panel"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { useCanvasHistory } from "@/hooks/use-canvas-history"
import type { CanvasElement, Tool } from "@/types/canvas"

export function CanvasEditor() {
  const {
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
  } = useCanvasState()

  const { history, currentVersion, canUndo, canRedo, undo, redo, saveVersion, restoreVersion, pushToHistory } =
    useCanvasHistory(elements)

  const [activeTool, setActiveTool] = useState<Tool>("select")
  const [showElementLibrary, setShowElementLibrary] = useState(true)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (elements.length > 0) {
        saveVersion(`Auto-save ${new Date().toLocaleTimeString()}`)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSave)
  }, [elements, saveVersion])

  const handleElementAdd = useCallback(
    (element: CanvasElement) => {
      addElement(element)
      pushToHistory()
    },
    [addElement, pushToHistory],
  )

  const handleElementUpdate = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      updateElement(id, updates)
      pushToHistory()
    },
    [updateElement, pushToHistory],
  )

  const handleElementDelete = useCallback(
    (id: string) => {
      deleteElement(id)
      pushToHistory()
    },
    [deleteElement, pushToHistory],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "y":
            e.preventDefault()
            redo()
            break
          case "s":
            e.preventDefault()
            saveVersion(`Manual save ${new Date().toLocaleTimeString()}`)
            break
          case "d":
            e.preventDefault()
            if (selectedElements.length > 0) {
              selectedElements.forEach((id) => {
                const element = elements.find((el) => el.id === id)
                if (element) {
                  duplicateElement(element)
                }
              })
              pushToHistory()
            }
            break
          case "Delete":
          case "Backspace":
            e.preventDefault()
            selectedElements.forEach((id) => handleElementDelete(id))
            break
        }
      }
    },
    [undo, redo, saveVersion, selectedElements, elements, duplicateElement, pushToHistory, handleElementDelete],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onSave={() => saveVersion(`Manual save ${new Date().toLocaleTimeString()}`)}
        onToggleElementLibrary={() => setShowElementLibrary(!showElementLibrary)}
        onToggleHistory={() => setShowHistoryPanel(!showHistoryPanel)}
        selectedElements={selectedElements}
        onDeleteSelected={() => selectedElements.forEach((id) => handleElementDelete(id))}
        onDuplicateSelected={() => {
          selectedElements.forEach((id) => {
            const element = elements.find((el) => el.id === id)
            if (element) {
              duplicateElement(element)
            }
          })
          pushToHistory()
        }}
      />

      <div className="flex-1 flex">
        {showElementLibrary && <ElementLibrary onAddElement={handleElementAdd} activeTool={activeTool} />}

        <div className="flex-1 relative">
          <Canvas
            elements={elements}
            selectedElements={selectedElements}
            canvasSize={canvasSize}
            zoom={zoom}
            pan={pan}
            activeTool={activeTool}
            onElementAdd={handleElementAdd}
            onElementUpdate={handleElementUpdate}
            onElementSelect={selectElement}
            onClearSelection={clearSelection}
            onZoomChange={setZoom}
            onPanChange={setPan}
          />

          <CanvasControls
            canvasSize={canvasSize}
            zoom={zoom}
            onCanvasSizeChange={setCanvasSize}
            onZoomChange={setZoom}
            onResetView={() => {
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }}
          />
        </div>

        {showHistoryPanel && (
          <HistoryPanel
            history={history}
            currentVersion={currentVersion}
            onRestoreVersion={restoreVersion}
            onSaveVersion={saveVersion}
          />
        )}
      </div>
    </div>
  )
}
