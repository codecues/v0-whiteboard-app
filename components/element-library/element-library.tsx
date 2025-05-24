"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CanvasElement, Tool } from "@/types/canvas"
import { generateId } from "@/utils/canvas-utils"

interface ElementLibraryProps {
  onAddElement: (element: CanvasElement) => void
  activeTool: Tool
}

export function ElementLibrary({ onAddElement, activeTool }: ElementLibraryProps) {
  const mindMapElements = [
    {
      type: "mindmap-node",
      label: "Central Node",
      style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: 3 },
    },
    {
      type: "mindmap-node",
      label: "Child Node",
      style: { fill: "#f3e5f5", stroke: "#7b1fa2", strokeWidth: 2 },
    },
    {
      type: "mindmap-node",
      label: "Sub Node",
      style: { fill: "#e8f5e8", stroke: "#388e3c", strokeWidth: 2 },
    },
  ]

  const flowchartElements = [
    {
      type: "process",
      label: "Process",
      style: { fill: "#f5f5f5", stroke: "#333", strokeWidth: 2 },
    },
    {
      type: "decision",
      label: "Decision",
      style: { fill: "#fff3cd", stroke: "#856404", strokeWidth: 2 },
    },
    {
      type: "rectangle",
      label: "Terminator",
      style: { fill: "#f8d7da", stroke: "#721c24", strokeWidth: 2 },
    },
    {
      type: "rectangle",
      label: "Input/Output",
      style: { fill: "#d1ecf1", stroke: "#0c5460", strokeWidth: 2 },
    },
  ]

  const basicShapes = [
    {
      type: "rectangle",
      label: "Rectangle",
      style: { fill: "#f5f5f5", stroke: "#333", strokeWidth: 2 },
    },
    {
      type: "circle",
      label: "Circle",
      style: { fill: "#f5f5f5", stroke: "#333", strokeWidth: 2 },
    },
    {
      type: "diamond",
      label: "Diamond",
      style: { fill: "#f5f5f5", stroke: "#333", strokeWidth: 2 },
    },
    {
      type: "text",
      label: "Text",
      style: { fontSize: 16, fontFamily: "Arial", stroke: "#333" },
    },
  ]

  const createElement = (type: string, style: any, text: string) => {
    const element: CanvasElement = {
      id: generateId(),
      type: type as any,
      x: 100,
      y: 100,
      width: type === "text" ? 200 : 120,
      height: type === "text" ? 40 : 80,
      text,
      style,
    }
    onAddElement(element)
  }

  const renderElementPreview = (element: any) => {
    const previewStyle = {
      width: "60px",
      height: "40px",
      backgroundColor: element.style.fill || "transparent",
      border: `2px solid ${element.style.stroke || "#333"}`,
      borderRadius:
        element.type === "circle" || element.type === "mindmap-node"
          ? "50%"
          : element.type === "diamond" || element.type === "decision"
            ? "0"
            : "4px",
      transform: element.type === "diamond" || element.type === "decision" ? "rotate(45deg)" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      cursor: "pointer",
    }

    return (
      <div
        style={previewStyle}
        onClick={() => createElement(element.type, element.style, element.label)}
        className="hover:shadow-md transition-shadow"
      >
        {element.type !== "diamond" && element.type !== "decision" && (
          <span style={{ transform: element.type === "diamond" ? "rotate(-45deg)" : "none" }}>
            {element.type === "text" ? "T" : ""}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Mind Map Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mindMapElements.map((element, index) => (
            <div key={index} className="flex items-center gap-2">
              {renderElementPreview(element)}
              <span className="text-xs">{element.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Flowchart Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {flowchartElements.map((element, index) => (
            <div key={index} className="flex items-center gap-2">
              {renderElementPreview(element)}
              <span className="text-xs">{element.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Basic Shapes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {basicShapes.map((element, index) => (
            <div key={index} className="flex items-center gap-2">
              {renderElementPreview(element)}
              <span className="text-xs">{element.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <div className="text-xs text-gray-500">
        <p className="mb-2">Tips:</p>
        <ul className="space-y-1">
          <li>• Click elements to add to canvas</li>
          <li>• Double-click shapes to edit text</li>
          <li>• Use Ctrl+Z/Y for undo/redo</li>
          <li>• Ctrl+D to duplicate selected</li>
        </ul>
      </div>
    </div>
  )
}
