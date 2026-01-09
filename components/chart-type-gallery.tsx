"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  LineChart,
  AreaChart,
  PieChart,
  ScatterChart,
  Layers,
  Search,
  Target,
  Gauge,
  GitBranch,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChartCategory, ChartStyle } from "@/lib/types"

interface ChartTypeGalleryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCategory: ChartCategory
  selectedStyle: ChartStyle
  onSelect: (category: ChartCategory, style: ChartStyle) => void
}

interface StyleVariation {
  style: ChartStyle
  label: string
  description: string
}

interface CategoryConfig {
  category: ChartCategory
  label: string
  icon: React.ElementType
  description: string
  styles: StyleVariation[]
}

// Expanded chart categories with many more variations
const chartCategories: CategoryConfig[] = [
  {
    category: "bar",
    label: "Bar Charts",
    icon: BarChart3,
    description: "Compare values across categories",
    styles: [
      { style: "vertical-bar", label: "Vertical Bar", description: "Standard vertical bars" },
      { style: "horizontal-bar", label: "Horizontal Bar", description: "Horizontal orientation" },
      { style: "stacked-bar", label: "Stacked Bar", description: "Stacked segments" },
      { style: "grouped-bar", label: "Grouped Bar", description: "Side-by-side comparison" },
      { style: "waterfall-bar", label: "Waterfall", description: "Running totals" },
      { style: "diverging-bar", label: "Diverging Bar", description: "Positive/negative values" },
      { style: "rounded-bar", label: "Rounded Bar", description: "Soft rounded corners" },
      { style: "gradient-bar", label: "Gradient Bar", description: "Color gradient fill" },
      { style: "lollipop", label: "Lollipop", description: "Dot with stem" },
      { style: "histogram", label: "Histogram", description: "Distribution bins" },
      { style: "bullet-bar", label: "Bullet Chart", description: "Progress against target" },
      { style: "pyramid-bar", label: "Pyramid", description: "Population pyramid style" },
    ],
  },
  {
    category: "line",
    label: "Line Charts",
    icon: LineChart,
    description: "Show trends over time",
    styles: [
      { style: "basic-line", label: "Basic Line", description: "Simple line chart" },
      { style: "smooth-line", label: "Smooth Line", description: "Curved interpolation" },
      { style: "stepped-line", label: "Stepped Line", description: "Step-wise changes" },
      { style: "multi-line", label: "Multi-Line", description: "Multiple series" },
      { style: "dashed-line", label: "Dashed Line", description: "Dashed stroke style" },
      { style: "dotted-line", label: "Dotted Line", description: "Dotted stroke style" },
      { style: "line-markers", label: "With Markers", description: "Data point markers" },
      { style: "sparkline", label: "Sparkline", description: "Minimal inline chart" },
      { style: "slope-chart", label: "Slope Chart", description: "Before/after comparison" },
      { style: "bump-chart", label: "Bump Chart", description: "Ranking over time" },
    ],
  },
  {
    category: "area",
    label: "Area Charts",
    icon: AreaChart,
    description: "Emphasize volume and totals",
    styles: [
      { style: "basic-area", label: "Basic Area", description: "Filled area chart" },
      { style: "stacked-area", label: "Stacked Area", description: "Stacked segments" },
      { style: "gradient-area", label: "Gradient Area", description: "Gradient fill" },
      { style: "stream-area", label: "Stream Graph", description: "Flowing streams" },
      { style: "ridgeline-area", label: "Ridgeline", description: "Overlapping distributions" },
      { style: "percent-area", label: "100% Stacked", description: "Percentage stacked" },
      { style: "baseline-area", label: "Baseline Area", description: "Centered baseline" },
      { style: "area-markers", label: "With Markers", description: "Data point markers" },
    ],
  },
  {
    category: "pie",
    label: "Pie & Ring",
    icon: PieChart,
    description: "Show part-to-whole relationships",
    styles: [
      { style: "basic-pie", label: "Pie Chart", description: "Classic pie chart" },
      { style: "donut", label: "Donut Chart", description: "Hollow center" },
      { style: "semi-donut", label: "Semi-Donut", description: "Half circle" },
      { style: "nested-donut", label: "Nested Donut", description: "Multiple rings" },
      { style: "exploded-pie", label: "Exploded Pie", description: "Separated slices" },
      { style: "rose-chart", label: "Rose Chart", description: "Variable radius" },
      { style: "sunburst", label: "Sunburst", description: "Hierarchical rings" },
      { style: "gauge-pie", label: "Gauge", description: "Progress indicator" },
      { style: "radial-bar", label: "Radial Bar", description: "Circular progress bars" },
    ],
  },
  {
    category: "scatter",
    label: "Scatter & Bubble",
    icon: ScatterChart,
    description: "Show relationships between variables",
    styles: [
      { style: "basic-scatter", label: "Scatter Plot", description: "Point distribution" },
      { style: "bubble", label: "Bubble Chart", description: "Sized data points" },
      { style: "scatter-line", label: "With Trendline", description: "Regression line" },
      { style: "scatter-quadrant", label: "Quadrant", description: "Four quadrants" },
      { style: "scatter-categories", label: "Categorical", description: "Color-coded groups" },
      { style: "connected-scatter", label: "Connected", description: "Connected points" },
      { style: "heatmap-scatter", label: "Density", description: "Point density" },
    ],
  },
  {
    category: "combo",
    label: "Combination",
    icon: Layers,
    description: "Mix multiple chart types",
    styles: [
      { style: "bar-line", label: "Bar + Line", description: "Bars with trend line" },
      { style: "area-line", label: "Area + Line", description: "Area with overlay" },
      { style: "stacked-line", label: "Stacked + Line", description: "Stacked bars + line" },
      { style: "dual-axis", label: "Dual Axis", description: "Two Y axes" },
      { style: "bar-area", label: "Bar + Area", description: "Mixed visualization" },
      { style: "scatter-bar", label: "Scatter + Bar", description: "Points with bars" },
    ],
  },
  {
    category: "funnel",
    label: "Funnel & Flow",
    icon: GitBranch,
    description: "Show progression and flow",
    styles: [
      { style: "basic-funnel", label: "Funnel", description: "Conversion funnel" },
      { style: "pyramid-funnel", label: "Pyramid", description: "Hierarchical pyramid" },
      { style: "horizontal-funnel", label: "Horizontal", description: "Side funnel" },
      { style: "sankey", label: "Sankey", description: "Flow diagram" },
      { style: "chord", label: "Chord", description: "Relationship flows" },
    ],
  },
  {
    category: "gauge",
    label: "Gauges & KPIs",
    icon: Gauge,
    description: "Display single metrics",
    styles: [
      { style: "basic-gauge", label: "Gauge", description: "Speedometer style" },
      { style: "linear-gauge", label: "Linear Gauge", description: "Horizontal progress" },
      { style: "thermometer", label: "Thermometer", description: "Vertical progress" },
      { style: "kpi-card", label: "KPI Card", description: "Metric display" },
      { style: "comparison-gauge", label: "Comparison", description: "vs target" },
      { style: "bullet-gauge", label: "Bullet Gauge", description: "Compact indicator" },
    ],
  },
  {
    category: "specialized",
    label: "Specialized",
    icon: Target,
    description: "Domain-specific visualizations",
    styles: [
      { style: "radar", label: "Radar Chart", description: "Multi-axis comparison" },
      { style: "polar-area", label: "Polar Area", description: "Circular sectors" },
      { style: "treemap", label: "Treemap", description: "Nested rectangles" },
      { style: "heatmap", label: "Heatmap", description: "Color intensity matrix" },
      { style: "calendar", label: "Calendar", description: "Date-based heatmap" },
      { style: "box-plot", label: "Box Plot", description: "Statistical distribution" },
      { style: "candlestick", label: "Candlestick", description: "Financial OHLC" },
      { style: "waterfall", label: "Waterfall", description: "Cumulative effect" },
      { style: "violin", label: "Violin Plot", description: "Distribution shape" },
    ],
  },
]

