"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Plus, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChartConfig, ChartCategory, ChartStyle, ChartColorsConfig } from "@/lib/types"
import { ChartTypeGallery } from "./chart-type-gallery"
import { ChartColorOverride } from "./chart-colors-config"

const sizeOptions = [
  { cols: 2, rows: 1, label: "Small" },
  { cols: 4, rows: 2, label: "Medium" },
  { cols: 6, rows: 3, label: "Large" },
]

interface ChartConfigPanelProps {
  chart: ChartConfig | null
  onUpdate: (chart: ChartConfig) => void
  onClearSelection: () => void
  defaultChartColors: ChartColorsConfig
}

function SelectedChartPreview({ category, style }: { category: ChartCategory; style: ChartStyle }) {
  if (category === "bar") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <rect x="4" y="10" width="8" height="16" fill="currentColor" rx="1" />
        <rect x="16" y="6" width="8" height="20" fill="currentColor" className="opacity-70" rx="1" />
        <rect x="28" y="14" width="8" height="12" fill="currentColor" rx="1" />
      </svg>
    )
  }
  if (category === "line") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <polyline
          points="4,22 14,12 24,16 36,6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (category === "area") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <path d="M4,26 L4,18 L14,10 L24,14 L36,6 L36,26 Z" fill="currentColor" className="opacity-40" />
        <polyline points="4,18 14,10 24,14 36,6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (category === "pie") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <circle cx="20" cy="14" r="10" fill="currentColor" className="opacity-30" />
        <path d="M20,14 L20,4 A10,10 0 0,1 28,20 Z" fill="currentColor" />
      </svg>
    )
  }
  if (category === "scatter") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <circle cx="8" cy="18" r="2.5" fill="currentColor" />
        <circle cx="16" cy="10" r="2.5" fill="currentColor" />
        <circle cx="24" cy="16" r="2.5" fill="currentColor" />
        <circle cx="32" cy="8" r="2.5" fill="currentColor" />
      </svg>
    )
  }
  if (category === "combo") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <rect x="4" y="14" width="6" height="12" fill="currentColor" className="opacity-50" rx="1" />
        <rect x="14" y="10" width="6" height="16" fill="currentColor" className="opacity-50" rx="1" />
        <rect x="24" y="16" width="6" height="10" fill="currentColor" className="opacity-50" rx="1" />
        <polyline points="7,10 17,6 27,12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (category === "funnel") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <path d="M4,4 L36,4 L30,12 L10,12 Z" fill="currentColor" />
        <path d="M10,14 L30,14 L26,22 L14,22 Z" fill="currentColor" className="opacity-60" />
      </svg>
    )
  }
  if (category === "gauge") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <path d="M6,24 A16,16 0 0,1 34,24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <path d="M6,24 A16,16 0 0,1 28,10" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    )
  }
  if (category === "specialized") {
    return (
      <svg viewBox="0 0 40 28" className="w-full h-full">
        <polygon
          points="20,2 34,10 30,26 10,26 6,10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-30"
        />
        <polygon points="20,8 28,12 26,22 14,22 12,12" fill="currentColor" className="opacity-40" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 40 28" className="w-full h-full">
      <rect x="4" y="10" width="8" height="16" fill="currentColor" rx="1" />
      <rect x="16" y="6" width="8" height="20" fill="currentColor" className="opacity-70" rx="1" />
      <rect x="28" y="14" width="8" height="12" fill="currentColor" rx="1" />
    </svg>
  )
}

const categoryLabels: Record<ChartCategory, string> = {
  bar: "Bar Chart",
  line: "Line Chart",
  area: "Area Chart",
  pie: "Pie Chart",
  scatter: "Scatter Plot",
  combo: "Combination",
  funnel: "Funnel",
  gauge: "Gauge",
  specialized: "Specialized",
}

const styleLabels: Record<string, string> = {
  "vertical-bar": "Vertical",
  "horizontal-bar": "Horizontal",
  "stacked-bar": "Stacked",
  "grouped-bar": "Grouped",
  "basic-line": "Basic",
  "smooth-line": "Smooth",
  "stepped-line": "Stepped",
  "multi-line": "Multi-Line",
  "basic-area": "Basic",
  "stacked-area": "Stacked",
  "gradient-area": "Gradient",
  "basic-pie": "Pie",
  donut: "Donut",
  "semi-donut": "Semi-Donut",
  "basic-scatter": "Scatter",
  bubble: "Bubble",
  "bar-line": "Bar + Line",
  "area-line": "Area + Line",
  "basic-funnel": "Funnel",
  "basic-gauge": "Gauge",
  radar: "Radar",
}

const chartColorCount: Record<ChartCategory, 1 | 2> = {
  bar: 2,
  line: 1,
  area: 2,
  pie: 2,
  scatter: 2,
  combo: 2,
  funnel: 2,
  gauge: 1,
  specialized: 2,
}

