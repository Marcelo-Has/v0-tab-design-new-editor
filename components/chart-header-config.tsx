"use client"

import { useState } from "react"
import { ChevronDown, Eye, EyeOff, Type } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { TextStyleSelector } from "./text-style-selector"
import type { ChartHeaderConfig, GlobalStyle } from "@/lib/types"

interface ChartHeaderConfigPanelProps {
  config: ChartHeaderConfig
  onChange: (config: ChartHeaderConfig) => void
  globalStyles: GlobalStyle[]
}

export function ChartHeaderConfigPanel({ config, onChange, globalStyles }: ChartHeaderConfigPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Chart Headers</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
      </button>

      {isExpanded && (
        <div className="p-3 space-y-4">
          {/* Title Toggle */}
          <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              {config.showTitle ? (
                <Eye className="h-4 w-4 text-primary" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Show Title</span>
            </div>
            <Switch
              checked={config.showTitle}
              onCheckedChange={(checked) => onChange({ ...config, showTitle: checked })}
            />
          </div>

          {/* Subtitle Toggle */}
          <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              {config.showSubtitle ? (
                <Eye className="h-4 w-4 text-primary" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Show Subtitle</span>
            </div>
            <Switch
              checked={config.showSubtitle}
              onCheckedChange={(checked) => onChange({ ...config, showSubtitle: checked })}
            />
          </div>

          {/* Native Title Option */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Title Source</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ ...config, useNativeTitle: false })}
                className={cn(
                  "px-3 py-2 text-xs rounded-lg border transition-all",
                  !config.useNativeTitle
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted",
                )}
              >
                Separate Object
              </button>
              <button
                onClick={() => onChange({ ...config, useNativeTitle: true })}
                className={cn(
                  "px-3 py-2 text-xs rounded-lg border transition-all",
                  config.useNativeTitle
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted",
                )}
              >
                Tableau Native
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {config.useNativeTitle
                ? "Uses Tableau's built-in title feature"
                : "Creates a separate text object for the title"}
            </p>
          </div>

          {/* Title Style */}
          {config.showTitle && !config.useNativeTitle && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs text-muted-foreground">Title Style (All Charts)</Label>
              <TextStyleSelector
                styles={{}}
                globalStyleId={config.titleStyleId}
                globalStyles={globalStyles}
                onStylesChange={() => {}}
                onGlobalStyleChange={(styleId) => onChange({ ...config, titleStyleId: styleId })}
                compact
                globalOnly
              />
            </div>
          )}

          {/* Subtitle Style */}
          {config.showSubtitle && !config.useNativeTitle && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs text-muted-foreground">Subtitle Style (All Charts)</Label>
              <TextStyleSelector
                styles={{}}
                globalStyleId={config.subtitleStyleId}
                globalStyles={globalStyles}
                onStylesChange={() => {}}
                onGlobalStyleChange={(styleId) => onChange({ ...config, subtitleStyleId: styleId })}
                compact
                globalOnly
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