function StylePreview({ category, style }: { category: ChartCategory; style: ChartStyle }) {
  if (category === "bar") {
    if (style === "horizontal-bar") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <rect x="4" y="4" width="32" height="6" fill="currentColor" rx="1" />
          <rect x="4" y="12" width="22" height="6" fill="currentColor" className="opacity-70" rx="1" />
          <rect x="4" y="20" width="38" height="6" fill="currentColor" className="opacity-85" rx="1" />
        </svg>
      )
    }
    if (style === "stacked-bar") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <rect x="6" y="16" width="8" height="12" fill="currentColor" rx="1" />
          <rect x="6" y="8" width="8" height="8" fill="currentColor" className="opacity-50" rx="1" />
          <rect x="18" y="10" width="8" height="18" fill="currentColor" rx="1" />
          <rect x="18" y="4" width="8" height="6" fill="currentColor" className="opacity-50" rx="1" />
          <rect x="30" y="14" width="8" height="14" fill="currentColor" rx="1" />
          <rect x="30" y="8" width="8" height="6" fill="currentColor" className="opacity-50" rx="1" />
        </svg>
      )
    }
    if (style === "grouped-bar") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <rect x="4" y="12" width="6" height="16" fill="currentColor" rx="1" />
          <rect x="11" y="16" width="6" height="12" fill="currentColor" className="opacity-50" rx="1" />
          <rect x="21" y="6" width="6" height="22" fill="currentColor" rx="1" />
          <rect x="28" y="12" width="6" height="16" fill="currentColor" className="opacity-50" rx="1" />
          <rect x="38" y="10" width="6" height="18" fill="currentColor" rx="1" />
        </svg>
      )
    }
    if (style === "lollipop") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <line x1="10" y1="28" x2="10" y2="8" stroke="currentColor" strokeWidth="2" />
          <circle cx="10" cy="8" r="3" fill="currentColor" />
          <line x1="24" y1="28" x2="24" y2="14" stroke="currentColor" strokeWidth="2" />
          <circle cx="24" cy="14" r="3" fill="currentColor" />
          <line x1="38" y1="28" x2="38" y2="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="38" cy="6" r="3" fill="currentColor" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <rect x="6" y="12" width="8" height="16" fill="currentColor" rx="1" />
        <rect x="18" y="6" width="8" height="22" fill="currentColor" className="opacity-70" rx="1" />
        <rect x="30" y="14" width="8" height="14" fill="currentColor" rx="1" />
      </svg>
    )
  }

  if (category === "line") {
    if (style === "smooth-line") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <path d="M4,26 Q12,8 24,16 T44,6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
    if (style === "stepped-line") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <polyline points="4,24 14,24 14,16 28,16 28,10 44,10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    }
    if (style === "line-markers") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <polyline points="4,24 16,12 28,18 44,6" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="4" cy="24" r="2.5" fill="currentColor" />
          <circle cx="16" cy="12" r="2.5" fill="currentColor" />
          <circle cx="28" cy="18" r="2.5" fill="currentColor" />
          <circle cx="44" cy="6" r="2.5" fill="currentColor" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <polyline
          points="4,24 16,14 28,18 44,8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (category === "area") {
    if (style === "stacked-area") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <path d="M4,28 L4,20 L16,16 L28,18 L44,12 L44,28 Z" fill="currentColor" />
          <path d="M4,20 L16,16 L28,18 L44,12 L44,6 L28,10 L16,8 L4,12 Z" fill="currentColor" className="opacity-50" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <path d="M4,28 L4,18 L16,10 L28,14 L44,6 L44,28 Z" fill="currentColor" className="opacity-40" />
        <polyline points="4,18 16,10 28,14 44,6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }

  if (category === "pie") {
    if (style === "donut") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <circle cx="24" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-30" />
          <circle
            cx="24"
            cy="16"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="40 63"
            transform="rotate(-90 24 16)"
          />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <circle cx="24" cy="16" r="10" fill="currentColor" className="opacity-30" />
        <path d="M24,16 L24,6 A10,10 0 0,1 32,22 Z" fill="currentColor" />
      </svg>
    )
  }

  if (category === "scatter") {
    if (style === "bubble") {
      return (
        <svg viewBox="0 0 48 32" className="w-full h-full">
          <circle cx="10" cy="18" r="4" fill="currentColor" className="opacity-70" />
          <circle cx="22" cy="10" r="6" fill="currentColor" />
          <circle cx="36" cy="20" r="3" fill="currentColor" className="opacity-50" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <circle cx="8" cy="20" r="2" fill="currentColor" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
        <circle cx="26" cy="18" r="2" fill="currentColor" />
        <circle cx="34" cy="8" r="2" fill="currentColor" />
        <circle cx="42" cy="14" r="2" fill="currentColor" />
      </svg>
    )
  }

  if (category === "combo") {
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <rect x="6" y="14" width="6" height="12" fill="currentColor" className="opacity-50" rx="1" />
        <rect x="18" y="10" width="6" height="16" fill="currentColor" className="opacity-50" rx="1" />
        <rect x="30" y="16" width="6" height="10" fill="currentColor" className="opacity-50" rx="1" />
        <polyline points="9,10 21,6 33,12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }

  if (category === "funnel") {
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <path d="M4,4 L44,4 L36,12 L12,12 Z" fill="currentColor" />
        <path d="M12,14 L36,14 L30,22 L18,22 Z" fill="currentColor" className="opacity-60" />
        <path d="M18,24 L30,24 L26,30 L22,30 Z" fill="currentColor" className="opacity-30" />
      </svg>
    )
  }

  if (category === "gauge") {
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <path d="M8,26 A16,16 0 0,1 40,26" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <path d="M8,26 A16,16 0 0,1 32,12" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    )
  }

  if (category === "specialized") {
    return (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <polygon
          points="24,2 42,10 36,28 12,28 6,10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-30"
        />
        <polygon points="24,8 34,12 30,24 18,24 14,12" fill="currentColor" className="opacity-40" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 32" className="w-full h-full">
      <rect x="6" y="12" width="8" height="16" fill="currentColor" rx="1" />
      <rect x="18" y="6" width="8" height="22" fill="currentColor" className="opacity-70" rx="1" />
      <rect x="30" y="14" width="8" height="14" fill="currentColor" rx="1" />
    </svg>
  )
}

