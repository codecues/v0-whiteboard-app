"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { CanvasSize } from "@/types/canvas"

interface CanvasControlsProps {
  canvasSize: CanvasSize
  zoom: number
  onCanvasSizeChange: (size: CanvasSize) => void
  onZoomChange: (zoom: number) => void
  onResetView: () => void
}

export function CanvasControls({
  canvasSize,
  zoom,
  onCanvasSizeChange,
  onZoomChange,
  onResetView,
}: CanvasControlsProps) {
  const zoomIn = () => onZoomChange(Math.min(3, zoom * 1.2))
  const zoomOut = () => onZoomChange(Math.max(0.1, zoom / 1.2))

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 border">
      <Select value={canvasSize} onValueChange={onCanvasSizeChange}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a4-portrait">A4 Portrait</SelectItem>
          <SelectItem value="a4-landscape">A4 Landscape</SelectItem>
          <SelectItem value="infinite">Infinite</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={zoomOut} className="h-8 w-8 p-0">
          <ZoomOut className="w-3 h-3" />
        </Button>

        <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>

        <Button variant="outline" size="sm" onClick={zoomIn} className="h-8 w-8 p-0">
          <ZoomIn className="w-3 h-3" />
        </Button>
      </div>

      <Button variant="outline" size="sm" onClick={onResetView} className="h-8 flex items-center gap-1">
        <RotateCcw className="w-3 h-3" />
        <span className="text-xs">Reset</span>
      </Button>
    </div>
  )
}
