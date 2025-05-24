"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MousePointer,
  Square,
  Circle,
  Diamond,
  Type,
  Hand,
  Undo,
  Redo,
  Save,
  Shapes,
  History,
  Copy,
  Trash2,
} from "lucide-react"
import type { Tool } from "@/types/canvas"

interface ToolbarProps {
  activeTool: Tool
  onToolChange: (tool: Tool) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onSave: () => void
  onToggleElementLibrary: () => void
  onToggleHistory: () => void
  selectedElements: string[]
  onDeleteSelected: () => void
  onDuplicateSelected: () => void
}

export function Toolbar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onToggleElementLibrary,
  onToggleHistory,
  selectedElements,
  onDeleteSelected,
  onDuplicateSelected,
}: ToolbarProps) {
  const tools = [
    { id: "select" as Tool, icon: MousePointer, label: "Select" },
    { id: "pan" as Tool, icon: Hand, label: "Pan" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "diamond" as Tool, icon: Diamond, label: "Diamond" },
    { id: "text" as Tool, icon: Type, label: "Text" },
  ]

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-200 shadow-sm">
      {/* File operations */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onSave} className="flex items-center gap-1">
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History operations */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} className="flex items-center gap-1">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo} className="flex items-center gap-1">
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className="flex items-center gap-1"
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          )
        })}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Element operations */}
      {selectedElements.length > 0 && (
        <>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onDuplicateSelected} className="flex items-center gap-1">
              <Copy className="w-4 h-4" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteSelected}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* Panel toggles */}
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="outline" size="sm" onClick={onToggleElementLibrary} className="flex items-center gap-1">
          <Shapes className="w-4 h-4" />
          Elements
        </Button>
        <Button variant="outline" size="sm" onClick={onToggleHistory} className="flex items-center gap-1">
          <History className="w-4 h-4" />
          History
        </Button>
      </div>
    </div>
  )
}
