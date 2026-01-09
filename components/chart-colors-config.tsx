"use client"

import { useState } from "react"
import { ChevronDown, Palette, RotateCcw } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { ChartColorsConfig, GlobalStyle } from "@/lib/types"

interface DefaultChartColorsConfigProps {
  defaultColors: ChartColorsConfig
  onDefaultColorsChange: (colors: ChartColorsConfig) => void
  globalStyles: GlobalStyle[]
}

const presetPalettes = [
  { name: "Blue", primary: "#3b82f6", secondary: "#60a5fa" },
  { name: "Green", primary: "#22c55e", secondary: "#4ade80" },
  { name: "Purple", primary: "#8b5cf6", secondary: "#a78bfa" },
  { name: "Orange", primary: "#f97316", secondary: "#fb923c" },
  { name: "Teal", primary: "#14b8a6", secondary: "#2dd4bf" },
  { name: "Rose", primary: "#f43f5e", secondary: "#fb7185" },
  { name: "Amber", primary: "#f59e0b", secondary: "#fbbf24" },
  { name: "Cyan", primary: "#06b6d4", secondary: "#22d3ee" },
]

function ColorSourceSelector({
  label,
  color,
  useGlobal,
  globalStyleId,
  globalStyles,
  onColorChange,
  onGlobalStyleChange,
  onToggleGlobal,
}: {
  label: string
  color: string
  useGlobal: boolean
  globalStyleId?: string
  globalStyles: GlobalStyle[]
  onColorChange: (color: string) => void
  onGlobalStyleChange: (styleId: string) => void
  onToggleGlobal: (useGlobal: boolean) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const backgroundStyles = globalStyles.filter((s) => s.category === "backgrounds")
  const selectedStyle = backgroundStyles.find((s) => s.id === globalStyleId)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="flex gap-1">
          <button
            onClick={() => onToggleGlobal(true)}
            className={cn(
              "px-2 py-0.5 text-[10px] rounded transition-colors",
              useGlobal ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            Global
          </button>
          <button
            onClick={() => onToggleGlobal(false)}
            className={cn(
              "px-2 py-0.5 text-[10px] rounded transition-colors",
              !useGlobal
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            Custom
          </button>
        </div>
      </div>

      {useGlobal ? (
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background hover:bg-muted/50 transition-colors">
              {selectedStyle ? (
                <>
                  <div
                    className="w-5 h-5 rounded border border-border"
                    style={{ backgroundColor: selectedStyle.backgroundColor }}
                  />
                  <span className="text-sm flex-1 text-left">{selectedStyle.name}</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Select a style...</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" align="start">
            {backgroundStyles.length > 0 ? (
              backgroundStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    onGlobalStyleChange(style.id)
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors",
                    globalStyleId === style.id && "bg-primary/10 text-primary",
                  )}
                >
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: style.backgroundColor }}
                  />
                  {style.name}
                </button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground p-2">No background styles defined</p>
            )}
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background hover:bg-muted/50 transition-colors">
              <div className="w-5 h-5 rounded border border-border" style={{ backgroundColor: color }} />
              <span className="text-sm font-mono flex-1 text-left">{color}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              <div className="grid grid-cols-8 gap-1">
                {[
                  "#ef4444",
                  "#f97316",
                  "#f59e0b",
                  "#eab308",
                  "#84cc16",
                  "#22c55e",
                  "#10b981",
                  "#14b8a6",
                  "#06b6d4",
                  "#0ea5e9",
                  "#3b82f6",
                  "#6366f1",
                  "#8b5cf6",
                  "#a855f7",
                  "#d946ef",
                  "#ec4899",
                  "#f43f5e",
                  "#64748b",
                  "#78716c",
                  "#71717a",
                  "#737373",
                  "#525252",
                  "#404040",
                  "#262626",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onColorChange(c)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-6 h-6 rounded border transition-all hover:scale-110",
                      color === c ? "ring-2 ring-primary ring-offset-1" : "border-border",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="h-8 text-sm font-mono"
                  placeholder="#000000"
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export function DefaultChartColorsConfig({
  defaultColors,
  onDefaultColorsChange,
  globalStyles,
}: DefaultChartColorsConfigProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Default Chart Colors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div
              className="w-4 h-4 rounded-full border-2 border-background"
              style={{ backgroundColor: defaultColors.primary }}
            />
            <div
              className="w-4 h-4 rounded-full border-2 border-background"
              style={{ backgroundColor: defaultColors.secondary }}
            />
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-3 space-y-4">
          {/* Preset Palettes */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick Presets</Label>
            <div className="grid grid-cols-4 gap-2">
              {presetPalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() =>
                    onDefaultColorsChange({
                      ...defaultColors,
                      primary: palette.primary,
                      secondary: palette.secondary,
                      useGlobalPrimary: false,
                      useGlobalSecondary: false,
                    })
                  }
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all hover:border-primary/50",
                    defaultColors.primary === palette.primary &&
                      defaultColors.secondary === palette.secondary &&
                      !defaultColors.useGlobalPrimary
                      ? "border-primary bg-primary/5"
                      : "border-border",
                  )}
                >
                  <div className="flex -space-x-1">
                    <div
                      className="w-4 h-4 rounded-full border border-background"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-background"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <ColorSourceSelector
              label="Primary Color"
              color={defaultColors.primary}
              useGlobal={defaultColors.useGlobalPrimary ?? false}
              globalStyleId={defaultColors.primaryStyleId}
              globalStyles={globalStyles}
              onColorChange={(color) => onDefaultColorsChange({ ...defaultColors, primary: color })}
              onGlobalStyleChange={(styleId) => {
                const style = globalStyles.find((s) => s.id === styleId)
                onDefaultColorsChange({
                  ...defaultColors,
                  primaryStyleId: styleId,
                  primary: style?.backgroundColor || defaultColors.primary,
                })
              }}
              onToggleGlobal={(useGlobal) => onDefaultColorsChange({ ...defaultColors, useGlobalPrimary: useGlobal })}
            />
            <ColorSourceSelector
              label="Secondary Color"
              color={defaultColors.secondary}
              useGlobal={defaultColors.useGlobalSecondary ?? false}
              globalStyleId={defaultColors.secondaryStyleId}
              globalStyles={globalStyles}
              onColorChange={(color) => onDefaultColorsChange({ ...defaultColors, secondary: color })}
              onGlobalStyleChange={(styleId) => {
                const style = globalStyles.find((s) => s.id === styleId)
                onDefaultColorsChange({
                  ...defaultColors,
                  secondaryStyleId: styleId,
                  secondary: style?.backgroundColor || defaultColors.secondary,
                })
              }}
              onToggleGlobal={(useGlobal) => onDefaultColorsChange({ ...defaultColors, useGlobalSecondary: useGlobal })}
            />
          </div>

          {/* Preview */}
          <div className="bg-muted/30 rounded-lg p-3">
            <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
            <div className="flex items-end justify-center gap-2 h-16">
              <div className="w-8 rounded-t" style={{ backgroundColor: defaultColors.primary, height: "60%" }} />
              <div className="w-8 rounded-t" style={{ backgroundColor: defaultColors.secondary, height: "80%" }} />
              <div className="w-8 rounded-t" style={{ backgroundColor: defaultColors.primary, height: "45%" }} />
              <div className="w-8 rounded-t" style={{ backgroundColor: defaultColors.secondary, height: "70%" }} />
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground">
            These are the default colors for all charts. Individual charts can override these in their settings.
          </p>
        </div>
      )}
    </div>
  )
}

// ... existing code for ChartColorOverride ...
export function ChartColorOverride({
  colors,
  defaultColors,
  useDefault,
  colorCount,
  onChange,
  onToggleDefault,
}: {
  colors?: ChartColorsConfig
  defaultColors: ChartColorsConfig
  useDefault: boolean
  colorCount: 1 | 2
  onChange: (colors: ChartColorsConfig) => void
  onToggleDefault: (useDefault: boolean) => void
}) {
  const activeColors = useDefault ? defaultColors : colors || defaultColors

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Chart Colors</Label>
        <button
          onClick={() => onToggleDefault(!useDefault)}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors",
            useDefault ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          {useDefault ? (
            <>
              <Palette className="h-3 w-3" />
              Using Default
            </>
          ) : (
            <>
              <RotateCcw className="h-3 w-3" />
              Reset to Default
            </>
          )}
        </button>
      </div>

      {!useDefault && (
        <div className={cn("grid gap-3", colorCount === 2 ? "grid-cols-2" : "grid-cols-1")}>
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground">Primary</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center gap-2 h-8 px-2 rounded border border-input bg-background hover:bg-muted/50">
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: activeColors.primary }}
                  />
                  <span className="text-xs font-mono">{activeColors.primary}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="start">
                <div className="grid grid-cols-6 gap-1">
                  {[
                    "#ef4444",
                    "#f97316",
                    "#eab308",
                    "#22c55e",
                    "#06b6d4",
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                    "#64748b",
                    "#262626",
                    "#0ea5e9",
                    "#14b8a6",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => onChange({ ...activeColors, primary: color })}
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {colorCount === 2 && (
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground">Secondary</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center gap-2 h-8 px-2 rounded border border-input bg-background hover:bg-muted/50">
                    <div
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: activeColors.secondary }}
                    />
                    <span className="text-xs font-mono">{activeColors.secondary}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="grid grid-cols-6 gap-1">
                    {[
                      "#ef4444",
                      "#f97316",
                      "#eab308",
                      "#22c55e",
                      "#06b6d4",
                      "#3b82f6",
                      "#8b5cf6",
                      "#ec4899",
                      "#64748b",
                      "#262626",
                      "#0ea5e9",
                      "#14b8a6",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => onChange({ ...activeColors, secondary: color })}
                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}

      {useDefault && (
        <div className="flex items-center gap-2 py-2 px-3 bg-muted/30 rounded-lg">
          <div className="flex -space-x-1">
            <div
              className="w-5 h-5 rounded-full border-2 border-background"
              style={{ backgroundColor: defaultColors.primary }}
            />
            {colorCount === 2 && (
              <div
                className="w-5 h-5 rounded-full border-2 border-background"
                style={{ backgroundColor: defaultColors.secondary }}
              />
            )}
          </div>
          <span className="text-xs text-muted-foreground">Using default palette</span>
        </div>
      )}
    </div>
  )
}