export function ChartTypeGallery({
  open,
  onOpenChange,
  selectedCategory,
  selectedStyle,
  onSelect,
}: ChartTypeGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<ChartCategory>(selectedCategory)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStyles = useMemo(() => {
    if (!searchQuery.trim()) {
      return chartCategories.find((c) => c.category === activeCategory)?.styles || []
    }
    const query = searchQuery.toLowerCase()
    const results: { category: ChartCategory; styles: StyleVariation[] }[] = []

    chartCategories.forEach((cat) => {
      const matchedStyles = cat.styles.filter(
        (s) =>
          s.label.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          cat.label.toLowerCase().includes(query),
      )
      if (matchedStyles.length > 0) {
        results.push({ category: cat.category, styles: matchedStyles })
      }
    })

    return results
  }, [searchQuery, activeCategory])

  const handleSelect = (category: ChartCategory, style: ChartStyle) => {
    onSelect(category, style)
    onOpenChange(false)
  }

  const activeCategoryConfig = chartCategories.find((c) => c.category === activeCategory)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 overflow-hidden h-[600px]">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-56 border-r border-border bg-muted/30 flex flex-col shrink-0">
            <div className="p-3 border-b border-border">
              <h2 className="font-semibold text-foreground text-sm">Chart Types</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {chartCategories.map((cat) => {
                  const Icon = cat.icon
                  const isActive = activeCategory === cat.category && !searchQuery
                  return (
                    <button
                      key={cat.category}
                      onClick={() => {
                        setActiveCategory(cat.category)
                        setSearchQuery("")
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors text-sm",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{cat.label}</div>
                        <div
                          className={cn(
                            "text-xs truncate",
                            isActive ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {cat.styles.length} styles
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search Header */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search all chart types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-muted/50"
                />
              </div>
            </div>

            {/* Grid Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {!searchQuery ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-foreground">{activeCategoryConfig?.label}</h3>
                      <p className="text-xs text-muted-foreground">{activeCategoryConfig?.description}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {(filteredStyles as StyleVariation[]).map((variation) => {
                        const isSelected = selectedCategory === activeCategory && selectedStyle === variation.style
                        return (
                          <button
                            key={variation.style}
                            onClick={() => handleSelect(activeCategory, variation.style)}
                            className={cn(
                              "group relative flex flex-col items-center rounded-lg border-2 p-3 transition-all hover:border-primary/50 hover:bg-muted/50",
                              isSelected ? "border-primary bg-primary/5" : "border-border",
                            )}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-2.5 w-2.5 text-primary-foreground" />
                              </div>
                            )}
                            <div className="h-10 w-full text-muted-foreground group-hover:text-foreground transition-colors mb-2">
                              <StylePreview category={activeCategory} style={variation.style} />
                            </div>
                            <span className="text-xs font-medium text-foreground text-center leading-tight">
                              {variation.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  // Search results
                  <div className="space-y-6">
                    {(filteredStyles as { category: ChartCategory; styles: StyleVariation[] }[]).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p className="text-sm">No charts found for "{searchQuery}"</p>
                      </div>
                    ) : (
                      (filteredStyles as { category: ChartCategory; styles: StyleVariation[] }[]).map((group) => {
                        const catConfig = chartCategories.find((c) => c.category === group.category)
                        return (
                          <div key={group.category}>
                            <h3 className="text-sm font-semibold text-foreground mb-3">{catConfig?.label}</h3>
                            <div className="grid grid-cols-4 gap-3">
                              {group.styles.map((variation) => {
                                const isSelected =
                                  selectedCategory === group.category && selectedStyle === variation.style
                                return (
                                  <button
                                    key={variation.style}
                                    onClick={() => handleSelect(group.category, variation.style)}
                                    className={cn(
                                      "group relative flex flex-col items-center rounded-lg border-2 p-3 transition-all hover:border-primary/50 hover:bg-muted/50",
                                      isSelected ? "border-primary bg-primary/5" : "border-border",
                                    )}
                                  >
                                    {isSelected && (
                                      <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                      </div>
                                    )}
                                    <div className="h-10 w-full text-muted-foreground group-hover:text-foreground transition-colors mb-2">
                                      <StylePreview category={group.category} style={variation.style} />
                                    </div>
                                    <span className="text-xs font-medium text-foreground text-center leading-tight">
                                      {variation.label}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
