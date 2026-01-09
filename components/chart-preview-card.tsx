"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { ChartConfig } from "@/lib/types"

interface ChartPreviewCardProps {
  chart: ChartConfig
  isSelected: boolean
  onClick: () => void
}

function MiniVerticalBar() {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <rect x="10" y="20" width="15" height="40" fill="currentColor" className="text-primary" rx="2" />
      <rect x="30" y="10" width="15" height="50" fill="currentColor" className="text-primary/70" rx="2" />
      <rect x="50" y="25" width="15" height="35" fill="currentColor" className="text-primary" rx="2" />
      <rect x="70" y="5" width="15" height="55" fill="currentColor" className="text-primary/70" rx="2" />
    </svg>
  )
}

function MiniHorizontalBar() {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <rect x="5" y="5" width="70" height="10" fill="currentColor" className="text-primary" rx="2" />
      <rect x="5" y="20" width="55" height="10" fill="currentColor" className="text-primary/70" rx="2" />
      <rect x="5" y="35" width="85" height="10" fill="currentColor" className="text-primary" rx="2" />
      <rect x="5" y="50" width="45" height="10" fill="currentColor" className="text-primary/70" rx="2" />
    </svg>
  )
}

function MiniLine() {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <polyline
        points="5,50 25,35 45,40 65,20 85,25 95,10"
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="35" r="3" fill="currentColor" className="text-primary" />
      <circle cx="65" cy="20" r="3" fill="currentColor" className="text-primary" />
      <circle cx="95" cy="10" r="3" fill="currentColor" className="text-primary" />
    </svg>
  )
}

function MiniArea() {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <path
        d="M5,55 L5,45 L25,30 L45,35 L65,15 L85,20 L95,10 L95,55 Z"
        fill="currentColor"
        className="text-primary/30"
      />
      <polyline
        points="5,45 25,30 45,35 65,15 85,20 95,10"
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MiniPie() {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <circle cx="50" cy="30" r="25" fill="currentColor" className="text-muted" />
      <path d="M50,30 L50,5 A25,25 0 0,1 73,41 Z" fill="currentColor" className="text-primary" />
      <path d="M50,30 L73,41 A25,25 0 0,1 27,41 Z" fill="currentColor" className="text-primary/60" />
    </svg>
  )
}

function MiniDonut() {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <circle cx="50" cy="30" r="25" fill="none" stroke="currentColor" className="text-muted" strokeWidth="8" />
      <circle
        cx="50"
        cy="30"
        r="25"
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="8"
        strokeDasharray="100 157"
        strokeLinecap="round"
        transform="rotate(-90 50 30)"
      />
    </svg>
  )
}

function getChartPreview(type: ChartConfig["type"]) {
  const { category, style } = type

  if (category === "bar") {
    if (style === "horizontal-bar") return <MiniHorizontalBar />
    return <MiniVerticalBar />
  }
  if (category === "line") return <MiniLine />
  if (category === "area") return <MiniArea />
  if (category === "pie") {
    if (style === "donut" || style === "semi-donut") return <MiniDonut />
    return <MiniPie />
  }
  return <MiniVerticalBar />
}

export function ChartPreviewCard({ chart, isSelected, onClick }: ChartPreviewCardProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-xl border-2 bg-card p-4 transition-all duration-200",
        isSelected
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-transparent hover:border-border hover:shadow-md",
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
          <Check className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Chart header */}
      <div className="mb-3">
        <h3 className="text-sm font-medium text-foreground">{chart.title}</h3>
        <p className="text-xs text-muted-foreground">{chart.subtitle}</p>
      </div>

      {/* Chart visualization */}
      <div className="h-32">{getChartPreview(chart.type)}</div>

      {/* Resize handles when selected */}
      {isSelected && (
        <>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-8 w-2 rounded-full bg-primary cursor-ew-resize shadow-sm" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-8 rounded-full bg-primary cursor-ns-resize shadow-sm" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-4 w-4 rounded-full bg-primary cursor-nwse-resize shadow-sm" />
        </>
      )}
    </div>
  )
}
