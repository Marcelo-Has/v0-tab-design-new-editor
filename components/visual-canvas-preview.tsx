"use client"

import React from "react"
import { cn } from "@/lib/utils"
import type { TemplateBlock, SelectionState, ChartConfig, GridConfig } from "@/lib/types"
import { ChartPreviewCard } from "./chart-preview-card"

interface VisualCanvasPreviewProps {
  blocks: TemplateBlock[]
  charts: ChartConfig[]
  selection: SelectionState
  onSelectBlock: (blockId: string | null) => void
  onSelectElement: (blockId: string, elementId: string) => void
  selectedChartId: string | null
  onSelectChart: (chartId: string | null) => void
  gridConfig: GridConfig
}

// ... existing code for SelectableRegion, DisabledBlockPlaceholder, ClickableElement ...

function SelectableRegion({
  children,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  label,
}: {
  children: React.ReactNode
  isSelected: boolean
  isHovered: boolean
  onClick: (e: React.MouseEvent) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  className?: string
  label: string
}) {
  return (
    <div
      className={cn(
        "relative transition-all cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-1",
        isHovered && !isSelected && "ring-2 ring-primary/40",
        className,
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      {(isSelected || isHovered) && (
        <div
          className={cn(
            "absolute -top-6 left-2 px-2 py-0.5 text-xs font-medium rounded-t-md z-10",
            isSelected ? "bg-primary text-primary-foreground" : "bg-primary/70 text-primary-foreground",
          )}
        >
          {label}
        </div>
      )}
    </div>
  )
}

function DisabledBlockPlaceholder({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer border-2 border-dashed border-muted-foreground/20 bg-muted/20 transition-all hover:border-primary/40 hover:bg-primary/5",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs text-muted-foreground/60 font-medium">{label} (disabled)</span>
      </div>
    </div>
  )
}

function ClickableElement({
  children,
  elementId,
  blockId,
  isSelected,
  onClick,
  className,
}: {
  children: React.ReactNode
  elementId: string
  blockId: string
  isSelected: boolean
  onClick: (blockId: string, elementId: string) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all rounded",
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:ring-1 hover:ring-blue-300 hover:bg-blue-50/50",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick(blockId, elementId)
      }}
    >
      {children}
    </div>
  )
}

