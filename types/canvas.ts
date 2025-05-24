export type Tool =
  | "select"
  | "pan"
  | "rectangle"
  | "circle"
  | "diamond"
  | "text"
  | "mindmap-node"
  | "process"
  | "decision"

export type CanvasSize = "a4-portrait" | "a4-landscape" | "infinite"

export interface Point {
  x: number
  y: number
}

export interface CanvasElement {
  id: string
  type: Tool
  x: number
  y: number
  width: number
  height: number
  text?: string
  style?: {
    fill?: string
    stroke?: string
    strokeWidth?: number
    fontSize?: number
    fontFamily?: string
    textAlign?: "left" | "center" | "right"
  }
}

export interface HistoryEntry {
  id: string
  name: string
  timestamp: Date
  elements: CanvasElement[]
}
