"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Grid3X3, RotateCcw, Combine, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GridConfig, GridArea, ChartColorsConfig, GlobalStyle } from "@/lib/types"
import { ChartAreaSpacing } from "./chart-area-spacing"
import { DefaultChartColorsConfig } from "./chart-colors-config"
import { ChartHeaderConfigPanel } from "./chart-header-config"
import type { ChartHeaderConfig } from "@/lib/types"

interface GridConfigPanelProps {
  config: GridConfig
  onChange: (config: GridConfig) => void
  areas: GridArea[]
  onAreasChange: (areas: GridArea[]) => void
  defaultChartColors: ChartColorsConfig
  onDefaultChartColorsChange: (colors: ChartColorsConfig) => void
  globalStyles: GlobalStyle[]
}

export function GridConfigPanel({
  config,
  onChange,
  areas,
  onAreasChange,
  defaultChartColors,
  onDefaultChartColorsChange,
  globalStyles,
}: GridConfigPanelProps) {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const [expandedSection, setExpandedSection] = useState<"grid" | "areas" | null>("grid")

  const [chartHeaderConfig, setChartHeaderConfig] = useState<ChartHeaderConfig>({
    showTitle: true,
    showSubtitle: true,
    useNativeTitle: false,
  })

  const handleChange = (key: keyof GridConfig, value: string) => {
    const numValue = Number.parseInt(value) || 0
    onChange({ ...config, [key]: numValue })
  }

  const getCellKey = (row: number, col: number) => `${row}-${col}`

  const getCellArea = (row: number, col: number): GridArea | undefined => {
    return areas.find(
      (area) => row >= area.startRow && row <= area.endRow && col >= area.startCol && col <= area.endCol,
    )
  }

  const handleCellMouseDown = (row: number, col: number) => {
    const area = getCellArea(row, col)
    if (area) return

    setIsDragging(true)
    setSelectedCells(new Set([getCellKey(row, col)]))
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isDragging) return
    const area = getCellArea(row, col)
    if (area) return

    setSelectedCells((prev) => {
      const newSet = new Set(prev)
      newSet.add(getCellKey(row, col))
      return newSet
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMerge = useCallback(() => {
    if (selectedCells.size < 2) return

    const cells = Array.from(selectedCells).map((key) => {
      const [row, col] = key.split("-").map(Number)
      return { row, col }
    })

    const startRow = Math.min(...cells.map((c) => c.row))
    const endRow = Math.max(...cells.map((c) => c.row))
    const startCol = Math.min(...cells.map((c) => c.col))
    const endCol = Math.max(...cells.map((c) => c.col))

    const newArea: GridArea = {
      id: `area-${Date.now()}`,
      name: `Area ${areas.length + 1}`,
      startRow,
      startCol,
      endRow,
      endCol,
    }

    onAreasChange([...areas, newArea])
    setSelectedCells(new Set())
  }, [selectedCells, areas, onAreasChange])

  const handleReset = () => {
    onAreasChange([])
    setSelectedCells(new Set())
  }

  const handleRemoveArea = (areaId: string) => {
    onAreasChange(areas.filter((a) => a.id !== areaId))
  }

  const getAreaLabel = (area: GridArea) => {
    const rowSpan = area.endRow - area.startRow + 1
    const colSpan = area.endCol - area.startCol + 1
    return `${rowSpan}×${colSpan}`
  }

  const renderGrid = () => {
    const cells: React.ReactNode[] = []
    const renderedAreas = new Set<string>()

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const cellKey = getCellKey(row, col)
        const area = getCellArea(row, col)
        const isSelected = selectedCells.has(cellKey)

        if (area) {
          if (!renderedAreas.has(area.id)) {
            renderedAreas.add(area.id)
            const rowSpan = area.endRow - area.startRow + 1
            const colSpan = area.endCol - area.startCol + 1
            cells.push(
              <div
                key={area.id}
                className="bg-primary/20 rounded border-2 border-primary/40 flex items-center justify-center text-xs font-medium text-primary cursor-pointer hover:bg-primary/30 transition-colors"
                style={{
                  gridRow: `${area.startRow + 1} / span ${rowSpan}`,
                  gridColumn: `${area.startCol + 1} / span ${colSpan}`,
                }}
                onClick={() => handleRemoveArea(area.id)}
                title="Click to unmerge"
              >
                {getAreaLabel(area)}
              </div>,
            )
          }
        } else {
          cells.push(
            <div
              key={cellKey}
              className={cn(
                "rounded border transition-colors cursor-crosshair",
                isSelected ? "bg-primary/30 border-primary" : "bg-muted/30 border-border hover:bg-muted/50",
              )}
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
              }}
              onMouseDown={() => handleCellMouseDown(row, col)}
              onMouseEnter={() => handleCellMouseEnter(row, col)}
            />,
          )
        }
      }
    }

    return cells
  }

  return (
    <div className="space-y-3" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Grid Section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === "grid" ? null : "grid")}
          className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span className="text-sm font-medium">Grid Layout</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSection === "grid" && "rotate-180")} />
        </button>
        {expandedSection === "grid" && (
          <div className="p-3 space-y-3">
            {/* Rows & Cols */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Rows</Label>
                <Input
                  type="number"
                  value={config.rows}
                  onChange={(e) => handleChange("rows", e.target.value)}
                  className="h-8 text-sm"
                  min={1}
                  max={12}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Cols</Label>
                <Input
                  type="number"
                  value={config.cols}
                  onChange={(e) => handleChange("cols", e.target.value)}
                  className="h-8 text-sm"
                  min={1}
                  max={12}
                />
              </div>
            </div>

            {/* Visual Grid Editor */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Merge Areas (drag to select)</Label>
              <div
                className="relative w-full aspect-[4/3] bg-background rounded-lg border border-border p-2"
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                  gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                  gap: "4px",
                }}
              >
                {renderGrid()}
              </div>
            </div>

            {/* Merge/Reset buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="flex-1 h-8 bg-transparent"
                disabled={areas.length === 0}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset
              </Button>
              <Button size="sm" onClick={handleMerge} className="flex-1 h-8" disabled={selectedCells.size < 2}>
                <Combine className="h-3.5 w-3.5 mr-1.5" />
                Merge
              </Button>
            </div>
          </div>
        )}
      </div>

      <ChartAreaSpacing config={config} onChange={onChange} />

      <ChartHeaderConfigPanel config={chartHeaderConfig} onChange={setChartHeaderConfig} globalStyles={globalStyles} />

      <DefaultChartColorsConfig
        defaultColors={defaultChartColors}
        onDefaultColorsChange={onDefaultChartColorsChange}
        globalStyles={globalStyles}
      />

      {/* Areas Section */}
      {areas.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === "areas" ? null : "areas")}
            className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium">Merged Areas ({areas.length})</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSection === "areas" && "rotate-180")} />
          </button>
          {expandedSection === "areas" && (
            <div className="p-2 space-y-1">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded bg-muted/30 text-sm"
                >
                  <span>{area.name}</span>
                  <span className="text-xs text-muted-foreground">{getAreaLabel(area)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