export function VisualCanvasPreview({
  blocks,
  charts,
  selection,
  onSelectBlock,
  onSelectElement,
  selectedChartId,
  onSelectChart,
  gridConfig,
}: VisualCanvasPreviewProps) {
  const [hoveredBlock, setHoveredBlock] = React.useState<string | null>(null)

  const topbar = blocks.find((b) => b.type === "topbar")
  const header = blocks.find((b) => b.type === "header")
  const leftbar = blocks.find((b) => b.type === "leftbar")
  const rightbar = blocks.find((b) => b.type === "rightbar")
  const chartArea = blocks.find((b) => b.type === "chartArea")

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectBlock(null)
      onSelectChart(null)
    }
  }

  const getElementContent = (block: TemplateBlock, elementType: string) => {
    return block.elements.find((el) => el.type === elementType)
  }

  return (
    <div className="flex-1 overflow-auto p-8 bg-muted/30 pr-96" onClick={handleBackgroundClick}>
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-border bg-card overflow-visible shadow-sm">
          {/* Topbar - show placeholder if disabled */}
          {topbar &&
            (topbar.enabled ? (
              <SelectableRegion
                isSelected={selection.blockId === topbar.id && !selection.elementId}
                isHovered={hoveredBlock === topbar.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectBlock(topbar.id)
                }}
                onMouseEnter={() => setHoveredBlock(topbar.id)}
                onMouseLeave={() => setHoveredBlock(null)}
                label="Top Bar"
                className="border-b border-border"
              >
                <div
                  className="flex items-center gap-4 px-4 py-3"
                  style={{ background: topbar.styles.background || "#1a1a2e" }}
                >
                  {getElementContent(topbar, "image")?.visible && (
                    <ClickableElement
                      elementId={getElementContent(topbar, "image")!.id}
                      blockId={topbar.id}
                      isSelected={selection.elementId === getElementContent(topbar, "image")!.id}
                      onClick={onSelectElement}
                      className="p-1"
                    >
                      <div className="h-6 w-6 rounded bg-white/20" />
                    </ClickableElement>
                  )}
                  {getElementContent(topbar, "navigation")?.visible && (
                    <ClickableElement
                      elementId={getElementContent(topbar, "navigation")!.id}
                      blockId={topbar.id}
                      isSelected={selection.elementId === getElementContent(topbar, "navigation")!.id}
                      onClick={onSelectElement}
                      className="p-1"
                    >
                      <div className="flex gap-6">
                        <span className="text-sm font-medium text-white">Nav Button</span>
                        <span className="text-sm text-white/60">Nav Button</span>
                        <span className="text-sm text-white/60">Nav Button</span>
                      </div>
                    </ClickableElement>
                  )}
                </div>
              </SelectableRegion>
            ) : (
              <DisabledBlockPlaceholder
                label="Top Bar"
                onClick={() => onSelectBlock(topbar.id)}
                className="h-12 border-b border-border"
              />
            ))}

          {/* Main Content Area */}
          <div className="flex">
            {/* Left Sidebar - show placeholder if disabled */}
            {leftbar &&
              (leftbar.enabled ? (
                <SelectableRegion
                  isSelected={selection.blockId === leftbar.id && !selection.elementId}
                  isHovered={hoveredBlock === leftbar.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectBlock(leftbar.id)
                  }}
                  onMouseEnter={() => setHoveredBlock(leftbar.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  label="Left Bar"
                  className="border-r border-border"
                >
                  <div
                    className="w-48 p-4 min-h-[400px]"
                    style={{ background: leftbar.styles.background || "#f8f9fa" }}
                  >
                    {getElementContent(leftbar, "title")?.visible && (
                      <ClickableElement
                        elementId={getElementContent(leftbar, "title")!.id}
                        blockId={leftbar.id}
                        isSelected={selection.elementId === getElementContent(leftbar, "title")!.id}
                        onClick={onSelectElement}
                        className="p-1 mb-3"
                      >
                        <h3 className="text-sm font-medium text-foreground">
                          {getElementContent(leftbar, "title")?.value || "Navigation"}
                        </h3>
                      </ClickableElement>
                    )}
                    {getElementContent(leftbar, "navigation")?.visible && (
                      <ClickableElement
                        elementId={getElementContent(leftbar, "navigation")!.id}
                        blockId={leftbar.id}
                        isSelected={selection.elementId === getElementContent(leftbar, "navigation")!.id}
                        onClick={onSelectElement}
                        className="p-1"
                      >
                        <div className="space-y-2">
                          <div className="text-sm text-foreground font-medium">Nav Button</div>
                          <div className="text-sm text-muted-foreground">Nav Button</div>
                          <div className="text-sm text-muted-foreground">Nav Button</div>
                        </div>
                      </ClickableElement>
                    )}
                  </div>
                </SelectableRegion>
              ) : (
                <DisabledBlockPlaceholder
                  label="Left Bar"
                  onClick={() => onSelectBlock(leftbar.id)}
                  className="w-12 min-h-[400px] border-r border-border"
                />
              ))}

            {/* Center Content */}
            <div className="flex-1 flex flex-col">
              {/* Header - show placeholder if disabled */}
              {header &&
                (header.enabled ? (
                  <SelectableRegion
                    isSelected={selection.blockId === header.id && !selection.elementId}
                    isHovered={hoveredBlock === header.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectBlock(header.id)
                    }}
                    onMouseEnter={() => setHoveredBlock(header.id)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    label="Header"
                    className="border-b border-border"
                  >
                    <div
                      className="px-6 py-4 flex items-center gap-4"
                      style={{ background: header.styles.background || "#ffffff" }}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {getElementContent(header, "title")?.visible && (
                          <ClickableElement
                            elementId={getElementContent(header, "title")!.id}
                            blockId={header.id}
                            isSelected={selection.elementId === getElementContent(header, "title")!.id}
                            onClick={onSelectElement}
                            className="p-1"
                          >
                            <h2 className="text-lg font-semibold text-foreground">
                              {getElementContent(header, "title")?.value || "Dashboard Name"}
                            </h2>
                          </ClickableElement>
                        )}
                        {getElementContent(header, "caption")?.visible && (
                          <>
                            <span className="text-muted-foreground">|</span>
                            <ClickableElement
                              elementId={getElementContent(header, "caption")!.id}
                              blockId={header.id}
                              isSelected={selection.elementId === getElementContent(header, "caption")!.id}
                              onClick={onSelectElement}
                              className="p-1"
                            >
                              <span className="text-sm text-muted-foreground">
                                {getElementContent(header, "caption")?.value || "VIEW NAME"}
                              </span>
                            </ClickableElement>
                          </>
                        )}
                      </div>
                      {getElementContent(header, "filter")?.visible && (
                        <ClickableElement
                          elementId={getElementContent(header, "filter")!.id}
                          blockId={header.id}
                          isSelected={selection.elementId === getElementContent(header, "filter")!.id}
                          onClick={onSelectElement}
                          className="p-1"
                        >
                          <div className="flex gap-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Title</span>
                                <div className="h-7 w-20 rounded border border-input bg-background text-xs flex items-center px-2 text-muted-foreground">
                                  All
                                </div>
                              </div>
                            ))}
                          </div>
                        </ClickableElement>
                      )}
                    </div>
                  </SelectableRegion>
                ) : (
                  <DisabledBlockPlaceholder
                    label="Header"
                    onClick={() => onSelectBlock(header.id)}
                    className="h-10 border-b border-border"
                  />
                ))}

              {chartArea &&
                (chartArea.enabled ? (
                  <SelectableRegion
                    isSelected={selection.blockId === chartArea.id && !selection.elementId}
                    isHovered={hoveredBlock === chartArea.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectBlock(chartArea.id)
                    }}
                    onMouseEnter={() => setHoveredBlock(chartArea.id)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    label="Chart Area"
                    className="flex-1"
                  >
                    <div
                      className="min-h-[300px]"
                      style={{
                        background: chartArea.styles.background || "#f8f9fa",
                        padding: `${gridConfig.outerPadding}px`,
                      }}
                    >
                      <div
                        className="grid grid-cols-2"
                        style={{
                          gap: `${gridConfig.gap}px`,
                          padding: `${gridConfig.innerPadding}px`,
                        }}
                      >
                        {charts.map((chart) => (
                          <div key={chart.id} style={{ margin: `${gridConfig.gutter}px` }}>
                            <ChartPreviewCard
                              chart={chart}
                              isSelected={selectedChartId === chart.id}
                              onClick={() => onSelectChart(chart.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </SelectableRegion>
                ) : (
                  <DisabledBlockPlaceholder
                    label="Chart Area"
                    onClick={() => onSelectBlock(chartArea.id)}
                    className="flex-1 min-h-[300px]"
                  />
                ))}
            </div>

            {/* Right Sidebar - show placeholder if disabled */}
            {rightbar &&
              (rightbar.enabled ? (
                <SelectableRegion
                  isSelected={selection.blockId === rightbar.id && !selection.elementId}
                  isHovered={hoveredBlock === rightbar.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectBlock(rightbar.id)
                  }}
                  onMouseEnter={() => setHoveredBlock(rightbar.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  label="Right Bar"
                  className="border-l border-border"
                >
                  <div
                    className="w-56 p-4 min-h-[400px]"
                    style={{ background: rightbar.styles.background || "#f8f9fa" }}
                  >
                    {getElementContent(rightbar, "filter")?.visible && (
                      <ClickableElement
                        elementId={getElementContent(rightbar, "filter")!.id}
                        blockId={rightbar.id}
                        isSelected={selection.elementId === getElementContent(rightbar, "filter")!.id}
                        onClick={onSelectElement}
                        className="p-1"
                      >
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Filters</h3>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-1">
                              <span className="text-xs text-muted-foreground">Title</span>
                              <div className="h-8 rounded border border-input bg-background text-sm flex items-center px-2 text-muted-foreground">
                                All
                              </div>
                            </div>
                          ))}
                        </div>
                      </ClickableElement>
                    )}
                  </div>
                </SelectableRegion>
              ) : (
                <DisabledBlockPlaceholder
                  label="Right Bar"
                  onClick={() => onSelectBlock(rightbar.id)}
                  className="w-12 min-h-[400px] border-l border-border"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