export function ChartConfigPanel({ chart, onUpdate, onClearSelection, defaultChartColors }: ChartConfigPanelProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<"general" | "aliases" | "styles">("general")

  if (!chart) {
    return null
  }

  const handleFieldChange = (field: string, value: string) => {
    onUpdate({ ...chart, [field]: value })
  }

  const handleAliasChange = (key: string, value: string) => {
    onUpdate({
      ...chart,
      aliases: { ...chart.aliases, [key]: value },
    })
  }

  const handleAddAlias = () => {
    const newKey = `field_${Object.keys(chart.aliases).length + 1}`
    onUpdate({
      ...chart,
      aliases: { ...chart.aliases, [newKey]: "" },
    })
  }

  const handleRemoveAlias = (key: string) => {
    const { [key]: _, ...rest } = chart.aliases
    onUpdate({
      ...chart,
      aliases: rest,
    })
  }

  const handleChartTypeSelect = (category: ChartCategory, style: ChartStyle) => {
    onUpdate({ ...chart, type: { category, style } })
  }

  const handleSizeChange = (width: number, height: number) => {
    onUpdate({ ...chart, width, height })
  }

  const colorCount = chartColorCount[chart.type.category]

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div>
          <h3 className="text-sm font-semibold">{chart.title || "Untitled Chart"}</h3>
          <p className="text-xs text-muted-foreground">{categoryLabels[chart.type.category]}</p>
        </div>
        <button onClick={onClearSelection} className="p-1 hover:bg-muted rounded transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveSection("general")}
          className={cn(
            "flex-1 py-2 text-xs font-medium transition-colors",
            activeSection === "general"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          General
        </button>
        <button
          onClick={() => setActiveSection("aliases")}
          className={cn(
            "flex-1 py-2 text-xs font-medium transition-colors",
            activeSection === "aliases"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Aliases
        </button>
        <button
          onClick={() => setActiveSection("styles")}
          className={cn(
            "flex-1 py-2 text-xs font-medium transition-colors",
            activeSection === "styles"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Styles
        </button>
      </div>

      <ScrollArea className="h-[480px]">
        <div className="p-4 space-y-4">
          {activeSection === "general" ? (
            <>
              {/* Sheet Name */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Sheet Name</Label>
                <Input
                  value={chart.sheetName}
                  onChange={(e) => handleFieldChange("sheetName", e.target.value)}
                  className="h-9 text-sm"
                  placeholder="Enter sheet name"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input
                    value={chart.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="h-9 text-sm"
                    placeholder="Chart title"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Subtitle</Label>
                  <Input
                    value={chart.subtitle}
                    onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                    className="h-9 text-sm"
                    placeholder="Subtitle"
                  />
                </div>
              </div>

              {/* Chart Type Selector */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Chart Type</Label>
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                >
                  <div className="h-12 w-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                    <SelectedChartPreview category={chart.type.category} style={chart.type.style} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{categoryLabels[chart.type.category]}</div>
                    <div className="text-xs text-muted-foreground">
                      {styleLabels[chart.type.style] || chart.type.style}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Size</Label>
                <div className="grid grid-cols-4 gap-2">
                  {sizeOptions.map(({ cols, rows, label }) => (
                    <button
                      key={label}
                      onClick={() => handleSizeChange(cols, rows)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all border",
                        chart.width === cols && chart.height === rows
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-muted text-foreground border-border",
                      )}
                    >
                      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(2, 1fr)` }}>
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-3 w-3 rounded-sm transition-colors",
                              i % 2 < cols && Math.floor(i / 2) < rows
                                ? chart.width === cols && chart.height === rows
                                  ? "bg-primary-foreground"
                                  : "bg-foreground"
                                : chart.width === cols && chart.height === rows
                                  ? "bg-primary-foreground/30"
                                  : "bg-muted-foreground/30",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : activeSection === "aliases" ? (
            <>
              {/* Field Aliases */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Field Aliases</Label>
                  <Button variant="ghost" size="sm" onClick={handleAddAlias} className="h-7 px-2 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(chart.aliases).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 group">
                      <div className="w-20 shrink-0">
                        <span className="text-xs text-muted-foreground capitalize">{key}</span>
                      </div>
                      <Input
                        value={value}
                        onChange={(e) => handleAliasChange(key, e.target.value)}
                        className="h-9 text-sm flex-1"
                        placeholder={`${key} alias`}
                      />
                      <button
                        onClick={() => handleRemoveAlias(key)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {Object.keys(chart.aliases).length === 0 && (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      No aliases defined. Click "Add" to create one.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Chart Colors */}
              <ChartColorOverride
                colors={chart.colors}
                defaultColors={defaultChartColors}
                useDefault={chart.useDefaultColors !== false}
                colorCount={colorCount}
                onChange={(colors) => onUpdate({ ...chart, colors, useDefaultColors: false })}
                onToggleDefault={(useDefault) => onUpdate({ ...chart, useDefaultColors: useDefault })}
              />

              {/* Note about default styles from grid config */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Default spacing (padding/margin) for chart areas is configured in the Chart Area settings. Individual
                  chart overrides can be added here.
                </p>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <ChartTypeGallery
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        selectedCategory={chart.type.category}
        selectedStyle={chart.type.style}
        onSelect={handleChartTypeSelect}
      />
    </>
  )
}
