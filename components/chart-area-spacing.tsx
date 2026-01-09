"use client"

import { useState } from "react"
import { ChevronDown, Box, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { GridConfig } from "@/lib/types"

interface ChartAreaSpacingProps {
  config: GridConfig
  onChange: (config: GridConfig) => void
}

export function ChartAreaSpacing({ config, onChange }: ChartAreaSpacingProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleChange = (key: keyof GridConfig, value: string) => {
    const numValue = Number.parseInt(value) || 0
    onChange({ ...config, [key]: numValue })
  }

  // Calculate visual preview values
  const chartAreaGap = (config.outerPadding || 0) * 2 // Space between chart areas = 2x margin

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Chart Area Spacing</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
      </button>

      {isExpanded && (
        <div className="p-3 space-y-4">
          {/* Visual Preview */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="relative w-full aspect-[16/10] bg-background rounded border border-border">
              {/* Outer padding indicator */}
              <div
                className="absolute inset-0 border-2 border-dashed border-blue-300 rounded"
                style={{ margin: `${Math.min(config.innerPadding / 4, 12)}px` }}
              >
                {/* Grid cells with gap */}
                <div
                  className="w-full h-full grid grid-cols-3 grid-rows-2"
                  style={{ gap: `${Math.min(chartAreaGap / 4, 8)}px`, padding: "4px" }}
                >
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="relative bg-muted rounded border border-border">
                      {/* Inner padding indicator */}
                      <div
                        className="absolute inset-0 border border-dashed border-green-400 rounded"
                        style={{ margin: `${Math.min(config.innerPadding / 8, 4)}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 border-t-2 border-dashed border-blue-300" />
                <span className="text-muted-foreground">Grid padding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 border-t border-dashed border-green-400" />
                <span className="text-muted-foreground">Chart padding</span>
              </div>
            </div>
          </div>

          {/* Spacing controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Box className="h-3 w-3" />
                Chart Padding
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={config.innerPadding}
                  onChange={(e) => handleChange("innerPadding", e.target.value)}
                  className="h-8 text-sm pr-8"
                  min={0}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Inside each chart area</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3 w-3" />
                Chart Margin
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={config.outerPadding}
                  onChange={(e) => handleChange("outerPadding", e.target.value)}
                  className="h-8 text-sm pr-8"
                  min={0}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Gap = {chartAreaGap}px (2× margin)</p>
            </div>
          </div>

          {/* Grid Gutter (outer padding of the whole grid) */}
          <div className="pt-2 border-t border-border">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Grid Padding (outer)</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={config.gutter}
                  onChange={(e) => handleChange("gutter", e.target.value)}
                  className="h-8 text-sm pr-8"
                  min={0}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Padding around entire chart grid</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
