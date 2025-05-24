"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, RotateCcw, Save } from "lucide-react"
import type { HistoryEntry } from "@/types/canvas"

interface HistoryPanelProps {
  history: HistoryEntry[]
  currentVersion: number
  onRestoreVersion: (version: number) => void
  onSaveVersion: (name: string) => void
}

export function HistoryPanel({ history, currentVersion, onRestoreVersion, onSaveVersion }: HistoryPanelProps) {
  const [versionName, setVersionName] = useState("")

  const handleSaveVersion = () => {
    if (versionName.trim()) {
      onSaveVersion(versionName.trim())
      setVersionName("")
    }
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Save Version</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Version name..."
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveVersion()}
            className="text-xs"
          />
          <Button onClick={handleSaveVersion} disabled={!versionName.trim()} size="sm" className="w-full">
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-2 rounded border text-xs ${
                    index === currentVersion ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{entry.name}</span>
                    {index !== currentVersion && (
                      <Button variant="ghost" size="sm" onClick={() => onRestoreVersion(index)} className="h-6 w-6 p-0">
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{entry.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="text-gray-500">{entry.elements.length} elements</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
