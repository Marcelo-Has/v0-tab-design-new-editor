"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { StyleConfig, GlobalStyle } from "@/lib/types"

interface TextStyleSelectorProps {
  styles: StyleConfig
  globalStyleId?: string
  globalStyles: GlobalStyle[]
  onStylesChange: (styles: StyleConfig) => void
  onGlobalStyleChange: (styleId: string | undefined) => void
  compact?: boolean
  globalOnly?: boolean // Added globalOnly prop to only show global styles (for chart headers)
}

type StyleMode = "global" | "custom"

export function TextStyleSelector({
  styles,
  globalStyleId,
  globalStyles,
  onStylesChange,
  onGlobalStyleChange,
  compact = false,
  globalOnly = false,
}: TextStyleSelectorProps) {
  const textStyles = globalStyles.filter((s) => s.category === "texts")
  const [mode, setMode] = useState<StyleMode>(globalStyleId || globalOnly ? "global" : "custom")
  const [showGlobalList, setShowGlobalList] = useState(false)

  const selectedStyle = textStyles.find((s) => s.id === globalStyleId)

  const handleModeChange = (newMode: StyleMode) => {
    if (globalOnly && newMode === "custom") return // Prevent switching to custom if globalOnly
    setMode(newMode)
    if (newMode === "global" && textStyles.length > 0) {
      onGlobalStyleChange(textStyles[0].id)
    } else if (newMode === "custom") {
      onGlobalStyleChange(undefined)
    }
  }

  const handleSelectGlobalStyle = (styleId: string) => {
    onGlobalStyleChange(styleId)
    setShowGlobalList(false)
  }

  if (globalOnly) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowGlobalList(!showGlobalList)}
          className="w-full flex items-center justify-between h-8 px-3 rounded border border-input bg-background text-xs hover:bg-muted/50 transition-colors"
        >
          <span className={cn(!selectedStyle && "text-muted-foreground")}>
            {selectedStyle?.name || "Select a text style..."}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {showGlobalList && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 py-1 max-h-40 overflow-y-auto">
            {textStyles.length > 0 ? (
              textStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleSelectGlobalStyle(style.id)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors flex items-center justify-between",
                    globalStyleId === style.id && "bg-primary/10 text-primary",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: style.fontWeight || "400",
                        color: style.fontColor || "#333",
                      }}
                    >
                      Aa
                    </span>
                    <span>{style.name}</span>
                  </div>
                  {globalStyleId === style.id && <Check className="h-3 w-3" />}
                </button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground p-2">No text styles defined. Add one in Global Styles.</p>
            )}
          </div>
        )}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Compact Mode Selector */}
        <div className="flex gap-1 p-0.5 bg-muted/50 rounded-md">
          {textStyles.length > 0 && (
            <button
              onClick={() => handleModeChange("global")}
              className={cn(
                "flex-1 py-1 text-[10px] rounded transition-colors",
                mode === "global"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Global
            </button>
          )}
          {!globalOnly && (
            <button
              onClick={() => handleModeChange("custom")}
              className={cn(
                "flex-1 py-1 text-[10px] rounded transition-colors",
                mode === "custom"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Custom
            </button>
          )}
        </div>

        {/* Global Style Dropdown */}
        {mode === "global" && textStyles.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowGlobalList(!showGlobalList)}
              className="w-full flex items-center justify-between h-7 px-2 rounded border border-input bg-background text-xs hover:bg-muted/50 transition-colors"
            >
              <span className={cn(!selectedStyle && "text-muted-foreground")}>
                {selectedStyle?.name || "Select style"}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {showGlobalList && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 py-1 max-h-32 overflow-y-auto">
                {textStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleSelectGlobalStyle(style.id)}
                    className={cn(
                      "w-full text-left px-2 py-1 text-xs hover:bg-muted transition-colors flex items-center justify-between",
                      globalStyleId === style.id && "bg-primary/10 text-primary",
                    )}
                  >
                    <span>{style.name}</span>
                    {globalStyleId === style.id && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Inputs */}
        {mode === "custom" && !globalOnly && (
          <div className="space-y-2 pl-2 border-l-2 border-primary/20">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Size</Label>
                <Input
                  value={styles.fontSize || ""}
                  onChange={(e) => onStylesChange({ ...styles, fontSize: e.target.value })}
                  placeholder="14px"
                  className="h-6 text-[10px]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Weight</Label>
                <select
                  value={styles.fontWeight || "400"}
                  onChange={(e) => onStylesChange({ ...styles, fontWeight: e.target.value })}
                  className="w-full h-6 text-[10px] rounded-md border border-input bg-background px-2"
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi</option>
                  <option value="700">Bold</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Color</Label>
              <div className="flex gap-1">
                <Input
                  value={styles.fontColor || ""}
                  onChange={(e) => onStylesChange({ ...styles, fontColor: e.target.value })}
                  placeholder="#333"
                  className="h-6 text-[10px] flex-1"
                />
                <input
                  type="color"
                  value={styles.fontColor || "#333333"}
                  onChange={(e) => onStylesChange({ ...styles, fontColor: e.target.value })}
                  className="h-6 w-6 rounded border border-input cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Mode Selector */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
        {textStyles.length > 0 && (
          <button
            onClick={() => handleModeChange("global")}
            className={cn(
              "flex-1 py-1.5 text-xs rounded-md transition-colors",
              mode === "global"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Global Style
          </button>
        )}
        {!globalOnly && (
          <button
            onClick={() => handleModeChange("custom")}
            className={cn(
              "flex-1 py-1.5 text-xs rounded-md transition-colors",
              mode === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Custom
          </button>
        )}
      </div>

      {/* Global Style List */}
      {mode === "global" && textStyles.length > 0 && (
        <div className="space-y-1.5 max-h-28 overflow-y-auto">
          {textStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleSelectGlobalStyle(style.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left",
                globalStyleId === style.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted/30 hover:bg-muted/50",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{
                    fontSize: style.fontSize || "14px",
                    fontWeight: style.fontWeight || "400",
                    color: style.fontColor || "#333",
                  }}
                >
                  Aa
                </span>
                <span>{style.name}</span>
              </div>
              {globalStyleId === style.id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}

      {/* Custom Inputs */}
      {mode === "custom" && !globalOnly && (
        <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Size</Label>
            <Input
              value={styles.fontSize || ""}
              onChange={(e) => onStylesChange({ ...styles, fontSize: e.target.value })}
              placeholder="14px"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Color</Label>
            <div className="flex gap-2">
              <Input
                value={styles.fontColor || ""}
                onChange={(e) => onStylesChange({ ...styles, fontColor: e.target.value })}
                placeholder="#333333"
                className="h-8 text-sm flex-1"
              />
              <input
                type="color"
                value={styles.fontColor || "#333333"}
                onChange={(e) => onStylesChange({ ...styles, fontColor: e.target.value })}
                className="h-8 w-8 rounded border border-input cursor-pointer"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Weight</Label>
            <select
              value={styles.fontWeight || "400"}
              onChange={(e) => onStylesChange({ ...styles, fontWeight: e.target.value })}
              className="w-full h-8 text-sm rounded-md border border-input bg-background px-3"
            >
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
